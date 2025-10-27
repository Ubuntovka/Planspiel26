'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setEmail('');
    setMessage('');
    setIsSubmitting(false);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate newsletter subscription
    await new Promise(resolve => setTimeout(resolve, 500));
    setNewsletterEmail('');
  };

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  const socialVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15
      }
    }
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Spline 3D Background - Interactive Layer */}
      <div className="absolute inset-0 w-full h-full z-5 opacity-20">
       <Spline
        scene="https://prod.spline.design/iXg1Xm5hgqiM2wkE/scene.splinecode" 
      />
      </div>

      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Floating particles with improved animation */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Animated gradient overlays */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/3 to-transparent"
          animate={{
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          {...(isClient && { whileInView: "visible", viewport: { once: true, margin: "-100px" } })}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12"
        >
          {/* Company Info */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <motion.div 
              className="flex items-center space-x-4 mb-8"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="relative group"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <Image
                  src="/devinche-logo.png"
                  alt="Devinche Logo"
                  width={60}
                  height={60}
                  className="rounded-2xl shadow-2xl group-hover:shadow-cyan-500/25 transition-all duration-300"
                />
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20"
                  animate={{
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-2xl border border-cyan-400/30"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
              <motion.h3 
                className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                Devinche
              </motion.h3>
            </motion.div>
            
            <motion.p 
              className="text-gray-300 mb-8 max-w-lg leading-relaxed text-lg"
              variants={itemVariants}
            >
              Empowering the future through innovative technology solutions and cutting-edge development practices. We build tomorrow's digital experiences today.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              variants={containerVariants}
            >
              {[
                { name: 'Twitter', icon: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z', color: 'from-blue-400 to-blue-600' },
                { name: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z', color: 'from-blue-500 to-blue-700' },
                { name: 'GitHub', icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z', color: 'from-gray-600 to-gray-800' },
                { name: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z', color: 'from-pink-500 to-purple-600' }
              ].map((social, index) => (
                <motion.a
                  key={social.name}
                  href="#"
                  className={`w-14 h-14 bg-gradient-to-r ${social.color} rounded-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 group border border-white/10 shadow-xl backdrop-blur-sm`}
                  variants={socialVariants}
                  whileHover={{ 
                    scale: 1.15, 
                    rotate: 5,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.svg 
                    className="w-7 h-7 text-white group-hover:text-white/90" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <path d={social.icon}/>
                  </motion.svg>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <motion.h4 
              className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-8 relative"
              whileHover={{ scale: 1.05 }}
            >
              Quick Links
              <motion.div 
                className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
                initial={{ width: 0 }}
                {...(isClient && { whileInView: { width: "4rem" }, transition: { duration: 0.8, delay: 0.5 } })}
              />
            </motion.h4>
            <motion.ul className="space-y-6" variants={containerVariants}>
              {[
                { name: 'About Us', href: '/about', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                { name: 'Contact', href: '/contact', icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                { name: 'Blog', href: '/blog', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
                { name: 'Legal', href: '/legal', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
              ].map((link, index) => (
                <motion.li key={link.name} variants={itemVariants}>
                  <motion.a 
                    href={link.href} 
                    className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group text-lg hover:bg-white/5 rounded-lg px-3 py-2"
                    whileHover={{ x: 10, scale: 1.02 }}
                  >
                    <motion.div 
                      className="w-6 h-6 text-cyan-400 mr-4 group-hover:text-cyan-300"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                    >
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d={link.icon} clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    {link.name}
                    <motion.div 
                      className="ml-auto w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100"
                      whileHover={{ scale: 1.5 }}
                    />
                  </motion.a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <motion.h4 
              className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8 relative"
              whileHover={{ scale: 1.05 }}
            >
              Contact Info
              <motion.div 
                className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                initial={{ width: 0 }}
                {...(isClient && { whileInView: { width: "4rem" }, transition: { duration: 0.8, delay: 0.5 } })}
              />
            </motion.h4>
            <motion.div className="space-y-6" variants={containerVariants}>
              {[
                { icon: 'M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z', text: '123 Innovation Street\nTech City, TC 12345', color: 'text-blue-400' },
                { icon: 'M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z\nM18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z', text: 'info@devinche.com', color: 'text-green-400' },
                { icon: 'M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z', text: '+1 (555) 123-4567', color: 'text-purple-400' }
              ].map((contact, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start space-x-4 group hover:bg-white/5 rounded-lg p-3 transition-all duration-300"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <motion.div 
                    className={`w-8 h-8 ${contact.color} mt-1 flex-shrink-0 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300`}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                  >
                    <svg fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5">
                      <path fillRule="evenodd" d={contact.icon} clipRule="evenodd" />
                    </svg>
                  </motion.div>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line group-hover:text-white transition-colors duration-300">
                    {contact.text}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Newsletter Subscription */}
          <motion.div variants={itemVariants}>
            <motion.h4 
              className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-8 relative"
              whileHover={{ scale: 1.05 }}
            >
              Newsletter
              <motion.div 
                className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
                initial={{ width: 0 }}
                {...(isClient && { whileInView: { width: "4rem" }, transition: { duration: 0.8, delay: 0.5 } })}
              />
            </motion.h4>
            
            <motion.p className="text-gray-300 mb-6 text-sm leading-relaxed">
              Stay updated with our latest news, insights, and technology trends.
            </motion.p>
            
            <motion.form 
              onSubmit={handleNewsletterSubmit}
              className="space-y-4"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </motion.div>
              
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </motion.form>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <motion.h4 
              className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-8 relative"
              whileHover={{ scale: 1.05 }}
            >
              Quick Contact
              <motion.div 
                className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"
                initial={{ width: 0 }}
                {...(isClient && { whileInView: { width: "4rem" }, transition: { duration: 0.8, delay: 0.5 } })}
              />
            </motion.h4>
            
            <motion.form 
              onSubmit={handleFormSubmit}
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              {...(isClient && { whileInView: "visible", viewport: { once: true } })}
            >
              <motion.div variants={itemVariants}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 resize-none"
                  required
                />
              </motion.div>
              
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 disabled:cursor-not-allowed"
                variants={itemVariants}
                whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </motion.button>
            </motion.form>
          </motion.div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div 
          className="mt-20 pt-8 border-t border-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20"
          initial={{ opacity: 0, y: 20 }}
          {...(isClient && { whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: 0.5 } })}
        >
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <motion.div 
              className="text-gray-400 text-sm flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <span>© {currentYear} Devinche. All rights reserved.</span>
              <motion.div 
                className="w-1 h-1 bg-cyan-400 rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-cyan-400">Made with ❤️</span>
            </motion.div>
            <motion.div 
              className="flex flex-wrap gap-6 text-sm"
              variants={containerVariants}
            >
              {[
                { name: 'Privacy Policy', href: '#', color: 'text-blue-400' },
                { name: 'Terms of Service', href: '#', color: 'text-green-400' },
                { name: 'Cookie Policy', href: '#', color: 'text-purple-400' },
                { name: 'Imprint', href: '/legal', color: 'text-orange-400' }
              ].map((link, index) => (
                <motion.a 
                  key={link.name}
                  href={link.href} 
                  className={`${link.color} hover:text-white transition-all duration-300 hover:scale-110 relative group`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  {link.name}
                  <motion.div 
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300"
                    whileHover={{ width: "100%" }}
                  />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.1, 0.6, 0.1],
              scale: [1, 1.8, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 5 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut"
            }}
          >
            <div className={`w-full h-full rounded-full bg-gradient-to-r ${
              i % 4 === 0 ? 'from-cyan-400/30 to-blue-400/30' :
              i % 4 === 1 ? 'from-purple-400/30 to-pink-400/30' :
              i % 4 === 2 ? 'from-green-400/30 to-emerald-400/30' :
              'from-orange-400/30 to-red-400/30'
            }`} />
          </motion.div>
        ))}
        
        {/* Floating geometric shapes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`shape-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: "linear"
            }}
          >
            <div className={`w-4 h-4 ${
              i % 2 === 0 ? 'bg-cyan-400/20' : 'bg-purple-400/20'
            } ${i % 3 === 0 ? 'rounded-full' : i % 3 === 1 ? 'rounded-lg' : 'rounded-sm'}`} />
          </motion.div>
        ))}
      </div>
    </footer>
  );
};

export default Footer;