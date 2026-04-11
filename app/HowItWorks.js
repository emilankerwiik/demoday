"use client";

import { useEffect, useRef, useState } from "react";

const DEMOS = [
  {
    id: "demoday",
    name: "Demoday",
    stepSrc: "/demos/demoday.html?step=1",
    color: "#0a0a0a",
    icon: (
      <svg width="18" height="18" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="32" height="32" rx="6" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1"/>
        <circle cx="16" cy="16" r="8" fill="#0a0a0a"/>
      </svg>
    ),
    steps: [
      {
        n: "01",
        title: "See your demos perform",
        desc: "Track impressions, clicks, and engagement across every demo you ship.",
      },
      {
        n: "02",
        title: "Generate in one click",
        desc: "Claude reads your codebase, builds a self-contained HTML file, and embeds the iframe.",
      },
      {
        n: "03",
        title: "Paste into Claude Code",
        desc: "One command installs the skill. Your coding agent handles the rest.",
      },
    ],
  },
  {
    id: "mintlify",
    name: "Mintlify",
    stepSrc: "/demos/mintlify-step.html?step=1",
    color: "#0D9373",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          fill="#0D9373"
          d="M15.158.002a8.807 8.807 0 0 0-6.249 2.59l-.062.063h-.003L2.655 8.844a.605.605 0 0 0-.062.058 8.838 8.838 0 0 0-.83 11.55l6.251-6.249.065-.063a8.778 8.778 0 0 1-1.758-5.385 8.784 8.784 0 0 1 .283-2.151 8.993 8.993 0 0 1 2.151-.286 8.802 8.802 0 0 1 5.386 1.76 8.81 8.81 0 0 1 3.032 4.11 8.879 8.879 0 0 1 .225 5.21 8.784 8.784 0 0 0-.341.082 8.846 8.846 0 0 1-4.868-.303 8.679 8.679 0 0 1-2.323-1.25l-.064.065L3.55 22.24a8.85 8.85 0 0 0 11.548-.83l.06-.062 6.19-6.187a8.801 8.801 0 0 1-.367.337c.125-.11.247-.224.366-.341l.063-.058A8.817 8.817 0 0 0 24 8.844V.002Z"
        />
      </svg>
    ),
    steps: [
      {
        n: "01",
        title: "Create great docs",
        desc: "Write MDX pages with a clean, opinionated reading experience out of the box.",
      },
      {
        n: "02",
        title: "Add components",
        desc: "Drop in callouts, cards, tabs, and code groups to make every page feel alive.",
      },
      {
        n: "03",
        title: "Generate API endpoints",
        desc: "Point at an OpenAPI spec and get a fully interactive API reference.",
      },
    ],
  },
  {
    id: "supabase",
    name: "Supabase",
    stepSrc: "/demos/supabase-step.html?step=1",
    color: "#3ECF8E",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          fill="#3ECF8E"
          d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C-.33 13.427.65 15.455 2.409 15.455h9.579l.113 7.51c.014.985 1.259 1.408 1.873.636l9.262-11.653c1.093-1.375.113-3.403-1.645-3.403h-9.642z"
        />
      </svg>
    ),
    steps: [
      {
        n: "01",
        title: "Create tables",
        desc: "Design your schema visually and spin up a Postgres database in seconds.",
      },
      {
        n: "02",
        title: "Run SQL",
        desc: "Query and mutate your data from a familiar editor, right alongside your schema.",
      },
      {
        n: "03",
        title: "Authenticate users",
        desc: "Turn on email, OAuth, or magic links and ship signed-in experiences fast.",
      },
    ],
  },
  {
    id: "stripe",
    name: "Stripe",
    stepSrc: "/demos/stripe-step.html?step=1",
    color: "#635BFF",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="24" height="24" rx="5" fill="#635BFF" />
        <path
          transform="translate(1.5 1.5) scale(0.875)"
          fill="#fff"
          d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"
        />
      </svg>
    ),
    steps: [
      {
        n: "01",
        title: "Get an overview",
        desc: "See revenue, payouts, and customer activity at a glance from one dashboard.",
      },
      {
        n: "02",
        title: "Accept payments",
        desc: "Take cards, wallets, and bank transfers with a single integration.",
      },
      {
        n: "03",
        title: "Manage customers",
        desc: "Look up any customer, inspect their payments, and handle refunds or disputes.",
      },
    ],
  },
  {
    id: "gmail",
    name: "Gmail",
    stepSrc: "/demos/gmail-step.html?step=1",
    color: "#EA4335",
    icon: (
      <svg width="18" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          fill="#EA4335"
          d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
        />
      </svg>
    ),
    steps: [
      {
        n: "01",
        title: "Manage your inbox",
        desc: "Triage mail with labels, filters, and a clean threaded view.",
      },
      {
        n: "02",
        title: "Compose mail",
        desc: "Write, format, and attach files in a distraction-free composer.",
      },
      {
        n: "03",
        title: "Send mail",
        desc: "Deliver messages instantly, schedule them, or undo on second thought.",
      },
    ],
  },
  {
    id: "claude",
    name: "Claude",
    stepSrc: "/demos/claude-code-step.html?step=1",
    color: "#D97757",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          fill="#D97757"
          d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"
        />
      </svg>
    ),
    steps: [
      {
        n: "01",
        title: "Assign a task",
        desc: "Describe what you want built in plain English, right inside your terminal.",
      },
      {
        n: "02",
        title: "Generate code",
        desc: "Claude reads your repo, proposes edits, and writes the code for you.",
      },
      {
        n: "03",
        title: "Get the product",
        desc: "Review the diff, run it, and ship the change — all without leaving the CLI.",
      },
    ],
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

  const demo = DEMOS[activeDemo];
  const steps = demo.steps;
  const prev = () => selectStep((activeStep - 1 + steps.length) % steps.length);
  const next = () => selectStep((activeStep + 1) % steps.length);

  useEffect(() => {
    const onLoad = () => sendStep(activeStep);
    const iframe = iframeRef.current;
    if (iframe) iframe.addEventListener("load", onLoad);
    return () => {
      if (iframe) iframe.removeEventListener("load", onLoad);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep]);

  const step = steps[activeStep];

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
            {steps.map((s, i) => (
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
