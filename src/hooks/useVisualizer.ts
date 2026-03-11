import { useRef, useEffect, useCallback } from 'react'
import * as Tone from 'tone'

/**
 * Hook for audio visualization using the Web Audio API's AnalyserNode.
 * Connects the AnalyserNode to the Tone.js destination and draws the waveform on a canvas.
 * @param canvasRef
 * @returns Functions to start and stop the visualization animation.
 */
export function useVisualizer(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationIdRef = useRef<number>(0)
  const isRunningRef = useRef<boolean>(false)

  /**
   * Sets up the AnalyserNode and connects it to the Tone.js destination.
   * Must be called before starting the animation.
   */
  const setup = useCallback(() => {
    if (analyserRef.current) return
    const audioContext = Tone.getContext().rawContext as AudioContext
    const analyser = audioContext.createAnalyser()

    analyser.fftSize = 2048
    analyser.smoothingTimeConstant = 0.8

    // Conecta entre o Tone.js destination e a saída de áudio
    const destination = Tone.getDestination().output as unknown as AudioNode
    destination.connect(analyser)
    analyserRef.current = analyser
  }, [])

  /**
   * Starts the visualization animation.
   * Must be called after setup() to ensure the AnalyserNode is configured.
   */
  const start = useCallback(() => {
    if (!canvasRef.current) return
    if (isRunningRef.current) return

    if (!analyserRef.current) {
      setup()
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    const analyser = analyserRef.current!
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    isRunningRef.current = true

    const draw = () => {
      if (!isRunningRef.current) return

      animationIdRef.current = requestAnimationFrame(draw)
      analyser.getByteTimeDomainData(dataArray)

      // Background
      ctx.fillStyle = '#0F0F13'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Central dashed line
      ctx.setLineDash([4, 8])
      ctx.strokeStyle = '#2E2E45'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, canvas.height / 2)
      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.stroke()
      ctx.setLineDash([])

      const hasSignal = dataArray.some(value => value !== 128)

      // Draw waveform
      ctx.lineWidth = 2
      ctx.strokeStyle = hasSignal ? '#6C63FF' : '#2E2E45'
      ctx.shadowBlur = hasSignal ? 12 : 0
      ctx.shadowColor = '#6C63FF'
      ctx.beginPath()

      const sliceWidth = canvas.width / bufferLength
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = (v * canvas.height) / 2

        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)

        x += sliceWidth
      }

      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.stroke()
      ctx.shadowBlur = 0
    }

    draw()
  }, [canvasRef, setup])

  /**
   * Stops the visualization animation and starts a gradual fade-out effect.
   * Should be called to clean up the animation and connections when they are no longer needed.
   */
  const stop = useCallback(() => {
    isRunningRef.current = false
    cancelAnimationFrame(animationIdRef.current)

    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!

    ctx.fillStyle = `#0F0F13`
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.setLineDash([4, 8])
    ctx.strokeStyle = '#2E2E45'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, canvas.height / 2)
    ctx.lineTo(canvas.width, canvas.height / 2)
    ctx.stroke()
    ctx.setLineDash([])
  }, [canvasRef])

  useEffect(() => {
    return () => {
      isRunningRef.current = false
      cancelAnimationFrame(animationIdRef.current)
    }
  }, [])

  return { start, stop }
}
