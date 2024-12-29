"use client"

import * as React from "react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <button
      onClick={toggleTheme}
      aria-pressed={theme === "dark"}
      className="toggle relative h-12 aspect-[1.8/1] rounded-[3em] border-0 bg-transparent cursor-pointer text-base"
    >
      <div className="socket absolute inset-0 rounded-[3em] bg-[hsl(0_0%_90%)] dark:bg-[hsl(220_27%_6%)] shadow-[-0.05em_0.1em_0.2em_-0.2em_white] transition-all duration-500">
        <div className="socket-shadow absolute inset-0 opacity-0 dark:opacity-100 rounded-[inherit] shadow-[0em_0.075em_0.1em_0em_rgba(255,255,255,0.2)] transition-opacity duration-500" />
      </div>
      <div className="face absolute inset-[0.15em] rounded-[3em] scale-100 dark:scale-110 transition-transform duration-500">
        <div className="face-shadow absolute inset-0 rounded-[inherit]">
          <div className="absolute inset-0 rounded-[inherit] bg-black/20 translate-[-15%_55%] blur-[1em] opacity-0 dark:opacity-35 transition-all duration-500" />
          <div className="absolute inset-0 rounded-[inherit] bg-white/10 scale-50 dark:scale-100 blur-[0.5em] transition-all duration-500" />
        </div>
        <div className="face-plate absolute inset-0 rounded-[inherit] bg-[hsl(223_4%_73%)] dark:bg-[hsl(220_27%_8%)] shadow-[-0.05em_0.1em_0.2em_-0.2em_rgba(255,255,255,0.5)_inset] transition-colors duration-500" />
        <div className="face-glowdrop absolute inset-0 rounded-[inherit] scale-0 dark:scale-100 transition-transform duration-500">
          <div className="absolute inset-0 rounded-[inherit] before:content-[''] before:absolute before:w-[56%] before:aspect-square before:bg-white/20 before:blur-[6px] before:left-[4%] before:translate-y-[-25%] after:content-[''] after:absolute after:w-[34%] after:aspect-square after:bg-white/20 after:blur-[6px] after:right-[12%] after:bottom-0 after:translate-y-[20%]" />
        </div>
        <div className="face-glows absolute inset-[-0.075em] opacity-0 dark:opacity-50 rounded-[inherit] mix-blend-soft-light blur-[4px] z-20 transition-opacity duration-500">
          <div className="absolute inset-0 rounded-[inherit] blur-[2px] border-[0.1em] border-white/30" />
        </div>
        <div className="face-shine absolute inset-0 opacity-0 dark:opacity-30 rounded-[3em] transition-opacity duration-500">
          <div className="face-shine-shadow absolute inset-0 rounded-[inherit] shadow-[0.075em_0_0.025em_-0.025em_rgba(255,255,255,0.2)_inset,-0.075em_-0.05em_0.025em_-0.025em_rgba(255,255,255,0.2)_inset]" />
        </div>
        <svg className="absolute w-[25%] top-1/2 left-1/2 translate-x-[-52%] translate-y-[-48%] overflow-visible" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            className="glow-path"
            d="M9.8815 1.36438C9.70639 1.18942 9.48342 1.07041 9.24073 1.02235C8.99803 0.974286 8.74653 0.999323 8.51808 1.09429C4.54484 2.75146 1.75 6.6732 1.75 11.25C1.75 17.3262 6.67489 22.25 12.75 22.25C14.9217 22.2501 17.0448 21.6075 18.852 20.4032C20.6591 19.1989 22.0695 17.4868 22.9055 15.4825C23.0007 15.2532 23.0256 15.0015 22.9774 14.7587C22.9291 14.5159 22.8099 14.2929 22.6348 14.118C22.4597 13.9431 22.2366 13.8241 21.9937 13.7761C21.7509 13.7281 21.4993 13.7533 21.2708 13.8484C20.2346 14.2801 19.1231 14.5016 18.0007 14.5C15.7457 14.5 13.5837 13.6045 11.9896 12.0104C10.3955 10.4163 9.5 8.25433 9.5 5.99999C9.49838 4.8769 9.71983 3.76541 10.1515 2.72938C10.2468 2.50072 10.2721 2.24888 10.224 2.00584C10.1759 1.76281 10.0567 1.53954 9.8815 1.36438Z"
            fill="hsl(182 90% 92% / 0.9)"
            strokeWidth="0"
          />
        </svg>
      </div>
      <span className="sr-only">Toggle Theme</span>
    </button>
  )
}