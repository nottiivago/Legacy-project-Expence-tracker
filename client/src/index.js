import './input.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />

  </React.StrictMode>,
 // document.getElementById('root') //------- commented it as it showed a warning in console that said that You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root.

  // </React.StrictMode>


);

