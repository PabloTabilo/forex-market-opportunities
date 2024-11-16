import Area from "./components/Area";
import Scenario from "./components/Scenario";
import Paths from "./components/Paths";

import './App.css';

function App() {
  return (
    <div className="app-container">
      <div className="left-panel">
        <div className="scenario-container">
          <Scenario />
        </div>
        <div className="paths-container">
          <Paths />
        </div>
      </div>
      <div className="right-panel">
        <Area />
      </div>
    </div>
  ); 
}

export default App
