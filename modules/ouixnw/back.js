/* ozellik-zigzag-3 — Numaralı Özellik Listesi (1 Kas 2026, T1-B varyant).
   Yer tutucular: oz3head oz3list. Veri: json.data[] = [{baslik{}, metin{}}]; görsel yalnız başlık sütununda (desing.img).
   Ortak yardımcılar: esc t guvenliHref gorselYol evet sayi metinleriYaz (desing metinleri kaçışlı). */
var D = json.desing || {};
var L = json.lang || "tr";

/* HTML kaçışı — html'e giden her değer bundan geçer */
function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
/* Dil seçimi: aktif dil → tr → en → ilk anahtar (motorun wmPickLang'i) */
function t(v) { return wmPickLang(v, L); }
/* Bağlantı: dış/mailto/tel/# aynen; iç sayfa adı → dil önekli yol; javascript: vb. reddedilir */
function guvenliHref(v) {
  var s = String(v == null ? "" : v).trim();
  if (!s) { return ""; }
  if (/^\s*(javascript|vbscript|file|data):/i.test(s)) { return ""; }
  if (/^(https?:)?\/\//i.test(s) || /^(mailto:|tel:|#)/i.test(s) || s.charAt(0) === "/") { return s; }
  return wxLangInternalHref(s);
}
/* Görsel yolu: "/" ve http(s) aynen; yalın ad → /img/<ad>; tehlikeli şema → "" */
function gorselYol(v) {
  var s = String(v == null ? "" : v).trim();
  if (!s) { return ""; }
  if (/^\s*(javascript|vbscript|file|data):/i.test(s)) { return ""; }
  if (s.charAt(0) === "/" || /^https?:\/\//i.test(s)) { return s; }
  return "/img/" + s;
}
function evet(v, d) {
  if (v === undefined || v === null || v === "") { return d; }
  return !(v === false || v === "false" || v === 0 || v === "0");
}
function sayi(v, d, mn, mx) {
  var n = parseInt(v, 10);
  if (!isFinite(n)) { n = d; }
  return Math.min(mx, Math.max(mn, n));
}
/* desing'deki düz metin / {tr,en,ar} değerlerini {{anahtar}} yerine KAÇIŞLI yazar.
   Motor aynı yer tutucuyu ham yazardı; back.js önce davrandığı için kaçışsız değer html'e ulaşmaz. */
function metinleriYaz() {
  var k;
  for (k in D) {
    if (!Object.prototype.hasOwnProperty.call(D, k)) { continue; }
    var v = D[k];
    if (v == null) { continue; }
    var dilli = typeof v === "object" && !Array.isArray(v) && (typeof v.tr === "string" || typeof v.en === "string");
    if (typeof v === "object" && !dilli) { continue; }
    var deger = esc(t(v));
    var desen = new RegExp("\\{\\{" + String(k).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\}\\}", "g");
    html = html.replace(desen, function () { return deger; });
  }
}

var oz3Items = Array.isArray(json.data) ? json.data : [];
var oz3List = "";
var oz3N = 0;
var oz3i;
for (oz3i = 0; oz3i < oz3Items.length; oz3i++) {
  var it = oz3Items[oz3i] || {};
  var baslik = t(it.baslik);
  var metin = t(it.metin);
  if (!baslik && !metin) { continue; }
  oz3N++;
  oz3List += '<li class="modulex-oz3-item">' +
    '<span class="modulex-oz3-no" aria-hidden="true">' + (oz3N < 10 ? "0" + oz3N : String(oz3N)) + "</span>" +
    '<div class="modulex-oz3-metin">' +
    (baslik ? '<h3 class="modulex-oz3-h">' + esc(baslik) + "</h3>" : "") +
    (metin ? '<p class="modulex-oz3-p">' + esc(metin) + "</p>" : "") +
    "</div></li>";
}

var oz3Img = gorselYol(D.img);
var oz3Media = oz3Img ? '<img class="modulex-oz3-img" src="' + esc(oz3Img) + '" alt="' + esc(t(D.imgAlt)) + '" width="800" height="600" loading="lazy" decoding="async" />' : "";
var oz3CtaUrl = guvenliHref(D.ctaUrl);
var oz3Cta = oz3CtaUrl && t(D.ctaLabel) ? '<a class="modulex-oz3-cta" href="' + esc(oz3CtaUrl) + '">' + esc(t(D.ctaLabel)) + "</a>" : "";

var oz3Head = '<div class="modulex-oz3-head">' +
  (t(D.eyebrow) ? '<p class="modulex-oz3-eyebrow">' + esc(t(D.eyebrow)) + "</p>" : "") +
  (t(D.title) ? '<h2 class="modulex-oz3-title">' + esc(t(D.title)) + "</h2>" : "") +
  (t(D.description) ? '<p class="modulex-oz3-desc">' + esc(t(D.description)) + "</p>" : "") +
  oz3Cta + oz3Media + "</div>";

html = html.replace(/\{\{oz3head\}\}/g, function () { return oz3Head; });
html = html.replace(/\{\{oz3list\}\}/g, function () { return oz3List; });
metinleriYaz();
