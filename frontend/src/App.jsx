import { useEffect, useState } from 'react'
import { getHealth } from './services/api'

function App() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    getHealth().then(data => setMessage(data.message))
  }, [])

  return (
    <div>
      <h1>RRRS</h1>
      <p>{message}</p>
    </div>
  )
}

export default App
