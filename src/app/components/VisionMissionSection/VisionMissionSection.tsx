'use client'
import React, { useState, useEffect, useRef } from 'react'

const VisionMissionSection = () => {
    const [isVisible, setIsVisible] = useState(false)
    const [scrollY, setScrollY] = useState(0)
    const sectionRef = useRef<HTMLDivElement>(null)
    const visionCardRef = useRef<HTMLDivElement>(null)
    const missionCardRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Check if we're in the browser environment
        if (typeof window === 'undefined') return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.1 }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => observer.disconnect()
    }, [])

    return (
      <></>
    )
}

export default VisionMissionSection
