"use client";

import { useEffect, useRef, useState } from "react";

const DEMOS = [
  {
    id: "mintlify",
    name: "Mintlify",
    stepSrc: "/demos/mintlify-step.html?step=1",
    color: "#3dd68c",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#0d9373" />
        <path
          d="M12 5L6 10v8h12v-8l-6-5z"
          stroke="#fff"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    ),
  },
  {
    id: "supabase",
    name: "Supabase",
    stepSrc: "/demos/supabase-step.html?step=1",
    color: "#3ecf8e",
    icon: (
      <svg width="14" height="16" viewBox="0 0 109 113" fill="none">
        <path
          d="M63.7 110.3C60.8 113.9 55 111.9 55 107.3L54 40h45.2c8.2 0 12.8 9.5 7.7 15.9L63.7 110.3Z"
          fill="#3ECF8E"
        />
        <path
          d="M45.3 2.1C48.2-1.5 54 .4 54 5l.5 67.3H9.8c-8.2 0-12.8-9.5-7.6-15.9L45.3 2.1Z"
          fill="#3ECF8E"
        />
      </svg>
    ),
  },
  {
    id: "stripe",
    name: "Stripe",
    stepSrc: "/demos/stripe-step.html?step=1",
    color: "#635bff",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#635BFF" />
        <path
          d="M11.2 9.6c0-.66.54-1.02 1.44-1.02.96 0 2.16.3 3.12.84V6.84A8.38 8.38 0 0012.64 6c-2.58 0-4.32 1.38-4.32 3.66 0 3.54 4.92 3 4.92 4.5 0 .78-.66 1.02-1.62 1.02-1.38 0-3.18-.6-4.56-1.38v2.64a9.2 9.2 0 004.56 1.2c2.64 0 4.44-1.32 4.44-3.66.06-3.84-4.86-3.18-4.86-4.62z"
          fill="#fff"
        />
      </svg>
    ),
  },
  {
    id: "gmail",
    name: "Gmail",
    stepSrc: "/demos/gmail-step.html?step=1",
    color: "#ea4335",
    icon: (
      <svg width="16" height="12" viewBox="0 0 75 56" fill="none">
        <path d="M6.5 0L37.5 24L68.5 0H6.5Z" fill="#EA4335" />
        <path d="M0 8L37.5 32L0 56V8Z" fill="#4285F4" />
        <path d="M75 8L37.5 32L75 56V8Z" fill="#34A853" />
        <path
          d="M0 8L37.5 32L75 8V0H68.5L37.5 24L6.5 0H0V8Z"
          fill="#FBBC04"
        />
      </svg>
    ),
  },
  {
    id: "claude",
    name: "Claude",
    stepSrc: "/demos/claude-code-step.html?step=1",
    color: "#d97757",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" fill="#d97757" />
        <line x1="12" y1="3" x2="12" y2="6" stroke="#d97757" strokeWidth="2" />
        <line
          x1="12"
          y1="18"
          x2="12"
          y2="21"
          stroke="#d97757"
          strokeWidth="2"
        />
        <line
          x1="5.6"
          y1="5.6"
          x2="7.8"
          y2="7.8"
          stroke="#d97757"
          strokeWidth="2"
        />
        <line
          x1="16.2"
          y1="16.2"
          x2="18.4"
          y2="18.4"
          stroke="#d97757"
          strokeWidth="2"
        />
        <line x1="3" y1="12" x2="6" y2="12" stroke="#d97757" strokeWidth="2" />
        <line
          x1="18"
          y1="12"
          x2="21"
          y2="12"
          stroke="#d97757"
          strokeWidth="2"
        />
      </svg>
    ),
  },
];

const STEPS = [
  {
    n: "01",
    title: "Paste into Claude Code",
    desc: "Your coding agent installs the skill and understands your product.",
  },
  {
    n: "02",
    title: "Confirm in chat",
    desc: "Claude offers to generate your first demo. A single click.",
  },
  {
    n: "03",
    title: "Ship your demo",
    desc: "An iframe is created for your landing page. Works anywhere.",
  },
];

export default function HowItWorks() {
  const [activeDemo, setActiveDemo] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const iframeRef = useRef(null);

  const sendStep = (stepIndex) => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        { type: "setStep", step: stepIndex + 1 },
        "*"
      );
    }
  };

  const selectStep = (i) => {
    setActiveStep(i);
    sendStep(i);
  };

  const selectDemo = (i) => {
    setActiveDemo(i);
    setActiveStep(0);
  };

  const prev = () => selectStep((activeStep - 1 + STEPS.length) % STEPS.length);
  const next = () => selectStep((activeStep + 1) % STEPS.length);

  useEffect(() => {
    const onLoad = () => sendStep(activeStep);
    const iframe = iframeRef.current;
    if (iframe) iframe.addEventListener("load", onLoad);
    return () => {
      if (iframe) iframe.removeEventListener("load", onLoad);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep]);

  const demo = DEMOS[activeDemo];
  const step = STEPS[activeStep];

  return (
    <>
      <div
        className="how-brands"
        role="tablist"
        aria-label="Demo tool selector"
      >
        {DEMOS.map((d, i) => (
          <button
            key={d.id}
            type="button"
            role="tab"
            aria-selected={i === activeDemo}
            className={
              "how-brand" + (i === activeDemo ? " how-brand-active" : "")
            }
            style={
              i === activeDemo
                ? { "--brand-color": d.color, borderColor: d.color }
                : {}
            }
            onClick={() => selectDemo(i)}
          >
            <span className="how-brand-icon">{d.icon}</span>
            <span className="how-brand-name">{d.name}</span>
          </button>
        ))}
      </div>

      <div className="how-card">
        <div className="how-media">
          <iframe
            ref={iframeRef}
            src={demo.stepSrc}
            title={`${demo.name} walkthrough`}
            loading="lazy"
          />
        </div>

        <div className="how-explain">
          <button
            type="button"
            className="how-nav how-nav-prev"
            aria-label="Previous step"
            onClick={prev}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            type="button"
            className="how-nav how-nav-next"
            aria-label="Next step"
            onClick={next}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div
            className="how-dots"
            role="tablist"
            aria-label="Walkthrough steps"
          >
            {STEPS.map((s, i) => (
              <button
                key={s.n}
                type="button"
                role="tab"
                aria-selected={i === activeStep}
                aria-label={`Step ${s.n}`}
                className={
                  "how-dot" + (i === activeStep ? " active" : "")
                }
                onClick={() => selectStep(i)}
              />
            ))}
          </div>

          <div className="how-body">
            <div className="num">{step.n}</div>
            <h4>{step.title}</h4>
            <p>{step.desc}</p>
          </div>
        </div>
      </div>
    </>
  );
}
