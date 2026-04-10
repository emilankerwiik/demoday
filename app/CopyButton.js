"use client";

import { useEffect, useState } from "react";

export default function CopyButton({ cmd }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (e) {
        // fall through to legacy path
      }
    }
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (e) {
      return false;
    }
  };

  const onClick = async () => {
    const ok = await copyToClipboard(cmd);
    if (ok) setCopied(true);
  };

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2400);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <button
      type="button"
      className={"cli-copy" + (copied ? " is-copied" : "")}
      onClick={onClick}
      aria-label="Copy install command"
      aria-live="polite"
    >
      <span className="cli-copy-label" key={copied ? "copied" : "idle"}>
        {copied ? (
          "Copied. Now paste to Claude."
        ) : (
          <code>{cmd}</code>
        )}
      </span>
      <span className="cli-copy-icon-wrap" key={copied ? "copied-icon" : "idle-icon"}>
        {copied ? (
          <svg
            className="cli-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg
            className="cli-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </span>
    </button>
  );
}
