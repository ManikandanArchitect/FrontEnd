import { createSlice } from '@reduxjs/toolkit';

const optionsSlice = createSlice({
  name: 'options',
  initialState: {
    templateOptions: [],
    snippetGroupOptions: [],
    sosvOptions: [],
    status: 'idle', // To track the status of data fetching
    error: null, // To store any error during the API call
  },
  reducers: {
    setTemplateOptions: (state, action) => {
      state.templateOptions = action.payload;
    },
    setSnippetGroupOptions: (state, action) => {
      state.snippetGroupOptions = action.payload;
    },
    setSosvOptions: (state, action) => {
      state.sosvOptions = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setTemplateOptions, setSnippetGroupOptions, setSosvOptions, setStatus, setError } = optionsSlice.actions;

export default optionsSlice.reducer;
