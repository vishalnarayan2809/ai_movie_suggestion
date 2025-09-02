import React from 'react'
import PopCorn from '../assets/pop_corn.png'
import { useNavigate } from 'react-router-dom'

import { getAIResponse } from '../utils/config'
import { load } from 'langchain/load'

export default function ResultPage({result,func,personalizedInfo,mainInfo}){
  const[response,setResponse] = React.useState(null)
  const [parsed,setParsed] = React.useState(null);
  const[movieArr,setMovieArr] = React.useState([])
  const[movieCount,setMovieCount] = React.useState(0)
  const[loading,setLoading] = React.useState(true)
  const navigate = useNavigate()
  const finalUserPreferences= 
    {
      personalizedInfoOfEachUser:personalizedInfo,
      numberOfPeopleWatching: personalizedInfo.length,
      preferredMovieDuration: mainInfo.time
    }
    React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const AIResponse = await getAIResponse(JSON.stringify(finalUserPreferences));
        setResponse(AIResponse);
        const obj = safeParseMovieArray(AIResponse);
        setParsed(obj);
      } catch (error) {
        setLoading(false)
        console.error('Error fetching data:', error);
        setResponse('Error loading response');
      }finally{
        setLoading(false)
      }
    };
    fetchData();
  }, []);
  
 React.useEffect(()=>{
    if (!Array.isArray(parsed) || parsed.length === 0) return;

    let cancelled = false;

    async function loadPosters(){
      try {
        setLoading(true)
        const withPosters = await Promise.all(
          parsed.map(async (obj) => {
            const title = encodeURIComponent(obj.movie_name);
            const res = await fetch(`https://www.omdbapi.com/?apikey=8b62d32c&s=${title}`);
            if (!res.ok) throw new Error('OMDb request failed');
            const data = await res.json();
            const poster = data?.Search?.[0]?.Poster || null;
            return { ...obj, moviePoster: poster };
          })
        );
        if (!cancelled) setMovieArr(withPosters);
      } catch (e) {
        setLoading(false)
        console.error('Poster fetch error', e);
        if (!cancelled) setMovieArr(parsed.map(o => ({ ...o, moviePoster: null })));
      }finally{
        setLoading(false)
      }
    }

    loadPosters();
    return () => { cancelled = true; };
  }, [parsed]);

  function safeParseMovieArray(str){
    if(!str) return null;
    let cleaned = str.trim();
    if ((cleaned.startsWith("'") && cleaned.endsWith("'")) ||
        (cleaned.startsWith('"') && cleaned.endsWith('"'))) {
      cleaned = cleaned.slice(1,-1);
    }
    try {
      return JSON.parse(cleaned);
    } catch {
      return null;
    }
  }


  
  console.log(movieArr)


    const handleOnClick = () => {
    if (movieCount < movieArr.length - 1) {
      setMovieCount(prev => prev + 1);
    } else {
      func();
      navigate("/");
    }
  };

  return (
    <div id="question-page">
      {loading || movieArr.length === 0
        ? "....Loading"
        : (
          <>
            <h1>{movieArr[movieCount]?.movie_name}</h1>
            {movieArr[movieCount]?.moviePoster &&
              <img src={movieArr[movieCount].moviePoster} alt={movieArr[movieCount].movie_name} />
            }
            <p>{movieArr[movieCount]?.choice_reason}</p>
            <button
        disabled={loading || movieArr.length === 0}
        onClick={handleOnClick}
      >
        {movieCount === movieArr.length - 1 ? "Reset" : "Next"}
      </button>
          </>
        )
      }
      
    </div>
  );
}