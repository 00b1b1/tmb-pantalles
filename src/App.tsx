import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Credits from './pages/Credits'
import Documentation from './pages/Documentation'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/docs" element={<Documentation />} />
      </Routes>
    </Router>
  )
}

export default App
