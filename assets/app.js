/* ============================================================
   Lamitube ERP mockup — shell builder, chat, notifications, toasts
   Every page just needs:  <div id="page"> ...content... </div>
   ============================================================ */
(function () {
  'use strict';

  /* ---------------- icons (lucide paths) ---------------- */
  var I = {
    grid:      '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    mail:      '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/>',
    calc:      '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h8"/>',
    file:      '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v6h6"/>',
    cart:      '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
    book:      '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    box:       '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    route:     '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
    cpu:       '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2M9 2v2M15 20v2M9 20v2M2 15h2M2 9h2M20 15h2M20 9h2"/>',
    users:     '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    beaker:    '<path d="M4.5 3h15M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"/><path d="M6 14h12"/>',
    image:     '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>',
    clip:      '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12h6M9 16h6"/>',
    cal:       '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    check2:    '<path d="M20 6 9 17l-5-5"/>',
    truck:     '<path d="M14 18V6a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h2"/><path d="M14 9h4l3 3v5a1 1 0 0 1-1 1h-1"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    door:      '<path d="M13 4h3a2 2 0 0 1 2 2v14M2 20h20M13 2v20"/><path d="M10 12v.01"/>',
    layers:    '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.9a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 12.54-9.17 4.16a2 2 0 0 1-1.66 0L2 12.54"/><path d="m22 17.54-9.17 4.16a2 2 0 0 1-1.66 0L2 17.54"/>',
    arrowUD:   '<path d="m17 3 4 4-4 4M21 7H9M7 21l-4-4 4-4M3 17h12"/>',
    factory:   '<path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M17 18h1M12 18h1M7 18h1"/>',
    send:      '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4Z"/>',
    inbox:     '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    activity:  '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    shield:    '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    award:     '<path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/><circle cx="12" cy="8" r="6"/>',
    alertTri:  '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/>',
    pkg:       '<path d="M16.5 9.4 7.5 4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    receipt:   '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M8 7h8M8 11h8M8 15h5"/>',
    undo:      '<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>',
    rupee:     '<path d="M6 3h12M6 8h12M16.5 3c0 5-3.5 5-6.5 5H6l9 13"/>',
    msgAlert:  '<path d="M19 15V9a7 7 0 1 0-14 0v6l-2 4h18z"/><path d="M12 19v2"/>',
    search2:   '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    wrench:    '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    chart:     '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="m19 9-5 5-4-4-3 3"/>',
    bell:      '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    panel:     '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>',
    moon:      '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    sun:       '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    plus:      '<path d="M5 12h14M12 5v14"/>',
    printer:   '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
    down:      '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    save:      '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
    x:         '<path d="M18 6 6 18M6 6l12 12"/>',
    filter:    '<path d="M22 3H2l8 9.46V19l4 2v-8.54z"/>',
    refresh:   '<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>',
    link:      '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    chevR:     '<path d="m9 18 6-6-6-6"/>',
    star:      '<path d="M11.5 2.7a.55.55 0 0 1 1 0l2.36 4.79 5.28.77c.45.06.63.62.3.94l-3.82 3.72.9 5.26c.08.45-.4.79-.8.58L12 16.27l-4.72 2.49c-.4.21-.88-.13-.8-.58l.9-5.26-3.82-3.72c-.33-.32-.15-.88.3-.94l5.28-.77z"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    db:        '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
    msgs:      '<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>',
    settings:  '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    logout:    '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    user:      '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    paperclip: '<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
    atSign:    '<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>',
    phone:     '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    zap:       '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>'
  };

  function svg(name, cls) {
    var p = I[name] || I.grid;
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
           'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  }
  window.icon = svg;

  /* ---------------- navigation (grouped) ---------------- */
  var NAV = [
    { g: 'Dashboard', i: 'grid', solo: true, items: [
      { t: 'Dashboard', h: 'index.html', i: 'grid' }
    ]},
    { g: 'Sales', i: 'briefcase', items: [
      { t: 'Enquiry',     h: 'enquiry.html',     i: 'mail' },
      { t: 'Estimation',  h: 'estimation.html',  i: 'calc' },
      { t: 'Quotation',   h: 'quotation.html',   i: 'file' },
      { t: 'Sales Order', h: 'sales-order.html', i: 'cart' }
    ]},
    { g: 'Master', i: 'db', items: [
      { t: 'Product Catalogue', h: 'product-catalogue.html', i: 'book' },
      { t: 'Item Master',       h: 'item-master.html',       i: 'box' },
      { t: 'Process & Routing', h: 'process-routing.html',   i: 'route' },
      { t: 'Machine & Mould',   h: 'machine-master.html',    i: 'cpu' },
      { t: 'Customer / Vendor', h: 'ledger-master.html',     i: 'users' },
      { t: 'QC Parameter',      h: 'qc-parameter.html',      i: 'beaker' },
      { t: 'Artwork',           h: 'artwork.html',           i: 'image' }
    ]},
    { g: 'Planning', i: 'clip', items: [
      { t: 'Production Work Order', h: 'pwo.html',        i: 'clip' },
      { t: 'Machine Scheduling',    h: 'scheduling.html', i: 'cal' }
    ]},
    { g: 'Purchase & Inventory', i: 'cart', items: [
      { t: 'Indent Approval', h: 'indent-approval.html', i: 'check2' },
      { t: 'Purchase Order',  h: 'purchase-order.html',  i: 'cart' },
      { t: 'Gate Entry',      h: 'gate-entry.html',      i: 'door' },
      { t: 'GRN',             h: 'grn.html',             i: 'truck' },
      { t: 'Stock & Batch',   h: 'stock.html',           i: 'layers' },
      { t: 'Material Issue',  h: 'material-issue.html',  i: 'arrowUD' }
    ]},
    { g: 'Manufacturing', i: 'factory', items: [
      { t: 'Production Entry',   h: 'production-entry.html', i: 'factory' },
      { t: 'Printing — Send',    h: 'printing-send.html',    i: 'send' },
      { t: 'Printing — Receipt', h: 'printing-receipt.html', i: 'inbox', live: true },
      { t: 'WIP / Job Status',   h: 'wip-status.html',       i: 'activity' }
    ]},
    { g: 'Quality', i: 'shield', items: [
      { t: 'RMQC', h: 'rmqc.html', i: 'shield' },
      { t: 'IPQC', h: 'ipqc.html', i: 'shield' },
      { t: 'FGQC', h: 'fgqc.html', i: 'shield' },
      { t: 'COA',  h: 'coa.html',  i: 'award' },
      { t: 'NCR',  h: 'ncr.html',  i: 'alertTri' }
    ]},
    { g: 'Dispatch', i: 'truck', items: [
      { t: 'Packing',            h: 'packing.html',          i: 'pkg' },
      { t: 'Delivery Note',      h: 'delivery-note.html',    i: 'truck' },
      { t: 'Dispatch & Invoice', h: 'dispatch-invoice.html', i: 'receipt' },
      { t: 'Sales Return',       h: 'sales-return.html',     i: 'undo' }
    ]},
    { g: 'Costing', i: 'rupee', items: [
      { t: 'Actual Costing', h: 'actual-costing.html', i: 'rupee' }
    ]},
    { g: 'Complaint & CAPA', i: 'msgAlert', items: [
      { t: 'Customer Complaint', h: 'complaint.html', i: 'msgAlert' },
      { t: 'RCA',                h: 'rca.html',       i: 'search2' },
      { t: 'CAPA',               h: 'capa.html',      i: 'wrench' }
    ]},
    { g: 'Integration', i: 'link', items: [
      { t: 'Printing Data Sync', h: 'integration.html', i: 'zap', live: true }
    ]},
    { g: 'Reports', i: 'chart', items: [
      { t: 'Reports', h: 'reports.html', i: 'chart' }
    ]}
  ];

  var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  function ls(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); }
    catch (e) { return null; }
  }
  function favs() {
    try { return JSON.parse(ls('lt.favs') || '[]'); } catch (e) { return []; }
  }
  function saveFavs(a) { ls('lt.favs', JSON.stringify(a)); }

  /* ---------------- chat data ---------------- */
  var CHATS = [
    { id: 'prod', name: 'Production — Baddi', kind: 'group', col: '#003366', ini: 'PB',
      last: 'Cavity 5 isolated, running on 7', time: '11:42', unread: 3, sub: '6 members · Production floor',
      msgs: [
        { d: 'Today' },
        { w: 'V. Thakur', t: 'Cavity 5 pressure is dropping again on CM-01. Getting short shots at the shoulder skirt.', tm: '11:18' },
        { w: 'R. Verma (QA)', t: 'IPQC reading is 137 bar. That is below the CAPA limit — I am stopping operation 40 and raising an NCR.', tm: '11:24', ref: 'IPQ/26-0942' },
        { me: 1, t: 'Isolate cavity 5 and continue on 7 cavities. Maintenance is being called for the hydraulic line.', tm: '11:31' },
        { w: 'Maintenance', t: 'Team reaching the floor in 10 minutes. Sensor replacement kit is in stores.', tm: '11:38' },
        { w: 'V. Thakur', t: 'Cavity 5 isolated, running on 7. Output will drop to about 1,800 per hour.', tm: '11:42' }
      ]},
    { id: 'print', name: 'Monarch Print Pvt. Ltd.', kind: 'external', col: '#b45309', ini: 'MP',
      last: 'Lot 3 loaded on press, 62% done', time: '11:05', unread: 2, sub: 'Printing partner · external channel',
      msgs: [
        { d: 'Yesterday' },
        { w: 'A. Sethi (Monarch)', t: 'Received 4 rolls against ICP/26-0077, total 792 kg. Plates mounted, shade standard matched.', tm: '16:40', ref: 'ICP/26-0077' },
        { d: 'Today' },
        { sys: 1, t: 'Job status auto-synced from Monarch Print — printing started 06:10, 62% complete' },
        { me: 1, t: 'Please share the delta-E log with the challan this time. It is a CAPA requirement on our side.', tm: '09:20' },
        { w: 'A. Sethi (Monarch)', t: 'Noted. We are logging every 1000 metres and will attach the signed sheet.', tm: '09:34' },
        { w: 'A. Sethi (Monarch)', t: 'Lot 3 loaded on press, 62% done. Expecting dispatch back to you by tomorrow evening.', tm: '11:05' }
      ]},
    { id: 'qa', name: 'QA Team', kind: 'group', col: '#0f766e', ini: 'QA',
      last: 'FGQC cleared for FG-LT26-0201-A', time: '10:12', unread: 0, sub: '4 members · Quality',
      msgs: [
        { d: 'Today' },
        { w: 'S. Nair', t: '100% leak test done on the Glenmark batch. 86 pieces removed out of 2,01,200 — 0.043%.', tm: '10:02' },
        { w: 'R. Verma (QA)', t: 'That is inside the 0.1% CAPA limit. Releasing the batch and generating the COA.', tm: '10:09', ref: 'FGQ/26-0311' },
        { me: 1, t: 'FGQC cleared for FG-LT26-0201-A. Delivery note can go out today.', tm: '10:12' }
      ]},
    { id: 'purch', name: 'Purchase', kind: 'group', col: '#7e22ce', ini: 'PU',
      last: 'Cap PO released to Sanjay Polymers', time: '09:48', unread: 0, sub: '3 members · Purchase',
      msgs: [
        { d: 'Today' },
        { w: 'N. Gupta', t: 'Indent IND/26-0314 is still pending approval. Cap shortfall is 1,14,530 pieces.', tm: '09:30', ref: 'IND/26-0314' },
        { me: 1, t: 'Approving now. Release the PO the same day, delivery must land before 05 Oct.', tm: '09:41' },
        { w: 'N. Gupta', t: 'Cap PO released to Sanjay Polymers. Confirmed delivery 02 Oct.', tm: '09:48' }
      ]},
    { id: 'sales', name: 'R. Sharma — Sales', kind: 'dm', col: '#1d4ed8', ini: 'RS',
      last: 'Cipla wants the Oct schedule split', time: 'Yesterday', unread: 0, sub: 'Online · Sales',
      msgs: [
        { d: 'Yesterday' },
        { w: 'R. Sharma', t: 'Cipla wants the October schedule split into four weekly lots instead of two.', tm: '15:20', ref: 'SO/26-0202' },
        { me: 1, t: 'Fine, update the delivery schedule on the sales order. Production plan will absorb it.', tm: '15:26' }
      ]},
    { id: 'bot', name: 'ERP Alerts', kind: 'bot', col: '#be123c', ini: 'AI',
      last: 'CAPA-2026-014 is blocking dispatch', time: '08:00', unread: 1, sub: 'System channel · automated',
      msgs: [
        { d: 'Today' },
        { sys: 1, t: 'Nightly sync with Monarch Print completed — 3 jobs updated, 1 challan reconciled' },
        { w: 'ERP Alerts', t: 'CAPA-2026-014 is blocking dispatch for SO/26-0188. Leak test record is not attached.', tm: '08:00', ref: 'CAPA-2026-014' },
        { w: 'ERP Alerts', t: 'Indent IND/26-0314 has been pending approval for 18 hours.', tm: '08:00', ref: 'IND/26-0314' }
      ]}
  ];

  var NOTIFS = [
    { ic: 'r', i: 'alertTri', t: 'Dispatch blocked — SO/26-0188', p: 'CAPA-2026-014 requires a leak test record before the delivery note.', tm: '12 min ago', u: 1 },
    { ic: 'o', i: 'zap', t: 'Printing data synced', p: 'Monarch Print updated PWO/26-0202 — printing 62% complete.', tm: '38 min ago', u: 1 },
    { ic: 'w', i: 'check2', t: 'Indent awaiting approval', p: 'IND/26-0314 raised by PWO/26-0202 — PO is blocked.', tm: '1 hr ago', u: 1 },
    { ic: 'r', i: 'shield', t: 'IPQC failed — CM-01', p: 'Cavity 5 clamp pressure 137 bar against 140–150 bar.', tm: '2 hrs ago', u: 0 },
    { ic: 'g', i: 'award', t: 'COA generated', p: 'COA/26-0294 issued for batch FG-LT26-0201-A.', tm: '3 hrs ago', u: 0 },
    { ic: 'b', i: 'truck', t: 'GRN posted', p: 'GRN/26-0625 — 470 kg received, moved to QC hold.', tm: '4 hrs ago', u: 0 }
  ];

  /* ---------------- build shell ---------------- */
  function build() {
    var page = document.getElementById('page');
    if (!page) return;

    var F = favs();

    /* --- favourites block --- */
    function itemHTML(it, isFav) {
      var on = it.h.toLowerCase() === here ? ' on' : '';
      return '<a class="sb-i' + on + '" href="' + it.h + '" title="' + it.t + '">' +
        svg(it.i) + '<span>' + it.t + '</span>' +
        (it.live ? '<i class="live" title="Live data sync"></i>' : '') +
        '<svg class="star' + (isFav ? ' on' : '') + '" data-fav="' + it.h + '" viewBox="0 0 24 24" ' +
        'fill="' + (isFav ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round">' + I.star + '</svg></a>';
    }

    var allItems = [];
    NAV.forEach(function (g) { g.items.forEach(function (it) { allItems.push(it); }); });

    var favHTML = '';
    var favItems = allItems.filter(function (it) { return F.indexOf(it.h) > -1; });
    if (favItems.length) {
      favHTML = '<div class="sb-g open" data-g="__fav"><div class="sb-grp-t sb-fav-t">' +
        '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">' + I.star + '</svg>' +
        'Favourites</div><div class="sb-items">' +
        favItems.map(function (it) { return itemHTML(it, true); }).join('') + '</div></div>';
    }

    var nav = favHTML;
    NAV.forEach(function (grp, gi) {
      var hasActive = grp.items.some(function (it) { return it.h.toLowerCase() === here; });
      if (grp.solo) {                                  // single link, no group wrapper
        var s = grp.items[0];
        nav += '<div class="sb-g open" data-g="' + grp.g + '" data-gi="' + gi + '">' +
               '<a class="sb-gh' + (hasActive ? ' hasactive' : '') + '" href="' + s.h + '"' +
               (hasActive ? ' style="background:rgb(var(--color-primary));color:#fff"' : '') + '>' +
               svg(grp.i, 'gi') + '<span class="gt">' + grp.g + '</span></a></div>';
        return;
      }
      var stored = ls('lt.g.' + grp.g);
      var open = hasActive || stored === '1' || (stored === null && grp.solo);
      nav += '<div class="sb-g' + (open ? ' open' : '') + (hasActive ? ' hasactive' : '') +
             '" data-g="' + grp.g + '" data-gi="' + gi + '">' +
             '<button class="sb-gh">' + svg(grp.i, 'gi') +
               '<span class="gt">' + grp.g + '</span>' +
               '<span class="gn">' + grp.items.length + '</span>' +
               svg('chevR', 'chv') +
             '</button><div class="sb-items">' +
             grp.items.map(function (it) { return itemHTML(it, F.indexOf(it.h) > -1); }).join('') +
             '</div></div>';
    });

    var totalUnread = CHATS.reduce(function (n, c) { return n + c.unread; }, 0);
    var notifUnread = NOTIFS.filter(function (n) { return n.u; }).length;

    var app = document.createElement('div');
    app.className = 'app';
    app.innerHTML =
      '<aside class="sb">' +
        '<div class="sb-top">' +
          '<div class="sb-logo">LT</div>' +
          '<div class="sb-name">Lamitube ERP<small>Indus Tubes Pvt. Ltd.</small></div>' +
        '</div>' +
        '<div class="sb-srch">' + svg('search2') + '<input id="sbSrch" placeholder="Search menu…"></div>' +
        '<nav class="sb-scroll" id="sbNav">' + nav + '</nav>' +
        '<div class="sb-ft">' +
          '<a class="conn" href="integration.html" title="Printing data sync">' +
            '<i class="d"></i><span><b>Printing sync live</b><small>Monarch Print · 2 min ago</small></span>' +
          '</a>' +
        '</div>' +
      '</aside>' +
      '<div class="main">' +
        '<header class="hdr">' +
          '<button class="icn-btn" id="btnSb" title="Toggle sidebar">' + svg('panel') + '</button>' +
          '<div class="hdr-search">' + svg('search2') +
            '<input placeholder="Search order, job, batch, item…">' +
          '</div>' +
          '<div class="hdr-sp"></div>' +
          '<select class="unit-sel" title="Production unit">' +
            '<option>Unit 1 — Baddi</option><option>Unit 2 — Haridwar</option>' +
          '</select>' +
          '<button class="icn-btn" id="btnTheme" title="Theme">' + svg('moon') + '</button>' +
          '<button class="icn-btn" id="btnMail" title="Email">' + svg('mail') + '</button>' +
          '<button class="icn-btn" id="btnChat" title="Internal messages">' + svg('msgs') +
            (totalUnread ? '<i class="dotb"></i>' : '') + '</button>' +
          '<button class="icn-btn" id="btnBell" title="Notifications">' + svg('bell') +
            (notifUnread ? '<i class="dotb"></i>' : '') + '</button>' +
          '<div class="avatar" id="btnAv" title="Account">AK</div>' +
        '</header>' +
        '<div class="content"><div class="content-in" id="slot"></div></div>' +
      '</div>' +
      '<div class="sb-fly" id="sbFly"></div>' +
      '<div class="toasts" id="toasts"></div>';

    document.body.insertBefore(app, page);
    app.querySelector('#slot').appendChild(page);

    var main = app.querySelector('.main');
    main.insertAdjacentHTML('beforeend', notifPanel(notifUnread) + avatarMenu());
    document.body.insertAdjacentHTML('beforeend', chatPanel());

    wireSidebar(app);
    wireHeader(app, main);
    wireChat();
    initTabs();
    initIcons();
    seedToasts();
  }

  /* ---------------- sidebar behaviour ---------------- */
  function wireSidebar(app) {
    if (ls('lt.sb') === '1') app.classList.add('collapsed');

    app.querySelector('#btnSb').addEventListener('click', function () {
      var c = app.classList.toggle('collapsed');
      ls('lt.sb', c ? '1' : '0');
      hideFly();
    });

    /* group open / close */
    app.querySelector('#sbNav').addEventListener('click', function (e) {
      var st = e.target.closest('[data-fav]');
      if (st) {
        e.preventDefault(); e.stopPropagation();
        var h = st.getAttribute('data-fav');
        var F = favs(); var ix = F.indexOf(h);
        if (ix > -1) F.splice(ix, 1); else F.push(h);
        saveFavs(F);
        location.reload();
        return;
      }
      var gh = e.target.closest('.sb-gh');
      if (!gh) return;
      var g = gh.parentElement;
      if (app.classList.contains('collapsed')) { showFly(g, gh); return; }
      var open = g.classList.toggle('open');
      ls('lt.g.' + g.dataset.g, open ? '1' : '0');
    });

    /* flyout on hover when collapsed */
    app.querySelector('#sbNav').addEventListener('mouseover', function (e) {
      if (!app.classList.contains('collapsed')) return;
      var gh = e.target.closest('.sb-gh');
      if (gh) showFly(gh.parentElement, gh);
    });
    app.querySelector('.sb').addEventListener('mouseleave', function () {
      setTimeout(function () { if (!flyHover) hideFly(); }, 180);
    });

    /* menu search */
    var si = app.querySelector('#sbSrch');
    si.addEventListener('input', function () {
      var q = si.value.trim().toLowerCase();
      app.querySelectorAll('.sb-g').forEach(function (g) {
        if (g.dataset.g === '__fav') { g.style.display = q ? 'none' : ''; return; }
        var any = false;
        g.querySelectorAll('.sb-i').forEach(function (a) {
          var hit = !q || a.textContent.toLowerCase().indexOf(q) > -1;
          a.style.display = hit ? '' : 'none';
          if (hit) any = true;
        });
        g.style.display = any ? '' : 'none';
        if (q && any) g.classList.add('open');
        else if (!q) g.classList.toggle('open', g.classList.contains('hasactive') ||
          ls('lt.g.' + g.dataset.g) === '1');
      });
    });

    var act = app.querySelector('.sb-i.on');
    if (act) act.scrollIntoView({ block: 'center' });
  }

  var flyHover = false;
  function showFly(g, gh) {
    var fly = document.getElementById('sbFly');
    var gi = +g.dataset.gi;
    if (isNaN(gi)) return;
    var grp = NAV[gi];
    fly.innerHTML = '<div class="ft">' + grp.g + '</div>' + grp.items.map(function (it) {
      var on = it.h.toLowerCase() === here ? ' class="on"' : '';
      return '<a' + on + ' href="' + it.h + '">' + svg(it.i) + it.t + '</a>';
    }).join('');
    var r = gh.getBoundingClientRect();
    fly.style.top = Math.min(r.top, window.innerHeight - (grp.items.length * 30 + 46)) + 'px';
    fly.classList.add('on');
    fly.onmouseenter = function () { flyHover = true; };
    fly.onmouseleave = function () { flyHover = false; hideFly(); };
  }
  function hideFly() {
    var f = document.getElementById('sbFly');
    if (f) f.classList.remove('on');
  }

  /* ---------------- header panels ---------------- */
  function notifPanel(unread) {
    return '<div class="pop" id="popBell">' +
      '<div class="pop-h">' + svg('bell') + '<b>Notifications</b>' +
        '<span class="r"><span class="bdg r nodot">' + unread + ' new</span>' +
        '<button class="btn sm gh" title="Mark all read">' + svg('check2') + '</button></span></div>' +
      '<div class="pop-b">' + NOTIFS.map(function (n) {
        return '<div class="nrow' + (n.u ? ' unread' : '') + '">' +
          '<div class="ic ' + n.ic + '">' + svg(n.i) + '</div>' +
          '<div class="tx"><b>' + n.t + '</b><p>' + n.p + '</p><div class="tm">' + n.tm + '</div></div></div>';
      }).join('') + '</div>' +
      '<div class="pop-f"><a>View all notifications</a></div></div>';
  }

  function avatarMenu() {
    return '<div class="pop amenu" id="popAv">' +
      '<div class="me"><b>Amit Kumar</b><span>Plant Head · Unit 1 Baddi</span></div>' +
      '<a>' + svg('user') + 'My profile</a>' +
      '<a>' + svg('settings') + 'Preferences</a>' +
      '<a href="integration.html">' + svg('zap') + 'Integration settings</a>' +
      '<a>' + svg('logout') + 'Sign out</a></div>';
  }

  function wireHeader(app, main) {
    var btnT = app.querySelector('#btnTheme');
    function paint() {
      var d = document.documentElement.getAttribute('data-theme') === 'dark';
      btnT.innerHTML = svg(d ? 'sun' : 'moon');
    }
    if (ls('lt.theme') === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    paint();
    btnT.addEventListener('click', function () {
      var d = document.documentElement.getAttribute('data-theme') === 'dark';
      if (d) document.documentElement.removeAttribute('data-theme');
      else document.documentElement.setAttribute('data-theme', 'dark');
      ls('lt.theme', d ? 'light' : 'dark'); paint();
    });

    function toggle(id) {
      ['popBell', 'popAv'].forEach(function (x) {
        var el = document.getElementById(x);
        if (el) el.classList.toggle('on', x === id && !el.classList.contains('on'));
      });
    }
    app.querySelector('#btnBell').addEventListener('click', function (e) { e.stopPropagation(); toggle('popBell'); });
    app.querySelector('#btnAv').addEventListener('click', function (e) { e.stopPropagation(); toggle('popAv'); });
    app.querySelector('#btnMail').addEventListener('click', function () {
      toast({ k: 'msg', i: 'mail', t: 'Email panel', p: 'Customer and supplier mail box opens here in the full build.' });
    });
    app.querySelector('#btnChat').addEventListener('click', function (e) { e.stopPropagation(); openChat(); });
    document.addEventListener('click', function () { toggle(''); });
  }

  /* ---------------- chat ---------------- */
  function chatPanel() {
    return '<div class="chat-ovl" id="chatOvl"></div><div class="chat" id="chat">' +
      '<div class="chat-l">' +
        '<div class="chat-lh"><div class="t">' + svg('msgs') + '<b>Messages</b>' +
          '<button class="btn sm gh" style="margin-left:auto" title="New conversation">' + svg('plus') + '</button>' +
          '<button class="btn sm gh" id="chatX" title="Close">' + svg('x') + '</button></div>' +
          '<div class="s">' + svg('search2') + '<input placeholder="Search people, groups…"></div></div>' +
        '<div class="chat-list" id="chatList"></div>' +
      '</div>' +
      '<div class="chat-r">' +
        '<div class="chat-rh" id="chatHd"></div>' +
        '<div class="chat-msgs" id="chatMsgs"></div>' +
        '<div class="chat-c">' +
          '<div class="qk" id="chatQk"></div>' +
          '<div class="box">' +
            '<button class="icn-btn" title="Attach">' + svg('paperclip') + '</button>' +
            '<textarea id="chatIn" rows="1" placeholder="Write a message…  use @ to mention, # to link a document"></textarea>' +
            '<button class="btn pri" id="chatSend">' + svg('send') + 'Send</button>' +
          '</div></div>' +
      '</div></div>';
  }

  var curChat = 'prod';

  function renderList() {
    document.getElementById('chatList').innerHTML = CHATS.map(function (c) {
      return '<div class="crow' + (c.id === curChat ? ' on' : '') + '" data-c="' + c.id + '">' +
        '<div class="av" style="background:' + c.col + '">' + c.ini + '</div>' +
        '<div class="tx"><div class="n"><b>' + c.name + '</b>' +
          (c.kind === 'external' ? '<span class="ext">EXT</span>' : '') +
          (c.kind === 'bot' ? '<span class="bot">SYS</span>' : '') +
          '<span class="t">' + c.time + '</span></div>' +
          '<p>' + c.last + '</p></div>' +
        (c.unread ? '<span class="ub">' + c.unread + '</span>' : '') + '</div>';
    }).join('');
  }

  function renderThread() {
    var c = CHATS.filter(function (x) { return x.id === curChat; })[0];
    document.getElementById('chatHd').innerHTML =
      '<div class="av" style="background:' + c.col + '">' + c.ini + '</div>' +
      '<div><b>' + c.name + '</b><small>' + c.sub + '</small></div>' +
      '<div class="r"><button class="icn-btn" title="Call">' + svg('phone') + '</button>' +
      '<button class="icn-btn" title="Members">' + svg('users') + '</button></div>';

    document.getElementById('chatMsgs').innerHTML = c.msgs.map(function (m) {
      if (m.d) return '<div class="day">' + m.d + '</div>';
      if (m.sys) return '<div class="msg sys"><div class="bub">' + svg('zap') + ' ' + m.t + '</div></div>';
      return '<div class="msg' + (m.me ? ' me' : '') + '">' +
        (m.me ? '' : '<div class="who">' + m.w + '</div>') +
        '<div class="bub">' + m.t +
          (m.ref ? '<br><span class="ref">' + svg('link') + m.ref + '</span>' : '') +
        '</div><div class="tm">' + m.tm + '</div></div>';
    }).join('');

    var qk = c.id === 'print'
      ? ['Share the delta-E log', 'When is the lot returning?', 'Confirm wastage figure']
      : ['On it', 'Please share the record', 'Escalating this'];
    document.getElementById('chatQk').innerHTML = qk.map(function (q) {
      return '<button>' + q + '</button>';
    }).join('');

    var box = document.getElementById('chatMsgs');
    box.scrollTop = box.scrollHeight;
    c.unread = 0;
    renderList();
  }

  function openChat() {
    document.getElementById('chatOvl').classList.add('on');
    document.getElementById('chat').classList.add('on');
    renderList(); renderThread();
  }
  function closeChat() {
    document.getElementById('chatOvl').classList.remove('on');
    document.getElementById('chat').classList.remove('on');
  }
  window.openChat = openChat;

  function wireChat() {
    document.getElementById('chatOvl').addEventListener('click', closeChat);
    document.getElementById('chatX').addEventListener('click', closeChat);
    document.getElementById('chatList').addEventListener('click', function (e) {
      var r = e.target.closest('[data-c]');
      if (!r) return;
      curChat = r.dataset.c;
      renderThread();
    });
    document.getElementById('chatQk').addEventListener('click', function (e) {
      if (e.target.tagName === 'BUTTON') document.getElementById('chatIn').value = e.target.textContent;
    });
    function send() {
      var ta = document.getElementById('chatIn');
      var v = ta.value.trim();
      if (!v) return;
      var c = CHATS.filter(function (x) { return x.id === curChat; })[0];
      var now = new Date();
      c.msgs.push({ me: 1, t: v.replace(/</g, '&lt;'),
        tm: ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2) });
      c.last = v; c.time = 'now';
      ta.value = '';
      renderThread();
    }
    document.getElementById('chatSend').addEventListener('click', send);
    document.getElementById('chatIn').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeChat();
    });
  }

  /* ---------------- toasts ---------------- */
  function toast(o) {
    var box = document.getElementById('toasts');
    if (!box) return;
    var d = document.createElement('div');
    d.className = 'toast ' + (o.k || '');
    d.innerHTML = svg(o.i || 'bell') +
      '<div class="tx"><b>' + o.t + '</b><p>' + o.p + '</p>' +
      (o.act ? '<div class="act">' + o.act + '</div>' : '') + '</div>' +
      '<span class="x">' + svg('x') + '</span>';
    box.appendChild(d);
    d.querySelector('.x').addEventListener('click', function () { d.remove(); });
    if (!o.sticky) setTimeout(function () { d.remove(); }, o.ms || 9000);
  }
  window.toast = toast;

  function seedToasts() {
    setTimeout(function () {
      toast({ k: 'msg', i: 'zap', t: 'Printing data synced',
        p: 'Monarch Print updated PWO/26-0202 — printing 62% complete, 4 rolls on press.',
        act: '<a class="btn sm" href="integration.html">View sync</a>' });
    }, 1400);
    setTimeout(function () {
      toast({ k: 'warn', i: 'msgs', t: 'Monarch Print — 2 new messages',
        p: 'A. Sethi: “Lot 3 loaded on press, 62% done. Expecting dispatch back tomorrow evening.”',
        act: '<button class="btn sm pri" onclick="openChat()">Open chat</button>' });
    }, 4200);
  }

  /* ---------------- tabs / icons / modals ---------------- */
  function initTabs() {
    document.querySelectorAll('.tabs').forEach(function (bar) {
      bar.addEventListener('click', function (e) {
        var t = e.target.closest('.tab');
        if (!t || !t.dataset.pane) return;
        bar.querySelectorAll('.tab').forEach(function (x) { x.classList.remove('on'); });
        t.classList.add('on');
        var scope = bar.parentElement;
        scope.querySelectorAll(':scope > .tabpane, :scope .tabpane').forEach(function (p) {
          p.classList.toggle('on', p.id === t.dataset.pane);
        });
      });
    });
  }

  function initIcons() {
    document.querySelectorAll('[data-i]').forEach(function (el) {
      el.outerHTML = svg(el.dataset.i, el.className);
    });
  }

  window.openModal  = function (id) { var m = document.getElementById(id); if (m) m.classList.add('on'); };
  window.closeModal = function (id) { var m = document.getElementById(id); if (m) m.classList.remove('on'); };
  document.addEventListener('click', function (e) {
    if (e.target.classList && e.target.classList.contains('ovl')) e.target.classList.remove('on');
    var c = e.target.closest('[data-close]');
    if (c) closeModal(c.dataset.close);
  });

  window.capaAlert = function (opts) {
    var d = document.createElement('div');
    d.className = 'capa-pop';
    d.innerHTML =
      '<div class="t">' + svg('alertTri') + 'Active CAPA control' +
        '<span class="x" title="Dismiss">' + svg('x') + '</span></div>' +
      '<p>' + opts.text + '</p>' +
      '<div class="ref">' + opts.ref + '</div>' +
      '<div style="display:flex;gap:7px"><button class="btn sm pri">Acknowledge</button>' +
      '<a class="btn sm" href="capa.html">Open CAPA</a></div>';
    document.body.appendChild(d);
    d.querySelector('.x').addEventListener('click', function () { d.remove(); });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
