"use client";

import { useState, useEffect } from "react";

const REPO = "emilankerwiik/demoday";
const CACHE_KEY = "gh_stars";
const CACHE_TTL = 1000 * 60 * 60;

function getCached() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { count, ts } = JSON.parse(raw);
    if (Date.now() - ts < CACHE_TTL) return count;
  } catch {
    /* ignore */
  }
  return null;
}

function setCache(count) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ count, ts: Date.now() }));
  } catch {
    /* ignore */
  }
}

export default function GitHubStars() {
  const [stars, setStars] = useState(null);

  useEffect(() => {
    const cached = getCached();
    if (cached !== null) {
      setStars(cached);
      return;
    }
    fetch(`https://api.github.com/repos/${REPO}`, {
      headers: { Accept: "application/vnd.github.v3+json" },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.stargazers_count != null) {
          setStars(data.stargazers_count);
          setCache(data.stargazers_count);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <a
      className="gh-stars"
      href={`https://github.com/${REPO}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Star Demoday on GitHub"
    >
      <svg
        className="gh-icon"
        width="18"
        height="18"
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.63 7.63 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
      </svg>
      {stars !== null && <span className="gh-count">{stars}</span>}
    </a>
  );
}
