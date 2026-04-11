import Reveal from "./Reveal";

const VALUES = [
  {
    title: "Delight visitors",
    desc: "They understand your product in seconds — not by reading a pitch, but by using a tiny version of it right there.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2l2.39 4.84L20 7.6l-4 3.9.94 5.5L12 14.77 7.06 17l.94-5.5L4 7.6l5.61-.76L12 2z" />
      </svg>
    ),
  },
  {
    title: "User-test quickly",
    desc: "No signup, no credit card, no onboarding. Drop the demo in front of anyone and watch what they click.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 4l7 16 2.5-7L20 11 4 4z" />
      </svg>
    ),
  },
  {
    title: "Attract viewers",
    desc: "Every PR becomes a piece of content. Re-run the skill on each change and post the fresh clickable demo straight to social.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
        <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
      </svg>
    ),
  },
];

export default function Problem() {
  return (
    <section id="why" className="prob-section">
      <div className="wrap">
        <Reveal className="section-head" staggerChildren>
          <span className="section-eyebrow">
            <span className="dot" />
            Why it matters
          </span>
          <h2>
            Show, <em>don&apos;t tell.</em>
          </h2>
        </Reveal>
        <div className="grid-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} className="feat" delayMs={i * 80}>
              <span className="icon-box">{v.icon}</span>
              <h4>{v.title}</h4>
              <p>{v.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
