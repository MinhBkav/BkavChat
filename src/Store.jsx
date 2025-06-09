import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './feature/loginSlice'; // Import slice reducer của bạn
import registerReducer from './feature/registerSlice';
import dataReducer from './feature/dataSlice';
import sreachReducer from './feature/sreachSlice';
import userReducer from './feature/userSlice';


// Cấu hình Redux store
const store = configureStore({
  reducer: {
    login: loginReducer, // Đưa slice reducer vào store
    register: registerReducer,
    data: dataReducer,
    sreach: sreachReducer,
    user : userReducer
  },
});

export default store;
