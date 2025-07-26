import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProjectList from './pages/ProjectList'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import './App.css'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ProjectList />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
