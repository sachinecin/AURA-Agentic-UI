import React, { useState } from 'react';
import './App.css';

function App() {
  const [userIntent, setUserIntent] = useState('');
  const [blueprint, setBlueprint] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateUI = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/generate-ui', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIntent, telemetry: {} }),
      });
      const data = await response.json();
      if (data.success) {
        setBlueprint(data.blueprint);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Error generating UI: ' + error.message);
    }
    setLoading(false);
  };

  const renderComponent = (comp) => {
    switch (comp.type) {
      case 'header':
        return <h1>{comp.text}</h1>;
      case 'text':
        return <p>{comp.content}</p>;
      case 'button':
        return <button onClick={() => alert(comp.action)}>{comp.label}</button>;
      case 'chart':
        return <div>Chart: {comp.data}</div>;
      default:
        return <div>Unknown component</div>;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AURA Agentic UI</h1>
        <input
          type="text"
          value={userIntent}
          onChange={(e) => setUserIntent(e.target.value)}
          placeholder="Enter user intent, e.g., 'show dashboard'"
        />
        <button onClick={generateUI} disabled={loading}>
          {loading ? 'Generating...' : 'Generate UI'}
        </button>
        {blueprint && (
          <div>
            <h2>Generated UI</h2>
            {blueprint.components.map((comp, idx) => (
              <div key={idx}>{renderComponent(comp)}</div>
            ))}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;