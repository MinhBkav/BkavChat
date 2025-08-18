import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import { socket } from "../../socket";
const initialState = {
  userChat: {},
  roomChat:{},
  dataChat: [],
  currentuserid: 0,
  isLoading: null,
  error: null,
  messageId: null,
  messagereplyId : null,
  whmessMain : {},
  messagechose  : {}

}
export const getdataChat = (id,before,type) => (dispatch) => {
  console.log( "get ìnoooooooo",id ,before ,type);
  if(type == 0)
  socket.emit("load_history", { friendId: id, before, limit: 30 });
  else
    socket.emit("load_history", { roomId: id, before, limit: 30 });
  socket.once("chat_history", (data) => {
    if (before) {
      dispatch(prependMessages(data)); // Nối lên trên đầu
    } else {
      dispatch(setDataChat(data)); // Lần đầu load thì set mới hoàn toàn
    }

  });
};
export const deleteMessage = (messageId) => async (dispatch) => {
  return new Promise((resolve, reject) => {
    socket.emit("delete_message", { messageId });

    socket.once("message_deleted", ({ messageId }) => {
      dispatch(updateDeletedMessage(messageId));
      resolve(messageId);
    });

    setTimeout(() => {
      reject("Timeout khi xóa tin nhắn");
    }, 5000);
  });
};
export const repairMessage = (messageId, Content) => async (dispatch) => {
  console.log(messageId)
  return new Promise((resolve, reject) => {
    socket.emit("repair_message", { messageId, Content });

    socket.once("message_repaired", ({ messageId, Content }) => {
      dispatch(updateRepairMessage({ messageId: messageId, Content: Content }));
      resolve(messageId);
    });

    setTimeout(() => {
      reject("Timeout khi xóa tin nhắn");
    }, 5000);
  });
};
export const EmotionMessage = (messageId, emotion) => async (dispatch) => {
  console.log(messageId)
  return new Promise((resolve, reject) => {
    socket.emit("emotion_message", { messageId, emotion });

    socket.once("message_emotion", ({ messageId, emotion }) => {
      dispatch(updateEmotionMessage({ messageId: messageId, emotion: emotion }));
      console.log(emotion);
      resolve(messageId);
    });

    setTimeout(() => {
      reject("Timeout khi xóa tin nhắn");
    }, 5000);
  });
};

export const sendMessage = createAsyncThunk(
  'user/sendMessage',
  async ({ InfoChat, Content, file,messagereplyId,whmessMain }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      let images = [];
      let files = [];
      const api = axios.create({
        baseURL: "http://localhost:8080",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(file)
      // Upload nếu có file
      if (file.length > 0 && file) {
        const imageFormData = new FormData();
        const fileFormData = new FormData();

        // Tách file và ảnh vào 2 FormData khác nhau
        file.forEach(f => {
          if (f.type.startsWith("image/")) {
            imageFormData.append("files", f);
          } else {
            fileFormData.append("files", f);
          }
        });

        // Upload ảnh nếu có
        if (imageFormData.has("files")) {
          const uploadImageRes = await api.post("/api/upload/upload-image", imageFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });

          const uploadedImages = uploadImageRes.data.data;
          uploadedImages.forEach(item => {
            images.push({
              urlImage: item.url,
              FileName: item.fileName
            });
          });
        }

        // Upload file nếu có
        if (fileFormData.has("files")) {
          const uploadFileRes = await api.post("/api/upload/upload-file", fileFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });

          const uploadedFiles = uploadFileRes.data.data;
          uploadedFiles.forEach(item => {
            files.push({
              urlFile: item.url,
              FileName: item.fileName
            });
          });
        }
      }

      // Gửi socket
      console.log(messagereplyId)
      return await new Promise((resolve, reject) => {
        socket.emit("send_message", {
          toUserId: InfoChat.FriendID,
          roomId: InfoChat._id,
          content: Content,
          images,
          files,
          messagereplyId,
          whmessMain
        });

        socket.once("message_sent", (msg) => {
          resolve(msg);
          console.log(msg);
          dispatch(addMessage(msg))
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

    const res = await axios.get(`http://30.30.30.12:8080/api/message/get-message?FriendID=${FriendID}`, {
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
      sRoom : (state, action) => {
        const user = action.payload;
        state.roomChat = user;
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
      updateDeletedMessage: (state, action) => {
        const { messageId, Content } = action.payload;
        console.log(messageId)
        const msg = state.dataChat.find(m => m.id === messageId);
        console.log(msg)
        if (msg) {
          console.log("da xoa")
          msg.Content = Content || "[Tin nhắn đã thu hồi]";
          msg.Files = [];
          msg.Images = [];
          msg.Emotion = null;
          msg.isDelete = true; // nếu bạn dùng để flag riêng
        }
      },
      updateRepairMessage: (state, action) => {
        const { messageId, Content } = action.payload;
        console.log(messageId)
        const msg = state.dataChat.find(m => m.id === messageId);
        console.log(msg)
        if (msg) {
          console.log("da sua")
          msg.Content = Content || "[Tin nhắn đã thu hồi]";
        }
      },
      updateEmotionMessage: (state, action) => {
        const { messageId, emotion } = action.payload;

        console.log(messageId)
        const msg = state.dataChat.find(m => m.id === messageId);
        console.log(msg)
        if (msg) {
          console.log("da sua")
          console.log(msg.Emotion)
          msg.Emotion = emotion ;
          console.log(msg.Emotion)
        }
      },
      setMessageId: (state, action) => {
        state.messageId = action.payload
      },
      setMessageReply : (state,action) =>{
       const {id,whmessMain} = action.payload;
        state.messagereplyId = id;
        state.whmessMain = whmessMain;

      },
      setMessagechose : (state, action) => {
        console.log(action.payload);
        state.messagechose = action.payload;
      }

    },
    // extraReducers :(builder)=>{s
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
export const {sRoom,setMessagechose,updateRepairMessage,updateEmotionMessage, sUser, addMessage, setid, setDataChat, prependMessages, updateDeletedMessage, setMessageId ,setMessageReply} = userSlice.actions;
export default userSlice.reducer; 
