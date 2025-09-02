import PopCorn from '../assets/pop_corn.png'

export default function ResultPage({result,func}){
  return <div id="question-page">
    <img src={PopCorn} id='popcorn' alt='An image of a Pop corn with a face'></img>
    <h1 id="logo">PopChoice</h1>
    <h2 style={{whiteSpace:'pre-line'}}>
      {result || 'No result'}
    </h2>
    <button onClick={func}>Go Again</button>
  </div>
}