/* ============================================================
   Demo data layer — makes the flow actually run, no backend.
   Whatever you type is kept in this browser (localStorage) and
   carried to the next screen. "Reset demo" clears it.
   ============================================================ */
(function () {
  'use strict';

  var KEY = 'lt.demo.deals';
  var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  /* ---------- tiny helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  function deals() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
  function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }
  function cur() { var d = deals(); return d.length ? d[d.length - 1] : null; }
  function upd(fn) { var d = deals(); if (!d.length) return null; fn(d[d.length - 1]); save(d); return d[d.length - 1]; }

  /* number → Indian grouping */
  function inr(n) {
    n = Math.round(Number(n) || 0).toString();
    if (n.length <= 3) return n;
    var last3 = n.slice(-3), rest = n.slice(0, -3);
    return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
  }
  function dmy(s) {
    if (!s) return '—';
    var p = s.split('-'); if (p.length !== 3) return s;
    var M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return p[2] + ' ' + M[+p[1] - 1] + ' ' + p[0].slice(2);
  }

  /* find a form control by its label text (string or list of candidates) */
  function fld(label, root) {
    var wants = (Array.isArray(label) ? label : [label]).map(function (s) { return s.toLowerCase(); });
    var hit = null;
    wants.some(function (want) {
      $$('.fld', root || document).some(function (f) {
        var l = f.querySelector('label');
        if (!l) return false;
        var t = l.textContent.replace(/\*/g, '').trim().toLowerCase();
        if (t === want || t.indexOf(want) === 0) {
          hit = f.querySelector('input, select, textarea');
          return true;
        }
        return false;
      });
      return !!hit;
    });
    return hit;
  }
  function selText(el) {
    return el && el.tagName === 'SELECT' && el.selectedIndex > -1
      ? el.options[el.selectedIndex].textContent.trim() : (el ? el.value : '');
  }
  function val(label, root) { var e = fld(label, root); return e ? e.value : ''; }
  function setVal(label, v, root) {
    var e = fld(label, root); if (!e || v === undefined || v === null || v === '') return;
    if (e.tagName === 'SELECT') {
      var found = Array.prototype.some.call(e.options, function (o) {
        if (o.textContent.trim() === String(v)) { e.value = o.value; return true; } return false;
      });
      if (!found) { var o = document.createElement('option'); o.textContent = v; o.selected = true; e.insertBefore(o, e.firstChild); }
    } else e.value = v;
  }
  function btnByText(txt, root) {
    var want = txt.toLowerCase();
    return $$('button, a.btn', root || document).filter(function (b) {
      return b.textContent.toLowerCase().indexOf(want) > -1;
    })[0];
  }

  /* next running number */
  function nextNo(prefix, base) { return prefix + (base + deals().length); }

  /* ---------- demo pill in the header ---------- */
  function pill() {
    var hdr = $('.hdr'); if (!hdr) return;
    var n = deals().length;
    var el = document.createElement('div');
    el.style.cssText = 'display:flex;align-items:center;gap:7px;padding:0 9px;height:28px;border-radius:999px;' +
      'border:1px dashed rgb(var(--bd-strong));font-size:11.5px;font-weight:600;color:rgb(var(--fg-muted));' +
      'white-space:nowrap;margin-right:2px';
    el.innerHTML = '<span style="width:7px;height:7px;border-radius:50%;background:' +
      (n ? 'rgb(var(--color-success))' : 'rgb(var(--bd-strong))') + '"></span>' +
      'Demo · ' + n + ' order' + (n === 1 ? '' : 's') +
      '<span id="dmReset" style="cursor:pointer;color:rgb(var(--fg-accent));text-decoration:underline">Reset</span>';
    hdr.insertBefore(el, hdr.querySelector('.unit-sel'));
    $('#dmReset').addEventListener('click', function () {
      save([]);
      if (window.toast) toast({ k: 'ok', i: 'refresh', t: 'Demo data cleared', p: 'All screens are back to the sample data.' });
      setTimeout(function () { location.reload(); }, 600);
    });
  }

  /* ============================================================
     ENQUIRY — capture the form, put the row in the register
     ============================================================ */
  function enquiry() {
    var tb = $('.card .tbl tbody'); if (!tb) return;

    deals().slice().reverse().forEach(function (d) {
      var tr = document.createElement('tr');
      tr.style.background = 'rgb(var(--color-success-subtle))';
      var st = d.stage === 'enquiry'
        ? '<span class="bdg b">Open</span>'
        : d.stage === 'estimated' ? '<span class="bdg t">Estimated</span>'
        : d.stage === 'quoted' ? '<span class="bdg p">Quoted</span>'
        : '<span class="bdg g">Converted</span>';
      tr.innerHTML =
        '<td class="k">' + d.id + ' <span class="bdg g nodot" style="font-size:9px">NEW</span></td>' +
        '<td>' + dmy(d.date) + '</td><td>' + d.customer + '</td>' +
        '<td>' + d.product + '<div class="mut">' + (d.route || 'Catalogue product') + '</div></td>' +
        '<td class="num">' + inr(d.qty) + '</td><td>' + (d.source || 'Email') + '</td>' +
        '<td>' + dmy(d.target) + '</td><td>' + st + '</td>' +
        '<td class="ctr"><a class="btn sm pri" href="estimation.html">Estimate</a></td>';
      tb.insertBefore(tr, tb.firstChild);
    });

    var m = $('#mNew'); if (!m) return;
    var sv = btnByText('send to Estimation', m) || btnByText('Save', m); if (!sv) return;
    sv.addEventListener('click', function (e) {
      e.preventDefault();
      var custEl = fld(['Client name', 'Customer'], m);
      var customer = selText(custEl);
      var qty = val(['Total quantity', 'Quantity'], m);
      if (!customer || customer.indexOf('Select') === 0) {
        if (window.toast) toast({ k: 'err', i: 'alertTri', t: 'Client name is required', p: 'Pick a customer before saving the enquiry.' });
        var ct = $('.modal-b', m); if (ct) ct.scrollTop = 0;
        if (custEl) custEl.focus();
        return;
      }
      var product = selText(fld('Product catalogue', m)) || 'Laminated tube';
      if (product.indexOf('not in catalogue') > -1) {
        var dia = val('Tube diameter', m), len = val('Tube length', m);
        product = (dia && len) ? ('LT ' + dia + '×' + len + ' — custom') : 'Custom laminated tube';
      }
      var d = deals();
      d.push({
        id: nextNo('ENQ/26-04', 23),
        date: val(['Enquiry date', 'Date'], m),
        customer: customer,
        product: product,
        route: selText(fld('Specification route', m)),
        qty: qty || 100000,
        target: val(['Expected delivery date', 'Target date'], m),
        source: selText(fld('Source', m)) || 'Email',
        salesPerson: selText(fld('Sales person', m)),
        poNo: val('Customer P.O. No.', m),
        colours: val('No. of colours', m),
        salesType: selText(fld('Sales type', m)),
        stage: 'enquiry'
      });
      save(d);
      if (window.closeModal) closeModal('mNew');
      if (window.toast) toast({ k: 'ok', i: 'check2', t: 'Enquiry saved — ' + d[d.length - 1].id,
        p: customer + ' · ' + inr(qty) + ' pcs. It is now in the register and ready for estimation.',
        act: '<a class="btn sm pri" href="estimation.html">Go to Estimation</a>' });
      setTimeout(function () { location.reload(); }, 900);
    }, true);
  }

  /* ============================================================
     ESTIMATION
     ============================================================ */
  function estimation() {
    var d = cur(); if (!d) return;
    var h1 = $('.ph h1'), sub = $('.ph p');
    var estId = d.estId || nextNo('EST/26-03', 90);
    upd(function (x) { x.estId = estId; });
    if (h1) h1.textContent = 'Estimation — ' + estId;
    if (sub) sub.innerHTML = 'From ' + d.id + ' &middot; ' + d.customer + ' &middot; ' + inr(d.qty) + ' pcs';

    setVal('Order quantity', d.qty);
    setVal('Specification route', d.route);
    if (d.product) setVal('Product catalogue', d.product);

    banner('This estimation is running on the enquiry you just entered — ' + d.id + ' for ' + d.customer);

    var b = btnByText('Convert to Quotation');
    if (b) b.addEventListener('click', function (e) {
      e.preventDefault();
      upd(function (x) { x.stage = 'estimated'; x.quoId = nextNo('QT/26-04', 22); });
      go('quotation.html', 'Quotation created', d.customer + ' · ' + inr(d.qty) + ' pcs carried over from ' + estId + '.');
    });
  }

  /* ============================================================
     QUOTATION
     ============================================================ */
  function quotation() {
    var d = cur(); if (!d || !d.quoId) return;
    var h1 = $('.ph h1'), sub = $('.ph p');
    if (h1) h1.textContent = 'Quotation — ' + d.quoId;
    if (sub) sub.innerHTML = 'From ' + d.id + ' &middot; ' + d.estId + ' &middot; ' + d.customer;
    setVal('Customer', d.customer);

    var tb = $('.card .tbl tbody');
    if (tb) {
      tb.innerHTML = '<tr style="background:rgb(var(--color-success-subtle))"><td>1</td>' +
        '<td><b>' + d.product + '</b><div class="mut">' + (d.route || '') + ' &middot; from ' + d.id + '</div></td>' +
        '<td class="num">' + inr(d.qty) + '</td><td class="num mono">2.4180</td>' +
        '<td class="num"><input class="inp" style="width:64px;text-align:right" value="18"></td>' +
        '<td class="num mono"><b>2.8532</b></td><td class="num mono">' + inr(d.qty * 2.8532) + '</td>' +
        '<td class="ctr"></td></tr>';
      var tf = $('.card .tbl tfoot td.num');
      if (tf) tf.textContent = inr(d.qty * 2.8532);
    }
    banner('Quotation built from your enquiry ' + d.id + ' — rate and value are calculated on ' + inr(d.qty) + ' pcs.');

    var b = btnByText('Convert to Sales Order');
    if (b) b.addEventListener('click', function (e) {
      e.preventDefault();
      upd(function (x) { x.stage = 'quoted'; x.soId = nextNo('SO/26-02', 3); });
      go('sales-order.html', 'Sales order created', d.customer + ' · ' + inr(d.qty) + ' pcs.');
    });
  }

  /* ============================================================
     SALES ORDER
     ============================================================ */
  function salesOrder() {
    var d = cur(); if (!d || !d.soId) return;
    var h1 = $('.ph h1'), sub = $('.ph p');
    if (h1) h1.textContent = 'Sales Order — ' + d.soId;
    if (sub) sub.innerHTML = 'From ' + d.quoId + ' &middot; ' + d.customer + ' &middot; created today';
    setVal('Customer', d.customer);

    var tb = $('.card .tbl tbody');
    if (tb) {
      tb.innerHTML = '<tr style="background:rgb(var(--color-success-subtle))"><td>1</td>' +
        '<td><b>' + d.product + '</b><div class="mut">from ' + d.quoId + '</div></td>' +
        '<td class="mut">AW-2026-0742</td><td class="num">' + inr(d.qty) + '</td>' +
        '<td class="num mono">2.8532</td><td class="num mono">' + inr(d.qty * 2.8532) + '</td>' +
        '<td>' + dmy(d.target) + '</td><td class="ctr"></td></tr>';
    }
    /* delivery schedule → 4 lots */
    var tbs = $$('.card .tbl tbody')[1];
    if (tbs) {
      var per = Math.round(d.qty / 4);
      var rows = '';
      for (var i = 1; i <= 4; i++) {
        var q = (i === 4) ? d.qty - per * 3 : per;
        rows += '<tr><td class="k">Lot ' + i + '</td><td>' + dmy(d.target) + '</td>' +
          '<td class="num">' + inr(q) + '</td><td class="num">0</td><td class="num">' + inr(q) + '</td>' +
          '<td><span class="bdg ' + (i === 1 ? 'b">Planned' : 'n">Pending') + '</span></td></tr>';
      }
      tbs.innerHTML = rows;
    }
    banner('Sales order raised from ' + d.quoId + '. Delivery split into four lots automatically.');

    var b = btnByText('Create Work Order');
    if (b) b.addEventListener('click', function (e) {
      e.preventDefault();
      upd(function (x) { x.stage = 'ordered'; x.pwoId = x.soId.replace('SO/', 'PWO/'); });
      go('pwo.html', 'Work order created', 'BOM, routing and material requirement generated.');
    });
  }

  /* ============================================================
     PRODUCTION WORK ORDER
     ============================================================ */
  function pwo() {
    var d = cur(); if (!d || !d.pwoId) return;
    var h1 = $('.ph h1'), sub = $('.ph p');
    if (h1) h1.textContent = d.pwoId;
    if (sub) sub.innerHTML = d.soId + ' &middot; ' + d.customer + ' &middot; ' + d.product + ' &middot; ' + inr(d.qty) + ' pcs';
    setVal('Sales order', d.soId);
    setVal('Customer', d.customer);
    setVal('Product', d.product);
    setVal('Order qty', inr(d.qty));
    setVal('Planned qty', Math.round(d.qty * 1.02));
    setVal('Batch no.', 'LT26-' + d.soId.split('-')[1] + '-A');
    banner('Work order exploded from ' + d.soId + '. The indent was raised automatically under the work order’s own authority.');
  }

  /* ============================================================
     DASHBOARD — show the new order in the pipeline
     ============================================================ */
  function dashboard() {
    var tb = $('.card .tbl tbody'); if (!tb) return;
    deals().slice().reverse().forEach(function (d) {
      if (!d.soId) return;
      var tr = document.createElement('tr');
      tr.style.background = 'rgb(var(--color-success-subtle))';
      tr.innerHTML =
        '<td class="k">' + d.soId + ' <span class="bdg g nodot" style="font-size:9px">NEW</span></td>' +
        '<td>' + d.customer + '</td><td>' + d.product + '</td>' +
        '<td class="num">' + inr(d.qty) + '</td>' +
        '<td>' + (d.pwoId ? 'Work order released' : 'Order booked') + '</td>' +
        '<td><div class="pbar"><i class="w" style="width:' + (d.pwoId ? 18 : 8) + '%"></i></div></td>' +
        '<td><span class="bdg b">' + (d.pwoId ? 'In planning' : 'Confirmed') + '</span></td>' +
        '<td class="num">' + dmy(d.target) + '</td>';
      tb.insertBefore(tr, tb.firstChild);
    });
    var n = deals().filter(function (x) { return x.soId; }).length;
    if (n) {
      var stat = $('.stats .stat .val');
      if (stat) stat.textContent = 42 + n;
    }
  }

  /* ---------- shared bits ---------- */
  function banner(text) {
    var ph = $('.ph'); if (!ph) return;
    var a = document.createElement('div');
    a.className = 'alert ok';
    a.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>' +
      '<div><b>Live demo data</b>' + text + '</div>';
    ph.parentNode.insertBefore(a, ph.nextSibling);
  }

  function go(url, title, msg) {
    if (window.toast) toast({ k: 'ok', i: 'check2', t: title, p: msg });
    setTimeout(function () { location.href = url; }, 750);
  }

  /* ---------- boot ---------- */
  function init() {
    pill();
    try {
      if (here === 'enquiry.html') enquiry();
      else if (here === 'estimation.html') estimation();
      else if (here === 'quotation.html') quotation();
      else if (here === 'sales-order.html') salesOrder();
      else if (here === 'pwo.html') pwo();
      else if (here === 'index.html' || here === '') dashboard();
    } catch (e) { /* demo layer must never break the mockup */ }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
