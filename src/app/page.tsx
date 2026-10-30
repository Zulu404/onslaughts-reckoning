import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Pillars from "@/components/Pillars";
import Recruitment from "@/components/Recruitment";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Pillars />
        <Recruitment />
      </main>
      <Footer />
    </>
  );
}
