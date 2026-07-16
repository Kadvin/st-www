/**
 * Hive Particle Network Background
 * 在各 section 中渲染带连线的浮动粒子，营造科技/网络/连接感
 * 每个区域独立随机运动
 */
(function () {
  'use strict';

  // 配置不同区域的粒子样式
  var configs = [
    {
      selector: '.ud-hero',
      particleColor: 'rgba(255,255,255,0.35)',
      lineColor: 'rgba(255,255,255,0.12)',
      count: 40,
      maxDist: 120
    },
    {
      selector: '.ud-features',
      particleColor: 'rgba(150,160,180,0.3)',
      lineColor: 'rgba(150,160,180,0.08)',
      count: 30,
      maxDist: 110
    },
    {
      selector: '.ud-about',
      particleColor: 'rgba(120,130,150,0.25)',
      lineColor: 'rgba(120,130,150,0.07)',
      count: 25,
      maxDist: 100
    },
    {
      selector: '.ud-pricing',
      particleColor: 'rgba(255,255,255,0.3)',
      lineColor: 'rgba(255,255,255,0.1)',
      count: 30,
      maxDist: 110
    },
    {
      selector: '.ud-faq',
      particleColor: 'rgba(140,150,170,0.25)',
      lineColor: 'rgba(140,150,170,0.07)',
      count: 20,
      maxDist: 100
    },
    {
      selector: '.ud-contact',
      particleColor: 'rgba(130,140,160,0.2)',
      lineColor: 'rgba(130,140,160,0.06)',
      count: 20,
      maxDist: 90
    }
  ];

  function ParticleNetwork(container, config) {
    this.container = container;
    this.config = config;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'hive-particles-canvas';
    this.ctx = this.canvas.getContext('2d');
    this.container.style.position = this.container.style.position || 'relative';
    this.container.insertBefore(this.canvas, this.container.firstChild);
    this.particles = [];
    this.animId = null;
    this.resize();
    this.init();
    this.animate();

    var self = this;
    window.addEventListener('resize', function () {
      self.resize();
    });
  }

  ParticleNetwork.prototype.resize = function () {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  };

  ParticleNetwork.prototype.init = function () {
    this.particles = [];
    for (var i = 0; i < this.config.count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1
      });
    }
  };

  ParticleNetwork.prototype.animate = function () {
    var self = this;
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Update positions
    for (var i = 0; i < this.particles.length; i++) {
      var p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
      if (p.x < 0 || p.x > this.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.height) p.vy *= -1;

      // Keep in bounds
      p.x = Math.max(0, Math.min(this.width, p.x));
      p.y = Math.max(0, Math.min(this.height, p.y));

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = this.config.particleColor;
      this.ctx.fill();
    }

    // Draw lines between nearby particles
    for (var i = 0; i < this.particles.length; i++) {
      for (var j = i + 1; j < this.particles.length; j++) {
        var dx = this.particles[i].x - this.particles[j].x;
        var dy = this.particles[i].y - this.particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.config.maxDist) {
          var opacity = 1 - dist / this.config.maxDist;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = this.config.lineColor.replace(/[\d.]+\)$/, (opacity * parseFloat(this.config.lineColor.match(/[\d.]+\)$/)[0])) + ')');
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
    }

    this.animId = requestAnimationFrame(function () {
      self.animate();
    });
  };

  // Initialize when DOM is ready
  function initAll() {
    for (var i = 0; i < configs.length; i++) {
      var el = document.querySelector(configs[i].selector);
      if (el) {
        new ParticleNetwork(el, configs[i]);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
