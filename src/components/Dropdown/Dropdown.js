import React, { useEffect, useState } from 'react';
import { Select, Space, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { setTemplateOptions, setSnippetGroupOptions, setSosvOptions } from '../../redux/Slices/optionsSlice';
import { setTableData } from '../../redux/Slices/tableSlice';

const { Option } = Select;

// API function to fetch options
const fetchOptions = async (token) => {
  try {
    const response = await axios.get('http://localhost:50352/api/v1/getaes', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data : 'An error occurred');
  }
};

const Dropdown = ({ onLoadData }) => {
  const dispatch = useDispatch();
  // Fetch token from Redux
  const token = useSelector((state) => state.auth.token);
  const [isTokenLoading, setIsTokenLoading] = useState(true);
  let tableData = useSelector((state) => state.table.tableData);
  // Update isTokenLoading once token is available
  useEffect(() => {
    if (token) {
      setIsTokenLoading(false);
    }
  }, [token]);

  // Use React Query to fetch options only if token is available
  const { data, error, isLoading } = useQuery({
    queryKey: ['options'],
    queryFn: () => fetchOptions(token),
    enabled: !!token && !isTokenLoading,
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });

  // Redux state for options
  const templateOptions = useSelector((state) => state.options.templateOptions);
  const snippetGroupOptions = useSelector((state) => state.options.snippetGroupOptions);
  const sosvOptions = useSelector((state) => state.options.sosvOptions);

  // State for selected values
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedSnippetGroup, setSelectedSnippetGroup] = useState(null);
  const [selectedSosv, setSelectedSosv] = useState(null);

  useEffect(() => {
    if (data) {
      dispatch(setTemplateOptions(data.templateOptions));
      dispatch(setSnippetGroupOptions(data.snippetGroupOptions));
      dispatch(setSosvOptions(data.sosvOptions));
    }

    if (error) {
      message.error('Failed to load options: ' + error.message);
    }
  }, [data, error, dispatch]);

  const handleLoadData = () => {
    if (selectedTemplate && selectedSnippetGroup && selectedSosv) {
      // Create new data object to be added to the table
      
    const newData = {
      key: Date.now().toString().slice(-6),  // Increment the counter after each use
      template: selectedTemplate,
      snippet_group: selectedSnippetGroup,
      sosv_setup: selectedSosv,
    };
  
      
      // Dispatch action to append new data to existing table data in Redux
      dispatch(setTableData([...tableData, newData]));
  
      // Clear the selected values
      setSelectedTemplate(null);
      setSelectedSnippetGroup(null);
      setSelectedSosv(null);
    } else {
      message.error('Please select a template, snippet group, and SOSV setup.');
    }
  };
  

  if (isTokenLoading) {
    return <div>Loading token...</div>;
  }

  if (isLoading) {
    return <div>Loading options...</div>;
  }

  if (!token) {
    return <div>Please log in to load options.</div>;
  }

  return (
    <Space style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, marginTop: 10 }}>
      <Select
        placeholder="Template"
        style={{ width: 320 }}
        onChange={setSelectedTemplate}
        value={selectedTemplate}
      >
        {templateOptions.map((item) => (
          <Option key={item} value={item}>{item}</Option>
        ))}
      </Select>
      <Select
        placeholder="Snippet group"
        style={{ width: 320 }}
        onChange={setSelectedSnippetGroup}
        value={selectedSnippetGroup}
      >
        {snippetGroupOptions.map((item) => (
          <Option key={item} value={item}>{item}</Option>
        ))}
      </Select>
      <Select
        placeholder="SOSV"
        style={{ width: 320 }}
        onChange={setSelectedSosv}
        value={selectedSosv}
      >
        {sosvOptions.map((item) => (
          <Option key={item} value={item}>{item}</Option>
        ))}
      </Select>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleLoadData}>
        Load Data
      </Button>
    </Space>
  );
};

export default Dropdown;
