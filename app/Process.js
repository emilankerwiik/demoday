import Reveal from "./Reveal";

const STEPS = [
  {
    n: "01",
    title: "Paste into Claude Code",
    desc: "Drop one command into your coding agent. It installs the skill and reads your codebase.",
    frame: (
      <div className="proc-frame proc-terminal" aria-hidden="true">
        <div className="proc-term-bar">
          <span className="proc-term-dot" style={{ background: "#ff5f57" }} />
          <span className="proc-term-dot" style={{ background: "#febc2e" }} />
          <span className="proc-term-dot" style={{ background: "#28c840" }} />
          <span className="proc-term-title">claude-code</span>
        </div>
        <div className="proc-term-body">
          <div className="proc-term-line">
            <span className="proc-term-prompt">$</span>
            <span className="proc-term-cmd">npx @demoday/skill@latest init</span>
          </div>
          <div className="proc-term-line proc-term-dim">Installing @demoday/skill…</div>
          <div className="proc-term-line proc-term-ok">
            <span className="proc-term-check">✓</span> Skill installed
          </div>
          <div className="proc-term-line proc-term-dim">Reading your repo…</div>
          <div className="proc-term-line">
            <span className="proc-term-prompt">▌</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    n: "02",
    title: "Confirm in chat",
    desc: "Claude proposes a demo tailored to your product. One click and it starts building.",
    frame: (
      <div className="proc-frame proc-chat" aria-hidden="true">
        <div className="proc-chat-bar">
          <span className="proc-chat-spark">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                stroke="#D97757"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="proc-chat-title">Claude</span>
        </div>
        <div className="proc-chat-body">
          <div className="proc-chat-bubble proc-chat-ai">
            I can build a clickable demo of your product for the landing page. Want me to generate one now?
          </div>
          <div className="proc-chat-actions">
            <button className="proc-btn proc-btn-primary" type="button" tabIndex={-1}>
              Yes, create it
            </button>
            <button className="proc-btn proc-btn-ghost" type="button" tabIndex={-1}>
              Not now
            </button>
          </div>
        </div>
      </div>
    ),
  },
  {
    n: "03",
    title: "Ship the demo",
    desc: "You get one self-contained HTML file and a single iframe. Drop it on any landing page.",
    frame: (
      <div className="proc-frame proc-browser" aria-hidden="true">
        <div className="proc-browser-bar">
          <span className="proc-term-dot" style={{ background: "#ff5f57" }} />
          <span className="proc-term-dot" style={{ background: "#febc2e" }} />
          <span className="proc-term-dot" style={{ background: "#28c840" }} />
          <span className="proc-browser-url">yoursite.com</span>
        </div>
        <div className="proc-browser-body">
          <div className="proc-site-h1">Beautiful clickable demos.</div>
          <div className="proc-site-lede" />
          <div className="proc-site-lede proc-site-lede-short" />
          <div className="proc-embed">
            <div className="proc-embed-tag">&lt;iframe /&gt;</div>
            <div className="proc-embed-screen">
              <div className="proc-embed-dot" />
              <div className="proc-embed-dot" />
              <div className="proc-embed-dot" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

export default function Process() {
  return (
    <section id="how" className="proc-section">
      <div className="wrap">
        <Reveal className="section-head" staggerChildren>
          <span className="section-eyebrow">
            <span className="dot" />
            How it works
          </span>
          <h2>
            Create first demo in <em>2 minutes.</em>
          </h2>
        </Reveal>
        <div className="proc-grid">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} className="proc-card" delayMs={i * 80}>
              {s.frame}
              <div className="proc-body">
                <div className="proc-num">{s.n}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
