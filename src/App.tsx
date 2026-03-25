import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import HistoryPage from './pages/HistoryPage/HistoryPage'
import Exercise from './pages/Exercise/Exercise'
import Results from './pages/Results/Results'
import AchievementsPage from './pages/Achievements/Achievements'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/exercise" element={<Exercise />} />
      <Route path="/results" element={<Results />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/achievements" element={<AchievementsPage />} />
    </Routes>
  )
}
