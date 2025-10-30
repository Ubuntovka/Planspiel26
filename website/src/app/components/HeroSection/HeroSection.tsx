'use client'
import Spline from '@splinetool/react-spline'
import React, { useState, useEffect } from 'react'
import { ParticlesBackground } from '../ParticlesBackground/ParticlesBackground';


const HeroSection = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
    const [cursorType, setCursorType] = useState('spring'); // 'default', 'glow', 'pulse', 'trail', 'spring'

    useEffect(() => {
        // Check if we're in the browser environment
        if (typeof window === 'undefined') return;

        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Simulate loading for better UX
        const timer = setTimeout(() => setIsLoading(false), 1000);

        return () => {
            window.removeEventListener('resize', checkMobile);
            clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        // Check if we're in the browser environment
        if (typeof window === 'undefined') return;

        let animationFrameId: number;

        const handleMouseMove = (e: MouseEvent) => {
            // Cancel previous animation frame
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }

            // Use requestAnimationFrame for smooth updates
            animationFrameId = requestAnimationFrame(() => {
                setMousePosition({ x: e.clientX, y: e.clientY });
            });
        };

        if (!isMobile) {
            window.addEventListener('mousemove', handleMouseMove);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
            };
        }
    }, [isMobile]);

    return (
        <>
            {/* Particles Background */}
            {/* <div className="fixed inset-0 "> */}
            {/* <ParticlesBackground /> */}
            {/* </div> */}

            {/* Circle Cursor Follower */}
            {!isMobile && (
                <div
                    className={`cursor-circle-${cursorType}`}
                    style={{
                        left: mousePosition.x,
                        top: mousePosition.y,
                    }}
                />
            )}

            {/* Cursor Controls */}
            {/* {!isMobile && (
        <div className="fixed top-4 right-4 z-50 bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          <div className="text-white text-xs mb-2 font-medium">Cursor Style:</div>
          <div className="flex flex-col gap-2">
            {['default', 'glow', 'pulse', 'trail', 'spring'].map((type) => (
              <button
                key={type}
                onClick={() => setCursorType(type)}
                className={`px-3 py-1 text-xs rounded transition-all duration-200 ${
                  cursorType === type
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )} */}

            <div className="min-h-screen flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 relative overflow-hidden pt-20 sm:pt-24 lg:pt-0">

                {/* Background Elements */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-10 sm:top-20 left-4 sm:left-10 lg:left-20 w-32 sm:w-48 lg:w-72 h-32 sm:h-48 lg:h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 lg:right-20 w-40 sm:w-64 lg:w-96 h-40 sm:h-64 lg:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 sm:w-40 lg:w-64 h-24 sm:h-40 lg:h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
                </div>

                {/* LEFT SECTION: Enhanced Branding */}
                <div className="w-full lg:w-1/2 text-white space-y-4 sm:space-y-6 lg:space-y-8 text-center lg:text-left order-2 lg:order-1">
                    <div className="space-y-3 sm:space-y-4">
                        <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-xs sm:text-sm font-medium">
                            ✨ Next-Gen Digital Solutions
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-tight sm:leading-none bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent animate-fade-in">
                            DEVINCHE
                        </h1>

                        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl opacity-90 font-light leading-relaxed px-2 sm:px-4 lg:px-0">
                            Reimagining Digital Experiences with
                            <span className="text-cyan-300 font-semibold"> Innovation</span> and
                            <span className="text-blue-300 font-semibold"> Excellence</span>
                        </p>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 lg:gap-8 text-xs sm:text-sm opacity-80">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span>AI-Powered</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300"></div>
                                <span>Cloud Native</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-700"></div>
                                <span>Scalable</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                            <button className="group px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-semibold text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 hover:from-cyan-400 hover:to-blue-500 text-xs sm:text-sm lg:text-base">
                                <span className="flex items-center justify-center space-x-2">
                                    <span>Explore More</span>
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </span>
                            </button>

                            <button className="px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 border-2 border-white/30 rounded-full font-semibold text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm text-xs sm:text-sm lg:text-base">
                                Learn More
                            </button>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6 xl:gap-8 pt-4 sm:pt-6 lg:pt-8 border-t border-white/20">
                        <div className="text-center">
                            <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-cyan-300">500+</div>
                            <div className="text-xs sm:text-sm opacity-70">Projects</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-blue-300">99.9%</div>
                            <div className="text-xs sm:text-sm opacity-70">Uptime</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-purple-300">24/7</div>
                            <div className="text-xs sm:text-sm opacity-70">Support</div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SECTION: Enhanced Spline */}
                <div className="w-full lg:w-1/2 h-48 sm:h-64 md:h-80 lg:h-screen mt-4 sm:mt-6 lg:mt-0 order-1 lg:order-2">
                    <div className="w-full h-full rounded-lg lg:rounded-none overflow-hidden relative">
                        {isLoading ? (
                            <div className="w-full h-full flex items-center justify-center  rounded-lg lg:rounded-none">
                                <div className="text-center">
                                    <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-white/70 text-sm">Loading 3D Experience...</p>
                                </div>
                            </div>
                        ) : (
                            <Spline
                                scene="https://prod.spline.design/rUibjuUb2FmIdCbp/scene.splinecode"

                                style={{
                                    width: '100%',
                                    height: '100%',
                                    // Optimize for mobile performance
                                    ...(isMobile && {
                                        pointerEvents: 'none',
                                        transform: 'scale(1)',
                                        transformOrigin: 'center'
                                    })
                                }}
                            />
                        )}
                    </div>
                </div>

            </div>
        </>
    )
}

export default HeroSection