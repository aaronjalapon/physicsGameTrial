import React, { useState } from 'react';
import Canvas from './components/Canvas';
import Controls from './components/Controls';
import Measurements from './components/Measurements';
import GameUI from './components/GameUI';
import './App.css';

function App() {
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [gameMode, setGameMode] = useState(true); // true = game, false = learn
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lastResult, setLastResult] = useState(''); // 'hit' or 'miss'
  
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
    setLastResult('');
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

  const handleSimulationEnd = () => {
    setSimulationRunning(false);
  };

  const checkHit = (impactX, impactY) => {
    // Get target based on level (coordinates in physics units - meters)
    const target = getTarget(level);
    
    // We need to check if the projectile passed through the target's hitbox
    // Not just check the final impact point!
    // Let's check all points in the trajectory
    
    let isHit = false;
    
    for (const point of trajectoryData.points) {
      const distance = Math.sqrt((point.x - target.x) ** 2 + (point.y - target.y) ** 2);
      const hitRadius = target.radius + 3.75;
      
      if (distance < hitRadius) {
        isHit = true;
        console.log('HIT DETECTED at trajectory point:', point);
        break;
      }
    }

    console.log('=== HIT DETECTION ===');
    console.log('Final Impact (physics units):', { impactX, impactY });
    console.log('Target:', target);
    console.log('Checked', trajectoryData.points.length, 'trajectory points');
    console.log('Is Hit?', isHit);
    console.log('==================');

    if (isHit) {
      const points = 100 - (level - 1) * 10;
      setScore(prevScore => prevScore + points);
      setLastResult('hit');
      return true;
    } else {
      setLastResult('miss');
      return false;
    }
  };

  const getTarget = (levelNum) => {
    // Target coordinates in PHYSICS UNITS (meters)
    // Canvas draws at: startX=50, startY=height-50 (550)
    // Scale factor is 4 (pixels per meter)
    // So: physics_x = (canvas_x - 50) / 4, physics_y = (550 - canvas_y) / 4
    
    // Level 1: canvas (300, 480) => physics (62.5, 17.5)
    // Level 2: canvas (450, 400) => physics (100, 37.5)
    // Level 3: canvas (600, 350) => physics (137.5, 50)
    
    const targets = [
      { x: 62.5, y: 17.5, radius: 5 },   // Level 1: close
      { x: 100, y: 37.5, radius: 4.5 },  // Level 2: medium distance, elevated
      { x: 137.5, y: 50, radius: 4 },    // Level 3: far, higher
    ];
    return targets[Math.min(levelNum - 1, 2)];
  };

  const nextLevel = () => {
    if (level < 3) {
      setLevel(level + 1);
      handleReset();
    }
  };

  const toggleMode = () => {
    setGameMode(!gameMode);
    setScore(0);
    setLevel(1);
    handleReset();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>{gameMode ? '� Basketball Physics Game' : '�🎯 Projectile Motion Simulator'}</h1>
        <p>{gameMode ? `Level ${level} - Score: ${score}` : 'Learn Physics Through Interactive Simulation'}</p>
        <button className="mode-toggle" onClick={toggleMode}>
          {gameMode ? '📚 Switch to Learn Mode' : '🎮 Switch to Game Mode'}
        </button>
      </header>

      <div className="app-container">
        <div className="left-panel">
          <Controls
            parameters={parameters}
            onParameterChange={handleParameterChange}
            onLaunch={handleLaunch}
            onReset={handleReset}
            simulationRunning={simulationRunning}
            gameMode={gameMode}
          />
        </div>

        <div className="center-panel">
          <Canvas
            trajectoryData={trajectoryData}
            simulationRunning={simulationRunning}
            onSimulationEnd={handleSimulationEnd}
            gameMode={gameMode}
            level={level}
            onHit={checkHit}
            lastResult={lastResult}
          />
        </div>

        <div className="right-panel">
          {gameMode ? (
            <GameUI 
              score={score}
              level={level}
              lastResult={lastResult}
              onNextLevel={nextLevel}
              trajectoryData={trajectoryData}
            />
          ) : (
            <Measurements trajectoryData={trajectoryData} parameters={parameters} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
