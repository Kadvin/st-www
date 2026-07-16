/**
 * Hive Background Animations
 * Hero 区：星空粒子闪烁
 * 其他区：随机三角形/四边形（非等边非正方），角对角单连线
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

  // 生成随机不规则多边形顶点（相对中心点的偏移）
  GeoNetwork.prototype.generateRandomVerts = function (sides, baseSize) {
    var verts = [];
    // 随机角度分布（不均等），确保不规则
    var angles = [];
    var total = 0;
    for (var i = 0; i < sides; i++) {
      var segment = 0.5 + Math.random() * 1.5; // 每段角度权重不同
      angles.push(segment);
      total += segment;
    }
    // 归一化到 2PI
    var cumAngle = 0;
    for (var i = 0; i < sides; i++) {
      cumAngle += (angles[i] / total) * Math.PI * 2;
      // 每个顶点的半径也随机（baseSize 的 60%~140%）
      var r = baseSize * (0.6 + Math.random() * 0.8);
      verts.push({
        angle: cumAngle,
        radius: r
      });
    }
    return verts;
  };

  GeoNetwork.prototype.init = function () {
    this.shapes = [];
    this.links = [];

    var count = this.config.count;
    // 用网格确保不重叠
    var cellCols = Math.ceil(Math.sqrt(count * (this.width / this.height)));
    var cellRows = Math.ceil(count / cellCols);
    if (cellCols * cellRows < count) cellRows++;
    var cellW = this.width / cellCols;
    var cellH = this.height / cellRows;

    var idx = 0;
    for (var row = 0; row < cellRows && idx < count; row++) {
      for (var col = 0; col < cellCols && idx < count; col++) {
        // 中心在格子内随机偏移（留边距防止重叠）
        var cx = cellW * col + cellW * 0.5 + (Math.random() - 0.5) * cellW * 0.3;
        var cy = cellH * row + cellH * 0.5 + (Math.random() - 0.5) * cellH * 0.3;

        var sides = Math.random() < 0.5 ? 3 : 4;
        // 基础尺寸不超过格子的 40%，确保不重叠
        var maxSize = Math.min(cellW, cellH) * 0.35;
        var baseSize = maxSize * (0.5 + Math.random() * 0.5);

        var localVerts = this.generateRandomVerts(sides, baseSize);

        this.shapes.push({
          x: cx,
          y: cy,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.1,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.002,
          localVerts: localVerts,
          alpha: this.config.shapeAlpha
        });
        idx++;
      }
    }

    // 建立连线：每个形状最多连一条线到另一个形状
    // 每个顶点最多被用一次
    var usedVerts = {}; // "shapeIdx-vertIdx" => true

    for (var i = 0; i < this.shapes.length; i++) {
      // 找最近的尚有空闲顶点的邻居
      var bestJ = -1;
      var bestDist = Infinity;

      for (var j = 0; j < this.shapes.length; j++) {
        if (j === i) continue;
        // 检查 j 是否还有空闲顶点
        var jHasFree = false;
        for (var v = 0; v < this.shapes[j].localVerts.length; v++) {
          if (!usedVerts[j + '-' + v]) { jHasFree = true; break; }
        }
        if (!jHasFree) continue;

        var dx = this.shapes[i].x - this.shapes[j].x;
        var dy = this.shapes[i].y - this.shapes[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < bestDist) {
          bestDist = dist;
          bestJ = j;
        }
      }

      if (bestJ === -1) continue;

      // 找 i 的一个空闲顶点
      var vertI = -1;
      for (var v = 0; v < this.shapes[i].localVerts.length; v++) {
        if (!usedVerts[i + '-' + v]) { vertI = v; break; }
      }
      if (vertI === -1) continue;

      // 找 bestJ 的一个空闲顶点
      var vertJ = -1;
      for (var v = 0; v < this.shapes[bestJ].localVerts.length; v++) {
        if (!usedVerts[bestJ + '-' + v]) { vertJ = v; break; }
      }
      if (vertJ === -1) continue;

      usedVerts[i + '-' + vertI] = true;
      usedVerts[bestJ + '-' + vertJ] = true;

      this.links.push({
        shapeA: i, vertA: vertI,
        shapeB: bestJ, vertB: vertJ
      });
    }
  };

  GeoNetwork.prototype.getWorldVerts = function (shape) {
    var verts = [];
    for (var i = 0; i < shape.localVerts.length; i++) {
      var lv = shape.localVerts[i];
      var angle = lv.angle + shape.rotation;
      verts.push({
        x: shape.x + Math.cos(angle) * lv.radius,
        y: shape.y + Math.sin(angle) * lv.radius
      });
    }
    return verts;
  };

  GeoNetwork.prototype.drawShape = function (shape) {
    var ctx = this.ctx;
    var verts = this.getWorldVerts(shape);

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
    var shapeA = this.shapes[link.shapeA];
    var shapeB = this.shapes[link.shapeB];
    var vertsA = this.getWorldVerts(shapeA);
    var vertsB = this.getWorldVerts(shapeB);

    var pa = vertsA[link.vertA];
    var pb = vertsB[link.vertB];

    this.ctx.beginPath();
    this.ctx.moveTo(pa.x, pa.y);
    this.ctx.lineTo(pb.x, pb.y);
    this.ctx.strokeStyle = this.config.strokeColor.replace('ALPHA', (this.config.shapeAlpha * 0.5).toFixed(3));
    this.ctx.lineWidth = 0.8;
    this.ctx.stroke();
  };

  GeoNetwork.prototype.animate = function () {
    var self = this;
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 更新
    for (var i = 0; i < this.shapes.length; i++) {
      var s = this.shapes[i];
      s.x += s.vx;
      s.y += s.vy;
      s.rotation += s.rotationSpeed;

      // 获取当前最大顶点半径用于边界检测
      var maxR = 0;
      for (var v = 0; v < s.localVerts.length; v++) {
        if (s.localVerts[v].radius > maxR) maxR = s.localVerts[v].radius;
      }

      if (s.x < maxR || s.x > this.width - maxR) s.vx *= -1;
      if (s.y < maxR || s.y > this.height - maxR) s.vy *= -1;
      s.x = Math.max(maxR, Math.min(this.width - maxR, s.x));
      s.y = Math.max(maxR, Math.min(this.height - maxR, s.y));
    }

    // 绘制连线
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
      shapeAlpha: 0.18,
      count: 8
    },
    {
      selector: '.ud-about',
      strokeColor: 'rgba(80,100,130,ALPHA)',
      shapeAlpha: 0.14,
      count: 6
    },
    {
      selector: '.ud-pricing',
      strokeColor: 'rgba(255,255,255,ALPHA)',
      shapeAlpha: 0.14,
      count: 7
    },
    {
      selector: '.ud-faq',
      strokeColor: 'rgba(90,110,140,ALPHA)',
      shapeAlpha: 0.12,
      count: 5
    },
    {
      selector: '.ud-contact',
      strokeColor: 'rgba(80,100,120,ALPHA)',
      shapeAlpha: 0.12,
      count: 5
    }
  ];

  function initAll() {
    var hero = document.querySelector('.ud-hero');
    if (hero) new StarField(hero);

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
