import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { ToyIndex } from './pages/ToyIndex.jsx'
import { ToyDetails } from './pages/ToyDetails.jsx'
import { ToyEdit } from './pages/ToyEdit.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { AboutUs } from './pages/AboutUs.jsx'
import { AppHeader } from './cmps/AppHeader'
import { Dashboard } from './pages/Dashboard'
import { Loader } from './cmps/Loader'
import { LoginSignup } from './cmps/LoginSignup.jsx'
import { UserMsg } from './cmps/UserMsg.jsx'
import { UserDetails } from './pages/UserDetails.jsx'
import { ReviewExplore } from './pages/ReviewExplore.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { socketService } from './services/socket.service.js'
import { showSuccessMsg } from './services/event-bus.service.js'


export function App() {

  const [isLoading, setIsLoading] = useState(true)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsFading(true)
      setTimeout(() => setIsLoading(false), 600)
    }, 1800)

    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    socketService.on('admin-updated', msg => {
      console.log('📢 Admin updated toy:', msg)
      showSuccessMsg(msg) // or use your own toast/alert/modal here
    })

    return () => {
      socketService.off('admin-updated')
    }
  }, [])
  
  return (
    <Provider store={store}>
      <Router>
        <section className="app">
          {isLoading && <Loader isFading={isFading} />}

          <div className={`app-content ${isLoading ? 'blurred' : ''}`}>
            <AppHeader />
            <main className="main-layout">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/toy" element={<ToyIndex />} />
                <Route path="/toy/:toyId" element={<ToyDetails />} />
                <Route path="/toy/edit" element={<ToyEdit />} />
                <Route path="/toy/edit/:toyId" element={<ToyEdit />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<LoginSignup />} />
                <Route path="/user" element={<UserDetails />} />
                <Route path="/review" element={<ReviewExplore />} />
              </Routes>
            </main>
            <AppFooter />
          </div>
          <UserMsg />
        </section>
      </Router>
    </Provider>
  )
}