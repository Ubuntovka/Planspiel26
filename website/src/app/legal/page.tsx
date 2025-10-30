'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ParticlesBackground } from '../components/ParticlesBackground/ParticlesBackground';

const LegalPage: React.FC = () => {
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

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticlesBackground />
      
      {/* Main Content */}
      <div className="relative z-10 pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center min-h-[80vh]"
          >
            <motion.div 
              variants={itemVariants}
              className="w-full max-w-2xl"
            >
              {/* Legal Notice Card */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl">
                {/* Header */}
                <motion.div 
                  className="text-center mb-12"
                  variants={itemVariants}
                >
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                    Legal Notice
                  </h1>
                  <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full"></div>
                </motion.div>

                {/* Content */}
                <motion.div 
                  className="space-y-8"
                  variants={containerVariants}
                >
                  <motion.div variants={itemVariants}>
                    <p className="text-xl text-gray-300 leading-relaxed mb-8">
                      This is a university project created by:
                    </p>
                  </motion.div>

                  <motion.div 
                    className="bg-white/5 rounded-2xl p-6 border border-white/10"
                    variants={itemVariants}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                        <div>
                          <span className="text-cyan-400 font-semibold">Team:</span>
                          <span className="text-white ml-2 font-bold text-lg">Devinche</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div>
                          <span className="text-blue-400 font-semibold">Institution:</span>
                          <span className="text-white ml-2">Technische Universität Chemnitz</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <div>
                          <span className="text-purple-400 font-semibold">Program:</span>
                          <span className="text-white ml-2">Web Engineering Master's Program</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <span className="text-green-400 font-semibold">Contact:</span>
                          <a 
                            href="mailto:jinx.officialfive@gmail.com"
                            className="text-cyan-400 hover:text-cyan-300 ml-2 underline transition-colors duration-300"
                          >
                            devinche.officialfive@gmail.com
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Disclaimer */}
                  <motion.div 
                    className="bg-gradient-to-r from-gray-800/30 to-gray-700/30 rounded-2xl p-6 border border-gray-600/30"
                    variants={itemVariants}
                  >
                    <p className="text-gray-400 text-sm italic leading-relaxed">
                      This is not a real company. All content is fictional and created for educational purposes only.
                    </p>
                  </motion.div>

                  {/* Additional Information */}
                  <motion.div 
                    className="space-y-4"
                    variants={itemVariants}
                  >
                    <h3 className="text-xl font-semibold text-white mb-4">Project Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <h4 className="text-cyan-400 font-semibold mb-2">Project Type</h4>
                        <p className="text-gray-300 text-sm">Academic Web Development Project</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <h4 className="text-blue-400 font-semibold mb-2">Technology Stack</h4>
                        <p className="text-gray-300 text-sm">Next.js, React, TypeScript, Tailwind CSS</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Back to Home */}
                  <motion.div 
                    className="text-center pt-8"
                    variants={itemVariants}
                  >
                    <a
                      href="/website/public"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Back to Home
                    </a>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
