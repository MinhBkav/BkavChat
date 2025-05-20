import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
const initialState  ={
    username : '',
    email:'',
    isLoading : null,
    error : null,
    isLogin : null
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
const loginSlice =createSlice(
    {
        name : 'login',
        initialState,
        reducers:
        {   
            sUser : (state,action) =>
            {
                const user = action.payload;
                state.username = user.username;
                state.email = user.email;
            }
        },
        extraReducers :(builder)=>{
            builder
            .addCase(login.pending,(state) => {
                state.isLoading = true;
                state.error = false;
                state.isLogin = false;
            })
            .addCase(login.fulfilled,(state)=>{
                state.isLoading = false;
                state.error = false;
                state.isLogin = true;
            })
            .addCase(login.rejected,(state)=>{
                state.isLoading = false;
                state.error = true;
                state.isLogin = false;
            })
        }
    },
)
export const {sUser} = loginSlice.actions;
export default loginSlice.reducer; 
