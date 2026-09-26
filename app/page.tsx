"use client";

import Image from 'next/image';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { languages, Lang, t } from "../locales";
import { INTENT_KEY, logoutDemo, readAuth } from "../lib/auth";
import { readCustomerLocation } from "../lib/customerLocation";
import LocationSelector from "../components/LocationSelector";
import ServiceDiscovery from "../components/ServiceDiscovery";

const statsByLang: Record<Lang, Array<[string, string, string]>> = {
  en: [["10,000+", "services completed", "✓"], ["120+", "verified workers", "✓"], ["8+", "cooperatives partnered", "🤝"], ["4.8★", "average rating", "★"]],
  hi: [["10,000+", "सेवाएँ पूर्ण", "✓"], ["120+", "सत्यापित कामगार", "✓"], ["8+", "सहकारी संस्थाएँ", "🤝"], ["4.8★", "औसत रेटिंग", "★"]],
  mr: [["10,000+", "सेवा पूर्ण", "✓"], ["120+", "सत्यापित कामगार", "✓"], ["8+", "सहकारी संस्था", "🤝"], ["4.8★", "सरासरी रेटिंग", "★"]],
  ta: [["10,000+", "சேவைகள் முடிந்தது", "✓"], ["120+", "சரிபார்க்கப்பட்ட தொழிலாளர்கள்", "✓"], ["8+", "கூட்டுறவுகள்", "🤝"], ["4.8★", "சராசரி மதிப்பீடு", "★"]],
  te: [["10,000+", "పూర్తయిన సేవలు", "✓"], ["120+", "ధృవీకరించిన కార్మికులు", "✓"], ["8+", "సహకార సంఘాలు", "🤝"], ["4.8★", "సగటు రేటింగ్", "★"]],
};


