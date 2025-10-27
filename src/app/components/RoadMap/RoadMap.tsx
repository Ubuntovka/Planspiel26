'use client'
import React, { useEffect, useRef, useState } from "react";
// import { fireConfetti } from "./confetti";

type Step = {
  id: string;
  label: string;
  message: string;
  date: string; // <-- Add this
};

const steps: Step[] = [
  {
    id: "1",
    label: "1",
    message: "AI-Powered Platform Development",
    date: "Q3 2024",
  },
  { id: "2", label: "2", message: "Cloud Infrastructure Setup", date: "Q4 2024" },
  { id: "3", label: "3", message: "Advanced Analytics Integration", date: "Q1 2025" },
  {
    id: "4",
    label: "4",
    message: "Mobile & Web Application Launch",
    date: "Q2 2025",
  },
  {
    id: "5",
    label: "5",
    message: "Enterprise Solutions Rollout",
    date: "Q3 2025",
  },
  { id: "6", label: "6", message: "Global Market Expansion", date: "Q4 2025" },
  {
    id: "7",
    label: "7",
    message: "Next-Gen Innovation Hub",
    date: "Q1 2026",
  },
];

const RoadMap = ({ setObserver, callback }: any) => {
  const [messages, setMessages] = useState<string[]>(
    Array(steps.length).fill("")
  );

  const timelinesRef = useRef<HTMLDivElement[]>([]);
  const circlesRef = useRef<HTMLDivElement[]>([]);

  // const handleStepCallback = (index: number) => {
  //   setMessages((prev) =>
  //     prev.map((msg, i) => (i === index ? steps[index].message : msg))
  //   );

  //   if (index === 0) {
  //     callback(); // Custom callback for first step
  //   }

  //   if (index === steps.length - 1) {
  //     //fireConfetti();
  //     // fireConfetti(); // Last step, fire confetti
  //   }
  // };
  const handleStepCallback = (index: number) => {
    setMessages((prev) =>
      prev.map((msg, i) =>
        i === index && msg === "" ? steps[index].message : msg
      )
    );

    if (index === 0) {
      callback();
    }

    if (index === steps.length - 1) {
      // fireConfetti();
    }
  };

  // const handleStepExit = (index: number) => {
  //   setMessages((prev) => prev.map((msg, i) => (i === index ? "" : msg)));
  // };

  useEffect(() => {
    steps.forEach((_, index) => {
      const timeline = timelinesRef.current[index];
      const circle = circlesRef.current[index];
      if (timeline) setObserver(timeline);
      if (circle) setObserver(circle, () => handleStepCallback(index));
    });
  }, [setObserver]);

  return (
       <></>
  );
};

export default RoadMap;