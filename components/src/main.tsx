import React from 'react';
import ReactDOM from 'react-dom/client';
import { KitchenSinkApp } from './KitchenSinkApp';
import 'vizhub-ui/dist/vizhub-ui.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <KitchenSinkApp />
  </React.StrictMode>,
);
