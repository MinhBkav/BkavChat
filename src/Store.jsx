import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './feature/loginSlice'; // Import slice reducer của bạn

// Cấu hình Redux store
const store = configureStore({
  reducer: {
    login: loginReducer, // Đưa slice reducer vào store
  },
});

export default store;
