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
          isComplete: false,
        },
      }),
    },

    // Update quiz data by ID
    updateQuiz: (state, action) => {
      const { id, data } = action.payload;
      const quiz = state.items.find((q) => q.id === id);
      if (quiz) {
        quiz.data = data;
      }
    },

    setQuizCompleteStatus: (state, action) => {
      const { id, isComplete } = action.payload;
      const quiz = state.items.find((q) => q.id === id);
      if (quiz) {
        quiz.isComplete = isComplete;
      }
    },

    // Remove quiz by ID
    removeQuiz: (state, action) => {
      state.items = state.items.filter((q) => q.id !== action.payload);
    },
  },
});

export const { addQuiz, updateQuiz, removeQuiz, setQuizCompleteStatus } = quizSlice.actions;
export default quizSlice.reducer;
