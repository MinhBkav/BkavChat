import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
const initialState  ={
    dataSreach: [  {
    id: 1,
    read : false,
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
  {
    read : false,
    id: 2,
    name: "Londer Woman",
    avatar: "https://i.pravatar.cc/150?img=5",
    messages: [
      { sender: "them", text: "Bạn có khoẻ không?" },
      { sender: "me", text: "Tôi khoẻ, cảm ơn bạn!" },
      { sender: "them", text: "Bạn có muốn ra ngoài chiến đấu không?" }
    ]
  },
  {
    read : false,
    id: 3,
    name: "Linh Musk",
    avatar: "https://i.pravatar.cc/150?img=1",
    messages: [
      { sender: "them", text: "Chào bạn, tôi là Elon Musk" },
      { sender: "me", text: "Ồ, xin chào anh Elon!" },
      { sender: "them", text: "Bạn có hứng thú với Mars không?" },
      { sender: "me", text: "Có chứ, tôi thích không gian vũ trụ!" }
    ]
  },
],
    inputSreach : ''
}
export const sreach = createAsyncThunk('auth/sreach', async()=>{
        try {
            const res = await axios.post('https://fe253d2d-1309-43a4-8ee6-250f4a9781f0.mock.pstmn.io/Sreach')
            const data = await res.data;
            initialState.dataSreach = data;
        } catch (error) {
            console.error(error);
        }
   }
 )
const sreachSlice =createSlice(
    {
        name : 'sreach',
        initialState,
        reducers:
        {   
            sUser : (state,action) =>
            {
                const data = action.payload;
                state.dataSreach = data;
            },
            sInputsreach :(state,action) =>
            {
                const data = action.payload;
                state.inputSreach = data;
            }
        },
        // extraReducers :(builder)=>{
        //     builder
        //     .addCase(sreach.pending,(state) => {
        //         state.isLoading = true;
        //         state.error = false;
        //     })
        //     .addCase(sreach.fulfilled,(state)=>{
        //         state.isLoading = false;
        //         state.error = false;
        //     })
        //     .addCase(sreach.rejected,(state)=>{
        //         state.isLoading = false;
        //         state.error = true;
        //     })
        // }
    },
)
export const {sUser,sInputsreach} = sreachSlice.actions;
export default sreachSlice.reducer; 
