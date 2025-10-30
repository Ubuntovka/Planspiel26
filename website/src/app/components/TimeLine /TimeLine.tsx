"use client";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const events = [
  { date: "Oct 2024", title: "Launch of SEP Coin", icon: "rocket_launch" },
  { date: "14-Oct-2024", title: "SEP Listing on Exchanges", icon: "list_alt" },
  { date: "Nov 2024", title: "Crypto Wallet App Release", icon: "smartphone" },
  { date: "Dec 2024", title: "NFT Platform Launch", icon: "palette" },
  {
    date: "Q1 2025",
    title: "Carbon Certificate Trading",
    icon: "card_membership",
  },
  { date: "Q1 2025", title: "AI Integration Begins", icon: "robot_2" },
  { date: "Q3 2025", title: "KYC Implementation", icon: "description" },
];

const TimeLine = () => {
  const [isClient, setIsClient] = useState(false);
  const { ref, inView } = useInView({ 
    triggerOnce: false, 
    threshold: 0.2,
    skip: typeof window === 'undefined' // Skip during SSR
  });
  const controls = useAnimation();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start({ width: "60%" });
    } else {
      controls.start({ width: "0%" });
    }
  }, [inView, controls]);

  return (
    <></>
  );
};

export default TimeLine;