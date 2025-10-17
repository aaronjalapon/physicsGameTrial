import React from 'react';
import './Controls.css';

const Controls = ({
  parameters,
  onParameterChange,
  onLaunch,
  onReset,
  simulationRunning,
  gameMode
}) => {
  const handleVelocityChange = (e) => {
    let newValue = parseFloat(e.target.value);
    // Clamp between 1 and 150
    newValue = Math.max(1, Math.min(150, newValue));
    onParameterChange({
      ...parameters,
      initialVelocity: newValue
    });
  };

  const handleVelocityInputChange = (e) => {
    const value = e.target.value;
    if (value === '' || value === '-') return;
    let newValue = parseFloat(value);
    if (!isNaN(newValue)) {
      newValue = Math.max(1, Math.min(150, newValue));
      onParameterChange({
        ...parameters,
        initialVelocity: newValue
      });
    }
  };

  const handleAngleChange = (e) => {
    let newValue = parseFloat(e.target.value);
    // Clamp between 0 and 90
    newValue = Math.max(0, Math.min(90, newValue));
    onParameterChange({
      ...parameters,
      angle: newValue
    });
  };

  const handleAngleInputChange = (e) => {
    const value = e.target.value;
    if (value === '' || value === '-') return;
    let newValue = parseFloat(value);
    if (!isNaN(newValue)) {
      newValue = Math.max(0, Math.min(90, newValue));
      onParameterChange({
        ...parameters,
        angle: newValue
      });
    }
  };

  const handleHeightChange = (e) => {
    const newValue = parseFloat(e.target.value);
    onParameterChange({
      ...parameters,
      initialHeight: newValue
    });
  };

  const handleEnvironmentChange = (e) => {
    const env = e.target.value;
    let gravity = 9.8;

    switch (env) {
      case 'moon':
        gravity = 1.62;
        break;
      case 'mars':
        gravity = 3.71;
        break;
      case 'jupiter':
        gravity = 24.79;
        break;
      default:
        gravity = 9.8;
    }

    onParameterChange({
      ...parameters,
      environment: env,
      gravity: gravity
    });
  };

  return (
    <div className="controls">
      <h2>{gameMode ? '🎮 Game Controls' : '🎮 Controls'}</h2>

      <div className="control-group">
        <label htmlFor="velocity">Initial Velocity (m/s)</label>
        <div className="slider-container">
          <input
            id="velocity"
            type="range"
            min="1"
            max="150"
            step="0.5"
            value={parameters.initialVelocity}
            onChange={handleVelocityChange}
            disabled={simulationRunning}
            className="slider"
          />
          <input
            type="number"
            min="1"
            max="150"
            step="0.5"
            value={parameters.initialVelocity.toFixed(1)}
            onChange={handleVelocityInputChange}
            disabled={simulationRunning}
            className="number-input"
          />
        </div>
      </div>

      <div className="control-group">
        <label htmlFor="angle">Launch Angle (°)</label>
        <div className="slider-container">
          <input
            id="angle"
            type="range"
            min="0"
            max="90"
            step="0.5"
            value={parameters.angle}
            onChange={handleAngleChange}
            disabled={simulationRunning}
            className="slider"
          />
          <input
            type="number"
            min="0"
            max="90"
            step="0.5"
            value={parameters.angle.toFixed(1)}
            onChange={handleAngleInputChange}
            disabled={simulationRunning}
            className="number-input"
          />
        </div>
      </div>

      <div className="control-group">
        <label htmlFor="height">Initial Height (m)</label>
        <div className="slider-container">
          <input
            id="height"
            type="range"
            min="0"
            max="50"
            step="5"
            value={parameters.initialHeight}
            onChange={handleHeightChange}
            disabled={simulationRunning}
            className="slider"
          />
          <span className="value">{parameters.initialHeight.toFixed(1)}</span>
        </div>
      </div>

      <div className="control-group">
        <label htmlFor="environment">Environment</label>
        <select
          id="environment"
          value={parameters.environment}
          onChange={handleEnvironmentChange}
          disabled={simulationRunning}
          className="select"
        >
          <option value="earth">🌍 Earth (9.8 m/s²)</option>
          <option value="moon">🌙 Moon (1.62 m/s²)</option>
          <option value="mars">🔴 Mars (3.71 m/s²)</option>
          <option value="jupiter">🟠 Jupiter (24.79 m/s²)</option>
        </select>
      </div>

      <div className="control-group">
        <label>Gravity: {parameters.gravity.toFixed(2)} m/s²</label>
      </div>

      <div className="button-group">
        <button
          onClick={onLaunch}
          disabled={simulationRunning}
          className="btn btn-launch"
        >
          🚀 Launch
        </button>
        <button
          onClick={onReset}
          className="btn btn-reset"
        >
          🔄 Reset
        </button>
      </div>

      <div className="info-box">
        <h3>📚 Tips</h3>
        <ul>
          <li>45° angle gives maximum range on level ground</li>
          <li>Adjust gravity to see effects on different planets</li>
          <li>Initial height affects time of flight</li>
          <li>Watch the trajectory and velocity vectors</li>
        </ul>
      </div>
    </div>
  );
};

export default Controls;
