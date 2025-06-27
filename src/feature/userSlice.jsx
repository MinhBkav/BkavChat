import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
const initialState  ={
    userChat : {},
  dataChat :[],
  currentuserid : 0,
  isLoading : null,
  error : null,

}
export const getdataChat = createAsyncThunk('user/getdataChat', async (FriendID) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(`http://30.30.30.12:8888/api/message/get-message?FriendID=${FriendID}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(FriendID);
    return res.data.data
  } catch (error) {
            console.error(error);
            throw error;
        }
});
export const sendMessage = createAsyncThunk(
  'user/sendMessage',
  async ({ FriendID, Content, file }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("FriendID", FriendID);
      formData.append("Content", Content);

      // Thêm tất cả file nếu có
      if (file && file.length) {
        file.forEach(f => formData.append("files", f));
      }

      const response = await axios.post(
        "http://30.30.30.12:8888/api/message/send-message",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Send message error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const isRead = createAsyncThunk('user/isRead', async ({FriendID,CreatedAt}) => {//chua xu ly cac su kien peding,reject,...
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(`http://30.30.30.12:8888/api/message/get-message?FriendID=${FriendID}&LastTime=${CreatedAt}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(FriendID);
    return res.data.data
  } catch (error) {
            console.error(error);
            throw error;
        }
});
const userSlice =createSlice(
    {
        name : 'user',
        initialState,
        reducers:
        {   
            sUser : (state,action) =>
            {
                const user = action.payload;
                state.userChat = user;
            },
            addMessage : (state,action) =>
            {
                const message = action.payload;
                state.dataChat.push(message)
            },
            setid : (state,action) =>
            {
                const id = action.payload;
                state.currentuserid = id
            }
        },
        extraReducers :(builder)=>{
            builder
            .addCase(getdataChat.pending,(state) => {
                state.isLoading = true;
                state.error = false;
            })
            .addCase(getdataChat.fulfilled,(state,action)=>{
                state.isLoading = false;
                state.error = false;
                state.dataChat = action.payload;
            })
            .addCase(getdataChat.rejected,(state)=>{
                state.isLoading = false;
                state.error = true;
            })
        }
    },
)
export const {sUser,addMessage,setid} = userSlice.actions;
export default userSlice.reducer; 
