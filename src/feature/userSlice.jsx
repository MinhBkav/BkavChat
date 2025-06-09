import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
const initialState  ={
    userChat : {
    id: 1,
    name: "Llon Musk",
    avatar: "https://i.pravatar.cc/150?img=1",
     messages: [
      { sender: "them", text: "Chào bạn, tôi là Elon Musk",id:1, time: "01:20 AM", image:"./images/Apple.png" },
      { sender: "them", text: "Chào bạn, tôi là Elon Musk",id:1 ,time:"02:28 AM",},
      { sender: "me", text: "Ồ, xin chào anh Elon!",id:6,time : "16:28 AM", },
      { sender: "them", text: "Bạn có hứng thú với Mars không  Khong khong khong khong khong khong khong khong ?",id:2, time: "20:02 PM", },
      { sender: "me", text: "Có chứ, tôi thích không gian vũ trụ!",id:3,time: "21:02 PM", }
    ]
  },
  currentuserid : 0
}
export const login = createAsyncThunk('auth/login', async(user)=>{
        try {
            const res = await axios.post('https://fe253d2d-1309-43a4-8ee6-250f4a9781f0.mock.pstmn.io/Login',user)
            const data = await res.data;
            localStorage.setItem("token", data.acess);
        } catch (error) {
            console.error(error);
        }
   }
 )
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
                state.userChat.messages.push(message)
            },
            setid : (state,action) =>
            {
                const id = action.payload;
                state.currentuserid = id
            }
        },
        // extraReducers :(builder)=>{
        //     builder
        //     .addCase(login.pending,(state) => {
        //         state.isLoading = true;
        //         state.error = false;
        //         state.isLogin = false;
        //     })
        //     .addCase(login.fulfilled,(state)=>{
        //         state.isLoading = false;
        //         state.error = false;
        //         state.isLogin = true;
        //     })
        //     .addCase(login.rejected,(state)=>{
        //         state.isLoading = false;
        //         state.error = true;
        //         state.isLogin = false;
        //     })
        // }
    },
)
export const {sUser,addMessage,setid} = userSlice.actions;
export default userSlice.reducer; 
