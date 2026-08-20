/* ==========================================================================
   ROOS STUDIOX - LUXURY EDITORIAL SHOWCASE CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // CIRCULAR GAUGE & 0-100% TELEMETRY PRELOADER CONTROLLER
  // ==========================================================================
  function initGaugePreloader() {
    const preloader = document.getElementById('eclipsePreloader');
    const fillCircle = document.getElementById('gaugeFillCircle');
    const particleNode = document.getElementById('gaugeParticleNode');
    const counterText = document.getElementById('gaugeCounter');
    const statusText = document.getElementById('gaugeStatus');
    const svgEl = document.querySelector('.eclipse-svg-logo');
    const p1 = document.getElementById('logoPath1');
    const p2 = document.getElementById('logoPath2');

    if (!preloader || !fillCircle || !counterText || !statusText || !p1 || !p2) return;

    document.body.style.overflow = 'hidden';

    // Gauge circumference: 2 * PI * 85 = 534.07
    const gaugeCircumference = 534.07;
    fillCircle.style.strokeDasharray = gaugeCircumference;
    fillCircle.style.strokeDashoffset = gaugeCircumference;

    const len1 = p1.getTotalLength() || 2600;
    const len2 = p2.getTotalLength() || 650;

    p1.style.strokeDasharray = len1;
    p1.style.strokeDashoffset = len1;

    p2.style.strokeDasharray = len2;
    p2.style.strokeDashoffset = len2;

    const statusMessages = [
      'INITIALIZING CORE',
      'LOADING CREATIVE ENGINE',
      'COMPOSING EXPERIENCE',
      'OPTIMIZING PERFORMANCE',
      'READY'
    ];

    let p = 0;
    const duration = 2600; // 2.6s total reveal sequence
    const startTime = performance.now();

    function animateGauge(now) {
      const elapsed = now - startTime;
      p = Math.min(100, Math.floor((elapsed / duration) * 100));

      // 1. Update 0-100% counter text
      counterText.textContent = p + '%';

      // 2. Update status message cycling
      const msgIdx = Math.min(statusMessages.length - 1, Math.floor((p / 100) * statusMessages.length));
      statusText.textContent = statusMessages[msgIdx];

      // 3. Update Circular Gauge Progress Ring (534.07 -> 0)
      const gaugeOffset = gaugeCircumference * (1 - (p / 100));
      fillCircle.style.strokeDashoffset = gaugeOffset;

      // 4. Update Traveling Electron Particle position ON Gauge Path (-90deg start angle)
      if (particleNode) {
        const particleAngle = -90 + (p * 3.6);
        particleNode.style.transform = `rotate(${particleAngle}deg) translate(93.5px) rotate(${-particleAngle}deg)`;
      }

      // 4. Logo Path Stroke Drawing (0% -> 75%)
      const drawP1 = Math.min(1, p / 70);
      p1.style.strokeDashoffset = len1 * (1 - drawP1);

      const drawP2 = Math.max(0, Math.min(1, (p - 10) / 65));
      p2.style.strokeDashoffset = len2 * (1 - drawP2);

      // 5. Logo Theme Gradient Fill at 75%
      if (p >= 75 && svgEl) {
        svgEl.classList.add('drawn');
      }

      if (p < 100) {
        requestAnimationFrame(animateGauge);
      } else {
        // Complete & Crisp dissolve fade out
        setTimeout(() => {
          preloader.classList.add('dissolve');
          setTimeout(() => {
            preloader.style.display = 'none';
            document.body.style.overflow = '';
          }, 800);
        }, 600);
      }
    }

    requestAnimationFrame(animateGauge);
  }

  initGaugePreloader();

  const header = document.getElementById('siteHeader');
  const heroPrimaryBtns = document.querySelectorAll('.btn-primary-hero');

  let scrollTimer = null;

  // Scroll Event: Header Compact State & Dynamic Glare Sweep
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    heroPrimaryBtns.forEach(btn => {
      btn.classList.add('glare-active');
    });

    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      heroPrimaryBtns.forEach(btn => {
        btn.classList.remove('glare-active');
      });
    }, 750);
  });

  // HEADER SCROLL TOGGLE FOR ARTBOARD LOGO <-> ICON POP-OUT
  const siteHeader = document.getElementById('siteHeader');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // Initialize 3-Second Auto-Swapping Hero Service Card Showcase
  initHeroCardSwapper();

  // ==========================================================================
  // OFFICIAL ROOS STUDIOX BRAND SYSTEM: ELECTRIC PURPLE & NEON GREEN PALETTES
  // ==========================================================================
  const presetPalettes = [
    { color: "#6A2CFF", dark: "#4A1FB8", sec: "#986CFF", rgb: "106, 44, 255" },  // Royal Purple (Primary Accent)
    { color: "#22D98A", dark: "#00E096", sec: "#A6F3C5", rgb: "34, 217, 138" },  // Neon Mint Green (Secondary Accent)
    { color: "#986CFF", dark: "#6A2CFF", sec: "#C8B0FF", rgb: "152, 108, 255" }, // Electric Violet
    { color: "#00D2FF", dark: "#0095FF", sec: "#80E5FF", rgb: "0, 210, 255" },   // Cyber Teal (DeepMind Inspired)
    { color: "#4A1FB8", dark: "#2C0F7C", sec: "#7947FF", rgb: "74, 31, 184" },   // Deep Indigo
    { color: "#FF4D88", dark: "#D61A5B", sec: "#FFA3C2", rgb: "255, 77, 136" },  // Purple Aurora Accent
    { color: "#A6F3C5", dark: "#22D98A", sec: "#E0FBEF", rgb: "166, 243, 197" }  // Soft Mint
  ];

  function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    const r = Math.round(255 * f(0));
    const g = Math.round(255 * f(8));
    const b = Math.round(255 * f(4));
    return [r, g, b];
  }

  function getRandomVibrantColor() {
    // Generate within Electric Purple (250-275 deg) or Neon Green (145-165 deg) spectrums
    const isGreen = Math.random() > 0.5;
    const hue = isGreen ? 145 + Math.floor(Math.random() * 20) : 250 + Math.floor(Math.random() * 25);
    const sat = 75 + Math.floor(Math.random() * 25);
    const light = 55 + Math.floor(Math.random() * 15);

    const [r, g, b] = hslToRgb(hue, sat, light);
    const [darkR, darkG, darkB] = hslToRgb(hue, sat, Math.max(30, light - 25));
    const [secR, secG, secB] = hslToRgb(hue, Math.max(20, sat - 15), Math.min(85, light + 15));

    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    const darkHex = `#${((1 << 24) + (darkR << 16) + (darkG << 8) + darkB).toString(16).slice(1)}`;
    const secHex = `#${((1 << 24) + (secR << 16) + (secG << 8) + secB).toString(16).slice(1)}`;

    return {
      color: hex,
      dark: darkHex,
      sec: secHex,
      rgb: `${r}, ${g}, ${b}`
    };
  }

  const svgIcons = {
    strategy: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
    brand: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    experiences: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`,
    engineering: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    ai: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/></svg>`,
    growth: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    transformation: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`
  };

  const servicesData = [
    {
      badge: "GROWTH ARCHITECTURE",
      title: "Strategy & Positioning",
      icon: svgIcons.strategy,
      tagline: "Brand Positioning & Growth Market Research",
      desc: "Roos StudioX architects data-driven market positioning, competitive research, and strategic brand frameworks that give ambitious companies a dominant market advantage.",
      metrics: [
        { label: "Strategy Velocity", value: "2-3x" },
        { label: "Market Alignment", value: "98.4%" },
        { label: "Valuation Multiplier", value: "3.2x" }
      ],
      process: [
        { num: "01", name: "Market Audit" },
        { num: "02", name: "Positioning Blueprint" },
        { num: "03", name: "Messaging Matrix" },
        { num: "04", name: "GTM Roadmap" }
      ],
      deliverables: [
        { name: "Strategic Brand Positioning", desc: "Sharpening core value proposition & audience differentiation.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>` },
        { name: "Messaging Architecture", desc: "Universal copy frameworks and key narrative hooks.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>` },
        { name: "SEO Market Research", desc: "In-depth competitor analysis & white space discovery.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>` },
        { name: "Brand Frameworks", desc: "Strategic pillars defining brand voice, vision & values.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>` },
        { name: "Product Naming Systems", desc: "Distinctive product naming & taxonomy structures.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>` }
      ]
    },
    {
      badge: "VISUAL BRAND SYSTEM",
      title: "Brand & Identity",
      icon: svgIcons.brand,
      tagline: "Custom Logo Design & Visual Identity Systems",
      desc: "Build iconic visual brand identities with Roos StudioX. We craft custom logos, design systems, editorial art direction, and digital brand bibles engineered for brand recall.",
      metrics: [
        { label: "Brand Recall Rate", value: "+340%" },
        { label: "Design Consistency", value: "100%" },
        { label: "Asset Velocity", value: "10x Speed" }
      ],
      process: [
        { num: "01", name: "Visual Discovery" },
        { num: "02", name: "Identity Architecture" },
        { num: "03", name: "Design Token Spec" },
        { num: "04", name: "Brand Guidelines" }
      ],
      deliverables: [
        { name: "Visual Brand Identity", desc: "Logo marks, typography scale, color science & motion guides.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>` },
        { name: "Design System Tokens", desc: "Reusable UI component libraries & design token specs.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>` },
        { name: "Digital Brand Guidelines", desc: "Comprehensive digital-first brand bible and usage rules.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>` },
        { name: "Art Direction & 3D Assets", desc: "Editorial photography, 3D asset style & layout grid guidelines.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/></svg>` },
        { name: "Production Asset Libraries", desc: "Production-ready icon sets, vector assets & media kits.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>` }
      ]
    },
    {
      badge: "DIGITAL EXPERIENCE",
      title: "UI/UX & Interface Design",
      icon: svgIcons.experiences,
      tagline: "High-Converting Website Design & Mobile UX",
      desc: "Elevate user engagement with Roos StudioX UI/UX design services. We craft intuitive wireframes, responsive website layouts, and micro-interactions that boost conversion rates.",
      metrics: [
        { label: "User Engagement", value: "+215%" },
        { label: "Funnel Conversion", value: "4.8%" },
        { label: "CSAT Score", value: "4.9/5" }
      ],
      process: [
        { num: "01", name: "User Journey Map" },
        { num: "02", name: "Wireframes & UX" },
        { num: "03", name: "Hi-Fi UI Design" },
        { num: "04", name: "Motion & Physics" }
      ],
      deliverables: [
        { name: "UI/UX Design Architecture", desc: "Wireframes, user flows & friction-free interaction models.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>` },
        { name: "Interactive UI Prototypes", desc: "Clickable high-fidelity prototypes for fast validation.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="5 3 19 12 5 21 5 3"/></svg>` },
        { name: "Motion & Micro-interactions", desc: "Subtle CSS animations, hover physics & transition curves.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>` },
        { name: "Responsive Website Layouts", desc: "Pixel-perfect experience adapted across all device viewports.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>` },
        { name: "Usability Research Loops", desc: "Qualitative usability validation & feedback loops.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>` }
      ]
    },
    {
      badge: "CORE ENGINEERING",
      title: "Web & App Development",
      stageTitle: "Full-Stack Web & Custom Software Development",
      icon: svgIcons.engineering,
      tagline: "Sub-100ms Speed & Custom Web Apps",
      desc: "Roos StudioX develops ultra-fast web applications, headless CMS platforms, and custom portals engineered for sub-100ms speed, SEO performance, and cloud scale.",
      metrics: [
        { label: "Load Speed", value: "<85ms" },
        { label: "Lighthouse Score", value: "99/100" },
        { label: "Uptime SLA", value: "99.99%" }
      ],
      process: [
        { num: "01", name: "Architecture Spec" },
        { num: "02", name: "Frontend & API" },
        { num: "03", name: "Optimization" },
        { num: "04", name: "CI/CD Deploy" }
      ],
      deliverables: [
        { name: "Full-Stack Web App Building", desc: "Clean, maintainable web apps built with modern frameworks.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>` },
        { name: "Sub-100ms Core Web Vitals", desc: "Optimized bundle sizes, edge caching & fast server rendering.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>` },
        { name: "Headless CMS Architecture", desc: "Decoupled CMS & API-first backend implementations.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>` },
        { name: "Custom Web Portals", desc: "Tailor-made web tools, portals & complex interactive features.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>` },
        { name: "API & Cloud Infrastructure", desc: "Robust GraphQL/REST APIs and cloud infrastructure.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>` }
      ]
    },
    {
      badge: "INTELLIGENT AUTOMATION",
      title: "AI & Automation",
      icon: svgIcons.ai,
      tagline: "Custom AI Agents & Workflow Automation",
      desc: "Automate business operations with Roos StudioX AI services. We deploy autonomous AI agents, LLM RAG pipelines, and API workflow automation that save 85%+ manual hours.",
      metrics: [
        { label: "Manual Hours Saved", value: "85%" },
        { label: "Workflow Speed", value: "12x" },
        { label: "Error Reduction", value: "-94%" }
      ],
      process: [
        { num: "01", name: "Workflow Audit" },
        { num: "02", name: "Agent Architecture" },
        { num: "03", name: "LLM Pipeline" },
        { num: "04", name: "Auto-Monitoring" }
      ],
      deliverables: [
        { name: "Autonomous AI Agents", desc: "Specialized agents performing complex multi-step tasks.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/></svg>` },
        { name: "API Workflow Automation", desc: "Eliminating repetitive ops with seamless API integrations.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>` },
        { name: "Custom LLM RAG Pipelines", desc: "RAG & vector databases trained on internal knowledge.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-6h2zm0-8h-2V7h2z"/></svg>` },
        { name: "Business Process Optimization", desc: "Redesigning business processes around AI leverage.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>` },
        { name: "Intelligent Analytics Dashboards", desc: "Predictive dashboards and automated insights generation.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>` }
      ]
    },
    {
      badge: "ACQUISITION ENGINE",
      title: "Growth & Marketing",
      icon: svgIcons.growth,
      tagline: "Conversion Rate Optimization & Funnel Scaling",
      desc: "Scale acquisition with Roos StudioX growth marketing. We engineer conversion-optimized landing pages, A/B testing funnels, and data attribution engines that drive ROI.",
      metrics: [
        { label: "CAC Reduction", value: "-42%" },
        { label: "Funnel Velocity", value: "+180%" },
        { label: "LTV Expansion", value: "2.4x" }
      ],
      process: [
        { num: "01", name: "Funnel Audit" },
        { num: "02", name: "CRO Testing" },
        { num: "03", name: "Attribution Engine" },
        { num: "04", name: "Retention Loops" }
      ],
      deliverables: [
        { name: "Conversion Rate Optimization", desc: "A/B testing, landing page optimization & copy tuning.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>` },
        { name: "Acquisition Sales Funnels", desc: "Multi-channel lead capture and nurturing automation.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>` },
        { name: "Analytics & Data Attribution", desc: "Real-time tracking of CAC, LTV, churn & pipeline velocity.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>` },
        { name: "Growth Channel Experiments", desc: "Rapid hypothesis testing to unlock scalable channels.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M10 2v7.31L4.75 18.1A2 2 0 0 0 6.46 21h11.08a2 2 0 0 0 1.71-2.9L14 9.31V2"/></svg>` },
        { name: "Customer Retention Loops", desc: "Onboarding flows and re-engagement triggers.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>` }
      ]
    },
    {
      badge: "DIGITAL TRANSFORMATION",
      title: "Product Consulting",
      icon: svgIcons.transformation,
      tagline: "Digital Transformation & Product Strategy",
      desc: "Transform your business model with Roos StudioX consulting. We modernize legacy tech stacks, implement enterprise AI adoption, and align digital product roadmaps for growth.",
      metrics: [
        { label: "Time-to-Market", value: "3x" },
        { label: "Digital Capability", value: "100%" },
        { label: "ROI Acceleration", value: "4.5x" }
      ],
      process: [
        { num: "01", name: "Legacy Audit" },
        { num: "02", name: "Ecosystem Map" },
        { num: "03", name: "Pilot Deploy" },
        { num: "04", name: "Org Scaling" }
      ],
      deliverables: [
        { name: "Digital Operating Models", desc: "Modern team structures & agile product methodologies.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>` },
        { name: "Enterprise AI Adoption", desc: "Organization-wide AI literacy, tools & safety protocols.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>` },
        { name: "Legacy Modernization", desc: "Refactoring outdated stacks into cloud-native platforms.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>` },
        { name: "Digital Product Strategy", desc: "Portfolio roadmap strategy & market expansion planning.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>` },
        { name: "Ecosystem Architecture", desc: "Unifying brand, tech & data into one connected system.", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>` }
      ]
    }
  ];

  function assignCardColors(randomize = false) {
    servicesData.forEach((item, index) => {
      if (randomize) {
        item.colorTheme = getRandomVibrantColor();
      } else {
        item.colorTheme = presetPalettes[index % presetPalettes.length];
      }
      item.tagThemes = item.deliverables.map(() => getRandomVibrantColor());
    });
  }

  function animateCounter(el, targetStr, duration = 900) {
    if (!el || !targetStr) return;

    // Extract all numeric segments (integers or decimals)
    const matches = [];
    const regex = /[\d\.]+/g;
    let match;

    while ((match = regex.exec(targetStr)) !== null) {
      const numVal = parseFloat(match[0]);
      if (!isNaN(numVal)) {
        matches.push({
          index: match.index,
          length: match[0].length,
          original: match[0],
          targetNum: numVal,
          isFloat: match[0].includes('.'),
          decimals: match[0].includes('.') ? match[0].split('.')[1].length : 0
        });
      }
    }

    if (matches.length === 0) {
      el.textContent = targetStr;
      return;
    }

    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 2);

      let resultStr = '';
      let lastIndex = 0;

      for (let i = 0; i < matches.length; i++) {
        const m = matches[i];
        resultStr += targetStr.substring(lastIndex, m.index);

        const currentVal = (m.targetNum * easedProgress).toFixed(m.decimals);
        resultStr += currentVal;

        lastIndex = m.index + m.length;
      }

      resultStr += targetStr.substring(lastIndex);
      el.textContent = resultStr;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = targetStr;
      }
    }

    requestAnimationFrame(update);
  }

  function initFlagshipEcosystemEngine() {
    let activeIndex = 0;
    let activeTab = 'modules'; // 'modules' or 'timeline'
    let autoPlayTimer = null;
    let isAutoPlaying = false;

    const dockContainer = document.getElementById('ecosystemDock');
    const badgeEl = document.getElementById('ecoNodeBadge');
    const titleEl = document.getElementById('ecoTitle');
    const taglineEl = document.getElementById('ecoTagline');
    const descEl = document.getElementById('ecoDesc');
    const metricsGrid = document.getElementById('ecoMetricsGrid');
    const ctaBtn = document.getElementById('ecoCtaBtn');
    const prevBtn = document.getElementById('ecoPrevBtn');
    const nextBtn = document.getElementById('ecoNextBtn');
    const autoBtn = document.getElementById('ecoAutoBtn');
    const tabModules = document.getElementById('ecoTabModules');
    const tabTimeline = document.getElementById('ecoTabTimeline');
    const modulesCanvas = document.getElementById('ecoModulesCanvas');
    const timelineCanvas = document.getElementById('ecoTimelineCanvas');
    const nodeCountEl = document.getElementById('ecoNodeCount');
    const graphFlow = document.getElementById('ecoGraphFlow');

    if (!dockContainer) return;

    // Render Topology Dock Node Pills
    function renderTopologyDock() {
      dockContainer.innerHTML = servicesData.map((item, idx) => `
        <div class="topology-node-pill ${idx === activeIndex ? 'active' : ''}" data-index="${idx}">
          <span class="node-title">${item.title}</span>
        </div>
      `).join('');

      dockContainer.querySelectorAll('.topology-node-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          const idx = parseInt(pill.getAttribute('data-index'), 10);
          if (activeIndex !== idx) {
            activeIndex = idx;
            updateEcosystemStage();
          }
        });
      });
    }

    // Update Main Stage Content
    function updateEcosystemStage() {
      const current = servicesData[activeIndex];

      // Update Dock Active States
      dockContainer.querySelectorAll('.topology-node-pill').forEach((pill, idx) => {
        pill.classList.toggle('active', idx === activeIndex);
      });

      // Update Graph Flow Nodes
      if (graphFlow) {
        graphFlow.querySelectorAll('.graph-node').forEach((node, idx) => {
          node.classList.toggle('active', idx === activeIndex);
        });
      }

      if (badgeEl) badgeEl.textContent = current.badge;
      if (titleEl) titleEl.textContent = current.stageTitle || current.title;
      if (taglineEl) taglineEl.textContent = current.tagline;
      if (descEl) descEl.textContent = current.desc;
      if (ctaBtn) ctaBtn.innerHTML = `Explore ${current.title} Capability &nearr;`;
      if (nodeCountEl) nodeCountEl.textContent = `${current.deliverables.length} MODULES LINKED`;

      // Render Telemetry Stat Cards with Running Animated Counters
      if (metricsGrid) {
        metricsGrid.innerHTML = current.metrics.map((m, i) => `
          <div class="telemetry-stat-card">
            <span class="stat-value" id="ecoStatVal_${i}">0</span>
            <span class="stat-label">${m.label}</span>
          </div>
        `).join('');

        current.metrics.forEach((m, i) => {
          const valEl = document.getElementById(`ecoStatVal_${i}`);
          if (valEl) animateCounter(valEl, m.value, 850);
        });
      }

      // Render Deliverables Tech Modules
      if (modulesCanvas) {
        modulesCanvas.innerHTML = current.deliverables.map(deliv => `
          <div class="module-node-card">
            <div class="module-node-head">
              <span class="module-node-icon">${deliv.icon}</span>
              ${deliv.name}
            </div>
            <p class="module-node-desc">${deliv.desc}</p>
          </div>
        `).join('');
      }

      // Render Execution Flow Timeline
      if (timelineCanvas) {
        timelineCanvas.innerHTML = current.process.map(step => `
          <div class="timeline-step-row">
            <span class="timeline-step-num">${step.num} / PHASE</span>
            <span class="timeline-step-name">${step.name}</span>
          </div>
        `).join('');
      }

      // Toggle Tab View
      if (activeTab === 'modules') {
        if (modulesCanvas) modulesCanvas.style.display = 'grid';
        if (timelineCanvas) timelineCanvas.style.display = 'none';
      } else {
        if (modulesCanvas) modulesCanvas.style.display = 'none';
        if (timelineCanvas) timelineCanvas.style.display = 'flex';
      }
    }

    // Handlers & Event Listeners
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        activeIndex = (activeIndex - 1 + servicesData.length) % servicesData.length;
        updateEcosystemStage();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        activeIndex = (activeIndex + 1) % servicesData.length;
        updateEcosystemStage();
      });
    }

    if (autoBtn) {
      autoBtn.addEventListener('click', () => {
        isAutoPlaying = !isAutoPlaying;
        if (isAutoPlaying) {
          autoBtn.classList.add('active');
          autoBtn.innerHTML = '&#x23F8;';
          autoPlayTimer = setInterval(() => {
            activeIndex = (activeIndex + 1) % servicesData.length;
            updateEcosystemStage();
          }, 4500);
        } else {
          autoBtn.classList.remove('active');
          autoBtn.innerHTML = '&#x25B6;';
          clearInterval(autoPlayTimer);
        }
      });
    }

    if (tabModules && tabTimeline) {
      tabModules.addEventListener('click', () => {
        activeTab = 'modules';
        tabModules.classList.add('active');
        tabTimeline.classList.remove('active');
        updateEcosystemStage();
      });

      tabTimeline.addEventListener('click', () => {
        activeTab = 'timeline';
        tabTimeline.classList.add('active');
        tabModules.classList.remove('active');
        updateEcosystemStage();
      });
    }

    // Initialize Dock and Stage
    renderTopologyDock();
    updateEcosystemStage();
  }

  // Initialize Flagship Ecosystem Engine
  initFlagshipEcosystemEngine();

  // ==========================================================================
  // FLAGSHIP REAL OUTCOMES DOCK SWITCHER LOGIC
  // ==========================================================================
  function initFlagshipOutcomesShowcase() {
    const dockPills = document.querySelectorAll('.outcome-dock-pill');
    const showcaseCards = document.querySelectorAll('.showcase-card');

    if (!dockPills.length || !showcaseCards.length) return;

    function animateSingleCounter(el) {
      if (!el || el.dataset.animating === 'true') return;
      const target = parseFloat(el.getAttribute('data-target'));
      if (isNaN(target)) return;

      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      const duration = 1200;
      const startTime = performance.now();
      el.dataset.animating = 'true';

      function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = easeProgress * target;

        el.textContent = `${prefix}${currentVal.toFixed(decimals)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
          el.dataset.animating = 'false';
        }
      }

      requestAnimationFrame(step);
    }

    function triggerCardCounters(cardElement) {
      if (!cardElement) return;
      const counters = cardElement.querySelectorAll('.anim-num');
      counters.forEach(c => animateSingleCounter(c));
    }

    function activateOutcome(outcomeId) {
      dockPills.forEach(pill => {
        const isTarget = pill.getAttribute('data-outcome') === String(outcomeId);
        pill.classList.toggle('active', isTarget);
      });

      showcaseCards.forEach(card => {
        const isTarget = card.id === `showcase${outcomeId}`;
        card.classList.toggle('active-card', isTarget);
        if (isTarget) {
          triggerCardCounters(card);
        }
      });

      // Update dynamic contextual strategic insight panels on left and right
      const insightItems = document.querySelectorAll('.insight-content');
      insightItems.forEach(item => {
        const isTarget = item.classList.contains(`insight-tab-${outcomeId}`);
        item.classList.toggle('active-insight', isTarget);
        if (isTarget) {
          item.classList.add('revealed');
          triggerCardCounters(item);
        }
      });
    }

    // Trigger initial active tab counters
    activateOutcome(1);

    // Observer for horizontal trust outcome metrics grid below
    const trustMetricsSection = document.querySelector('.showcase-trust-bar-section');
    if (trustMetricsSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.anim-num').forEach(c => animateSingleCounter(c));
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      observer.observe(trustMetricsSection);
    }

    dockPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const outcomeId = pill.getAttribute('data-outcome');
        activateOutcome(outcomeId);
      });
    });

    const viewport = document.getElementById('showcaseViewport');
    if (viewport) {
      viewport.addEventListener('mousemove', (e) => {
        const rect = viewport.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const tiltX = (y / rect.height) * -12;
        const tiltY = (x / rect.width) * 12;

        const activeCard = viewport.querySelector('.showcase-card.active-card');
        if (activeCard) {
          activeCard.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
        }
      });

      viewport.addEventListener('mouseleave', () => {
        const activeCard = viewport.querySelector('.showcase-card.active-card');
        if (activeCard) {
          activeCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        }
      });
    }

    let current = 1;
    setInterval(() => {
      current = (current % 3) + 1;
      activateOutcome(current);
    }, 7000);
  }

  initFlagshipOutcomesShowcase();

  // ==========================================================================
  // DIGITAL TWIN BUSINESS TRANSFORMATION INTERACTIVE SLIDER LOGIC
  // ==========================================================================
  function initDigitalTwinStage() {
    const wrapper = document.getElementById('twinCanvasWrapper');
    const panelAfter = document.getElementById('twinPanelAfter');
    const handle = document.getElementById('twinSliderHandle');
    const stepCards = document.querySelectorAll('.step-card');

    if (!wrapper || !panelAfter || !handle) return;

    let isDragging = false;

    function setSplitPercent(pct) {
      const clamped = Math.max(10, Math.min(90, pct));
      panelAfter.style.width = `${100 - clamped}%`;
      handle.style.left = `${clamped}%`;
    }

    function updateFromEvent(e) {
      const rect = wrapper.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const x = clientX - rect.left;
      const pct = (x / rect.width) * 100;
      setSplitPercent(pct);
    }

    wrapper.addEventListener('mousemove', (e) => {
      if (!isDragging) {
        updateFromEvent(e);
      }
    });

    handle.addEventListener('mousedown', () => { isDragging = true; });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => {
      if (isDragging) updateFromEvent(e);
    });

    wrapper.addEventListener('touchmove', (e) => {
      updateFromEvent(e);
    });

    // Timeline Step Card Hover Interactions
    stepCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        stepCards.forEach(c => c.classList.remove('active-step'));
        card.classList.add('active-step');
      });
    });
  }

  initDigitalTwinStage();

  // ==========================================================================
  // LIVE STUDIO TIMEZONE RADAR CLOCKS
  // ==========================================================================
  function updateStudioClocks() {
    const elBLR = document.getElementById('radarTimeBLR');
    const elLDN = document.getElementById('radarTimeLDN');
    const elSFO = document.getElementById('radarTimeSFO');

    if (!elBLR || !elLDN || !elSFO) return;

    const now = new Date();
    
    try {
      const timeBLR = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false });
      const timeLDN = now.toLocaleTimeString('en-US', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', hour12: false });
      const timeSFO = now.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit', hour12: false });

      elBLR.textContent = `${timeBLR} IST`;
      elLDN.textContent = `${timeLDN} GMT`;
      elSFO.textContent = `${timeSFO} PST`;
    } catch (err) {
      console.log('Clock update:', err);
    }
  }

  updateStudioClocks();
  setInterval(updateStudioClocks, 30000);

  // ==========================================================================
  // AWWWARDS-LEVEL KINETIC MOTION ENGINE, MAGNETIC 3D TILT & SCROLL OBSERVER
  // ==========================================================================

  // 1. SCROLL REVEAL INTERSECTION OBSERVER WITH STAGGERED ENTRANCES
  const revealElements = document.querySelectorAll(
    '.section-headline, .section-description, .manifesto-glass-card, .faq-split-wrapper, .showcase-trust-bar-section'
  );

  revealElements.forEach((el, index) => {
    el.classList.add('reveal-on-scroll');
    el.style.setProperty('--reveal-index', (index % 4).toString());
  });

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Trigger live number counter if contained inside
        const counterNums = entry.target.querySelectorAll('.anim-num');
        counterNums.forEach(num => {
          if (!num.dataset.counted) {
            triggerCardCounters(entry.target);
            num.dataset.counted = "true";
          }
        });
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => scrollObserver.observe(el));

  // 2. MAGNETIC 3D PERSPECTIVE TILT INTERACTION
  const tiltCards = document.querySelectorAll('.manifesto-glass-card, .outcome-metric-card, .insight-content, .hero-browser-window, .hero-terminal-window, .hero-mobile-frame');

  tiltCards.forEach(card => {
    card.classList.add('magnetic-tilt-target');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -6; // Max 6deg tilt
      const rotateY = ((x - centerX) / centerX) * 6;  // Max 6deg tilt

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // 3. DYNAMIC CURSOR RIPPLE ON BUTTON HOVER
  const interactiveBtns = document.querySelectorAll('.btn-primary-hero, .outcome-dock-pill, .eco-nav-btn');
  
  interactiveBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      btn.style.setProperty('--mouse-x', `${x}px`);
      btn.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // Smooth Anchor Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================================================
  // CONNECT WITH ALPHA ROOS POPUP MODAL CONTROLLER
  // ==========================================================================
  function initAlphaRoosModal() {
    const modalBackdrop = document.getElementById('alphaRoosModal');
    const modalForm = document.getElementById('alphaRoosForm');
    const modalSuccess = document.getElementById('alphaModalSuccess');
    const closeBtn = document.getElementById('closeAlphaModal');
    const doneBtn = document.getElementById('doneAlphaModal');

    if (!modalBackdrop || !modalForm || !closeBtn) return;

    function openModal() {
      modalBackdrop.classList.add('active');
      modalBackdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modalBackdrop.classList.remove('active');
      modalBackdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      
      setTimeout(() => {
        modalForm.style.display = 'flex';
        if (modalSuccess) modalSuccess.style.display = 'none';
        modalForm.reset();
      }, 400);
    }

    // Attach trigger event listeners to ALL Connect / Partner buttons across the page
    const ctaBtns = document.querySelectorAll('.nav-btn-black, .btn-primary-hero, .dock-btn');
    ctaBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });

    closeBtn.addEventListener('click', closeModal);
    if (doneBtn) doneBtn.addEventListener('click', closeModal);

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
        closeModal();
      }
    });

    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('modalFullName').value.trim();
      const workEmail = document.getElementById('modalWorkEmail').value.trim();
      const company = document.getElementById('modalCompany').value.trim();
      const serviceEl = document.getElementById('modalService');
      const service = serviceEl ? serviceEl.value : 'General Inquiry';
      const message = document.getElementById('modalMessage').value.trim();

      const mailSubject = encodeURIComponent(`New Inquiry: ${service} - ${company} (${fullName})`);
      const mailBody = encodeURIComponent(
        `Full Name: ${fullName}\n` +
        `Work Email: ${workEmail}\n` +
        `Company / Product: ${company}\n` +
        `Type of Service: ${service}\n\n` +
        `Project Vision & Goals:\n${message}\n\n` +
        `---\nSubmitted via Roos StudioX Executive Portal`
      );

      const mailtoUrl = `mailto:praveen@roosstudio.com?subject=${mailSubject}&body=${mailBody}`;

      // Trigger mail client to praveen@roosstudio.com
      window.location.href = mailtoUrl;

      // Show Instant Success Confirmation State inside Modal
      modalForm.style.display = 'none';
      if (modalSuccess) modalSuccess.style.display = 'flex';
    });
  }

  initAlphaRoosModal();

  // 3D INTERACTIVE GYRO PARALLAX TILT FOR HERO ROOS SVG
  function initHeroSvgParallax() {
    const heroSection = document.getElementById('hero');
    const heroRoosSvg = document.getElementById('heroRoosSvg');
    const heroAuraGlow = document.getElementById('heroAuraGlow');

    if (!heroSection || !heroRoosSvg) return;

    let targetRotX = 0, targetRotY = 0;
    let currentRotX = 0, currentRotY = 0;

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      targetRotX = (y / (rect.height / 2)) * -14;
      targetRotY = (x / (rect.width / 2)) * 14;
    });

    heroSection.addEventListener('mouseleave', () => {
      targetRotX = 0;
      targetRotY = 0;
    });

    function animateTilt() {
      currentRotX += (targetRotX - currentRotX) * 0.08;
      currentRotY += (targetRotY - currentRotY) * 0.08;

      if (heroRoosSvg) {
        heroRoosSvg.style.transform = `scale(1.45) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) translateZ(30px)`;
      }
      if (heroAuraGlow) {
        heroAuraGlow.style.transform = `translate(${(-currentRotY * 2).toFixed(2)}px, ${(currentRotX * 2).toFixed(2)}px) scale(1.05)`;
      }

      requestAnimationFrame(animateTilt);
    }

    animateTilt();
  }

  initHeroSvgParallax();

  // QUANTUM PARTICLES & CLICK SHOCKWAVE FOR HERO ROOS SVG
  function initHeroQuantumParticles() {
    const canvas = document.getElementById('heroParticlesCanvas');
    const heroRoosSvg = document.getElementById('heroRoosSvg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.offsetWidth || 500);
    let height = (canvas.height = canvas.offsetHeight || 600);

    const particles = [];
    const particleCount = 35;
    const colors = ['rgba(106, 44, 255, ', 'rgba(34, 217, 138, ', 'rgba(152, 108, 255, '];

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 2.5 + 1;
        this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.6 + 0.2;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.pulse = Math.random() * 0.05 + 0.01;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha += Math.sin(Date.now() * this.pulse) * 0.01;

        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${this.colorPrefix}${Math.max(0.1, Math.min(0.9, this.alpha))})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.colorPrefix + '0.8)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(renderParticles);
    }

    renderParticles();

    // Click Shockwave Burst Event
    if (heroRoosSvg) {
      heroRoosSvg.addEventListener('click', () => {
        heroRoosSvg.classList.add('shockwave-active');

        for (let i = 0; i < 20; i++) {
          const p = new Particle();
          p.x = width / 2;
          p.y = height / 2;
          p.vx = (Math.random() - 0.5) * 6;
          p.vy = (Math.random() - 0.5) * 6;
          p.radius = Math.random() * 4 + 2;
          particles.push(p);
        }

        setTimeout(() => {
          heroRoosSvg.classList.remove('shockwave-active');
          if (particles.length > particleCount) {
            particles.splice(particleCount);
          }
        }, 750);
      });
    }
  }

  initHeroQuantumParticles();
});

// FOOTER DISCIPLINE SWITCHER FUNCTION FOR OPTION C
const footerDisciplinesData = {
  1: {
    tag: "GROWTH ARCHITECTURE",
    title: "Brand Positioning & Market Research",
    desc: "Data-driven competitive research, positioning frameworks, and category messaging engineered for long-term enterprise valuation.",
    val: "3.2x",
    lbl: "Valuation Impact"
  },
  2: {
    tag: "DESIGN SYSTEMS",
    title: "Brand Identity & Spatial Motion Craft",
    desc: "Fluid 60 FPS motion design, design tokens, and scalable brand design systems that establish instant category authority.",
    val: "98.4%",
    lbl: "Brand Consistency"
  },
  3: {
    tag: "FULL-STACK ENGINEERING",
    title: "Web Platforms & Custom Software Architecture",
    desc: "Production Next.js/Vite engines with sub-85ms hydration SLAs, headless CMS integrations, and zero cumulative layout shift.",
    val: "<85ms",
    lbl: "Hydration Speed SLA"
  },
  4: {
    tag: "AUTONOMOUS OPERATIONS",
    title: "Custom AI Workflows & RAG Vector Agents",
    desc: "24/7 intelligent LLM agents, automated lead qualification, and custom CRM/ERP workflow automations that scale revenue.",
    val: "85%",
    lbl: "Overhead Saved"
  }
};

function switchFooterDiscipline(discId, btnElement) {
  const data = footerDisciplinesData[discId];
  if (!data) return;

  const tabs = document.querySelectorAll('.switcher-tab');
  tabs.forEach(t => t.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  const card = document.getElementById('footerDisciplineDisplay');
  if (card) {
    card.style.opacity = '0.5';
    card.style.transform = 'translateY(4px)';

    setTimeout(() => {
      document.getElementById('discTag').textContent = data.tag;
      document.getElementById('discTitle').textContent = data.title;
      document.getElementById('discDesc').textContent = data.desc;
      document.getElementById('discMetricVal').textContent = data.val;
      document.getElementById('discMetricLbl').textContent = data.lbl;

      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 150);
  }
}

// ==========================================================================
// 3-SECOND AUTO-SWAPPING HERO SERVICE CARD CAROUSEL CONTROLLER
// ==========================================================================
function initHeroCardSwapper() {
  const cards = document.querySelectorAll('.swap-card');
  const dots = document.querySelectorAll('.swap-dot');
  const briefText = document.getElementById('briefText');
  const progressFill = document.getElementById('cardSwapProgress');

  if (!cards.length || !briefText || !progressFill) return;

  const briefs = [
    "Define your market advantage before you build. Transform ambitious ideas into clear category leadership.",
    "Create iconic brands people remember. Build distinctive visual systems that command trust and premium pricing power.",
    "Craft intuitive digital journeys connecting brands with customers through award-winning design craft.",
    "Build fast, scalable web platforms engineered with enterprise code and sub-85ms hydration speeds.",
    "Work smarter and scale faster. Unlock 24/7 efficiency through custom AI agents and autonomous workflows.",
    "Turn market attention into enterprise revenue through data-driven acquisition and conversion engines.",
    "Reimagine how your business operates. Connect strategy, design, code, and AI into one scalable growth ecosystem."
  ];

  let currentIndex = 0;
  const intervalTime = 3000; // 3 Seconds exact cycle
  let startTime = performance.now();

  function showCard(index) {
    cards.forEach((card, i) => {
      if (i === index) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update Outside Brief with smooth cross-fade
    briefText.style.opacity = '0';
    briefText.style.transform = 'translateY(4px)';
    setTimeout(() => {
      briefText.textContent = briefs[index];
      briefText.style.opacity = '1';
      briefText.style.transform = 'translateY(0)';
    }, 180);
  }

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(100, (elapsed / intervalTime) * 100);
    progressFill.style.width = `${progress}%`;

    if (elapsed >= intervalTime) {
      currentIndex = (currentIndex + 1) % cards.length;
      showCard(currentIndex);
      startTime = performance.now();
    }

    requestAnimationFrame(tick);
  }

  // Click Dot selection
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      currentIndex = idx;
      showCard(currentIndex);
      startTime = performance.now();
    });
  });

  startTime = performance.now();
  showCard(0);
  requestAnimationFrame(tick);
}
