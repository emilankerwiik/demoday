import CopyButton from "./CopyButton";
import HowItWorks from "./HowItWorks";
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
          <a className="btn btn-primary btn-sm" href="#pricing">
            Premium
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

      {/* Pricing */}
      <section id="pricing" className="section alt">
        <div className="wrap">
          <Reveal className="section-head" staggerChildren>
            <span className="section-eyebrow">
              <span className="dot" />
              Pricing
            </span>
            <p className="pricing-lede">
              Start for free. <em>Make it yours.</em>
            </p>
          </Reveal>

          <Reveal className="pricing-card" delayMs={120}>
            <div className="pricing-card-caption">
              <span className="tag">
                <span className="dot" />
                Pricing
              </span>
              <span className="pricing-card-meta">
                Unlimited demos · Yours forever
              </span>
            </div>
            <div className="pricing-card-body">
              <div className="plan">
                <div className="plan-head">
                  <h3>Free</h3>
                  <div className="plan-price">
                    <span className="amount">$0</span>
                    <span className="per">forever</span>
                  </div>
                </div>
                <p className="plan-sub">
                  Everything you need to ship a clickable demo today.
                </p>
                <ul className="plan-list">
                  <li>
                    <span className="check">✓</span>
                    Unlimited demos
                  </li>
                  <li>
                    <span className="check">✓</span>
                    Self-contained HTML, CSS &amp; JS
                  </li>
                  <li>
                    <span className="check">✓</span>
                    Small &ldquo;Made with Demoday&rdquo; tag in the corner
                  </li>
                </ul>
              </div>

              <div className="plan-divider" aria-hidden="true" />

              <div className="plan plan-premium">
                <div className="plan-badge">
                  <span className="dot" />
                  Premium
                </div>
                <div className="plan-head">
                  <h3>
                    Make it <em>yours.</em>
                  </h3>
                  <div className="plan-price">
                    <span className="amount">$20</span>
                    <span className="per">one-time</span>
                  </div>
                </div>
                <p className="plan-sub">
                  Everything in Free, with your brand in the corner of every
                  iframe — across every project on your machine.
                </p>
                <a className="btn btn-primary plan-cta" href="#install">
                  Upgrade for $20 →
                </a>
              </div>
            </div>
          </Reveal>
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
              <h4>What is the alternative?</h4>
              <p>
                Screen recordings. They&apos;re stiff, not interactive, and
                go stale the moment your UI changes. Demoday ships a
                playful, clickable surface you refresh whenever you ship.
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
              Show, <em>don&apos;t tell.</em>
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
            <a href="#pricing">Pricing</a>
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
