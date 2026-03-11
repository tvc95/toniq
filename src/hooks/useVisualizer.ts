import { useRef, useEffect, useCallback } from 'react'
import * as Tone from 'tone'

export function useVisualizer(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationIdRef = useRef<number>(0);
  const isRunningRef = useRef<boolean>(false);

  // Conecta o AnalyserNode ao destino do Tone.js
  const setup = useCallback(() => {
    const audioContext = Tone.getContext().rawContext as AudioContext;
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.8;

    // Conecta entre o Tone.js destination e a saída de áudio
    Tone.getDestination().connect(analyser as unknown as Tone.ToneAudioNode);
    analyserRef.current = analyser;
  }, []);

  // Starts animation
  const start = useCallback(() => {
    if (isRunningRef.current || !canvasRef.current) return;

    if (!analyserRef.current) {
      setup();
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const analyser = analyserRef.current!;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    isRunningRef.current = true;

    const draw = () => {
      if (!isRunningRef.current) return;

      animationIdRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      // Fundo
      ctx.fillStyle = '#0F0F13';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Linha central tracejada
      ctx.setLineDash([4, 8]);
      ctx.strokeStyle = '#2E2E45';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Desenha a forma de onda
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#6C63FF';
      ctx.shadowBlur  = 8;
      ctx.shadowColor = '#6C63FF';
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    draw();

  }, [ canvasRef, setup ]);
}