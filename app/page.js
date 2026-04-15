import CopyButton from "./CopyButton";
import GitHubStars from "./GitHubStars";
import HowItWorks from "./HowItWorks";
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
          <div className="header-actions">
            <GitHubStars />
            <a
              className="btn btn-primary btn-sm"
              href="https://github.com/emilankerwiik/demoday"
              target="_blank"
              rel="noopener noreferrer"
            >
              Star on GitHub
            </a>
          </div>
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
        <p className="lede">
          Delight customers with what you do in seconds. One-click create from your codebase with Claude Code, Cursor, and Codex.
        </p>
        <div className="hero-cta">
          <CopyButton cmd="npx @demoday/skill@latest init" />
        </div>
      </Reveal>

      {/* Demo */}
      <Reveal as="section" id="demo" className="demo-section wrap-wide" delayMs={80}>
        <HowItWorks />
      </Reveal>

      {/* Video banner */}
      <section className="video-banner">
        <div className="video-banner-inner">
          <div className="video-banner-fade video-banner-fade-top" />
          <video
            className="video-banner-media"
            src="https://cdn.midjourney.com/video/7f63e735-7fad-4fbb-b2b6-a586579315a5/1.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="video-banner-fade video-banner-fade-bottom" />
        </div>
      </section>

      {/* How it works — process */}
      <Process />

      <Reveal as="div" className="wrap" style={{ textAlign: "center", padding: "0 24px 64px" }}>
        <CopyButton cmd="npx @demoday/skill@latest init" />
      </Reveal>

      {/* Video banner 2 */}
      <section className="video-banner">
        <div className="video-banner-inner">
          <div className="video-banner-fade video-banner-fade-top" />
          <video
            className="video-banner-media"
            src="https://cdn.midjourney.com/video/3fae97af-9e38-4200-bff3-1c2ac276f927/0.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="video-banner-fade video-banner-fade-bottom" />
        </div>
      </section>

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

              <h4>What is a clickable demo?</h4>
              <p>
                An interactive walkthrough visitors can click through right
                on your landing page — no video, no signup. Demoday ships
                it as a single self-contained HTML file.
              </p>
            </Reveal>
            <Reveal className="faq" delayMs={80}>

              <h4>Where can I use it?</h4>
              <p>
                Anywhere you can paste a single <code>&lt;iframe&gt;</code>
                tag — Webflow, Framer, WordPress, Next.js, Astro, Ghost,
                MDX, or plain HTML.
              </p>
            </Reveal>
            <Reveal className="faq" delayMs={160}>

              <h4>How do I update it?</h4>
              <p>
                Re-run the skill. The demo is a file in your repo, so
                updating it is a normal code change — reviewable via pull
                request.
              </p>
            </Reveal>
            <Reveal className="faq" delayMs={240}>

              <h4>How do people solve this today?</h4>
              <p>
                Today, visitors churn before they see the product.
                Authentication is friction, screen recordings go stale, and
                animations are not clickable.
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
            <a
              href="https://github.com/emilankerwiik/demoday"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </nav>
          <span className="footer-meta">
            © {new Date().getFullYear()} · Made with a single iframe.
          </span>
        </div>
      </footer>
    </>
  );
}
