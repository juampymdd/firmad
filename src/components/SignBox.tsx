import { useEffect, useRef, useState } from "react"


const SignBox = () => {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {

    const canvas = canvasRef.current
    if (!canvas) return
    
    const media = window.matchMedia('(min-width: 768px)').matches;
    console.log({media})
    if(media){
      canvas.width = 700
      canvas.height = 500
    } else {
      canvas.width = 300
      canvas.height = 300
    }

    const context = canvas.getContext("2d")
    if (!context) return;
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context
  }, []);

  const getEventCoordinates = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return { offsetX: 0, offsetY: 0 };
    }

    if ("touches" in event) {
      const touch = event.touches[0];
      return { offsetX: touch.clientX - canvas.getBoundingClientRect().left, offsetY: touch.clientY - canvas.getBoundingClientRect().top };
    } else {
      return { offsetX: event.nativeEvent.offsetX, offsetY: event.nativeEvent.offsetY };
    }
  };

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } =getEventCoordinates(event);
    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
      setIsDrawing(true)
      event.nativeEvent.preventDefault()
    }
  };

  const finishDrawing = () => {
    if (!contextRef.current) return
    contextRef.current.closePath()
    setIsDrawing(false);
  }

  const draw = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const { offsetX, offsetY } = getEventCoordinates(event)
    if (!contextRef.current) return
    contextRef.current.lineTo(offsetX, offsetY)
    contextRef.current.stroke()
    event.nativeEvent.preventDefault()
  }

  const clearCanvas = () => {
    if (contextRef.current) {
      contextRef.current.clearRect(0, 0, canvasRef.current?.width || 0, canvasRef.current?.height || 0);
    }
  };

  const saveAsImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const imageDataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imageDataURL;
      link.download = "drawing.png";
      link.click();
    }
  };

  return (
    <div className="container">
      <canvas
        className="canvas-container"
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onMouseLeave={finishDrawing}
        onTouchStart={startDrawing}
        onTouchEnd={finishDrawing}
        onTouchMove={draw}
      />
      <div className="btn-container">
        <button onClick={clearCanvas}>Borrar todo</button>
        <button onClick={saveAsImage}>Guardar como imagen</button>
      </div>
    </div>
  );

}

export default SignBox