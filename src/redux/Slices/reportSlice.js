// reportSlice.js
import { createSlice } from '@reduxjs/toolkit';

const reportSlice = createSlice({
  name: 'report',
  initialState: {
    data: [],
    lastFetched: null,
  },
  reducers: {
    setTableData: (state, action) => {
      state.data = action.payload;
      state.lastFetched = Date.now();
    },
  },
});

export const { setTableData } = reportSlice.actions;
export default reportSlice.reducer;
