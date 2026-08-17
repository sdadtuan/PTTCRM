'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

export type HeroSlide = {
  kicker: string;
  title: string[];
  subtitle: string;
  visual: string;
  stats: { value: string; label: string }[];
};

type Props = {
  slides: HeroSlide[];
  demoHref: string;
  ctaDemo: string;
};

const SCENE: Record<string, string> = {
  crm: '/hero-crm.svg',
  mock: '/hero-crm.svg',
  bds: '/hero-bds.svg',
  agency: '/hero-agency.svg',
  fnb: '/hero-fnb.svg',
};

export function HeroSlider({ slides, demoHref, ctaDemo }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const slide = slides[index] ?? slides[0];

  const go = useCallback(
    (next: number) => {
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => go(index + 1), 6000);
    return () => window.clearInterval(id);
  }, [index, paused, count, go]);

  if (!slide) return null;

  return (
    <div
      className={`orbit-hero orbit-hero-${slide.visual}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((item, i) => (
        <div
          key={item.visual}
          className={`orbit-hero-bg${i === index ? ' is-active' : ''}`}
          style={{ backgroundImage: `url(${SCENE[item.visual] ?? SCENE.crm})` }}
          aria-hidden
        />
      ))}
      <div className="orbit-hero-veil" aria-hidden />
      <div className="orbit-hero-fx" aria-hidden>
        <div className="orbit-ring orbit-ring-a">
          <i />
        </div>
        <div className="orbit-ring orbit-ring-b">
          <i />
        </div>
        <span className="orbit-orb orbit-orb-a" />
        <span className="orbit-orb orbit-orb-b" />
        <span className="orbit-orb orbit-orb-c" />
        <svg className="orbit-weave" viewBox="0 0 1200 400" preserveAspectRatio="none">
          <defs>
            <linearGradient id="orbitWeave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--current-theme))" stopOpacity="0" />
              <stop offset="50%" stopColor="hsl(var(--current-theme))" stopOpacity="0.55" />
              <stop offset="100%" stopColor="hsl(var(--current-theme))" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 120 Q200 60 400 120 T800 120 T1200 120" fill="none" stroke="url(#orbitWeave)" strokeWidth="2" />
          <path d="M0 220 Q300 160 600 220 T1200 220" fill="none" stroke="url(#orbitWeave)" strokeWidth="1" />
        </svg>
      </div>

      <div className="orbit-hero-copy" key={slide.visual}>
        <span className="orbit-badge">{slide.kicker}</span>
        <h1>
          <span>{slide.title[0]}</span>
          <span className="orbit-title-accent">{slide.title[1]}</span>
          <span>{slide.title[2]}</span>
        </h1>
        <p className="orbit-hero-sub">{slide.subtitle}</p>
        <div className="orbit-hero-cta">
          <Link className="btn orbit-cta" href={demoHref}>
            {ctaDemo}
            <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="orbit-stats">
          {slide.stats.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
        <div className="orbit-dots">
          {slides.map((item, i) => (
            <button
              key={item.visual}
              type="button"
              className={i === index ? 'is-active' : undefined}
              aria-label={item.kicker}
              aria-current={i === index}
              onClick={() => go(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
