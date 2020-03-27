import 'react-app-polyfill/ie11'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { usePrefersTheme } from '../src'

const App = () => {
  const pref = usePrefersTheme()

  document.body.style.background = pref == 'dark' ? 'black' : 'white'
  document.body.style.color = pref == 'dark' ? 'white' : 'black'

  return <h1>Preference: {pref}</h1>
}

ReactDOM.render(<App />, document.getElementById('root'))
