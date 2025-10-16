import React from 'react';
import './Measurements.css';

const Measurements = ({ trajectoryData, parameters }) => {
  const formatValue = (value) => {
    return isFinite(value) ? value.toFixed(2) : '0.00';
  };

  return (
    <div className="measurements">
      <h2>📊 Measurements</h2>

      <div className="measurement-card">
        <div className="measurement-item">
          <label>Initial Velocity</label>
          <div className="value">{formatValue(parameters.initialVelocity)} m/s</div>
        </div>
      </div>

      <div className="measurement-card">
        <div className="measurement-item">
          <label>Launch Angle</label>
          <div className="value">{formatValue(parameters.angle)}°</div>
        </div>
      </div>

      <div className="measurement-card">
        <div className="measurement-item">
          <label>Initial Height</label>
          <div className="value">{formatValue(parameters.initialHeight)} m</div>
        </div>
      </div>

      <div className="divider"></div>

      <div className="results-section">
        <h3>🎯 Results</h3>

        <div className="measurement-card highlight">
          <div className="measurement-item">
            <label>Maximum Height</label>
            <div className="value">{formatValue(trajectoryData.maxHeight)} m</div>
          </div>
        </div>

        <div className="measurement-card highlight">
          <div className="measurement-item">
            <label>Range (Horizontal Distance)</label>
            <div className="value">{formatValue(trajectoryData.maxRange)} m</div>
          </div>
        </div>

        <div className="measurement-card highlight">
          <div className="measurement-item">
            <label>Time of Flight</label>
            <div className="value">{formatValue(trajectoryData.timeOfFlight)} s</div>
          </div>
        </div>

        <div className="measurement-card highlight">
          <div className="measurement-item">
            <label>Impact Velocity</label>
            <div className="value">{formatValue(trajectoryData.impactVelocity)} m/s</div>
          </div>
        </div>

        <div className="measurement-card">
          <div className="measurement-item">
            <label>Impact Angle</label>
            <div className="value">{formatValue(trajectoryData.impactAngle)}°</div>
          </div>
        </div>
      </div>

      <div className="physics-info">
        <h3>📖 Physics Formulas</h3>
        <div className="formula">
          <p><strong>Max Height:</strong> h = (v₀² × sin²θ) / (2g)</p>
        </div>
        <div className="formula">
          <p><strong>Range:</strong> R = (v₀² × sin(2θ)) / g</p>
        </div>
        <div className="formula">
          <p><strong>Time of Flight:</strong> t = (2 × v₀ × sinθ) / g</p>
        </div>
      </div>
    </div>
  );
};

export default Measurements;
