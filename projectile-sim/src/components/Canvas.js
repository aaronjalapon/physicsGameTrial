import React, { useEffect, useRef } from 'react';
import './Canvas.css';

const Canvas = React.forwardRef(
  ({ trajectoryData, simulationRunning, onSimulationEnd }, ref) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const currentIndexRef = useRef(0);
    const particlesRef = useRef([]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      let animationFrameId;
      const render = () => {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#e8f4f8');
        gradient.addColorStop(1, '#d4e8f0');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Draw animated clouds
        drawAnimatedClouds(ctx, width, height);
        
        // Update and draw particles
        updateParticles(particlesRef.current, ctx);
        drawParticles(particlesRef.current, ctx);

        // Draw animated grid
        drawAnimatedGrid(ctx, width, height);

        // Draw ground with animation
        drawAnimatedGround(ctx, width, height);

        if (trajectoryData.points.length > 0) {
          // Draw trajectory path with animation
          drawAnimatedTrajectory(ctx, trajectoryData.points, width, height);

          // Draw projectile at current position during animation
          if (simulationRunning && currentIndexRef.current < trajectoryData.points.length) {
            const point = trajectoryData.points[currentIndexRef.current];
            drawAnimatedProjectile(ctx, point, width, height);
            
            // Create particle effects
            if (currentIndexRef.current % 3 === 0) {
              createParticles(particlesRef.current, point, width, height);
            }
          } else if (!simulationRunning && trajectoryData.points.length > 0) {
            // Draw at end position
            const point = trajectoryData.points[trajectoryData.points.length - 1];
            drawAnimatedProjectile(ctx, point, width, height);
          }

          // Draw measurement markers
          if (trajectoryData.maxHeight > 0) {
            drawAnimatedMaxHeightLine(ctx, trajectoryData, width, height);
          }
        }

        animationFrameId = requestAnimationFrame(render);
      };

      render();

      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }, [trajectoryData, simulationRunning]);

    useEffect(() => {
      if (!simulationRunning) {
        currentIndexRef.current = 0;
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        return;
      }

      const animate = () => {
        if (currentIndexRef.current < trajectoryData.points.length) {
          currentIndexRef.current++;
          animationRef.current = requestAnimationFrame(animate);
        } else {
          onSimulationEnd();
        }
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [simulationRunning, trajectoryData, onSimulationEnd]);

    return (
      <div className="canvas-container">
        <canvas ref={canvasRef} width={800} height={600} className="canvas" />
      </div>
    );
  }
);

Canvas.displayName = 'Canvas';

// Grid drawing functions
const drawAnimatedGrid = (ctx, width, height) => {
  const time = Date.now() * 0.0001;
  const alpha = 0.1 + Math.sin(time * 2) * 0.05;
  
  ctx.strokeStyle = `rgba(200, 200, 200, ${alpha})`;
  ctx.lineWidth = 1;
  const gridSize = 50;

  for (let i = 0; i < width; i += gridSize) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, height);
    ctx.stroke();
  }

  for (let i = 0; i < height; i += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(width, i);
    ctx.stroke();
  }
};

