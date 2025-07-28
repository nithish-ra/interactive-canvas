import React, { useState, useRef, useEffect, useCallback } from 'react';
import FabricCanvas from './components/FabricCanvas';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles"; 
import { FaRegSquare, FaRegCircle, FaHeart, FaStar, FaTrashAlt } from 'react-icons/fa';
import { BsTriangle, BsDash } from 'react-icons/bs';

function App() {
  const [init, setInit] = useState(false);
  const [events, setEvents] = useState([]);
  const canvasRef = useRef(null);
  const eventLogRef = useRef(null);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const handleObjectClicked = useCallback((data) => {
    const newEvent = {
      ...data,
      timestamp: new Date().toLocaleTimeString(),
    };
    setEvents(prevEvents => [newEvent, ...prevEvents]);

    if (eventLogRef.current) {
        eventLogRef.current.scrollTop = 0;
    }
  }, []); 
  
  const addShapeToCanvas = (shapeType) => {
    if (canvasRef.current) {
      canvasRef.current.addShape(shapeType);
    }
  };

  const deleteSelectedShape = () => {
    if (canvasRef.current) {
      canvasRef.current.deleteSelected();
    }
  };

  if (!init) {
    return null;
  }

  return (
    <div className="main-container">
      <Particles
        id="tsparticles"
        options={{
          background: {
            color: { value: "#121212" },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "grab",
              },
              resize: true,
            },
            modes: {
              grab: {
                distance: 140,
                links: { opacity: 1 },
              },
            },
          },
          particles: {
            color: { value: "#ffffff" },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: { default: "bounce" },
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: { enable: true, area: 800 },
              value: 80,
            },
            opacity: { value: 0.5 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 5 } },
          },
          detectRetina: true,
        }}
      />
      
      <div>
        <h1>🎨 Fabric.js Creative Canvas</h1>
        <p>Design your canvas by adding, moving, and deleting shapes.</p>
        
        <div className="controls">
          <button onClick={() => addShapeToCanvas('rectangle')}><FaRegSquare /> Rectangle</button>
          <button onClick={() => addShapeToCanvas('circle')}><FaRegCircle /> Circle</button>
          <button onClick={() => addShapeToCanvas('triangle')}><BsTriangle /> Triangle</button>
          <button onClick={() => addShapeToCanvas('ellipse')}><BsDash /> Ellipse</button>
          <button onClick={() => addShapeToCanvas('star')}><FaStar /> Star</button>
          <button onClick={deleteSelectedShape} className="delete-button"><FaTrashAlt /> Delete</button>
        </div>

        <div className="canvas-container">
          <FabricCanvas ref={canvasRef} onObjectClicked={handleObjectClicked} />
        </div>

        <div className="event-log-container">
          <h2>🖱️ Click Event Log</h2>
          <div className="event-log" ref={eventLogRef}>
            {events.length === 0 ? (
              <p>Click a shape to begin...</p>
            ) : (
              events.map((event, index) => (
                <p key={index}>
                  [{event.timestamp}] - Clicked a <span>{event.type}</span> at position (X: {event.left}, Y: {event.top})
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;