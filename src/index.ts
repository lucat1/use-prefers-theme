import { useState, useEffect } from 'react'

export type Preference = 'dark' | 'light' | 'none'

// pref translates into our Preference type the value of the media query
const pref = (match: MediaQueryList): Preference =>
  match.matches ? 'dark' : 'light'

// usePrefersTheme uses the media query api to check if
// the user prefers a dark or light colorscheme
// changing the system setting will trigger a rerener in react
export const usePrefersTheme = (): Preference => {
  const supported = typeof window !== 'undefined' && 'matchMedia' in window

  // first we check for environments which don't support
  // the required api (server-side, old browsers)
  if (!supported) {
    return 'none'
  }

  // at this point we are sure we got the requied api so we
  // can implement the real hook logic

  // firstly we get the value at render time
  // we save the match variable to reuse the same query later on
  // in the event listener logic
  const match = window.matchMedia('(prefers-color-scheme: dark)')

  // eslint-disable-next-line
  const [preference, setPreference] = useState(pref(match))

  // eslint-disable-next-line
  useEffect(() => {
    const handler = () => {
      setPreference(pref(match))
    }

    match.addEventListener('change', handler)
    return () => match.removeEventListener('change', handler)
  }, [match])

  return preference
}

export default usePrefersTheme
