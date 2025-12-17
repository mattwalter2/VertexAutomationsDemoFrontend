import { useState } from 'react'
import './App.css'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import Dashboard from './pages/Dashboard'
import Appointments from './pages/Appointments'
import FollowUps from './pages/FollowUps'
import Patients from './pages/Patients'
import Leads from './pages/Leads'
import Calls from './pages/Calls'
import AdAnalytics from './pages/AdAnalytics'
import UniversalInbox from './pages/UniversalInbox'
import Login from './pages/Login'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentPage, setCurrentPage] = useState('dashboard')

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />
      case 'appointments':
        return <Appointments />
      case 'followups':
        return <FollowUps />
      case 'patients':
        return <Patients />
      case 'leads':
        return <Leads />
      case 'calls':
        return <Calls />
      case 'analytics':
        return <AdAnalytics />
      case 'inbox':
        return <UniversalInbox />
      default:
        return <Dashboard onNavigate={setCurrentPage} />
    }
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

export default App
