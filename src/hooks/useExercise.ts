import type { Difficulty, ExerciseConfig, ExerciseResult, Question } from '../types/db'

import { useState, useRef, useCallback } from 'react'
import { generateQuestion } from '../audio/generateQuestion'
import { evaluateDifficulty } from '../audio/adaptiveDifficulty'
import { useProgress } from './useProgress'
import { playInterval, playChord, playProgression, stopAll } from '../audio/AudioEngine'

interface ExerciseState {
  status: 'idle' | 'playing' | 'answered' | 'finished'
  current: Question | null
  questionIndex: number
  results: ExerciseResult[]
  score: number
  difficulty: Difficulty
}

/**
 * Hook that manages the state of an ear training exercise session.
 * Provides functions to start the session, answer questions, and replay the current question.
 * The state includes user progress, score, and adaptive difficulty.
 * @param config
 * @returns an object containing the current exercise state and functions to control the session.
 */
export function useExercise(config: ExerciseConfig) {
  const { saveSession } = useProgress()

  const [state, setState] = useState<ExerciseState>({
    status: 'idle',
    current: null,
    questionIndex: 0,
    results: [],
    score: 0,
    difficulty: config.difficulty,
  })

  const startedAt = useRef<number>(0)

  const playCurrentQuestion = useCallback(
    async (question: Question) => {
      if (config.mode === 'intervals') {
        await playInterval(
          question.rootNote,
          question.correct,
          question.playMode as 'ascending' | 'descending' | 'harmonic'
        )
      } else if (config.mode === 'chords') {
        await playChord(
          question.rootNote,
          question.correct,
          question.playMode as 'block' | 'arpeggio'
        )
      } else if (config.mode === 'progressions' && question.progression) {
        await playProgression(question.progression, 80)
      }
    },
    [config.mode]
  )

  const startSession = useCallback(async () => {
    const question = generateQuestion({
      ...config,
      difficulty: config.difficulty,
    })
    startedAt.current = Date.now()

    setState({
      status: 'playing',
      current: question,
      questionIndex: 0,
      results: [],
      score: 0,
      difficulty: config.difficulty,
    })

    await playCurrentQuestion(question)
  }, [config, playCurrentQuestion])

  const replay = useCallback(async () => {
    if (state.current) await playCurrentQuestion(state.current)
  }, [state.current, playCurrentQuestion])

  const answer = useCallback(
    (userAnswer: string) => {
      if (!state.current || state.status !== 'playing') return

      stopAll()

      const isCorrect = userAnswer === state.current.correct
      const responseTime = Date.now() - startedAt.current
      const points = isCorrect ? 10 : -3

      const result: ExerciseResult = {
        question: state.current,
        userAnswer,
        isCorrect,
        responseTime_ms: responseTime,
      }

      const newResults = [...state.results, result]
      const newScore = Math.max(0, state.score + points)
      const newDifficulty = evaluateDifficulty(newResults, state.difficulty)
      const isLast = state.questionIndex + 1 >= config.totalQuestions

      if (isLast) {
        const sessionData = {
          session: {
            date: new Date().toISOString(),
            mode: config.mode,
            score: newScore,
            total: config.totalQuestions,
            duration_ms: Date.now() - startedAt.current,
          },
          answers: newResults.map(result => ({
            question: result.question.correct,
            correct_answer: result.question.correct,
            user_answer: result.userAnswer,
            response_time_ms: result.responseTime_ms,
          })),
        }

        saveSession(sessionData)

        setState(s => ({
          ...s,
          status: 'finished',
          results: newResults,
          score: newScore,
          difficulty: newDifficulty,
        }))
        return
      }

      setState(s => ({
        ...s,
        status: 'answered',
        results: newResults,
        score: newScore,
        difficulty: newDifficulty,
        current: { ...s.current!, _feedback: isCorrect } as any,
      }))

      setTimeout(async () => {
        const next = generateQuestion({ ...config, difficulty: newDifficulty })
        startedAt.current = Date.now()
        setState(s => ({
          ...s,
          status: 'playing',
          current: next,
          questionIndex: s.questionIndex + 1,
        }))
        await playCurrentQuestion(next)
      }, 1500)
    },
    [state, config, playCurrentQuestion]
  )

  return {
    ...state,
    startSession,
    replay,
    answer,
  }
}
