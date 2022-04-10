import { useState } from 'react'
// Stores state in local storage
import useLocalStorage from 'hooks/useLocalStorage.js'
// Locale and translation
import { useTranslation } from 'next-i18next'

function useApp(full = true) {
  // Locale (aka language)
  const { t } = useTranslation(['vahi'])

  // User color scheme preference
  const prefersDarkMode =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(`(prefers-color-scheme: dark`).matches
      : null

  // Persistent state
  const [theme, setTheme] = useLocalStorage('theme', prefersDarkMode ? 'dark' : 'light')
  const [invite, setInvite] = useLocalStorage('invite', null)

  // React State
  const [primaryMenu, setPrimaryMenu] = useState(false)
  const [loading, setLoading] = useState(false)

  // State methods
  const togglePrimaryMenu = () => setPrimaryMenu(!primaryMenu)

  return {
    // State
    loading,
    primaryMenu,
    theme,
    invite,

    // State setters
    setLoading,
    setPrimaryMenu,
    setTheme,
    setInvite,
    startLoading: () => {
      setLoading(true)
      setPrimaryMenu(false)
    }, // Always close menu when navigating
    stopLoading: () => setLoading(false),

    // State handlers
    togglePrimaryMenu,
  }
}

export default useApp
