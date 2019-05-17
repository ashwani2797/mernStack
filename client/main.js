import React from 'react';
import {hydrate} from 'react-dom';
import App from './App';
import ContextProvider from './ContextProvider.js';

const context = {
    insertCss: (...styles) => {
      const removeCss = styles.map(x => x._insertCss());
      return () => {
        removeCss.forEach(f => f());
      };
    },
  }


hydrate(<ContextProvider context={context}><App /></ContextProvider>, document.getElementById('root'));