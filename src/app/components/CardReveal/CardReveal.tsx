"use client"
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const CardReveal = ({ i, title, description, src, link, color, range, targetScale, progress }: any) => {
    const container = useRef(null)
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'start start']
    })
    const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1])//image zoom out animation
    const scale = useTransform(progress, range, [1, targetScale])//stacking effect

    return (
          <></>
    )
}
//className='object-cover'

export default CardReveal