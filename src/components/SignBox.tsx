import { useEffect, useRef, useState } from "react"


const SignBox = () => {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {

    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = 500
    canvas.height = 500

    const context = canvas.getContext("2d")
    if (!context) return;
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context
  }, []);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = event.nativeEvent;
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

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const { offsetX, offsetY } = event.nativeEvent
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
      />
      <div className="tools">
        <button onClick={clearCanvas}>Borrar todo</button>
        <button onClick={saveAsImage}>Guardar como imagen</button>
      </div>
    </div>
  );

}

export default SignBox