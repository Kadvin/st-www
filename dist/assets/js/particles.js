/**
 * Hive Background Animations
 * Hero 区：星空粒子闪烁
 * 其他区：大尺寸三角形/四边形，角对角固定长度连线，缓慢漂移+旋转
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

  // ========== 几何形状（其他区域） ==========
  function GeoNetwork(container, config) {
    this.container = container;
    this.config = config;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'hive-particles-canvas';
    this.ctx = this.canvas.getContext('2d');
    this.container.insertBefore(this.canvas, this.container.firstChild);
    this.shapes = [];
    this.links = [];
    this.resize();
    this.init();
    this.animate();

    var self = this;
    window.addEventListener('resize', function () { self.resize(); });
  }

  GeoNetwork.prototype.resize = function () {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  };

  GeoNetwork.prototype.init = function () {
    this.shapes = [];
    this.links = [];

    var count = this.config.count;
    var cellCols = Math.ceil(Math.sqrt(count * this.width / this.height));
    var cellRows = Math.ceil(count / cellCols);
    var cellW = this.width / cellCols;
    var cellH = this.height / cellRows;

    // 在网格中放置形状，确保不重叠
    var idx = 0;
    for (var row = 0; row < cellRows && idx < count; row++) {
      for (var col = 0; col < cellCols && idx < count; col++) {
        var cx = cellW * col + cellW * (0.2 + Math.random() * 0.6);
        var cy = cellH * row + cellH * (0.2 + Math.random() * 0.6);
        var sides = Math.random() < 0.5 ? 3 : 4; // 三角形或四边形
        var size = 80 + Math.random() * 60; // 80~140px

        this.shapes.push({
          x: cx,
          y: cy,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.12,
          size: size,
          sides: sides,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.003,
          alpha: this.config.shapeAlpha
        });
        idx++;
      }
    }

    // 建立固定连线：每个形状与最近的 1~2 个形状连线（角对角）
    for (var i = 0; i < this.shapes.length; i++) {
      var nearest = this.findNearest(i, 2);
      for (var n = 0; n < nearest.length; n++) {
        var j = nearest[n];
        // 避免重复连线
        if (j > i) {
          this.links.push({ a: i, b: j });
        }
      }
    }
  };

  GeoNetwork.prototype.findNearest = function (idx, count) {
    var dists = [];
    for (var i = 0; i < this.shapes.length; i++) {
      if (i === idx) continue;
      var dx = this.shapes[idx].x - this.shapes[i].x;
      var dy = this.shapes[idx].y - this.shapes[i].y;
      dists.push({ idx: i, dist: Math.sqrt(dx * dx + dy * dy) });
    }
    dists.sort(function (a, b) { return a.dist - b.dist; });
    var result = [];
    for (var i = 0; i < Math.min(count, dists.length); i++) {
      result.push(dists[i].idx);
    }
    return result;
  };

  GeoNetwork.prototype.getVertices = function (shape) {
    var verts = [];
    for (var i = 0; i < shape.sides; i++) {
      var angle = shape.rotation + (i / shape.sides) * Math.PI * 2;
      verts.push({
        x: shape.x + Math.cos(angle) * shape.size,
        y: shape.y + Math.sin(angle) * shape.size
      });
    }
    return verts;
  };

  GeoNetwork.prototype.drawShape = function (shape) {
    var ctx = this.ctx;
    var verts = this.getVertices(shape);

    ctx.beginPath();
    ctx.moveTo(verts[0].x, verts[0].y);
    for (var i = 1; i < verts.length; i++) {
      ctx.lineTo(verts[i].x, verts[i].y);
    }
    ctx.closePath();
    ctx.strokeStyle = this.config.strokeColor.replace('ALPHA', shape.alpha.toFixed(3));
    ctx.lineWidth = 1.2;
    ctx.stroke();
  };

  GeoNetwork.prototype.drawLink = function (link) {
    var a = this.shapes[link.a];
    var b = this.shapes[link.b];
    var vertsA = this.getVertices(a);
    var vertsB = this.getVertices(b);

    // 找到两个形状之间最近的一对顶点（角对角连线）
    var minDist = Infinity;
    var pa, pb;
    for (var i = 0; i < vertsA.length; i++) {
      for (var j = 0; j < vertsB.length; j++) {
        var dx = vertsA[i].x - vertsB[j].x;
        var dy = vertsA[i].y - vertsB[j].y;
        var d = dx * dx + dy * dy;
        if (d < minDist) {
          minDist = d;
          pa = vertsA[i];
          pb = vertsB[j];
        }
      }
    }

    if (pa && pb) {
      this.ctx.beginPath();
      this.ctx.moveTo(pa.x, pa.y);
      this.ctx.lineTo(pb.x, pb.y);
      this.ctx.strokeStyle = this.config.strokeColor.replace('ALPHA', (this.config.shapeAlpha * 0.6).toFixed(3));
      this.ctx.lineWidth = 0.8;
      this.ctx.stroke();
    }
  };

  GeoNetwork.prototype.animate = function () {
    var self = this;
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 更新位置和旋转
    for (var i = 0; i < this.shapes.length; i++) {
      var s = this.shapes[i];
      s.x += s.vx;
      s.y += s.vy;
      s.rotation += s.rotationSpeed;

      // 柔和边界反弹
      var margin = s.size;
      if (s.x < margin || s.x > this.width - margin) s.vx *= -1;
      if (s.y < margin || s.y > this.height - margin) s.vy *= -1;
      s.x = Math.max(margin, Math.min(this.width - margin, s.x));
      s.y = Math.max(margin, Math.min(this.height - margin, s.y));
    }

    // 绘制连线（先画线，再画形状，形状在上层）
    for (var i = 0; i < this.links.length; i++) {
      this.drawLink(this.links[i]);
    }

    // 绘制形状
    for (var i = 0; i < this.shapes.length; i++) {
      this.drawShape(this.shapes[i]);
    }

    requestAnimationFrame(function () { self.animate(); });
  };

  // ========== 配置与初始化 ==========
  var geoConfigs = [
    {
      selector: '.ud-features',
      strokeColor: 'rgba(100,116,139,ALPHA)',
      shapeAlpha: 0.15,
      count: 8
    },
    {
      selector: '.ud-about',
      strokeColor: 'rgba(80,100,130,ALPHA)',
      shapeAlpha: 0.12,
      count: 6
    },
    {
      selector: '.ud-pricing',
      strokeColor: 'rgba(255,255,255,ALPHA)',
      shapeAlpha: 0.12,
      count: 7
    },
    {
      selector: '.ud-faq',
      strokeColor: 'rgba(90,110,140,ALPHA)',
      shapeAlpha: 0.1,
      count: 5
    },
    {
      selector: '.ud-contact',
      strokeColor: 'rgba(80,100,120,ALPHA)',
      shapeAlpha: 0.1,
      count: 5
    }
  ];

  function initAll() {
    // Hero 星空
    var hero = document.querySelector('.ud-hero');
    if (hero) new StarField(hero);

    // 其他区域几何形状
    for (var i = 0; i < geoConfigs.length; i++) {
      var el = document.querySelector(geoConfigs[i].selector);
      if (el) new GeoNetwork(el, geoConfigs[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
