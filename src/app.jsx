import Router from 'preact-router'
import './app.css'
import Home from './pages/Home'

export function App() {

  return (
    <Router>
      <Home path="/"/>
    </Router>
  )
}
