import { motion } from 'framer-motion'
import { IconUsers, IconClock, IconSparkles } from '@tabler/icons-react'
import PopCorn from '../assets/pop_corn.png'
import { useNavigate } from 'react-router-dom'

const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            staggerChildren: 0.2
        }
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

const iconVariants = {
    hover: {
        scale: 1.1,
        rotate: 10,
        transition: { duration: 0.3 }
    }
}

export default function InitialForm({func}){
    const navigate = useNavigate()
    
    const handleForm = (formData) => {
        let data = {}
        for (const [key, value] of formData) {
            data[key] = value
        }
        func(data)
        navigate('/form2')
    }

    return (
        <motion.div 
            className="glass-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div id="question-page">
                <motion.img 
                    src={PopCorn} 
                    id='popcorn' 
                    alt='An image of a Pop corn with a face'
                    variants={itemVariants}
                    whileHover={{ 
                        scale: 1.1, 
                        rotate: [0, -10, 10, -10, 0],
                        transition: { duration: 0.5 }
                    }}
                />
                
                <motion.h1 
                    id="logo"
                    variants={itemVariants}
                >
                    PopChoice
                </motion.h1>
                
                <motion.p
                    variants={itemVariants}
                    style={{
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        fontSize: '1.1rem',
                        marginBottom: '2rem',
                        maxWidth: '500px'
                    }}
                >
                    ✨ Discover your perfect movie match with AI-powered recommendations
                </motion.p>
                
                <motion.form 
                    action={handleForm}
                    variants={itemVariants}
                >
                    <motion.label
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <motion.div variants={iconVariants} whileHover="hover">
                                <IconUsers size={20} color="var(--accent-primary)" />
                            </motion.div>
                            How many people are watching?
                        </div>
                        <motion.input 
                            name='people_count'
                            type='number'
                            min="1"
                            max="10"
                            className='input' 
                            placeholder='e.g., 2'
                            required
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                        />
                    </motion.label>
                    
                    <motion.label
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <motion.div variants={iconVariants} whileHover="hover">
                                <IconClock size={20} color="var(--accent-primary)" />
                            </motion.div>
                            How much time do you have?
                        </div>
                        <motion.input 
                            name='time'
                            type='text'
                            className='input' 
                            placeholder='e.g., 2 hours, 90 minutes, quick watch'
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
                            boxShadow: "0 12px 40px rgba(59, 130, 246, 0.4)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <IconSparkles size={20} />
                        Start Your Journey
                    </motion.button>
                </motion.form>
            </div>
        </motion.div>
    )
}

 