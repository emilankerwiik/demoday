"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    n: "01",
    title: "Paste one line into Claude Code",
    desc: "It installs the skill and writes a config you never need to touch.",
  },
  {
    n: "02",
    title: "Confirm in chat",
    desc: "Claude asks once about telemetry and offers to generate your first demo — a single click.",
  },
  {
    n: "03",
    title: "Ship the iframe",
    desc: "One tag lands on your landing page. It works on Next.js, Webflow, WordPress, anywhere HTML renders.",
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const iframeRef = useRef(null);

  const select = (i) => {
    setActive(i);
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        { type: "setStep", step: i + 1 },
        "*"
      );
    }
  };

  const prev = () => select((active - 1 + STEPS.length) % STEPS.length);
  const next = () => select((active + 1) % STEPS.length);

  useEffect(() => {
    const onLoad = () => {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          { type: "setStep", step: active + 1 },
          "*"
        );
      }
    };
    const iframe = iframeRef.current;
    if (iframe) iframe.addEventListener("load", onLoad);
    return () => {
      if (iframe) iframe.removeEventListener("load", onLoad);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const step = STEPS[active];

  return (
    <div className="how-card">
      <div className="how-media">
        <iframe
          ref={iframeRef}
          src="/demos/gmail-step.html?step=1"
          title="Demoday walkthrough"
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
              aria-selected={i === active}
              aria-label={`Step ${s.n}`}
              className={"how-dot" + (i === active ? " active" : "")}
              onClick={() => select(i)}
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
  );
}
