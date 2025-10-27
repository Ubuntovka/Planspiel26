'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ParticlesBackground } from '../components/ParticlesBackground/ParticlesBackground';

const AboutPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('vision');
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8
      }
    }
  };

  const coreValues = [
    {
      title: "Innovation",
      description: "We constantly push boundaries and explore new technologies to deliver cutting-edge solutions.",
      icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
      color: "from-cyan-500 to-blue-600"
    },
    {
      title: "Excellence",
      description: "We maintain the highest standards in everything we do, ensuring quality and reliability.",
      icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "Integrity",
      description: "We conduct business with honesty, transparency, and ethical practices in all our interactions.",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Collaboration",
      description: "We believe in the power of teamwork and building strong partnerships with our clients.",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      color: "from-orange-500 to-red-600"
    },
    {
      title: "Growth",
      description: "We are committed to continuous learning and helping our clients achieve sustainable growth.",
      icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
      color: "from-indigo-500 to-purple-600"
    },
    {
      title: "Impact",
      description: "We strive to create meaningful solutions that make a positive difference in the world.",
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      color: "from-pink-500 to-rose-600"
    }
  ];

  const purposeData = {
    title: "Our Purpose",
    description: "We exist to bridge the gap between complex technology and human needs, creating solutions that empower businesses and individuals to thrive in the digital age.",
    highlights: [
      "Democratizing technology access",
      "Fostering digital transformation",
      "Building sustainable futures",
      "Empowering human potential"
    ]
  };

  return (
    <></>
  );
};

export default AboutPage;
