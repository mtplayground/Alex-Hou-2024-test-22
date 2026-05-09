import { useEffect, useState } from 'react'

export function useNow(): Date {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date())
    }, 1_000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  return now
}
