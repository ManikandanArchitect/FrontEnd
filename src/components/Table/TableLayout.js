import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Popconfirm, Card, Tooltip, Select,message } from 'antd';
import { DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import './TableLayout.css';
import { setTableData } from '../../redux/Slices/tableSlice';
import axios from 'axios';

const TableLayout = ({ initialTableData = [] }) => {

  const dispatch = useDispatch();
    // Get table data from Redux store
    initialTableData = useSelector((state) => state.table.tableData);
    const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    // If initialTableData is provided, set it in the Redux store
    if (initialTableData.length > 0) {
      dispatch(setTableData(initialTableData));
    }
  }, [initialTableData, dispatch]);

  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(initialTableData);
  const [editMode, setEditMode] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [templateSuggestions, setTemplateSuggestions] = useState([]);
  const [snippetGroupSuggestions, setSnippetGroupSuggestions] = useState([]);
  const [sosvSuggestions, setSosvSuggestions] = useState([]);

  const templateOptions = useSelector((state) => state.options.templateOptions);
  const snippetGroupOptions = useSelector((state) => state.options.snippetGroupOptions);
  const sosvOptions = useSelector((state) => state.options.sosvOptions);

  useEffect(() => {
    setFilteredData(initialTableData);
  }, [initialTableData]);

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = initialTableData.filter((item) =>
      Object.values(item).some((val) => String(val).toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredData(filtered);
  };

  const handleChange = (e, key) => {
    const value = e.target.value;
    setEditableData({ ...editableData, [key]: value });

    // Update suggestions based on the current input
    if (key === 'template') {
      setTemplateSuggestions(templateOptions.filter(option => option.toLowerCase().includes(value.toLowerCase())));
    } else if (key === 'snippet_group') {
      setSnippetGroupSuggestions(snippetGroupOptions.filter(option => option.includes(value)));
    } else if (key === 'sosv_setup') {
      setSosvSuggestions(sosvOptions.filter(option => option.toLowerCase().includes(value.toLowerCase())));
    }
  };

  const handleSelectChange = (value, key) => {
    setEditableData({ ...editableData, [key]: value });
    // Clear suggestions after selection
    if (key === 'template') setTemplateSuggestions([]);
    else if (key === 'snippet_group') setSnippetGroupSuggestions([]);
    else if (key === 'sosv_setup') setSosvSuggestions([]);
  };

  const handleSave = () => {
    debugger;
    const newData = filteredData.map(item => {
      if (item.key === editMode) {
        return { ...item, ...editableData }; // Merge updated values
      }
      return item;
    });
    
    // Dispatch the updated data after newData has been fully created
    dispatch(setTableData(newData));
    
    setFilteredData(newData);
    setEditMode(null);
    setEditableData({});
  };

  const handleEdit = (record) => {
    setEditMode(record.key);
    setEditableData(record);
  };

  const handleDelete = (key) => {
  debugger;
    const newData = filteredData.filter(item => item.key !== key);
    setFilteredData(newData);
    dispatch(setTableData(newData));
  };

  const handleFilterChange = (value, key) => {
    const filtered = initialTableData.filter(item => item[key] === value);
    setFilteredData(filtered);
  };
  const handleGenerate = () => {
    // Collect selected data
    const selectedData = filteredData
  .filter(item => selectedRowKeys.includes(item.key))
  .map(item => ({
    AESId: parseInt(item.key),
    template: item.template,
    snippet_group: item.snippet_group,
    sosv_setup: item.sosv_setup,
  })); 

  debugger;

  if(selectedData.length !==0)
  {
    // Replace with your actual API endpoint and Bearer token
    const apiEndpoint = 'http://localhost:50352/api/v1/addtemplate';

    axios.post(apiEndpoint, selectedData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // Add Bearer token to the Authorization header
      }
    })
      .then(response => {
        console.log('Data successfully sent:', response.data);
        message.success({
          content: 'Data successfully sent',
          duration: 2, // Duration in seconds
          style: {
            marginTop: '20px',
          },
        });
        setSelectedRowKeys([]);
      })
      .catch(error => {
        console.error('Error:', error);
        message.error('Error:', error);
      });



    // Perform the API call with the selected data
    console.log("Selected Data for API:", selectedData);
  }
  else{
    
    message.error({
      content: 'Please select the template details in grid',
      duration: 2, 
      style: {
        marginTop: '20px',
      },
    });
  }

  };

  const columns = [
    {
      title: 'Template',
      dataIndex: 'template',
      filters: templateOptions.map(option => ({ text: option, value: option })),
      onFilter: (value, record) => record.template === value,
      sorter: (a, b) => a.template.localeCompare(b.template),
      render: (text, record) => (
        editMode === record.key ? (
          <Select
            value={editableData.template}
            onChange={(value) => handleSelectChange(value, 'template')}
            options={templateSuggestions.map(option => ({ value: option, label: option }))}
            showSearch
            style={{ width: '100%' }}
            onInputKeyDown={(e) => handleChange(e, 'template')}
          />
        ) : (
          text
        )
      ),
    },
    {
      title: 'Snippet Group',
      dataIndex: 'snippet_group',
      filters: snippetGroupOptions.map(option => ({ text: option, value: option })),
      onFilter: (value, record) => record.snippet_group === value,
      sorter: (a, b) => a.snippet_group.localeCompare(b.snippet_group),
      render: (text, record) => (
        editMode === record.key ? (
          <Select
            value={editableData.snippet_group}
            onChange={(value) => handleSelectChange(value, 'snippet_group')}
            options={snippetGroupSuggestions.map(option => ({ value: option, label: option }))}
            showSearch
            style={{ width: '100%' }}
            onInputKeyDown={(e) => handleChange(e, 'snippet_group')}
          />
        ) : (
          text
        )
      ),
    },
    {
      title: 'SOSV Setup',
      dataIndex: 'sosv_setup',
      filters: sosvOptions.map(option => ({ text: option, value: option })),
      onFilter: (value, record) => record.sosv_setup === value,
      sorter: (a, b) => a.sosv_setup.localeCompare(b.sosv_setup),
      render: (text, record) => (
        editMode === record.key ? (
          <Select
            value={editableData.sosv_setup}
            onChange={(value) => handleSelectChange(value, 'sosv_setup')}
            options={sosvSuggestions.map(option => ({ value: option, label: option }))}
            showSearch
            style={{ width: '100%' }}
            onInputKeyDown={(e) => handleChange(e, 'sosv_setup')}
          />
        ) : (
          text
        )
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (_, record) => (
        <div>
          {editMode === record.key ? (
            <Tooltip title={'Save'}>
              <Button onClick={handleSave} icon={<SaveOutlined />}></Button>
            </Tooltip>
          ) : (
            <Tooltip title={'Edit'}>
              <Button onClick={() => handleEdit(record)} icon={<EditOutlined />}></Button>
            </Tooltip>
          )}
          <Popconfirm
            title="Are you sure to delete this task?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" icon={<DeleteOutlined />} style={{ marginLeft: 8 }} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
    ],
  };

  return (
    <div>
      <div className="custom-search">
        <Input
          placeholder="Search..."
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          size="middle"
          allowClear
          style={{ width: 200 }}
        />
      </div>
      <Card className="custom-card">
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          rowKey="key"
          pagination={{ pageSize: 5 }}
        />
      </Card>
      <Button type="primary" onClick={handleGenerate} style={{ marginTop: 16, backgroundColor: 'green', float: 'right',marginRight:10 }}>
      Generate
    </Button>
    </div>
  );
};

export default TableLayout