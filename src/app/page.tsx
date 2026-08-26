"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type ApiResult = { shortUrl?: string; error?: { message?: string } };

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function shorten(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setShortUrl(""); setLoading(true);
    try {
      const response = await fetch("/api/urls", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ originalUrl: url }) });
      const data = (await response.json()) as ApiResult;
      if (!response.ok) throw new Error(data.error?.message ?? "Could not shorten that URL.");
      setShortUrl(data.shortUrl ?? "");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Something went wrong."); }
    finally { setLoading(false); }
  }

  return (
    <main><div className="shell"><nav className="nav"><a className="brand" href="#">shrinkr<span className="brand-mark" /></a><div className="nav-links"><a href="#features">Features</a><a href="#analytics">Analytics</a><Link href="/login">Sign in</Link><Link className="nav-cta" href="/register">Get started</Link></div></nav>
      <section className="hero"><div><div className="eyebrow">Short links, long reach</div><h1>Make every link count.</h1><p className="hero-copy">Turn long, messy URLs into clear, memorable links. Built for people who want the signal without the noise.</p><form className="shorten-box" onSubmit={shorten}><input aria-label="URL to shorten" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Paste a link to get started..." type="url" required /><button className="primary-button" disabled={loading}>{loading ? "Working..." : "Shorten link"}</button></form>{error && <div className="error" role="alert">{error}</div>}{shortUrl && <div className="result" role="status"><span>{shortUrl}</span><button type="button" onClick={() => void navigator.clipboard.writeText(shortUrl)}>Copy</button></div>}</div><div className="hero-visual" aria-label="Link analytics preview"><div className="visual-grid" /><div className="visual-card main"><div className="visual-label">Your short link</div><div className="visual-url">shrinkr.io/launch</div><div className="visual-bar" /></div><div className="visual-card small"><div className="visual-label">Clicks today</div><div className="metric">2,481</div></div></div></section>
      <section className="section" id="features"><div className="section-heading"><div><div className="eyebrow">Everything in one place</div><h2>Less link admin.<br />More momentum.</h2></div><p>From your first click to your millionth, shrinkr gives your links a home and your audience a better path forward.</p></div><div className="feature-grid"><article className="feature"><div className="feature-number">01 / CREATE</div><h3>Links people remember</h3><p>Custom aliases make campaigns easier to share, track, and trust.</p></article><article className="feature"><div className="feature-number">02 / UNDERSTAND</div><h3>Clarity in every click</h3><p>See what is working with focused, useful analytics that stay out of the way.</p></article><article className="feature"><div className="feature-number">03 / MOVE FAST</div><h3>Built for the everyday</h3><p>Fast redirects, reliable links, and a calm workspace for your whole team.</p></article></div></section>
      <section className="section" id="analytics"><div className="section-heading"><div><div className="eyebrow">A clearer picture</div><h2>Know where<br />attention goes.</h2></div><p>Understand your audience at a glance, then spend your time on the work that matters.</p></div><div className="dashboard-preview"><div className="preview-panel"><div className="preview-title">Total clicks · last 30 days</div><div className="metric">18,294</div><div className="chart">{[35, 48, 42, 62, 54, 78, 65, 92, 74, 100, 81, 94].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></div><div className="preview-panel light"><div className="preview-title">Recent links</div><div className="url-row"><span>spring-launch</span><span>8,421 clicks</span></div><div className="url-row"><span>read-the-report</span><span>4,293 clicks</span></div><div className="url-row"><span>join-the-community</span><span>2,118 clicks</span></div><div className="url-row"><span>product-tour</span><span>1,840 clicks</span></div></div></div></section>
      <footer className="footer"><span>© 2026 shrinkr</span><span>Simple links. Serious reach.</span></footer></div></main>
  );
}
