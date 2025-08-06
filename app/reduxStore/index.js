// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import quizReducer from './quizSlice';

const store = configureStore({
  reducer: {
    quizzes: quizReducer
  }
});

export default store;
