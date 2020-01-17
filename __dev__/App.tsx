import React, { useRef } from 'react';
import './App.css';
import { AttachedClassComponent } from './component/testComponent';
/**
 * Import your test component here.
 * Before commiting, please make sure all your customized testing components are in ./component folder.
 * Please remember to restore this file to the original status(refer to ./App.template.tsx).
 */

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Test App for SCAX
        </p>
        {/* Render your test component */}
        <AttachedClassComponent name="test" />
      </header>
    </div>
  );
};

export default App;
