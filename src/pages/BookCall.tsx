import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

export default function BookCallPage() {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [expandedDebriefIndex, setExpandedDebriefIndex] = useState<number | null>(0);

  const debriefAccordionItems = [
    {
      num: "01",
      title: "Walk Through Your 3 Highest Priority Gaps",
      description: "We will analyze the friction points in your current AI workflows, security, or data readiness, identifying key areas where alignment gaps limit organizational growth."
    },
    {
      num: "02",
      title: "Show You Exactly How Organizations Close Those Gaps",
      description: "Explore structured, battle-tested solutions to address leadership, capability, and adoption hurdles systematically without disrupting ongoing operations."
    },
    {
      num: "03",
      title: "Map Out What a Clear Path Forward Looks Like",
      description: "Outline a clear sequence of milestones tailored to your organization's context, helping teams align and execute strategy effectively."
    }
  ];

  useEffect(() => {
    // Inject the Lunacal embed script directly on mount
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "lunacal-inline-direct-script";
    script.innerHTML = `(function(L,U,N){let p=(a,ar)=>a.q.push(ar),d=L.document;L.Lunacal=L.Lunacal||function(){let lun=L.Lunacal,ar=arguments;if(!lun.loaded){lun.ns={};lun.q=lun.q||[];d.head.appendChild(d.createElement("script")).src=U;lun.loaded=!0}if(ar[0]===N){const api=function(){p(api,arguments)};const ns=ar[1];api.q=api.q||[];if(typeof ns==="string"){lun.ns[ns]=lun.ns[ns]||api;p(lun.ns[ns],ar);p(lun,["initNamespace",ns])}else p(lun,ar);return}p(lun,ar)};if(!L.Cal)L.Cal=L.Lunacal})(window,"https://app.lunacal.ai/embed/embed.js","init");Lunacal("init","focused-ai-strategy-pan",{origin:"https://app.lunacal.ai"});
                  // Enable auto-forwarding of query parameters
                  Lunacal.config = Lunacal.config || {};
                  Lunacal.config.forwardQueryParams = true;
                  
        Lunacal.ns["focused-ai-strategy-pan"]("inline", {
          elementOrSelector:"#my-lunacal-inline-focused-ai-strategy-pan",
          config: {"layout":""},
          calLink: "pan-seth/focused-ai-strategy-pan",
        });
        Lunacal.ns["focused-ai-strategy-pan"]("preload", { calLink: "pan-seth/focused-ai-strategy-pan", type: "inline", options: { prerenderIframe: true } });
        Lunacal.ns["focused-ai-strategy-pan"]("ui", {"theme":"light","styles":{"branding":{}},"hideEventTypeDetails":false,"layout":"","cssVarsPerTheme":{"light":{"theme-border":"#E4E4E7","theme-background-primary":"#C9A55A","theme-background-secondary":"#F4F4F5","theme-background-card":"#ffffff","theme-background-base":"#ffffff","theme-text-primary":"#111827","theme-text-secondary":"#4B5563","theme-text-card":"#111827","theme-text-base":"#111827","theme-rounded-base":"0px","theme-rounded-calendar":"0px","theme-rounded-timeslot":"4px","theme-rounded-day":"4px","theme-rounded-button":"0px","theme-shadow-calendar":"none","theme-shadow-button":"none","theme-shadow-timeslot":"none","theme-font-family":"Figtree"},"dark":{"theme-border":"#E4E4E7","theme-background-primary":"#C9A55A","theme-background-secondary":"#F4F4F5","theme-background-card":"#ffffff","theme-background-base":"#ffffff","theme-text-primary":"#111827","theme-text-secondary":"#4B5563","theme-text-card":"#111827","theme-text-base":"#111827","theme-rounded-base":"0px","theme-rounded-calendar":"0px","theme-rounded-timeslot":"4px","theme-rounded-day":"4px","theme-rounded-button":"0px","theme-shadow-calendar":"none","theme-shadow-button":"none","theme-shadow-timeslot":"none","theme-font-family":"Figtree"}},"displayedContent":{"image":true,"name":true,"designation":true,"description":true,"eventName":true,"highlightBar":false},"background":{"type":"plain"},"stylePreset":""});`;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById("lunacal-inline-direct-script");
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const trustSignals = [
    "30 minutes. No pitch.",
    "Pan confirms every booking personally within 24 hours.",
    "Explore how to align AI strategy, leadership, and governance across teams."
  ];

  return (
    <div className="bg-canvas min-h-screen py-12 md:py-20 px-6 md:px-12 text-ink selection:bg-gold selection:text-ink">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Context copy */}
          <div className="lg:sticky lg:top-28 space-y-6 text-left">
            <span className="font-sans font-semibold text-xs text-[#C9A55A] capitalize tracking-[0.25em] block leading-none">
              STRATEGY CONVERSATION
            </span>
            <h1 className="font-serif text-[36px] md:text-[44px] font-bold text-[#1A3C34] leading-[1.1] tracking-tight">
              Connect to understand how we support your growth.
            </h1>
            <p className="font-sans text-[15px] text-[#1A322C]/75 leading-relaxed font-light">
              This call is a dedicated space to connect with the Forward Org team. We will review your organization's current trajectory, explore growth opportunities in the age of AI, and discuss how building critical leadership capabilities can support long-term success.
            </p>

            {/* AI Readiness Debrief Accordion Block */}
            <div className="mt-8 pt-8 border-t border-[#1A3C34]/10 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold text-[#1A3C34]">Strategy Session</h2>
                <span className="bg-[#C9A55A]/10 text-[#C9A55A] font-mono text-[11px] font-bold px-2.5 py-1 capitalize tracking-wider select-none">
                  30 Min
                </span>
              </div>
              
              <div className="space-y-2">
                <p className="font-sans text-[15px] text-[#1A322C]/75 leading-relaxed font-light">
                  Align AI strategy, leadership capability, governance, and culture across your teams.
                </p>
                <p className="font-sans text-xs font-semibold text-[#1A3C34] tracking-[0.1em] capitalize pt-1">
                  During this call we will:
                </p>
              </div>

              {/* Accordion List with the website's exact styling */}
              <div className="border-t border-[#1A3C34]/15 divide-y divide-[#1A3C34]/15 mt-4">
                {debriefAccordionItems.map((item, idx) => {
                  const isExpanded = expandedDebriefIndex === idx;

                  return (
                    <div
                      key={idx}
                      onClick={() => setExpandedDebriefIndex(isExpanded ? null : idx)}
                      className={`py-4 cursor-pointer group transition-all duration-200 text-left ${
                        isExpanded ? "px-2 bg-[#1A3C34]/[0.02]" : "hover:bg-[#1A3C34]/[0.01]"
                      }`}
                    >
                      {/* Row Header */}
                      <div className="flex justify-between items-start gap-4 w-full">
                        <div className="flex gap-2 items-start text-left">
                          <span className="font-sans text-xs text-[#C9A55A] font-semibold mt-1 select-none">
                            &rarr;
                          </span>
                          <h4 className={`font-serif text-[15px] sm:text-base font-bold transition-colors duration-200 leading-snug ${
                            isExpanded ? "text-[#1A3C34]" : "text-ink group-hover:text-[#1A3C34]"
                          }`}>
                            {item.title}
                          </h4>
                        </div>
                        <span className="font-sans text-[12px] text-ink-muted/65 font-medium select-none shrink-0 pt-0.5">
                          {item.num}
                        </span>
                      </div>

                      {/* Animated Drawer Body */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="font-sans text-sm text-ink-muted leading-[1.6] pt-2.5 pb-1 pl-6 pr-4 max-w-xl">
                              {item.description}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Conclusion Text */}
              <div className="pt-3 border-t border-[#1A3C34]/5">
                <p className="font-sans text-sm text-[#1A322C]/80 italic leading-relaxed font-light">
                  "Map out what a clear path forward looks like for your specific industry and team."
                </p>
              </div>
            </div>

            {/* Short gold horizontal rule */}
            <div className="w-16 h-[2px] bg-[#C9A55A] my-6" />

            {/* Trust signals */}
            <div className="space-y-4 pt-4">
              {trustSignals.map((signal, idx) => (
                <div key={idx} className="flex gap-3 items-start text-left">
                  <Check size={16} className="text-[#C9A55A] shrink-0 mt-0.5" strokeWidth={2} />
                  <span className="font-sans text-sm text-[#1A322C]/75 leading-snug">{signal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Inline Lunacal Embed */}
          <div ref={calendarRef} className="w-full">
            <div className="relative bg-white p-4 sm:p-6 rounded-none shadow-sm border border-[#D4C9B8] overflow-visible">
              <div 
                id="my-lunacal-inline-focused-ai-strategy-pan" 
                style={{ width: "100%", height: "850px", overflow: "visible" }} 
                className="relative z-10"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
