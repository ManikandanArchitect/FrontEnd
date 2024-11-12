import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Input } from 'antd';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query'; // Ensure you import from @tanstack/react-query
import { setTableData } from '../../redux/Slices/reportSlice'; 

const fetchOptions = async (token) => {
  const response = await axios.get('http://localhost:50352/api/v1/getreport', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.data;
};

const ScriptReport = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token); // Make sure token is fetched
  const reportData = useSelector((state) => state.report.data); // Report data from Redux
  const lastFetched = useSelector((state) => state.report.lastFetched); // Last fetched time from Redux

  const isDataStale = !lastFetched || Date.now() - lastFetched > 30 * 60 * 1000; // Check if the data is stale (older than 30 mins)

  // Fetch data with react-query if the token is available and the data is stale
  const { data, isLoading, isError } = useQuery(
    'report',
    () => fetchOptions(token),
    {
      enabled: !!token && isDataStale, // Only run query if token is available and data is stale
      staleTime: 30 * 60 * 1000, // Cache data for 30 minutes
      cacheTime: 30 * 60 * 1000, // Cache time for 30 minutes
      onSuccess: (fetchedData) => {
        dispatch(setTableData(fetchedData)); // Save data to Redux
      },
    }
  );

  // If reportData is not set yet or data is fetched, set data in Redux
  useEffect(() => {
    if (!reportData && data) {
      dispatch(setTableData(data));
    }
  }, [data, reportData, dispatch]);

  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    script_no: [],
    script_status: [],
    file_status: [],
    template: [],
    snippet_group: [],
    sosv_setup: [],
  });

  const handleSearch = (value) => setSearchText(value);

  const generateFilters = (data) => {
    // Generate dynamic filters from data
    const scriptNoSet = new Set();
    const scriptStatusSet = new Set();
    const fileStatusSet = new Set();
    const templateSet = new Set();
    const snippetGroupSet = new Set();
    const sosvSetupSet = new Set();

    data.forEach(item => {
      scriptNoSet.add(item.script_no);
      scriptStatusSet.add(item.script_status);
      fileStatusSet.add(item.file_status);
      templateSet.add(item.template);
      snippetGroupSet.add(item.snippet_group);
      sosvSetupSet.add(item.sosv_setup);
    });

    return {
      script_no: Array.from(scriptNoSet).map(value => ({ text: value, value })),
      script_status: Array.from(scriptStatusSet).map(value => ({ text: value, value })),
      file_status: Array.from(fileStatusSet).map(value => ({ text: value, value })),
      template: Array.from(templateSet).map(value => ({ text: value, value })),
      snippet_group: Array.from(snippetGroupSet).map(value => ({ text: value, value })),
      sosv_setup: Array.from(sosvSetupSet).map(value => ({ text: value, value })),
    };
  };

  const dynamicFilters = generateFilters(reportData || []); // Safely handle reportData

  const filteredData = (reportData || []).filter((item) => {
    const matchesSearchText =
      item.script_no.toLowerCase().includes(searchText.toLowerCase()) ||
      item.script_status.includes(searchText) ||
      item.file_status.toLowerCase().includes(searchText.toLowerCase()) ||
      item.template.toLowerCase().includes(searchText.toLowerCase()) ||
      item.snippet_group.toLowerCase().includes(searchText.toLowerCase()) ||
      item.sosv_setup.toLowerCase().includes(searchText.toLowerCase());

    const matchesFilters =
      (filters.script_no.length === 0 || filters.script_no.includes(item.script_no)) &&
      (filters.script_status.length === 0 || filters.script_status.includes(item.script_status)) &&
      (filters.file_status.length === 0 || filters.file_status.includes(item.file_status)) &&
      (filters.template.length === 0 || filters.template.includes(item.template)) &&
      (filters.snippet_group.length === 0 || filters.snippet_group.includes(item.snippet_group)) &&
      (filters.sosv_setup.length === 0 || filters.sosv_setup.includes(item.sosv_setup));

    return matchesSearchText && matchesFilters;
  });

  const columns = [
    {
      title: 'Script No',
      dataIndex: 'script_no',
      filters: dynamicFilters.script_no,
      onFilter: (value, record) => record.script_no.includes(value),
      sorter: (a, b) => a.script_no.localeCompare(b.script_no),
    },
    {
      title: 'Script Status',
      dataIndex: 'script_status',
      filters: dynamicFilters.script_status,
      onFilter: (value, record) => record.script_status.includes(value),
      sorter: (a, b) => a.script_status - b.script_status,
    },
    {
      title: 'File Status',
      dataIndex: 'file_status',
      filters: dynamicFilters.file_status,
      onFilter: (value, record) => record.file_status.includes(value),
      sorter: (a, b) => a.file_status.localeCompare(b.file_status),
    },
    {
      title: 'Template',
      dataIndex: 'template',
      filters: dynamicFilters.template,
      onFilter: (value, record) => record.template.includes(value),
      sorter: (a, b) => a.template.localeCompare(b.template),
    },
    {
      title: 'Snippet Group',
      dataIndex: 'snippet_group',
      filters: dynamicFilters.snippet_group,
      onFilter: (value, record) => record.snippet_group.includes(value),
      sorter: (a, b) => a.snippet_group.localeCompare(b.snippet_group),
    },
    {
      title: 'SOSV Setup',
      dataIndex: 'sosv_setup',
      filters: dynamicFilters.sosv_setup,
      onFilter: (value, record) => record.sosv_setup.includes(value),
      sorter: (a, b) => a.sosv_setup.localeCompare(b.sosv_setup),
    },
  ];

  return (
    <>
      <Input
        placeholder="Search..."
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ margin: 16, width: 300, float: 'right' }}
      />
      <Table
        dataSource={filteredData}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey="key"
        loading={isLoading}
      />
    </>
  );
};

export default ScriptReport;
