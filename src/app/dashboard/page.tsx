"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ShortUrl } from "@/lib/urls";

export default function Dashboard() {
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  useEffect(() => { fetch("/api/urls").then((response) => response.json()).then((body: { data: ShortUrl[] }) => setUrls(body.data)); }, []);
  const clicks = urls.reduce((total, item) => total + item.clicks, 0);
  return <main><div className="shell"><nav className="nav"><Link className="brand" href="/">shrinkr<span className="brand-mark" /></Link><div className="nav-links"><span>Workspace</span><Link href="/">Back home</Link></div></nav><section className="section"><div className="section-heading"><div><div className="eyebrow">Overview</div><h2>Your links.</h2></div><Link className="nav-cta" href="/">Create a link</Link></div><div className="feature-grid"><article className="feature"><div className="feature-number">TOTAL LINKS</div><div className="metric">{urls.length}</div></article><article className="feature"><div className="feature-number">TOTAL CLICKS</div><div className="metric">{clicks}</div></article><article className="feature"><div className="feature-number">ACTIVE</div><div className="metric">{urls.filter((item) => item.isActive).length}</div></article></div><div className="preview-panel light" style={{ marginTop: 12 }}><div className="preview-title">Recent links</div>{urls.length === 0 ? <p className="hero-copy">No links yet. Create your first one from the home page.</p> : urls.map((item) => <div className="url-row" key={item.id}><span><strong>{item.shortCode}</strong><br /><small>{item.originalUrl}</small></span><span>{item.clicks} clicks</span></div>)}</div></section></div></main>;
}