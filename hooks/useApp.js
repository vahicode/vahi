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
  const [user, setUser] = useLocalStorage('user', null)
  const [userToken, setUserToken] = useLocalStorage('userToken', null)
  const [admin, setAdmin] = useLocalStorage('admin', null)
  const [adminToken, setAdminToken] = useLocalStorage('token', null)

  // React State
  const [primaryMenu, setPrimaryMenu] = useState(false)
  const [loading, setLoading] = useState(false)

  // State methods
  const togglePrimaryMenu = () => setPrimaryMenu(!primaryMenu)

  // Helper method for Authorization header
  const bearer = () => ({
    headers: { Authorization: 'Bearer ' + token }
  })

  // Helper method to logout
  const logout = () => {
    setToken(null)
    setAdmin(null)
  }

  return {
    // State
    loading,
    primaryMenu,

    // State setters
    setLoading,
    setPrimaryMenu,
    startLoading: () => {
      setLoading(true)
      setPrimaryMenu(false)
    }, // Always close menu when navigating
    stopLoading: () => setLoading(false),

    // State handlers
    togglePrimaryMenu,

    //Persistent state
    theme,
    user,
    userToken,
    admin,
    adminToken,

    //Persistent state setters
    setTheme,
    setUser,
    setUserToken,
    setAdmin,
    setAdminToken,

    // Methods
    bearer,
    logout,
  }
}

export default useApp
