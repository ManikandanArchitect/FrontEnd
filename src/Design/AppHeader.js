import React from 'react';
import { Layout, Menu } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './AppHeader.css';

const { Header } = Layout;

const AppHeader = () => {
    const username = useSelector((state) => state.auth.username);
    
    const location = useLocation();
    return (
      <Header className="custom-header">
      <div className="logo"></div>
      <Menu
        mode="horizontal"
        style={{ flex: 1 }}
        selectedKeys={[location.pathname]}  // Dynamically set selected key based on the path
      >
        <Menu.Item key="/">
          <NavLink
            to="/"
            exact
            activeClassName="active-link"
          >
            Script Generator
          </NavLink>
        </Menu.Item>
        
        <Menu.Item key="/report">
          <NavLink
            to="/report"
            activeClassName="active-link"
          >
            Report
          </NavLink>
        </Menu.Item>
        
        {/* Additional Menu Items can be added similarly */}
      </Menu>
      {username && (
        <div className="username-display">
          Welcome, {username}
        </div>
      )}
    </Header>
    );
};

export default AppHeader;
