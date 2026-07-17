import React from "react";
import { Hero } from "../components/Hero";
import { StatsBar } from "../components/StatsBar";
import { CredibilityBar } from "../components/CredibilityBar";
import { TheProblem } from "../components/TheProblem";
import { WhoWeHelp } from "../components/WhoWeHelp";
import { HowItWorks } from "../components/HowItWorks";
import { AIAlignmentIndex } from "../components/AIAlignmentIndex";
import { FreeResource } from "../components/FreeResource";
import { VisionStatement } from "../components/VisionStatement";
import { FounderConnect } from "../components/FounderConnect";
import { FAQ } from "../components/FAQ";
import { ContactSection } from "../components/ContactSection";
import { ThoughtLeadership } from "../components/ThoughtLeadership";

export default function Home() {
  return (
    <>
      <div id="hero"><Hero /></div>
      <StatsBar />
      <CredibilityBar />
      <div id="context"><TheProblem /></div>
      <div id="who-we-help"><WhoWeHelp /></div>
      <div id="how-it-works"><HowItWorks /></div>
      <div id="ai-index"><AIAlignmentIndex /></div>
      <div id="free-resource"><FreeResource /></div>
      <VisionStatement />
      <div id="connect-with-pan"><FounderConnect /></div>
      <div id="newsletter"><ThoughtLeadership /></div>
      <div id="faq"><FAQ /></div>
      <div id="contact"><ContactSection /></div>
    </>
  );
}
