/**
 * Why Hive - Tab 切换 + 轮播
 */
(function () {
  'use strict';

  function initTabs() {
    var tabNavItems = document.querySelectorAll('.why-hive-tab-nav li');
    var tabContents = document.querySelectorAll('.why-hive-tab-content');

    tabNavItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var tabId = this.getAttribute('data-tab');

        // 切换 active
        tabNavItems.forEach(function (el) { el.classList.remove('active'); });
        tabContents.forEach(function (el) { el.classList.remove('active'); });

        this.classList.add('active');
        document.getElementById('tab-' + tabId).classList.add('active');
      });
    });
  }

  function initCarousels() {
    var carousels = document.querySelectorAll('.why-hive-carousel');

    carousels.forEach(function (carousel) {
      var track = carousel.querySelector('.carousel-track');
      var slides = carousel.querySelectorAll('.carousel-slide');
      var prevBtn = carousel.querySelector('.carousel-prev');
      var nextBtn = carousel.querySelector('.carousel-next');
      var dotsContainer = carousel.querySelector('.carousel-dots');
      var current = 0;

      // 生成 dots
      slides.forEach(function (_, idx) {
        var dot = document.createElement('span');
        dot.className = 'carousel-dot' + (idx === 0 ? ' active' : '');
        dot.addEventListener('click', function () { goTo(idx); });
        dotsContainer.appendChild(dot);
      });

      function goTo(idx) {
        slides[current].classList.remove('active');
        current = idx;
        if (current < 0) current = slides.length - 1;
        if (current >= slides.length) current = 0;
        slides[current].classList.add('active');

        // 更新 dots
        var dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach(function (d, i) {
          d.classList.toggle('active', i === current);
        });
      }

      prevBtn.addEventListener('click', function () { goTo(current - 1); });
      nextBtn.addEventListener('click', function () { goTo(current + 1); });

      // 自动轮播
      setInterval(function () { goTo(current + 1); }, 6000);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initTabs();
      initCarousels();
    });
  } else {
    initTabs();
    initCarousels();
  }
})();
