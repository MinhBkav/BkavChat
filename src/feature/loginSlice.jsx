import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
const initialState  ={
    Username : '',
    isLoading : null,
    error : null,
    isLogin : null
}
export const login = createAsyncThunk('auth/login', async(user)=>{
        try {
            const res = await axios.post('http://10.2.44.103:8888/api/auth/login/',user)
            const data = await res.data;
            localStorage.setItem("token", data.data.token);
        } catch (error) {
            console.error(error);
            throw error;
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
                state.Username = user.Username;
            },
            logout : (state) => 
            {
                state.isLogin = null;
                state.isLoading = null;
                state.isLogin = null;
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
export const {sUser,logout} = loginSlice.actions;
export default loginSlice.reducer; 
