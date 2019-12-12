import React, { useRef } from 'react';
import './App.css';
import {
//   AttachedFuncComponent,
//   ChainedAttachedFuncComponent,
  AttachedClassComponent,
  AttachedClassComponentII,
//   AttachedClassComponent2,
  ChainedAttachedClassComponent,
//   ExplicitlyChainedAttachedClassComponent,
} from './testMY';

const App: React.FC = () => {
  const ref = useRef(null);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Test App for SCAX
        </p>
        <AttachedClassComponent name="first attach" ref={ref} />
        <ChainedAttachedClassComponent name="implicitly chained" />
        <AttachedClassComponentII name="successive attach" />
        {/* <ExplicitlyChainedAttachedClassComponent name="explicitly chained" /> */}
        {/* <AttachedFuncComponent />
        <AttachedFuncComponent />
        <ChainedAttachedFuncComponent /> */}
      </header>
    </div>
  );
};

export default App;
