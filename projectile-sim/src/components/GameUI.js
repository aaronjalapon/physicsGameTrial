import React from 'react';
import './GameUI.css';

const GameUI = ({ score, level, lastResult, onNextLevel, trajectoryData }) => {
  const getTargetInfo = (levelNum) => {
    const targets = [
      { distance: '300px', height: 'Ground', description: 'Easy - Close shot' },
      { distance: '450px', height: '100px', description: 'Medium - Elevated hoop' },
      { distance: '600px', height: '200px', description: 'Hard - Far & high' },
    ];
    return targets[Math.min(levelNum - 1, 2)];
  };

  const targetInfo = getTargetInfo(level);
  const isMaxLevel = level >= 3;

  return (
    <div className="game-ui">
      <div className="score-board">
        <h2>📊 Game Stats</h2>
        <div className="score-display">
          <div className="score-item">
            <label>Current Score</label>
            <div className="value">{score}</div>
          </div>
          <div className="score-item">
            <label>Level</label>
            <div className="value">{level}/3</div>
          </div>
        </div>
      </div>

      <div className="target-info">
        <h3>🎯 Target Info</h3>
        <p className="description">{targetInfo.description}</p>
        <div className="target-details">
          <div className="detail">
            <label>Distance:</label>
            <span>{targetInfo.distance}</span>
          </div>
          <div className="detail">
            <label>Height:</label>
            <span>{targetInfo.height}</span>
          </div>
        </div>
      </div>

      {lastResult && (
        <div className={`result-banner ${lastResult}`}>
          {lastResult === 'hit' ? (
            <div className="hit-message">
              <h3>🎉 SWISH! NOTHING BUT NET!</h3>
              <p>Great shot! +{100 - (level - 1) * 10} points</p>
            </div>
          ) : (
            <div className="miss-message">
              <h3>😅 Miss!</h3>
              <p>Try adjusting your angle and speed</p>
            </div>
          )}
        </div>
      )}

      {lastResult === 'hit' && !isMaxLevel && (
        <button className="next-level-btn" onClick={onNextLevel}>
          🚀 Next Level
        </button>
      )}

      {lastResult === 'hit' && isMaxLevel && (
        <div className="victory-message">
          <h3>🏆 You Completed All Levels!</h3>
          <p>Final Score: {score}</p>
          <p>Amazing job mastering physics!</p>
        </div>
      )}

      <div className="tips-box">
        <h3>💡 Tips</h3>
        <ul>
          <li>45° angle gives max range on level ground</li>
          <li>Lower angles for closer targets</li>
          <li>Adjust speed carefully for precision</li>
          <li>Watch the trajectory line before launching</li>
        </ul>
      </div>
    </div>
  );
};

export default GameUI;
