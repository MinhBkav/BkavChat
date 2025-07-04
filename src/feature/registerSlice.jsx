import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { signUpWithFirebase } from "../Component/Register/registerFirebase";
import axios from 'axios'
const initialState  ={
    username : '',
    email:'',
    isLoading : null,
    error : null,
}
// export const register = createAsyncThunk('auth/register', async(user)=>{
//         try {
//             const res = await axios.post('http://10.2.44.103:9999/api/auth/register',user)
//             const data = await res.data;
//             localStorage.setItem("token", data.data.token);
//         } catch (error) {
//             console.error(error);
//         }
//    }
//  )
export const register = createAsyncThunk('auth/register', async (user) => {
    try {
        // 🔐 1. Đăng nhập với Firebase
        const idToken = await signUpWithFirebase(user.email, user.Password)

        // ✅ 2. Gửi idToken về backend
        const res = await axios.post('http://30.30.30.12:9999/api/auth/register/', {
            idToken: idToken,
            Username: user.Username, 
        })

        const data = res.data

        // 💾 3. Lưu JWT nội bộ (nếu backend trả về)
        if (data?.data?.token) {
            localStorage.setItem('token', data.data.token)
        }

        return data.data
    } catch (error) {
        console.error('Login error:', error)
        throw error
    }
})
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
            },
            resetRegister : (state) =>
            {
                state.isLoading = null;
                state.error = null;
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
export const {sUser,resetRegister} = registerSlice.actions;
export default registerSlice.reducer; 
