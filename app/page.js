import CopyButton from "./CopyButton";

export default function Home() {
  return (
    <>
      <header className="header">
        <div className="wrap-wide header-inner">
          <a className="brand" href="#" aria-label="Demoday home">
            <span className="brand-mark" aria-hidden="true">D</span>
            Demoday
          </a>
          <a className="btn btn-primary btn-sm" href="#install">
            Get started
          </a>
        </div>
      </header>

      <main>
      {/* Hero */}
      <section className="hero wrap">
        <span className="eyebrow">
          <span className="dot" />
          Built for Claude Code users
        </span>
        <h1 className="display">
          Beautiful <em>clickable demos.</em>
        </h1>
        <p className="lede">
          Makes it really, really simple to delight visitors.
        </p>
        <div className="hero-cta">
          <CopyButton cmd="npx @demoday/skill@latest init" />
          <a className="btn" href="#how">
            How it works →
          </a>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" className="demo-section wrap-wide">
        <div className="demo-frame">
          <iframe
            src="/demos/demoday.html"
            title="Demoday clickable demo"
            loading="lazy"
          />
        </div>
      </section>

      {/* Problem */}
      <section className="section alt">
        <div className="wrap">
          <div className="section-head lede-head">
            <span className="section-eyebrow">
              <span className="dot" />
              The problem
            </span>
            <h2>
              Show, <em>don&apos;t tell.</em>
            </h2>
            <p className="balance">
              Delight your visitors with clickable demos.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="section-eyebrow">
              <span className="dot" />
              How it works
            </span>
            <h2>
              From idea to embed, <em>in three steps.</em>
            </h2>
            <p className="balance">
              Your coding agent does the work. You just ship the iframe.
            </p>
          </div>

          <div className="grid-3 steps-live">
            <div className="step-live">
              <div className="step-media">
                <iframe
                  src="/demos/gmail-step.html?step=1"
                  title="Step 1 — clickable Gmail inbox"
                  loading="lazy"
                />
              </div>
              <div className="step-body">
                <div className="num">01</div>
                <h4>Paste one line into Claude Code</h4>
                <p>
                  It installs the skill and writes a config you never need
                  to touch.
                </p>
              </div>
            </div>

            <div className="step-live">
              <div className="step-media">
                <iframe
                  src="/demos/gmail-step.html?step=2"
                  title="Step 2 — clickable Gmail compose"
                  loading="lazy"
                />
              </div>
              <div className="step-body">
                <div className="num">02</div>
                <h4>Confirm in chat</h4>
                <p>
                  Claude asks once about telemetry and offers to generate
                  your first demo — a single click.
                </p>
              </div>
            </div>

            <div className="step-live">
              <div className="step-media">
                <iframe
                  src="/demos/gmail-step.html?step=3"
                  title="Step 3 — clickable Gmail sent"
                  loading="lazy"
                />
              </div>
              <div className="step-body">
                <div className="num">03</div>
                <h4>Ship the iframe</h4>
                <p>
                  One tag lands on your landing page. It works on Next.js,
                  Webflow, WordPress, anywhere HTML renders.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Install */}
      <section id="install" className="section alt">
        <div className="wrap install-wrap">
          <div className="section-head">
            <span className="section-eyebrow">
              <span className="dot" />
              Install
            </span>
            <h2>
              One command. <em>One iframe.</em>
            </h2>
            <p>
              Paste this in Claude Code and let your agent do the rest.
            </p>
          </div>

          <pre className="code">
            <span className="c-dim"># 1. Install the skill (one line)</span>
            {"\n"}
            <span className="c-acc">npx</span> @demoday/skill@latest init
            {"\n\n"}
            <span className="c-dim"># 2. Ask your agent</span>
            {"\n"}
            <span className="c-dim">&gt;</span> use the{" "}
            <span className="c-str">demoday</span> skill to create a clickable
            demo of our{"\n"}
            {"  "}onboarding flow and embed it on the landing page
            {"\n\n"}
            <span className="c-dim"># 3. Ship it</span>
            {"\n"}
            <span className="c-acc">git</span> add . && <span className="c-acc">git</span> commit -m{" "}
            <span className="c-str">&quot;demoday: onboarding walkthrough&quot;</span>
          </pre>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section alt">
        <div className="wrap">
          <div className="section-head">
            <span className="section-eyebrow">
              <span className="dot" />
              Pricing
            </span>
            <h2>
              Free to start. <em>$20 to go unbranded.</em>
            </h2>
            <p>
              Every free demo carries a tiny &ldquo;Made with Demoday&rdquo;
              badge in the bottom-right. Pay once, it disappears.
            </p>
          </div>

          <div className="pricing-grid">
            <div className="price-card">
              <div className="price-head">
                <h3>Free</h3>
                <div className="price">
                  <span className="amount">$0</span>
                  <span className="per">forever</span>
                </div>
              </div>
              <p className="price-sub">
                Everything you need to ship a clickable demo today.
              </p>
              <ul className="price-list">
                <li>
                  <span className="check">✓</span>
                  Unlimited demos
                </li>
                <li>
                  <span className="check">✓</span>
                  Self-contained HTML, CSS &amp; JS
                </li>
              </ul>
              <a className="btn price-cta" href="#install">
                Install the skill
              </a>
            </div>

            <div className="price-card featured">
              <div className="price-badge">
                <span className="dot" />
                Premium
              </div>
              <div className="price-head">
                <h3>Unbranded</h3>
                <div className="price">
                  <span className="amount">$20</span>
                  <span className="per">one-time</span>
                </div>
              </div>
              <p className="price-sub">
                Your product, your brand, nothing else.
              </p>
              <ul className="price-list">
                <li>
                  <span className="check">✓</span>
                  Everything in Free
                </li>
                <li>
                  <span className="check">✓</span>
                  <b>No Demoday tag</b> on any iframe
                </li>
              </ul>
              <a className="btn btn-primary price-cta" href="#install">
                Upgrade for $20 →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="section-eyebrow">
              <span className="dot" />
              FAQ
            </span>
            <h2>
              Questions, <em>briefly answered.</em>
            </h2>
          </div>
          <div className="faq-grid">
            <div className="faq">
              <h4>Does it ship a runtime?</h4>
              <p>
                No. The output is a single static HTML file with inline CSS
                and JS. Nothing to install on the page you embed it into.
              </p>
            </div>
            <div className="faq">
              <h4>Can I style it to match my brand?</h4>
              <p>
                Yes. The generated HTML is plain and editable. Ask your agent
                to tweak colors, fonts, or spacing — it&apos;s just CSS.
              </p>
            </div>
            <div className="faq">
              <h4>What if my product changes?</h4>
              <p>
                Re-run the skill. Because your agent owns the file, updating
                the demo is a normal code change, reviewable via pull request.
              </p>
            </div>
            <div className="faq">
              <h4>Which agents are supported?</h4>
              <p>
                Demoday is a skill for Claude Code. Any coding agent that can
                run npm scripts and read files can use it.
              </p>
            </div>
            <div className="faq">
              <h4>Is it really just an iframe?</h4>
              <p>
                Really. One tag, one file. The kind of embed that works on
                Webflow, WordPress, Framer, MDX, or hand-rolled HTML.
              </p>
            </div>
            <div className="faq">
              <h4>How much does it cost?</h4>
              <p>
                Free forever with a small badge in the corner of every
                iframe. A one-time $20 upgrade removes the badge across all
                your projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA footer */}
      <section className="cta">
        <div className="wrap">
          <span className="eyebrow">
            <span className="dot" />
            Ready when you are
          </span>
          <h2>
            Ship demos, <em>not decks.</em>
          </h2>
          <p>
            Install the skill, ask your agent, embed the iframe. That&apos;s
            the whole product.
          </p>
          <div className="hero-cta">
            <a className="btn" href="#install">
              Install the skill →
            </a>
            <a className="btn secondary" href="#demo">
              See the demo
            </a>
          </div>
        </div>
      </section>

      </main>

      <footer className="site">
        <div className="wrap-wide row">
          <span>© {new Date().getFullYear()} Demoday</span>
          <span>Made with a single iframe.</span>
        </div>
      </footer>
    </>
  );
}
