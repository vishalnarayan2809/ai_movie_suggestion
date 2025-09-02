import PopCorn from '../assets/pop_corn.png'

export default function QuestionForm({func}){


    const handleForm = (formData)=>{
        let data = {}
        for (const [key, value] of formData) {
            data[key] = value
        }
        func(data)

    }

    return <div id="question-page">
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
           <label>
           Are you in the mood for something new or a classic?
             <textarea name='genre'
             className='input' 
             placeholder='I want to watch movies that were released after 1990'>
            </textarea>
           </label>
           <label>
           Do you wanna have fun or do you want something serious?
             <textarea name='mood'
             className='input' 
             placeholder='I want to watch something stupid and fun'>
            </textarea>
           </label>
           <button>Let's Go</button>
        </form>
    </div>
}