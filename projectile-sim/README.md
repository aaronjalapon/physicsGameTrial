# Projectile Motion Physics Simulator 🎯

A beautiful, interactive React.js application that simulates projectile motion with real-time visualization and precise measurements.

## Features ✨

- **Interactive Simulation**: Launch projectiles with custom parameters
- **Real-time Visualization**: Watch projectiles follow accurate physics trajectories
- **Multi-Planet Support**: Simulate gravity on Earth, Moon, Mars, and Jupiter
- **Precise Measurements**: Track max height, range, time of flight, and impact velocity
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Physics Formulas**: Educational display of underlying physics equations
- **Velocity Vectors**: Visualize velocity components during flight

## Physics Concepts Demonstrated

- **Projectile Motion**: Combination of horizontal and vertical motion
- **Parabolic Trajectory**: Path followed by projectile under gravity
- **Maximum Height**: Peak of the trajectory
- **Range**: Horizontal distance traveled
- **Impact Velocity**: Speed and angle at landing
- **Effects of Gravity**: How different planetary gravities affect motion

## Parameters 🎮

- **Initial Velocity** (10-100 m/s): Speed at which projectile is launched
- **Launch Angle** (0-90°): Angle relative to horizontal
- **Initial Height** (0-50 m): Starting height above ground
- **Environment**: Choose between Earth, Moon, Mars, or Jupiter

## Installation

1. Navigate to the project directory:
```bash
cd projectile-sim
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Project Structure

```
projectile-sim/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Canvas.js          # Trajectory visualization
│   │   ├── Canvas.css
│   │   ├── Controls.js        # Parameter controls
│   │   ├── Controls.css
│   │   ├── Measurements.js    # Results display
│   │   └── Measurements.css
│   ├── App.js                 # Main application logic
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Key Physics Formulas

### Maximum Height
$$h_{max} = \frac{v_0^2 \sin^2\theta}{2g}$$

### Range (Horizontal Distance)
$$R = \frac{v_0^2 \sin(2\theta)}{g}$$

### Time of Flight
$$t = \frac{2v_0 \sin\theta}{g}$$

### Velocity Components
- Horizontal: $v_x = v_0 \cos\theta$
- Vertical: $v_y = v_0 \sin\theta - gt$

## Learning Objectives

Students can use this simulator to:
- Understand how velocity and angle affect projectile motion
- Observe the parabolic nature of trajectories
- Compare motion across different gravity environments
- Verify physics formulas through experimentation
- Develop intuition about kinematic concepts

## Technologies Used

- **React 18**: UI framework
- **HTML5 Canvas**: Graphics rendering
- **CSS3**: Styling with gradients and animations
- **Vanilla JavaScript**: Physics calculations

## Future Enhancements

- Air resistance modeling
- Trajectory comparison tools
- Data export (CSV)
- Custom gravity input
- Slow-motion playback
- More planet options
- Scoring/gamification system
- Wind effects simulation

## License

This project is open source and available for educational use.

## Contributing

Feel free to submit issues and enhancement requests!

---

Made with ❤️ for Physics Education
