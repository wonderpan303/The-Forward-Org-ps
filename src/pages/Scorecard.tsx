import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, RotateCcw, AlertCircle, Calendar } from "lucide-react";
import { useLocation } from "wouter";
import { InteractiveButton } from "../components/InteractiveButton";
import { motion, AnimatePresence } from "framer-motion";
import { submitToBrevo } from "../utils/submitToBrevo";
import panPhoto from "../assets/images/forward_org_exists.png";

interface Question {
  id: number;
  section: string;
  question: string;
  options: string[];
}

interface AnimatedBorderProps {
  isHovered: boolean;
  color: string;
  borderRadius?: number;
}

function AnimatedBorder({ isHovered, color, borderRadius = 0 }: AnimatedBorderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        setCoords({
          w: containerRef.current.offsetWidth,
          h: containerRef.current.offsetHeight,
        });
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const { w, h } = coords;

  if (w === 0 || h === 0) {
    return <div ref={containerRef} className="absolute inset-0 pointer-events-none" />;
  }

  const r = borderRadius;
  const sw = 2; // stroke width
  const offset = sw / 2;

  // Clockwise path starting at top-center and ending at bottom-center
  const path1 = r > 0 ? `
    M ${w / 2} ${offset}
    L ${w - r} ${offset}
    A ${r - offset} ${r - offset} 0 0 1 ${w - offset} ${r}
    L ${w - offset} ${h - r}
    A ${r - offset} ${r - offset} 0 0 1 ${w - r} ${h - offset}
    L ${w / 2} ${h - offset}
  ` : `
    M ${w / 2} ${offset}
    L ${w - offset} ${offset}
    L ${w - offset} ${h - offset}
    L ${w / 2} ${h - offset}
  `;

  // Counter-clockwise path starting at top-center and ending at bottom-center
  const path2 = r > 0 ? `
    M ${w / 2} ${offset}
    L ${r} ${offset}
    A ${r - offset} ${r - offset} 0 0 0 ${offset} ${r}
    L ${offset} ${h - r}
    A ${r - offset} ${r - offset} 0 0 0 ${r} ${h - offset}
    L ${w / 2} ${h - offset}
  ` : `
    M ${w / 2} ${offset}
    L ${offset} ${offset}
    L ${offset} ${h - offset}
    L ${w / 2} ${h - offset}
  `;

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      <svg className="absolute inset-0 w-full h-full animate-none" fill="none">
        <motion.path
          d={path1}
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="square"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        <motion.path
          d={path2}
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="square"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

// Capability Card Component with Gold Animated Border Hover and Grid Sizing
function CapabilityCard({ title, description, status, score }: { title: string; description: string; status: string; score: number }) {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (st: string) => {
    if (st === "Strong") return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (st === "Developing") return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-rose-700 bg-rose-50 border-rose-200";
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white border border-[#E8D5B5] p-6 rounded-none shadow-sm flex flex-col justify-between h-full min-h-[240px] relative transition-all duration-200"
    >
      {/* Animated border changed to gold brand color #C9A55A */}
      <AnimatedBorder isHovered={isHovered} color="#C9A55A" borderRadius={0} />
      
      <div className="space-y-3 text-left relative z-10 flex-grow">
        {/* Card heading size visual hierarchy (smaller than parent section h2) */}
        <h3 className="font-serif text-md md:text-lg font-bold text-ink leading-snug">{title}</h3>
        <p className="font-sans text-[13px] text-ink-muted leading-relaxed">
          {description}
        </p>
      </div>

      {/* Bottom status and score layout */}
      <div className="mt-6 pt-4 border-t border-ink/5 flex items-end justify-end relative z-10 shrink-0">
        <div className="text-right flex items-baseline gap-0.5">
          <span className="font-serif text-2xl font-bold text-ink leading-none">{score}</span>
          <span className="font-sans text-[11px] text-ink-muted/70">/12</span>
        </div>
      </div>
    </div>
  );
}

export default function Scorecard() {
  const [location, setLocation] = useLocation();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(12).fill(null));
  const [quizComplete, setQuizComplete] = useState(false);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [gateEmail, setGateEmail] = useState("");
  const [gateName, setGateName] = useState("");
  const [gateSubmitting, setGateSubmitting] = useState(false);
  const [gateError, setGateError] = useState("");
  const timeoutRef = useRef<any>(null);

  // Interactive Hover Graph tracker coordinates
  const [hoveredX, setHoveredX] = useState<number | null>(null);
  const graphSvgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const questions: Question[] = [
    // SECTION 1: Lead Yourself
    {
      id: 1,
      section: "Lead Yourself",
      question: "When AI comes up during leadership discussions, what role do you usually play?",
      options: [
        "I mostly listen because I am still trying to understand what it means for our organization.",
        "I contribute occasionally but would not feel confident leading the discussion.",
        "I can connect AI to practical opportunities within my team or department.",
        "Others regularly look to me for clarity, direction and informed judgement."
      ]
    },
    {
      id: 2,
      section: "Lead Yourself",
      question: "At the end of a typical workday, how do you usually feel?",
      options: [
        "Busy all day but still behind.",
        "Productive, although much of my day is reactive.",
        "Mostly focused, with some systems helping me stay organized.",
        "I have a deliberate operating system that protects my attention and keeps me focused on high-value work."
      ]
    },
    {
      id: 3,
      section: "Lead Yourself",
      question: "How do you currently use AI when preparing for important meetings, presentations or decisions?",
      options: [
        "I rarely use AI.",
        "I occasionally use it for brainstorming or drafting.",
        "AI helps me research, organize ideas and improve decisions.",
        "AI is part of a repeatable leadership workflow that strengthens my thinking and judgement."
      ]
    },
    // SECTION 2: Lead Others
    {
      id: 4,
      section: "Lead Others",
      question: "When someone asks how AI may affect their role, what usually happens?",
      options: [
        "I do not yet have a clear answer.",
        "I reassure them, but the conversation remains general.",
        "I explain practical changes and next steps.",
        "I help them understand how their role can evolve and where they create greater value."
      ]
    },
    {
      id: 5,
      section: "Lead Others",
      question: "When someone on your team is hesitant to use AI, what usually happens?",
      options: [
        "The topic is avoided.",
        "They are shown the tool and expected to figure it out.",
        "We discuss concerns and provide practical support.",
        "I actively coach people through the emotional, practical and role-specific changes until confidence grows."
      ]
    },
    {
      id: 6,
      section: "Lead Others",
      question: "After introducing a new AI-enabled workflow, what usually happens?",
      options: [
        "People gradually return to the old way of working.",
        "A few people continue using it.",
        "Most of the team adopts it, although momentum depends on reminders.",
        "Adoption becomes part of the team's normal way of working through coaching, accountability and shared ownership."
      ]
    },
    // SECTION 3: Lead Transformation
    {
      id: 7,
      section: "Lead Transformation",
      question: "When someone proposes a new AI opportunity, how do you evaluate it?",
      options: [
        "We are unsure how to assess it.",
        "We discuss whether it seems useful.",
        "We consider value, effort, feasibility and risk.",
        "We follow a structured process that prioritizes opportunities based on business impact and strategic value."
      ]
    },
    {
      id: 8,
      section: "Lead Transformation",
      question: "When AI creates positive results, how clearly can you communicate its value?",
      options: [
        "We know it helped but have not measured it.",
        "We can describe anecdotal improvements.",
        "We track outcomes like time, quality or productivity.",
        "We clearly connect results to business priorities and communicate them to senior leaders."
      ]
    },
    {
      id: 9,
      section: "Lead Transformation",
      question: "If an executive asked, \"What is the strongest AI opportunity in your area?\" how prepared would you feel?",
      options: [
        "I would struggle to answer.",
        "I could suggest several ideas but not confidently recommend one.",
        "I could explain the highest priority opportunity and expected value.",
        "I could confidently present the business case, stakeholders, risks, measures and recommended next steps."
      ]
    },
    // SECTION 4: Lead Sustainably
    {
      id: 10,
      section: "Lead Sustainably",
      question: "If you stepped away from your role for two months, what would happen to your team's AI progress?",
      options: [
        "Most progress would stop.",
        "A few enthusiastic people would continue.",
        "Most initiatives would continue but momentum would slow.",
        "The team has enough ownership, capability and systems to continue improving without depending on me."
      ]
    },
    {
      id: 11,
      section: "Lead Sustainably",
      question: "When someone discovers a better way of working with AI, what usually happens?",
      options: [
        "The knowledge stays with that individual.",
        "A few people hear about it informally.",
        "We encourage sharing across the team.",
        "We consistently capture, improve and embed successful practices into the way our team works."
      ]
    },
    {
      id: 12,
      section: "Lead Sustainably",
      question: "Looking ahead 12 months, how confident are you that your team will be stronger because of AI?",
      options: [
        "I am uncertain.",
        "I hope we will improve but we do not yet have a clear direction.",
        "We have a plan and are making steady progress.",
        "We have a clear vision, strong leadership and the capability to continue evolving as AI changes."
      ]
    }
  ];

  const handleSelectOptionLocal = (optionIdx: number) => {
    const updated = [...answers];
    updated[currentIdx] = optionIdx;
    setAnswers(updated);

    if (currentIdx < questions.length - 1) {
      timeoutRef.current = setTimeout(() => {
        setCurrentIdx(currentIdx + 1);
      }, 280);
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleJumpBack = (idx: number) => {
    setCurrentIdx(idx);
  };

  const handleRestart = () => {
    setAnswers(Array(12).fill(null));
    setCurrentIdx(0);
    setQuizComplete(false);
    setShowEmailGate(false);
    setGateError("");
  };

  const handleSubmit = () => {
    if (answers.some(a => a === null)) {
      setGateError("Please answer all questions before submitting.");
      return;
    }
    setShowEmailGate(true);
  };

  const handleGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gateEmail || !gateName) {
      setGateError("Please fill in all required fields.");
      return;
    }
    setGateSubmitting(true);
    setGateError("");

    try {
      const listId = 3; 
      const attributes = {
        FIRSTNAME: gateName.split(" ")[0] || gateName,
        FULLNAME: gateName,
        SCORE: totalScore,
        LEVEL: levelLabel,
        STRONGEST: strongestName,
        OPPORTUNITY: opportunityName
      };

      await submitToBrevo(gateEmail.trim(), listId, attributes);
      setQuizComplete(true);
      setShowEmailGate(false);
    } catch (err) {
      console.error("Scorecard submission failed", err);
      setQuizComplete(true);
      setShowEmailGate(false);
    } finally {
      setGateSubmitting(false);
    }
  };

  // CALCULATIONS ENGINE
  const getSectionScore = (qA: number, qB: number, qC: number) => {
    const ansA = answers[qA] !== null ? (answers[qA] as number) + 1 : 0;
    const ansB = answers[qB] !== null ? (answers[qB] as number) + 1 : 0;
    const ansC = answers[qC] !== null ? (answers[qC] as number) + 1 : 0;
    return ansA + ansB + ansC;
  };

  const score1 = getSectionScore(0, 1, 2); 
  const score2 = getSectionScore(3, 4, 5); 
  const score3 = getSectionScore(6, 7, 8); 
  const score4 = getSectionScore(9, 10, 11); 

  const totalScore = score1 + score2 + score3 + score4; 

  // Level Logic
  let levelLabel = "Observer";
  if (totalScore >= 36) levelLabel = "Forward Leader";
  else if (totalScore >= 24) levelLabel = "Practitioner";

  const status1 = getStatusLabel(score1);
  const status2 = getStatusLabel(score2);
  const status3 = getStatusLabel(score3);
  const status4 = getStatusLabel(score4);

  function getStatusLabel(s: number) {
    if (s >= 9) return "Strong";
    if (s >= 6) return "Developing";
    return "Needs Attention";
  }

  // Strongest / Weakest calculation with Tie Breaking
  const sectionsData = [
    { name: "Lead Yourself", score: score1 },
    { name: "Lead Others", score: score2 },
    { name: "Lead Transformation", score: score3 },
    { name: "Lead Sustainably", score: score4 }
  ];

  let strongest = sectionsData[0];
  for (let i = 1; i < sectionsData.length; i++) {
    if (sectionsData[i].score > strongest.score) {
      strongest = sectionsData[i];
    }
  }

  let opportunity = sectionsData[3];
  for (let i = sectionsData.length - 2; i >= 0; i--) {
    if (sectionsData[i].score < opportunity.score) {
      opportunity = sectionsData[i];
    }
  }

  const allIdentical = score1 === score2 && score2 === score3 && score3 === score4;
  const strongestName = strongest.name;
  const opportunityName = opportunity.name;

  const clampedIdx = Math.max(0, Math.min(currentIdx, questions.length - 1));
  const selectedOptionIndex = answers[clampedIdx];
  const currentQuestion = questions[clampedIdx];

  // RADAR CHART COORDINATES
  const center = 150;
  const getPointCoord = (val: number, angleDeg: number) => {
    // Amplify visual variance: map score range 3-12 to radius range 15-85px
    const radius = 15 + ((val - 3) / 9) * 70;
    const angleRad = (angleDeg - 90) * (Math.PI / 180);
    return {
      x: center + radius * Math.cos(angleRad),
      y: center + radius * Math.sin(angleRad)
    };
  };

  const pt1 = getPointCoord(score1, 0);   
  const pt2 = getPointCoord(score2, 90);  
  const pt3 = getPointCoord(score3, 180); 
  const pt4 = getPointCoord(score4, 270); 
  const userPolygonPoints = `${pt1.x},${pt1.y} ${pt2.x},${pt2.y} ${pt3.x},${pt3.y} ${pt4.x},${pt4.y}`;

  const gridLine3 = `${getPointCoord(3, 0).x},${getPointCoord(3, 0).y} ${getPointCoord(3, 90).x},${getPointCoord(3, 90).y} ${getPointCoord(3, 180).x},${getPointCoord(3, 180).y} ${getPointCoord(3, 270).x},${getPointCoord(3, 270).y}`;
  const gridLine6 = `${getPointCoord(6, 0).x},${getPointCoord(6, 0).y} ${getPointCoord(6, 90).x},${getPointCoord(6, 90).y} ${getPointCoord(6, 180).x},${getPointCoord(6, 180).y} ${getPointCoord(6, 270).x},${getPointCoord(6, 270).y}`;
  const gridLine9 = `${getPointCoord(9, 0).x},${getPointCoord(9, 0).y} ${getPointCoord(9, 90).x},${getPointCoord(9, 90).y} ${getPointCoord(9, 180).x},${getPointCoord(9, 180).y} ${getPointCoord(9, 270).x},${getPointCoord(9, 270).y}`;
  const gridLine12 = `${getPointCoord(12, 0).x},${getPointCoord(12, 0).y} ${getPointCoord(12, 90).x},${getPointCoord(12, 90).y} ${getPointCoord(12, 180).x},${getPointCoord(12, 180).y} ${getPointCoord(12, 270).x},${getPointCoord(12, 270).y}`;

  // Interactive Hover Graph tracker handler
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!graphSvgRef.current) return;
    const rect = graphSvgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    // Map to coordinate bounds
    if (x >= 50 && x <= 550) {
      setHoveredX(x);
    } else {
      setHoveredX(null);
    }
  };

  // Curve calculations: expectation line is at y = 40 (flat horizontal). Compounding gap line curves downward:
  // Starts at 50,40 and goes down to 550, 180 (steepened curve)
  const getGraphYAtX = (x: number) => {
    // Basic Q curve: y = a * x^2 + b * x + c
    // points: (50, 40) at Month 1, (300, 110) at Month 6, (550, 180) at Month 12
    const startX = 50;
    const endX = 550;
    const t = (x - startX) / (endX - startX); // 0 to 1
    // Quadratic interpolation starting at 40 and ending at 180
    // Increasing slope dynamically to represent fourth quadrant compounding gap:
    const startY = 40;
    const endY = 180;
    return startY + t * t * (endY - startY); // Steep compounding curve
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-ink relative select-none">
      
      {!quizComplete ? (
        showEmailGate ? (
          /* EMAIL GATE CONTAINER */
          <div className="w-full min-h-screen flex flex-col items-center justify-center pt-16 pb-16 px-4 md:px-6 relative bg-[#F7F4EF]/30">
            <div className="max-w-[580px] w-full bg-[#FAF9F5] border border-[#D4C9B8] py-8 px-6 sm:p-10 md:p-12 shadow-sm relative flex flex-col justify-center">
              <button
                onClick={() => setShowEmailGate(false)}
                className="absolute top-6 left-6 flex text-xs font-sans capitalize tracking-wider items-center gap-1.5 cursor-pointer text-[#1A3C34] hover:text-[#C9A55A] transition-colors py-1 focus:outline-none"
              >
                <ArrowLeft size={14} /> Back to Survey
              </button>

              <div className="text-center space-y-4 mb-8 mt-4">
                <span className="font-sans font-semibold text-[11px] text-[#C9A55A] capitalize tracking-[0.25em] block">
                  Your Result Is Ready
                </span>
                
                <h2 className="font-serif text-[28px] sm:text-[34px] font-bold text-[#1A3C34] leading-[1.2] tracking-tight text-balance">
                  Unlock Your <span className="font-serif italic font-normal text-[#C9A55A]">Forward Score</span>
                </h2>
              </div>

              <form onSubmit={handleGateSubmit} className="space-y-6">
                <div className="space-y-2 text-left">
                  <label htmlFor="gate-name" className="block text-[12px] font-sans font-semibold text-[#1A3C34] tracking-wide">
                    Full name*
                  </label>
                  <input
                    id="gate-name"
                    type="text"
                    value={gateName}
                    onChange={(e) => setGateName(e.target.value)}
                    placeholder="Enter your name"
                    disabled={gateSubmitting}
                    className="w-full font-sans text-sm text-[#1A3C34] bg-white border border-[#D4C9B8] px-4 py-3.5 placeholder-[#1A3C34]/30 focus:border-[#1A3C34] focus:ring-1 focus:ring-[#1A3C34]/20 focus:outline-none transition-all duration-200 rounded-none"
                    required
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label htmlFor="gate-email" className="block text-[12px] font-sans font-semibold text-[#1A3C34] tracking-wide">
                    Email address*
                  </label>
                  <input
                    id="gate-email"
                    type="email"
                    value={gateEmail}
                    onChange={(e) => setGateEmail(e.target.value)}
                    placeholder="Enter email address"
                    disabled={gateSubmitting}
                    className="w-full font-sans text-sm text-[#1A3C34] bg-white border border-[#D4C9B8] px-4 py-3.5 placeholder-[#1A3C34]/30 focus:border-[#1A3C34] focus:ring-1 focus:ring-[#1A3C34]/20 focus:outline-none transition-all duration-200 rounded-none"
                    required
                  />
                </div>

                {gateError && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 bg-red-500/5 border border-red-500/20 text-red-600 flex items-center gap-2.5 text-xs text-left animate-none"
                  >
                    <AlertCircle size={15} className="shrink-0" />
                    <p className="font-sans font-medium">{gateError}</p>
                  </motion.div>
                )}

                <div className="pt-2 text-left">
                  <InteractiveButton
                    type="submit"
                    variant="gold"
                    disabled={gateSubmitting}
                    className="w-full justify-center px-8 py-3.5 capitalize tracking-[0.15em] text-xs font-semibold select-none flex items-center gap-2"
                  >
                    <span>{gateSubmitting ? "Generating Score Report..." : "Reveal My Score & Analysis"}</span>
                  </InteractiveButton>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* SURVEY CONTAINER */
          <div className="w-full min-h-screen flex flex-col items-center justify-start pt-6 md:pt-12 pb-16 px-4 md:px-6 relative bg-[#F7F4EF]/30">
            <div className="w-full max-w-[620px] mx-auto flex items-center justify-between mb-4">
              {/* Back changed to Previous Question */}
              <button
                onClick={clampedIdx === 0 ? () => setLocation("/") : handleBack}
                className="flex text-xs font-sans capitalize tracking-wider items-center gap-1.5 cursor-pointer text-[#1A3C34] hover:text-[#C9A55A] transition-colors py-1 focus:outline-none"
              >
                <ArrowLeft size={14} /> {clampedIdx === 0 ? "Cancel" : "Previous Question"}
              </button>

              <span className="font-sans text-[12px] text-[#1A3C34]/65 font-medium">
                Question {clampedIdx + 1} of {questions.length}
              </span>
            </div>

            {/* Progress Checkpoints */}
            <div className="w-full max-w-[620px] mx-auto flex items-center gap-[4px] mb-8 relative select-none">
              {questions.map((q, idx) => {
                const isCompleted = idx < clampedIdx;
                const isActive = idx === clampedIdx;

                return (
                  <div key={idx} className="flex-1 relative group py-2">
                    <button
                      onClick={() => {
                        if (isCompleted) {
                          handleJumpBack(idx);
                        }
                      }}
                      disabled={!isCompleted}
                      className={`w-full h-[6px] transition-all duration-300 relative focus:outline-none ${
                        isCompleted 
                          ? "bg-[#C9A55A] hover:bg-[#1A3C34] hover:scale-y-[1.4] cursor-pointer" 
                          : isActive 
                            ? "bg-[#1A3C34]" 
                            : "bg-[#1A3C34]/15"
                      }`}
                      style={{ borderRadius: "1px" }}
                    >
                      {isActive && (
                        <span className="absolute -top-[3px] left-1/2 -translate-x-1/2 block bg-[#1A3C34] h-3 w-3 rounded-full border border-white" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="max-w-[620px] w-full flex flex-col gap-4 sm:gap-5 relative">
              <div className="text-left">
                <span className="font-sans font-extrabold text-[10px] sm:text-[11px] text-[#1A3C34] capitalize tracking-widest block mb-1">
                  {currentQuestion.section}
                </span>
                <h3 className="font-serif text-[18px] sm:text-[20px] md:text-[23px] font-bold text-ink leading-snug">
                  {currentQuestion.question}
                </h3>
              </div>

              <div className="space-y-2.5 text-left">
                {currentQuestion.options.map((opt, i) => {
                  const isSelected = selectedOptionIndex === i;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOptionLocal(i)}
                      className="w-full text-left p-3.5 sm:p-4 border cursor-pointer transition-all duration-150 flex items-start gap-4 rounded-none relative overflow-hidden focus:outline-none"
                      style={{
                        borderColor: isSelected ? "#1A3C34" : "#D4C9B8",
                        backgroundColor: isSelected ? "rgba(26, 60, 52, 0.05)" : "white"
                      }}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 pointer-events-none z-30">
                          <svg className="w-full h-full absolute inset-0">
                            <motion.rect
                              x="0"
                              y="0"
                              width="100%"
                              height="100%"
                              fill="none"
                              stroke="#C9A55A"
                              strokeWidth="5"
                              strokeLinecap="round"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.4, ease: "linear" }}
                            />
                          </svg>
                        </div>
                      )}

                      <span className={`w-5 h-5 shrink-0 rounded-full border text-[11px] flex items-center justify-center font-serif bg-canvas/40 font-bold mt-0.5 relative z-10 ${
                        isSelected ? "border-[#1A3C34] text-[#1A3C34] bg-white" : "border-[#1A3C34]/40 text-[#1A3C34]/70"
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="font-sans text-[13px] sm:text-[14px] text-ink leading-relaxed relative z-10">
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="min-h-[44px] flex items-center justify-between gap-4 mt-2">
                <button
                  onClick={clampedIdx === 0 ? () => setLocation("/") : handleBack}
                  className="md:hidden text-xs font-sans capitalize tracking-wider flex items-center gap-1.5 cursor-pointer text-[#1A3C34] hover:text-[#C9A55A] transition-colors py-2 focus:outline-none"
                >
                  <ArrowLeft size={14} /> {clampedIdx === 0 ? "Cancel" : "Previous Question"}
                </button>

                <div className="ml-auto">
                  {clampedIdx === questions.length - 1 ? (
                    answers[clampedIdx] !== null ? (
                      <InteractiveButton 
                        onClick={handleSubmit}
                        variant="gold" 
                        className="w-full md:w-auto text-center py-2.5 px-8 capitalize tracking-wider text-xs font-semibold"
                        id="scorecard-submit-button"
                      >
                        Submit Diagnostic
                      </InteractiveButton>
                    ) : (
                      <p className="text-xs font-sans text-ink-muted/50 italic text-right select-none pr-1">
                        Select an option for the final question to submit
                      </p>
                    )
                  ) : (
                    <p className="text-xs font-sans text-ink-muted/50 italic text-right select-none pr-1">
                      Select an option above to proceed
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        /* RESULTS OVERALL CONTAINER (covers full margin width, matching homepage boundaries) */
        <div className="w-full bg-[#FAF9F6] py-16 text-left">
          <div className="w-full px-6 lg:px-[120px] space-y-16">
            
            {/* Header section & Capabilities Overview (Linear Side-by-Side) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-center border-b border-[#1A3C34]/10 pb-10">
              {/* Left Column: Level Header Block */}
              <div className="space-y-4">
                <span className="font-mono text-[11px] font-bold text-gold capitalize tracking-[0.25em] block leading-none">
                  {gateName}'s Forward Score™ Results
                </span>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                  <div className="space-y-1">
                    <h1 className="font-serif text-[42px] font-bold text-[#1A3C34] leading-tight tracking-tight">
                      {levelLabel}
                    </h1>
                  </div>
                  
                  <div className="flex items-baseline gap-1.5 shrink-0 bg-white border border-[#E8D5B5] px-6 py-4">
                    <span className="font-serif text-[56px] font-bold text-[#1A3C34] leading-none">
                      {totalScore}
                    </span>
                    <span className="font-serif text-lg text-gold">/ 48</span>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="font-sans text-[15px] md:text-[16px] text-ink leading-relaxed font-normal">
                    {levelLabel === "Observer" && (
                      <>You are aware AI is changing leadership, but it has not yet changed how you lead. Right now you are consuming information without a system to act on it. The opportunity is to stop studying AI from a distance and start becoming the leader who uses it with confidence.</>
                    )}
                    {levelLabel === "Practitioner" && (
                      <>You have started using AI, but your leadership has not fully evolved with it yet. Today, AI helps you work faster. The opportunity is to become the leader who uses it to think, decide, and lead differently — not just to save time.</>
                    )}
                    {levelLabel === "Forward Leader" && (
                      <>You have already evolved how you think and lead with AI. Most leaders are still catching up to where you are. The opportunity now is making sure the right people see it — and using your position to shape what comes next.</>
                    )}
                  </p>
                </div>
              </div>

              {/* Right Column: Capabilities Radar Map & Details below (Re-aligned to stack vertically & horizontally next to each other) */}
              <div className="bg-[#FAF9F5] border border-[#E8D5B5] p-6 sm:p-8 flex flex-col items-center justify-between gap-6">
                <div className="flex justify-center w-full shrink-0">
                  <svg viewBox="0 0 300 300" className="w-full max-w-[280px] h-auto select-none overflow-visible">
                    {/* Grid Checkpoints */}
                    <polygon points={gridLine12} fill="none" stroke="#1A3C34" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.15" />
                    <polygon points={gridLine9} fill="none" stroke="#1A3C34" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.15" />
                    <polygon points={gridLine6} fill="none" stroke="#1A3C34" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.15" />
                    <polygon points={gridLine3} fill="none" stroke="#1A3C34" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.15" />
                    
                    {/* User Filled Polygon */}
                    <polygon points={userPolygonPoints} fill="rgba(201, 165, 90, 0.25)" stroke="#C9A55A" strokeWidth="2" />
                    
                    <circle cx={pt1.x} cy={pt1.y} r="3" fill="#C9A55A" />
                    <circle cx={pt2.x} cy={pt2.y} r="3" fill="#C9A55A" />
                    <circle cx={pt3.x} cy={pt3.y} r="3" fill="#C9A55A" />
                    <circle cx={pt4.x} cy={pt4.y} r="3" fill="#C9A55A" />

                    {/* Labels written in P2 font style (font-serif italic text-gold) */}
                    <text x={center} y="30" textAnchor="middle" className="font-serif italic text-[12px] fill-[#C9A55A] uppercase tracking-wide">Self</text>
                    <text x="250" y="153" textAnchor="start" className="font-serif italic text-[12px] fill-[#C9A55A] uppercase tracking-wide">Others</text>
                    <text x={center} y="280" textAnchor="middle" className="font-serif italic text-[12px] fill-[#C9A55A] uppercase tracking-wide">Transform</text>
                    <text x="50" y="153" textAnchor="end" className="font-serif italic text-[12px] fill-[#C9A55A] uppercase tracking-wide">Sustain</text>
                  </svg>
                </div>

                <div className="w-full border-t border-[#E8D5B5]/60 pt-4 text-left">
                  {allIdentical ? (
                    <p className="font-sans text-[12px] text-ink-muted leading-relaxed text-center">
                      Your capabilities are balanced. The next step is raising all four together.
                    </p>
                  ) : (
                    <div className="flex flex-row items-center justify-center gap-8 md:gap-12 font-sans text-[12px] leading-relaxed w-full">
                      <div className="border-l border-emerald-500 pl-3">
                        <span className="font-mono text-[9px] font-bold text-emerald-700 uppercase tracking-wider block">Strongest</span>
                        <span className="font-serif text-[13px] font-bold text-ink block mt-0.5">{strongestName}</span>
                      </div>

                      <div className="border-l border-rose-500 pl-3">
                        <span className="font-mono text-[9px] font-bold text-rose-700 uppercase tracking-wider block">Opportunity</span>
                        <span className="font-serif text-[13px] font-bold text-ink block mt-0.5">{opportunityName}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Level Pull Quote block */}
            <div className="border-l-4 border-gold pl-6 py-2">
              <p className="font-serif text-[18px] md:text-[21px] italic text-[#1A3C34] font-medium leading-relaxed">
                {levelLabel === "Observer" && (
                  <>"Leadership isn't about having all the answers anymore. It's about creating the conditions where people and AI achieve more together."</>
                )}
                {levelLabel === "Practitioner" && (
                  <>"You are not stuck. You are stalled at the exact point where good leaders either build a system or burn out repeating the same win."</>
                )}
                {levelLabel === "Forward Leader" && (
                  <>"AI won't replace great leaders. But it will expose leaders who refuse to evolve."</>
                )}
              </p>
            </div>

            {/* What your results are telling you section (covers full margin width) */}
            <div className="space-y-6">
              <h2 className="font-serif text-[28px] font-bold text-[#1A3C34] text-left">
                Your Leadership Profile
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <CapabilityCard 
                  title="Lead Yourself" 
                  description={levelLabel === "Forward Leader" ? "AI is part of how you think and work. You have a system, not just habits." : "You reach for AI sometimes. You do not yet have a routine that makes it automatic."}
                  status={status1} 
                  score={score1} 
                />
                <CapabilityCard 
                  title="Lead Others" 
                  description={levelLabel === "Forward Leader" ? "Your team trusts your direction on AI. Most have adopted it with confidence." : levelLabel === "Practitioner" ? "Some of your team has adopted AI. The rest are waiting for permission you have not fully given yet." : "Your team is unsure where you stand on AI. They are waiting for direction you have not fully given yet."}
                  status={status2} 
                  score={score2} 
                />
                <CapabilityCard 
                  title="Lead Transformation" 
                  description={levelLabel === "Forward Leader" ? "You can build the case and get it funded. Your opportunity is clear and credible." : levelLabel === "Practitioner" ? "You can name a strong opportunity. You have not yet built the case that gets it funded." : "You have not yet built a case for AI that gets attention or gets funded."}
                  status={status3} 
                  score={score3} 
                />
                <CapabilityCard 
                  title="Lead Sustainably" 
                  description={levelLabel === "Forward Leader" ? "Your team could carry this forward without you. That is rare, and it is real leverage." : levelLabel === "Practitioner" ? "Your team could likely continue without you for a while. Push until it could continue indefinitely." : "Right now, progress depends entirely on you. It would stall if you stepped away."}
                  status={status4} 
                  score={score4} 
                />
              </div>
            </div>

            {/* Rebuilt Forward Leaders Lab section */}
            <div className="bg-[#1C332D] text-white p-8 sm:p-12 relative overflow-hidden rounded-none border border-teal/10">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(250,250,248,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(250,250,248,0.035)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
                {/* Left side: Pan's photo on desktop, stacked top on mobile */}
                <div className="w-full flex justify-center items-center">
                  <div className="relative w-full max-w-sm aspect-[3/4] overflow-hidden border border-white/10">
                    <div className="absolute inset-0 bg-[#1C332D]/20 mix-blend-overlay z-10 pointer-events-none" />
                    <img 
                      src={panPhoto} 
                      alt="Pan Seth" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Right side: Text content */}
                <div className="space-y-6 text-left">
                  <h3 className="font-serif text-[28px] md:text-3xl font-bold text-[#FAFAF8] leading-tight">
                    Introducing the Forward Leaders Lab
                  </h3>
                  <p className="font-sans text-sm text-[#FAFAF8]/85 leading-relaxed text-balance">
                    The Forward Leader Lab is a leadership transformation experience for the Age of AI. It equips ambitious leaders with the mindset, capabilities, and strategic frameworks to thrive in a world where intelligence is abundant and change is constant. Rather than simply teaching AI tools, the Lab helps leaders evolve how they think, decide, communicate, and lead — so they can harness AI to increase their impact, empower their teams, and build organizations that are resilient, innovative, and AI-forward.
                  </p>

                  <ul className="space-y-3 font-sans text-sm text-[#FAFAF8] pt-2">
                    {levelLabel === "Forward Leader" ? (
                      <>
                        <li className="flex items-start gap-2.5">
                          <span className="text-gold mt-0.5 shrink-0">→</span>
                          <span>Sharpen your judgment further with AI as a thought partner</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-gold mt-0.5 shrink-0">→</span>
                          <span>Turn your results into visibility at the highest level</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-gold mt-0.5 shrink-0">→</span>
                          <span>Shape how your organization leads through the age of AI</span>
                        </li>
                      </>
                    ) : levelLabel === "Practitioner" ? (
                      <>
                        <li className="flex items-start gap-2.5">
                          <span className="text-gold mt-0.5 shrink-0">→</span>
                          <span>Turn your AI wins into a repeatable system, not one-off moments</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-gold mt-0.5 shrink-0">→</span>
                          <span>Lead your team through change with clarity and trust</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-gold mt-0.5 shrink-0">→</span>
                          <span>Build the case that earns you a bigger seat at the table</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-start gap-2.5">
                          <span className="text-gold mt-0.5 shrink-0">→</span>
                          <span>Use AI as a thought partner, not just a tool</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-gold mt-0.5 shrink-0">→</span>
                          <span>Lead your team through uncertainty with confidence</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-gold mt-0.5 shrink-0">→</span>
                          <span>Build a leadership system that does not depend only on you</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* What forward organizations look like section */}
            <div className="space-y-6">
              <h2 className="font-serif text-[28px] font-bold text-[#1A3C34] text-left">
                What Makes an AI-Forward Leader Different
              </h2>
              <p className="font-sans text-sm text-ink-muted text-left">
                AI-forward leaders do not simply adopt new tools. They evolve how they think, decide, and lead — so people and AI create more together.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="bg-white border border-[#E8D5B5] p-6 rounded-none flex flex-col justify-between gap-4 relative group">
                  <AnimatedBorder isHovered={true} color="rgba(26,60,52,0.15)" borderRadius={0} />
                  <div className="space-y-2">
                    <span className="font-serif text-lg font-bold text-gold">01</span>
                    <h4 className="font-sans font-bold text-[14px] text-ink uppercase tracking-wider">They Think Differently</h4>
                    <p className="font-sans text-[13px] text-ink-muted leading-relaxed">
                      They use AI to ask better questions and make sharper decisions, not just find faster answers.
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-[#E8D5B5] p-6 rounded-none flex flex-col justify-between gap-4 relative group">
                  <AnimatedBorder isHovered={true} color="rgba(26,60,52,0.15)" borderRadius={0} />
                  <div className="space-y-2">
                    <span className="font-serif text-lg font-bold text-gold">02</span>
                    <h4 className="font-sans font-bold text-[14px] text-ink uppercase tracking-wider">They Lead Differently</h4>
                    <p className="font-sans text-[13px] text-ink-muted leading-relaxed">
                      They create clarity in uncertainty and build trust instead of having every answer themselves.
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-[#E8D5B5] p-6 rounded-none flex flex-col justify-between gap-4 relative group">
                  <AnimatedBorder isHovered={true} color="rgba(26,60,52,0.15)" borderRadius={0} />
                  <div className="space-y-2">
                    <span className="font-serif text-lg font-bold text-gold">03</span>
                    <h4 className="font-sans font-bold text-[14px] text-ink uppercase tracking-wider">They Create Value Differently</h4>
                    <p className="font-sans text-[13px] text-ink-muted leading-relaxed">
                      They redesign how work gets done, not just automate the old way of doing it.
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-[#E8D5B5] p-6 rounded-none flex flex-col justify-between gap-4 relative group">
                  <AnimatedBorder isHovered={true} color="rgba(26,60,52,0.15)" borderRadius={0} />
                  <div className="space-y-2">
                    <span className="font-serif text-lg font-bold text-gold">04</span>
                    <h4 className="font-sans font-bold text-[14px] text-ink uppercase tracking-wider">They Build Organizations Differently</h4>
                    <p className="font-sans text-[13px] text-ink-muted leading-relaxed">
                      They make learning and experimentation part of everyday work, not a one-time initiative.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA block */}
            <div className="border-t border-[#C9A55A]/20 pt-10">
              <div className="bg-[#1A3C34] text-white p-8 sm:p-12 rounded-none shadow-xl relative overflow-hidden text-left space-y-6">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(250,250,248,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(250,250,248,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
                
                <div className="space-y-2">
                  <span className="font-mono text-[10px] font-bold text-gold uppercase tracking-[0.2em] block">
                    YOUR NEXT STEP
                  </span>
                  
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-white leading-tight">
                    Become the Leader the Future Requires.
                  </h3>
                  
                  <p className="font-sans text-sm text-white/85 leading-relaxed max-w-xl">
                    The Forward Leaders Lab is opening soon. Join the waitlist to be first in line.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <InteractiveButton
                    onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLSdRjzTLeCRBWhdKpHSyTw4__QwTG1SJVWyIML5CVAl7yf9nVg/viewform?usp=preview", "_blank")}
                    variant="gold"
                    className="px-8 py-3.5 capitalize tracking-wider text-xs font-bold text-center flex items-center justify-center gap-2"
                  >
                    Join the Waitlist <span>→</span>
                  </InteractiveButton>
                  
                  <button 
                    onClick={() => setLocation("/book-a-call")}
                    className="font-sans text-xs font-bold text-white hover:text-gold border-b border-white/20 hover:border-gold py-1 transition-all text-center"
                  >
                    Ready to move faster? Book a call.
                  </button>
                </div>

              </div>
            </div>

            {/* Reset anchor */}
            <div className="pt-6 flex justify-center">
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 font-mono text-[10px] font-bold text-[#1A3C34]/60 hover:text-gold uppercase tracking-widest cursor-pointer select-none py-2"
              >
                <RotateCcw size={12} />
                Reset Diagnostic Survey
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
