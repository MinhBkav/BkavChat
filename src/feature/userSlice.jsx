import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import { socket } from "../../socket";
const initialState = {
  userChat: {},
  dataChat: [],
  currentuserid: 0,
  isLoading: null,
  error: null,

}
export const getdataChat = (FriendID,before) => (dispatch) => {
  socket.emit("load_history", { friendId: FriendID, before, limit: 20 });
  socket.once("chat_history", (data) => {
   if (before) {
      dispatch(prependMessages(data)); // Nối lên trên đầu
    } else {
      dispatch(setDataChat(data)); // Lần đầu load thì set mới hoàn toàn
    }

  });
};
export const sendMessage = createAsyncThunk(
  'user/sendMessage',
  async ({ FriendID, Content, file }, {dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      let images = [];
      let files = [];
       const api = axios.create({
        baseURL: "http://localhost:9999", // ⚠️ sửa lại theo IP nếu dùng LAN
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Upload nếu có file
      if (file && file.length) {
        const formData = new FormData();
        file.forEach(f => formData.append("files", f));

        const isImage = file[0].type.startsWith("image/");

        const uploadEndpoint = isImage
          ? "/api/upload/upload-image"
          : "/api/upload/upload-file";

        const uploadRes = await api.post(
          uploadEndpoint,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        const uploaded = uploadRes.data.data;

        if (isImage) {
          images.push({
            urlImage: uploaded.url,
            FileName: uploaded.fileName
          });
        } else {
          files.push({
            urlFile: uploaded.url,
            FileName: uploaded.fileName
          });
        }
      }
      dispatch(addMessage({
      Content: Content,
      Files: files,
      Images: images, // Xử lý hình riêng nếu cần
      isSend: 1,
      CreatedAt: new Date().toISOString(),
      MessageType: 1
    }))
      // Gửi socket
      return await new Promise((resolve, reject) => {
        socket.emit("send_message", {
          toUserId: FriendID,
          content: Content,
          images,
          files
        });

        socket.once("message_sent", (msg) => {
          resolve(msg);
          console.log(msg)
        });

        // Timeout fallback (phòng lỗi socket treo)
        setTimeout(() => {
          reject("Socket timeout");
        }, 5000);
      });

    } catch (error) {
      console.error("Send message error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const isRead = createAsyncThunk('user/isRead', async ({ FriendID, CreatedAt }) => {//chua xu ly cac su kien peding,reject,...
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(`http://30.30.30.12:9999/api/message/get-message?FriendID=${FriendID}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data.data
  } catch (error) {
    console.error(error);
    throw error;
  }
});
const userSlice = createSlice(
  {
    name: 'user',
    initialState,
    reducers:
    {
      sUser: (state, action) => {
        const user = action.payload;
        state.userChat = user;
      },
      addMessage: (state, action) => {
        const message = action.payload;
        state.dataChat.push(message)
      },
      setid: (state, action) => {
        const id = action.payload;
        state.currentuserid = id
      },
      setDataChat: (state, action) => {
        state.dataChat = action.payload;
        console.log(action.payload)
      },
        prependMessages: (state, action) => {
      state.dataChat = [...action.payload, ...state.dataChat];
    },

    },
    // extraReducers :(builder)=>{
    //     builder
    //     .addCase(getdataChat.pending,(state) => {
    //         state.isLoading = true;
    //         state.error = false;
    //     })
    //     .addCase(getdataChat.fulfilled,(state,action)=>{
    //         state.isLoading = false;
    //         state.error = false;
    //         state.dataChat = action.payload;
    //     })
    //     .addCase(getdataChat.rejected,(state)=>{
    //         state.isLoading = false;
    //         state.error = true;
    //     })
    // }
  },
)
export const { sUser, addMessage, setid,setDataChat,prependMessages } = userSlice.actions;
export default userSlice.reducer; 
