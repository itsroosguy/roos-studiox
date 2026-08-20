/* ==========================================================================
   ROOS STUDIOX — IMMERSIVE KANGAROO NEURAL NETWORK ENGINE (60FPS CANVAS)
   ========================================================================== */

(function () {
  'use strict';

  // SVG Path Data sampled directly from official Roos StudioX Kangaroo Mark
  const PATH_DATA_1 = "M207,272.38c1.75,5.62,1.9,11.31,2.38,16.89l-.09,8.8c-.14,13.96-3.88,27.11-9.05,40.16-15.51,39.22-49.92,67.59-92.51,76.53l7.03,7.48,16.07,16.26,19.46,19.57,23,23.11c5.29,5.31,4.85,17.4-.19,21.29l-41.14,31.77-31.46,24.52c-1.47.03-3.67-.15-4.38-.83-.82-.78-1.14-2.44-1-3.78l12.73-28.33,16.18-36.61-84.29-61.95-13.49-9.83-5.37-5.34c-4.93-6.17-5.58-14.18-3.28-21.66,4.86-15.78,20.45-22.36,35.13-28.62l-4.06-1.44c-10.87-3.86-21.19-8.85-29.05-17.23-8.23-8.77-13.66-18.82-16.76-30.44-8.26-30.94,2.01-64.84,23.68-88.47,17.21-18.77,40.48-30.89,65.83-34.58l7.89-.63,11.91.02c31.47,1.88,60.04,16.98,78.85,42.28,5.72-8.96,14.77-14.9,25.58-14.92l64.54-.12c2.18,0,4.25-1.32,4.94-2.76.92-1.91.41-4.34-.98-5.72l-6.26-6.17-18.38-18.54-19.52-19.55-11.25-11.29c-2.01-2.01-4.66-3.26-7.59-3.26h-25.92c-4.43,0-7.53-1.97-10.59-4.91l-8.93-8.56c-.19-.18-.35-.61-.4-1.14l50.92-.09c3,.6,6.15,1.05,8.24,3.13l13.64,13.61,18.14,18.31,18.11,18.33,11.95,12.25c5.54,5.68,5.35,15.35,1.31,22.09-3.26,5.44-9.41,9.18-15.99,9.21l-66.71.31c-5.71.03-10.74,4.54-13.35,9.04-2.1,3.62-2.25,7.65-3.02,11.45-.58,2.9-3.64,4.23-5.93,4.1-3-.17-4.99-1.7-6.25-4.37-3.61-7.63-9.09-13.79-14.73-20.09-4.73-5.28-10.05-9.3-16.02-13.39-14.14-9.68-30.81-14.52-48.18-15.14-21.88-.78-44.19,6.93-61.15,20.53-21.85,17.53-34.8,43.97-33.39,71.69.63,12.45,4.3,24.28,11.77,34.21,12.71,16.89,35.73,21.85,56.11,24.36,2.85.35,3.62,3.79,3.54,5.84-.11,3.03-2.05,4.27-4.97,5.3-11.75,4.16-23.05,8.99-34.03,14.84-7.86,4.18-16.27,9.98-15.88,18.66.2,4.44,2.61,7.21,5.91,9.63l35.31,25.87,47.67,35.07,13.71,9.94c5.02,3.64,5.86,9.29,3.48,14.81l-11.89,27.58c-.81.8-.21,1.21.69.77l37.03-27.94c.91-.68,1.14-3.77.34-4.59l-4.23-4.38-5.51-5.4-25.68-25.64-25.92-25.93-16.48-16.48c-.9-.9-.88-3.51-.25-4.59.56-.96,2.16-2.32,3.44-2.53l9.93-1.61c25.67-4.16,49.42-16.06,67.39-34.52,9.02-9.26,15.83-19.6,21.11-31.3,8.65-19.15,11.65-39.79,8.64-60.54-.48-3.29.98-6.32,3.77-7.39s7.08-.46,8.15,3Z";
  const PATH_DATA_2 = "M122.69,45.34l-15.72-15.64-.21,10.41.02,6.64-.06,30.47-.03,24.69c0,8.75,6.47,16.87,15.86,17.44l31.84.35c4.2.05,7.73,1.67,10.52,4.47l10.48,10.59-51.77.09c-15.93.03-28.67-10.64-31.21-26.26V3.52c0-1.49,1.93-2.81,2.95-3.21,1.34-.52,3.69-.45,4.8.63l4.72,4.61,18.69,18.78,23.85,23.92,25.9,25.92,15.07,15.31,19.03,18.95c.18.28.7.96.53,1.15l-1.11,1.27-18.77-.03-16.28-16.28-18.17-18.34-30.93-30.86Z";

  class RoosNeuralEngine {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');

      this.nodes = [];
      this.edges = [];
      this.dataParticles = [];

      // Mouse State & Parallax
      this.mouse = { x: -1000, y: -1000, active: false, targetX: 0, targetY: 0 };
      this.parallax = { x: 0, y: 0, targetX: 0, targetY: 0 };

      // Dimensions & Bounding
      this.width = 0;
      this.height = 0;
      this.dpr = window.devicePixelRatio || 1;

      // Color Palette
      this.colors = [
        '#FFFFFF', // Pure White
        '#E6F0FF', // Ice Blue
        '#3B82F6', // Electric Blue
        '#22D3EE'  // Cyan Accent
      ];

      this.init();
    }

    init() {
      this.resize();
      this.samplePointsFromSVG();
      this.buildConnections();
      this.initDataParticles(24);
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

      // Re-scale positions if nodes exist
      if (this.nodes.length > 0) {
        this.updateNodeTargetPositions();
      }
    }

    samplePointsFromSVG() {
      const rawPoints = [];
      const svgNS = "http://www.w3.org/2000/svg";

      const createSampledPath = (d, numSamples) => {
        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", d);
        const len = path.getTotalLength();
        if (len <= 0) return;

        for (let i = 0; i < numSamples; i++) {
          const pt = path.getPointAtLength((i / numSamples) * len);
          rawPoints.push({ x: pt.x, y: pt.y });
        }
      };

      // Sample 95 points along Path 1 and 35 along Path 2 (Total ~130 silhouette nodes)
      createSampledPath(PATH_DATA_1, 95);
      createSampledPath(PATH_DATA_2, 35);

      // Compute bounding box for normalization
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      rawPoints.forEach(p => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      });

      const bboxWidth = maxX - minX || 1;
      const bboxHeight = maxY - minY || 1;

      // Create normalized nodes [0..1] space + add 15 interior synapse nodes
      this.nodes = rawPoints.map((p, idx) => {
        const normX = (p.x - minX) / bboxWidth;
        const normY = (p.y - minY) / bboxHeight;

        return this.createNodeObject(normX, normY, idx);
      });

      // Add 16 interior neural bridge nodes
      for (let i = 0; i < 16; i++) {
        const p1 = rawPoints[Math.floor(Math.random() * rawPoints.length)];
        const p2 = rawPoints[Math.floor(Math.random() * rawPoints.length)];
        const t = 0.25 + Math.random() * 0.5;

        const normX = ((p1.x + (p2.x - p1.x) * t) - minX) / bboxWidth;
        const normY = ((p1.y + (p2.y - p1.y) * t) - minY) / bboxHeight;

        this.nodes.push(this.createNodeObject(normX, normY, this.nodes.length));
      }

      this.updateNodeTargetPositions();
    }

    createNodeObject(normX, normY, index) {
      const radius = 2.0 + Math.random() * 3.5;
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];

      return {
        id: index,
        normX,
        normY,
        baseX: 0,
        baseY: 0,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        radius,
        baseRadius: radius,
        color,
        baseAlpha: 0.35 + Math.random() * 0.55,
        alpha: 0.5,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        driftPhase: Math.random() * Math.PI * 2,
        driftSpeed: 0.008 + Math.random() * 0.012
      };
    }

    updateNodeTargetPositions() {
      // Fit Kangaroo logo snugly within visual container
      const paddingRatio = 0.15;
      const fitWidth = this.width * (1 - paddingRatio * 2);
      const fitHeight = this.height * (1 - paddingRatio * 2);

      // Maintain exact aspect ratio (~ 0.54 width/height ratio)
      const aspect = 301 / 558;
      let renderW = fitWidth;
      let renderH = renderW / aspect;

      if (renderH > fitHeight) {
        renderH = fitHeight;
        renderW = renderH * aspect;
      }

      const offsetX = (this.width - renderW) / 2;
      const offsetY = (this.height - renderH) / 2;

      this.nodes.forEach(node => {
        node.baseX = offsetX + node.normX * renderW;
        node.baseY = offsetY + node.normY * renderH;
        if (node.x === 0 && node.y === 0) {
          node.x = node.baseX;
          node.y = node.baseY;
        }
      });
    }

    buildConnections() {
      this.edges = [];
      const maxConnectDist = Math.min(this.width, this.height) * 0.18;

      for (let i = 0; i < this.nodes.length; i++) {
        let neighborCount = 0;
        for (let j = i + 1; j < this.nodes.length; j++) {
          const n1 = this.nodes[i];
          const n2 = this.nodes[j];
          const dx = n1.baseX - n2.baseX;
          const dy = n1.baseY - n2.baseY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Connect nearby nodes (max 4 connections per node to keep clean)
          if (dist < maxConnectDist && neighborCount < 4) {
            this.edges.push({
              source: n1,
              target: n2,
              dist,
              maxDist: maxConnectDist,
              energy: 0
            });
            neighborCount++;
          }
        }
      }
    }

    initDataParticles(count) {
      this.dataParticles = [];
      for (let i = 0; i < count; i++) {
        if (this.edges.length === 0) break;
        const edge = this.edges[Math.floor(Math.random() * this.edges.length)];
        this.dataParticles.push({
          edge,
          progress: Math.random(),
          speed: 0.006 + Math.random() * 0.012,
          radius: 1.8 + Math.random() * 1.5,
          color: Math.random() > 0.4 ? '#22D3EE' : '#FFFFFF'
        });
      }
    }

    addEventListeners() {
      window.addEventListener('resize', () => {
        this.resize();
        this.buildConnections();
      });

      const targetArea = this.canvas.parentElement || window;

      targetArea.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.targetX = e.clientX - rect.left;
        this.mouse.targetY = e.clientY - rect.top;
        this.mouse.active = true;

        // Subtle Parallax target
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        this.parallax.targetX = (e.clientX - centerX) * 0.04;
        this.parallax.targetY = (e.clientY - centerY) * 0.04;
      });

      targetArea.addEventListener('mouseleave', () => {
        this.mouse.active = false;
        this.mouse.targetX = -1000;
        this.mouse.targetY = -1000;
        this.parallax.targetX = 0;
        this.parallax.targetY = 0;
      });
    }

    update(time) {
      // Smooth Mouse & Parallax interpolation
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.1;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.1;

      this.parallax.x += (this.parallax.targetX - this.parallax.x) * 0.05;
      this.parallax.y += (this.parallax.targetY - this.parallax.y) * 0.05;

      // 10-15s Organic Network Breathing Wave
      const breathingScale = 1 + 0.025 * Math.sin(time * 0.0004);

      const centerX = this.width / 2;
      const centerY = this.height / 2;

      // Update Nodes
      this.nodes.forEach(node => {
        node.pulsePhase += node.pulseSpeed;
        node.driftPhase += node.driftSpeed;

        // Organic float drift
        const driftX = Math.cos(node.driftPhase) * 3.5;
        const driftY = Math.sin(node.driftPhase) * 3.5;

        // Apply breathing transformation around center
        const targetX = centerX + (node.baseX - centerX) * breathingScale + driftX;
        const targetY = centerY + (node.baseY - centerY) * breathingScale + driftY;

        // Mouse Attraction & Brightening
        let mouseDist = Infinity;
        if (this.mouse.active) {
          const mdx = node.x - this.mouse.x;
          const mdy = node.y - this.mouse.y;
          mouseDist = Math.sqrt(mdx * mdx + mdy * mdy);

          const maxMouseDist = 130;
          if (mouseDist < maxMouseDist) {
            const force = (1 - mouseDist / maxMouseDist) * 18;
            const angle = Math.atan2(mdy, mdx);
            node.vx -= Math.cos(angle) * force * 0.15;
            node.vy -= Math.sin(angle) * force * 0.15;
          }
        }

        // Spring physics back to targetX/Y
        node.vx += (targetX - node.x) * 0.06;
        node.vy += (targetY - node.y) * 0.06;
        node.vx *= 0.85;
        node.vy *= 0.85;

        node.x += node.vx;
        node.y += node.vy;

        // Node Glow Pulsing & Hover Brightening
        const pulse = (Math.sin(node.pulsePhase) + 1) * 0.5; // [0..1]
        node.alpha = node.baseAlpha + pulse * 0.3;

        if (mouseDist < 120) {
          const hoverFactor = 1 - mouseDist / 120;
          node.alpha = Math.min(1.0, node.alpha + hoverFactor * 0.5);
          node.radius = node.baseRadius * (1 + hoverFactor * 0.45);
        } else {
          node.radius += (node.baseRadius - node.radius) * 0.1;
        }
      });

      // Update Data Flow Particles
      this.dataParticles.forEach(particle => {
        particle.progress += particle.speed;
        if (particle.progress >= 1.0) {
          particle.progress = 0;
          // Jump to a new random edge
          if (this.edges.length > 0) {
            particle.edge = this.edges[Math.floor(Math.random() * this.edges.length)];
          }
        }
      });
    }

    render() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      this.ctx.save();
      // Apply Parallax Translation
      this.ctx.translate(this.parallax.x, this.parallax.y);

      // 1. Draw Synapse Connections (Lines)
      this.edges.forEach(edge => {
        const n1 = edge.source;
        const n2 = edge.target;
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > edge.maxDist * 1.3) return;

        const lineAlpha = (1 - dist / (edge.maxDist * 1.3)) * 0.25 * Math.min(n1.alpha, n2.alpha);

        this.ctx.beginPath();
        this.ctx.moveTo(n1.x, n1.y);
        this.ctx.lineTo(n2.x, n2.y);
        this.ctx.strokeStyle = `rgba(59, 130, 246, ${lineAlpha.toFixed(3)})`;
        this.ctx.lineWidth = 0.7;
        this.ctx.stroke();
      });

      // 2. Draw Data Flow Particles along Synapses
      this.dataParticles.forEach(p => {
        if (!p.edge) return;
        const n1 = p.edge.source;
        const n2 = p.edge.target;

        const px = n1.x + (n2.x - n1.x) * p.progress;
        const py = n1.y + (n2.y - n1.y) * p.progress;

        this.ctx.beginPath();
        this.ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.shadowColor = '#3B82F6';
        this.ctx.shadowBlur = 8;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
      });

      // 3. Draw Intelligent Glowing Nodes
      this.nodes.forEach(node => {
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

        // Soft Radial Glow Halo around nodes
        if (node.alpha > 0.6) {
          const glowGrad = this.ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 3.5);
          glowGrad.addColorStop(0, `rgba(59, 130, 246, ${node.alpha * 0.4})`);
          glowGrad.addColorStop(1, 'rgba(59, 130, 246, 0)');

          this.ctx.fillStyle = glowGrad;
          this.ctx.beginPath();
          this.ctx.arc(node.x, node.y, node.radius * 3.5, 0, Math.PI * 2);
          this.ctx.fill();
        }

        // Core Node Circle
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = node.color;
        this.ctx.globalAlpha = node.alpha;
        this.ctx.shadowColor = node.color;
        this.ctx.shadowBlur = node.radius * 2;
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

  // Initialize on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new RoosNeuralEngine('heroNeuralCanvas'));
  } else {
    new RoosNeuralEngine('heroNeuralCanvas');
  }

})();
