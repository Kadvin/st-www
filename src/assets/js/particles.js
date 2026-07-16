/**
 * Hive Background Animations
 * 第一区（Hero）：星空粒子，只有点没有线
 * 其他区：几何多边形线条，有角度/结构变化，代表变化与演进
 */
(function () {
  'use strict';

  // ========== 星空粒子（Hero 区） ==========
  function StarField(container) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'hive-particles-canvas';
    this.ctx = this.canvas.getContext('2d');
    this.container.insertBefore(this.canvas, this.container.firstChild);
    this.stars = [];
    this.resize();
    this.init();
    this.animate();

    var self = this;
    window.addEventListener('resize', function () { self.resize(); self.init(); });
  }

  StarField.prototype.resize = function () {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  };

  StarField.prototype.init = function () {
    this.stars = [];
    var count = Math.floor(this.width * this.height / 8000);
    for (var i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }
  };

  StarField.prototype.animate = function () {
    var self = this;
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (var i = 0; i < this.stars.length; i++) {
      var s = this.stars[i];
      s.twinklePhase += s.twinkleSpeed;
      var alpha = s.alpha * (0.6 + 0.4 * Math.sin(s.twinklePhase));

      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255,255,255,' + alpha + ')';
      this.ctx.fill();
    }

    requestAnimationFrame(function () { self.animate(); });
  };

  // ========== 几何多边形（其他区域） ==========
  function GeoShapes(container, config) {
    this.container = container;
    this.config = config;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'hive-particles-canvas';
    this.ctx = this.canvas.getContext('2d');
    this.container.insertBefore(this.canvas, this.container.firstChild);
    this.shapes = [];
    this.resize();
    this.init();
    this.animate();

    var self = this;
    window.addEventListener('resize', function () { self.resize(); });
  }

  GeoShapes.prototype.resize = function () {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  };

  GeoShapes.prototype.init = function () {
    this.shapes = [];
    for (var i = 0; i < this.config.count; i++) {
      var sides = Math.floor(Math.random() * 4) + 3; // 3~6 边形
      this.shapes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 40 + 20,
        sides: sides,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.008,
        alpha: Math.random() * 0.15 + 0.05,
        // 形变：让多边形随时间微变
        morphPhase: Math.random() * Math.PI * 2,
        morphSpeed: Math.random() * 0.01 + 0.003
      });
    }
  };

  GeoShapes.prototype.drawPolygon = function (shape) {
    var ctx = this.ctx;
    var morph = Math.sin(shape.morphPhase) * 0.2; // ±20% 形变

    ctx.beginPath();
    for (var i = 0; i <= shape.sides; i++) {
      var angle = shape.rotation + (i / shape.sides) * Math.PI * 2;
      // 交替顶点有不同半径，产生不规则多边形
      var radiusFactor = (i % 2 === 0) ? 1 + morph : 1 - morph * 0.5;
      var r = shape.size * radiusFactor;
      var px = shape.x + Math.cos(angle) * r;
      var py = shape.y + Math.sin(angle) * r;
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.strokeStyle = this.config.strokeColor.replace('ALPHA', shape.alpha.toFixed(3));
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  GeoShapes.prototype.animate = function () {
    var self = this;
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (var i = 0; i < this.shapes.length; i++) {
      var s = this.shapes[i];

      // 移动
      s.x += s.vx;
      s.y += s.vy;

      // 边界反弹（留出余量）
      if (s.x < -s.size) s.x = this.width + s.size;
      if (s.x > this.width + s.size) s.x = -s.size;
      if (s.y < -s.size) s.y = this.height + s.size;
      if (s.y > this.height + s.size) s.y = -s.size;

      // 旋转
      s.rotation += s.rotationSpeed;

      // 形变
      s.morphPhase += s.morphSpeed;

      this.drawPolygon(s);
    }

    // 绘制部分连线（相邻形状之间）
    for (var i = 0; i < this.shapes.length - 1; i++) {
      var a = this.shapes[i];
      var b = this.shapes[i + 1];
      var dx = a.x - b.x;
      var dy = a.y - b.y;
      var dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.config.linkDist) {
        var opacity = (1 - dist / this.config.linkDist) * 0.08;
        this.ctx.beginPath();
        this.ctx.moveTo(a.x, a.y);
        this.ctx.lineTo(b.x, b.y);
        this.ctx.strokeStyle = this.config.strokeColor.replace('ALPHA', opacity.toFixed(3));
        this.ctx.lineWidth = 0.6;
        this.ctx.stroke();
      }
    }

    requestAnimationFrame(function () { self.animate(); });
  };

  // ========== 配置与初始化 ==========
  var geoConfigs = [
    {
      selector: '.ud-features',
      strokeColor: 'rgba(100,116,139,ALPHA)',
      count: 12,
      linkDist: 200
    },
    {
      selector: '.ud-about',
      strokeColor: 'rgba(80,100,130,ALPHA)',
      count: 10,
      linkDist: 180
    },
    {
      selector: '.ud-pricing',
      strokeColor: 'rgba(255,255,255,ALPHA)',
      count: 12,
      linkDist: 200
    },
    {
      selector: '.ud-faq',
      strokeColor: 'rgba(90,110,140,ALPHA)',
      count: 8,
      linkDist: 160
    },
    {
      selector: '.ud-contact',
      strokeColor: 'rgba(80,100,120,ALPHA)',
      count: 8,
      linkDist: 150
    }
  ];

  function initAll() {
    // Hero 星空
    var hero = document.querySelector('.ud-hero');
    if (hero) new StarField(hero);

    // 其他区域几何多边形
    for (var i = 0; i < geoConfigs.length; i++) {
      var el = document.querySelector(geoConfigs[i].selector);
      if (el) new GeoShapes(el, geoConfigs[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
