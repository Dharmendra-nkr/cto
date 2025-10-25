import React, { useState } from 'react'
import PhoneScene from './components/PhoneScene'

export default function App() {
  const [color, setColor] = useState('#0b0d12')

  const finishes = [
    { name: 'Nebula Black', color: '#0b0d12' },
    { name: 'Aero Silver', color: '#acb2c1' },
    { name: 'Aurora', color: '#22233a' },
    { name: 'Sky Mist', color: '#6aa4c8' },
  ]

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-inner">
          <div className="brand">
            <div className="brand-logo" />
            Everything
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#design">Design</a>
            <a href="#specs">Specs</a>
          </div>
          <a className="nav-cta" href="#preorder">Pre‑order</a>
        </div>
      </nav>

      <main className="container">
        <section className="hero" id="design">
          <div>
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Introducing the future phone
            </div>
            <h1>Everything — a smartphone built for what comes next.</h1>
            <p>
              Meet the first device designed around immersive 3D, realtime intelligence, and
              a radically simple experience. Sculpted glass. Adaptive light. Zero‑distraction UI.
            </p>
            <div className="hero-ctas">
              <a href="#preorder" className="btn btn-primary">Pre‑order now</a>
              <a href="#features" className="btn">Explore features</a>
            </div>

            <div style={{ marginTop: 22 }}>
              <div className="feature-title">Choose your finish</div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                {finishes.map((f) => (
                  <button
                    key={f.name}
                    className="btn"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 10,
                      borderColor: color === f.color ? 'rgba(74,227,255,.8)' : 'rgba(255,255,255,.12)',
                      background: color === f.color ? 'rgba(74,227,255,.08)' : 'rgba(255,255,255,.04)'
                    }}
                    onClick={() => setColor(f.color)}
                  >
                    <span style={{
                      width: 16, height: 16, borderRadius: 999,
                      background: f.color, boxShadow: '0 0 12px rgba(255,255,255,.2)'
                    }} />
                    {f.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <PhoneScene color={color} />
        </section>

        <section id="features">
          <div className="features">
            <div className="feature-card">
              <div className="feature-title">Holographic Glass</div>
              <div className="feature-desc">Precision‑milled, ion‑strengthened glass with adaptive optics and micro‑etched light diffusion.</div>
            </div>
            <div className="feature-card">
              <div className="feature-title">Neural Engine</div>
              <div className="feature-desc">Local AI that enhances images, audio, and power usage in real‑time — no cloud required.</div>
            </div>
            <div className="feature-card">
              <div className="feature-title">Zero‑Latency Touch</div>
              <div className="feature-desc">A 1Hz–240Hz adaptive panel that feels instantaneous, yet sips power when you’re idle.</div>
            </div>
          </div>
        </section>

        <section className="footer">
          © {new Date().getFullYear()} Everything. All rights reserved.
        </section>
      </main>
    </>
  )
}
