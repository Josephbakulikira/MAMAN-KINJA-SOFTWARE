import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom';
import IdealProvider from './context/index.jsx';
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <IdealProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </IdealProvider>
  </React.StrictMode>,
)
