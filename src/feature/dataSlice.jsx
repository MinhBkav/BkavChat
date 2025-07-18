import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
const initialState  ={
    chatData : [],
    userOnline : [],
  currentuserid : 0,
  changeuser: true,
  openSidebar : false,
  isLoading : null,
  error : null,
  inputMessage : '',
  checkScroll : false,
  checkrepair : false
}
export const getListUser = createAsyncThunk('user/getUser', async (_) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get('http://30.30.30.12:8080/api/message/list-friend', {
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

const dataSlice =createSlice(
    {
        name : 'data',
        initialState,
        reducers:
        {   
            addMessageData : (state,action) =>
            {
                const message = action.payload;
                state.chatData[message.userid-1].messages.push(message.message)// Can tối ưu hiệu suất ở phần này: đang truy cập phần tử theo index,nếu id không theo thứ tự dẫn đên sai user-> cần sửa lại cấu trúc dữ liệu mảng đê lấy user theo id hoặc phải lọc theo id
            },
             setid : (state,action) =>
            {
                const id = action.payload;
                state.currentuserid = id
            }, 
            setOpenSidebar : (state,action) =>
            {
              state.openSidebar = action.payload
            },
            setInputMessage : (state,action) =>
            {
              state.inputMessage = action.payload;
            },
            setCheckScroll : (state,action) => 
            {
              state.checkScroll = action.payload;
            },
             setCheckRepair : (state,action) => 
            {
              state.checkrepair = action.payload;
            },
            setUserOnline : (state,action) =>
            {
              state.userOnline = action.payload;
            }
        },
        extraReducers :(builder)=>{
            builder
            .addCase(getListUser.pending,(state) => {
                state.isLoading = true;
                state.error = false;
            })
            .addCase(getListUser.fulfilled,(state,action)=>{
                state.isLoading = false;
                state.error = false;
                state.chatData = action.payload;
            })
            .addCase(getListUser.rejected,(state)=>{
                state.isLoading = false;
                state.error = true;
           })
        }
    },
)
export const {addMessageData,setid,setOpenSidebar,setInputMessage,setCheckScroll,setUserOnline,setCheckRepair} = dataSlice.actions;
export default dataSlice.reducer; 