// Trajectory drawing functions
const drawAnimatedTrajectory = (ctx, points, width, height) => {
  const time = Date.now() * 0.001;
  const scale = 4;
  const startX = 50;
  const startY = height - 50;

  // Draw main trajectory with glow effect
  ctx.shadowColor = 'rgba(255, 107, 107, 0.6)';
  ctx.shadowBlur = 8 + Math.sin(time) * 3;
  
  ctx.strokeStyle = '#FF6B6B';
  ctx.lineWidth = 3;
  ctx.beginPath();

  for (let i = 0; i < points.length; i++) {
    const x = startX + points[i].x * scale;
    const y = startY - points[i].y * scale;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();

  // Draw animated dashed line overlay
  ctx.strokeStyle = 'rgba(255, 200, 200, 0.4)';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.lineDashOffset = -time * 20;
  ctx.beginPath();

  for (let i = 0; i < points.length; i++) {
    const x = startX + points[i].x * scale;
    const y = startY - points[i].y * scale;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();
  ctx.setLineDash([]);
  ctx.shadowColor = 'transparent';
};

const drawAnimatedProjectile = (ctx, point, width, height) => {
  const time = Date.now() * 0.005;
  const scale = 4;
  const startX = 50;
  const startY = height - 50;

  const x = startX + point.x * scale;
  const y = startY - point.y * scale;

  // Draw pulsing outer ring
  ctx.strokeStyle = `rgba(255, 107, 107, ${0.5 + Math.sin(time * 3) * 0.3})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 12 + Math.sin(time * 2) * 3, 0, Math.PI * 2);
  ctx.stroke();

  // Draw main projectile with glow
  ctx.shadowColor = `rgba(255, 107, 107, ${0.6 + Math.sin(time) * 0.2})`;
  ctx.shadowBlur = 12 + Math.sin(time * 2) * 4;

  ctx.fillStyle = '#FF6B6B';
  ctx.beginPath();
  ctx.arc(x, y, 8, 0, Math.PI * 2);
  ctx.fill();

  // Draw rotating highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.beginPath();
  const highlightX = x + Math.cos(time * 5) * 4;
  const highlightY = y + Math.sin(time * 5) * 4;
  ctx.arc(highlightX, highlightY, 2, 0, Math.PI * 2);
  ctx.fill();

  // Draw velocity vector
  const vx = point.x - (point.t > 0 ? 50 * 4 : 0);
  const vy = point.y;
  drawAnimatedVector(ctx, x, y, vx * 0.5, -vy * 0.5, '#4CAF50', time);

  ctx.shadowColor = 'transparent';
};

// Projectile drawing functions
const drawProjectile = (ctx, point, width, height) => {
  const scale = 4;
  const startX = 50;
  const startY = height - 50;

  const x = startX + point.x * scale;
  const y = startY - point.y * scale;

  // Draw projectile as a circle with glow
  ctx.shadowColor = 'rgba(255, 107, 107, 0.5)';
  ctx.shadowBlur = 10;

  ctx.fillStyle = '#FF6B6B';
  ctx.beginPath();
  ctx.arc(x, y, 8, 0, Math.PI * 2);
  ctx.fill();

  // Draw velocity vector
  const vx = point.x - (point.t > 0 ? 50 * 4 : 0);
  const vy = point.y;
  drawVector(ctx, x, y, vx * 0.5, -vy * 0.5, '#4CAF50');

  ctx.shadowColor = 'transparent';
};

// Vector drawing functions
const drawVector = (ctx, x, y, vx, vy, color) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + vx, y + vy);
  ctx.stroke();

  // Draw arrowhead
  const angle = Math.atan2(vy, vx);
  const arrowSize = 10;
  ctx.beginPath();
  ctx.moveTo(x + vx, y + vy);
  ctx.lineTo(x + vx - arrowSize * Math.cos(angle - Math.PI / 6), y + vy - arrowSize * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(x + vx, y + vy);
  ctx.lineTo(x + vx - arrowSize * Math.cos(angle + Math.PI / 6), y + vy - arrowSize * Math.sin(angle + Math.PI / 6));
  ctx.stroke();
};

const drawAnimatedVector = (ctx, x, y, vx, vy, color, time) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.shadowColor = `rgba(76, 175, 80, ${0.4 + Math.sin(time * 2) * 0.2})`;
  ctx.shadowBlur = 6;

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + vx, y + vy);
  ctx.stroke();

  // Draw animated arrowhead
  const angle = Math.atan2(vy, vx);
  const arrowSize = 10 + Math.sin(time * 3) * 2;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + vx, y + vy);
  ctx.lineTo(x + vx - arrowSize * Math.cos(angle - Math.PI / 6), y + vy - arrowSize * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(x + vx - arrowSize * Math.cos(angle + Math.PI / 6), y + vy - arrowSize * Math.sin(angle + Math.PI / 6));
  ctx.fill();

  ctx.shadowColor = 'transparent';
};

const drawMaxHeightLine = (ctx, trajectoryData, width, height) => {
  const scale = 4;
  const startY = height - 50;

  const maxY = startY - trajectoryData.maxHeight * scale;

  ctx.strokeStyle = '#4CAF50';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(0, maxY);
  ctx.lineTo(width, maxY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#4CAF50';
  ctx.font = 'bold 12px Arial';
  ctx.fillText(`Max Height: ${trajectoryData.maxHeight.toFixed(2)} m`, 10, maxY - 10);
};

const drawAnimatedMaxHeightLine = (ctx, trajectoryData, width, height) => {
  const time = Date.now() * 0.001;
  const scale = 4;
  const startY = height - 50;

  const maxY = startY - trajectoryData.maxHeight * scale;

  // Draw pulsing line
  ctx.strokeStyle = `rgba(76, 175, 80, ${0.4 + Math.sin(time * 2) * 0.3})`;
  ctx.lineWidth = 3 + Math.sin(time * 2) * 1;
  ctx.setLineDash([5, 5]);
  ctx.lineDashOffset = -time * 15;
  ctx.beginPath();
  ctx.moveTo(0, maxY);
  ctx.lineTo(width, maxY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw animated label
  ctx.fillStyle = `rgba(76, 175, 80, ${0.7 + Math.sin(time * 3) * 0.3})`;
  ctx.font = 'bold 13px Arial';
  ctx.shadowColor = 'rgba(76, 175, 80, 0.4)';
  ctx.shadowBlur = 8;
  ctx.fillText(`Max Height: ${trajectoryData.maxHeight.toFixed(2)} m`, 10, maxY - 10);
  ctx.shadowColor = 'transparent';
};

const drawAnimatedGround = (ctx, width, height) => {
  const time = Date.now() * 0.0005;
  
  // Draw ground with gradient
  const groundGradient = ctx.createLinearGradient(0, height - 50, 0, height);
  groundGradient.addColorStop(0, '#8B7355');
  groundGradient.addColorStop(1, '#6B5344');
  ctx.fillStyle = groundGradient;
  ctx.fillRect(0, height - 50, width, 50);

  // Draw animated grass
  ctx.strokeStyle = `rgba(76, 175, 80, ${0.5 + Math.sin(time * 3) * 0.2})`;
  ctx.lineWidth = 2;
  ctx.shadowColor = 'rgba(76, 175, 80, 0.3)';
  ctx.shadowBlur = 4;
  
  for (let i = 0; i < width; i += 20) {
    const sway = Math.sin(time * 3 + i * 0.1) * 3;
    ctx.beginPath();
    ctx.moveTo(i, height - 50);
    ctx.lineTo(i - 5 + sway, height - 60 + Math.sin(time * 4 + i) * 2);
    ctx.stroke();
  }
  
  ctx.shadowColor = 'transparent';
};

// Particle system functions
const createParticles = (particles, point, width, height) => {
  const scale = 4;
  const startX = 50;
  const startY = height - 50;

  const x = startX + point.x * scale;
  const y = startY - point.y * scale;

  for (let i = 0; i < 2; i++) {
    particles.push({
      x: x + (Math.random() - 0.5) * 4,
      y: y + (Math.random() - 0.5) * 4,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 2 - 1,
      life: 1,
      decay: Math.random() * 0.02 + 0.01,
      color: `hsla(${Math.random() * 60 + 340}, 100%, 50%, 0.8)`
    });
  }
};

const updateParticles = (particles, ctx) => {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.1; // gravity
    p.life -= p.decay;

    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
};

const drawParticles = (particles, ctx) => {
  for (const p of particles) {
    ctx.fillStyle = p.color.replace(/[\d.]+\)/, (p.life * 0.8).toFixed(2) + ')');
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
};

const drawAnimatedClouds = (ctx, width, height) => {
  const time = Date.now() * 0.0001;
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  
  // Draw clouds that move slowly
  for (let i = 0; i < 3; i++) {
    const x = ((time * 20 + i * 200) % (width + 100)) - 50;
    const y = 80 + i * 120;
    
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.arc(x + 50, y - 20, 50, 0, Math.PI * 2);
    ctx.arc(x + 100, y, 40, 0, Math.PI * 2);
    ctx.fill();
  }
};

export default Canvas;
