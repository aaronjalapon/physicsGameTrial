import React, { useState, useRef } from 'react';
import Canvas from './components/Canvas';
import Controls from './components/Controls';
import Measurements from './components/Measurements';
import './App.css';

function App() {
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [parameters, setParameters] = useState({
    initialVelocity: 50,
    angle: 45,
    initialHeight: 0,
    gravity: 9.8,
    environment: 'earth'
  });
  
  const [trajectoryData, setTrajectoryData] = useState({
    points: [],
    maxHeight: 0,
    maxRange: 0,
    timeOfFlight: 0,
    impactVelocity: 0,
    impactAngle: 0,
    currentPosition: null
  });

  const canvasRef = useRef(null);

  const calculateTrajectory = (velocity, angle, height, gravity) => {
    const angleRad = (angle * Math.PI) / 180;
    const vx = velocity * Math.cos(angleRad);
    const vy = velocity * Math.sin(angleRad);

    // Calculate time of flight
    const a = (-gravity) / 2;
    const b = vy;
    const c = height;
    const discriminant = b * b - 4 * a * c;
    let timeOfFlight = 0;

    if (discriminant >= 0) {
      timeOfFlight = (-b - Math.sqrt(discriminant)) / (2 * a);
    }

    // Calculate trajectory points
    const points = [];
    const dt = Math.max(timeOfFlight / 100, 0.01);

    for (let t = 0; t <= timeOfFlight; t += dt) {
      const x = vx * t;
      const y = height + vy * t - 0.5 * gravity * t * t;
      if (y >= 0) {
        points.push({ x, y, t });
      }
    }

    // Add final point at impact
    const finalX = vx * timeOfFlight;
    const finalY = 0;
    points.push({ x: finalX, y: finalY, t: timeOfFlight });

    // Calculate measurements
    const maxHeight = height + (vy * vy) / (2 * gravity);
    const maxRange = finalX;
    const impactVelocityMagnitude = Math.sqrt(vx * vx + (vy - gravity * timeOfFlight) ** 2);
    const impactVelocityAngle = Math.atan2(vy - gravity * timeOfFlight, vx) * (180 / Math.PI);

    return {
      points,
      maxHeight: Math.max(0, maxHeight),
      maxRange,
      timeOfFlight,
      impactVelocity: impactVelocityMagnitude,
      impactAngle: impactVelocityAngle,
      currentPosition: null
    };
  };

  const handleParameterChange = (newParameters) => {
    setParameters(newParameters);
    const trajectory = calculateTrajectory(
      newParameters.initialVelocity,
      newParameters.angle,
      newParameters.initialHeight,
      newParameters.gravity
    );
    setTrajectoryData(trajectory);
  };

  const handleLaunch = () => {
    if (!simulationRunning) {
      setSimulationRunning(true);
      const trajectory = calculateTrajectory(
        parameters.initialVelocity,
        parameters.angle,
        parameters.initialHeight,
        parameters.gravity
      );
      setTrajectoryData(trajectory);
    }
  };

  const handleReset = () => {
    setSimulationRunning(false);
    setTrajectoryData({
      points: [],
      maxHeight: 0,
      maxRange: 0,
      timeOfFlight: 0,
      impactVelocity: 0,
      impactAngle: 0,
      currentPosition: null
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎯 Projectile Motion Simulator</h1>
        <p>Learn Physics Through Interactive Simulation</p>
      </header>

      <div className="app-container">
        <div className="left-panel">
          <Controls
            parameters={parameters}
            onParameterChange={handleParameterChange}
            onLaunch={handleLaunch}
            onReset={handleReset}
            simulationRunning={simulationRunning}
          />
        </div>

        <div className="center-panel">
          <Canvas
            ref={canvasRef}
            trajectoryData={trajectoryData}
            simulationRunning={simulationRunning}
            onSimulationEnd={() => setSimulationRunning(false)}
          />
        </div>

        <div className="right-panel">
          <Measurements trajectoryData={trajectoryData} parameters={parameters} />
        </div>
      </div>
    </div>
  );
}

export default App;
