import { motion } from 'framer-motion'
import { useAppContext } from '../../context/AppContext'
import { Moon, Sun, ArrowLeft } from 'lucide-react'
import { Magnetic } from '../ui/Magnetic'

interface HeaderProps {
  onBackToLanding: () => void
}

export function Header({ onBackToLanding }: HeaderProps) {
  const { state, toggleTheme } = useAppContext()

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Magnetic strength={0.2}>
        <div className="logo" onClick={onBackToLanding}>
          AKSHAYOM
        </div>
      </Magnetic>

      <div style={{ display: 'flex', gap: '12px' }}>
        <Magnetic strength={0.1}>
          <button className="ghost" onClick={toggleTheme} style={{ width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {state.theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </Magnetic>
        
        <Magnetic strength={0.1}>
          <button className="ghost" onClick={onBackToLanding} style={{ width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={18} />
          </button>
        </Magnetic>
      </div>
    </motion.header>
  )
}
