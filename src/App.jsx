import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './index.css'
import InitialForm from './components/InitialForm.jsx'
import ResultPage from './components/ResultPage.jsx'
import SecondaryForm from './components/SecondaryForm.jsx'
import { getAIResponse, Setup } from './utils/config.js'
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route, useLocation } from 'react-router-dom'

// Animated page wrapper
function AnimatedPage({ children }) {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        style={{ width: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  const [mainInfo, setMainInfo] = useState({})
  const [personalizedInfo, setPersonalizedInfo] = useState([])

  console.log(mainInfo, personalizedInfo)
  
  const Reset = () => {
    setMainInfo({})
    setPersonalizedInfo([])
  }

  const router = createBrowserRouter(createRoutesFromElements(
    <>
      <Route 
        path='/' 
        element={
          <AnimatedPage>
            <InitialForm func={setMainInfo} />
          </AnimatedPage>
        }
      />
      <Route 
        path='/form2' 
        element={
          <AnimatedPage>
            <SecondaryForm
              personalizedInfo={personalizedInfo} 
              mainInfo={mainInfo} 
              func2={setMainInfo} 
              func={setPersonalizedInfo} 
            />
          </AnimatedPage>
        }
      />
      <Route
        path='/result'
        element={
          <AnimatedPage>
            <ResultPage 
              func={Reset}
              personalizedInfo={personalizedInfo}
              mainInfo={mainInfo}
            />
          </AnimatedPage>
        }
      />
    </>
  ))

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <RouterProvider router={router} />
    </motion.main>
  )
}

export default App
