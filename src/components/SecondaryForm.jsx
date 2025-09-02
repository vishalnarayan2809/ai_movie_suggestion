import PopCorn from '../assets/pop_corn.png'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
export default function SecondaryForm({func,mainInfo,func2,personalizedInfo}){

    const navigate = useNavigate()
    const count = mainInfo.people_count
    const handleForm = (formData)=>{
        let data = {}
        for (const [key, value] of formData) {
            data[key] = value
            data.user = personalizedInfo.length + 1 
        }
        func(prev =>(
            [
                ...prev,
                data,
                
            ]
        ))
        if(count != 0){
            func2(prev => ({
            ...prev,
            people_count: prev.people_count - 1
        }))
        }
      
    }


     useEffect(() => {  // Add useEffect for navigation
        if(count <= 0){
            navigate('/result')
        }
    }, [count, navigate]) 

    return  <div id="question-page">
            <img src={PopCorn} id='popcorn' alt='An image of a Pop corn with a face'></img>
            <h1 id="logo">PopChoice</h1>
             <form action={handleForm}>
           <label>
            What’s your favorite movie and why?
             <textarea name='favourite_movie'
             className='input' 
             placeholder='The Shawshank Redemption Because it taught me to never give up hope no matter how hard life gets'>
            </textarea>
           </label>

        <div className='button-container' id='type'>
        <p>Are you in the mood for something new or a classic?</p>
        <div className="button-checkbox">
        <input type="radio" id="new" name="type" value="new"></input>  {/* Changed to radio */}
            <label htmlFor="new">New</label>
        </div>
        <div className="button-checkbox">
        <input type="radio" id="classic" name="type" value="classic"></input>  {/* Changed to radio */}
        <label htmlFor="classic"> Classic</label>
            </div>
            </div>
            <div className='button-container'>
        <p>What are you in the mood for?</p>
        <div className="button-checkbox" id='mood'>
        <input type="radio" id="fun" name="mood" value="fun"></input>  {/* Changed to radio */}
            <label htmlFor="fun">Fun</label>
        </div>
        <div className="button-checkbox">
        <input type="radio" id="serious" name="mood" value="serious"></input>  {/* Changed to radio */}
        <label htmlFor="serious">Serious</label>
            </div>
            <div className="button-checkbox">
        <input type="radio" id="inspiring" name="mood" value="inspiring"></input>  {/* Changed to radio */}
        <label htmlFor="inspiring">Inspiring</label>
            </div>
            <div className="button-checkbox">
        <input type="radio" id="scary" name="mood" value="scary"></input>  {/* Changed to radio; note: duplicate ID fixed in previous response */}
        <label htmlFor="scary">Scary</label>
            </div>
            </div>
            <label>
           Which famous film person would you love to be stranded on an island with and why?
             <textarea name='favourite_movie'
             className='input' 
             placeholder='Which famous film person would you love to be stranded on an island with and why?'>
            </textarea>
           </label>
           <button>Let's Go</button>
        </form>
            </div>
}