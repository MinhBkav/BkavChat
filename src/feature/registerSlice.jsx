import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
const initialState  ={
    username : '',
    email:'',
    isLoading : null,
    error : null,
}
export const register = createAsyncThunk('auth/register', async(user)=>{
        try {
            const res = await axios.post('https://fe253d2d-1309-43a4-8ee6-250f4a9781f0.mock.pstmn.io/Login',user)
            const data = await res.data;
            localStorage.setItem("token", data.acess);
        } catch (error) {
            console.error(error);
        }
   }
 )
const registerSlice =createSlice(
    {
        name : 'register',
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
            .addCase(register.pending,(state) => {
                state.isLoading = true;
                state.error = false;
            })
            .addCase(register.fulfilled,(state)=>{
                state.isLoading = false;
                state.error = false;
            })
            .addCase(register.rejected,(state)=>{
                state.isLoading = false;
                state.error = true;
            })
        }
    },
)
export const {sUser} = registerSlice.actions;
export default registerSlice.reducer; 
