import { useState,useEffect } from 'react'
import './index.css'
import InitialForm  from './components/InitialForm.jsx'
import ResultPage from './components/ResultPage.jsx'
import SecondaryForm from './components/SecondaryForm.jsx'
import { getAIResponse , Setup} from './utils/config.js'
import { RouterProvider,createBrowserRouter,createRoutesFromElements,Route } from 'react-router-dom'


function App() {
 
  const[mainInfo,setMainInfo] = useState({})
  const[personalizedInfo,setPersonalizedInfo] = useState([])

  console.log(mainInfo,personalizedInfo)
   const Reset = ()=>{
    setMainInfo({});
    setPersonalizedInfo([]);
  }

  const router = createBrowserRouter(createRoutesFromElements(
   <>
     <Route path='/' 
     element={<InitialForm  
     func={setMainInfo} />}/>
    <Route path='/form2' 
    element={<SecondaryForm
      personalizedInfo={personalizedInfo} 
    mainInfo={mainInfo} 
    func2={setMainInfo} 
    func={setPersonalizedInfo} 
    />}

    />
    <Route
    
    path='/result'
    element={<ResultPage 
    func={Reset}
    personalizedInfo={personalizedInfo}
    mainInfo={mainInfo}
    />}/>
    </>
    
  ))
  return (
    <>
    <main>
      {<RouterProvider router={router}/>}
    </main>
    </>
  )
}

export default App
