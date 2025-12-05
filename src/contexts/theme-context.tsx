'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
    theme: Theme
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('dark')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const stored = localStorage.getItem('theme') as Theme | null
        if (stored) {
            setTheme(stored)
        } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
            setTheme('light')
        }
    }, [])

    useEffect(() => {
        if (mounted) {
            localStorage.setItem('theme', theme)
            document.documentElement.setAttribute('data-theme', theme)
        }
    }, [theme, mounted])

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark')
    }

    if (!mounted) {
        return <>{children}</>
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    // Return default values if not in provider (SSR or outside provider)
    if (!context) {
        return {
            theme: 'dark' as Theme,
            toggleTheme: () => { }
        }
    }
    return context
}
