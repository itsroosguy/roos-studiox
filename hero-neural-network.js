/* ==========================================================================
   ROOS STUDIOX — CINEMATIC BUSINESS EVOLUTION MATRIX (60FPS CANVAS)
   "Complexity → Clarity | Fragmentation → Integration"
   ========================================================================== */

(function () {
  'use strict';

  class BusinessEvolutionEngine {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');

      this.width = 0;
      this.height = 0;
      this.dpr = window.devicePixelRatio || 1;

      // Mouse State & Parallax
      this.mouse = { x: -1000, y: -1000, active: false, targetX: 0, targetY: 0 };
      this.parallax = { x: 0, y: 0, targetX: 0, targetY: 0 };

      // Particles & System Architecture
      this.particles = [];
      this.highways = [];
      this.shockwaves = [];

      this.time = 0;

      this.init();
    }

    init() {
      this.resize();
      this.initHighways(8);
      this.initParticles(240);
      this.addEventListeners();
      this.loop(0);
    }

    resize() {
      const parent = this.canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      this.width = rect.width;
      this.height = rect.height;

      this.canvas.width = this.width * this.dpr;
      this.canvas.height = this.height * this.dpr;
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;

      this.ctx.scale(this.dpr, this.dpr);

      this.initHighways(8);
    }

    initHighways(count) {
      this.highways = [];
      const startY = this.height * 0.18;
      const endY = this.height * 0.82;
      const stepY = (endY - startY) / (count - 1);

      for (let i = 0; i < count; i++) {
        this.highways.push({
          y: startY + i * stepY,
          color: i % 2 === 0 ? '#3B82F6' : '#22D3EE',
          opacity: 0.15 + (i / count) * 0.15
        });
      }
    }

    initParticles(count) {
      this.particles = [];
      for (let i = 0; i < count; i++) {
        this.particles.push(this.createParticle());
      }
    }

    createParticle() {
      // 50% spawn on left (fragmented chaos), 50% mid-stream
      const isLeft = Math.random() > 0.3;
      const x = isLeft ? Math.random() * (this.width * 0.35) : Math.random() * this.width;
      const y = Math.random() * this.height;

      return {
        x,
        y,
        vx: 0.8 + Math.random() * 1.8,
        vy: (Math.random() - 0.5) * 1.2,
        radius: 1.2 + Math.random() * 2.8,
        highwayIdx: Math.floor(Math.random() * 8),
        stage: x < this.width * 0.35 ? 'fragmented' : 'unified',
        color: '#FFFFFF',
        alpha: 0.2 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2
      };
    }

    addEventListeners() {
      window.addEventListener('resize', () => this.resize());

      const targetArea = this.canvas.parentElement || window;

      targetArea.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.targetX = e.clientX - rect.left;
        this.mouse.targetY = e.clientY - rect.top;
        this.mouse.active = true;

        const centerX = this.width / 2;
        const centerY = this.height / 2;
        this.parallax.targetX = (e.clientX - centerX) * 0.035;
        this.parallax.targetY = (e.clientY - centerY) * 0.035;
      });

      targetArea.addEventListener('click', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.shockwaves.push({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          radius: 10,
          maxRadius: Math.max(this.width, this.height) * 0.5,
          alpha: 1.0
        });
      });

      targetArea.addEventListener('mouseleave', () => {
        this.mouse.active = false;
        this.parallax.targetX = 0;
        this.parallax.targetY = 0;
      });
    }

    update(time) {
      this.time = time;

      // Mouse Physics
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.1;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.1;

      this.parallax.x += (this.parallax.targetX - this.parallax.x) * 0.05;
      this.parallax.y += (this.parallax.targetY - this.parallax.y) * 0.05;

      const lensX = this.width * 0.42 + (this.mouse.active ? (this.mouse.x - this.width * 0.42) * 0.15 : 0);
      const lensY = this.height * 0.5 + (this.mouse.active ? (this.mouse.y - this.height * 0.5) * 0.15 : 0);

      // Update Shockwaves
      for (let i = this.shockwaves.length - 1; i >= 0; i--) {
        const s = this.shockwaves[i];
        s.radius += 9;
        s.alpha *= 0.95;
        if (s.radius >= s.maxRadius || s.alpha <= 0.01) {
          this.shockwaves.splice(i, 1);
        }
      }

      // Update Particles Evolution Flow
      this.particles.forEach(p => {
        p.phase += 0.02;

        // Stage 1: Left Fragmented Chaos (x < lensX - 80)
        if (p.x < lensX - 80) {
          p.stage = 'fragmented';
          p.color = 'rgba(255, 255, 255, 0.4)';
          p.vy += (Math.random() - 0.5) * 0.2;
          p.x += p.vx * 0.8;
          p.y += p.vy;

          // Pull towards central intelligence lens
          const dx = lensX - p.x;
          const dy = lensY - p.y;
          p.vy += (dy / Math.max(1, dx)) * 0.08;

        } else if (p.x >= lensX - 80 && p.x <= lensX + 80) {
          // Stage 2: Central Intelligence Lens Acceleration
          p.stage = 'transforming';
          p.color = '#22D3EE';
          p.alpha = 0.9;
          p.vx += 0.12; // Acceleration boost

          // Align Y to assigned highway Y
          const targetHwY = this.highways[p.highwayIdx].y;
          p.y += (targetHwY - p.y) * 0.12;
          p.x += p.vx;

        } else {
          // Stage 3: Right Unified Crystal Ecosystem (x > lensX + 80)
          p.stage = 'unified';
          const targetHwY = this.highways[p.highwayIdx].y;
          p.y += (targetHwY - p.y) * 0.18; // Snap to highway track
          p.color = p.highwayIdx % 2 === 0 ? '#3B82F6' : '#6366F1';
          p.x += p.vx * 1.3;
          p.alpha = 0.75 + 0.25 * Math.sin(p.phase);
        }

        // Check Shockwave Impact
        this.shockwaves.forEach(s => {
          const sdx = p.x - s.x;
          const sdy = p.y - s.y;
          const sdist = Math.sqrt(sdx * sdx + sdy * sdy);
          if (Math.abs(sdist - s.radius) < 35) {
            p.vx += 1.5;
            p.alpha = 1.0;
          }
        });

        // Respawn when particle exits right boundary
        if (p.x > this.width + 40) {
          p.x = -20;
          p.y = Math.random() * this.height;
          p.vx = 0.8 + Math.random() * 1.8;
          p.vy = (Math.random() - 0.5) * 1.2;
          p.highwayIdx = Math.floor(Math.random() * 8);
          p.stage = 'fragmented';
        }
      });
    }

    render() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      this.ctx.save();
      this.ctx.translate(this.parallax.x, this.parallax.y);

      const lensX = this.width * 0.42 + (this.mouse.active ? (this.mouse.x - this.width * 0.42) * 0.15 : 0);
      const lensY = this.height * 0.5 + (this.mouse.active ? (this.mouse.y - this.height * 0.5) * 0.15 : 0);

      // 1. Draw Volumetric Anamorphic Intelligence Glow Lens (Center)
      const lensGrad = this.ctx.createRadialGradient(lensX, lensY, 10, lensX, lensY, Math.min(this.width, this.height) * 0.4);
      lensGrad.addColorStop(0, 'rgba(59, 130, 246, 0.28)');
      lensGrad.addColorStop(0.4, 'rgba(99, 102, 241, 0.12)');
      lensGrad.addColorStop(0.8, 'rgba(34, 211, 238, 0.04)');
      lensGrad.addColorStop(1, 'rgba(6, 8, 13, 0)');

      this.ctx.fillStyle = lensGrad;
      this.ctx.fillRect(0, 0, this.width, this.height);

      // 2. Draw Anamorphic Volumetric Light Beam Line across Center Lens
      const beamGrad = this.ctx.createLinearGradient(lensX - 180, lensY, lensX + 180, lensY);
      beamGrad.addColorStop(0, 'rgba(59, 130, 246, 0)');
      beamGrad.addColorStop(0.5, 'rgba(34, 211, 238, 0.45)');
      beamGrad.addColorStop(1, 'rgba(99, 102, 241, 0)');

      this.ctx.beginPath();
      this.ctx.moveTo(lensX - 220, lensY);
      this.ctx.lineTo(lensX + 220, lensY);
      this.ctx.strokeStyle = beamGrad;
      this.ctx.lineWidth = 2.5;
      this.ctx.stroke();

      // 3. Draw Right Side 8 Unified Crystal Energy Highways
      this.highways.forEach((hw, idx) => {
        const hwGrad = this.ctx.createLinearGradient(lensX, hw.y, this.width, hw.y);
        hwGrad.addColorStop(0, 'rgba(59, 130, 246, 0.05)');
        hwGrad.addColorStop(0.3, hw.color);
        hwGrad.addColorStop(1, 'rgba(59, 130, 246, 0.02)');

        this.ctx.beginPath();
        this.ctx.moveTo(lensX + 60, hw.y);
        this.ctx.lineTo(this.width, hw.y);
        this.ctx.strokeStyle = hwGrad;
        this.ctx.globalAlpha = hw.opacity;
        this.ctx.lineWidth = idx % 2 === 0 ? 1.2 : 0.8;
        this.ctx.stroke();
        this.ctx.globalAlpha = 1.0;

        // Vertical Synapse Bridges linking highways
        if (idx < this.highways.length - 1) {
          const nextHw = this.highways[idx + 1];
          const bridgeX = lensX + 180 + idx * 60;
          this.ctx.beginPath();
          this.ctx.moveTo(bridgeX, hw.y);
          this.ctx.lineTo(bridgeX, nextHw.y);
          this.ctx.strokeStyle = 'rgba(59, 130, 246, 0.12)';
          this.ctx.setLineDash([3, 6]);
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
          this.ctx.setLineDash([]);
        }
      });

      // 4. Draw Click Shockwave Ripples
      this.shockwaves.forEach(s => {
        this.ctx.beginPath();
        this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(34, 211, 238, ${s.alpha.toFixed(3)})`;
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
      });

      // 5. Draw Evolving Flow Particles
      this.particles.forEach(p => {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.alpha;

        if (p.stage === 'transforming' || p.stage === 'unified') {
          this.ctx.shadowColor = p.color;
          this.ctx.shadowBlur = p.stage === 'transforming' ? 12 : 6;
        }

        this.ctx.fill();
        this.ctx.globalAlpha = 1.0;
        this.ctx.shadowBlur = 0;
      });

      this.ctx.restore();
    }

    loop(time) {
      this.update(time);
      this.render();
      requestAnimationFrame((t) => this.loop(t));
    }
  }

  // Initialize Business Evolution Engine
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new BusinessEvolutionEngine('heroNeuralCanvas'));
  } else {
    new BusinessEvolutionEngine('heroNeuralCanvas');
  }

})();
