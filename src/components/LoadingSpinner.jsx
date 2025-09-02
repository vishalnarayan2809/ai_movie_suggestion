import { motion } from 'framer-motion'
import { PuffLoader } from 'react-spinners'

const LoadingSpinner = ({ size = 60, color = "#3b82f6" }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2rem',
                padding: '3rem'
            }}
        >
            <motion.div
                animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                }}
                transition={{ 
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                }}
            >
                <PuffLoader 
                    size={size}
                    color={color}
                    loading={true}
                />
            </motion.div>
            
            <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                    textAlign: 'center',
                    color: 'var(--text-primary)'
                }}
            >
                <h3 style={{ 
                    margin: 0, 
                    marginBottom: '0.5rem',
                    fontSize: '1.3rem',
                    fontWeight: 600
                }}>
                    Analyzing Your Preferences
                </h3>
                <p style={{ 
                    margin: 0, 
                    color: 'var(--text-secondary)',
                    fontSize: '1rem'
                }}>
                    Our AI is crafting perfect movie recommendations just for you...
                </p>
            </motion.div>
            
            {/* Animated dots */}
            <motion.div
                style={{
                    display: 'flex',
                    gap: '0.5rem'
                }}
            >
                {[0, 1, 2].map((index) => (
                    <motion.div
                        key={index}
                        style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: 'var(--accent-primary)'
                        }}
                        animate={{
                            y: [0, -10, 0],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: index * 0.2
                        }}
                    />
                ))}
            </motion.div>
        </motion.div>
    )
}

export default LoadingSpinner
