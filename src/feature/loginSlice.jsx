// import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
// import axios from 'axios'
// import { loginWithFirebase } from "../Component/Login/loginFirebase";
// const initialState  = {
//     Username : '',
//     isLoading : null,
//     error : null,
//     isLogin : null,
//     me : {}
// }
// export const loginWithSocial = createAsyncThunk('auth/loginSocial', async (idToken) => {
//   const res = await axios.post('http://30.30.30.12:8080/api/auth/loginsocial/', {
//     idToken: idToken
//   });
//   const data = res.data;

//   if (data?.data?.token) {
//     localStorage.setItem("token", data.data.token);
//   }

//   return data.data;
// });
// export const login = createAsyncThunk('auth/login', async (user) => {
//     try {
//         // 🔐 1. Đăng nhập với Firebase
//         const idToken = await loginWithFirebase(user.Username, user.Password)

//         // ✅ 2. Gửi idToken về backend
//         const res = await axios.post('http://30.30.30.12:8080/api/auth/login/', {
//             idToken: idToken
//         })

//         const data = res.data

//         // 💾 3. Lưu JWT nội bộ (nếu backend trả về)
//         if (data?.data?.token) {
//             localStorage.setItem('token', data.data.token)
//         }

//         return data.data
//     } catch (error) {
//         console.error('Login error:', error)
//         throw error
//     }
// })
// const loginSlice =createSlice(
//     {
//         name : 'login',
//         initialState,
//         reducers:
//         {   
//             sUser : (state,action) =>
//             {
//                 const user = action.payload;
//                 state.Username = user.Username;
//             },
//             logout : (state) => 
//             {
//                 state.isLogin = null;
//                 state.isLoading = null;
//                 state.isLogin = null;
//             }
//         },
//         extraReducers :(builder)=>{
//             builder
//             .addCase(login.pending,(state) => {
//                 state.isLoading = true;
//                 state.error = false;
//                 state.isLogin = false;
//             })
//             .addCase(login.fulfilled,(state,action)=>{
//                 state.isLoading = false;
//                 state.error = false;
//                 state.isLogin = true;
//                 state.me = action.payload;
//             })
//             .addCase(login.rejected,(state)=>{
//                 state.isLoading = false;
//                 state.error = true;
//                 state.isLogin = false;
//             })
//             .addCase(loginWithSocial.pending,(state) => {
//                 state.isLoading = true;
//                 state.error = false;
//                 state.isLogin = false;
//             })
//             .addCase(loginWithSocial.fulfilled,(state,action)=>{
//                 state.isLoading = false;
//                 state.error = false;
//                 state.isLogin = true;
//                 state.me = action.payload;
//             })
//             .addCase(loginWithSocial.rejected,(state)=>{
//                 state.isLoading = false;
//                 state.error = true;
//                 state.isLogin = false;
//             })
//         }
//     },
// )
// export const {sUser,logout} = loginSlice.actions;
// export default loginSlice.reducer; 
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import {
  loginWithFirebase,
  loginWithGoogle,
  loginWithFacebook
} from "../Component/Login/loginFirebase";

//  Trạng thái mặc định
const initialState = {
  Username: '',
  isLoading: null,
  error: null,
  isLogin: null,
  me: {}
};

//  Đăng nhập thường (email/password)
export const login = createAsyncThunk('auth/login', async (user) => {
  try {
    //  1. Đăng nhập Firebase
    const { idToken, fcmToken } = await loginWithFirebase(user.Username, user.Password);

    //  2. Gửi cả idToken và fcmToken về backend
    const res = await axios.post('http://30.30.30.12:8080/api/auth/login/', {
      idToken: idToken,
      fcmToken : fcmToken
    });

    const data = res.data;

    //  3. Lưu token nội bộ
    if (data?.data?.token) {
      localStorage.setItem('token', data.data.token);
    }

    return data.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
});

//  Đăng nhập mạng xã hội (Google, Facebook)
export const loginWithSocial = createAsyncThunk('auth/loginSocial', async ({idToken,fcmToken}) => {
  const res = await axios.post('http://30.30.30.12:8080/api/auth/loginsocial/', {
    idToken: idToken,
    fcmToken : fcmToken
  });
  const data = res.data;

  if (data?.data?.token) {
    localStorage.setItem("token", data.data.token);
  }

  return data.data;
});

// ✅ Slice quản lý login
const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    sUser: (state, action) => {
      const user = action.payload;
      state.Username = user.Username;
    },
    logout: (state) => {
      state.isLogin = null;
      state.isLoading = null;
      state.error = null;
      state.me = {};
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      // login thường
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = false;
        state.isLogin = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = false;
        state.isLogin = true;
        state.me = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
        state.isLogin = false;
      })

      // login mạng xã hội
      .addCase(loginWithSocial.pending, (state) => {
        state.isLoading = true;
        state.error = false;
        state.isLogin = false;
      })
      .addCase(loginWithSocial.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = false;
        state.isLogin = true;
        state.me = action.payload;
      })
      .addCase(loginWithSocial.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
        state.isLogin = false;
      });
  },
});

export const { sUser, logout } = loginSlice.actions;
export default loginSlice.reducer;
