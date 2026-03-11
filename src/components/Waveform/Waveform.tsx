import { useRef, useEffect } from "react";
import { useVisualizer } from "../../hooks/useVisualizer";

interface WaveformProps {
  isPlaying: boolean;
}

/**
 * Component that renders a canvas element to display the audio waveform visualization.
 * @param param0 
 * @returns 
 */
export function Waveform({ isPlaying }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { start, stop } = useVisualizer(canvasRef);

  useEffect(() => {
    if (isPlaying) {
      start();
    } else {
      stop();
    }
  }, [isPlaying, start, stop]);

  return (
    <canvas
      ref={canvasRef}
      width={380}
      height={80}
      style={{ 
        width: "100%", 
        height: "80px",
        borderRadius: "10px",
        border: "1px solid var(--color-border)"
      }}
    />
  );
}