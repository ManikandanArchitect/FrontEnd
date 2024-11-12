import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryclient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
     <Provider store={store}>
        <QueryClientProvider client={queryclient}>
        <App />
        </QueryClientProvider>
    
    </Provider>
  
);

