"use client"

import { useEffect, useState } from "react"

interface CountdownTimerProps {
  targetDate: string
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const target = new Date(targetDate).getTime()

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const difference = target - now

      if (difference <= 0) {
        setIsExpired(true)
        clearInterval(interval)
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  if (isExpired) {
    return <div className="text-xl font-bold">The event has started!</div>
  }

  return (
    <div className="grid grid-cols-4 gap-4 text-center">
      <div className="flex flex-col">
        <div className="text-4xl font-bold">{timeLeft.days}</div>
        <div className="text-sm uppercase">Days</div>
      </div>
      <div className="flex flex-col">
        <div className="text-4xl font-bold">{timeLeft.hours}</div>
        <div className="text-sm uppercase">Hours</div>
      </div>
      <div className="flex flex-col">
        <div className="text-4xl font-bold">{timeLeft.minutes}</div>
        <div className="text-sm uppercase">Minutes</div>
      </div>
      <div className="flex flex-col">
        <div className="text-4xl font-bold">{timeLeft.seconds}</div>
        <div className="text-sm uppercase">Seconds</div>
      </div>
    </div>
  )
}

