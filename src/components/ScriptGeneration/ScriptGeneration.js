import React, { useState } from 'react';
import Dropdown from "../Dropdown/Dropdown";
import TableLayout from "../Table/TableLayout";

const ScriptGeneration = () => {
  // Initialize initialTableData as an empty array
  const [initialTableData, setInitialTableData] = useState([]);

  const handleLoadData = (newData) => {
    // Add the new entry to the table data
    setInitialTableData((prevData) => [...prevData, newData]);
  };

  return (
    <div>
      {/* Pass the handleLoadData function to Dropdown */}
      <Dropdown onLoadData={handleLoadData} />
      <TableLayout initialTableData={initialTableData} />
    </div>
  );
}

export default ScriptGeneration;
