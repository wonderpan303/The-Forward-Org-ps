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
      answer: "Pan Seth, founder of The Forward Org. Pan has worked in data science and AI since 2016, including at Citi, PagerDuty and NielsenIQ, and has two filed AI patents. Today she helps founders, professionals and leaders make sense of AI and decide what to do next.",
    },
    {
      id: 2,
      question: "Who is this for?",
      answer: "Founders, professionals, managers and executives who want to understand how AI changes the way they work and lead. No technical background needed.",
    },
    {
      id: 3,
      question: "What will I gain?",
      answer: "Your Forward Leadership Score, your current AI leadership stage, the one capability to strengthen first and one move you can make this week.",
    },
    {
      id: 4,
      question: "Do I need AI or technical experience?",
      answer: "Not at all. This session is about how you think, work and lead. No coding.",
    },
    {
      id: 5,
      question: "What happens after the masterclass?",
      answer: "You leave with your score and a clear next move. For anyone who wants to go deeper, I'll share an invitation to a small founding cohort, where we keep learning and practising together. It's optional.",
    },
    {
      id: 6,
      question: "Is the masterclass free?",
      answer: "Yes.",
    },
    {
      id: 7,
      question: "Will there be a replay?",
      answer: "No. The score, exercises and Q&A work best live. If you miss this one, you'll be invited to the next.",
    },
    {
      id: 8,
      question: "What is The Forward Org?",
      answer: "An AI strategy and leadership advisory that helps leaders and organizations become AI-Forward through strategy, culture and practical governance.",
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
              Free Live Masterclass
            </span>

            <motion.h1
              variants={itemVariants}
              className="font-serif text-hero leading-[1.12] font-bold tracking-tight text-white text-balance mt-3 md:mt-4"
            >
              The AI-Forward Leader: How to Think, Work and Lead Differently in the AI Era
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="font-sans text-[17px] md:text-[19px] text-off-white/85 leading-relaxed font-light max-w-2xl mt-4 text-balance"
            >
              AI is moving faster than most of us can keep up with. In 90 minutes we go beyond tools and prompts: what's changing, how AI-Forward leaders work differently and what you can do this week. Even if AI feels overwhelming.
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
                Join the Waitlist
              </InteractiveButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. Quick Stats / Metadata Bar */}
      <section className="py-8 bg-[#F7F4EF] border-y border-gold/15 relative z-30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4 text-center text-sm font-sans font-medium text-ink-muted uppercase tracking-widest">
            <span>90 minutes</span>
            <span className="hidden md:inline text-gold/60">•</span>
            <span>Live and interactive</span>
            <span className="hidden md:inline text-gold/60">•</span>
            <span>Free</span>
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
                  Why This Masterclass
                </span>
                <h2 className="font-serif text-[32px] md:text-[45px] leading-tight font-bold text-ink">
                  AI is everywhere. Clarity about what to do with it is rare.
                </h2>

                <p className="font-serif text-xl md:text-2xl text-teal font-medium leading-relaxed border-l-2 border-gold/40 pl-6 my-8">
                  Every week brings new tools and bold predictions. Few of them tell you how your work, your team or your business should change.
                </p>

                <div className="font-sans text-base md:text-lg text-ink-muted leading-relaxed font-light mt-6 space-y-4">
                  <p>This session is for the part after the headlines.</p>
                  <p>You'll see how AI changes the way people think, work and lead, with real examples from around the world.</p>
                  <p>No technical background needed.</p>
                </div>

                <div className="pt-8">
                  <InteractiveButton
                    onClick={handleScrollToForm}
                    variant="gold"
                    className="px-8 py-4 font-bold"
                  >
                    Join the Waitlist
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
                Think. Work. Lead.
              </span>
              <h2 className="font-serif text-[32px] md:text-[40px] font-bold text-ink leading-tight">
                What You'll Learn
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
                  <span><strong className="font-semibold text-ink">Think:</strong> the five stages of AI leadership, and where you stand today.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal font-bold text-lg shrink-0 mt-0.5">→</span>
                  <span><strong className="font-semibold text-ink">Work:</strong> how AI-Forward professionals and teams redesign their work, beyond tools and prompts.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal font-bold text-lg shrink-0 mt-0.5">→</span>
                  <span><strong className="font-semibold text-ink">Lead:</strong> how to guide your team or business through change people can trust.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal font-bold text-lg shrink-0 mt-0.5">→</span>
                  <span>Plus: real AI stories from around the world that most feeds miss, and what they mean for you.</span>
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
                  <span>One move to lead your next AI conversation this week.</span>
                </li>
              </ul>
            </div>

            {/* Box 03 */}
            <div className="space-y-6 bg-white p-8 md:p-10 border border-gold/10 rounded-[2px] shadow-sm text-left">
              <h3 className="font-serif text-2xl font-bold text-[#1A3C34] border-b border-gold/10 pb-4 flex items-center gap-3">
                <span className="text-gold font-mono text-xl">03 /</span>
                Who It's For
              </h3>
              <ul className="space-y-4 font-sans text-[15px] md:text-[16px] text-ink-muted">
                <li className="flex items-start gap-3">
                  <span className="text-teal font-bold text-lg shrink-0 mt-0.5">→</span>
                  <span>Founders who want AI to change how the business runs, beyond a few tools.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal font-bold text-lg shrink-0 mt-0.5">→</span>
                  <span>Professionals who want to stay on top of their game as AI reshapes their role.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal font-bold text-lg shrink-0 mt-0.5">→</span>
                  <span>Managers, directors and executives leading people through AI change.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal font-bold text-lg shrink-0 mt-0.5">→</span>
                  <span>No technical background needed.</span>
                </li>
              </ul>
            </div>

            {/* Box 04 */}
            <div className="space-y-6 bg-white p-8 md:p-10 border border-gold/10 rounded-[2px] shadow-sm text-left">
              <h3 className="font-serif text-2xl font-bold text-teal border-b border-gold/10 pb-4 flex items-center gap-3">
                <span className="text-teal font-mono text-xl">04 /</span>
                How the Session Runs
              </h3>
              <ul className="space-y-4 font-sans text-[15px] md:text-[16px] text-ink-muted">
                <li className="flex items-start gap-3">
                  <span className="text-teal font-bold text-lg shrink-0 mt-0.5">→</span>
                  <span>60 minutes of teaching and live exercises.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal font-bold text-lg shrink-0 mt-0.5">→</span>
                  <span>20 minutes of open Q&amp;A.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal font-bold text-lg shrink-0 mt-0.5">→</span>
                  <span>10 minutes on what's next, including an invitation for anyone who wants to go deeper.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal font-bold text-lg shrink-0 mt-0.5">→</span>
                  <span>No hard sell. You'll leave with something useful whether you take the next step or not.</span>
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
              Join the Waitlist
            </InteractiveButton>
          </div>
        </div>
      </section>

      {/* 5. Booking/Registration Form Section */}
      <section id="register-form" className="bg-white py-24 md:py-32">
        <div className="max-w-xl mx-auto px-6 text-center space-y-8">
          <div className="space-y-3">
            <span className="font-sans font-bold text-xs text-gold capitalize tracking-[0.25em] block">
              The Next Live Masterclass
            </span>
            <h2 className="font-serif text-[32px] font-bold text-ink">
              Join the Waitlist
            </h2>
            <p className="font-sans text-base text-ink-muted leading-relaxed font-light">
              Be first to hear the next live date, plus my weekly AI insights.
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
                  {isSubmitting ? "Joining..." : "Join the Waitlist"}
                </InteractiveButton>
              </div>

              <p className="text-center text-[11px] text-ink-faint">
                Your details stay private. No spam. Unsubscribe anytime.
              </p>
            </form>
          ) : (
            /* POST-REGISTRATION SUCCESS CONTAINER */
            <div className="bg-[#FAF9F6] p-8 md:p-12 border border-[#E8D5B5] text-left space-y-10 rounded-none shadow-sm select-text">
              
              <div className="space-y-4 border-b border-[#C9A55A]/20 pb-8">
                <div className="flex items-center gap-3">
                  <h3 className="font-serif text-3xl font-bold text-ink leading-tight">You're on the list.</h3>
                  {/* Inline green circle tick next to text */}
                  <span className="inline-flex items-center justify-center bg-[#1A3C34] text-white rounded-full w-8 h-8 shrink-0">
                    <Check size={18} strokeWidth={3} />
                  </span>
                </div>
                
                <p className="font-sans text-[16px] text-ink-muted leading-relaxed font-light mt-2">
                  You're on the waitlist for &ldquo;The AI-Forward Leader: How to Think, Work and Lead Differently in the AI Era.&rdquo; You'll be first to hear the next live date.
                </p>
              </div>

              {/* What Happens Next list */}
              <div className="space-y-6 pt-6 border-t border-[#C9A55A]/20">
                <h4 className="font-serif text-lg font-bold text-ink">What Happens Next</h4>
                <ul className="space-y-3 font-sans text-sm text-ink-muted leading-relaxed font-light">
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-0.5">●</span>
                    <span>You'll hear the next live date by email before anyone else.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-0.5">●</span>
                    <span>Once the date is set, you'll get a reminder before the session.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold mt-0.5">●</span>
                    <span>Come ready to be honest with yourself. The scoring works best live.</span>
                  </li>
                </ul>
              </div>

              {/* Bring A Leader secondary action */}
              <div className="space-y-4 pt-8 border-t border-[#C9A55A]/20">
                <h4 className="font-serif text-xl font-bold text-ink">Know someone who should be in this conversation?</h4>
                <p className="font-sans text-[14px] text-ink-muted leading-relaxed font-light">
                  Send them this link. People make this shift faster together.
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
                <p className="font-serif text-base italic text-gold font-bold">See you there. &rarr; Pan</p>
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
