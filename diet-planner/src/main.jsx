// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// Import two things from Chakra this time
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import './index.css';

// 1. Create a theme instance
const theme = extendTheme({
  // You can add custom colors, fonts, etc. here later
});

// 2. Render the app, passing the theme to the provider
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);