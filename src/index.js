import React from 'react';
import ReactDOM from 'react-dom';
import path from 'path';

import App from './App';
import randomPageId from './utils/randomPageId';

import './index.css';

const pageId = path.basename(window.location.pathname);

if (!pageId) {
  window.location.pathname = randomPageId();
} else {
  ReactDOM.render(
    <App page={pageId} />,
    document.getElementById('root')
  );
}
