import React, { useState, useEffect, useRef } from "react";
import { Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "../components/ScrollReveal";
import { InteractiveButton } from "../components/InteractiveButton";
import masterclassHeroImg from "../assets/images/masterclass.jpg";
import heroImage from "../../hero2.png";
import { submitToBrevo } from "../utils/submitToBrevo";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export default function Masterclass() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [clickedId, setClickedId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const scrollScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.2]);
  const scaleValue = shouldReduceMotion ? 1.0 : scrollScale;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasEntered(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Inject noindex meta tag
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "noindex, nofollow");
    return () => {
      if (meta) {
        meta.setAttribute("content", "index, follow");
      }
    };
  }, []);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-faq-button]")) {
        setClickedId(null);
      }
    };
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    try {
      const rawEnvListId = import.meta.env.VITE_BREVO_LIST_MASTERCLASS;
      const listId = Number(rawEnvListId) || 4;
      const nameParts = name.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ");

      const attributes = {
        FIRSTNAME: firstName,
        LASTNAME: lastName,
        JOB_TITLE: role,
        ORGANISATION: company,
        SOURCE: "masterclass_registration"
      };
      
      await submitToBrevo(email.trim(), listId, attributes);
      setIsSuccess(true);
    } catch (err) {
      console.error("Masterclass inquiry failed", err);
      setIsSuccess(true); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScrollToForm = () => {
    document.getElementById("register-form")?.scrollIntoView({ behavior: "smooth" });
  };

  // FAQ ITEMS
  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: "Who's hosting this?",
      answer: "Pan Seth, Founder of The Forward Org. After more than a decade building enterprise AI solutions that contributed to $600M+ in business impact and 2 AI patents, she now helps leaders build AI-forward organizations through leadership, strategy, and organizational transformation.",
    },
    {
      id: 2,
      question: "What is The Forward Org?",
      answer: "The Forward Org is an AI leadership and transformation advisory that helps organizations become AI-forward by developing AI-forward leaders, aligning strategy, strengthening culture, and building practical governance for lasting business value.",
    },
    {
      id: 3,
      question: "What will I gain from this masterclass?",
      answer: "You'll discover your Forward Leadership Score, identify your current leadership stage, uncover your biggest capability gap, and leave with practical action items to become a more effective AI leader that you can apply tomorrow.",
    },
    {
      id: 4,
      question: "Who is this designed for?",
      answer: "Senior managers, directors, executives, and transformation leaders who want to lead AI initiatives with greater confidence, influence, and business impact- no technical background required.",
    },
    {
      id: 5,
      question: "Do I need AI or technical experience?",
      answer: "Not at all. This masterclass focuses on leadership, not programming. If you're responsible for leading people, teams, or change, you'll benefit from the frameworks you'll learn.",
    },
    {
      id: 6,
      question: "What happens after the masterclass?",
      answer: "If you're ready to continue your journey, you'll be invited to join the Forward Leader Accelerator™, a six-month program designed to help leaders build the capabilities needed to lead AI transformation with confidence.",
    },
    {
      id: 7,
      question: "Is the masterclass free?",
      answer: "Yes. This complimentary masterclass is part of The Forward Org's mission to prepare leaders for the future of AI-powered organizations.",
    },
    {
      id: 8,
      question: "Will there be a replay?",
      answer: "No. The assessment, discussions, and coaching are designed to be experienced live. If you can't attend this session, you'll have the opportunity to join a future masterclass.",
    }
  ];

  const toggleFAQ = (id: number) => {
    setClickedId(clickedId === id ? null : id);
  };

  const handleMouseEnterFAQ = (id: number) => {
    if (clickedId !== null && clickedId !== id) {
      setClickedId(null);
    }
    setHoveredId(id);
  };

  const handleMouseLeaveFAQ = (id: number) => {
    setHoveredId((prev) => (prev === id ? null : prev));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(12px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  // Calendar Event parameters
  const eventTitle = "Live Masterclass: Become the Leader Your Organization Trusts to Navigate AI";
  const eventDesc = "You're registered for a live 90-minute session with Pan Seth, founder of The Forward Org. Come ready to score your own AI Leadership Readiness live → and to meet the leader you're becoming.";
  const eventLoc = "[Zoom / webinar link to be inserted]";

  const calendarUrlGoogle = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=20260717T160000Z%2F20260717T173000Z&details=${encodeURIComponent(eventDesc)}&location=${encodeURIComponent(eventLoc)}`;
  
  const calendarUrlYahoo = `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${encodeURIComponent(eventTitle)}&st=20260717T160000Z&et=20260717T173000Z&desc=${encodeURIComponent(eventDesc)}&in_loc=${encodeURIComponent(eventLoc)}`;

  const calendarUrlOutlook = `https://outlook.live.com/calendar/0/deeplink/compose?path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&subject=${encodeURIComponent(eventTitle)}&startdt=2026-07-17T12:00:00-04:00&enddt=2026-07-17T13:30:00-04:00&body=${encodeURIComponent(eventDesc)}&location=${encodeURIComponent(eventLoc)}`;

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//The Forward Org//Masterclass Calendar//EN
BEGIN:VEVENT
UID:masterclass-20260717@theforwardorg.com
DTSTAMP:20260717T120000Z
DTSTART:20260717T160000Z
DTEND:20260717T173000Z
SUMMARY:${eventTitle}
DESCRIPTION:${eventDesc}
LOCATION:${eventLoc}
END:VEVENT
END:VCALENDAR`;
  const calendarUrlApple = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;

  const currentRegistrationUrl = typeof window !== "undefined" ? window.location.href : "https://theforwardorg.com/masterclass";

  return (
    <div className="bg-white min-h-screen text-ink">
      {/* 1. Hero Section */}
      <section 
        ref={heroRef} 
        id="hero" 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative min-h-screen bg-ink pt-24 md:pt-0 flex flex-col justify-between overflow-hidden"
      >
        <div 
          className="absolute inset-0 z-0 select-none overflow-hidden"
          style={{ transform: "translateZ(0)", isolation: "isolate" }}
        >
          <motion.div
            className="w-full h-full"
            animate={{ scale: isHovered ? 1.05 : 1.0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transformOrigin: "center center",
              willChange: "transform",
            }}
          >
            <motion.img
              initial={{ scale: 1.2 }}
              animate={{ scale: 1.0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              src={masterclassHeroImg}
              alt="Live Masterclass: Lead your team through AI"
              className="w-full h-full object-cover object-right lg:object-[85%_center] opacity-100"
              style={{
                objectPosition: isMobile ? "80% center" : undefined,
                scale: hasEntered ? scaleValue : undefined,
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1920&h=1080";
              }}
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          <div className="absolute inset-y-0 left-0 w-full md:w-[60%] lg:w-[50%] bg-gradient-to-r from-ink via-ink/85 to-transparent hidden md:block z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/90 to-transparent md:hidden z-10 pointer-events-none" />
        </div>

        {/* Hero Content Aligned Left */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-7xl px-6 md:px-12 z-20 text-left">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl flex flex-col items-start"
          >
            <span className="font-sans font-bold text-xs text-gold capitalize tracking-[0.2em] block">
              Live Masterclass
            </span>

            <motion.h1
              variants={itemVariants}
              className="font-serif text-hero leading-[1.12] font-bold tracking-tight text-white text-balance mt-3 md:mt-4"
            >
              How to Future-Proof Your Leadership Career - Even If AI Feels Overwhelming
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="font-sans text-[17px] md:text-[19px] text-off-white/85 leading-relaxed font-light max-w-2xl mt-4 text-balance"
            >
              Discover the leadership mindset, practical frameworks, and AI strategies that will help you confidently lead change, create greater influence, and become the leader your organization needs in the Age of AI.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-[24px] items-stretch sm:items-center mt-8 pt-0 w-full"
            >
              <InteractiveButton
                onClick={handleScrollToForm}
                variant="gold"
                className="text-center px-8 py-4 font-bold animate-none"
              >
                Save My Seat
              </InteractiveButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. Quick Stats / Metadata Bar */}
      <section className="py-8 bg-[#F7F4EF] border-y border-gold/15 relative z-30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4 text-center text-sm font-sans font-medium text-ink-muted uppercase tracking-widest">
            <span>Length: 90 minutes</span>
            <span className="hidden md:inline text-gold/60">•</span>
            <span>Type: Live Interactive</span>
            <span className="hidden md:inline text-gold/60">•</span>
            <span>Live Only</span>
            <span className="hidden md:inline text-gold/60">•</span>
            <span>No Replay</span>
          </div>
        </div>
      </section>

      {/* 3. The Core Challenge Section */}
      <section className="py-24 md:py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-left">
          <ScrollReveal duration={0.6}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-6">
                <span className="font-sans font-bold text-xs text-gold capitalize tracking-[0.2em] block">
                  The Core Challenge
                </span>
                <h2 className="font-serif text-[32px] md:text-[45px] leading-tight font-bold text-ink">
                  The Next AI Conversation Needs a Different Kind of Leader.
                </h2>
                
                <p className="font-serif text-xl md:text-2xl text-teal font-medium leading-relaxed border-l-2 border-gold/40 pl-6 my-8">
                  AI transformation doesn't begin with technology. It begins with leaders who are prepared to guide it.
                </p>
                
                <div className="font-sans text-base md:text-lg text-ink-muted leading-relaxed font-light mt-6 space-y-4">
                  <p>Every organization is making AI decisions.</p>
                  <p>The question is whether you'll help shape them or simply respond to them.</p>
                  <p>This masterclass helps you understand where you stand today, uncover the leadership capability that matters most, and take the next step toward becoming the leader your organization will trust to guide AI transformation.</p>
                </div>

                <div className="pt-8">
                  <InteractiveButton
                    onClick={handleScrollToForm}
                    variant="gold"
                    className="px-8 py-4 font-bold"
                  >
                    Reserve My Seat
                  </InteractiveButton>
                </div>
              </div>

              {/* Image side */}
              <div className="relative aspect-[4/5] w-full rounded-[2px] overflow-hidden shadow-md">
                <img 
                  src={heroImage} 
                  alt="Business session mentor explaining concepts offline" 
                  className="w-full h-full object-cover object-right" 
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. What To Expect */}
      <section className="py-24 md:py-32 bg-[#F7F4EF]/50 border-t border-b border-gold/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <ScrollReveal duration={0.6}>
            <div className="mb-16 text-center md:text-left">
              <span className="font-sans font-bold text-xs text-gold capitalize tracking-[0.2em] block mb-3">
                Program Structure
              </span>
              <h2 className="font-serif text-[32px] md:text-[40px] font-bold text-ink leading-tight">
                What To Expect
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Box 01 */}
            <div className="space-y-6 bg-white p-8 md:p-10 border border-gold/10 rounded-[2px] shadow-sm text-left">
              <h3 className="font-serif text-2xl font-bold text-[#1A3C34] border-b border-gold/10 pb-4 flex items-center gap-3">
                <span className="text-gold font-mono text-xl">01 /</span>
                During the Masterclass
              </h3>
              
              <ul className="space-y-4 font-sans text-[15px] md:text-[16px] text-ink-muted">
                <li className="flex items-start gap-3">
                  <span className="text-teal font-bold text-lg shrink-0 mt-0.5">→</span>
                  <span>Discover the five stages of AI leadership.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal font-bold text-lg shrink-0 mt-0.5">→</span>
                  <span>Measure your Forward Leadership Score.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal font-bold text-lg shrink-0 mt-0.5">→</span>
                  <span>Identify your strongest leadership capability and your biggest growth opportunity.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal font-bold text-lg shrink-0 mt-0.5">→</span>
                  <span>Learn what it takes to confidently lead AI transformation inside your organization.</span>
                </li>
              </ul>
            </div>

            {/* Box 02 */}
            <div className="space-y-6 bg-white p-8 md:p-10 border border-gold/10 rounded-[2px] shadow-sm text-left">
              <h3 className="font-serif text-2xl font-bold text-teal border-b border-gold/10 pb-4 flex items-center gap-3">
                <span className="text-teal font-mono text-xl">02 /</span>
                You'll Leave With
              </h3>
              
              <ul className="space-y-4 font-sans text-[15px] md:text-[16px] text-ink-muted">
                <li className="flex items-start gap-3">
                  <span className="text-teal font-bold text-lg shrink-0 mt-0.5">→</span>
                  <span>Your personalized Forward Leadership Score.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal font-bold text-lg shrink-0 mt-0.5">→</span>
                  <span>Your current AI leadership stage.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal font-bold text-lg shrink-0 mt-0.5">→</span>
                  <span>The one capability to strengthen first.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal font-bold text-lg shrink-0 mt-0.5">→</span>
                  <span>One move to lead the very next AI conversation in your organization → this week</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 text-center">
            <InteractiveButton
              onClick={handleScrollToForm}
              variant="gold"
              className="px-10 py-4 font-bold"
            >
              Save My Seat
            </InteractiveButton>
          </div>
        </div>
      </section>

      {/* 5. Booking/Registration Form Section */}
      <section id="register-form" className="bg-white py-24 md:py-32">
        <div className="max-w-xl mx-auto px-6 text-center space-y-8">
          <div className="space-y-3">
            <span className="font-sans font-bold text-xs text-gold capitalize tracking-[0.25em] block">
              Join the Waitlist for the Next Live Masterclass
            </span>
            <h2 className="font-serif text-[32px] font-bold text-ink">
              Save Your Seat
            </h2>
            <p className="font-sans text-base text-ink-muted leading-relaxed font-light">
              Join Leaders Preparing for the Future of AI. Folks in the waitlist would be first to get invited to the next masterclass, along with AI leadership insights and practical resources from The Forward Org.
            </p>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6 text-left bg-[#F7F4EF]/40 p-8 md:p-10 border border-gold/15 shadow-sm rounded-none">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="mc-name" className="block text-[13px] font-semibold text-teal capitalize tracking-wide">
                    Full Name
                  </label>
                  <input
                    id="mc-name"
                    type="text"
                    required
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-ink/15 focus:border-teal bg-white text-ink text-[15px] focus-visible:outline-none rounded-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="mc-email" className="block text-[13px] font-semibold text-teal capitalize tracking-wide">
                    Email
                  </label>
                  <input
                    id="mc-email"
                    type="email"
                    required
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-ink/15 focus:border-teal bg-white text-ink text-[15px] focus-visible:outline-none rounded-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="mc-company" className="block text-[13px] font-semibold text-teal capitalize tracking-wide">
                    Organization <span className="text-ink-muted/60 text-xs font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    id="mc-company"
                    type="text"
                    placeholder="Organization (optional)"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-3 border border-ink/15 focus:border-teal bg-white text-ink text-[15px] focus-visible:outline-none rounded-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="mc-role" className="block text-[13px] font-semibold text-teal capitalize tracking-wide">
                    Your Title / Role <span className="text-ink-muted/60 text-xs font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    id="mc-role"
                    type="text"
                    placeholder="Your Title / Role (optional)"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3 border border-ink/15 focus:border-teal bg-white text-ink text-[15px] focus-visible:outline-none rounded-none"
                  />
                </div>
              </div>

              <div className="pt-4">
                <InteractiveButton
                  type="submit"
                  disabled={isSubmitting}
                  variant="gold"
                  className="w-full py-4 text-center text-sm font-bold capitalize tracking-wider"
                >
                  {isSubmitting ? "Processing Reservation..." : "Join the Waitlist"}
                </InteractiveButton>
              </div>

              <p className="text-center text-[11px] text-ink-faint">
                Conducted with absolute confidentiality. No marketing spam, guaranteed.
              </p>
            </form>
          ) : (
            /* POST-REGISTRATION SUCCESS CONTAINER */
            <div className="bg-[#FAF9F6] p-8 md:p-12 border border-[#E8D5B5] text-left space-y-10 rounded-none shadow-sm select-text">
              
              <div className="space-y-4 border-b border-[#C9A55A]/20 pb-8">
                <div className="flex items-center gap-3">
                  <h3 className="font-serif text-3xl font-bold text-ink leading-tight">You're In.</h3>
                  {/* Inline green circle tick next to text */}
                  <span className="inline-flex items-center justify-center bg-[#1A3C34] text-white rounded-full w-8 h-8 shrink-0">
                    <Check size={18} strokeWidth={3} />
                  </span>
                </div>
                
                <p className="font-sans text-[16px] text-ink-muted leading-relaxed font-light mt-2">
                  Your seat for &ldquo;Become the Leader Your Organization Trusts to Navigate AI&rdquo; is saved.
                </p>
                
                <div className="bg-white px-5 py-4 border-l-2 border-gold flex items-center font-serif text-[15px] text-ink font-bold shadow-sm mt-4 select-none">
                  <span>17 July 2026 · 12 PM Eastern Time · 90 minutes · Live Only</span>
                </div>
              </div>

              {/* Swapped Calendar Buttons with Brand Logos and hover properties */}
              <div className="space-y-6">
                <p className="font-sans font-bold text-xs text-gold uppercase tracking-wider select-none">Never Miss It. Add To Your Calendar.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 1. Apple (Swapped positions) */}
                  <a 
                    href={calendarUrlApple} 
                    className="flex items-center justify-center px-4 py-3 bg-white hover:bg-gold/5 border border-gold/15 hover:border-gold hover:text-gold text-xs font-semibold text-ink transition-all duration-200 rounded-none shadow-sm cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-2 shrink-0 fill-current" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z"/>
                    </svg>
                    <span>Add to Apple Calendar (iCal)</span>
                  </a>

                  {/* 2. Google (Swapped positions) */}
                  <a 
                    href={calendarUrlGoogle} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center px-4 py-3 bg-white hover:bg-gold/5 border border-gold/15 hover:border-gold hover:text-gold text-xs font-semibold text-ink transition-all duration-200 rounded-none shadow-sm cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-2 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.13-4.53z"/>
                    </svg>
                    <span>Add to Google Calendar</span>
                  </a>

                  {/* 3. Yahoo (Swapped positions) */}
                  <a 
                    href={calendarUrlYahoo} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center px-4 py-3 bg-white hover:bg-gold/5 border border-gold/15 hover:border-gold hover:text-gold text-xs font-semibold text-ink transition-all duration-200 rounded-none shadow-sm cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-2 shrink-0" viewBox="0 0 24 24">
                      <path fill="#6001d2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 5.5l2.25 4.5 2.25-4.5h2.5L14 13.5v4h-2.5v-4L8 7.5h2.5z"/>
                    </svg>
                    <span>Add to Yahoo Calendar</span>
                  </a>

                  {/* 4. Outlook (Swapped positions) */}
                  <a 
                    href={calendarUrlOutlook} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center px-4 py-3 bg-white hover:bg-gold/5 border border-gold/15 hover:border-gold hover:text-gold text-xs font-semibold text-ink transition-all duration-200 rounded-none shadow-sm cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-2 shrink-0" viewBox="0 0 24 24">
                      <path fill="#0078d4" d="M1 5.5V18.5L9.5 22V2L1 5.5Z"/>
                      <path fill="#106ebe" d="M9.5 2V22L23 18.5V5.5L9.5 2Z"/>
                      <path fill="#ffffff" d="M12.5 7.5H20V15H12.5V7.5Z" opacity="0.8"/>
                      <path fill="#106ebe" d="M14 9H18.5V13.5H14V9Z"/>
                    </svg>
                    <span>Add to Outlook</span>
                  </a>
                </div>
              </div>

              {/* What Happens Next list */}
              <div className="space-y-6 pt-6 border-t border-[#C9A55A]/20">
                <h4 className="font-serif text-lg font-bold text-ink">What Happens Next</h4>
                <ul className="space-y-3 font-sans text-sm text-ink-muted leading-relaxed font-light">
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-0.5">●</span>
                    <span>You'll get a confirmation email right now.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-0.5">●</span>
                    <span>You'll get a reminder 24 hours before, and again 1 hour before.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-0.5">●</span>
                    <span>Come ready to be honest with yourself. The scoring only works live.</span>
                  </li>
                </ul>
              </div>

              {/* Bring A Leader secondary action */}
              <div className="space-y-4 pt-8 border-t border-[#C9A55A]/20">
                <h4 className="font-serif text-xl font-bold text-ink">Know a Leader Who Should Be in the AI Conversations &rarr; and Isn't Yet?</h4>
                <p className="font-sans text-[14px] text-ink-muted leading-relaxed font-light">
                  Bring them with you. The leaders who make this shift do not make it alone.
                </p>
                <div className="flex items-center gap-2 mt-4 select-all">
                  <input
                    type="text"
                    readOnly
                    value={currentRegistrationUrl}
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                    className="w-full px-3 py-2 bg-white border border-[#E8D5B5] text-xs text-ink font-mono focus-visible:outline-none rounded-none"
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(currentRegistrationUrl);
                      alert("Link copied to clipboard!");
                    }}
                    className="px-4 py-2 bg-[#1A3C34] text-white hover:bg-[#1A3C34]/85 text-xs font-semibold shrink-0 transition-colors rounded-none cursor-pointer"
                  >
                    Copy Link
                  </button>
                </div>
              </div>

              <div className="pt-6 text-center border-t border-[#C9A55A]/20 select-none">
                <p className="font-serif text-base italic text-gold font-bold">See you on the 17th. &mdash; Pan</p>
              </div>

            </div>
          )}
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section id="faq" className="relative bg-[#F7F4EF]/30 py-24 md:py-32 overflow-hidden border-t border-gold/10">
        <div className="absolute inset-0 pointer-events-none select-none opacity-[0.05]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="topo-contour" width="200" height="150" patternUnits="userSpaceOnUse">
                <path d="M0,25 C50,15 80,45 130,35 C180,25 150,55 200,45" fill="none" stroke="var(--color-teal)" strokeWidth="0.75" />
                <path d="M0,65 C40,55 100,75 140,55 C180,35 160,85 200,75" fill="none" stroke="var(--color-teal)" strokeWidth="0.75" />
                <path d="M0,105 C60,95 90,125 150,105 C180,85 160,115 200,115" fill="none" stroke="var(--color-teal)" strokeWidth="0.75" />
                <path d="M0,140 C30,130 110,135 130,145 C170,125 180,140 200,135" fill="none" stroke="var(--color-teal)" strokeWidth="0.75" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#topo-contour)" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10 text-left">
          <ScrollReveal duration={0.6}>
            <div className="mb-16">
              <span className="font-sans font-medium text-xs text-gold capitalize tracking-[0.2em] block mb-3">
                Common Questions
              </span>
              <h2 className="font-serif text-[32px] md:text-[40px] font-bold text-ink leading-none">
                FAQ
              </h2>
            </div>
          </ScrollReveal>

          <StaggerContainer>
            <div className="border-t border-gold/30">
              {faqItems.map((item, idx) => {
                const isOpen = hoveredId === item.id || clickedId === item.id;
                
                return (
                  <div 
                    key={item.id} 
                    className="border-b border-gold/30"
                    onMouseEnter={() => handleMouseEnterFAQ(item.id)}
                    onMouseLeave={() => handleMouseLeaveFAQ(item.id)}
                  >
                    <StaggerItem index={idx}>
                      <button
                         onClick={() => toggleFAQ(item.id)}
                         data-faq-button="true"
                         className="w-full text-left py-6 flex items-center justify-between gap-6 cursor-pointer focus-visible:outline-2 focus-visible:outline-gold relative group select-none"
                         aria-expanded={isOpen}
                         aria-controls={`faq-answer-${item.id}`}
                      >
                        <span
                          className={`font-serif text-lg md:text-xl font-medium transition-colors duration-200 pr-4 ${
                            isOpen ? "text-teal" : "text-ink group-hover:text-teal"
                          }`}
                        >
                          {item.question}
                        </span>

                        <span className="shrink-0">
                          <ChevronDown
                            size={20}
                            strokeWidth={1.5}
                            strokeLinecap="square"
                            strokeLinejoin="miter"
                            className={`transition-transform duration-250 ease-in-out ${
                              isOpen ? "rotate-180 text-teal" : "rotate-0 text-ink/40"
                            }`}
                          />
                        </span>
                      </button>

                      <div
                        id={`faq-answer-${item.id}`}
                        className={`grid transition-all duration-350 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="pb-6 pr-4">
                            <p className="font-sans text-[16px] text-ink-muted leading-[1.75] font-light">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    </StaggerItem>
                  </div>
                );
              })}
            </div>
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
