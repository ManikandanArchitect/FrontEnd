import { createSlice } from '@reduxjs/toolkit';

const tableSlice = createSlice({
  name: 'table',
  initialState: {
    tableData: [] // This will hold your table data
  },
  reducers: {
    // Action to set the table data
    setTableData: (state, action) => {
      state.tableData = action.payload; // Update tableData with new payload
    }
  },
});

export const { setTableData } = tableSlice.actions;

export default tableSlice.reducer;
