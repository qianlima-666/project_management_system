import * as React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProjectList from './pages/ProjectList'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'

const App: React.FC = () => {
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