export default function Home() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("en");
  const [location, setLocation] = useState("");
  const [auth, setAuth] = useState(false);
  const [role, setRole] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const l = localStorage.getItem("sahyogsetu-language") as Lang | null;
    if (l && languages[l]) setLang(l);
    const loc = readCustomerLocation();
    if (loc) setLocation(`${loc.area}, ${loc.city}`);
    const a = readAuth();
    setAuth(a.isAuthenticated);
    setRole(a.role || "");
  }, []);

  const d = t[lang] as any;

  function changeLang(v: Lang) {
    setLang(v);
    localStorage.setItem("sahyogsetu-language", v);
  }

  function start(service?: string) {
    if (service) localStorage.setItem(INTENT_KEY, service);
    if (readAuth().isAuthenticated) router.push(service ? `/booking?service=${service}` : "/booking");
    else router.push("/login");
  }

  function logout() {
    logoutDemo();
    setAuth(false);
    setRole("");
    setMobileMenu(false);
  }

  const roleHref =
    role === "customer" ? "/customer" :
    role === "worker" ? "/worker" :
    role === "trainee" ? "/trainee" : "/federation";

  const roleLabel =
    role === "customer" ? d.auth.customer :
    role === "worker" ? d.worker?.title :
    role === "trainee" ? d.trainee?.title :
    "Cooperative Federation";

  return (
    <main className="min-h-screen bg-white">
      <header className="site-header">
        <div className="site-nav">
          <a href="#home" className="brand" aria-label="SahyogSetu home">
            <img src="/assets/sahyogsetu-logo-reference.png" alt="SahyogSetu — Services • People • Stronger Communities" className="brand-logo-image" />
          </a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            <a className="active" href="#home">{d.nav.home}</a>
            <a href="#services">{d.nav.services}</a>
            <a href="#how">{d.nav.how}</a>
            <a href="#workers">{d.nav.workers}</a>
            <a href="#about">{d.nav.about}</a>
          </nav>

          <div className="nav-actions desktop-actions">
            <select aria-label={d.footer.language} value={lang} onChange={e => changeLang(e.target.value as Lang)} className="language-select">
              {Object.entries(languages).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            {auth ? (
              <>
                <a href={roleHref} className="login-link">{roleLabel}</a>
                <button onClick={logout} className="login-link">{d.auth.logout}</button>
              </>
            ) : (
              <button onClick={() => router.push("/login")} className="login-button">{d.nav.login}</button>
            )}
            <button onClick={() => start()} className="hero-primary nav-cta">{d.nav.book}</button>
          </div>

          <div className="mobile-actions">
            <select aria-label={d.footer.language} value={lang} onChange={e => changeLang(e.target.value as Lang)} className="language-select">
              {Object.entries(languages).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <button
              className="menu-button"
              aria-expanded={mobileMenu}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              onClick={() => setMobileMenu(v => !v)}
            >
              ☰
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div id="mobile-menu" className="mobile-menu">
            <a href="#home" onClick={() => setMobileMenu(false)}>{d.nav.home}</a>
            <a href="#services" onClick={() => setMobileMenu(false)}>{d.nav.services}</a>
            <a href="#how" onClick={() => setMobileMenu(false)}>{d.nav.how}</a>
            <a href="#workers" onClick={() => setMobileMenu(false)}>{d.nav.workers}</a>
            <a href="#about" onClick={() => setMobileMenu(false)}>{d.nav.about}</a>
            {auth ? (
              <>
                <a href={roleHref}>{roleLabel}</a>
                <button onClick={logout}>{d.auth.logout}</button>
              </>
            ) : (
              <button onClick={() => router.push("/login")}>{d.nav.login}</button>
            )}
            <button onClick={() => start()} className="hero-primary">{d.nav.book}</button>
          </div>
        )}
      </header>

      <section id="home" className="hero-section">
        <div className="hero-shell">
          <div className="hero-copy">
            <span className="hero-badge"><span aria-hidden="true">✓</span> {d.hero.badge}</span>
            <h1 className="hero-title">
              <span>Trusted Services.</span>
              <span className="hero-green">Stronger</span>
              <span>Communities.</span>
            </h1>
            <p className="hero-description">{d.hero.sub || "Book skilled local workers for your household and community needs while supporting cooperative employment."}</p>
            <div className="hero-actions">
              <button onClick={() => start()} className="hero-primary">{d.hero.book}</button>
              <button onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })} className="hero-secondary">{d.hero.explore}</button>
            </div>
          </div>

          <div className="hero-visual" aria-label="Local cooperative service workers and service categories">
            <div className="hero-glow" aria-hidden="true" />
            <Image
              src="/assets/worker-reference-full.jpg"
              alt="Five local cooperative service workers representing plumbing, cleaning, painting, gardening and household services"
              width={900}
              height={700}
              priority
              className="worker-hero-image"
            />
          </div>
        </div>
      </section>

      <section className="stats-shell" aria-label="SahyogSetu service statistics">
        {statsByLang[lang].map(([number, label, icon], i) => (
          <div key={label} className={`stat-item ${i < 3 ? "stat-divider" : ""}`}>
            <span className="stat-icon" aria-hidden="true">{icon}</span>
            <div><strong>{number}</strong><span>{label}</span></div>
          </div>
        ))}
      </section>

      <section className="page-shell section location-section">
        <LocationSelector lang={lang} initial={location} onChange={setLocation} />
      </section>

      <section id="services" className="page-shell section">
        <ServiceDiscovery lang={lang} initialLocation={location} />
      </section>

      <section id="workers" className="cooperative-strip">
        <div className="page-shell section">
          <div className="section-heading">
            <span className="eyebrow">SahyogSetu</span>
            <h2>{d.trust.title}</h2>
          </div>
          <div className="trust-grid">
            {["✓", "🤝", "📍", "▣"].map((icon, i) => (
              <div key={i} className="card p-6">
                <div className="trust-icon">{icon}</div>
                <h3>{d.trust.items[i]}</h3>
                <p>{[
                  "Workers shown with demo verification status",
                  "Cooperative network supports regional service access",
                  "Availability is shown using prototype regional data",
                  "Final estimate follows inspection where applicable"
                ][i]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="page-shell section">
        <div className="section-heading">
          <span className="eyebrow">Simple process</span>
          <h2>{d.how.title}</h2>
        </div>
        <div className="how-grid">
          {[
            "Choose a service",
            "Enter your location",
            "Get matched with a cooperative worker",
            "Inspect and approve the estimate",
            "Service completed and payment recorded"
          ].map((x, i) => (
            <div key={x} className="how-card">
              <div className="step-number">{i + 1}</div>
              <p>{x}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="site-footer" id="about">
        <div className="page-shell footer-inner">
          <div>
            <div className="brand-name footer-brand">SahyogSetu</div>
            <p>{d.footer.copy}</p>
          </div>
          <span>Services • People • Stronger Communities</span>
        </div>
      </footer>
    </main>
  );
}
