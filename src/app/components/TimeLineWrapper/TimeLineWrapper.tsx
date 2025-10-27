'use client'
import React, { useEffect, useRef, useState } from "react";
// import Section from "../Section/Section";
import TimelineObserver from "react-timeline-animation";
import RoadMap from "../RoadMap/RoadMap";


const TimeLineWrapper = () => {
  const [isClient, setIsClient] = useState(false);
  
  const onCallback = () => {
    console.log("awesome");
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
       <></>
  );
};

export default TimeLineWrapper;