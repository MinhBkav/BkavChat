import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './feature/loginSlice'; // Import slice reducer của bạn
import registerReducer from './feature/registerSlice';

// Cấu hình Redux store
const store = configureStore({
  reducer: {
    login: loginReducer, // Đưa slice reducer vào store
    register: registerReducer
  },
});

export default store;
