"use client"

import { useScroll } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Lenis from '@studio-freight/lenis'
import { projects } from '@/app/data/visionMission'
import CardReveal from '../CardReveal/CardReveal'

const TeamSection = () => {
  const container = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  const { scrollYProgress } = useScroll({
    target: isMounted && container.current ? container : undefined,
    offset: ['start start', 'end end']
  })

  // useEffect(() => {
  //   setIsMounted(true)
  // }, [])

  useEffect(() => {
    if (!isMounted) return

    const lenis = new Lenis()

    function raf(time: any) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])

  // if (!isMounted) {
  //   return null
  // }

  return (
     <></>
  )
}
export default TeamSection