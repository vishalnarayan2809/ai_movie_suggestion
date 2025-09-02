import { motion, AnimatePresence } from 'framer-motion'
import { IconHeart, IconStars, IconMoodHappy, IconUser, IconSparkles } from '@tabler/icons-react'
import PopCorn from '../assets/pop_corn.png'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.6,
            staggerChildren: 0.15
        }
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        transition: { duration: 0.4 }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 }
    }
}

const progressVariants = {
    hidden: { scaleX: 0 },
    visible: {
        scaleX: 1,
        transition: { duration: 1, ease: "easeOut" }
    }
}

export default function SecondaryForm({func, mainInfo, func2, personalizedInfo}){
    const navigate = useNavigate()
    const count = mainInfo.people_count
    const currentUser = personalizedInfo.length + 1
    const totalUsers = parseInt(mainInfo.people_count) + personalizedInfo.length
    
    const handleForm = (formData) => {
        let data = {}
        for (const [key, value] of formData) {
            data[key] = value
            data.user = personalizedInfo.length + 1 
        }
        func(prev => ([
            ...prev,
            data,
        ]))
        if(count != 0){
            func2(prev => ({
                ...prev,
                people_count: prev.people_count - 1
            }))
        }
    }

    useEffect(() => {
        if(count <= 0){
            navigate('/result')
        }
    }, [count, navigate]) 

    const progressPercentage = ((totalUsers - count) / totalUsers) * 100

    return (
        <AnimatePresence mode="wait">
            <motion.div 
                className="glass-container"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                key={currentUser}
            >
                <div id="question-page">
                    {/* Progress indicator */}
                    <motion.div 
                        variants={itemVariants}
                        style={{
                            width: '100%',
                            height: '4px',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '2px',
                            overflow: 'hidden',
                            marginBottom: '1rem'
                        }}
                    >
                        <motion.div
                            variants={progressVariants}
                            style={{
                                height: '100%',
                                background: 'var(--gradient-primary)',
                                borderRadius: '2px',
                                transformOrigin: 'left'
                            }}
                            initial={{ width: `${progressPercentage - (100/totalUsers)}%` }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 0.8 }}
                        />
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '1rem',
                            color: 'var(--text-secondary)'
                        }}
                    >
                        <IconUser size={20} />
                        <span>Person {currentUser} of {totalUsers}</span>
                    </motion.div>

                    <motion.img 
                        src={PopCorn} 
                        id='popcorn' 
                        alt='An image of a Pop corn with a face'
                        variants={itemVariants}
                        whileHover={{ 
                            scale: 1.1,
                            rotate: [0, -5, 5, -5, 0],
                            transition: { duration: 0.4 }
                        }}
                    />
                    
                    <motion.h1 
                        id="logo"
                        variants={itemVariants}
                    >
                        Tell Us About You
                    </motion.h1>
                    
                    <motion.form 
                        action={handleForm}
                        variants={itemVariants}
                    >
                        <motion.label
                            variants={itemVariants}
                            whileHover={{ scale: 1.01 }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <IconHeart size={20} color="var(--accent-secondary)" />
                                What's your favorite movie and why?
                            </div>
                            <motion.textarea 
                                name='favourite_movie'
                                className='input' 
                                placeholder='The Shawshank Redemption - it taught me to never give up hope no matter how hard life gets'
                                rows="4"
                                required
                                whileFocus={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            />
                        </motion.label>

                        <motion.div 
                            className='button-container' 
                            id='type'
                            variants={itemVariants}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <IconStars size={20} color="var(--accent-primary)" />
                                <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '1rem', margin: 0 }}>Are you in the mood for something new or a classic?</span>
                            </div>
                            
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <motion.div 
                                    className="button-checkbox"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <input type="radio" id={`new-${currentUser}`} name="type" value="new" />
                                    <label htmlFor={`new-${currentUser}`}>✨ New & Fresh</label>
                                </motion.div>
                                <motion.div 
                                    className="button-checkbox"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <input type="radio" id={`classic-${currentUser}`} name="type" value="classic" />
                                    <label htmlFor={`classic-${currentUser}`}>🎬 Classic & Timeless</label>
                                </motion.div>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            className='button-container'
                            variants={itemVariants}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <IconMoodHappy size={20} color="var(--accent-success)" />
                                <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '1rem', margin: 0 }}>What are you in the mood for?</span>
                            </div>
                            
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <motion.div 
                                    className="button-checkbox"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <input type="radio" id={`fun-${currentUser}`} name="mood" value="fun" />
                                    <label htmlFor={`fun-${currentUser}`}>😄 Fun & Light</label>
                                </motion.div>
                                <motion.div 
                                    className="button-checkbox"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <input type="radio" id={`serious-${currentUser}`} name="mood" value="serious" />
                                    <label htmlFor={`serious-${currentUser}`}>🎭 Serious & Deep</label>
                                </motion.div>
                                <motion.div 
                                    className="button-checkbox"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <input type="radio" id={`inspiring-${currentUser}`} name="mood" value="inspiring" />
                                    <label htmlFor={`inspiring-${currentUser}`}>💫 Inspiring</label>
                                </motion.div>
                                <motion.div 
                                    className="button-checkbox"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <input type="radio" id={`scary-${currentUser}`} name="mood" value="scary" />
                                    <label htmlFor={`scary-${currentUser}`}>👻 Scary & Thrilling</label>
                                </motion.div>
                            </div>
                        </motion.div>
                        
                        <motion.label
                            variants={itemVariants}
                            whileHover={{ scale: 1.01 }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <IconUser size={20} color="var(--accent-warning)" />
                                Which famous film person would you love to be stranded on an island with and why?
                            </div>
                            <motion.textarea 
                                name='favourite_person'
                                className='input' 
                                placeholder='Tom Hanks - he seems like someone who could keep spirits up and find creative solutions to survive'
                                rows="3"
                                required
                                whileFocus={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            />
                        </motion.label>
                        
                        <motion.button
                            type="submit"
                            variants={itemVariants}
                            whileHover={{ 
                                scale: 1.05,
                                boxShadow: "0 12px 40px rgba(139, 92, 246, 0.4)"
                            }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                background: 'var(--gradient-secondary)'
                            }}
                        >
                            <IconSparkles size={20} />
                            {count > 1 ? 'Next Person' : "Let's Find Movies!"}
                        </motion.button>
                    </motion.form>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}