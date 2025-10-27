import Spline from '@splinetool/react-spline/next';
import HeroSection from './components/HeroSection/HeroSection';
import VisionMissionSection from './components/VisionMissionSection/VisionMissionSection';
import VisionMissionCardReveal from './components/TeamSection/TeamSection';
import BlogSection from './components/BlogSection/BlogSection';
import Footer from './components/Footer/Footer';
import TimeLineWrapper from './components/TimeLineWrapper/TimeLineWrapper';



export default function Home() {
  return (
  <>
  <HeroSection/>
  <VisionMissionSection/>
  <VisionMissionCardReveal/>
   <TimeLineWrapper />
  <BlogSection/>
  <Footer/>
  </>
  );
}

