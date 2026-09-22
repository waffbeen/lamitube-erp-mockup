/* ============================================================
   Tiny inline-SVG chart renderer — no library.
   Forms: bar, hbar, line, stack (part-to-whole), spark
   Palette: validated categorical set, light + dark steps.
   Every chart ships a hover tooltip; every chart on a report
   page is paired with a table, which covers the light-mode
   contrast relief rule.
   ============================================================ */
(function () {
  'use strict';

  /* validated categorical slots — fixed order, never cycled */
  var CAT_LIGHT = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300'];
  var CAT_DARK  = ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#008300'];
  /* sequential single hue (magnitude) */
  var SEQ_LIGHT = '#2a78d6', SEQ_DARK = '#3987e5';
  var MUTE_LIGHT = '#9ca3af', MUTE_DARK = '#6b7280';

  function dark() { return document.documentElement.getAttribute('data-theme') === 'dark'; }
  function cat(i) { return (dark() ? CAT_DARK : CAT_LIGHT)[i % 6]; }
  function seq() { return dark() ? SEQ_DARK : SEQ_LIGHT; }
  function mute() { return dark() ? MUTE_DARK : MUTE_LIGHT; }

  var INK = 'rgb(var(--fg-default))', INK2 = 'rgb(var(--fg-muted))', INK3 = 'rgb(var(--fg-subtle))';
  var GRID = 'rgb(var(--bd-subtle))';
  var SURF = 'rgb(var(--bg-surface))';

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function nums(s) { return String(s || '').split(',').map(function (x) { return parseFloat(x); }); }
  function strs(s) { return String(s || '').split(',').map(function (x) { return x.trim(); }); }
  function fmt(v, u) {
    var n = Math.abs(v) >= 100 ? Math.round(v) : Math.round(v * 10) / 10;
    n = n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (u && u.charAt(0) === '₹' ? u + ' ' + n : n + (u ? ' ' + u : ''));
  }
  function nice(max) {
    if (max <= 0) return 1;
    var mag = Math.pow(10, Math.floor(Math.log10(max)));
    var f = max / mag;
    var step = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
    return step * mag;
  }

  /* ---------- tooltip ---------- */
  var tip;
  function showTip(host, x, y, html) {
    if (!tip) {
      tip = document.createElement('div');
      tip.className = 'ch-tip';
      document.body.appendChild(tip);
    }
    tip.innerHTML = html;
    tip.style.display = 'block';
    var r = host.getBoundingClientRect();
    var tw = tip.offsetWidth, th = tip.offsetHeight;
    var left = r.left + x - tw / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
    tip.style.left = left + 'px';
    tip.style.top = (r.top + y - th - 12) + 'px';
  }
  function hideTip() { if (tip) tip.style.display = 'none'; }

  /* ---------- legend ---------- */
  function legend(names, colorer) {
    return '<div class="ch-lg">' + names.map(function (n, i) {
      return '<span><i style="background:' + colorer(i) + '"></i>' + esc(n) + '</span>';
    }).join('') + '</div>';
  }

  /* ============================================================
     COLUMN / BAR — magnitude, sequential single hue
     ============================================================ */
  function bar(el) {
    var cats = strs(el.dataset.cats), vals = nums(el.dataset.values);
    var unit = el.dataset.unit || '';
    var W = 640, H = 220, L = 46, R = 10, T = 14, B = 34;
    var pw = W - L - R, ph = H - T - B;
    var top = nice(Math.max.apply(null, vals));
    var n = vals.length, slot = pw / n, bw = Math.min(38, slot - 10);

    var g = '', ticks = 4;
    for (var t = 0; t <= ticks; t++) {
      var y = T + ph - (ph * t / ticks);
      g += '<line x1="' + L + '" y1="' + y + '" x2="' + (W - R) + '" y2="' + y +
           '" stroke="' + GRID + '" stroke-width="1"/>' +
           '<text x="' + (L - 8) + '" y="' + (y + 4) + '" text-anchor="end" class="ch-ax">' +
           fmt(top * t / ticks, '') + '</text>';
    }

    var bars = '';
    vals.forEach(function (v, i) {
      var h = Math.max(2, ph * v / top);
      var x = L + slot * i + (slot - bw) / 2, y = T + ph - h;
      bars += '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="' + h +
        '" rx="4" fill="' + seq() + '" class="ch-mk" data-i="' + i + '"/>' +
        '<text x="' + (x + bw / 2) + '" y="' + (H - 12) + '" text-anchor="middle" class="ch-ax">' +
        esc(cats[i]) + '</text>';
    });

    el.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="ch-svg" role="img" aria-label="' +
      esc(el.dataset.title || 'Bar chart') + '">' + g + bars + '</svg>';
    hover(el, function (i) {
      return '<b>' + esc(cats[i]) + '</b><span>' + fmt(vals[i], unit) + '</span>';
    });
  }

  /* ============================================================
     HORIZONTAL BAR — ranked magnitude, long labels
     ============================================================ */
  function hbar(el) {
    var cats = strs(el.dataset.cats), vals = nums(el.dataset.values);
    var unit = el.dataset.unit || '';
    var W = 640, rowH = 30, L = 168, R = 60, T = 6;
    var H = T + cats.length * rowH + 6, pw = W - L - R;
    var top = Math.max.apply(null, vals);

    var rows = '';
    vals.forEach(function (v, i) {
      var w = Math.max(2, pw * v / top), y = T + i * rowH + 6;
      rows += '<text x="' + (L - 10) + '" y="' + (y + 13) + '" text-anchor="end" class="ch-lb">' +
          esc(cats[i]) + '</text>' +
        '<rect x="' + L + '" y="' + y + '" width="' + pw + '" height="18" rx="4" fill="' + GRID + '"/>' +
        '<rect x="' + L + '" y="' + y + '" width="' + w + '" height="18" rx="4" fill="' + seq() +
          '" class="ch-mk" data-i="' + i + '"/>' +
        '<text x="' + (L + pw + 8) + '" y="' + (y + 13) + '" class="ch-vl">' + fmt(v, unit) + '</text>';
    });

    el.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="ch-svg" role="img" aria-label="' +
      esc(el.dataset.title || 'Ranked bar chart') + '">' + rows + '</svg>';
    hover(el, function (i) {
      return '<b>' + esc(cats[i]) + '</b><span>' + fmt(vals[i], unit) + '</span>';
    });
  }

  /* ============================================================
     LINE — trend over time, 1..4 series
     ============================================================ */
  function line(el) {
    var cats = strs(el.dataset.cats);
    var series = JSON.parse(el.dataset.series || '[]');
    var unit = el.dataset.unit || '';
    var W = 640, H = 230, L = 46, R = 92, T = 14, B = 34;
    var pw = W - L - R, ph = H - T - B;
    var all = [];
    series.forEach(function (s) { all = all.concat(s.values); });
    var dmin = Math.min.apply(null, all), dmax = Math.max.apply(null, all);

    /* A line showing a trend may sit on a non-zero baseline — forcing zero
       flattens a 96–97% series into a single line. Bars always keep zero. */
    var lo = 0, hi = nice(dmax);
    if (el.dataset.zero !== 'true' && dmin > 0 && (dmax - dmin) < dmax * 0.35) {
      var pad = (dmax - dmin) * 0.35 || dmax * 0.02;
      var raw = (dmax + pad - (dmin - pad)) / 4;
      var mag = Math.pow(10, Math.floor(Math.log10(raw)));
      var st = raw / mag <= 1 ? 1 : raw / mag <= 2 ? 2 : raw / mag <= 5 ? 5 : 10;
      st = st * mag;
      lo = Math.max(0, Math.floor((dmin - pad) / st) * st);
      hi = lo + st * 4;
    }
    var span = (hi - lo) || 1;
    var n = cats.length, step = n > 1 ? pw / (n - 1) : pw;
    var X = function (i) { return L + step * i; };
    var Y = function (v) { return T + ph - ph * (v - lo) / span; };
    var dec = span < 8 ? 1 : 0;

    var g = '', ticks = 4;
    for (var t = 0; t <= ticks; t++) {
      var y = T + ph - (ph * t / ticks);
      var tv = lo + span * t / ticks;
      g += '<line x1="' + L + '" y1="' + y + '" x2="' + (W - R) + '" y2="' + y +
           '" stroke="' + GRID + '" stroke-width="1"/>' +
           '<text x="' + (L - 8) + '" y="' + (y + 4) + '" text-anchor="end" class="ch-ax">' +
           (dec ? tv.toFixed(1) : fmt(tv, '')) + '</text>';
    }
    cats.forEach(function (c, i) {
      g += '<text x="' + X(i) + '" y="' + (H - 12) + '" text-anchor="middle" class="ch-ax">' + esc(c) + '</text>';
    });

    /* stagger the direct labels so close-running series do not overlap */
    var ends = series.map(function (s, si) { return { si: si, y: Y(s.values[n - 1]) }; })
      .sort(function (a, b) { return a.y - b.y; });
    var lastY = -99;
    ends.forEach(function (e) {
      e.ly = Math.max(e.y, lastY + 13);
      lastY = e.ly;
    });
    var labelY = {};
    ends.forEach(function (e) { labelY[e.si] = e.ly; });

    var paths = '';
    series.forEach(function (s, si) {
      var d = s.values.map(function (v, i) { return (i ? 'L' : 'M') + X(i) + ' ' + Y(v); }).join(' ');
      paths += '<path d="' + d + '" fill="none" stroke="' + cat(si) +
        '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>';
      s.values.forEach(function (v, i) {
        paths += '<circle cx="' + X(i) + '" cy="' + Y(v) + '" r="4" fill="' + cat(si) +
          '" stroke="' + SURF + '" stroke-width="2"/>';
      });
      /* direct label in the right gutter */
      var lx = X(n - 1) + 10, ly = labelY[si] + 4;
      paths += '<text x="' + lx + '" y="' + ly + '" class="ch-dl">' + esc(s.name) + '</text>';
    });

    /* invisible hit columns for the crosshair */
    var hits = '';
    cats.forEach(function (c, i) {
      hits += '<rect x="' + (X(i) - step / 2) + '" y="' + T + '" width="' + step + '" height="' + ph +
        '" fill="transparent" class="ch-mk" data-i="' + i + '"/>';
    });

    el.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="ch-svg" role="img" aria-label="' +
      esc(el.dataset.title || 'Line chart') + '">' + g + paths + hits + '</svg>' +
      (series.length > 1 ? legend(series.map(function (s) { return s.name; }), cat) : '');
    hover(el, function (i) {
      return '<b>' + esc(cats[i]) + '</b>' + series.map(function (s, si) {
        return '<span><i style="background:' + cat(si) + '"></i>' + esc(s.name) + ' · ' +
          fmt(s.values[i], unit) + '</span>';
      }).join('');
    });
  }

  /* ============================================================
     STACK — part-to-whole, horizontal, 2px surface gaps
     ============================================================ */
  function stack(el) {
    var parts = JSON.parse(el.dataset.series || '[]');
    var unit = el.dataset.unit || '';
    var total = parts.reduce(function (a, p) { return a + p.value; }, 0);
    var W = 640, H = 46, gap = 2, x = 0;
    var segs = '';
    parts.forEach(function (p, i) {
      var w = Math.max(3, (W - gap * (parts.length - 1)) * p.value / total);
      segs += '<rect x="' + x + '" y="6" width="' + w + '" height="26" rx="4" fill="' + cat(i) +
        '" class="ch-mk" data-i="' + i + '"/>';
      if (w > 56) {
        segs += '<text x="' + (x + w / 2) + '" y="42" text-anchor="middle" class="ch-ax">' +
          Math.round(p.value / total * 100) + '%</text>';
      }
      x += w + gap;
    });
    el.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="ch-svg" role="img" aria-label="' +
      esc(el.dataset.title || 'Stacked bar') + '">' + segs + '</svg>' +
      legend(parts.map(function (p) { return p.name; }), cat);
    hover(el, function (i) {
      return '<b>' + esc(parts[i].name) + '</b><span>' + fmt(parts[i].value, unit) + ' · ' +
        Math.round(parts[i].value / total * 100) + '%</span>';
    });
  }

  /* ============================================================
     SPARK — tiny trend inside a stat tile
     ============================================================ */
  function spark(el) {
    var v = nums(el.dataset.values);
    var W = 96, H = 26, min = Math.min.apply(null, v), max = Math.max.apply(null, v);
    var rng = (max - min) || 1, step = W / (v.length - 1);
    var d = v.map(function (x, i) {
      return (i ? 'L' : 'M') + (step * i).toFixed(1) + ' ' + (H - 3 - (H - 8) * (x - min) / rng).toFixed(1);
    }).join(' ');
    var up = v[v.length - 1] >= v[0];
    var c = up ? 'rgb(var(--color-success))' : 'rgb(var(--color-error))';
    el.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="ch-svg" aria-hidden="true">' +
      '<path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  /* ---------- hover wiring ---------- */
  function hover(el, html) {
    el.querySelectorAll('.ch-mk').forEach(function (m) {
      m.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        showTip(el, e.clientX - r.left, e.clientY - r.top, html(+m.dataset.i));
        m.style.opacity = '.82';
      });
      m.addEventListener('mouseleave', function () { hideTip(); m.style.opacity = ''; });
    });
    el.addEventListener('mouseleave', hideTip);
  }

  /* ---------- boot ---------- */
  var TYPES = { bar: bar, hbar: hbar, line: line, stack: stack, spark: spark };
  function draw() {
    document.querySelectorAll('.chart[data-type]').forEach(function (el) {
      var fn = TYPES[el.dataset.type];
      if (fn) { try { fn(el); } catch (e) {} }
    });
  }
  window.redrawCharts = draw;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', draw);
  else draw();

  /* repaint on theme change so dark steps are used, not a flipped light palette */
  new MutationObserver(function (m) {
    m.forEach(function (x) { if (x.attributeName === 'data-theme') draw(); });
  }).observe(document.documentElement, { attributes: true });
})();
