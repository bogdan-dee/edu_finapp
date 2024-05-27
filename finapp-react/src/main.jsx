import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App.jsx'

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Icons
import "bootstrap-icons/font/bootstrap-icons.min.css"
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';
window.bootstrap = bootstrap;

import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>,
)
