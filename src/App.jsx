import './App.css'
import HomePage from './pages/HomePage'
import HistoryPage from './pages/HistoryPage'
import DetailsPage from './pages/DetailsPage'
import { Routes,Route } from 'react-router-dom'
import Navbar from './components/Navbar'

function App() {
  
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/history" element={<HistoryPage />} />
        {/* <Route path="/history/:id" element={<DetailsPage/>}/> */}
      </Routes>
    </>
  )
}

export default App
