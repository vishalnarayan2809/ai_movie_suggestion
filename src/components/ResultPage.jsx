import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconArrowRight, IconRefresh, IconStar, IconCalendar, IconClock } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { getAIResponse } from '../utils/config'
import LoadingSpinner from './LoadingSpinner'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.6,
            staggerChildren: 0.2
        }
    }
}

const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        x: -100,
        scale: 0.9,
        transition: { duration: 0.3 }
    }
}

const slideVariants = {
    enter: {
        x: 100,
        opacity: 0,
        scale: 0.9
    },
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    },
    exit: {
        x: -100,
        opacity: 0,
        scale: 0.9,
        transition: {
            duration: 0.3
        }
    }
}

export default function ResultPage({result, func, personalizedInfo, mainInfo}){
    const [response, setResponse] = React.useState(null)
    const [parsed, setParsed] = React.useState(null)
    const [movieArr, setMovieArr] = React.useState([])
    const [movieCount, setMovieCount] = React.useState(0)
    const [loading, setLoading] = React.useState(true)
    const navigate = useNavigate()
    
    const finalUserPreferences = {
        personalizedInfoOfEachUser: personalizedInfo,
        numberOfPeopleWatching: personalizedInfo.length,
        preferredMovieDuration: mainInfo.time
    }

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const AIResponse = await getAIResponse(JSON.stringify(finalUserPreferences))
                setResponse(AIResponse)
                const obj = safeParseMovieArray(AIResponse)
                setParsed(obj)
            } catch (error) {
                setLoading(false)
                console.error('Error fetching data:', error)
                setResponse('Error loading response')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    React.useEffect(() => {
        if (!Array.isArray(parsed) || parsed.length === 0) return

        let cancelled = false

        async function loadPosters(){
            try {
                setLoading(true)
                const withPosters = await Promise.all(
                    parsed.map(async (obj) => {
                        const title = encodeURIComponent(obj.movie_name)
                        const res = await fetch(`https://www.omdbapi.com/?apikey=8b62d32c&s=${title}`)
                        if (!res.ok) throw new Error('OMDb request failed')
                        const data = await res.json()
                        const poster = data?.Search?.[0]?.Poster || null
                        return { ...obj, moviePoster: poster }
                    })
                )
                if (!cancelled) setMovieArr(withPosters)
            } catch (e) {
                setLoading(false)
                console.error('Poster fetch error', e)
                if (!cancelled) setMovieArr(parsed.map(o => ({ ...o, moviePoster: null })))
            } finally {
                setLoading(false)
            }
        }

        loadPosters()
        return () => { cancelled = true }
    }, [parsed])

    function safeParseMovieArray(str){
        if(!str) return null
        let cleaned = str.trim()
        if ((cleaned.startsWith("'") && cleaned.endsWith("'")) ||
            (cleaned.startsWith('"') && cleaned.endsWith('"'))) {
            cleaned = cleaned.slice(1,-1)
        }
        try {
            return JSON.parse(cleaned)
        } catch {
            return null
        }
    }

    const handleOnClick = () => {
        if (movieCount < movieArr.length - 1) {
            setMovieCount(prev => prev + 1)
        } else {
            func()
            navigate("/")
        }
    }

    const currentMovie = movieArr[movieCount]

    if (loading || movieArr.length === 0) {
        return (
            <motion.div 
                className="glass-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <LoadingSpinner size={80} color="#3b82f6" />
            </motion.div>
        )
    }

    return (
        <div className="results-page-container">
            <motion.div 
                className="glass-container"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="results-container">
                    <motion.div 
                        className="results-header"
                        variants={cardVariants}
                    >
                        <h1 className="results-title">
                            🎬 Perfect Matches Found!
                        </h1>
                        <p className="results-subtitle">
                            Movie {movieCount + 1} of {movieArr.length} • Tailored just for you
                        </p>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={movieCount}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="movie-card"
                        >
                            {/* Gradient overlay */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '200px',
                                background: 'var(--gradient-accent)',
                                opacity: 0.1,
                                borderRadius: '20px 20px 0 0'
                            }} />

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: currentMovie?.moviePoster ? '1fr 2fr' : '1fr',
                                gap: '2rem',
                                alignItems: 'start',
                                position: 'relative',
                                zIndex: 1
                            }}>
                                {currentMovie?.moviePoster && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                        style={{ textAlign: 'center' }}
                                    >
                                        <img 
                                            src={currentMovie.moviePoster} 
                                            alt={currentMovie.movie_name}
                                            className="movie-poster"
                                        />
                                    </motion.div>
                                )}

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginBottom: '1rem'
                                    }}>
                                        <IconStar size={24} color="var(--accent-warning)" />
                                        <h2 className="movie-title">
                                            {currentMovie?.movie_name}
                                        </h2>
                                    </div>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="movie-description-box"
                                    >
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            marginBottom: '1rem',
                                            color: 'var(--accent-success)'
                                        }}>
                                            <IconCalendar size={20} />
                                            <span style={{ fontWeight: 600 }}>Why This Movie?</span>
                                        </div>
                                        <p className="movie-description">
                                            {currentMovie?.choice_reason}
                                        </p>
                                    </motion.div>
                                </motion.div>
                            </div>

                            {/* Progress indicator */}
                            <motion.div 
                                className="progress-bar-container"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            >
                                <motion.div
                                    className="progress-bar"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((movieCount + 1) / movieArr.length) * 100}%` }}
                                    transition={{ delay: 0.6, duration: 0.6 }}
                                />
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
            
            <motion.div
                className="button-footer"
                variants={cardVariants}
            >
                <motion.button
                    disabled={loading || movieArr.length === 0}
                    onClick={handleOnClick}
                    whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 12px 40px rgba(59, 130, 246, 0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="footer-button"
                    style={{
                        background: movieCount === movieArr.length - 1 
                            ? 'var(--gradient-secondary)' 
                            : 'var(--gradient-primary)'
                    }}
                >
                    {movieCount === movieArr.length - 1 ? (
                        <>
                            <IconRefresh size={20} />
                            Start Over
                        </>
                    ) : (
                        <>
                            Next Movie
                            <IconArrowRight size={20} />
                        </>
                    )}
                </motion.button>
            </motion.div>
        </div>
    )
}