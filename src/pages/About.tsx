import React, { useRef, useState } from "react";
import { useInView, motion } from "framer-motion";
import { useLocation } from "wouter";
import { InteractiveButton } from "../components/InteractiveButton";
import { ScrollReveal } from "../components/ScrollReveal";
import founderImg from "../assets/images/prof1.jpg";
import maternityImg from "../assets/images/maternity.jpg";
import bookImg from "../assets/images/book_do_hard_things.jpg";
import mentorImg from "../assets/images/mentor.jpg";
import todayImg from "../assets/images/today.jpg";
import forwardOrgExistsImg from "../assets/images/forward_org_exists.png";

export default function About() {
  const [_, setLocation] = useLocation();

  const handleBookClick = () => {
    setLocation("/book-a-call");
  };

  return (
    <div className="bg-white min-h-screen text-ink">
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-[#1A3C34] text-white relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(250,250,248,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(250,250,248,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6 relative z-10 py-8">
          <span className="font-sans font-bold text-xs text-gold capitalize tracking-[0.25em] block">
            We Believe
          </span>
          <h1 className="font-serif text-[38px] md:text-[52px] font-bold text-white leading-tight">
            Organizations transform at the speed of leadership.
          </h1>
          <p className="font-serif italic text-lg md:text-xl text-gold/90 font-normal">
            Technology doesn't transform organizations. People do.
          </p>
        </div>
      </section>

      {/* Main Story Container */}
      <section className="py-20 px-6 md:px-12 max-w-5xl mx-auto space-y-32">
        
        {/* Section 1 - Meet Pan Seth */}
        <ScrollReveal duration={0.65}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-7 space-y-6 text-left">
              <span className="font-sans font-bold text-xs text-gold capitalize tracking-[0.25em] block">
                Our Story
              </span>
              <h2 className="font-serif text-[32px] md:text-[40px] font-bold text-ink leading-tight">
                Meet Pan Seth
              </h2>
              <div className="space-y-4 font-sans text-base md:text-[17px] text-ink-muted leading-relaxed font-light">
                <p>
                  For more than a decade, Pan built AI and data solutions inside global enterprises, helping solve toughest challenges across financial services, enterprise SaaS, and technology organizations including Citi, PagerDuty, and NielsenIQ.
                </p>
                <p>
                  Along the way, she contributed to more than $600 million in business impact, filed two AI patents, and trained alongside some of Silicon Valley's leading AI strategy, leadership, and organizational transformation experts.
                </p>
                <p>
                  From the outside, her career looked exactly as planned. She believed she was building the career she had always wanted.
                </p>
              </div>
            </div>
            <div className="md:col-span-5 flex justify-center">
              <div 
                className="relative w-full aspect-[4/5] max-w-[360px] bg-sand overflow-hidden shadow-md border border-gold/10"
              >
                <img
                  src={founderImg}
                  alt="Pan Seth Corporate Portrait"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000";
                  }}
                />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Section 2 - The Turning Point */}
        <ScrollReveal duration={0.65}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-5 flex justify-center order-last md:order-first">
              <div 
                className="relative w-full aspect-[4/5] max-w-[360px] bg-sand overflow-hidden shadow-md border border-gold/10"
              >
                <img
                  src={maternityImg}
                  alt="Maternity / reflective moments"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
            <div className="md:col-span-7 space-y-6 text-left">
              <span className="font-sans font-bold text-xs text-gold capitalize tracking-[0.25em] block">
                The Turning Point
              </span>
              <h2 className="font-serif text-[32px] md:text-[40px] font-bold text-ink leading-tight">
                Jan 2023 everything changed.
              </h2>
              <div className="space-y-4 font-sans text-base md:text-[17px] text-ink-muted leading-relaxed font-light">
                <p>
                  On the day before she was due to welcome her first daughter into the world, Pan's role was eliminated.
                </p>
                <p>
                  At first, it felt like one difficult moment. But during countless nights awake with her newborn daughter, she began reflecting on something much deeper.
                </p>
                <p>
                  She noticed a pattern that had quietly followed her throughout her career. Like many ambitious professionals, she had spent years believing that exceptional work would eventually speak for itself.
                </p>
                <p>
                  She worked harder, sacrificed more, and waited for recognition that never quite came. That experience challenged her definition of success - and became the catalyst for everything that followed.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Section 3 - Choosing A Different Path */}
        <ScrollReveal duration={0.65}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-7 space-y-6 text-left">
              <span className="font-sans font-bold text-xs text-gold capitalize tracking-[0.25em] block">
                Choosing A Different Path
              </span>
              <h2 className="font-serif text-[32px] md:text-[40px] font-bold text-ink leading-tight">
                Evolving our Definition of Success
              </h2>
              <div className="space-y-4 font-sans text-base md:text-[17px] text-ink-muted leading-relaxed font-light">
                <p>
                  Pan didn't want her daughter to grow up believing that success meant sacrificing. Rather than returning to the same cycle in another role, Pan made a different decision.
                </p>
                <p>
                  She invested in learning from mentors who had already built the kind of leadership, business, and life she wanted to create. She discovered something that transformed not only her career, but the way she viewed organizations.
                </p>
                <p>
                  Technology wasn't the biggest barrier to AI transformation. <span className="font-serif italic text-gold font-semibold">Leadership was.</span>
                </p>
                <p>
                  The mentors and community she found didn't just teach her new skills. They changed the way she thought, giving her the confidence to stop proving herself and start building something aligned with the life she wanted to live.
                </p>
              </div>
            </div>
            <div className="md:col-span-5 relative w-full aspect-[4/5] max-w-[400px] h-[450px] mx-auto select-none mt-8 md:mt-0">
              {/* Back Image: Book cover 'Do Hard Things' (positioned at bottom-left) */}
              <div 
                className="absolute bottom-0 left-0 w-[65%] aspect-[4/5] bg-sand overflow-hidden shadow-none border border-gold/20 z-10 transition-transform duration-300 hover:scale-[1.02]"
              >
                <img
                  src={bookImg}
                  alt="Steve Magness Do Hard Things book"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Golden Background Sandwich Layer aligned behind the top image (mentorImg) at top-right with 10% offset */}
              <div 
                className="absolute top-[3%] right-[-3%] w-[65%] aspect-[4/5] bg-gold opacity-95 shadow-none border border-[#E8D5B5] z-20 pointer-events-none"
              />

              {/* Front Image: Mentor and Pan by the water (positioned at top-right, overlapping the book image) */}
              <div 
                className="absolute top-0 right-0 w-[65%] aspect-[4/5] bg-sand overflow-hidden shadow-xl border border-gold/15 z-30 transition-transform duration-300 hover:z-30 hover:scale-[1.02]"
              >
                <img
                  src={mentorImg}
                  alt="Graduation / Mentor guidance"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Section 4 - Why The Forward Org Exists */}
        <ScrollReveal duration={0.65}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-5 flex justify-center order-last md:order-first">
              <div 
                className="relative w-full aspect-[4/5] max-w-[360px] bg-sand overflow-hidden shadow-md border border-gold/10"
              >
                <img
                  src={forwardOrgExistsImg}
                  alt="Pan Seth"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
            <div className="md:col-span-7 space-y-6 text-left">
              <span className="font-sans font-bold text-xs text-gold capitalize tracking-[0.25em] block">
                Purpose
              </span>
              <h2 className="font-serif text-[32px] md:text-[40px] font-bold text-ink leading-tight">
                Why The Forward Org Exists
              </h2>
              <div className="space-y-4 font-sans text-base md:text-[17px] text-ink-muted leading-relaxed font-light">
                <p>
                  The Forward Org wasn't created because organizations needed another AI consultant. It was created because leaders deserve a better way to navigate one of the greatest transformations of our time.
                </p>
                <ul className="space-y-3 pl-2 border-l border-gold/30">
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">✓</span>
                    <span>A way that helps organizations embrace AI without losing their people.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">✓</span>
                    <span>A way that develops leaders who can create confidence instead of fear.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-1">✓</span>
                    <span>A way that enables organizations to achieve extraordinary results while helping people do their most meaningful work.</span>
                  </li>
                </ul>
                <p className="font-serif italic text-teal font-medium mt-4">
                  Because Pan believes that organizations don't transform through technology. They transform through leaders.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

      </section>

      {/* Section 5 - Our Mission Statement */}
      <section className="bg-[#FAF9F5] border-t border-b border-gold/15 py-24 px-6 md:px-12 w-full overflow-hidden">
        <div className="max-w-4xl mx-auto text-left space-y-8">
          <span className="font-sans font-bold text-xs text-gold capitalize tracking-[0.25em] block">
            Our Mission
          </span>
          <h2 className="font-serif text-[36px] md:text-[45px] font-bold text-[#1A3C34] leading-tight">
            At The Forward Org, our mission is to help organizations confidently move forward in the Age of AI by developing the leaders, cultures, and ways of working that enable people to embrace change, unlock greater freedom, and achieve extraordinary results.
          </h2>
          <p className="font-sans text-[17px] md:text-[19px] text-ink-muted leading-[1.7] font-light max-w-3xl">
            By 2031, we aim to create more than $100 million in measurable economic impact for our clients while helping build organizations where people and technology thrive together - and where success never comes at the cost of the people who create it.
          </p>
          <div className="pt-4">
            <InteractiveButton onClick={handleBookClick} variant="gold">
              Book a Call
            </InteractiveButton>
          </div>
        </div>
      </section>

    </div>
  );
}
