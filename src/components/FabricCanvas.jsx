import React, { useEffect, useRef } from 'react';
import { Canvas, Rect, Circle, Triangle, Ellipse, Polygon } from 'fabric';

const FabricCanvas = ({ onObjectClicked }, ref) => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  useEffect(() => {
    const canvas = new Canvas(canvasRef.current, {
      width: 800,
      height: 500,
      backgroundColor: 'transparent',
    });
    fabricRef.current = canvas;

    const handleSelection = (options) => {
      if (options.selected && options.selected.length > 0) {
        const selectedObject = options.selected[0];
        onObjectClicked({
          type: selectedObject.type,
          left: Math.round(selectedObject.left),
          top: Math.round(selectedObject.top),
        });
      }
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);

    return () => {
      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.dispose();
    };
  }, [onObjectClicked]);

  const addShape = (shapeType) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    
    let shape;
    const randomPos = () => Math.floor(Math.random() * 400) + 50;

    const commonOptions = {
      selectable: true,
      hasControls: true,
    };

    switch (shapeType) {
      case 'rectangle':
        shape = new Rect({ ...commonOptions, left: randomPos(), top: randomPos(), fill: '#ff5733', width: 100, height: 60 });
        canvas.add(shape);
        break;
      case 'circle':
        shape = new Circle({ ...commonOptions, left: randomPos(), top: randomPos(), fill: '#33c1ff', radius: 40 });
        canvas.add(shape);
        break;
      case 'triangle':
        shape = new Triangle({ ...commonOptions, left: randomPos(), top: randomPos(), fill: '#b833ff', width: 80, height: 80 });
        canvas.add(shape);
        break;
      case 'ellipse':
        shape = new Ellipse({ ...commonOptions, left: randomPos(), top: randomPos(), fill: '#33ff57', rx: 50, ry: 30 });
        canvas.add(shape);
        break;
      case 'star':
        shape = new Polygon([
            { x: 0, y: -50 }, { x: 14, y: -20 }, { x: 47, y: -15 }, { x: 23, y: 7 },
            { x: 29, y: 40 }, { x: 0, y: 25 }, { x: -29, y: 40 }, { x: -23, y: 7 },
            { x: -47, y: -15 }, { x: -14, y: -20 }
          ], { ...commonOptions, left: randomPos(), top: randomPos(), fill: '#ffd700' });
        canvas.add(shape);
        break;
      default:
        return;
    }
  };

  const deleteSelected = () => {
    const canvas = fabricRef.current;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  };

  React.useImperativeHandle(ref, () => ({
    addShape,
    deleteSelected,
  }));

  return <canvas ref={canvasRef} />;
};

export default React.forwardRef(FabricCanvas);