import PopCorn from '../assets/pop_corn.png'
import { useNavigate } from 'react-router-dom'

export default function InitialForm({func}){

        const navigate = useNavigate()
    const handleForm = (formData)=>{
        let data = {}
        for (const [key, value] of formData) {
            data[key] = value
        }
        func(data)
        navigate('/form2')
    }

    return <div id="question-page">
        <img src={PopCorn} id='popcorn' alt='An image of a Pop corn with a face'></img>
        <h1 id="logo">PopChoice</h1>
        <form action={handleForm}>
            <input name='people_count'
            type='number'
            className='input' 
            placeholder='How many people are you watching with?'>
           </input>
           <input 
            name='time'
            type='text'
            className='input' 
            placeholder='How much time do you have?'>
           </input>
           <button>Start</button>
        </form>
    </div>
}

 