import { useState,useEffect } from 'react'
import './index.css'
import QuestionForm  from './components/QuestionForm'
import ResultPage from './components/ResultPage.jsx'
import { getAIResponse } from './utils/config.js'

function App() {



  const[formData,setFormData] = useState(null)
  const[result,setResult] = useState(null)
  const [loading,setLoading] = useState(false)
  
  const Reset = ()=>{
    setFormData(null)
    setResult(null)
  }
  
    useEffect(()=>{
    if(formData){
      (async ()=>{
        setLoading(true);
        const answer = await getAIResponse(formData);
        setResult(answer);
        setLoading(false);
      })();
    }
  },[formData])

  return (
    <>
    <main>
      {loading && !result && <h2>Loading...</h2>}
      {!loading && result && <ResultPage result={result} func={Reset} />}
      {!loading && !result && <QuestionForm func={setFormData} />}
    </main>
    </>
  )
}

export default App
