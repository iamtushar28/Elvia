import { createSlice, nanoid } from "@reduxjs/toolkit";

const quizSlice = createSlice({
  name: "quizzes",
  initialState: {
    items: [], // Array to hold all added quizzes
  },
  reducers: {
    // Add a new quiz
    addQuiz: {
      reducer: (state, action) => {
        state.items.push(action.payload);
      },
      prepare: ({ type, timeLimit }) => ({
        payload: {
          id: nanoid(), // Unique quiz ID
          type, // Quiz type: 'mcq', 'truefalse', 'fillblank'
          timeLimit, // Shared time limit (e.g. 20 sec)
          data: {}, // Placeholder for quiz data
        },
      }),
    },
  },
});

export const { addQuiz } = quizSlice.actions;
export default quizSlice.reducer;
