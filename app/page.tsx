import Hero from "./components/Hero";
import { FloatingNav } from "./components/ui/FloatingNav";
import Grid from "./components/Grid";
import RecentProjects from "./components/RecentProjects";
import { certifications, navItems, skills } from "@/data";
import Experience from "./components/Experience";
import Approach from "./components/Approach";
import Footer from "./components/Footer";
import { StickyScroll } from "./components/ui/StickyScroll";
import {InfiniteMovingCards} from "./components/ui/InfiniteMovingCards"
export default function Home() {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navItems}/>
        <Hero/>
        <Grid/>
        <RecentProjects/>
        <Experience/>
        <Approach/>
        <InfiniteMovingCards items={skills}/>
        <StickyScroll content={certifications}/>
        <Footer/>
      </div>
    </main>
      );
}
