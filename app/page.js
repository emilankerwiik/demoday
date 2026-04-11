import CopyButton from "./CopyButton";
import HowItWorks from "./HowItWorks";
import Problem from "./Problem";
import Process from "./Process";
import Reveal from "./Reveal";

export default function Home() {
  return (
    <>
      <header className="header">
        <div className="wrap-wide header-inner">
          <a className="brand" href="#" aria-label="Demoday home">
            <span className="brand-mark" aria-hidden="true">
              <svg
                width="22"
                height="22"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="32" height="32" fill="#ffffff" />
                <circle cx="16" cy="16" r="12" fill="#0a0a0a" />
              </svg>
            </span>
            <span className="brand-name">Demoday</span>
          </a>
          <a className="btn btn-primary btn-sm" href="#demo">
            See demos
          </a>
        </div>
      </header>

      <main>
      {/* Hero */}
      <Reveal as="section" className="hero wrap" staggerChildren>
        <span className="eyebrow">
          <span className="dot" />
          Built for YC founders
        </span>
        <h1 className="display">
          Beautiful <em>clickable demos.</em>
        </h1>
        <p className="lede lede-fixed">
          <span>Delight your customers with experiences</span>
          <span>created from your codebase in one click.</span>
        </p>
        <div className="hero-cta">
          <CopyButton cmd="npx @demoday/skill@latest init" />
        </div>
      </Reveal>

      {/* Demo */}
      <Reveal as="section" id="demo" className="demo-section wrap" delayMs={80}>
        <HowItWorks />
      </Reveal>

      {/* Problem — why it matters */}
      <Problem />

      {/* How it works — process */}
      <Process />

      {/* FAQ */}
      <section id="faq" className="section">
        <div className="wrap">
          <Reveal className="section-head" staggerChildren>
            <span className="section-eyebrow">
              <span className="dot" />
              FAQ
            </span>
            <h2>
              Questions, <em>briefly answered.</em>
            </h2>
          </Reveal>
          <div className="faq-grid">
            <Reveal className="faq" delayMs={0}>
              <div className="faq-img">
                <img src="/faq/probe.png" alt="" loading="lazy" />
              </div>
              <h4>What is a clickable demo?</h4>
              <p>
                An interactive walkthrough visitors can click through right
                on your landing page — no video, no signup. Demoday ships
                it as a single self-contained HTML file.
              </p>
            </Reveal>
            <Reveal className="faq" delayMs={80}>
              <div className="faq-img">
                <img src="/faq/measure.png" alt="" loading="lazy" />
              </div>
              <h4>Where can I use it?</h4>
              <p>
                Anywhere you can paste a single <code>&lt;iframe&gt;</code>
                tag — Webflow, Framer, WordPress, Next.js, Astro, Ghost,
                MDX, or plain HTML.
              </p>
            </Reveal>
            <Reveal className="faq" delayMs={160}>
              <div className="faq-img">
                <img src="/faq/track.png" alt="" loading="lazy" />
              </div>
              <h4>How do I update it?</h4>
              <p>
                Re-run the skill. The demo is a file in your repo, so
                updating it is a normal code change — reviewable via pull
                request.
              </p>
            </Reveal>
            <Reveal className="faq" delayMs={240}>
              <div className="faq-img">
                <img src="/faq/optimize.png" alt="" loading="lazy" />
              </div>
              <h4>How do people solve this today?</h4>
              <p>
                Poorly. Visitors churn at signup walls and paywalls before
                they see the product. Screen recordings go stale the day the
                UI changes. Animated walk-throughs look nice but aren&apos;t
                interactive — you can&apos;t click around.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA footer */}
      <section className="cta">
        <div className="wrap">
          <Reveal staggerChildren>
            <span className="eyebrow">
              <span className="dot" />
              Ready when you are
            </span>
            <h1 className="display cta-display">
              It&apos;s <em>open source.</em>
            </h1>
            <div className="hero-cta">
              <CopyButton cmd="npx @demoday/skill@latest init" />
            </div>
          </Reveal>
        </div>
      </section>

      </main>

      <footer className="site">
        <div className="wrap-wide footer-inner">
          <a className="brand" href="#" aria-label="Demoday home">
            <span className="brand-mark" aria-hidden="true">
              <svg
                width="20"
                height="20"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="32" height="32" fill="#ffffff" />
                <circle cx="16" cy="16" r="12" fill="#0a0a0a" />
              </svg>
            </span>
            <span className="brand-name">Demoday</span>
          </a>
          <nav className="footer-nav">
            <a href="#demo">Demo</a>
            <a href="#faq">FAQ</a>
          </nav>
          <span className="footer-meta">
            © {new Date().getFullYear()} · Made with a single iframe.
          </span>
        </div>
      </footer>
    </>
  );
}
