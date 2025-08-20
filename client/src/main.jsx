import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './reset.css';
import './global.css';

import App from './components/App';
import { UserProvider } from './context/UserContext.jsx';

const root = createRoot(document.getElementById('app'));
root.render(
  <BrowserRouter>
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>
);


