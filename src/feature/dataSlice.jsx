import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
const initialState  ={
    chatData : [
  {
    id: 1,
    name: "Elon Musk",
    avatar: "https://i.pravatar.cc/150?img=1",
     messages: [
      { sender: "them", text: "Chào bạn, tôi là Elon Musk",id:1, time: "01:20 AM", image:"./images/Apple.png" },
      { sender: "them", text: "Chào bạn, tôi là Elon Musk",id:2 ,time:"02:28 AM",},
      { sender: "me", text: "Ồ, xin chào anh Elon!",id:6,time : "16:28 AM", },
      { sender: "them", text: "Bạn có hứng thú với Mars không  Khong khong khong khong khong khong khong khong ",id:2, time: "20:02 PM", },
      { sender: "me", text: "Có chứ, tôi thích không ",id:3,time: "21:02 PM", }
    ]
  },
  {
    id: 2,
    name: "Wonder Woman",
    avatar: "https://i.pravatar.cc/150?img=5",
    messages: [
      { sender: "them", text: "Bạn có khoẻ không?" },
      { sender: "me", text: "Tôi khoẻ, cảm ơn bạn!" },
      { sender: "them", text: "Bạn có muốn ra ngoài chiến đấu không?" }
    ]
  },
  {
    id: 3,
    name: "Elon Musk",
    avatar: "https://i.pravatar.cc/150?img=1",
    messages: [
      { sender: "them", text: "Chào bạn, tôi là Elon Musk" },
      { sender: "me", text: "Ồ, xin chào anh Elon!" },
      { sender: "them", text: "Bạn có hứng thú với Mars không?" },
      { sender: "me", text: "Có chứ, tôi thích không gian vũ trụ!" }
    ]
  },
  {
    id: 4,
    name: "Elon Musk",
    avatar: "https://i.pravatar.cc/150?img=1",
    messages: [
      { sender: "them", text: "Chào bạn, tôi là Elon Musk" },
      { sender: "me", text: "Ồ, xin chào anh Elon!" },
      { sender: "them", text: "Bạn có hứng thú với Mars không?" },
      { sender: "me", text: "Có chứ, tôi thích không gian vũ trụ!" }
    ]
  },
  {
    id: 5,
    name: "Elon Musk",
    avatar: "https://i.pravatar.cc/150?img=1",
    messages: [
      { sender: "them", text: "Chào bạn, tôi là Elon Musk" },
      { sender: "me", text: "Ồ, xin chào anh Elon!" },
      { sender: "them", text: "Bạn có hứng thú với Mars không?" },
      { sender: "me", text: "Có chứ, tôi thích không gian vũ trụ!" }
    ]
  },
  {
    id: 6,
    name: "Elon Musk",
    avatar: "https://i.pravatar.cc/150?img=1",
    messages: [
      { sender: "them", text: "Chào bạn, tôi là Elon Musk",id:1 ,time:"02:28 AM",},
      { sender: "me", text: "Ồ, xin chào anh Elon!",id:6,time : "16:28 AM", },
      { sender: "them", text: "Bạn có hứng thú với Mars không?",id:2, time: "20:02 PM", },
      { sender: "me", text: "Có chứ, tôi thích không gian vũ trụ!",id:3,time: "21:02 PM", }
    ]
  },
  {
    id: 7,
    name: "Elon Musk",
    avatar: "https://i.pravatar.cc/150?img=1",
    messages: [
      { sender: "them", text: "Chào bạn, tôi là Elon Musk" },
      { sender: "me", text: "Ồ, xin chào anh Elon!" },
      { sender: "them", text: "Bạn có hứng thú với Mars không?" },
      { sender: "me", text: "Có chứ, tôi thích không gian vũ trụ!" }
    ]
  },
  {
    id: 8,
    name: "Elon Musk",
    avatar: "https://i.pravatar.cc/150?img=1",
    messages: [
      { sender: "them", text: "Chào bạn, tôi là Elon Musk" },
      { sender: "me", text: ", xin chào anh Elon!" },
      { sender: "them", text: "Bạn có hứng thú với Mars không?" },
      { sender: "me", text: " chứ, tôi thích không gian vũ trụ!" }
    ]
  },
  // {
  //   id: 9,
  //   name: "Elon Musk",
  //   avatar: "https://i.pravatar.cc/150?img=1",
  //   messages: [
  //     { sender: "them", text: "Chào bạn, tôi là Elon Musk" },
  //     { sender: "me", text: "Ồ, xin chào anh Elon!" },
  //     { sender: "them", text: "Bạn có hứng thú với Mars không?" },
  //     { sender: "me", text: "Có chứ, tôi thích không gian vũ trụ!" }
  //   ]
  // },
  // {
  //   id: 10,
  //   name: "Elon Musk",
  //   avatar: "https://i.pravatar.cc/150?img=1",
  //   messages: [
  //     { sender: "them", text: "Chào bạn, tôi là Elon Musk" },
  //     { sender: "me", text: "Ồ, xin chào anh Elon!" },
  //     { sender: "them", text: "Bạn có hứng thú với Mars không?" },
  //     { sender: "me", text: "Có chứ, tôi thích không gian vũ trụ!" }
  //   ]
  // },{
  //   id: 11,
  //   name: "Elon Musk",
  //   avatar: "https://i.pravatar.cc/150?img=1",
  //   messages: [
  //     { sender: "them", text: "Chào bạn, tôi là Elon Musk" },
  //     { sender: "me", text: "Ồ, xin chào anh Elon!" },
  //     { sender: "them", text: "Bạn có hứng thú với Mars không?" },
  //     { sender: "me", text: "Có chứ, tôi thích không gian vũ trụ!" }
  //   ]
  // },{
  //   id: 12,
  //   name: "Elon Musk",
  //   avatar: "https://i.pravatar.cc/150?img=1",
  //   messages: [
  //     { sender: "them", text: "Chào bạn, tôi là Elon Musk" },
  //     { sender: "me", text: "Ồ, xin chào anh Elon!" },
  //     { sender: "them", text: "Bạn có hứng thú với Mars không?" },
  //     { sender: "me", text: "Có chứ, tôi thích không gian vũ trụ!" }
  //   ]
  // },{
  //   id: 13,
  //   name: "Elon Musk",
  //   avatar: "https://i.pravatar.cc/150?img=1",
  //   messages: [
  //     { sender: "them", text: "Chào bạn, tôi là Elon Musk" },
  //     { sender: "me", text: "Ồ, xin chào anh Elon!" },
  //     { sender: "them", text: "Bạn có hứng thú với Mars không?" },
  //     { sender: "me", text: "Có chứ, tôi thích không gian vũ trụ!" }
  //   ]
  // },{
  //   id: 14,
  //   name: "Elon Musk",
  //   avatar: "https://i.pravatar.cc/150?img=1",
  //   messages: [
  //     { sender: "them", text: "Chào bạn, tôi là Elon Musk" },
  //     { sender: "me", text: "Ồ, xin chào anh Elon!" },
  //     { sender: "them", text: "Bạn có hứng thú với Mars không?" },
  //     { sender: "me", text: "Có chứ, tôi thích không gian vũ trụ!" }
  //   ]
  // },{
  //   id: 15,
  //   name: "Elon Musk",
  //   avatar: "https://i.pravatar.cc/150?img=1",
  //   messages: [
  //     { sender: "them", text: "Chào bạn, tôi là Elon Musk" },
  //     { sender: "me", text: "Ồ, xin chào anh Elon!" },
  //     { sender: "them", text: "Bạn có hứng thú với Mars không?" },
  //     { sender: "me", text: "Có chứ, tôi thích không gian vũ trụ!" }
  //   ]
  // },{
  //   id: 16,
  //   name: "Elon Musk",
  //   avatar: "https://i.pravatar.cc/150?img=1",
  //   messages: [
  //     { sender: "them", text: "Chào bạn, tôi là Elon Musk" },
  //     { sender: "me", text: "Ồ, xin chào anh Elon!" },
  //     { sender: "them", text: "Bạn có hứng thú với Mars không?" },
  //     { sender: "me", text: "Có chứ, tôi thích không gian vũ trụ!" }
  //   ]
  // },{
  //   id: 17,
  //   name: "Elon Musk",
  //   avatar: "https://i.pravatar.cc/150?img=1",
  //   messages: [
  //     { sender: "them", text: "Chào bạn, tôi là Elon Musk" },
  //     { sender: "me", text: "Ồ, xin chào anh Elon!" },
  //     { sender: "them", text: "Bạn có hứng thú với Mars không?" },
  //     { sender: "me", text: "Có chứ, tôi thích không gian vũ trụ!" }
  //   ]
  // },{
  //   id: 18,
  //   name: "Elon Musk",
  //   avatar: "https://i.pravatar.cc/150?img=1",
  //   messages: [
  //     { sender: "them", text: "Chào bạn, tôi là Elon Musk" },
  //     { sender: "me", text: "Ồ, xin chào anh Elon!" },
  //     { sender: "them", text: "Bạn có hứng thú với Mars không?" },
  //     { sender: "me", text: "Có chứ, tôi thích không gian vũ trụ!" }
  //   ]
  // },
],
  currentuserid : 0,
  changeuser: true

}
// export const login = createAsyncThunk('auth/login', async(user)=>{
//         try {
//             const res = await axios.post('https://fe253d2d-1309-43a4-8ee6-250f4a9781f0.mock.pstmn.io/Login',user)
//             const data = await res.data;
//             localStorage.setItem("token", data.acess);
//         } catch (error) {
//             console.error(error);
//         }
//    }
//  )
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
export const {addMessageData,setid} = dataSlice.actions;
export default dataSlice.reducer; 
