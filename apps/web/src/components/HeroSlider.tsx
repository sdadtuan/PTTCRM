'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

export type HeroSlide = {
  kicker: string;
  headlineBefore: string;
  headlineAccent: string;
  subtitle: string;
  visual: string;
};

type Mock = {
  title: string;
  live: string;
  cols: string[];
  rows: { campaign: string; spend: string; leads: string; deals: string; roas: string; hot: boolean }[];
  loop: string[];
};

type Stat = { value: string; label: string };

const SCENE: Record<string, string> = {
  bds: '/editorial-bds.svg',
  agency: '/editorial-agency.svg',
  fnb: '/editorial-fnb.svg',
};

type Props = {
  slides: HeroSlide[];
  mock: Mock;
  demoHref: string;
  pricingHref: string;
  ctaDemo: string;
  ctaPricing: string;
  stats: Stat[];
};

export function HeroSlider({ slides, mock, demoHref, pricingHref, ctaDemo, ctaPricing, stats }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const go = useCallback(
    (next: number) => {
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => go(index + 1), 5600);
    return () => window.clearInterval(id);
  }, [index, paused, count, go]);

  return (
    <div
      className="pro-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pro-slider-viewport">
        <div className="pro-slider-track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {slides.map((slide) => (
            <div className="pro-hero-grid pro-slide" key={`${slide.kicker}-${slide.visual}`}>
              <div className="pro-hero-copy">
                <span className="pro-badge">{slide.kicker}</span>
                <h1>
                  {slide.headlineBefore} <span className="pro-accent">{slide.headlineAccent}</span>
                </h1>
                <p className="pro-hero-sub">{slide.subtitle}</p>
                <div className="pro-hero-cta">
                  <Link className="btn pro-btn" href={demoHref}>
                    {ctaDemo} →
                  </Link>
                  <Link className="btn pro-btn-ghost" href={pricingHref}>
                    {ctaPricing}
                  </Link>
                </div>
                <div className="pro-stats">
                  {stats.map((stat) => (
                    <div key={stat.label}>
                      <strong>{stat.value}</strong>
                      <span>{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              {slide.visual === 'mock' ? (
                <figure className="pro-mock">
                  <div className="pro-mock-bar">
                    <span className="pro-mock-dots" aria-hidden>
                      <i />
                      <i />
                      <i />
                    </span>
                    <em>{mock.title}</em>
                    <b>{mock.live}</b>
                  </div>
                  <div className="pro-mock-loop">
                    {mock.loop.map((step, i) => (
                      <span key={step}>
                        {i > 0 ? <i aria-hidden>→</i> : null}
                        {step}
                      </span>
                    ))}
                  </div>
                  <table>
                    <thead>
                      <tr>
                        {mock.cols.map((col) => (
                          <th key={col}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mock.rows.map((row) => (
                        <tr key={row.campaign} className={row.hot ? 'hot' : undefined}>
                          <td>{row.campaign}</td>
                          <td>{row.spend}</td>
                          <td>{row.leads}</td>
                          <td>{row.deals}</td>
                          <td>{row.roas}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </figure>
              ) : (
                <figure className="pro-slide-visual">
                  <img src={SCENE[slide.visual] ?? SCENE.bds} alt="" />
                </figure>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="pro-slider-nav">
        <button type="button" className="pro-slider-arrow" aria-label="Previous" onClick={() => go(index - 1)}>
          ‹
        </button>
        <div className="pro-slider-dots">
          {slides.map((slide, i) => (
            <button
              key={slide.visual}
              type="button"
              className={i === index ? 'is-active' : undefined}
              aria-label={slide.kicker}
              aria-current={i === index}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <button type="button" className="pro-slider-arrow" aria-label="Next" onClick={() => go(index + 1)}>
          ›
        </button>
      </div>
    </div>
  );
}
