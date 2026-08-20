/* ==========================================================================
   ROOS STUDIOX — ENTERPRISE OPERATING SYSTEM VISUAL ENGINE (60FPS CANVAS)
   "Beyond Digital. Built for What's Next."
   ========================================================================== */

(function () {
  'use strict';

  // 7 Interconnected Architectural Business System Layers
  const SYSTEM_LAYERS = [
    { id: 7, name: "GROWTH INTELLIGENCE", code: "LAYER_07", metric: "+320% VALUATION LIFT", color: "#22D3EE" },
    { id: 6, name: "CUSTOMER JOURNEYS", code: "LAYER_06", metric: "REALTIME TELEMETRY", color: "#3B82F6" },
    { id: 5, name: "AI AUTOMATION", code: "LAYER_05", metric: "AUTONOMOUS PIPELINES", color: "#6366F1" },
    { id: 4, name: "DATA INFRASTRUCTURE", code: "LAYER_04", metric: "<85ms HYDRATION", color: "#818CF8" },
    { id: 3, name: "WEB EXPERIENCES", code: "LAYER_03", metric: "HIGH-CONVERTING ENGINE", color: "#A855F7" },
    { id: 2, name: "PRODUCT DESIGN", code: "LAYER_02", metric: "SPATIAL CRAFT", color: "#3B82F6" },
    { id: 1, name: "BRAND SYSTEMS", code: "LAYER_01", metric: "POSITIONING MATRIX", color: "#22D3EE" }
  ];

  class EnterpriseOSVisualEngine {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');

      this.width = 0;
      this.height = 0;
      this.dpr = window.devicePixelRatio || 1;

      this.mouse = { x: -1000, y: -1000, active: false, targetX: 0, targetY: 0 };
      this.parallax = { x: 0, y: 0, targetX: 0, targetY: 0 };
      this.activeLayerIndex = -1;

      this.dataParticles = [];
      this.nodes = [];
      this.pulses = [];

      this.time = 0;

      this.init();
    }

    init() {
      this.resize();
      this.buildArchitectureNodes();
      this.initDataParticles(48);
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

      this.buildArchitectureNodes();
    }

    buildArchitectureNodes() {
      this.nodes = [];
      const numLayers = SYSTEM_LAYERS.length;
      const startY = this.height * 0.15;
      const endY = this.height * 0.85;
      const stepY = (endY - startY) / (numLayers - 1);

      SYSTEM_LAYERS.forEach((layer, idx) => {
        const layerY = startY + idx * stepY;
        const width = this.width * 0.72;
        const leftX = (this.width - width) / 2;
        const rightX = leftX + width;

        // Create 5 telemetry nodes per layer
        const layerNodes = [];
        for (let n = 0; n < 5; n++) {
          const nx = leftX + (width / 4) * n;
          layerNodes.push({
            x: nx,
            y: layerY,
            baseX: nx,
            baseY: layerY,
            radius: n === 0 || n === 4 ? 3.5 : 2.5,
            layerId: layer.id,
            color: layer.color
          });
        }

        this.nodes.push({
          layer,
          layerY,
          leftX,
          rightX,
          width,
          nodes: layerNodes,
          hovered: false,
          alpha: 0.85
        });
      });
    }

    initDataParticles(count) {
      this.dataParticles = [];
      for (let i = 0; i < count; i++) {
        const fromLayerIdx = Math.floor(Math.random() * (SYSTEM_LAYERS.length - 1));
        const toLayerIdx = fromLayerIdx + 1;
        const colIdx = Math.floor(Math.random() * 5);

        this.dataParticles.push({
          fromLayerIdx,
          toLayerIdx,
          colIdx,
          progress: Math.random(),
          speed: 0.006 + Math.random() * 0.012,
          radius: 1.8 + Math.random() * 1.5,
          color: Math.random() > 0.4 ? '#22D3EE' : '#3B82F6'
        });
      }
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
        this.parallax.targetX = (e.clientX - centerX) * 0.03;
        this.parallax.targetY = (e.clientY - centerY) * 0.03;

        // Check hovered layer
        this.activeLayerIndex = -1;
        this.nodes.forEach((layerObj, idx) => {
          if (Math.abs(this.mouse.targetY - layerObj.layerY) < 28) {
            this.activeLayerIndex = idx;
          }
        });
      });

      targetArea.addEventListener('click', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.pulses.push({
          y: e.clientY - rect.top,
          radius: 0,
          maxRadius: this.width * 0.6,
          alpha: 1.0
        });
      });

      targetArea.addEventListener('mouseleave', () => {
        this.mouse.active = false;
        this.activeLayerIndex = -1;
        this.parallax.targetX = 0;
        this.parallax.targetY = 0;
      });
    }

    update(time) {
      this.time = time;
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.1;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.1;

      this.parallax.x += (this.parallax.targetX - this.parallax.x) * 0.05;
      this.parallax.y += (this.parallax.targetY - this.parallax.y) * 0.05;

      // Update Pulses
      for (let i = this.pulses.length - 1; i >= 0; i--) {
        const p = this.pulses[i];
        p.radius += 8;
        p.alpha *= 0.95;
        if (p.radius >= p.maxRadius || p.alpha <= 0.01) {
          this.pulses.splice(i, 1);
        }
      }

      // Update Data Particles Flow
      this.dataParticles.forEach(pt => {
        pt.progress += pt.speed;
        if (pt.progress >= 1.0) {
          pt.progress = 0;
          pt.fromLayerIdx = Math.floor(Math.random() * (SYSTEM_LAYERS.length - 1));
          pt.toLayerIdx = pt.fromLayerIdx + 1;
          pt.colIdx = Math.floor(Math.random() * 5);
        }
      });
    }

    render() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      this.ctx.save();
      this.ctx.translate(this.parallax.x, this.parallax.y);

      const centerX = this.width / 2;
      const centerY = this.height / 2;

      // 1. Draw Volumetric Atmospheric Light Column
      const atmosphereGrad = this.ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, Math.max(this.width, this.height) * 0.5);
      atmosphereGrad.addColorStop(0, 'rgba(59, 130, 246, 0.12)');
      atmosphereGrad.addColorStop(0.6, 'rgba(99, 102, 241, 0.05)');
      atmosphereGrad.addColorStop(1, 'rgba(10, 10, 10, 0)');
      this.ctx.fillStyle = atmosphereGrad;
      this.ctx.fillRect(0, 0, this.width, this.height);

      // 2. Draw 5 Vertical Data Highway Infrastructure Beams
      for (let col = 0; col < 5; col++) {
        const topNode = this.nodes[0].nodes[col];
        const bottomNode = this.nodes[this.nodes.length - 1].nodes[col];

        this.ctx.beginPath();
        this.ctx.moveTo(topNode.x, topNode.y);
        this.ctx.lineTo(bottomNode.x, bottomNode.y);
        this.ctx.strokeStyle = col === 2 ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.08)';
        this.ctx.lineWidth = col === 2 ? 1.5 : 0.8;
        this.ctx.setLineDash(col === 2 ? [] : [4, 8]);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
      }

      // 3. Draw 7 Architectural Business System Planes
      this.nodes.forEach((layerObj, idx) => {
        const isHovered = this.activeLayerIndex === idx;
        const layer = layerObj.layer;
        const y = layerObj.layerY;
        const leftX = layerObj.leftX;
        const rightX = layerObj.rightX;
        const width = layerObj.width;

        // Plane Glass Surface Gradient
        const planeGrad = this.ctx.createLinearGradient(leftX, y, rightX, y);
        if (isHovered) {
          planeGrad.addColorStop(0, 'rgba(59, 130, 246, 0.25)');
          planeGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.35)');
          planeGrad.addColorStop(1, 'rgba(34, 211, 238, 0.25)');
        } else {
          planeGrad.addColorStop(0, 'rgba(255, 255, 255, 0.03)');
          planeGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.08)');
          planeGrad.addColorStop(1, 'rgba(255, 255, 255, 0.03)');
        }

        // Render Holographic Glass Plane Base
        this.ctx.beginPath();
        this.ctx.moveTo(leftX, y);
        this.ctx.lineTo(rightX, y);
        this.ctx.strokeStyle = isHovered ? layer.color : 'rgba(255, 255, 255, 0.15)';
        this.ctx.lineWidth = isHovered ? 2 : 1;
        this.ctx.stroke();

        // Render Layer Label & Code Badge
        this.ctx.font = '600 11px "Poppins", sans-serif';
        this.ctx.fillStyle = isHovered ? layer.color : '#94A3B8';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`${layer.code} // ${layer.name}`, leftX, y - 8);

        // Render Telemetry Metric Badge (Right-aligned)
        this.ctx.textAlign = 'right';
        this.ctx.fillStyle = isHovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)';
        this.ctx.fillText(layer.metric, rightX, y - 8);

        // Render Telemetry Nodes along Plane
        layerObj.nodes.forEach(node => {
          this.ctx.beginPath();
          this.ctx.arc(node.x, node.y, isHovered ? node.radius * 1.4 : node.radius, 0, Math.PI * 2);
          this.ctx.fillStyle = isHovered ? layer.color : '#FFFFFF';
          this.ctx.globalAlpha = isHovered ? 1.0 : 0.6;
          this.ctx.shadowColor = layer.color;
          this.ctx.shadowBlur = isHovered ? 12 : 4;
          this.ctx.fill();
          this.ctx.globalAlpha = 1.0;
          this.ctx.shadowBlur = 0;
        });
      });

      // 4. Draw Traveling Data Particles between System Layers
      this.dataParticles.forEach(pt => {
        const fromNode = this.nodes[pt.fromLayerIdx].nodes[pt.colIdx];
        const toNode = this.nodes[pt.toLayerIdx].nodes[pt.colIdx];

        const px = fromNode.x + (toNode.x - fromNode.x) * pt.progress;
        const py = fromNode.y + (toNode.y - fromNode.y) * pt.progress;

        this.ctx.beginPath();
        this.ctx.arc(px, py, pt.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = pt.color;
        this.ctx.shadowColor = pt.color;
        this.ctx.shadowBlur = 8;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
      });

      // 5. Draw Quantum Ripple Waves
      this.pulses.forEach(p => {
        this.ctx.beginPath();
        this.ctx.arc(centerX, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(34, 211, 238, ${p.alpha.toFixed(3)})`;
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
      });

      this.ctx.restore();
    }

    loop(time) {
      this.update(time);
      this.render();
      requestAnimationFrame((t) => this.loop(t));
    }
  }

  // Initialize Enterprise OS Engine
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new EnterpriseOSVisualEngine('heroNeuralCanvas'));
  } else {
    new EnterpriseOSVisualEngine('heroNeuralCanvas');
  }

})();
