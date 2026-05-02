var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");

// node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn2) {
    return fn2;
  }
  runInAsyncScope(fn2, thisArg, ...args) {
    return fn2.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// dist/_worker.js
var vo = Object.defineProperty;
var Sn = /* @__PURE__ */ __name((e) => {
  throw TypeError(e);
}, "Sn");
var bo = /* @__PURE__ */ __name((e, t, n) => t in e ? vo(e, t, { enumerable: true, configurable: true, writable: true, value: n }) : e[t] = n, "bo");
var w = /* @__PURE__ */ __name((e, t, n) => bo(e, typeof t != "symbol" ? t + "" : t, n), "w");
var tn = /* @__PURE__ */ __name((e, t, n) => t.has(e) || Sn("Cannot " + n), "tn");
var m = /* @__PURE__ */ __name((e, t, n) => (tn(e, t, "read from private field"), n ? n.call(e) : t.get(e)), "m");
var E = /* @__PURE__ */ __name((e, t, n) => t.has(e) ? Sn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), "E");
var T = /* @__PURE__ */ __name((e, t, n, s) => (tn(e, t, "write to private field"), s ? s.call(e, n) : t.set(e, n), n), "T");
var I = /* @__PURE__ */ __name((e, t, n) => (tn(e, t, "access private method"), n), "I");
var On = /* @__PURE__ */ __name((e, t, n, s) => ({ set _(o) {
  T(e, t, o, n);
}, get _() {
  return m(e, t, s);
} }), "On");
var In = /* @__PURE__ */ __name((e, t, n) => (s, o) => {
  let r = -1;
  return i(0);
  async function i(a) {
    if (a <= r) throw new Error("next() called multiple times");
    r = a;
    let d, c = false, l;
    if (e[a] ? (l = e[a][0][0], s.req.routeIndex = a) : l = a === e.length && o || void 0, l) try {
      d = await l(s, () => i(a + 1));
    } catch (u) {
      if (u instanceof Error && t) s.error = u, d = await t(u, s), c = true;
      else throw u;
    }
    else s.finalized === false && n && (d = await n(s));
    return d && (s.finalized === false || c) && (s.res = d), s;
  }
  __name(i, "i");
}, "In");
var Nn = class extends Error {
  static {
    __name(this, "Nn");
  }
  constructor(t = 500, n) {
    super(n == null ? void 0 : n.message, { cause: n == null ? void 0 : n.cause });
    w(this, "res");
    w(this, "status");
    this.res = n == null ? void 0 : n.res, this.status = t;
  }
  getResponse() {
    return this.res ? new Response(this.res.body, { status: this.status, headers: this.res.headers }) : new Response(this.message, { status: this.status });
  }
};
var wo = /* @__PURE__ */ Symbol();
var ko = /* @__PURE__ */ __name(async (e, t = /* @__PURE__ */ Object.create(null)) => {
  const { all: n = false, dot: s = false } = t, r = (e instanceof ms ? e.raw.headers : e.headers).get("Content-Type");
  return r != null && r.startsWith("multipart/form-data") || r != null && r.startsWith("application/x-www-form-urlencoded") ? xo(e, { all: n, dot: s }) : {};
}, "ko");
async function xo(e, t) {
  const n = await e.formData();
  return n ? To(n, t) : {};
}
__name(xo, "xo");
function To(e, t) {
  const n = /* @__PURE__ */ Object.create(null);
  return e.forEach((s, o) => {
    t.all || o.endsWith("[]") ? Eo(n, o, s) : n[o] = s;
  }), t.dot && Object.entries(n).forEach(([s, o]) => {
    s.includes(".") && (So(n, s, o), delete n[s]);
  }), n;
}
__name(To, "To");
var Eo = /* @__PURE__ */ __name((e, t, n) => {
  e[t] !== void 0 ? Array.isArray(e[t]) ? e[t].push(n) : e[t] = [e[t], n] : t.endsWith("[]") ? e[t] = [n] : e[t] = n;
}, "Eo");
var So = /* @__PURE__ */ __name((e, t, n) => {
  let s = e;
  const o = t.split(".");
  o.forEach((r, i) => {
    i === o.length - 1 ? s[r] = n : ((!s[r] || typeof s[r] != "object" || Array.isArray(s[r]) || s[r] instanceof File) && (s[r] = /* @__PURE__ */ Object.create(null)), s = s[r]);
  });
}, "So");
var ls = /* @__PURE__ */ __name((e) => {
  const t = e.split("/");
  return t[0] === "" && t.shift(), t;
}, "ls");
var Oo = /* @__PURE__ */ __name((e) => {
  const { groups: t, path: n } = Io(e), s = ls(n);
  return No(s, t);
}, "Oo");
var Io = /* @__PURE__ */ __name((e) => {
  const t = [];
  return e = e.replace(/\{[^}]+\}/g, (n, s) => {
    const o = `@${s}`;
    return t.push([o, n]), o;
  }), { groups: t, path: e };
}, "Io");
var No = /* @__PURE__ */ __name((e, t) => {
  for (let n = t.length - 1; n >= 0; n--) {
    const [s] = t[n];
    for (let o = e.length - 1; o >= 0; o--) if (e[o].includes(s)) {
      e[o] = e[o].replace(s, t[n][1]);
      break;
    }
  }
  return e;
}, "No");
var Nt = {};
var $o = /* @__PURE__ */ __name((e, t) => {
  if (e === "*") return "*";
  const n = e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (n) {
    const s = `${e}#${t}`;
    return Nt[s] || (n[2] ? Nt[s] = t && t[0] !== ":" && t[0] !== "*" ? [s, n[1], new RegExp(`^${n[2]}(?=/${t})`)] : [e, n[1], new RegExp(`^${n[2]}$`)] : Nt[s] = [e, n[1], true]), Nt[s];
  }
  return null;
}, "$o");
var Jt = /* @__PURE__ */ __name((e, t) => {
  try {
    return t(e);
  } catch {
    return e.replace(/(?:%[0-9A-Fa-f]{2})+/g, (n) => {
      try {
        return t(n);
      } catch {
        return n;
      }
    });
  }
}, "Jt");
var jo = /* @__PURE__ */ __name((e) => Jt(e, decodeURI), "jo");
var us = /* @__PURE__ */ __name((e) => {
  const t = e.url, n = t.indexOf("/", t.indexOf(":") + 4);
  let s = n;
  for (; s < t.length; s++) {
    const o = t.charCodeAt(s);
    if (o === 37) {
      const r = t.indexOf("?", s), i = t.indexOf("#", s), a = r === -1 ? i === -1 ? void 0 : i : i === -1 ? r : Math.min(r, i), d = t.slice(n, a);
      return jo(d.includes("%25") ? d.replace(/%25/g, "%2525") : d);
    } else if (o === 63 || o === 35) break;
  }
  return t.slice(n, s);
}, "us");
var Ao = /* @__PURE__ */ __name((e) => {
  const t = us(e);
  return t.length > 1 && t.at(-1) === "/" ? t.slice(0, -1) : t;
}, "Ao");
var Be = /* @__PURE__ */ __name((e, t, ...n) => (n.length && (t = Be(t, ...n)), `${(e == null ? void 0 : e[0]) === "/" ? "" : "/"}${e}${t === "/" ? "" : `${(e == null ? void 0 : e.at(-1)) === "/" ? "" : "/"}${(t == null ? void 0 : t[0]) === "/" ? t.slice(1) : t}`}`), "Be");
var ps = /* @__PURE__ */ __name((e) => {
  if (e.charCodeAt(e.length - 1) !== 63 || !e.includes(":")) return null;
  const t = e.split("/"), n = [];
  let s = "";
  return t.forEach((o) => {
    if (o !== "" && !/\:/.test(o)) s += "/" + o;
    else if (/\:/.test(o)) if (/\?/.test(o)) {
      n.length === 0 && s === "" ? n.push("/") : n.push(s);
      const r = o.replace("?", "");
      s += "/" + r, n.push(s);
    } else s += "/" + o;
  }), n.filter((o, r, i) => i.indexOf(o) === r);
}, "ps");
var nn = /* @__PURE__ */ __name((e) => /[%+]/.test(e) ? (e.indexOf("+") !== -1 && (e = e.replace(/\+/g, " ")), e.indexOf("%") !== -1 ? Jt(e, pn) : e) : e, "nn");
var fs = /* @__PURE__ */ __name((e, t, n) => {
  let s;
  if (!n && t && !/[%+]/.test(t)) {
    let i = e.indexOf("?", 8);
    if (i === -1) return;
    for (e.startsWith(t, i + 1) || (i = e.indexOf(`&${t}`, i + 1)); i !== -1; ) {
      const a = e.charCodeAt(i + t.length + 1);
      if (a === 61) {
        const d = i + t.length + 2, c = e.indexOf("&", d);
        return nn(e.slice(d, c === -1 ? void 0 : c));
      } else if (a == 38 || isNaN(a)) return "";
      i = e.indexOf(`&${t}`, i + 1);
    }
    if (s = /[%+]/.test(e), !s) return;
  }
  const o = {};
  s ?? (s = /[%+]/.test(e));
  let r = e.indexOf("?", 8);
  for (; r !== -1; ) {
    const i = e.indexOf("&", r + 1);
    let a = e.indexOf("=", r);
    a > i && i !== -1 && (a = -1);
    let d = e.slice(r + 1, a === -1 ? i === -1 ? void 0 : i : a);
    if (s && (d = nn(d)), r = i, d === "") continue;
    let c;
    a === -1 ? c = "" : (c = e.slice(a + 1, i === -1 ? void 0 : i), s && (c = nn(c))), n ? (o[d] && Array.isArray(o[d]) || (o[d] = []), o[d].push(c)) : o[d] ?? (o[d] = c);
  }
  return t ? o[t] : o;
}, "fs");
var zo = fs;
var Ro = /* @__PURE__ */ __name((e, t) => fs(e, t, true), "Ro");
var pn = decodeURIComponent;
var $n = /* @__PURE__ */ __name((e) => Jt(e, pn), "$n");
var Ke;
var te;
var he;
var hs;
var gs;
var an;
var ge;
var os;
var ms = (os = class {
  static {
    __name(this, "os");
  }
  constructor(e, t = "/", n = [[]]) {
    E(this, he);
    w(this, "raw");
    E(this, Ke);
    E(this, te);
    w(this, "routeIndex", 0);
    w(this, "path");
    w(this, "bodyCache", {});
    E(this, ge, (e2) => {
      const { bodyCache: t2, raw: n2 } = this, s = t2[e2];
      if (s) return s;
      const o = Object.keys(t2)[0];
      return o ? t2[o].then((r) => (o === "json" && (r = JSON.stringify(r)), new Response(r)[e2]())) : t2[e2] = n2[e2]();
    });
    this.raw = e, this.path = t, T(this, te, n), T(this, Ke, {});
  }
  param(e) {
    return e ? I(this, he, hs).call(this, e) : I(this, he, gs).call(this);
  }
  query(e) {
    return zo(this.url, e);
  }
  queries(e) {
    return Ro(this.url, e);
  }
  header(e) {
    if (e) return this.raw.headers.get(e) ?? void 0;
    const t = {};
    return this.raw.headers.forEach((n, s) => {
      t[s] = n;
    }), t;
  }
  async parseBody(e) {
    var t;
    return (t = this.bodyCache).parsedBody ?? (t.parsedBody = await ko(this, e));
  }
  json() {
    return m(this, ge).call(this, "text").then((e) => JSON.parse(e));
  }
  text() {
    return m(this, ge).call(this, "text");
  }
  arrayBuffer() {
    return m(this, ge).call(this, "arrayBuffer");
  }
  blob() {
    return m(this, ge).call(this, "blob");
  }
  formData() {
    return m(this, ge).call(this, "formData");
  }
  addValidatedData(e, t) {
    m(this, Ke)[e] = t;
  }
  valid(e) {
    return m(this, Ke)[e];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get [wo]() {
    return m(this, te);
  }
  get matchedRoutes() {
    return m(this, te)[0].map(([[, e]]) => e);
  }
  get routePath() {
    return m(this, te)[0].map(([[, e]]) => e)[this.routeIndex].path;
  }
}, Ke = /* @__PURE__ */ new WeakMap(), te = /* @__PURE__ */ new WeakMap(), he = /* @__PURE__ */ new WeakSet(), hs = /* @__PURE__ */ __name(function(e) {
  const t = m(this, te)[0][this.routeIndex][1][e], n = I(this, he, an).call(this, t);
  return n && /\%/.test(n) ? $n(n) : n;
}, "hs"), gs = /* @__PURE__ */ __name(function() {
  const e = {}, t = Object.keys(m(this, te)[0][this.routeIndex][1]);
  for (const n of t) {
    const s = I(this, he, an).call(this, m(this, te)[0][this.routeIndex][1][n]);
    s !== void 0 && (e[n] = /\%/.test(s) ? $n(s) : s);
  }
  return e;
}, "gs"), an = /* @__PURE__ */ __name(function(e) {
  return m(this, te)[1] ? m(this, te)[1][e] : e;
}, "an"), ge = /* @__PURE__ */ new WeakMap(), os);
var Do = { Stringify: 1 };
var _s = /* @__PURE__ */ __name(async (e, t, n, s, o) => {
  typeof e == "object" && !(e instanceof String) && (e instanceof Promise || (e = e.toString()), e instanceof Promise && (e = await e));
  const r = e.callbacks;
  return r != null && r.length ? (o ? o[0] += e : o = [e], Promise.all(r.map((a) => a({ phase: t, buffer: o, context: s }))).then((a) => Promise.all(a.filter(Boolean).map((d) => _s(d, t, false, s, o))).then(() => o[0]))) : Promise.resolve(e);
}, "_s");
var Lo = "text/plain; charset=UTF-8";
var sn = /* @__PURE__ */ __name((e, t) => ({ "Content-Type": e, ...t }), "sn");
var mt;
var ht;
var ue;
var Ge;
var pe;
var K;
var gt;
var Ve;
var Ye;
var je;
var _t;
var yt;
var _e;
var Je;
var rs;
var Co = (rs = class {
  static {
    __name(this, "rs");
  }
  constructor(e, t) {
    E(this, _e);
    E(this, mt);
    E(this, ht);
    w(this, "env", {});
    E(this, ue);
    w(this, "finalized", false);
    w(this, "error");
    E(this, Ge);
    E(this, pe);
    E(this, K);
    E(this, gt);
    E(this, Ve);
    E(this, Ye);
    E(this, je);
    E(this, _t);
    E(this, yt);
    w(this, "render", (...e2) => (m(this, Ve) ?? T(this, Ve, (t2) => this.html(t2)), m(this, Ve).call(this, ...e2)));
    w(this, "setLayout", (e2) => T(this, gt, e2));
    w(this, "getLayout", () => m(this, gt));
    w(this, "setRenderer", (e2) => {
      T(this, Ve, e2);
    });
    w(this, "header", (e2, t2, n) => {
      this.finalized && T(this, K, new Response(m(this, K).body, m(this, K)));
      const s = m(this, K) ? m(this, K).headers : m(this, je) ?? T(this, je, new Headers());
      t2 === void 0 ? s.delete(e2) : n != null && n.append ? s.append(e2, t2) : s.set(e2, t2);
    });
    w(this, "status", (e2) => {
      T(this, Ge, e2);
    });
    w(this, "set", (e2, t2) => {
      m(this, ue) ?? T(this, ue, /* @__PURE__ */ new Map()), m(this, ue).set(e2, t2);
    });
    w(this, "get", (e2) => m(this, ue) ? m(this, ue).get(e2) : void 0);
    w(this, "newResponse", (...e2) => I(this, _e, Je).call(this, ...e2));
    w(this, "body", (e2, t2, n) => I(this, _e, Je).call(this, e2, t2, n));
    w(this, "text", (e2, t2, n) => !m(this, je) && !m(this, Ge) && !t2 && !n && !this.finalized ? new Response(e2) : I(this, _e, Je).call(this, e2, t2, sn(Lo, n)));
    w(this, "json", (e2, t2, n) => I(this, _e, Je).call(this, JSON.stringify(e2), t2, sn("application/json", n)));
    w(this, "html", (e2, t2, n) => {
      const s = /* @__PURE__ */ __name((o) => I(this, _e, Je).call(this, o, t2, sn("text/html; charset=UTF-8", n)), "s");
      return typeof e2 == "object" ? _s(e2, Do.Stringify, false, {}).then(s) : s(e2);
    });
    w(this, "redirect", (e2, t2) => {
      const n = String(e2);
      return this.header("Location", /[^\x00-\xFF]/.test(n) ? encodeURI(n) : n), this.newResponse(null, t2 ?? 302);
    });
    w(this, "notFound", () => (m(this, Ye) ?? T(this, Ye, () => new Response()), m(this, Ye).call(this, this)));
    T(this, mt, e), t && (T(this, pe, t.executionCtx), this.env = t.env, T(this, Ye, t.notFoundHandler), T(this, yt, t.path), T(this, _t, t.matchResult));
  }
  get req() {
    return m(this, ht) ?? T(this, ht, new ms(m(this, mt), m(this, yt), m(this, _t))), m(this, ht);
  }
  get event() {
    if (m(this, pe) && "respondWith" in m(this, pe)) return m(this, pe);
    throw Error("This context has no FetchEvent");
  }
  get executionCtx() {
    if (m(this, pe)) return m(this, pe);
    throw Error("This context has no ExecutionContext");
  }
  get res() {
    return m(this, K) || T(this, K, new Response(null, { headers: m(this, je) ?? T(this, je, new Headers()) }));
  }
  set res(e) {
    if (m(this, K) && e) {
      e = new Response(e.body, e);
      for (const [t, n] of m(this, K).headers.entries()) if (t !== "content-type") if (t === "set-cookie") {
        const s = m(this, K).headers.getSetCookie();
        e.headers.delete("set-cookie");
        for (const o of s) e.headers.append("set-cookie", o);
      } else e.headers.set(t, n);
    }
    T(this, K, e), this.finalized = true;
  }
  get var() {
    return m(this, ue) ? Object.fromEntries(m(this, ue)) : {};
  }
}, mt = /* @__PURE__ */ new WeakMap(), ht = /* @__PURE__ */ new WeakMap(), ue = /* @__PURE__ */ new WeakMap(), Ge = /* @__PURE__ */ new WeakMap(), pe = /* @__PURE__ */ new WeakMap(), K = /* @__PURE__ */ new WeakMap(), gt = /* @__PURE__ */ new WeakMap(), Ve = /* @__PURE__ */ new WeakMap(), Ye = /* @__PURE__ */ new WeakMap(), je = /* @__PURE__ */ new WeakMap(), _t = /* @__PURE__ */ new WeakMap(), yt = /* @__PURE__ */ new WeakMap(), _e = /* @__PURE__ */ new WeakSet(), Je = /* @__PURE__ */ __name(function(e, t, n) {
  const s = m(this, K) ? new Headers(m(this, K).headers) : m(this, je) ?? new Headers();
  if (typeof t == "object" && "headers" in t) {
    const r = t.headers instanceof Headers ? t.headers : new Headers(t.headers);
    for (const [i, a] of r) i.toLowerCase() === "set-cookie" ? s.append(i, a) : s.set(i, a);
  }
  if (n) for (const [r, i] of Object.entries(n)) if (typeof i == "string") s.set(r, i);
  else {
    s.delete(r);
    for (const a of i) s.append(r, a);
  }
  const o = typeof t == "number" ? t : (t == null ? void 0 : t.status) ?? m(this, Ge);
  return new Response(e, { status: o, headers: s });
}, "Je"), rs);
var Z = "ALL";
var Po = "all";
var Mo = ["get", "post", "put", "delete", "options", "patch"];
var ys = "Can not add a route since the matcher is already built.";
var vs = class extends Error {
  static {
    __name(this, "vs");
  }
};
var Uo = "__COMPOSED_HANDLER";
var Zo = /* @__PURE__ */ __name((e) => e.text("404 Not Found", 404), "Zo");
var jn = /* @__PURE__ */ __name((e, t) => {
  if ("getResponse" in e) {
    const n = e.getResponse();
    return t.newResponse(n.body, n);
  }
  return console.error(e), t.text("Internal Server Error", 500);
}, "jn");
var re;
var F;
var bs;
var ie;
var Ie;
var zt;
var Rt;
var Qe;
var Fo = (Qe = class {
  static {
    __name(this, "Qe");
  }
  constructor(t = {}) {
    E(this, F);
    w(this, "get");
    w(this, "post");
    w(this, "put");
    w(this, "delete");
    w(this, "options");
    w(this, "patch");
    w(this, "all");
    w(this, "on");
    w(this, "use");
    w(this, "router");
    w(this, "getPath");
    w(this, "_basePath", "/");
    E(this, re, "/");
    w(this, "routes", []);
    E(this, ie, Zo);
    w(this, "errorHandler", jn);
    w(this, "onError", (t2) => (this.errorHandler = t2, this));
    w(this, "notFound", (t2) => (T(this, ie, t2), this));
    w(this, "fetch", (t2, ...n) => I(this, F, Rt).call(this, t2, n[1], n[0], t2.method));
    w(this, "request", (t2, n, s2, o2) => t2 instanceof Request ? this.fetch(n ? new Request(t2, n) : t2, s2, o2) : (t2 = t2.toString(), this.fetch(new Request(/^https?:\/\//.test(t2) ? t2 : `http://localhost${Be("/", t2)}`, n), s2, o2)));
    w(this, "fire", () => {
      addEventListener("fetch", (t2) => {
        t2.respondWith(I(this, F, Rt).call(this, t2.request, t2, void 0, t2.request.method));
      });
    });
    [...Mo, Po].forEach((r) => {
      this[r] = (i, ...a) => (typeof i == "string" ? T(this, re, i) : I(this, F, Ie).call(this, r, m(this, re), i), a.forEach((d) => {
        I(this, F, Ie).call(this, r, m(this, re), d);
      }), this);
    }), this.on = (r, i, ...a) => {
      for (const d of [i].flat()) {
        T(this, re, d);
        for (const c of [r].flat()) a.map((l) => {
          I(this, F, Ie).call(this, c.toUpperCase(), m(this, re), l);
        });
      }
      return this;
    }, this.use = (r, ...i) => (typeof r == "string" ? T(this, re, r) : (T(this, re, "*"), i.unshift(r)), i.forEach((a) => {
      I(this, F, Ie).call(this, Z, m(this, re), a);
    }), this);
    const { strict: s, ...o } = t;
    Object.assign(this, o), this.getPath = s ?? true ? t.getPath ?? us : Ao;
  }
  route(t, n) {
    const s = this.basePath(t);
    return n.routes.map((o) => {
      var i;
      let r;
      n.errorHandler === jn ? r = o.handler : (r = /* @__PURE__ */ __name(async (a, d) => (await In([], n.errorHandler)(a, () => o.handler(a, d))).res, "r"), r[Uo] = o.handler), I(i = s, F, Ie).call(i, o.method, o.path, r);
    }), this;
  }
  basePath(t) {
    const n = I(this, F, bs).call(this);
    return n._basePath = Be(this._basePath, t), n;
  }
  mount(t, n, s) {
    let o, r;
    s && (typeof s == "function" ? r = s : (r = s.optionHandler, s.replaceRequest === false ? o = /* @__PURE__ */ __name((d) => d, "o") : o = s.replaceRequest));
    const i = r ? (d) => {
      const c = r(d);
      return Array.isArray(c) ? c : [c];
    } : (d) => {
      let c;
      try {
        c = d.executionCtx;
      } catch {
      }
      return [d.env, c];
    };
    o || (o = (() => {
      const d = Be(this._basePath, t), c = d === "/" ? 0 : d.length;
      return (l) => {
        const u = new URL(l.url);
        return u.pathname = u.pathname.slice(c) || "/", new Request(u, l);
      };
    })());
    const a = /* @__PURE__ */ __name(async (d, c) => {
      const l = await n(o(d.req.raw), ...i(d));
      if (l) return l;
      await c();
    }, "a");
    return I(this, F, Ie).call(this, Z, Be(t, "*"), a), this;
  }
}, re = /* @__PURE__ */ new WeakMap(), F = /* @__PURE__ */ new WeakSet(), bs = /* @__PURE__ */ __name(function() {
  const t = new Qe({ router: this.router, getPath: this.getPath });
  return t.errorHandler = this.errorHandler, T(t, ie, m(this, ie)), t.routes = this.routes, t;
}, "bs"), ie = /* @__PURE__ */ new WeakMap(), Ie = /* @__PURE__ */ __name(function(t, n, s) {
  t = t.toUpperCase(), n = Be(this._basePath, n);
  const o = { basePath: this._basePath, path: n, method: t, handler: s };
  this.router.add(t, n, [s, o]), this.routes.push(o);
}, "Ie"), zt = /* @__PURE__ */ __name(function(t, n) {
  if (t instanceof Error) return this.errorHandler(t, n);
  throw t;
}, "zt"), Rt = /* @__PURE__ */ __name(function(t, n, s, o) {
  if (o === "HEAD") return (async () => new Response(null, await I(this, F, Rt).call(this, t, n, s, "GET")))();
  const r = this.getPath(t, { env: s }), i = this.router.match(o, r), a = new Co(t, { path: r, matchResult: i, env: s, executionCtx: n, notFoundHandler: m(this, ie) });
  if (i[0].length === 1) {
    let c;
    try {
      c = i[0][0][0][0](a, async () => {
        a.res = await m(this, ie).call(this, a);
      });
    } catch (l) {
      return I(this, F, zt).call(this, l, a);
    }
    return c instanceof Promise ? c.then((l) => l || (a.finalized ? a.res : m(this, ie).call(this, a))).catch((l) => I(this, F, zt).call(this, l, a)) : c ?? m(this, ie).call(this, a);
  }
  const d = In(i[0], this.errorHandler, m(this, ie));
  return (async () => {
    try {
      const c = await d(a);
      if (!c.finalized) throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");
      return c.res;
    } catch (c) {
      return I(this, F, zt).call(this, c, a);
    }
  })();
}, "Rt"), Qe);
var ws = [];
function Bo(e, t) {
  const n = this.buildAllMatchers(), s = /* @__PURE__ */ __name(((o, r) => {
    const i = n[o] || n[Z], a = i[2][r];
    if (a) return a;
    const d = r.match(i[0]);
    if (!d) return [[], ws];
    const c = d.indexOf("", 1);
    return [i[1][c], d];
  }), "s");
  return this.match = s, s(e, t);
}
__name(Bo, "Bo");
var Lt = "[^/]+";
var lt = ".*";
var ut = "(?:|/.*)";
var He = /* @__PURE__ */ Symbol();
var Jo = new Set(".\\+*[^]$()");
function Ho(e, t) {
  return e.length === 1 ? t.length === 1 ? e < t ? -1 : 1 : -1 : t.length === 1 || e === lt || e === ut ? 1 : t === lt || t === ut ? -1 : e === Lt ? 1 : t === Lt ? -1 : e.length === t.length ? e < t ? -1 : 1 : t.length - e.length;
}
__name(Ho, "Ho");
var Ae;
var ze;
var ae;
var Le;
var Xo = (Le = class {
  static {
    __name(this, "Le");
  }
  constructor() {
    E(this, Ae);
    E(this, ze);
    E(this, ae, /* @__PURE__ */ Object.create(null));
  }
  insert(t, n, s, o, r) {
    if (t.length === 0) {
      if (m(this, Ae) !== void 0) throw He;
      if (r) return;
      T(this, Ae, n);
      return;
    }
    const [i, ...a] = t, d = i === "*" ? a.length === 0 ? ["", "", lt] : ["", "", Lt] : i === "/*" ? ["", "", ut] : i.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let c;
    if (d) {
      const l = d[1];
      let u = d[2] || Lt;
      if (l && d[2] && (u === ".*" || (u = u.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:"), /\((?!\?:)/.test(u)))) throw He;
      if (c = m(this, ae)[u], !c) {
        if (Object.keys(m(this, ae)).some((f) => f !== lt && f !== ut)) throw He;
        if (r) return;
        c = m(this, ae)[u] = new Le(), l !== "" && T(c, ze, o.varIndex++);
      }
      !r && l !== "" && s.push([l, m(c, ze)]);
    } else if (c = m(this, ae)[i], !c) {
      if (Object.keys(m(this, ae)).some((l) => l.length > 1 && l !== lt && l !== ut)) throw He;
      if (r) return;
      c = m(this, ae)[i] = new Le();
    }
    c.insert(a, n, s, o, r);
  }
  buildRegExpStr() {
    const n = Object.keys(m(this, ae)).sort(Ho).map((s) => {
      const o = m(this, ae)[s];
      return (typeof m(o, ze) == "number" ? `(${s})@${m(o, ze)}` : Jo.has(s) ? `\\${s}` : s) + o.buildRegExpStr();
    });
    return typeof m(this, Ae) == "number" && n.unshift(`#${m(this, Ae)}`), n.length === 0 ? "" : n.length === 1 ? n[0] : "(?:" + n.join("|") + ")";
  }
}, Ae = /* @__PURE__ */ new WeakMap(), ze = /* @__PURE__ */ new WeakMap(), ae = /* @__PURE__ */ new WeakMap(), Le);
var Ft;
var vt;
var is;
var qo = (is = class {
  static {
    __name(this, "is");
  }
  constructor() {
    E(this, Ft, { varIndex: 0 });
    E(this, vt, new Xo());
  }
  insert(e, t, n) {
    const s = [], o = [];
    for (let i = 0; ; ) {
      let a = false;
      if (e = e.replace(/\{[^}]+\}/g, (d) => {
        const c = `@\\${i}`;
        return o[i] = [c, d], i++, a = true, c;
      }), !a) break;
    }
    const r = e.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = o.length - 1; i >= 0; i--) {
      const [a] = o[i];
      for (let d = r.length - 1; d >= 0; d--) if (r[d].indexOf(a) !== -1) {
        r[d] = r[d].replace(a, o[i][1]);
        break;
      }
    }
    return m(this, vt).insert(r, t, s, m(this, Ft), n), s;
  }
  buildRegExp() {
    let e = m(this, vt).buildRegExpStr();
    if (e === "") return [/^$/, [], []];
    let t = 0;
    const n = [], s = [];
    return e = e.replace(/#(\d+)|@(\d+)|\.\*\$/g, (o, r, i) => r !== void 0 ? (n[++t] = Number(r), "$()") : (i !== void 0 && (s[Number(i)] = ++t), "")), [new RegExp(`^${e}`), n, s];
  }
}, Ft = /* @__PURE__ */ new WeakMap(), vt = /* @__PURE__ */ new WeakMap(), is);
var Wo = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var Dt = /* @__PURE__ */ Object.create(null);
function ks(e) {
  return Dt[e] ?? (Dt[e] = new RegExp(e === "*" ? "" : `^${e.replace(/\/\*$|([.\\+*[^\]$()])/g, (t, n) => n ? `\\${n}` : "(?:|/.*)")}$`));
}
__name(ks, "ks");
function Ko() {
  Dt = /* @__PURE__ */ Object.create(null);
}
__name(Ko, "Ko");
function Go(e) {
  var c;
  const t = new qo(), n = [];
  if (e.length === 0) return Wo;
  const s = e.map((l) => [!/\*|\/:/.test(l[0]), ...l]).sort(([l, u], [f, p]) => l ? 1 : f ? -1 : u.length - p.length), o = /* @__PURE__ */ Object.create(null);
  for (let l = 0, u = -1, f = s.length; l < f; l++) {
    const [p, _, v] = s[l];
    p ? o[_] = [v.map(([g]) => [g, /* @__PURE__ */ Object.create(null)]), ws] : u++;
    let y;
    try {
      y = t.insert(_, u, p);
    } catch (g) {
      throw g === He ? new vs(_) : g;
    }
    p || (n[u] = v.map(([g, k]) => {
      const L = /* @__PURE__ */ Object.create(null);
      for (k -= 1; k >= 0; k--) {
        const [$, S] = y[k];
        L[$] = S;
      }
      return [g, L];
    }));
  }
  const [r, i, a] = t.buildRegExp();
  for (let l = 0, u = n.length; l < u; l++) for (let f = 0, p = n[l].length; f < p; f++) {
    const _ = (c = n[l][f]) == null ? void 0 : c[1];
    if (!_) continue;
    const v = Object.keys(_);
    for (let y = 0, g = v.length; y < g; y++) _[v[y]] = a[_[v[y]]];
  }
  const d = [];
  for (const l in i) d[l] = n[i[l]];
  return [r, d, o];
}
__name(Go, "Go");
function Ze(e, t) {
  if (e) {
    for (const n of Object.keys(e).sort((s, o) => o.length - s.length)) if (ks(n).test(t)) return [...e[n]];
  }
}
__name(Ze, "Ze");
var ye;
var ve;
var Bt;
var xs;
var as;
var Vo = (as = class {
  static {
    __name(this, "as");
  }
  constructor() {
    E(this, Bt);
    w(this, "name", "RegExpRouter");
    E(this, ye);
    E(this, ve);
    w(this, "match", Bo);
    T(this, ye, { [Z]: /* @__PURE__ */ Object.create(null) }), T(this, ve, { [Z]: /* @__PURE__ */ Object.create(null) });
  }
  add(e, t, n) {
    var a;
    const s = m(this, ye), o = m(this, ve);
    if (!s || !o) throw new Error(ys);
    s[e] || [s, o].forEach((d) => {
      d[e] = /* @__PURE__ */ Object.create(null), Object.keys(d[Z]).forEach((c) => {
        d[e][c] = [...d[Z][c]];
      });
    }), t === "/*" && (t = "*");
    const r = (t.match(/\/:/g) || []).length;
    if (/\*$/.test(t)) {
      const d = ks(t);
      e === Z ? Object.keys(s).forEach((c) => {
        var l;
        (l = s[c])[t] || (l[t] = Ze(s[c], t) || Ze(s[Z], t) || []);
      }) : (a = s[e])[t] || (a[t] = Ze(s[e], t) || Ze(s[Z], t) || []), Object.keys(s).forEach((c) => {
        (e === Z || e === c) && Object.keys(s[c]).forEach((l) => {
          d.test(l) && s[c][l].push([n, r]);
        });
      }), Object.keys(o).forEach((c) => {
        (e === Z || e === c) && Object.keys(o[c]).forEach((l) => d.test(l) && o[c][l].push([n, r]));
      });
      return;
    }
    const i = ps(t) || [t];
    for (let d = 0, c = i.length; d < c; d++) {
      const l = i[d];
      Object.keys(o).forEach((u) => {
        var f;
        (e === Z || e === u) && ((f = o[u])[l] || (f[l] = [...Ze(s[u], l) || Ze(s[Z], l) || []]), o[u][l].push([n, r - c + d + 1]));
      });
    }
  }
  buildAllMatchers() {
    const e = /* @__PURE__ */ Object.create(null);
    return Object.keys(m(this, ve)).concat(Object.keys(m(this, ye))).forEach((t) => {
      e[t] || (e[t] = I(this, Bt, xs).call(this, t));
    }), T(this, ye, T(this, ve, void 0)), Ko(), e;
  }
}, ye = /* @__PURE__ */ new WeakMap(), ve = /* @__PURE__ */ new WeakMap(), Bt = /* @__PURE__ */ new WeakSet(), xs = /* @__PURE__ */ __name(function(e) {
  const t = [];
  let n = e === Z;
  return [m(this, ye), m(this, ve)].forEach((s) => {
    const o = s[e] ? Object.keys(s[e]).map((r) => [r, s[e][r]]) : [];
    o.length !== 0 ? (n || (n = true), t.push(...o)) : e !== Z && t.push(...Object.keys(s[Z]).map((r) => [r, s[Z][r]]));
  }), n ? Go(t) : null;
}, "xs"), as);
var be;
var fe;
var cs;
var Yo = (cs = class {
  static {
    __name(this, "cs");
  }
  constructor(e) {
    w(this, "name", "SmartRouter");
    E(this, be, []);
    E(this, fe, []);
    T(this, be, e.routers);
  }
  add(e, t, n) {
    if (!m(this, fe)) throw new Error(ys);
    m(this, fe).push([e, t, n]);
  }
  match(e, t) {
    if (!m(this, fe)) throw new Error("Fatal error");
    const n = m(this, be), s = m(this, fe), o = n.length;
    let r = 0, i;
    for (; r < o; r++) {
      const a = n[r];
      try {
        for (let d = 0, c = s.length; d < c; d++) a.add(...s[d]);
        i = a.match(e, t);
      } catch (d) {
        if (d instanceof vs) continue;
        throw d;
      }
      this.match = a.match.bind(a), T(this, be, [a]), T(this, fe, void 0);
      break;
    }
    if (r === o) throw new Error("Fatal error");
    return this.name = `SmartRouter + ${this.activeRouter.name}`, i;
  }
  get activeRouter() {
    if (m(this, fe) || m(this, be).length !== 1) throw new Error("No active router has been determined yet.");
    return m(this, be)[0];
  }
}, be = /* @__PURE__ */ new WeakMap(), fe = /* @__PURE__ */ new WeakMap(), cs);
var ct = /* @__PURE__ */ Object.create(null);
var we;
var q;
var Re;
var et;
var J;
var me;
var Ne;
var tt;
var Qo = (tt = class {
  static {
    __name(this, "tt");
  }
  constructor(t, n, s) {
    E(this, me);
    E(this, we);
    E(this, q);
    E(this, Re);
    E(this, et, 0);
    E(this, J, ct);
    if (T(this, q, s || /* @__PURE__ */ Object.create(null)), T(this, we, []), t && n) {
      const o = /* @__PURE__ */ Object.create(null);
      o[t] = { handler: n, possibleKeys: [], score: 0 }, T(this, we, [o]);
    }
    T(this, Re, []);
  }
  insert(t, n, s) {
    T(this, et, ++On(this, et)._);
    let o = this;
    const r = Oo(n), i = [];
    for (let a = 0, d = r.length; a < d; a++) {
      const c = r[a], l = r[a + 1], u = $o(c, l), f = Array.isArray(u) ? u[0] : c;
      if (f in m(o, q)) {
        o = m(o, q)[f], u && i.push(u[1]);
        continue;
      }
      m(o, q)[f] = new tt(), u && (m(o, Re).push(u), i.push(u[1])), o = m(o, q)[f];
    }
    return m(o, we).push({ [t]: { handler: s, possibleKeys: i.filter((a, d, c) => c.indexOf(a) === d), score: m(this, et) } }), o;
  }
  search(t, n) {
    var d;
    const s = [];
    T(this, J, ct);
    let r = [this];
    const i = ls(n), a = [];
    for (let c = 0, l = i.length; c < l; c++) {
      const u = i[c], f = c === l - 1, p = [];
      for (let _ = 0, v = r.length; _ < v; _++) {
        const y = r[_], g = m(y, q)[u];
        g && (T(g, J, m(y, J)), f ? (m(g, q)["*"] && s.push(...I(this, me, Ne).call(this, m(g, q)["*"], t, m(y, J))), s.push(...I(this, me, Ne).call(this, g, t, m(y, J)))) : p.push(g));
        for (let k = 0, L = m(y, Re).length; k < L; k++) {
          const $ = m(y, Re)[k], S = m(y, J) === ct ? {} : { ...m(y, J) };
          if ($ === "*") {
            const U = m(y, q)["*"];
            U && (s.push(...I(this, me, Ne).call(this, U, t, m(y, J))), T(U, J, S), p.push(U));
            continue;
          }
          const [j, G, M] = $;
          if (!u && !(M instanceof RegExp)) continue;
          const C = m(y, q)[j], ce = i.slice(c).join("/");
          if (M instanceof RegExp) {
            const U = M.exec(ce);
            if (U) {
              if (S[G] = U[0], s.push(...I(this, me, Ne).call(this, C, t, m(y, J), S)), Object.keys(m(C, q)).length) {
                T(C, J, S);
                const Se = ((d = U[0].match(/\//)) == null ? void 0 : d.length) ?? 0;
                (a[Se] || (a[Se] = [])).push(C);
              }
              continue;
            }
          }
          (M === true || M.test(u)) && (S[G] = u, f ? (s.push(...I(this, me, Ne).call(this, C, t, S, m(y, J))), m(C, q)["*"] && s.push(...I(this, me, Ne).call(this, m(C, q)["*"], t, S, m(y, J)))) : (T(C, J, S), p.push(C)));
        }
      }
      r = p.concat(a.shift() ?? []);
    }
    return s.length > 1 && s.sort((c, l) => c.score - l.score), [s.map(({ handler: c, params: l }) => [c, l])];
  }
}, we = /* @__PURE__ */ new WeakMap(), q = /* @__PURE__ */ new WeakMap(), Re = /* @__PURE__ */ new WeakMap(), et = /* @__PURE__ */ new WeakMap(), J = /* @__PURE__ */ new WeakMap(), me = /* @__PURE__ */ new WeakSet(), Ne = /* @__PURE__ */ __name(function(t, n, s, o) {
  const r = [];
  for (let i = 0, a = m(t, we).length; i < a; i++) {
    const d = m(t, we)[i], c = d[n] || d[Z], l = {};
    if (c !== void 0 && (c.params = /* @__PURE__ */ Object.create(null), r.push(c), s !== ct || o && o !== ct)) for (let u = 0, f = c.possibleKeys.length; u < f; u++) {
      const p = c.possibleKeys[u], _ = l[c.score];
      c.params[p] = o != null && o[p] && !_ ? o[p] : s[p] ?? (o == null ? void 0 : o[p]), l[c.score] = true;
    }
  }
  return r;
}, "Ne"), tt);
var De;
var ds;
var er = (ds = class {
  static {
    __name(this, "ds");
  }
  constructor() {
    w(this, "name", "TrieRouter");
    E(this, De);
    T(this, De, new Qo());
  }
  add(e, t, n) {
    const s = ps(t);
    if (s) {
      for (let o = 0, r = s.length; o < r; o++) m(this, De).insert(e, s[o], n);
      return;
    }
    m(this, De).insert(e, t, n);
  }
  match(e, t) {
    return m(this, De).search(e, t);
  }
}, De = /* @__PURE__ */ new WeakMap(), ds);
var ot = class extends Fo {
  static {
    __name(this, "ot");
  }
  constructor(e = {}) {
    super(e), this.router = e.router ?? new Yo({ routers: [new Vo(), new er()] });
  }
};
var tr = /* @__PURE__ */ __name((e) => {
  const n = { ...{ origin: "*", allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"], allowHeaders: [], exposeHeaders: [] }, ...e }, s = /* @__PURE__ */ ((r) => typeof r == "string" ? r === "*" ? () => r : (i) => r === i ? i : null : typeof r == "function" ? r : (i) => r.includes(i) ? i : null)(n.origin), o = ((r) => typeof r == "function" ? r : Array.isArray(r) ? () => r : () => [])(n.allowMethods);
  return async function(i, a) {
    var l;
    function d(u, f) {
      i.res.headers.set(u, f);
    }
    __name(d, "d");
    const c = await s(i.req.header("origin") || "", i);
    if (c && d("Access-Control-Allow-Origin", c), n.credentials && d("Access-Control-Allow-Credentials", "true"), (l = n.exposeHeaders) != null && l.length && d("Access-Control-Expose-Headers", n.exposeHeaders.join(",")), i.req.method === "OPTIONS") {
      n.origin !== "*" && d("Vary", "Origin"), n.maxAge != null && d("Access-Control-Max-Age", n.maxAge.toString());
      const u = await o(i.req.header("origin") || "", i);
      u.length && d("Access-Control-Allow-Methods", u.join(","));
      let f = n.allowHeaders;
      if (!(f != null && f.length)) {
        const p = i.req.header("Access-Control-Request-Headers");
        p && (f = p.split(/\s*,\s*/));
      }
      return f != null && f.length && (d("Access-Control-Allow-Headers", f.join(",")), i.res.headers.append("Vary", "Access-Control-Request-Headers")), i.res.headers.delete("Content-Length"), i.res.headers.delete("Content-Type"), new Response(null, { headers: i.res.headers, status: 204, statusText: "No Content" });
    }
    await a(), n.origin !== "*" && i.header("Vary", "Origin", { append: true });
  };
}, "tr");
function nr() {
  const { process: e, Deno: t } = globalThis;
  return !(typeof (t == null ? void 0 : t.noColor) == "boolean" ? t.noColor : e !== void 0 ? "NO_COLOR" in (e == null ? void 0 : e.env) : false);
}
__name(nr, "nr");
async function sr() {
  const { navigator: e } = globalThis, t = "cloudflare:workers";
  return !(e !== void 0 && e.userAgent === "Cloudflare-Workers" ? await (async () => {
    try {
      return "NO_COLOR" in ((await import(t)).env ?? {});
    } catch {
      return false;
    }
  })() : !nr());
}
__name(sr, "sr");
var or = /* @__PURE__ */ __name((e) => {
  const [t, n] = [",", "."];
  return e.map((o) => o.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + t)).join(n);
}, "or");
var rr = /* @__PURE__ */ __name((e) => {
  const t = Date.now() - e;
  return or([t < 1e3 ? t + "ms" : Math.round(t / 1e3) + "s"]);
}, "rr");
var ir = /* @__PURE__ */ __name(async (e) => {
  if (await sr()) switch (e / 100 | 0) {
    case 5:
      return `\x1B[31m${e}\x1B[0m`;
    case 4:
      return `\x1B[33m${e}\x1B[0m`;
    case 3:
      return `\x1B[36m${e}\x1B[0m`;
    case 2:
      return `\x1B[32m${e}\x1B[0m`;
  }
  return `${e}`;
}, "ir");
async function An(e, t, n, s, o = 0, r) {
  const i = t === "<--" ? `${t} ${n} ${s}` : `${t} ${n} ${s} ${await ir(o)} ${r}`;
  e(i);
}
__name(An, "An");
var ar = /* @__PURE__ */ __name((e = console.log) => async function(n, s) {
  const { method: o, url: r } = n.req, i = r.slice(r.indexOf("/", 8));
  await An(e, "<--", o, i);
  const a = Date.now();
  await s(), await An(e, "-->", o, i, n.res.status, rr(a));
}, "ar");
var cr = /^\s*(?:text\/(?!event-stream(?:[;\s]|$))[^;\s]+|application\/(?:javascript|json|xml|xml-dtd|ecmascript|dart|postscript|rtf|tar|toml|vnd\.dart|vnd\.ms-fontobject|vnd\.ms-opentype|wasm|x-httpd-php|x-javascript|x-ns-proxy-autoconfig|x-sh|x-tar|x-virtualbox-hdd|x-virtualbox-ova|x-virtualbox-ovf|x-virtualbox-vbox|x-virtualbox-vdi|x-virtualbox-vhd|x-virtualbox-vmdk|x-www-form-urlencoded)|font\/(?:otf|ttf)|image\/(?:bmp|vnd\.adobe\.photoshop|vnd\.microsoft\.icon|vnd\.ms-dds|x-icon|x-ms-bmp)|message\/rfc822|model\/gltf-binary|x-shader\/x-fragment|x-shader\/x-vertex|[^;\s]+?\+(?:json|text|xml|yaml))(?:[;\s]|$)/i;
var zn = /* @__PURE__ */ __name((e, t = lr) => {
  const n = /\.([a-zA-Z0-9]+?)$/, s = e.match(n);
  if (!s) return;
  let o = t[s[1]];
  return o && o.startsWith("text") && (o += "; charset=utf-8"), o;
}, "zn");
var dr = { aac: "audio/aac", avi: "video/x-msvideo", avif: "image/avif", av1: "video/av1", bin: "application/octet-stream", bmp: "image/bmp", css: "text/css", csv: "text/csv", eot: "application/vnd.ms-fontobject", epub: "application/epub+zip", gif: "image/gif", gz: "application/gzip", htm: "text/html", html: "text/html", ico: "image/x-icon", ics: "text/calendar", jpeg: "image/jpeg", jpg: "image/jpeg", js: "text/javascript", json: "application/json", jsonld: "application/ld+json", map: "application/json", mid: "audio/x-midi", midi: "audio/x-midi", mjs: "text/javascript", mp3: "audio/mpeg", mp4: "video/mp4", mpeg: "video/mpeg", oga: "audio/ogg", ogv: "video/ogg", ogx: "application/ogg", opus: "audio/opus", otf: "font/otf", pdf: "application/pdf", png: "image/png", rtf: "application/rtf", svg: "image/svg+xml", tif: "image/tiff", tiff: "image/tiff", ts: "video/mp2t", ttf: "font/ttf", txt: "text/plain", wasm: "application/wasm", webm: "video/webm", weba: "audio/webm", webmanifest: "application/manifest+json", webp: "image/webp", woff: "font/woff", woff2: "font/woff2", xhtml: "application/xhtml+xml", xml: "application/xml", zip: "application/zip", "3gp": "video/3gpp", "3g2": "video/3gpp2", gltf: "model/gltf+json", glb: "model/gltf-binary" };
var lr = dr;
var ur = /* @__PURE__ */ __name((...e) => {
  let t = e.filter((o) => o !== "").join("/");
  t = t.replace(new RegExp("(?<=\\/)\\/+", "g"), "");
  const n = t.split("/"), s = [];
  for (const o of n) o === ".." && s.length > 0 && s.at(-1) !== ".." ? s.pop() : o !== "." && s.push(o);
  return s.join("/") || ".";
}, "ur");
var Ts = { br: ".br", zstd: ".zst", gzip: ".gz" };
var pr = Object.keys(Ts);
var fr = "index.html";
var mr = /* @__PURE__ */ __name((e) => {
  const t = e.root ?? "./", n = e.path, s = e.join ?? ur;
  return async (o, r) => {
    var l, u, f, p;
    if (o.finalized) return r();
    let i;
    if (e.path) i = e.path;
    else try {
      if (i = decodeURIComponent(o.req.path), /(?:^|[\/\\])\.\.(?:$|[\/\\])/.test(i)) throw new Error();
    } catch {
      return await ((l = e.onNotFound) == null ? void 0 : l.call(e, o.req.path, o)), r();
    }
    let a = s(t, !n && e.rewriteRequestPath ? e.rewriteRequestPath(i) : i);
    e.isDir && await e.isDir(a) && (a = s(a, fr));
    const d = e.getContent;
    let c = await d(a, o);
    if (c instanceof Response) return o.newResponse(c.body, c);
    if (c) {
      const _ = e.mimes && zn(a, e.mimes) || zn(a);
      if (o.header("Content-Type", _ || "application/octet-stream"), e.precompressed && (!_ || cr.test(_))) {
        const v = new Set((u = o.req.header("Accept-Encoding")) == null ? void 0 : u.split(",").map((y) => y.trim()));
        for (const y of pr) {
          if (!v.has(y)) continue;
          const g = await d(a + Ts[y], o);
          if (g) {
            c = g, o.header("Content-Encoding", y), o.header("Vary", "Accept-Encoding", { append: true });
            break;
          }
        }
      }
      return await ((f = e.onFound) == null ? void 0 : f.call(e, a, o)), o.body(c);
    }
    await ((p = e.onNotFound) == null ? void 0 : p.call(e, a, o)), await r();
  };
}, "mr");
var hr = /* @__PURE__ */ __name(async (e, t) => {
  let n;
  t && t.manifest ? typeof t.manifest == "string" ? n = JSON.parse(t.manifest) : n = t.manifest : typeof __STATIC_CONTENT_MANIFEST == "string" ? n = JSON.parse(__STATIC_CONTENT_MANIFEST) : n = __STATIC_CONTENT_MANIFEST;
  let s;
  t && t.namespace ? s = t.namespace : s = __STATIC_CONTENT;
  const o = n[e];
  if (!o) return null;
  const r = await s.get(o, { type: "stream" });
  return r || null;
}, "hr");
var gr = /* @__PURE__ */ __name((e) => async function(n, s) {
  return mr({ ...e, getContent: /* @__PURE__ */ __name(async (r) => hr(r, { manifest: e.manifest, namespace: e.namespace ? e.namespace : n.env ? n.env.__STATIC_CONTENT : void 0 }), "getContent") })(n, s);
}, "gr");
var _r = /* @__PURE__ */ __name((e) => gr(e), "_r");
async function yr(e) {
  const n = new TextEncoder().encode(e), s = await crypto.subtle.digest("SHA-256", n);
  return Array.from(new Uint8Array(s)).map((r) => r.toString(16).padStart(2, "0")).join("");
}
__name(yr, "yr");
var Rn = /* @__PURE__ */ new Map();
function vr(e, t) {
  const n = Date.now(), s = 6e4, o = Rn.get(e);
  return !o || n > o.resetAt ? (Rn.set(e, { count: 1, resetAt: n + s }), true) : o.count >= t ? false : (o.count++, true);
}
__name(vr, "vr");
async function Ht(e, t) {
  const n = e.req.header("Authorization"), s = e.req.header("X-API-Key");
  let o = null;
  if (n != null && n.startsWith("Bearer ") ? o = n.slice(7) : s && (o = s), o === e.env.MASTER_KEY && e.env.MASTER_KEY) return e.set("user_id", "dev-user"), e.set("rate_limit_rpm", 1e3), t();
  if (!o) return e.json({ error: "Missing API key. Use Authorization: Bearer <key> or X-API-Key header." }, 401);
  if (o.startsWith("crs_")) return e.set("user_id", `user_${o.slice(4, 12)}`), e.set("rate_limit_rpm", 60), t();
  try {
    const r = await yr(o), { StorageService: i } = await Promise.resolve().then(() => ll), d = await new i(e.env.DB).validateApiKey(r);
    return d ? vr(d.user_id, d.rate_limit_rpm) ? (e.set("user_id", d.user_id), e.set("rate_limit_rpm", d.rate_limit_rpm), t()) : e.json({ error: "Rate limit exceeded. Try again in a minute." }, 429) : e.json({ error: "Invalid API key." }, 401);
  } catch {
    return e.json({ error: "Auth service error." }, 500);
  }
}
__name(Ht, "Ht");
var br = /^[\w!#$%&'*.^`|~+-]+$/;
var wr = /^[ !#-:<>-\[\]-~]*$/;
var kr = /* @__PURE__ */ __name((e, t) => {
  const n = e.trim().split(";"), s = {};
  for (let o of n) {
    o = o.trim();
    const r = o.indexOf("=");
    if (r === -1) continue;
    const i = o.substring(0, r).trim();
    if (!br.test(i)) continue;
    let a = o.substring(r + 1).trim();
    a.startsWith('"') && a.endsWith('"') && (a = a.slice(1, -1)), wr.test(a) && (s[i] = a.indexOf("%") !== -1 ? Jt(a, pn) : a);
  }
  return s;
}, "kr");
var xr = /* @__PURE__ */ __name((e, t, n) => {
  const s = e.req.raw.headers.get("Cookie");
  return s ? kr(s) : {};
}, "xr");
var Tr = /* @__PURE__ */ __name((e, t) => new Response(e, { headers: { "Content-Type": t } }).formData(), "Tr");
var Er = /^application\/([a-z-\.]+\+)?json(;\s*[a-zA-Z0-9\-]+\=([^;]+))*$/;
var Sr = /^multipart\/form-data(;\s?boundary=[a-zA-Z0-9'"()+_,\-./:=?]+)?$/;
var Or = /^application\/x-www-form-urlencoded(;\s*[a-zA-Z0-9\-]+\=([^;]+))*$/;
var Ir = /* @__PURE__ */ __name((e, t) => async (n, s) => {
  let o = {};
  const r = n.req.header("Content-Type");
  switch (e) {
    case "json":
      if (!r || !Er.test(r)) break;
      try {
        o = await n.req.json();
      } catch {
        const a = "Malformed JSON in request body";
        throw new Nn(400, { message: a });
      }
      break;
    case "form": {
      if (!r || !(Sr.test(r) || Or.test(r))) break;
      let a;
      if (n.req.bodyCache.formData) a = await n.req.bodyCache.formData;
      else try {
        const c = await n.req.arrayBuffer();
        a = await Tr(c, r), n.req.bodyCache.formData = a;
      } catch (c) {
        let l = "Malformed FormData request.";
        throw l += c instanceof Error ? ` ${c.message}` : ` ${String(c)}`, new Nn(400, { message: l });
      }
      const d = {};
      a.forEach((c, l) => {
        l.endsWith("[]") ? (d[l] ?? (d[l] = [])).push(c) : Array.isArray(d[l]) ? d[l].push(c) : l in d ? d[l] = [d[l], c] : d[l] = c;
      }), o = d;
      break;
    }
    case "query":
      o = Object.fromEntries(Object.entries(n.req.queries()).map(([a, d]) => d.length === 1 ? [a, d[0]] : [a, d]));
      break;
    case "param":
      o = n.req.param();
      break;
    case "header":
      o = n.req.header();
      break;
    case "cookie":
      o = xr(n);
      break;
  }
  const i = await t(o, n);
  return i instanceof Response ? i : (n.req.addValidatedData(e, i), await s());
}, "Ir");
function Nr(e, t, n, s) {
  return Ir(e, async (o, r) => {
    let i = o;
    if (e === "header" && "_def" in t || e === "header" && "_zod" in t) {
      const d = Object.keys("in" in t ? t.in.shape : t.shape), c = Object.fromEntries(d.map((l) => [l.toLowerCase(), l]));
      i = Object.fromEntries(Object.entries(o).map(([l, u]) => [c[l] || l, u]));
    }
    const a = s && s.validationFunction ? await s.validationFunction(t, i) : await t.safeParseAsync(i);
    if (n) {
      const d = await n({ data: i, ...a, target: e }, r);
      if (d) {
        if (d instanceof Response) return d;
        if ("response" in d) return d.response;
      }
    }
    return a.success ? a.data : r.json(a, 400);
  });
}
__name(Nr, "Nr");
var Xt = Nr;
function h(e, t, n) {
  function s(a, d) {
    if (a._zod || Object.defineProperty(a, "_zod", { value: { def: d, constr: i, traits: /* @__PURE__ */ new Set() }, enumerable: false }), a._zod.traits.has(e)) return;
    a._zod.traits.add(e), t(a, d);
    const c = i.prototype, l = Object.keys(c);
    for (let u = 0; u < l.length; u++) {
      const f = l[u];
      f in a || (a[f] = c[f].bind(a));
    }
  }
  __name(s, "s");
  const o = (n == null ? void 0 : n.Parent) ?? Object;
  class r extends o {
    static {
      __name(this, "r");
    }
  }
  Object.defineProperty(r, "name", { value: e });
  function i(a) {
    var d;
    const c = n != null && n.Parent ? new r() : this;
    s(c, a), (d = c._zod).deferred ?? (d.deferred = []);
    for (const l of c._zod.deferred) l();
    return c;
  }
  __name(i, "i");
  return Object.defineProperty(i, "init", { value: s }), Object.defineProperty(i, Symbol.hasInstance, { value: /* @__PURE__ */ __name((a) => {
    var d, c;
    return n != null && n.Parent && a instanceof n.Parent ? true : (c = (d = a == null ? void 0 : a._zod) == null ? void 0 : d.traits) == null ? void 0 : c.has(e);
  }, "value") }), Object.defineProperty(i, "name", { value: e }), i;
}
__name(h, "h");
var We = class extends Error {
  static {
    __name(this, "We");
  }
  constructor() {
    super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
  }
};
var Es = class extends Error {
  static {
    __name(this, "Es");
  }
  constructor(t) {
    super(`Encountered unidirectional transform during encode: ${t}`), this.name = "ZodEncodeError";
  }
};
var Ss = {};
function ke(e) {
  return Ss;
}
__name(ke, "ke");
function Os(e) {
  const t = Object.values(e).filter((s) => typeof s == "number");
  return Object.entries(e).filter(([s, o]) => t.indexOf(+s) === -1).map(([s, o]) => o);
}
__name(Os, "Os");
function cn(e, t) {
  return typeof t == "bigint" ? t.toString() : t;
}
__name(cn, "cn");
function fn(e) {
  return { get value() {
    {
      const t = e();
      return Object.defineProperty(this, "value", { value: t }), t;
    }
  } };
}
__name(fn, "fn");
function mn(e) {
  return e == null;
}
__name(mn, "mn");
function hn(e) {
  const t = e.startsWith("^") ? 1 : 0, n = e.endsWith("$") ? e.length - 1 : e.length;
  return e.slice(t, n);
}
__name(hn, "hn");
function $r(e, t) {
  const n = (e.toString().split(".")[1] || "").length, s = t.toString();
  let o = (s.split(".")[1] || "").length;
  if (o === 0 && /\d?e-\d?/.test(s)) {
    const d = s.match(/\d?e-(\d?)/);
    d != null && d[1] && (o = Number.parseInt(d[1]));
  }
  const r = n > o ? n : o, i = Number.parseInt(e.toFixed(r).replace(".", "")), a = Number.parseInt(t.toFixed(r).replace(".", ""));
  return i % a / 10 ** r;
}
__name($r, "$r");
var Dn = /* @__PURE__ */ Symbol("evaluating");
function N(e, t, n) {
  let s;
  Object.defineProperty(e, t, { get() {
    if (s !== Dn) return s === void 0 && (s = Dn, s = n()), s;
  }, set(o) {
    Object.defineProperty(e, t, { value: o });
  }, configurable: true });
}
__name(N, "N");
function Ce(e, t, n) {
  Object.defineProperty(e, t, { value: n, writable: true, enumerable: true, configurable: true });
}
__name(Ce, "Ce");
function Te(...e) {
  const t = {};
  for (const n of e) {
    const s = Object.getOwnPropertyDescriptors(n);
    Object.assign(t, s);
  }
  return Object.defineProperties({}, t);
}
__name(Te, "Te");
function Ln(e) {
  return JSON.stringify(e);
}
__name(Ln, "Ln");
function jr(e) {
  return e.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
__name(jr, "jr");
var Is = "captureStackTrace" in Error ? Error.captureStackTrace : (...e) => {
};
function Ct(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
__name(Ct, "Ct");
var Ar = fn(() => {
  var e;
  if (typeof navigator < "u" && ((e = navigator == null ? void 0 : "Cloudflare-Workers") != null && e.includes("Cloudflare"))) return false;
  try {
    const t = Function;
    return new t(""), true;
  } catch {
    return false;
  }
});
function nt(e) {
  if (Ct(e) === false) return false;
  const t = e.constructor;
  if (t === void 0 || typeof t != "function") return true;
  const n = t.prototype;
  return !(Ct(n) === false || Object.prototype.hasOwnProperty.call(n, "isPrototypeOf") === false);
}
__name(nt, "nt");
function Ns(e) {
  return nt(e) ? { ...e } : Array.isArray(e) ? [...e] : e;
}
__name(Ns, "Ns");
var zr = /* @__PURE__ */ new Set(["string", "number", "symbol"]);
function qt(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
__name(qt, "qt");
function Ee(e, t, n) {
  const s = new e._zod.constr(t ?? e._zod.def);
  return (!t || n != null && n.parent) && (s._zod.parent = e), s;
}
__name(Ee, "Ee");
function x(e) {
  const t = e;
  if (!t) return {};
  if (typeof t == "string") return { error: /* @__PURE__ */ __name(() => t, "error") };
  if ((t == null ? void 0 : t.message) !== void 0) {
    if ((t == null ? void 0 : t.error) !== void 0) throw new Error("Cannot specify both `message` and `error` params");
    t.error = t.message;
  }
  return delete t.message, typeof t.error == "string" ? { ...t, error: /* @__PURE__ */ __name(() => t.error, "error") } : t;
}
__name(x, "x");
function Rr(e) {
  return Object.keys(e).filter((t) => e[t]._zod.optin === "optional" && e[t]._zod.optout === "optional");
}
__name(Rr, "Rr");
var Dr = { safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER], int32: [-2147483648, 2147483647], uint32: [0, 4294967295], float32: [-34028234663852886e22, 34028234663852886e22], float64: [-Number.MAX_VALUE, Number.MAX_VALUE] };
function Lr(e, t) {
  const n = e._zod.def, s = n.checks;
  if (s && s.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
  const r = Te(e._zod.def, { get shape() {
    const i = {};
    for (const a in t) {
      if (!(a in n.shape)) throw new Error(`Unrecognized key: "${a}"`);
      t[a] && (i[a] = n.shape[a]);
    }
    return Ce(this, "shape", i), i;
  }, checks: [] });
  return Ee(e, r);
}
__name(Lr, "Lr");
function Cr(e, t) {
  const n = e._zod.def, s = n.checks;
  if (s && s.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
  const r = Te(e._zod.def, { get shape() {
    const i = { ...e._zod.def.shape };
    for (const a in t) {
      if (!(a in n.shape)) throw new Error(`Unrecognized key: "${a}"`);
      t[a] && delete i[a];
    }
    return Ce(this, "shape", i), i;
  }, checks: [] });
  return Ee(e, r);
}
__name(Cr, "Cr");
function Pr(e, t) {
  if (!nt(t)) throw new Error("Invalid input to extend: expected a plain object");
  const n = e._zod.def.checks;
  if (n && n.length > 0) {
    const r = e._zod.def.shape;
    for (const i in t) if (Object.getOwnPropertyDescriptor(r, i) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
  }
  const o = Te(e._zod.def, { get shape() {
    const r = { ...e._zod.def.shape, ...t };
    return Ce(this, "shape", r), r;
  } });
  return Ee(e, o);
}
__name(Pr, "Pr");
function Mr(e, t) {
  if (!nt(t)) throw new Error("Invalid input to safeExtend: expected a plain object");
  const n = Te(e._zod.def, { get shape() {
    const s = { ...e._zod.def.shape, ...t };
    return Ce(this, "shape", s), s;
  } });
  return Ee(e, n);
}
__name(Mr, "Mr");
function Ur(e, t) {
  const n = Te(e._zod.def, { get shape() {
    const s = { ...e._zod.def.shape, ...t._zod.def.shape };
    return Ce(this, "shape", s), s;
  }, get catchall() {
    return t._zod.def.catchall;
  }, checks: [] });
  return Ee(e, n);
}
__name(Ur, "Ur");
function Zr(e, t, n) {
  const o = t._zod.def.checks;
  if (o && o.length > 0) throw new Error(".partial() cannot be used on object schemas containing refinements");
  const i = Te(t._zod.def, { get shape() {
    const a = t._zod.def.shape, d = { ...a };
    if (n) for (const c in n) {
      if (!(c in a)) throw new Error(`Unrecognized key: "${c}"`);
      n[c] && (d[c] = e ? new e({ type: "optional", innerType: a[c] }) : a[c]);
    }
    else for (const c in a) d[c] = e ? new e({ type: "optional", innerType: a[c] }) : a[c];
    return Ce(this, "shape", d), d;
  }, checks: [] });
  return Ee(t, i);
}
__name(Zr, "Zr");
function Fr(e, t, n) {
  const s = Te(t._zod.def, { get shape() {
    const o = t._zod.def.shape, r = { ...o };
    if (n) for (const i in n) {
      if (!(i in r)) throw new Error(`Unrecognized key: "${i}"`);
      n[i] && (r[i] = new e({ type: "nonoptional", innerType: o[i] }));
    }
    else for (const i in o) r[i] = new e({ type: "nonoptional", innerType: o[i] });
    return Ce(this, "shape", r), r;
  } });
  return Ee(t, s);
}
__name(Fr, "Fr");
function Xe(e, t = 0) {
  var n;
  if (e.aborted === true) return true;
  for (let s = t; s < e.issues.length; s++) if (((n = e.issues[s]) == null ? void 0 : n.continue) !== true) return true;
  return false;
}
__name(Xe, "Xe");
function qe(e, t) {
  return t.map((n) => {
    var s;
    return (s = n).path ?? (s.path = []), n.path.unshift(e), n;
  });
}
__name(qe, "qe");
function $t(e) {
  return typeof e == "string" ? e : e == null ? void 0 : e.message;
}
__name($t, "$t");
function xe(e, t, n) {
  var o, r, i, a, d, c;
  const s = { ...e, path: e.path ?? [] };
  if (!e.message) {
    const l = $t((i = (r = (o = e.inst) == null ? void 0 : o._zod.def) == null ? void 0 : r.error) == null ? void 0 : i.call(r, e)) ?? $t((a = t == null ? void 0 : t.error) == null ? void 0 : a.call(t, e)) ?? $t((d = n.customError) == null ? void 0 : d.call(n, e)) ?? $t((c = n.localeError) == null ? void 0 : c.call(n, e)) ?? "Invalid input";
    s.message = l;
  }
  return delete s.inst, delete s.continue, t != null && t.reportInput || delete s.input, s;
}
__name(xe, "xe");
function gn(e) {
  return Array.isArray(e) ? "array" : typeof e == "string" ? "string" : "unknown";
}
__name(gn, "gn");
function pt(...e) {
  const [t, n, s] = e;
  return typeof t == "string" ? { message: t, code: "custom", input: n, inst: s } : { ...t };
}
__name(pt, "pt");
var $s = /* @__PURE__ */ __name((e, t) => {
  e.name = "$ZodError", Object.defineProperty(e, "_zod", { value: e._zod, enumerable: false }), Object.defineProperty(e, "issues", { value: t, enumerable: false }), e.message = JSON.stringify(t, cn, 2), Object.defineProperty(e, "toString", { value: /* @__PURE__ */ __name(() => e.message, "value"), enumerable: false });
}, "$s");
var js = h("$ZodError", $s);
var As = h("$ZodError", $s, { Parent: Error });
function Br(e, t = (n) => n.message) {
  const n = {}, s = [];
  for (const o of e.issues) o.path.length > 0 ? (n[o.path[0]] = n[o.path[0]] || [], n[o.path[0]].push(t(o))) : s.push(t(o));
  return { formErrors: s, fieldErrors: n };
}
__name(Br, "Br");
function Jr(e, t = (n) => n.message) {
  const n = { _errors: [] }, s = /* @__PURE__ */ __name((o) => {
    for (const r of o.issues) if (r.code === "invalid_union" && r.errors.length) r.errors.map((i) => s({ issues: i }));
    else if (r.code === "invalid_key") s({ issues: r.issues });
    else if (r.code === "invalid_element") s({ issues: r.issues });
    else if (r.path.length === 0) n._errors.push(t(r));
    else {
      let i = n, a = 0;
      for (; a < r.path.length; ) {
        const d = r.path[a];
        a === r.path.length - 1 ? (i[d] = i[d] || { _errors: [] }, i[d]._errors.push(t(r))) : i[d] = i[d] || { _errors: [] }, i = i[d], a++;
      }
    }
  }, "s");
  return s(e), n;
}
__name(Jr, "Jr");
var _n = /* @__PURE__ */ __name((e) => (t, n, s, o) => {
  const r = s ? Object.assign(s, { async: false }) : { async: false }, i = t._zod.run({ value: n, issues: [] }, r);
  if (i instanceof Promise) throw new We();
  if (i.issues.length) {
    const a = new ((o == null ? void 0 : o.Err) ?? e)(i.issues.map((d) => xe(d, r, ke())));
    throw Is(a, o == null ? void 0 : o.callee), a;
  }
  return i.value;
}, "_n");
var yn = /* @__PURE__ */ __name((e) => async (t, n, s, o) => {
  const r = s ? Object.assign(s, { async: true }) : { async: true };
  let i = t._zod.run({ value: n, issues: [] }, r);
  if (i instanceof Promise && (i = await i), i.issues.length) {
    const a = new ((o == null ? void 0 : o.Err) ?? e)(i.issues.map((d) => xe(d, r, ke())));
    throw Is(a, o == null ? void 0 : o.callee), a;
  }
  return i.value;
}, "yn");
var Wt = /* @__PURE__ */ __name((e) => (t, n, s) => {
  const o = s ? { ...s, async: false } : { async: false }, r = t._zod.run({ value: n, issues: [] }, o);
  if (r instanceof Promise) throw new We();
  return r.issues.length ? { success: false, error: new (e ?? js)(r.issues.map((i) => xe(i, o, ke()))) } : { success: true, data: r.value };
}, "Wt");
var Hr = Wt(As);
var Kt = /* @__PURE__ */ __name((e) => async (t, n, s) => {
  const o = s ? Object.assign(s, { async: true }) : { async: true };
  let r = t._zod.run({ value: n, issues: [] }, o);
  return r instanceof Promise && (r = await r), r.issues.length ? { success: false, error: new e(r.issues.map((i) => xe(i, o, ke()))) } : { success: true, data: r.value };
}, "Kt");
var Xr = Kt(As);
var qr = /* @__PURE__ */ __name((e) => (t, n, s) => {
  const o = s ? Object.assign(s, { direction: "backward" }) : { direction: "backward" };
  return _n(e)(t, n, o);
}, "qr");
var Wr = /* @__PURE__ */ __name((e) => (t, n, s) => _n(e)(t, n, s), "Wr");
var Kr = /* @__PURE__ */ __name((e) => async (t, n, s) => {
  const o = s ? Object.assign(s, { direction: "backward" }) : { direction: "backward" };
  return yn(e)(t, n, o);
}, "Kr");
var Gr = /* @__PURE__ */ __name((e) => async (t, n, s) => yn(e)(t, n, s), "Gr");
var Vr = /* @__PURE__ */ __name((e) => (t, n, s) => {
  const o = s ? Object.assign(s, { direction: "backward" }) : { direction: "backward" };
  return Wt(e)(t, n, o);
}, "Vr");
var Yr = /* @__PURE__ */ __name((e) => (t, n, s) => Wt(e)(t, n, s), "Yr");
var Qr = /* @__PURE__ */ __name((e) => async (t, n, s) => {
  const o = s ? Object.assign(s, { direction: "backward" }) : { direction: "backward" };
  return Kt(e)(t, n, o);
}, "Qr");
var ei = /* @__PURE__ */ __name((e) => async (t, n, s) => Kt(e)(t, n, s), "ei");
var ti = /^[cC][^\s-]{8,}$/;
var ni = /^[0-9a-z]+$/;
var si = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
var oi = /^[0-9a-vA-V]{20}$/;
var ri = /^[A-Za-z0-9]{27}$/;
var ii = /^[a-zA-Z0-9_-]{21}$/;
var ai = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
var ci = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
var Cn = /* @__PURE__ */ __name((e) => e ? new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/, "Cn");
var di = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
var li = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
function ui() {
  return new RegExp(li, "u");
}
__name(ui, "ui");
var pi = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var fi = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
var mi = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
var hi = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var gi = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
var zs = /^[A-Za-z0-9_-]*$/;
var _i = /^\+[1-9]\d{6,14}$/;
var Rs = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))";
var yi = new RegExp(`^${Rs}$`);
function Ds(e) {
  const t = "(?:[01]\\d|2[0-3]):[0-5]\\d";
  return typeof e.precision == "number" ? e.precision === -1 ? `${t}` : e.precision === 0 ? `${t}:[0-5]\\d` : `${t}:[0-5]\\d\\.\\d{${e.precision}}` : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
__name(Ds, "Ds");
function vi(e) {
  return new RegExp(`^${Ds(e)}$`);
}
__name(vi, "vi");
function bi(e) {
  const t = Ds({ precision: e.precision }), n = ["Z"];
  e.local && n.push(""), e.offset && n.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
  const s = `${t}(?:${n.join("|")})`;
  return new RegExp(`^${Rs}T(?:${s})$`);
}
__name(bi, "bi");
var wi = /* @__PURE__ */ __name((e) => {
  const t = e ? `[\\s\\S]{${(e == null ? void 0 : e.minimum) ?? 0},${(e == null ? void 0 : e.maximum) ?? ""}}` : "[\\s\\S]*";
  return new RegExp(`^${t}$`);
}, "wi");
var ki = /^-?\d+$/;
var Ls = /^-?\d+(?:\.\d+)?$/;
var xi = /^(?:true|false)$/i;
var Ti = /^[^A-Z]*$/;
var Ei = /^[^a-z]*$/;
var Y = h("$ZodCheck", (e, t) => {
  var n;
  e._zod ?? (e._zod = {}), e._zod.def = t, (n = e._zod).onattach ?? (n.onattach = []);
});
var Cs = { number: "number", bigint: "bigint", object: "date" };
var Ps = h("$ZodCheckLessThan", (e, t) => {
  Y.init(e, t);
  const n = Cs[typeof t.value];
  e._zod.onattach.push((s) => {
    const o = s._zod.bag, r = (t.inclusive ? o.maximum : o.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
    t.value < r && (t.inclusive ? o.maximum = t.value : o.exclusiveMaximum = t.value);
  }), e._zod.check = (s) => {
    (t.inclusive ? s.value <= t.value : s.value < t.value) || s.issues.push({ origin: n, code: "too_big", maximum: typeof t.value == "object" ? t.value.getTime() : t.value, input: s.value, inclusive: t.inclusive, inst: e, continue: !t.abort });
  };
});
var Ms = h("$ZodCheckGreaterThan", (e, t) => {
  Y.init(e, t);
  const n = Cs[typeof t.value];
  e._zod.onattach.push((s) => {
    const o = s._zod.bag, r = (t.inclusive ? o.minimum : o.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
    t.value > r && (t.inclusive ? o.minimum = t.value : o.exclusiveMinimum = t.value);
  }), e._zod.check = (s) => {
    (t.inclusive ? s.value >= t.value : s.value > t.value) || s.issues.push({ origin: n, code: "too_small", minimum: typeof t.value == "object" ? t.value.getTime() : t.value, input: s.value, inclusive: t.inclusive, inst: e, continue: !t.abort });
  };
});
var Si = h("$ZodCheckMultipleOf", (e, t) => {
  Y.init(e, t), e._zod.onattach.push((n) => {
    var s;
    (s = n._zod.bag).multipleOf ?? (s.multipleOf = t.value);
  }), e._zod.check = (n) => {
    if (typeof n.value != typeof t.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
    (typeof n.value == "bigint" ? n.value % t.value === BigInt(0) : $r(n.value, t.value) === 0) || n.issues.push({ origin: typeof n.value, code: "not_multiple_of", divisor: t.value, input: n.value, inst: e, continue: !t.abort });
  };
});
var Oi = h("$ZodCheckNumberFormat", (e, t) => {
  var i;
  Y.init(e, t), t.format = t.format || "float64";
  const n = (i = t.format) == null ? void 0 : i.includes("int"), s = n ? "int" : "number", [o, r] = Dr[t.format];
  e._zod.onattach.push((a) => {
    const d = a._zod.bag;
    d.format = t.format, d.minimum = o, d.maximum = r, n && (d.pattern = ki);
  }), e._zod.check = (a) => {
    const d = a.value;
    if (n) {
      if (!Number.isInteger(d)) {
        a.issues.push({ expected: s, format: t.format, code: "invalid_type", continue: false, input: d, inst: e });
        return;
      }
      if (!Number.isSafeInteger(d)) {
        d > 0 ? a.issues.push({ input: d, code: "too_big", maximum: Number.MAX_SAFE_INTEGER, note: "Integers must be within the safe integer range.", inst: e, origin: s, inclusive: true, continue: !t.abort }) : a.issues.push({ input: d, code: "too_small", minimum: Number.MIN_SAFE_INTEGER, note: "Integers must be within the safe integer range.", inst: e, origin: s, inclusive: true, continue: !t.abort });
        return;
      }
    }
    d < o && a.issues.push({ origin: "number", input: d, code: "too_small", minimum: o, inclusive: true, inst: e, continue: !t.abort }), d > r && a.issues.push({ origin: "number", input: d, code: "too_big", maximum: r, inclusive: true, inst: e, continue: !t.abort });
  };
});
var Ii = h("$ZodCheckMaxLength", (e, t) => {
  var n;
  Y.init(e, t), (n = e._zod.def).when ?? (n.when = (s) => {
    const o = s.value;
    return !mn(o) && o.length !== void 0;
  }), e._zod.onattach.push((s) => {
    const o = s._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    t.maximum < o && (s._zod.bag.maximum = t.maximum);
  }), e._zod.check = (s) => {
    const o = s.value;
    if (o.length <= t.maximum) return;
    const i = gn(o);
    s.issues.push({ origin: i, code: "too_big", maximum: t.maximum, inclusive: true, input: o, inst: e, continue: !t.abort });
  };
});
var Ni = h("$ZodCheckMinLength", (e, t) => {
  var n;
  Y.init(e, t), (n = e._zod.def).when ?? (n.when = (s) => {
    const o = s.value;
    return !mn(o) && o.length !== void 0;
  }), e._zod.onattach.push((s) => {
    const o = s._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    t.minimum > o && (s._zod.bag.minimum = t.minimum);
  }), e._zod.check = (s) => {
    const o = s.value;
    if (o.length >= t.minimum) return;
    const i = gn(o);
    s.issues.push({ origin: i, code: "too_small", minimum: t.minimum, inclusive: true, input: o, inst: e, continue: !t.abort });
  };
});
var $i = h("$ZodCheckLengthEquals", (e, t) => {
  var n;
  Y.init(e, t), (n = e._zod.def).when ?? (n.when = (s) => {
    const o = s.value;
    return !mn(o) && o.length !== void 0;
  }), e._zod.onattach.push((s) => {
    const o = s._zod.bag;
    o.minimum = t.length, o.maximum = t.length, o.length = t.length;
  }), e._zod.check = (s) => {
    const o = s.value, r = o.length;
    if (r === t.length) return;
    const i = gn(o), a = r > t.length;
    s.issues.push({ origin: i, ...a ? { code: "too_big", maximum: t.length } : { code: "too_small", minimum: t.length }, inclusive: true, exact: true, input: s.value, inst: e, continue: !t.abort });
  };
});
var Gt = h("$ZodCheckStringFormat", (e, t) => {
  var n, s;
  Y.init(e, t), e._zod.onattach.push((o) => {
    const r = o._zod.bag;
    r.format = t.format, t.pattern && (r.patterns ?? (r.patterns = /* @__PURE__ */ new Set()), r.patterns.add(t.pattern));
  }), t.pattern ? (n = e._zod).check ?? (n.check = (o) => {
    t.pattern.lastIndex = 0, !t.pattern.test(o.value) && o.issues.push({ origin: "string", code: "invalid_format", format: t.format, input: o.value, ...t.pattern ? { pattern: t.pattern.toString() } : {}, inst: e, continue: !t.abort });
  }) : (s = e._zod).check ?? (s.check = () => {
  });
});
var ji = h("$ZodCheckRegex", (e, t) => {
  Gt.init(e, t), e._zod.check = (n) => {
    t.pattern.lastIndex = 0, !t.pattern.test(n.value) && n.issues.push({ origin: "string", code: "invalid_format", format: "regex", input: n.value, pattern: t.pattern.toString(), inst: e, continue: !t.abort });
  };
});
var Ai = h("$ZodCheckLowerCase", (e, t) => {
  t.pattern ?? (t.pattern = Ti), Gt.init(e, t);
});
var zi = h("$ZodCheckUpperCase", (e, t) => {
  t.pattern ?? (t.pattern = Ei), Gt.init(e, t);
});
var Ri = h("$ZodCheckIncludes", (e, t) => {
  Y.init(e, t);
  const n = qt(t.includes), s = new RegExp(typeof t.position == "number" ? `^.{${t.position}}${n}` : n);
  t.pattern = s, e._zod.onattach.push((o) => {
    const r = o._zod.bag;
    r.patterns ?? (r.patterns = /* @__PURE__ */ new Set()), r.patterns.add(s);
  }), e._zod.check = (o) => {
    o.value.includes(t.includes, t.position) || o.issues.push({ origin: "string", code: "invalid_format", format: "includes", includes: t.includes, input: o.value, inst: e, continue: !t.abort });
  };
});
var Di = h("$ZodCheckStartsWith", (e, t) => {
  Y.init(e, t);
  const n = new RegExp(`^${qt(t.prefix)}.*`);
  t.pattern ?? (t.pattern = n), e._zod.onattach.push((s) => {
    const o = s._zod.bag;
    o.patterns ?? (o.patterns = /* @__PURE__ */ new Set()), o.patterns.add(n);
  }), e._zod.check = (s) => {
    s.value.startsWith(t.prefix) || s.issues.push({ origin: "string", code: "invalid_format", format: "starts_with", prefix: t.prefix, input: s.value, inst: e, continue: !t.abort });
  };
});
var Li = h("$ZodCheckEndsWith", (e, t) => {
  Y.init(e, t);
  const n = new RegExp(`.*${qt(t.suffix)}$`);
  t.pattern ?? (t.pattern = n), e._zod.onattach.push((s) => {
    const o = s._zod.bag;
    o.patterns ?? (o.patterns = /* @__PURE__ */ new Set()), o.patterns.add(n);
  }), e._zod.check = (s) => {
    s.value.endsWith(t.suffix) || s.issues.push({ origin: "string", code: "invalid_format", format: "ends_with", suffix: t.suffix, input: s.value, inst: e, continue: !t.abort });
  };
});
var Ci = h("$ZodCheckOverwrite", (e, t) => {
  Y.init(e, t), e._zod.check = (n) => {
    n.value = t.tx(n.value);
  };
});
var Pi = class {
  static {
    __name(this, "Pi");
  }
  constructor(t = []) {
    this.content = [], this.indent = 0, this && (this.args = t);
  }
  indented(t) {
    this.indent += 1, t(this), this.indent -= 1;
  }
  write(t) {
    if (typeof t == "function") {
      t(this, { execution: "sync" }), t(this, { execution: "async" });
      return;
    }
    const s = t.split(`
`).filter((i) => i), o = Math.min(...s.map((i) => i.length - i.trimStart().length)), r = s.map((i) => i.slice(o)).map((i) => " ".repeat(this.indent * 2) + i);
    for (const i of r) this.content.push(i);
  }
  compile() {
    const t = Function, n = this == null ? void 0 : this.args, o = [...((this == null ? void 0 : this.content) ?? [""]).map((r) => `  ${r}`)];
    return new t(...n, o.join(`
`));
  }
};
var Mi = { major: 4, minor: 3, patch: 6 };
var R = h("$ZodType", (e, t) => {
  var o;
  var n;
  e ?? (e = {}), e._zod.def = t, e._zod.bag = e._zod.bag || {}, e._zod.version = Mi;
  const s = [...e._zod.def.checks ?? []];
  e._zod.traits.has("$ZodCheck") && s.unshift(e);
  for (const r of s) for (const i of r._zod.onattach) i(e);
  if (s.length === 0) (n = e._zod).deferred ?? (n.deferred = []), (o = e._zod.deferred) == null || o.push(() => {
    e._zod.run = e._zod.parse;
  });
  else {
    const r = /* @__PURE__ */ __name((a, d, c) => {
      let l = Xe(a), u;
      for (const f of d) {
        if (f._zod.def.when) {
          if (!f._zod.def.when(a)) continue;
        } else if (l) continue;
        const p = a.issues.length, _ = f._zod.check(a);
        if (_ instanceof Promise && (c == null ? void 0 : c.async) === false) throw new We();
        if (u || _ instanceof Promise) u = (u ?? Promise.resolve()).then(async () => {
          await _, a.issues.length !== p && (l || (l = Xe(a, p)));
        });
        else {
          if (a.issues.length === p) continue;
          l || (l = Xe(a, p));
        }
      }
      return u ? u.then(() => a) : a;
    }, "r"), i = /* @__PURE__ */ __name((a, d, c) => {
      if (Xe(a)) return a.aborted = true, a;
      const l = r(d, s, c);
      if (l instanceof Promise) {
        if (c.async === false) throw new We();
        return l.then((u) => e._zod.parse(u, c));
      }
      return e._zod.parse(l, c);
    }, "i");
    e._zod.run = (a, d) => {
      if (d.skipChecks) return e._zod.parse(a, d);
      if (d.direction === "backward") {
        const l = e._zod.parse({ value: a.value, issues: [] }, { ...d, skipChecks: true });
        return l instanceof Promise ? l.then((u) => i(u, a, d)) : i(l, a, d);
      }
      const c = e._zod.parse(a, d);
      if (c instanceof Promise) {
        if (d.async === false) throw new We();
        return c.then((l) => r(l, s, d));
      }
      return r(c, s, d);
    };
  }
  N(e, "~standard", () => ({ validate: /* @__PURE__ */ __name((r) => {
    var i;
    try {
      const a = Hr(e, r);
      return a.success ? { value: a.data } : { issues: (i = a.error) == null ? void 0 : i.issues };
    } catch {
      return Xr(e, r).then((d) => {
        var c;
        return d.success ? { value: d.data } : { issues: (c = d.error) == null ? void 0 : c.issues };
      });
    }
  }, "validate"), vendor: "zod", version: 1 }));
});
var vn = h("$ZodString", (e, t) => {
  var n;
  R.init(e, t), e._zod.pattern = [...((n = e == null ? void 0 : e._zod.bag) == null ? void 0 : n.patterns) ?? []].pop() ?? wi(e._zod.bag), e._zod.parse = (s, o) => {
    if (t.coerce) try {
      s.value = String(s.value);
    } catch {
    }
    return typeof s.value == "string" || s.issues.push({ expected: "string", code: "invalid_type", input: s.value, inst: e }), s;
  };
});
var A = h("$ZodStringFormat", (e, t) => {
  Gt.init(e, t), vn.init(e, t);
});
var Ui = h("$ZodGUID", (e, t) => {
  t.pattern ?? (t.pattern = ci), A.init(e, t);
});
var Zi = h("$ZodUUID", (e, t) => {
  if (t.version) {
    const s = { v1: 1, v2: 2, v3: 3, v4: 4, v5: 5, v6: 6, v7: 7, v8: 8 }[t.version];
    if (s === void 0) throw new Error(`Invalid UUID version: "${t.version}"`);
    t.pattern ?? (t.pattern = Cn(s));
  } else t.pattern ?? (t.pattern = Cn());
  A.init(e, t);
});
var Fi = h("$ZodEmail", (e, t) => {
  t.pattern ?? (t.pattern = di), A.init(e, t);
});
var Bi = h("$ZodURL", (e, t) => {
  A.init(e, t), e._zod.check = (n) => {
    try {
      const s = n.value.trim(), o = new URL(s);
      t.hostname && (t.hostname.lastIndex = 0, t.hostname.test(o.hostname) || n.issues.push({ code: "invalid_format", format: "url", note: "Invalid hostname", pattern: t.hostname.source, input: n.value, inst: e, continue: !t.abort })), t.protocol && (t.protocol.lastIndex = 0, t.protocol.test(o.protocol.endsWith(":") ? o.protocol.slice(0, -1) : o.protocol) || n.issues.push({ code: "invalid_format", format: "url", note: "Invalid protocol", pattern: t.protocol.source, input: n.value, inst: e, continue: !t.abort })), t.normalize ? n.value = o.href : n.value = s;
      return;
    } catch {
      n.issues.push({ code: "invalid_format", format: "url", input: n.value, inst: e, continue: !t.abort });
    }
  };
});
var Ji = h("$ZodEmoji", (e, t) => {
  t.pattern ?? (t.pattern = ui()), A.init(e, t);
});
var Hi = h("$ZodNanoID", (e, t) => {
  t.pattern ?? (t.pattern = ii), A.init(e, t);
});
var Xi = h("$ZodCUID", (e, t) => {
  t.pattern ?? (t.pattern = ti), A.init(e, t);
});
var qi = h("$ZodCUID2", (e, t) => {
  t.pattern ?? (t.pattern = ni), A.init(e, t);
});
var Wi = h("$ZodULID", (e, t) => {
  t.pattern ?? (t.pattern = si), A.init(e, t);
});
var Ki = h("$ZodXID", (e, t) => {
  t.pattern ?? (t.pattern = oi), A.init(e, t);
});
var Gi = h("$ZodKSUID", (e, t) => {
  t.pattern ?? (t.pattern = ri), A.init(e, t);
});
var Vi = h("$ZodISODateTime", (e, t) => {
  t.pattern ?? (t.pattern = bi(t)), A.init(e, t);
});
var Yi = h("$ZodISODate", (e, t) => {
  t.pattern ?? (t.pattern = yi), A.init(e, t);
});
var Qi = h("$ZodISOTime", (e, t) => {
  t.pattern ?? (t.pattern = vi(t)), A.init(e, t);
});
var ea = h("$ZodISODuration", (e, t) => {
  t.pattern ?? (t.pattern = ai), A.init(e, t);
});
var ta = h("$ZodIPv4", (e, t) => {
  t.pattern ?? (t.pattern = pi), A.init(e, t), e._zod.bag.format = "ipv4";
});
var na = h("$ZodIPv6", (e, t) => {
  t.pattern ?? (t.pattern = fi), A.init(e, t), e._zod.bag.format = "ipv6", e._zod.check = (n) => {
    try {
      new URL(`http://[${n.value}]`);
    } catch {
      n.issues.push({ code: "invalid_format", format: "ipv6", input: n.value, inst: e, continue: !t.abort });
    }
  };
});
var sa = h("$ZodCIDRv4", (e, t) => {
  t.pattern ?? (t.pattern = mi), A.init(e, t);
});
var oa = h("$ZodCIDRv6", (e, t) => {
  t.pattern ?? (t.pattern = hi), A.init(e, t), e._zod.check = (n) => {
    const s = n.value.split("/");
    try {
      if (s.length !== 2) throw new Error();
      const [o, r] = s;
      if (!r) throw new Error();
      const i = Number(r);
      if (`${i}` !== r) throw new Error();
      if (i < 0 || i > 128) throw new Error();
      new URL(`http://[${o}]`);
    } catch {
      n.issues.push({ code: "invalid_format", format: "cidrv6", input: n.value, inst: e, continue: !t.abort });
    }
  };
});
function Us(e) {
  if (e === "") return true;
  if (e.length % 4 !== 0) return false;
  try {
    return atob(e), true;
  } catch {
    return false;
  }
}
__name(Us, "Us");
var ra = h("$ZodBase64", (e, t) => {
  t.pattern ?? (t.pattern = gi), A.init(e, t), e._zod.bag.contentEncoding = "base64", e._zod.check = (n) => {
    Us(n.value) || n.issues.push({ code: "invalid_format", format: "base64", input: n.value, inst: e, continue: !t.abort });
  };
});
function ia(e) {
  if (!zs.test(e)) return false;
  const t = e.replace(/[-_]/g, (s) => s === "-" ? "+" : "/"), n = t.padEnd(Math.ceil(t.length / 4) * 4, "=");
  return Us(n);
}
__name(ia, "ia");
var aa = h("$ZodBase64URL", (e, t) => {
  t.pattern ?? (t.pattern = zs), A.init(e, t), e._zod.bag.contentEncoding = "base64url", e._zod.check = (n) => {
    ia(n.value) || n.issues.push({ code: "invalid_format", format: "base64url", input: n.value, inst: e, continue: !t.abort });
  };
});
var ca = h("$ZodE164", (e, t) => {
  t.pattern ?? (t.pattern = _i), A.init(e, t);
});
function da(e, t = null) {
  try {
    const n = e.split(".");
    if (n.length !== 3) return false;
    const [s] = n;
    if (!s) return false;
    const o = JSON.parse(atob(s));
    return !("typ" in o && (o == null ? void 0 : o.typ) !== "JWT" || !o.alg || t && (!("alg" in o) || o.alg !== t));
  } catch {
    return false;
  }
}
__name(da, "da");
var la = h("$ZodJWT", (e, t) => {
  A.init(e, t), e._zod.check = (n) => {
    da(n.value, t.alg) || n.issues.push({ code: "invalid_format", format: "jwt", input: n.value, inst: e, continue: !t.abort });
  };
});
var Zs = h("$ZodNumber", (e, t) => {
  R.init(e, t), e._zod.pattern = e._zod.bag.pattern ?? Ls, e._zod.parse = (n, s) => {
    if (t.coerce) try {
      n.value = Number(n.value);
    } catch {
    }
    const o = n.value;
    if (typeof o == "number" && !Number.isNaN(o) && Number.isFinite(o)) return n;
    const r = typeof o == "number" ? Number.isNaN(o) ? "NaN" : Number.isFinite(o) ? void 0 : "Infinity" : void 0;
    return n.issues.push({ expected: "number", code: "invalid_type", input: o, inst: e, ...r ? { received: r } : {} }), n;
  };
});
var ua = h("$ZodNumberFormat", (e, t) => {
  Oi.init(e, t), Zs.init(e, t);
});
var pa = h("$ZodBoolean", (e, t) => {
  R.init(e, t), e._zod.pattern = xi, e._zod.parse = (n, s) => {
    if (t.coerce) try {
      n.value = !!n.value;
    } catch {
    }
    const o = n.value;
    return typeof o == "boolean" || n.issues.push({ expected: "boolean", code: "invalid_type", input: o, inst: e }), n;
  };
});
var fa = h("$ZodUnknown", (e, t) => {
  R.init(e, t), e._zod.parse = (n) => n;
});
var ma = h("$ZodNever", (e, t) => {
  R.init(e, t), e._zod.parse = (n, s) => (n.issues.push({ expected: "never", code: "invalid_type", input: n.value, inst: e }), n);
});
function Pn(e, t, n) {
  e.issues.length && t.issues.push(...qe(n, e.issues)), t.value[n] = e.value;
}
__name(Pn, "Pn");
var ha = h("$ZodArray", (e, t) => {
  R.init(e, t), e._zod.parse = (n, s) => {
    const o = n.value;
    if (!Array.isArray(o)) return n.issues.push({ expected: "array", code: "invalid_type", input: o, inst: e }), n;
    n.value = Array(o.length);
    const r = [];
    for (let i = 0; i < o.length; i++) {
      const a = o[i], d = t.element._zod.run({ value: a, issues: [] }, s);
      d instanceof Promise ? r.push(d.then((c) => Pn(c, n, i))) : Pn(d, n, i);
    }
    return r.length ? Promise.all(r).then(() => n) : n;
  };
});
function Pt(e, t, n, s, o) {
  if (e.issues.length) {
    if (o && !(n in s)) return;
    t.issues.push(...qe(n, e.issues));
  }
  e.value === void 0 ? n in s && (t.value[n] = void 0) : t.value[n] = e.value;
}
__name(Pt, "Pt");
function Fs(e) {
  var s, o, r, i;
  const t = Object.keys(e.shape);
  for (const a of t) if (!((i = (r = (o = (s = e.shape) == null ? void 0 : s[a]) == null ? void 0 : o._zod) == null ? void 0 : r.traits) != null && i.has("$ZodType"))) throw new Error(`Invalid element at key "${a}": expected a Zod schema`);
  const n = Rr(e.shape);
  return { ...e, keys: t, keySet: new Set(t), numKeys: t.length, optionalKeys: new Set(n) };
}
__name(Fs, "Fs");
function Bs(e, t, n, s, o, r) {
  const i = [], a = o.keySet, d = o.catchall._zod, c = d.def.type, l = d.optout === "optional";
  for (const u in t) {
    if (a.has(u)) continue;
    if (c === "never") {
      i.push(u);
      continue;
    }
    const f = d.run({ value: t[u], issues: [] }, s);
    f instanceof Promise ? e.push(f.then((p) => Pt(p, n, u, t, l))) : Pt(f, n, u, t, l);
  }
  return i.length && n.issues.push({ code: "unrecognized_keys", keys: i, input: t, inst: r }), e.length ? Promise.all(e).then(() => n) : n;
}
__name(Bs, "Bs");
var ga = h("$ZodObject", (e, t) => {
  R.init(e, t);
  const n = Object.getOwnPropertyDescriptor(t, "shape");
  if (!(n != null && n.get)) {
    const a = t.shape;
    Object.defineProperty(t, "shape", { get: /* @__PURE__ */ __name(() => {
      const d = { ...a };
      return Object.defineProperty(t, "shape", { value: d }), d;
    }, "get") });
  }
  const s = fn(() => Fs(t));
  N(e._zod, "propValues", () => {
    const a = t.shape, d = {};
    for (const c in a) {
      const l = a[c]._zod;
      if (l.values) {
        d[c] ?? (d[c] = /* @__PURE__ */ new Set());
        for (const u of l.values) d[c].add(u);
      }
    }
    return d;
  });
  const o = Ct, r = t.catchall;
  let i;
  e._zod.parse = (a, d) => {
    i ?? (i = s.value);
    const c = a.value;
    if (!o(c)) return a.issues.push({ expected: "object", code: "invalid_type", input: c, inst: e }), a;
    a.value = {};
    const l = [], u = i.shape;
    for (const f of i.keys) {
      const p = u[f], _ = p._zod.optout === "optional", v = p._zod.run({ value: c[f], issues: [] }, d);
      v instanceof Promise ? l.push(v.then((y) => Pt(y, a, f, c, _))) : Pt(v, a, f, c, _);
    }
    return r ? Bs(l, c, a, d, s.value, e) : l.length ? Promise.all(l).then(() => a) : a;
  };
});
var _a = h("$ZodObjectJIT", (e, t) => {
  ga.init(e, t);
  const n = e._zod.parse, s = fn(() => Fs(t)), o = /* @__PURE__ */ __name((f) => {
    var L;
    const p = new Pi(["shape", "payload", "ctx"]), _ = s.value, v = /* @__PURE__ */ __name(($) => {
      const S = Ln($);
      return `shape[${S}]._zod.run({ value: input[${S}], issues: [] }, ctx)`;
    }, "v");
    p.write("const input = payload.value;");
    const y = /* @__PURE__ */ Object.create(null);
    let g = 0;
    for (const $ of _.keys) y[$] = `key_${g++}`;
    p.write("const newResult = {};");
    for (const $ of _.keys) {
      const S = y[$], j = Ln($), G = f[$], M = ((L = G == null ? void 0 : G._zod) == null ? void 0 : L.optout) === "optional";
      p.write(`const ${S} = ${v($)};`), M ? p.write(`
        if (${S}.issues.length) {
          if (${j} in input) {
            payload.issues = payload.issues.concat(${S}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${j}, ...iss.path] : [${j}]
            })));
          }
        }
        
        if (${S}.value === undefined) {
          if (${j} in input) {
            newResult[${j}] = undefined;
          }
        } else {
          newResult[${j}] = ${S}.value;
        }
        
      `) : p.write(`
        if (${S}.issues.length) {
          payload.issues = payload.issues.concat(${S}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${j}, ...iss.path] : [${j}]
          })));
        }
        
        if (${S}.value === undefined) {
          if (${j} in input) {
            newResult[${j}] = undefined;
          }
        } else {
          newResult[${j}] = ${S}.value;
        }
        
      `);
    }
    p.write("payload.value = newResult;"), p.write("return payload;");
    const k = p.compile();
    return ($, S) => k(f, $, S);
  }, "o");
  let r;
  const i = Ct, a = !Ss.jitless, c = a && Ar.value, l = t.catchall;
  let u;
  e._zod.parse = (f, p) => {
    u ?? (u = s.value);
    const _ = f.value;
    return i(_) ? a && c && (p == null ? void 0 : p.async) === false && p.jitless !== true ? (r || (r = o(t.shape)), f = r(f, p), l ? Bs([], _, f, p, u, e) : f) : n(f, p) : (f.issues.push({ expected: "object", code: "invalid_type", input: _, inst: e }), f);
  };
});
function Mn(e, t, n, s) {
  for (const r of e) if (r.issues.length === 0) return t.value = r.value, t;
  const o = e.filter((r) => !Xe(r));
  return o.length === 1 ? (t.value = o[0].value, o[0]) : (t.issues.push({ code: "invalid_union", input: t.value, inst: n, errors: e.map((r) => r.issues.map((i) => xe(i, s, ke()))) }), t);
}
__name(Mn, "Mn");
var ya = h("$ZodUnion", (e, t) => {
  R.init(e, t), N(e._zod, "optin", () => t.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0), N(e._zod, "optout", () => t.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0), N(e._zod, "values", () => {
    if (t.options.every((o) => o._zod.values)) return new Set(t.options.flatMap((o) => Array.from(o._zod.values)));
  }), N(e._zod, "pattern", () => {
    if (t.options.every((o) => o._zod.pattern)) {
      const o = t.options.map((r) => r._zod.pattern);
      return new RegExp(`^(${o.map((r) => hn(r.source)).join("|")})$`);
    }
  });
  const n = t.options.length === 1, s = t.options[0]._zod.run;
  e._zod.parse = (o, r) => {
    if (n) return s(o, r);
    let i = false;
    const a = [];
    for (const d of t.options) {
      const c = d._zod.run({ value: o.value, issues: [] }, r);
      if (c instanceof Promise) a.push(c), i = true;
      else {
        if (c.issues.length === 0) return c;
        a.push(c);
      }
    }
    return i ? Promise.all(a).then((d) => Mn(d, o, e, r)) : Mn(a, o, e, r);
  };
});
var va = h("$ZodIntersection", (e, t) => {
  R.init(e, t), e._zod.parse = (n, s) => {
    const o = n.value, r = t.left._zod.run({ value: o, issues: [] }, s), i = t.right._zod.run({ value: o, issues: [] }, s);
    return r instanceof Promise || i instanceof Promise ? Promise.all([r, i]).then(([d, c]) => Un(n, d, c)) : Un(n, r, i);
  };
});
function dn(e, t) {
  if (e === t) return { valid: true, data: e };
  if (e instanceof Date && t instanceof Date && +e == +t) return { valid: true, data: e };
  if (nt(e) && nt(t)) {
    const n = Object.keys(t), s = Object.keys(e).filter((r) => n.indexOf(r) !== -1), o = { ...e, ...t };
    for (const r of s) {
      const i = dn(e[r], t[r]);
      if (!i.valid) return { valid: false, mergeErrorPath: [r, ...i.mergeErrorPath] };
      o[r] = i.data;
    }
    return { valid: true, data: o };
  }
  if (Array.isArray(e) && Array.isArray(t)) {
    if (e.length !== t.length) return { valid: false, mergeErrorPath: [] };
    const n = [];
    for (let s = 0; s < e.length; s++) {
      const o = e[s], r = t[s], i = dn(o, r);
      if (!i.valid) return { valid: false, mergeErrorPath: [s, ...i.mergeErrorPath] };
      n.push(i.data);
    }
    return { valid: true, data: n };
  }
  return { valid: false, mergeErrorPath: [] };
}
__name(dn, "dn");
function Un(e, t, n) {
  const s = /* @__PURE__ */ new Map();
  let o;
  for (const a of t.issues) if (a.code === "unrecognized_keys") {
    o ?? (o = a);
    for (const d of a.keys) s.has(d) || s.set(d, {}), s.get(d).l = true;
  } else e.issues.push(a);
  for (const a of n.issues) if (a.code === "unrecognized_keys") for (const d of a.keys) s.has(d) || s.set(d, {}), s.get(d).r = true;
  else e.issues.push(a);
  const r = [...s].filter(([, a]) => a.l && a.r).map(([a]) => a);
  if (r.length && o && e.issues.push({ ...o, keys: r }), Xe(e)) return e;
  const i = dn(t.value, n.value);
  if (!i.valid) throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(i.mergeErrorPath)}`);
  return e.value = i.data, e;
}
__name(Un, "Un");
var ba = h("$ZodRecord", (e, t) => {
  R.init(e, t), e._zod.parse = (n, s) => {
    const o = n.value;
    if (!nt(o)) return n.issues.push({ expected: "record", code: "invalid_type", input: o, inst: e }), n;
    const r = [], i = t.keyType._zod.values;
    if (i) {
      n.value = {};
      const a = /* @__PURE__ */ new Set();
      for (const c of i) if (typeof c == "string" || typeof c == "number" || typeof c == "symbol") {
        a.add(typeof c == "number" ? c.toString() : c);
        const l = t.valueType._zod.run({ value: o[c], issues: [] }, s);
        l instanceof Promise ? r.push(l.then((u) => {
          u.issues.length && n.issues.push(...qe(c, u.issues)), n.value[c] = u.value;
        })) : (l.issues.length && n.issues.push(...qe(c, l.issues)), n.value[c] = l.value);
      }
      let d;
      for (const c in o) a.has(c) || (d = d ?? [], d.push(c));
      d && d.length > 0 && n.issues.push({ code: "unrecognized_keys", input: o, inst: e, keys: d });
    } else {
      n.value = {};
      for (const a of Reflect.ownKeys(o)) {
        if (a === "__proto__") continue;
        let d = t.keyType._zod.run({ value: a, issues: [] }, s);
        if (d instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
        if (typeof a == "string" && Ls.test(a) && d.issues.length) {
          const u = t.keyType._zod.run({ value: Number(a), issues: [] }, s);
          if (u instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
          u.issues.length === 0 && (d = u);
        }
        if (d.issues.length) {
          t.mode === "loose" ? n.value[a] = o[a] : n.issues.push({ code: "invalid_key", origin: "record", issues: d.issues.map((u) => xe(u, s, ke())), input: a, path: [a], inst: e });
          continue;
        }
        const l = t.valueType._zod.run({ value: o[a], issues: [] }, s);
        l instanceof Promise ? r.push(l.then((u) => {
          u.issues.length && n.issues.push(...qe(a, u.issues)), n.value[d.value] = u.value;
        })) : (l.issues.length && n.issues.push(...qe(a, l.issues)), n.value[d.value] = l.value);
      }
    }
    return r.length ? Promise.all(r).then(() => n) : n;
  };
});
var wa = h("$ZodEnum", (e, t) => {
  R.init(e, t);
  const n = Os(t.entries), s = new Set(n);
  e._zod.values = s, e._zod.pattern = new RegExp(`^(${n.filter((o) => zr.has(typeof o)).map((o) => typeof o == "string" ? qt(o) : o.toString()).join("|")})$`), e._zod.parse = (o, r) => {
    const i = o.value;
    return s.has(i) || o.issues.push({ code: "invalid_value", values: n, input: i, inst: e }), o;
  };
});
var ka = h("$ZodTransform", (e, t) => {
  R.init(e, t), e._zod.parse = (n, s) => {
    if (s.direction === "backward") throw new Es(e.constructor.name);
    const o = t.transform(n.value, n);
    if (s.async) return (o instanceof Promise ? o : Promise.resolve(o)).then((i) => (n.value = i, n));
    if (o instanceof Promise) throw new We();
    return n.value = o, n;
  };
});
function Zn(e, t) {
  return e.issues.length && t === void 0 ? { issues: [], value: void 0 } : e;
}
__name(Zn, "Zn");
var Js = h("$ZodOptional", (e, t) => {
  R.init(e, t), e._zod.optin = "optional", e._zod.optout = "optional", N(e._zod, "values", () => t.innerType._zod.values ? /* @__PURE__ */ new Set([...t.innerType._zod.values, void 0]) : void 0), N(e._zod, "pattern", () => {
    const n = t.innerType._zod.pattern;
    return n ? new RegExp(`^(${hn(n.source)})?$`) : void 0;
  }), e._zod.parse = (n, s) => {
    if (t.innerType._zod.optin === "optional") {
      const o = t.innerType._zod.run(n, s);
      return o instanceof Promise ? o.then((r) => Zn(r, n.value)) : Zn(o, n.value);
    }
    return n.value === void 0 ? n : t.innerType._zod.run(n, s);
  };
});
var xa = h("$ZodExactOptional", (e, t) => {
  Js.init(e, t), N(e._zod, "values", () => t.innerType._zod.values), N(e._zod, "pattern", () => t.innerType._zod.pattern), e._zod.parse = (n, s) => t.innerType._zod.run(n, s);
});
var Ta = h("$ZodNullable", (e, t) => {
  R.init(e, t), N(e._zod, "optin", () => t.innerType._zod.optin), N(e._zod, "optout", () => t.innerType._zod.optout), N(e._zod, "pattern", () => {
    const n = t.innerType._zod.pattern;
    return n ? new RegExp(`^(${hn(n.source)}|null)$`) : void 0;
  }), N(e._zod, "values", () => t.innerType._zod.values ? /* @__PURE__ */ new Set([...t.innerType._zod.values, null]) : void 0), e._zod.parse = (n, s) => n.value === null ? n : t.innerType._zod.run(n, s);
});
var Ea = h("$ZodDefault", (e, t) => {
  R.init(e, t), e._zod.optin = "optional", N(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (n, s) => {
    if (s.direction === "backward") return t.innerType._zod.run(n, s);
    if (n.value === void 0) return n.value = t.defaultValue, n;
    const o = t.innerType._zod.run(n, s);
    return o instanceof Promise ? o.then((r) => Fn(r, t)) : Fn(o, t);
  };
});
function Fn(e, t) {
  return e.value === void 0 && (e.value = t.defaultValue), e;
}
__name(Fn, "Fn");
var Sa = h("$ZodPrefault", (e, t) => {
  R.init(e, t), e._zod.optin = "optional", N(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (n, s) => (s.direction === "backward" || n.value === void 0 && (n.value = t.defaultValue), t.innerType._zod.run(n, s));
});
var Oa = h("$ZodNonOptional", (e, t) => {
  R.init(e, t), N(e._zod, "values", () => {
    const n = t.innerType._zod.values;
    return n ? new Set([...n].filter((s) => s !== void 0)) : void 0;
  }), e._zod.parse = (n, s) => {
    const o = t.innerType._zod.run(n, s);
    return o instanceof Promise ? o.then((r) => Bn(r, e)) : Bn(o, e);
  };
});
function Bn(e, t) {
  return !e.issues.length && e.value === void 0 && e.issues.push({ code: "invalid_type", expected: "nonoptional", input: e.value, inst: t }), e;
}
__name(Bn, "Bn");
var Ia = h("$ZodCatch", (e, t) => {
  R.init(e, t), N(e._zod, "optin", () => t.innerType._zod.optin), N(e._zod, "optout", () => t.innerType._zod.optout), N(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (n, s) => {
    if (s.direction === "backward") return t.innerType._zod.run(n, s);
    const o = t.innerType._zod.run(n, s);
    return o instanceof Promise ? o.then((r) => (n.value = r.value, r.issues.length && (n.value = t.catchValue({ ...n, error: { issues: r.issues.map((i) => xe(i, s, ke())) }, input: n.value }), n.issues = []), n)) : (n.value = o.value, o.issues.length && (n.value = t.catchValue({ ...n, error: { issues: o.issues.map((r) => xe(r, s, ke())) }, input: n.value }), n.issues = []), n);
  };
});
var Na = h("$ZodPipe", (e, t) => {
  R.init(e, t), N(e._zod, "values", () => t.in._zod.values), N(e._zod, "optin", () => t.in._zod.optin), N(e._zod, "optout", () => t.out._zod.optout), N(e._zod, "propValues", () => t.in._zod.propValues), e._zod.parse = (n, s) => {
    if (s.direction === "backward") {
      const r = t.out._zod.run(n, s);
      return r instanceof Promise ? r.then((i) => jt(i, t.in, s)) : jt(r, t.in, s);
    }
    const o = t.in._zod.run(n, s);
    return o instanceof Promise ? o.then((r) => jt(r, t.out, s)) : jt(o, t.out, s);
  };
});
function jt(e, t, n) {
  return e.issues.length ? (e.aborted = true, e) : t._zod.run({ value: e.value, issues: e.issues }, n);
}
__name(jt, "jt");
var $a = h("$ZodReadonly", (e, t) => {
  R.init(e, t), N(e._zod, "propValues", () => t.innerType._zod.propValues), N(e._zod, "values", () => t.innerType._zod.values), N(e._zod, "optin", () => {
    var n, s;
    return (s = (n = t.innerType) == null ? void 0 : n._zod) == null ? void 0 : s.optin;
  }), N(e._zod, "optout", () => {
    var n, s;
    return (s = (n = t.innerType) == null ? void 0 : n._zod) == null ? void 0 : s.optout;
  }), e._zod.parse = (n, s) => {
    if (s.direction === "backward") return t.innerType._zod.run(n, s);
    const o = t.innerType._zod.run(n, s);
    return o instanceof Promise ? o.then(Jn) : Jn(o);
  };
});
function Jn(e) {
  return e.value = Object.freeze(e.value), e;
}
__name(Jn, "Jn");
var ja = h("$ZodCustom", (e, t) => {
  Y.init(e, t), R.init(e, t), e._zod.parse = (n, s) => n, e._zod.check = (n) => {
    const s = n.value, o = t.fn(s);
    if (o instanceof Promise) return o.then((r) => Hn(r, n, s, e));
    Hn(o, n, s, e);
  };
});
function Hn(e, t, n, s) {
  if (!e) {
    const o = { code: "custom", input: n, inst: s, path: [...s._zod.def.path ?? []], continue: !s._zod.def.abort };
    s._zod.def.params && (o.params = s._zod.def.params), t.issues.push(pt(o));
  }
}
__name(Hn, "Hn");
var Xn;
var Aa = class {
  static {
    __name(this, "Aa");
  }
  constructor() {
    this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map();
  }
  add(t, ...n) {
    const s = n[0];
    return this._map.set(t, s), s && typeof s == "object" && "id" in s && this._idmap.set(s.id, t), this;
  }
  clear() {
    return this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map(), this;
  }
  remove(t) {
    const n = this._map.get(t);
    return n && typeof n == "object" && "id" in n && this._idmap.delete(n.id), this._map.delete(t), this;
  }
  get(t) {
    const n = t._zod.parent;
    if (n) {
      const s = { ...this.get(n) ?? {} };
      delete s.id;
      const o = { ...s, ...this._map.get(t) };
      return Object.keys(o).length ? o : void 0;
    }
    return this._map.get(t);
  }
  has(t) {
    return this._map.has(t);
  }
};
function za() {
  return new Aa();
}
__name(za, "za");
(Xn = globalThis).__zod_globalRegistry ?? (Xn.__zod_globalRegistry = za());
var dt = globalThis.__zod_globalRegistry;
function Ra(e, t) {
  return new e({ type: "string", ...x(t) });
}
__name(Ra, "Ra");
function Da(e, t) {
  return new e({ type: "string", format: "email", check: "string_format", abort: false, ...x(t) });
}
__name(Da, "Da");
function qn(e, t) {
  return new e({ type: "string", format: "guid", check: "string_format", abort: false, ...x(t) });
}
__name(qn, "qn");
function La(e, t) {
  return new e({ type: "string", format: "uuid", check: "string_format", abort: false, ...x(t) });
}
__name(La, "La");
function Ca(e, t) {
  return new e({ type: "string", format: "uuid", check: "string_format", abort: false, version: "v4", ...x(t) });
}
__name(Ca, "Ca");
function Pa(e, t) {
  return new e({ type: "string", format: "uuid", check: "string_format", abort: false, version: "v6", ...x(t) });
}
__name(Pa, "Pa");
function Ma(e, t) {
  return new e({ type: "string", format: "uuid", check: "string_format", abort: false, version: "v7", ...x(t) });
}
__name(Ma, "Ma");
function Ua(e, t) {
  return new e({ type: "string", format: "url", check: "string_format", abort: false, ...x(t) });
}
__name(Ua, "Ua");
function Za(e, t) {
  return new e({ type: "string", format: "emoji", check: "string_format", abort: false, ...x(t) });
}
__name(Za, "Za");
function Fa(e, t) {
  return new e({ type: "string", format: "nanoid", check: "string_format", abort: false, ...x(t) });
}
__name(Fa, "Fa");
function Ba(e, t) {
  return new e({ type: "string", format: "cuid", check: "string_format", abort: false, ...x(t) });
}
__name(Ba, "Ba");
function Ja(e, t) {
  return new e({ type: "string", format: "cuid2", check: "string_format", abort: false, ...x(t) });
}
__name(Ja, "Ja");
function Ha(e, t) {
  return new e({ type: "string", format: "ulid", check: "string_format", abort: false, ...x(t) });
}
__name(Ha, "Ha");
function Xa(e, t) {
  return new e({ type: "string", format: "xid", check: "string_format", abort: false, ...x(t) });
}
__name(Xa, "Xa");
function qa(e, t) {
  return new e({ type: "string", format: "ksuid", check: "string_format", abort: false, ...x(t) });
}
__name(qa, "qa");
function Wa(e, t) {
  return new e({ type: "string", format: "ipv4", check: "string_format", abort: false, ...x(t) });
}
__name(Wa, "Wa");
function Ka(e, t) {
  return new e({ type: "string", format: "ipv6", check: "string_format", abort: false, ...x(t) });
}
__name(Ka, "Ka");
function Ga(e, t) {
  return new e({ type: "string", format: "cidrv4", check: "string_format", abort: false, ...x(t) });
}
__name(Ga, "Ga");
function Va(e, t) {
  return new e({ type: "string", format: "cidrv6", check: "string_format", abort: false, ...x(t) });
}
__name(Va, "Va");
function Ya(e, t) {
  return new e({ type: "string", format: "base64", check: "string_format", abort: false, ...x(t) });
}
__name(Ya, "Ya");
function Qa(e, t) {
  return new e({ type: "string", format: "base64url", check: "string_format", abort: false, ...x(t) });
}
__name(Qa, "Qa");
function ec(e, t) {
  return new e({ type: "string", format: "e164", check: "string_format", abort: false, ...x(t) });
}
__name(ec, "ec");
function tc(e, t) {
  return new e({ type: "string", format: "jwt", check: "string_format", abort: false, ...x(t) });
}
__name(tc, "tc");
function nc(e, t) {
  return new e({ type: "string", format: "datetime", check: "string_format", offset: false, local: false, precision: null, ...x(t) });
}
__name(nc, "nc");
function sc(e, t) {
  return new e({ type: "string", format: "date", check: "string_format", ...x(t) });
}
__name(sc, "sc");
function oc(e, t) {
  return new e({ type: "string", format: "time", check: "string_format", precision: null, ...x(t) });
}
__name(oc, "oc");
function rc(e, t) {
  return new e({ type: "string", format: "duration", check: "string_format", ...x(t) });
}
__name(rc, "rc");
function ic(e, t) {
  return new e({ type: "number", checks: [], ...x(t) });
}
__name(ic, "ic");
function ac(e, t) {
  return new e({ type: "number", check: "number_format", abort: false, format: "safeint", ...x(t) });
}
__name(ac, "ac");
function cc(e, t) {
  return new e({ type: "boolean", ...x(t) });
}
__name(cc, "cc");
function dc(e) {
  return new e({ type: "unknown" });
}
__name(dc, "dc");
function lc(e, t) {
  return new e({ type: "never", ...x(t) });
}
__name(lc, "lc");
function Wn(e, t) {
  return new Ps({ check: "less_than", ...x(t), value: e, inclusive: false });
}
__name(Wn, "Wn");
function on(e, t) {
  return new Ps({ check: "less_than", ...x(t), value: e, inclusive: true });
}
__name(on, "on");
function Kn(e, t) {
  return new Ms({ check: "greater_than", ...x(t), value: e, inclusive: false });
}
__name(Kn, "Kn");
function rn(e, t) {
  return new Ms({ check: "greater_than", ...x(t), value: e, inclusive: true });
}
__name(rn, "rn");
function Gn(e, t) {
  return new Si({ check: "multiple_of", ...x(t), value: e });
}
__name(Gn, "Gn");
function Hs(e, t) {
  return new Ii({ check: "max_length", ...x(t), maximum: e });
}
__name(Hs, "Hs");
function Mt(e, t) {
  return new Ni({ check: "min_length", ...x(t), minimum: e });
}
__name(Mt, "Mt");
function Xs(e, t) {
  return new $i({ check: "length_equals", ...x(t), length: e });
}
__name(Xs, "Xs");
function uc(e, t) {
  return new ji({ check: "string_format", format: "regex", ...x(t), pattern: e });
}
__name(uc, "uc");
function pc(e) {
  return new Ai({ check: "string_format", format: "lowercase", ...x(e) });
}
__name(pc, "pc");
function fc(e) {
  return new zi({ check: "string_format", format: "uppercase", ...x(e) });
}
__name(fc, "fc");
function mc(e, t) {
  return new Ri({ check: "string_format", format: "includes", ...x(t), includes: e });
}
__name(mc, "mc");
function hc(e, t) {
  return new Di({ check: "string_format", format: "starts_with", ...x(t), prefix: e });
}
__name(hc, "hc");
function gc(e, t) {
  return new Li({ check: "string_format", format: "ends_with", ...x(t), suffix: e });
}
__name(gc, "gc");
function rt(e) {
  return new Ci({ check: "overwrite", tx: e });
}
__name(rt, "rt");
function _c(e) {
  return rt((t) => t.normalize(e));
}
__name(_c, "_c");
function yc() {
  return rt((e) => e.trim());
}
__name(yc, "yc");
function vc() {
  return rt((e) => e.toLowerCase());
}
__name(vc, "vc");
function bc() {
  return rt((e) => e.toUpperCase());
}
__name(bc, "bc");
function wc() {
  return rt((e) => jr(e));
}
__name(wc, "wc");
function kc(e, t, n) {
  return new e({ type: "array", element: t, ...x(n) });
}
__name(kc, "kc");
function xc(e, t, n) {
  return new e({ type: "custom", check: "custom", fn: t, ...x(n) });
}
__name(xc, "xc");
function Tc(e) {
  const t = Ec((n) => (n.addIssue = (s) => {
    if (typeof s == "string") n.issues.push(pt(s, n.value, t._zod.def));
    else {
      const o = s;
      o.fatal && (o.continue = false), o.code ?? (o.code = "custom"), o.input ?? (o.input = n.value), o.inst ?? (o.inst = t), o.continue ?? (o.continue = !t._zod.def.abort), n.issues.push(pt(o));
    }
  }, e(n.value, n)));
  return t;
}
__name(Tc, "Tc");
function Ec(e, t) {
  const n = new Y({ check: "custom", ...x(t) });
  return n._zod.check = e, n;
}
__name(Ec, "Ec");
function qs(e) {
  let t = (e == null ? void 0 : e.target) ?? "draft-2020-12";
  return t === "draft-4" && (t = "draft-04"), t === "draft-7" && (t = "draft-07"), { processors: e.processors ?? {}, metadataRegistry: (e == null ? void 0 : e.metadata) ?? dt, target: t, unrepresentable: (e == null ? void 0 : e.unrepresentable) ?? "throw", override: (e == null ? void 0 : e.override) ?? (() => {
  }), io: (e == null ? void 0 : e.io) ?? "output", counter: 0, seen: /* @__PURE__ */ new Map(), cycles: (e == null ? void 0 : e.cycles) ?? "ref", reused: (e == null ? void 0 : e.reused) ?? "inline", external: (e == null ? void 0 : e.external) ?? void 0 };
}
__name(qs, "qs");
function P(e, t, n = { path: [], schemaPath: [] }) {
  var l, u;
  var s;
  const o = e._zod.def, r = t.seen.get(e);
  if (r) return r.count++, n.schemaPath.includes(e) && (r.cycle = n.path), r.schema;
  const i = { schema: {}, count: 1, cycle: void 0, path: n.path };
  t.seen.set(e, i);
  const a = (u = (l = e._zod).toJSONSchema) == null ? void 0 : u.call(l);
  if (a) i.schema = a;
  else {
    const f = { ...n, schemaPath: [...n.schemaPath, e], path: n.path };
    if (e._zod.processJSONSchema) e._zod.processJSONSchema(t, i.schema, f);
    else {
      const _ = i.schema, v = t.processors[o.type];
      if (!v) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${o.type}`);
      v(e, t, _, f);
    }
    const p = e._zod.parent;
    p && (i.ref || (i.ref = p), P(p, t, f), t.seen.get(p).isParent = true);
  }
  const d = t.metadataRegistry.get(e);
  return d && Object.assign(i.schema, d), t.io === "input" && W(e) && (delete i.schema.examples, delete i.schema.default), t.io === "input" && i.schema._prefault && ((s = i.schema).default ?? (s.default = i.schema._prefault)), delete i.schema._prefault, t.seen.get(e).schema;
}
__name(P, "P");
function Ws(e, t) {
  var i, a, d, c;
  const n = e.seen.get(t);
  if (!n) throw new Error("Unprocessed schema. This is a bug in Zod.");
  const s = /* @__PURE__ */ new Map();
  for (const l of e.seen.entries()) {
    const u = (i = e.metadataRegistry.get(l[0])) == null ? void 0 : i.id;
    if (u) {
      const f = s.get(u);
      if (f && f !== l[0]) throw new Error(`Duplicate schema id "${u}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
      s.set(u, l[0]);
    }
  }
  const o = /* @__PURE__ */ __name((l) => {
    var v;
    const u = e.target === "draft-2020-12" ? "$defs" : "definitions";
    if (e.external) {
      const y = (v = e.external.registry.get(l[0])) == null ? void 0 : v.id, g = e.external.uri ?? ((L) => L);
      if (y) return { ref: g(y) };
      const k = l[1].defId ?? l[1].schema.id ?? `schema${e.counter++}`;
      return l[1].defId = k, { defId: k, ref: `${g("__shared")}#/${u}/${k}` };
    }
    if (l[1] === n) return { ref: "#" };
    const p = `#/${u}/`, _ = l[1].schema.id ?? `__schema${e.counter++}`;
    return { defId: _, ref: p + _ };
  }, "o"), r = /* @__PURE__ */ __name((l) => {
    if (l[1].schema.$ref) return;
    const u = l[1], { ref: f, defId: p } = o(l);
    u.def = { ...u.schema }, p && (u.defId = p);
    const _ = u.schema;
    for (const v in _) delete _[v];
    _.$ref = f;
  }, "r");
  if (e.cycles === "throw") for (const l of e.seen.entries()) {
    const u = l[1];
    if (u.cycle) throw new Error(`Cycle detected: #/${(a = u.cycle) == null ? void 0 : a.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
  }
  for (const l of e.seen.entries()) {
    const u = l[1];
    if (t === l[0]) {
      r(l);
      continue;
    }
    if (e.external) {
      const p = (d = e.external.registry.get(l[0])) == null ? void 0 : d.id;
      if (t !== l[0] && p) {
        r(l);
        continue;
      }
    }
    if ((c = e.metadataRegistry.get(l[0])) == null ? void 0 : c.id) {
      r(l);
      continue;
    }
    if (u.cycle) {
      r(l);
      continue;
    }
    if (u.count > 1 && e.reused === "ref") {
      r(l);
      continue;
    }
  }
}
__name(Ws, "Ws");
function Ks(e, t) {
  var i, a, d;
  const n = e.seen.get(t);
  if (!n) throw new Error("Unprocessed schema. This is a bug in Zod.");
  const s = /* @__PURE__ */ __name((c) => {
    const l = e.seen.get(c);
    if (l.ref === null) return;
    const u = l.def ?? l.schema, f = { ...u }, p = l.ref;
    if (l.ref = null, p) {
      s(p);
      const v = e.seen.get(p), y = v.schema;
      if (y.$ref && (e.target === "draft-07" || e.target === "draft-04" || e.target === "openapi-3.0") ? (u.allOf = u.allOf ?? [], u.allOf.push(y)) : Object.assign(u, y), Object.assign(u, f), c._zod.parent === p) for (const k in u) k === "$ref" || k === "allOf" || k in f || delete u[k];
      if (y.$ref && v.def) for (const k in u) k === "$ref" || k === "allOf" || k in v.def && JSON.stringify(u[k]) === JSON.stringify(v.def[k]) && delete u[k];
    }
    const _ = c._zod.parent;
    if (_ && _ !== p) {
      s(_);
      const v = e.seen.get(_);
      if (v != null && v.schema.$ref && (u.$ref = v.schema.$ref, v.def)) for (const y in u) y === "$ref" || y === "allOf" || y in v.def && JSON.stringify(u[y]) === JSON.stringify(v.def[y]) && delete u[y];
    }
    e.override({ zodSchema: c, jsonSchema: u, path: l.path ?? [] });
  }, "s");
  for (const c of [...e.seen.entries()].reverse()) s(c[0]);
  const o = {};
  if (e.target === "draft-2020-12" ? o.$schema = "https://json-schema.org/draft/2020-12/schema" : e.target === "draft-07" ? o.$schema = "http://json-schema.org/draft-07/schema#" : e.target === "draft-04" ? o.$schema = "http://json-schema.org/draft-04/schema#" : e.target, (i = e.external) != null && i.uri) {
    const c = (a = e.external.registry.get(t)) == null ? void 0 : a.id;
    if (!c) throw new Error("Schema is missing an `id` property");
    o.$id = e.external.uri(c);
  }
  Object.assign(o, n.def ?? n.schema);
  const r = ((d = e.external) == null ? void 0 : d.defs) ?? {};
  for (const c of e.seen.entries()) {
    const l = c[1];
    l.def && l.defId && (r[l.defId] = l.def);
  }
  e.external || Object.keys(r).length > 0 && (e.target === "draft-2020-12" ? o.$defs = r : o.definitions = r);
  try {
    const c = JSON.parse(JSON.stringify(o));
    return Object.defineProperty(c, "~standard", { value: { ...t["~standard"], jsonSchema: { input: Ut(t, "input", e.processors), output: Ut(t, "output", e.processors) } }, enumerable: false, writable: false }), c;
  } catch {
    throw new Error("Error converting schema to JSON.");
  }
}
__name(Ks, "Ks");
function W(e, t) {
  const n = t ?? { seen: /* @__PURE__ */ new Set() };
  if (n.seen.has(e)) return false;
  n.seen.add(e);
  const s = e._zod.def;
  if (s.type === "transform") return true;
  if (s.type === "array") return W(s.element, n);
  if (s.type === "set") return W(s.valueType, n);
  if (s.type === "lazy") return W(s.getter(), n);
  if (s.type === "promise" || s.type === "optional" || s.type === "nonoptional" || s.type === "nullable" || s.type === "readonly" || s.type === "default" || s.type === "prefault") return W(s.innerType, n);
  if (s.type === "intersection") return W(s.left, n) || W(s.right, n);
  if (s.type === "record" || s.type === "map") return W(s.keyType, n) || W(s.valueType, n);
  if (s.type === "pipe") return W(s.in, n) || W(s.out, n);
  if (s.type === "object") {
    for (const o in s.shape) if (W(s.shape[o], n)) return true;
    return false;
  }
  if (s.type === "union") {
    for (const o of s.options) if (W(o, n)) return true;
    return false;
  }
  if (s.type === "tuple") {
    for (const o of s.items) if (W(o, n)) return true;
    return !!(s.rest && W(s.rest, n));
  }
  return false;
}
__name(W, "W");
var Sc = /* @__PURE__ */ __name((e, t = {}) => (n) => {
  const s = qs({ ...n, processors: t });
  return P(e, s), Ws(s, e), Ks(s, e);
}, "Sc");
var Ut = /* @__PURE__ */ __name((e, t, n = {}) => (s) => {
  const { libraryOptions: o, target: r } = s ?? {}, i = qs({ ...o ?? {}, target: r, io: t, processors: n });
  return P(e, i), Ws(i, e), Ks(i, e);
}, "Ut");
var Oc = { guid: "uuid", url: "uri", datetime: "date-time", json_string: "json-string", regex: "" };
var Ic = /* @__PURE__ */ __name((e, t, n, s) => {
  const o = n;
  o.type = "string";
  const { minimum: r, maximum: i, format: a, patterns: d, contentEncoding: c } = e._zod.bag;
  if (typeof r == "number" && (o.minLength = r), typeof i == "number" && (o.maxLength = i), a && (o.format = Oc[a] ?? a, o.format === "" && delete o.format, a === "time" && delete o.format), c && (o.contentEncoding = c), d && d.size > 0) {
    const l = [...d];
    l.length === 1 ? o.pattern = l[0].source : l.length > 1 && (o.allOf = [...l.map((u) => ({ ...t.target === "draft-07" || t.target === "draft-04" || t.target === "openapi-3.0" ? { type: "string" } : {}, pattern: u.source }))]);
  }
}, "Ic");
var Nc = /* @__PURE__ */ __name((e, t, n, s) => {
  const o = n, { minimum: r, maximum: i, format: a, multipleOf: d, exclusiveMaximum: c, exclusiveMinimum: l } = e._zod.bag;
  typeof a == "string" && a.includes("int") ? o.type = "integer" : o.type = "number", typeof l == "number" && (t.target === "draft-04" || t.target === "openapi-3.0" ? (o.minimum = l, o.exclusiveMinimum = true) : o.exclusiveMinimum = l), typeof r == "number" && (o.minimum = r, typeof l == "number" && t.target !== "draft-04" && (l >= r ? delete o.minimum : delete o.exclusiveMinimum)), typeof c == "number" && (t.target === "draft-04" || t.target === "openapi-3.0" ? (o.maximum = c, o.exclusiveMaximum = true) : o.exclusiveMaximum = c), typeof i == "number" && (o.maximum = i, typeof c == "number" && t.target !== "draft-04" && (c <= i ? delete o.maximum : delete o.exclusiveMaximum)), typeof d == "number" && (o.multipleOf = d);
}, "Nc");
var $c = /* @__PURE__ */ __name((e, t, n, s) => {
  n.type = "boolean";
}, "$c");
var jc = /* @__PURE__ */ __name((e, t, n, s) => {
  n.not = {};
}, "jc");
var Ac = /* @__PURE__ */ __name((e, t, n, s) => {
}, "Ac");
var zc = /* @__PURE__ */ __name((e, t, n, s) => {
  const o = e._zod.def, r = Os(o.entries);
  r.every((i) => typeof i == "number") && (n.type = "number"), r.every((i) => typeof i == "string") && (n.type = "string"), n.enum = r;
}, "zc");
var Rc = /* @__PURE__ */ __name((e, t, n, s) => {
  if (t.unrepresentable === "throw") throw new Error("Custom types cannot be represented in JSON Schema");
}, "Rc");
var Dc = /* @__PURE__ */ __name((e, t, n, s) => {
  if (t.unrepresentable === "throw") throw new Error("Transforms cannot be represented in JSON Schema");
}, "Dc");
var Lc = /* @__PURE__ */ __name((e, t, n, s) => {
  const o = n, r = e._zod.def, { minimum: i, maximum: a } = e._zod.bag;
  typeof i == "number" && (o.minItems = i), typeof a == "number" && (o.maxItems = a), o.type = "array", o.items = P(r.element, t, { ...s, path: [...s.path, "items"] });
}, "Lc");
var Cc = /* @__PURE__ */ __name((e, t, n, s) => {
  var c;
  const o = n, r = e._zod.def;
  o.type = "object", o.properties = {};
  const i = r.shape;
  for (const l in i) o.properties[l] = P(i[l], t, { ...s, path: [...s.path, "properties", l] });
  const a = new Set(Object.keys(i)), d = new Set([...a].filter((l) => {
    const u = r.shape[l]._zod;
    return t.io === "input" ? u.optin === void 0 : u.optout === void 0;
  }));
  d.size > 0 && (o.required = Array.from(d)), ((c = r.catchall) == null ? void 0 : c._zod.def.type) === "never" ? o.additionalProperties = false : r.catchall ? r.catchall && (o.additionalProperties = P(r.catchall, t, { ...s, path: [...s.path, "additionalProperties"] })) : t.io === "output" && (o.additionalProperties = false);
}, "Cc");
var Pc = /* @__PURE__ */ __name((e, t, n, s) => {
  const o = e._zod.def, r = o.inclusive === false, i = o.options.map((a, d) => P(a, t, { ...s, path: [...s.path, r ? "oneOf" : "anyOf", d] }));
  r ? n.oneOf = i : n.anyOf = i;
}, "Pc");
var Mc = /* @__PURE__ */ __name((e, t, n, s) => {
  const o = e._zod.def, r = P(o.left, t, { ...s, path: [...s.path, "allOf", 0] }), i = P(o.right, t, { ...s, path: [...s.path, "allOf", 1] }), a = /* @__PURE__ */ __name((c) => "allOf" in c && Object.keys(c).length === 1, "a"), d = [...a(r) ? r.allOf : [r], ...a(i) ? i.allOf : [i]];
  n.allOf = d;
}, "Mc");
var Uc = /* @__PURE__ */ __name((e, t, n, s) => {
  const o = n, r = e._zod.def;
  o.type = "object";
  const i = r.keyType, a = i._zod.bag, d = a == null ? void 0 : a.patterns;
  if (r.mode === "loose" && d && d.size > 0) {
    const l = P(r.valueType, t, { ...s, path: [...s.path, "patternProperties", "*"] });
    o.patternProperties = {};
    for (const u of d) o.patternProperties[u.source] = l;
  } else (t.target === "draft-07" || t.target === "draft-2020-12") && (o.propertyNames = P(r.keyType, t, { ...s, path: [...s.path, "propertyNames"] })), o.additionalProperties = P(r.valueType, t, { ...s, path: [...s.path, "additionalProperties"] });
  const c = i._zod.values;
  if (c) {
    const l = [...c].filter((u) => typeof u == "string" || typeof u == "number");
    l.length > 0 && (o.required = l);
  }
}, "Uc");
var Zc = /* @__PURE__ */ __name((e, t, n, s) => {
  const o = e._zod.def, r = P(o.innerType, t, s), i = t.seen.get(e);
  t.target === "openapi-3.0" ? (i.ref = o.innerType, n.nullable = true) : n.anyOf = [r, { type: "null" }];
}, "Zc");
var Fc = /* @__PURE__ */ __name((e, t, n, s) => {
  const o = e._zod.def;
  P(o.innerType, t, s);
  const r = t.seen.get(e);
  r.ref = o.innerType;
}, "Fc");
var Bc = /* @__PURE__ */ __name((e, t, n, s) => {
  const o = e._zod.def;
  P(o.innerType, t, s);
  const r = t.seen.get(e);
  r.ref = o.innerType, n.default = JSON.parse(JSON.stringify(o.defaultValue));
}, "Bc");
var Jc = /* @__PURE__ */ __name((e, t, n, s) => {
  const o = e._zod.def;
  P(o.innerType, t, s);
  const r = t.seen.get(e);
  r.ref = o.innerType, t.io === "input" && (n._prefault = JSON.parse(JSON.stringify(o.defaultValue)));
}, "Jc");
var Hc = /* @__PURE__ */ __name((e, t, n, s) => {
  const o = e._zod.def;
  P(o.innerType, t, s);
  const r = t.seen.get(e);
  r.ref = o.innerType;
  let i;
  try {
    i = o.catchValue(void 0);
  } catch {
    throw new Error("Dynamic catch values are not supported in JSON Schema");
  }
  n.default = i;
}, "Hc");
var Xc = /* @__PURE__ */ __name((e, t, n, s) => {
  const o = e._zod.def, r = t.io === "input" ? o.in._zod.def.type === "transform" ? o.out : o.in : o.out;
  P(r, t, s);
  const i = t.seen.get(e);
  i.ref = r;
}, "Xc");
var qc = /* @__PURE__ */ __name((e, t, n, s) => {
  const o = e._zod.def;
  P(o.innerType, t, s);
  const r = t.seen.get(e);
  r.ref = o.innerType, n.readOnly = true;
}, "qc");
var Gs = /* @__PURE__ */ __name((e, t, n, s) => {
  const o = e._zod.def;
  P(o.innerType, t, s);
  const r = t.seen.get(e);
  r.ref = o.innerType;
}, "Gs");
var Wc = h("ZodISODateTime", (e, t) => {
  Vi.init(e, t), z.init(e, t);
});
function Kc(e) {
  return nc(Wc, e);
}
__name(Kc, "Kc");
var Gc = h("ZodISODate", (e, t) => {
  Yi.init(e, t), z.init(e, t);
});
function Vc(e) {
  return sc(Gc, e);
}
__name(Vc, "Vc");
var Yc = h("ZodISOTime", (e, t) => {
  Qi.init(e, t), z.init(e, t);
});
function Qc(e) {
  return oc(Yc, e);
}
__name(Qc, "Qc");
var ed = h("ZodISODuration", (e, t) => {
  ea.init(e, t), z.init(e, t);
});
function td(e) {
  return rc(ed, e);
}
__name(td, "td");
var nd = /* @__PURE__ */ __name((e, t) => {
  js.init(e, t), e.name = "ZodError", Object.defineProperties(e, { format: { value: /* @__PURE__ */ __name((n) => Jr(e, n), "value") }, flatten: { value: /* @__PURE__ */ __name((n) => Br(e, n), "value") }, addIssue: { value: /* @__PURE__ */ __name((n) => {
    e.issues.push(n), e.message = JSON.stringify(e.issues, cn, 2);
  }, "value") }, addIssues: { value: /* @__PURE__ */ __name((n) => {
    e.issues.push(...n), e.message = JSON.stringify(e.issues, cn, 2);
  }, "value") }, isEmpty: { get() {
    return e.issues.length === 0;
  } } });
}, "nd");
var se = h("ZodError", nd, { Parent: Error });
var sd = _n(se);
var od = yn(se);
var rd = Wt(se);
var id = Kt(se);
var ad = qr(se);
var cd = Wr(se);
var dd = Kr(se);
var ld = Gr(se);
var ud = Vr(se);
var pd = Yr(se);
var fd = Qr(se);
var md = ei(se);
var D = h("ZodType", (e, t) => (R.init(e, t), Object.assign(e["~standard"], { jsonSchema: { input: Ut(e, "input"), output: Ut(e, "output") } }), e.toJSONSchema = Sc(e, {}), e.def = t, e.type = t.type, Object.defineProperty(e, "_def", { value: t }), e.check = (...n) => e.clone(Te(t, { checks: [...t.checks ?? [], ...n.map((s) => typeof s == "function" ? { _zod: { check: s, def: { check: "custom" }, onattach: [] } } : s)] }), { parent: true }), e.with = e.check, e.clone = (n, s) => Ee(e, n, s), e.brand = () => e, e.register = ((n, s) => (n.add(e, s), e)), e.parse = (n, s) => sd(e, n, s, { callee: e.parse }), e.safeParse = (n, s) => rd(e, n, s), e.parseAsync = async (n, s) => od(e, n, s, { callee: e.parseAsync }), e.safeParseAsync = async (n, s) => id(e, n, s), e.spa = e.safeParseAsync, e.encode = (n, s) => ad(e, n, s), e.decode = (n, s) => cd(e, n, s), e.encodeAsync = async (n, s) => dd(e, n, s), e.decodeAsync = async (n, s) => ld(e, n, s), e.safeEncode = (n, s) => ud(e, n, s), e.safeDecode = (n, s) => pd(e, n, s), e.safeEncodeAsync = async (n, s) => fd(e, n, s), e.safeDecodeAsync = async (n, s) => md(e, n, s), e.refine = (n, s) => e.check(cl(n, s)), e.superRefine = (n) => e.check(dl(n)), e.overwrite = (n) => e.check(rt(n)), e.optional = () => Qn(e), e.exactOptional = () => Kd(e), e.nullable = () => es(e), e.nullish = () => Qn(es(e)), e.nonoptional = (n) => tl(e, n), e.array = () => Vt(e), e.or = (n) => Fd([e, n]), e.and = (n) => Jd(e, n), e.transform = (n) => ts(e, qd(n)), e.default = (n) => Yd(e, n), e.prefault = (n) => el(e, n), e.catch = (n) => sl(e, n), e.pipe = (n) => ts(e, n), e.readonly = () => il(e), e.describe = (n) => {
  const s = e.clone();
  return dt.add(s, { description: n }), s;
}, Object.defineProperty(e, "description", { get() {
  var n;
  return (n = dt.get(e)) == null ? void 0 : n.description;
}, configurable: true }), e.meta = (...n) => {
  if (n.length === 0) return dt.get(e);
  const s = e.clone();
  return dt.add(s, n[0]), s;
}, e.isOptional = () => e.safeParse(void 0).success, e.isNullable = () => e.safeParse(null).success, e.apply = (n) => n(e), e));
var Vs = h("_ZodString", (e, t) => {
  vn.init(e, t), D.init(e, t), e._zod.processJSONSchema = (s, o, r) => Ic(e, s, o);
  const n = e._zod.bag;
  e.format = n.format ?? null, e.minLength = n.minimum ?? null, e.maxLength = n.maximum ?? null, e.regex = (...s) => e.check(uc(...s)), e.includes = (...s) => e.check(mc(...s)), e.startsWith = (...s) => e.check(hc(...s)), e.endsWith = (...s) => e.check(gc(...s)), e.min = (...s) => e.check(Mt(...s)), e.max = (...s) => e.check(Hs(...s)), e.length = (...s) => e.check(Xs(...s)), e.nonempty = (...s) => e.check(Mt(1, ...s)), e.lowercase = (s) => e.check(pc(s)), e.uppercase = (s) => e.check(fc(s)), e.trim = () => e.check(yc()), e.normalize = (...s) => e.check(_c(...s)), e.toLowerCase = () => e.check(vc()), e.toUpperCase = () => e.check(bc()), e.slugify = () => e.check(wc());
});
var hd = h("ZodString", (e, t) => {
  vn.init(e, t), Vs.init(e, t), e.email = (n) => e.check(Da(gd, n)), e.url = (n) => e.check(Ua(_d, n)), e.jwt = (n) => e.check(tc(Ad, n)), e.emoji = (n) => e.check(Za(yd, n)), e.guid = (n) => e.check(qn(Vn, n)), e.uuid = (n) => e.check(La(At, n)), e.uuidv4 = (n) => e.check(Ca(At, n)), e.uuidv6 = (n) => e.check(Pa(At, n)), e.uuidv7 = (n) => e.check(Ma(At, n)), e.nanoid = (n) => e.check(Fa(vd, n)), e.guid = (n) => e.check(qn(Vn, n)), e.cuid = (n) => e.check(Ba(bd, n)), e.cuid2 = (n) => e.check(Ja(wd, n)), e.ulid = (n) => e.check(Ha(kd, n)), e.base64 = (n) => e.check(Ya(Nd, n)), e.base64url = (n) => e.check(Qa($d, n)), e.xid = (n) => e.check(Xa(xd, n)), e.ksuid = (n) => e.check(qa(Td, n)), e.ipv4 = (n) => e.check(Wa(Ed, n)), e.ipv6 = (n) => e.check(Ka(Sd, n)), e.cidrv4 = (n) => e.check(Ga(Od, n)), e.cidrv6 = (n) => e.check(Va(Id, n)), e.e164 = (n) => e.check(ec(jd, n)), e.datetime = (n) => e.check(Kc(n)), e.date = (n) => e.check(Vc(n)), e.time = (n) => e.check(Qc(n)), e.duration = (n) => e.check(td(n));
});
function ne(e) {
  return Ra(hd, e);
}
__name(ne, "ne");
var z = h("ZodStringFormat", (e, t) => {
  A.init(e, t), Vs.init(e, t);
});
var gd = h("ZodEmail", (e, t) => {
  Fi.init(e, t), z.init(e, t);
});
var Vn = h("ZodGUID", (e, t) => {
  Ui.init(e, t), z.init(e, t);
});
var At = h("ZodUUID", (e, t) => {
  Zi.init(e, t), z.init(e, t);
});
var _d = h("ZodURL", (e, t) => {
  Bi.init(e, t), z.init(e, t);
});
var yd = h("ZodEmoji", (e, t) => {
  Ji.init(e, t), z.init(e, t);
});
var vd = h("ZodNanoID", (e, t) => {
  Hi.init(e, t), z.init(e, t);
});
var bd = h("ZodCUID", (e, t) => {
  Xi.init(e, t), z.init(e, t);
});
var wd = h("ZodCUID2", (e, t) => {
  qi.init(e, t), z.init(e, t);
});
var kd = h("ZodULID", (e, t) => {
  Wi.init(e, t), z.init(e, t);
});
var xd = h("ZodXID", (e, t) => {
  Ki.init(e, t), z.init(e, t);
});
var Td = h("ZodKSUID", (e, t) => {
  Gi.init(e, t), z.init(e, t);
});
var Ed = h("ZodIPv4", (e, t) => {
  ta.init(e, t), z.init(e, t);
});
var Sd = h("ZodIPv6", (e, t) => {
  na.init(e, t), z.init(e, t);
});
var Od = h("ZodCIDRv4", (e, t) => {
  sa.init(e, t), z.init(e, t);
});
var Id = h("ZodCIDRv6", (e, t) => {
  oa.init(e, t), z.init(e, t);
});
var Nd = h("ZodBase64", (e, t) => {
  ra.init(e, t), z.init(e, t);
});
var $d = h("ZodBase64URL", (e, t) => {
  aa.init(e, t), z.init(e, t);
});
var jd = h("ZodE164", (e, t) => {
  ca.init(e, t), z.init(e, t);
});
var Ad = h("ZodJWT", (e, t) => {
  la.init(e, t), z.init(e, t);
});
var Ys = h("ZodNumber", (e, t) => {
  Zs.init(e, t), D.init(e, t), e._zod.processJSONSchema = (s, o, r) => Nc(e, s, o), e.gt = (s, o) => e.check(Kn(s, o)), e.gte = (s, o) => e.check(rn(s, o)), e.min = (s, o) => e.check(rn(s, o)), e.lt = (s, o) => e.check(Wn(s, o)), e.lte = (s, o) => e.check(on(s, o)), e.max = (s, o) => e.check(on(s, o)), e.int = (s) => e.check(Yn(s)), e.safe = (s) => e.check(Yn(s)), e.positive = (s) => e.check(Kn(0, s)), e.nonnegative = (s) => e.check(rn(0, s)), e.negative = (s) => e.check(Wn(0, s)), e.nonpositive = (s) => e.check(on(0, s)), e.multipleOf = (s, o) => e.check(Gn(s, o)), e.step = (s, o) => e.check(Gn(s, o)), e.finite = () => e;
  const n = e._zod.bag;
  e.minValue = Math.max(n.minimum ?? Number.NEGATIVE_INFINITY, n.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null, e.maxValue = Math.min(n.maximum ?? Number.POSITIVE_INFINITY, n.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null, e.isInt = (n.format ?? "").includes("int") || Number.isSafeInteger(n.multipleOf ?? 0.5), e.isFinite = true, e.format = n.format ?? null;
});
function ln(e) {
  return ic(Ys, e);
}
__name(ln, "ln");
var zd = h("ZodNumberFormat", (e, t) => {
  ua.init(e, t), Ys.init(e, t);
});
function Yn(e) {
  return ac(zd, e);
}
__name(Yn, "Yn");
var Rd = h("ZodBoolean", (e, t) => {
  pa.init(e, t), D.init(e, t), e._zod.processJSONSchema = (n, s, o) => $c(e, n, s);
});
function Dd(e) {
  return cc(Rd, e);
}
__name(Dd, "Dd");
var Ld = h("ZodUnknown", (e, t) => {
  fa.init(e, t), D.init(e, t), e._zod.processJSONSchema = (n, s, o) => Ac();
});
function Zt() {
  return dc(Ld);
}
__name(Zt, "Zt");
var Cd = h("ZodNever", (e, t) => {
  ma.init(e, t), D.init(e, t), e._zod.processJSONSchema = (n, s, o) => jc(e, n, s);
});
function Pd(e) {
  return lc(Cd, e);
}
__name(Pd, "Pd");
var Md = h("ZodArray", (e, t) => {
  ha.init(e, t), D.init(e, t), e._zod.processJSONSchema = (n, s, o) => Lc(e, n, s, o), e.element = t.element, e.min = (n, s) => e.check(Mt(n, s)), e.nonempty = (n) => e.check(Mt(1, n)), e.max = (n, s) => e.check(Hs(n, s)), e.length = (n, s) => e.check(Xs(n, s)), e.unwrap = () => e.element;
});
function Vt(e, t) {
  return kc(Md, e, t);
}
__name(Vt, "Vt");
var Ud = h("ZodObject", (e, t) => {
  _a.init(e, t), D.init(e, t), e._zod.processJSONSchema = (n, s, o) => Cc(e, n, s, o), N(e, "shape", () => t.shape), e.keyof = () => st(Object.keys(e._zod.def.shape)), e.catchall = (n) => e.clone({ ...e._zod.def, catchall: n }), e.passthrough = () => e.clone({ ...e._zod.def, catchall: Zt() }), e.loose = () => e.clone({ ...e._zod.def, catchall: Zt() }), e.strict = () => e.clone({ ...e._zod.def, catchall: Pd() }), e.strip = () => e.clone({ ...e._zod.def, catchall: void 0 }), e.extend = (n) => Pr(e, n), e.safeExtend = (n) => Mr(e, n), e.merge = (n) => Ur(e, n), e.pick = (n) => Lr(e, n), e.omit = (n) => Cr(e, n), e.partial = (...n) => Zr(eo, e, n[0]), e.required = (...n) => Fr(to, e, n[0]);
});
function bn(e, t) {
  const n = { type: "object", shape: e ?? {}, ...x(t) };
  return new Ud(n);
}
__name(bn, "bn");
var Zd = h("ZodUnion", (e, t) => {
  ya.init(e, t), D.init(e, t), e._zod.processJSONSchema = (n, s, o) => Pc(e, n, s, o), e.options = t.options;
});
function Fd(e, t) {
  return new Zd({ type: "union", options: e, ...x(t) });
}
__name(Fd, "Fd");
var Bd = h("ZodIntersection", (e, t) => {
  va.init(e, t), D.init(e, t), e._zod.processJSONSchema = (n, s, o) => Mc(e, n, s, o);
});
function Jd(e, t) {
  return new Bd({ type: "intersection", left: e, right: t });
}
__name(Jd, "Jd");
var Hd = h("ZodRecord", (e, t) => {
  ba.init(e, t), D.init(e, t), e._zod.processJSONSchema = (n, s, o) => Uc(e, n, s, o), e.keyType = t.keyType, e.valueType = t.valueType;
});
function Qs(e, t, n) {
  return new Hd({ type: "record", keyType: e, valueType: t, ...x(n) });
}
__name(Qs, "Qs");
var un = h("ZodEnum", (e, t) => {
  wa.init(e, t), D.init(e, t), e._zod.processJSONSchema = (s, o, r) => zc(e, s, o), e.enum = t.entries, e.options = Object.values(t.entries);
  const n = new Set(Object.keys(t.entries));
  e.extract = (s, o) => {
    const r = {};
    for (const i of s) if (n.has(i)) r[i] = t.entries[i];
    else throw new Error(`Key ${i} not found in enum`);
    return new un({ ...t, checks: [], ...x(o), entries: r });
  }, e.exclude = (s, o) => {
    const r = { ...t.entries };
    for (const i of s) if (n.has(i)) delete r[i];
    else throw new Error(`Key ${i} not found in enum`);
    return new un({ ...t, checks: [], ...x(o), entries: r });
  };
});
function st(e, t) {
  const n = Array.isArray(e) ? Object.fromEntries(e.map((s) => [s, s])) : e;
  return new un({ type: "enum", entries: n, ...x(t) });
}
__name(st, "st");
var Xd = h("ZodTransform", (e, t) => {
  ka.init(e, t), D.init(e, t), e._zod.processJSONSchema = (n, s, o) => Dc(e, n), e._zod.parse = (n, s) => {
    if (s.direction === "backward") throw new Es(e.constructor.name);
    n.addIssue = (r) => {
      if (typeof r == "string") n.issues.push(pt(r, n.value, t));
      else {
        const i = r;
        i.fatal && (i.continue = false), i.code ?? (i.code = "custom"), i.input ?? (i.input = n.value), i.inst ?? (i.inst = e), n.issues.push(pt(i));
      }
    };
    const o = t.transform(n.value, n);
    return o instanceof Promise ? o.then((r) => (n.value = r, n)) : (n.value = o, n);
  };
});
function qd(e) {
  return new Xd({ type: "transform", transform: e });
}
__name(qd, "qd");
var eo = h("ZodOptional", (e, t) => {
  Js.init(e, t), D.init(e, t), e._zod.processJSONSchema = (n, s, o) => Gs(e, n, s, o), e.unwrap = () => e._zod.def.innerType;
});
function Qn(e) {
  return new eo({ type: "optional", innerType: e });
}
__name(Qn, "Qn");
var Wd = h("ZodExactOptional", (e, t) => {
  xa.init(e, t), D.init(e, t), e._zod.processJSONSchema = (n, s, o) => Gs(e, n, s, o), e.unwrap = () => e._zod.def.innerType;
});
function Kd(e) {
  return new Wd({ type: "optional", innerType: e });
}
__name(Kd, "Kd");
var Gd = h("ZodNullable", (e, t) => {
  Ta.init(e, t), D.init(e, t), e._zod.processJSONSchema = (n, s, o) => Zc(e, n, s, o), e.unwrap = () => e._zod.def.innerType;
});
function es(e) {
  return new Gd({ type: "nullable", innerType: e });
}
__name(es, "es");
var Vd = h("ZodDefault", (e, t) => {
  Ea.init(e, t), D.init(e, t), e._zod.processJSONSchema = (n, s, o) => Bc(e, n, s, o), e.unwrap = () => e._zod.def.innerType, e.removeDefault = e.unwrap;
});
function Yd(e, t) {
  return new Vd({ type: "default", innerType: e, get defaultValue() {
    return typeof t == "function" ? t() : Ns(t);
  } });
}
__name(Yd, "Yd");
var Qd = h("ZodPrefault", (e, t) => {
  Sa.init(e, t), D.init(e, t), e._zod.processJSONSchema = (n, s, o) => Jc(e, n, s, o), e.unwrap = () => e._zod.def.innerType;
});
function el(e, t) {
  return new Qd({ type: "prefault", innerType: e, get defaultValue() {
    return typeof t == "function" ? t() : Ns(t);
  } });
}
__name(el, "el");
var to = h("ZodNonOptional", (e, t) => {
  Oa.init(e, t), D.init(e, t), e._zod.processJSONSchema = (n, s, o) => Fc(e, n, s, o), e.unwrap = () => e._zod.def.innerType;
});
function tl(e, t) {
  return new to({ type: "nonoptional", innerType: e, ...x(t) });
}
__name(tl, "tl");
var nl = h("ZodCatch", (e, t) => {
  Ia.init(e, t), D.init(e, t), e._zod.processJSONSchema = (n, s, o) => Hc(e, n, s, o), e.unwrap = () => e._zod.def.innerType, e.removeCatch = e.unwrap;
});
function sl(e, t) {
  return new nl({ type: "catch", innerType: e, catchValue: typeof t == "function" ? t : () => t });
}
__name(sl, "sl");
var ol = h("ZodPipe", (e, t) => {
  Na.init(e, t), D.init(e, t), e._zod.processJSONSchema = (n, s, o) => Xc(e, n, s, o), e.in = t.in, e.out = t.out;
});
function ts(e, t) {
  return new ol({ type: "pipe", in: e, out: t });
}
__name(ts, "ts");
var rl = h("ZodReadonly", (e, t) => {
  $a.init(e, t), D.init(e, t), e._zod.processJSONSchema = (n, s, o) => qc(e, n, s, o), e.unwrap = () => e._zod.def.innerType;
});
function il(e) {
  return new rl({ type: "readonly", innerType: e });
}
__name(il, "il");
var al = h("ZodCustom", (e, t) => {
  ja.init(e, t), D.init(e, t), e._zod.processJSONSchema = (n, s, o) => Rc(e, n);
});
function cl(e, t = {}) {
  return xc(al, e, t);
}
__name(cl, "cl");
function dl(e) {
  return Tc(e);
}
__name(dl, "dl");
var X = class {
  static {
    __name(this, "X");
  }
  constructor(t) {
    this.db = t;
  }
  async initialize() {
    var n, s, o;
    const t = [`CREATE TABLE IF NOT EXISTS memory_items (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL CHECK(type IN ('episodic','semantic','summary')),
        scope TEXT NOT NULL CHECK(scope IN ('session','project','global')),
        content TEXT NOT NULL,
        embedding TEXT,
        tags TEXT NOT NULL DEFAULT '[]',
        confidence REAL NOT NULL DEFAULT 0.8,
        decay_score REAL NOT NULL DEFAULT 0.0,
        token_count INTEGER NOT NULL DEFAULT 0,
        session_id TEXT NOT NULL,
        project_id TEXT,
        user_id TEXT NOT NULL,
        source TEXT NOT NULL DEFAULT 'system',
        created_at TEXT NOT NULL,
        last_accessed TEXT NOT NULL
      )`, "CREATE INDEX IF NOT EXISTS idx_memory_session ON memory_items(session_id)", "CREATE INDEX IF NOT EXISTS idx_memory_project ON memory_items(project_id)", "CREATE INDEX IF NOT EXISTS idx_memory_user    ON memory_items(user_id)", "CREATE INDEX IF NOT EXISTS idx_memory_scope   ON memory_items(scope)", "CREATE INDEX IF NOT EXISTS idx_memory_type    ON memory_items(type)", "CREATE INDEX IF NOT EXISTS idx_memory_decay   ON memory_items(decay_score)", `CREATE TABLE IF NOT EXISTS sessions (
        session_id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        project_id TEXT,
        token_budget INTEGER NOT NULL DEFAULT 8192,
        tokens_used INTEGER NOT NULL DEFAULT 0,
        sliding_window TEXT NOT NULL DEFAULT '[]',
        running_state TEXT NOT NULL DEFAULT '{}',
        metadata TEXT NOT NULL DEFAULT '{}',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`, "CREATE INDEX IF NOT EXISTS idx_sessions_user    ON sessions(user_id)", "CREATE INDEX IF NOT EXISTS idx_sessions_project ON sessions(project_id)", `CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        skill_loadout TEXT NOT NULL DEFAULT '[]',
        model_override TEXT,
        thalamus_threshold REAL DEFAULT 0.72,
        insula_mode TEXT NOT NULL DEFAULT 'standard',
        rag_top_k INTEGER NOT NULL DEFAULT 5,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        metadata TEXT NOT NULL DEFAULT '{}'
      )`, "CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id)", `CREATE TABLE IF NOT EXISTS skill_packages (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        version TEXT NOT NULL DEFAULT '1.0.0',
        trigger_pattern TEXT NOT NULL,
        system_fragment TEXT NOT NULL,
        tools TEXT NOT NULL DEFAULT '[]',
        priority INTEGER NOT NULL DEFAULT 0,
        token_budget INTEGER NOT NULL DEFAULT 500,
        max_context_tokens INTEGER NOT NULL DEFAULT 8192,
        compatible_models TEXT NOT NULL DEFAULT '[]',
        enabled INTEGER NOT NULL DEFAULT 1,
        metadata TEXT NOT NULL DEFAULT '{}',
        created_at TEXT NOT NULL
      )`, `CREATE TABLE IF NOT EXISTS request_traces (
        trace_id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        request_at TEXT NOT NULL,
        completed_at TEXT,
        stage_log TEXT NOT NULL DEFAULT '[]',
        retrieval_candidates TEXT NOT NULL DEFAULT '[]',
        thalamus_scores TEXT NOT NULL DEFAULT '[]',
        dropped_context TEXT NOT NULL DEFAULT '[]',
        citations TEXT NOT NULL DEFAULT '[]',
        memory_diff TEXT,
        token_breakdown TEXT,
        consolidation_queued INTEGER NOT NULL DEFAULT 0,
        consolidation_type TEXT,
        error TEXT
      )`, "CREATE INDEX IF NOT EXISTS idx_traces_session    ON request_traces(session_id)", "CREATE INDEX IF NOT EXISTS idx_traces_user       ON request_traces(user_id)", "CREATE INDEX IF NOT EXISTS idx_traces_request_at ON request_traces(request_at)", `CREATE TABLE IF NOT EXISTS consolidation_jobs (
        job_id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        trace_id TEXT NOT NULL,
        consolidation_type TEXT NOT NULL DEFAULT 'token_pressure',
        status TEXT NOT NULL DEFAULT 'pending',
        transcript TEXT NOT NULL DEFAULT '[]',
        context_used TEXT NOT NULL DEFAULT '{}',
        insula_permissions TEXT NOT NULL DEFAULT '{}',
        result TEXT,
        error TEXT,
        created_at TEXT NOT NULL,
        processed_at TEXT
      )`, "CREATE INDEX IF NOT EXISTS idx_jobs_status  ON consolidation_jobs(status)", "CREATE INDEX IF NOT EXISTS idx_jobs_session ON consolidation_jobs(session_id)", `CREATE TABLE IF NOT EXISTS api_keys (
        key_id TEXT PRIMARY KEY,
        key_hash TEXT NOT NULL UNIQUE,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        rate_limit_rpm INTEGER NOT NULL DEFAULT 60,
        enabled INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        last_used TEXT
      )`, `INSERT OR IGNORE INTO skill_packages
        (id, name, version, trigger_pattern, system_fragment, tools, priority, token_budget,
         max_context_tokens, compatible_models, enabled, metadata, created_at)
       VALUES
        ('general','General Assistant','1.0.0','.','You are a helpful, precise, and memory-aware assistant.','[]',0,200,8192,'["gpt-5","claude-sonnet-4-5"]',1,'{"builtin":true}','2026-01-01T00:00:00Z')`, `INSERT OR IGNORE INTO skill_packages
        (id, name, version, trigger_pattern, system_fragment, tools, priority, token_budget,
         max_context_tokens, compatible_models, enabled, metadata, created_at)
       VALUES
        ('code','Code Assistant','1.0.0','\\b(code|function|debug|implement|typescript|javascript|python|sql|bug|error)\\b','You are also an expert software engineer. Write clean, typed, commented code.','[]',10,300,16384,'["gpt-5","claude-sonnet-4-5"]',1,'{"builtin":true}','2026-01-01T00:00:00Z')`, `INSERT OR IGNORE INTO skill_packages
        (id, name, version, trigger_pattern, system_fragment, tools, priority, token_budget,
         max_context_tokens, compatible_models, enabled, metadata, created_at)
       VALUES
        ('research','Research Mode','1.0.0','\\b(research|analyze|compare|explain|why|how does|what is)\\b','You are a thorough researcher. Structure answers clearly. State confidence levels.','[]',5,250,16384,'["gpt-5","claude-opus-4-5"]',1,'{"builtin":true}','2026-01-01T00:00:00Z')`, `INSERT OR IGNORE INTO skill_packages
        (id, name, version, trigger_pattern, system_fragment, tools, priority, token_budget,
         max_context_tokens, compatible_models, enabled, metadata, created_at)
       VALUES
        ('memory_aware','Memory-Aware Mode','1.0.0','\\b(remember|recall|earlier|before|last time|previously)\\b','The user is referencing prior context. Reference retrieved memories explicitly.','[]',15,150,8192,'["gpt-5","gpt-5-mini"]',1,'{"builtin":true}','2026-01-01T00:00:00Z')`, `INSERT OR IGNORE INTO skill_packages
        (id, name, version, trigger_pattern, system_fragment, tools, priority, token_budget,
         max_context_tokens, compatible_models, enabled, metadata, created_at)
       VALUES
        ('project_scope','Project Scope','1.0.0','\\b(project|workspace|this project|our project)\\b','You are working within a specific project context. Prioritize project-scoped memories.','[]',8,200,8192,'["gpt-5","claude-sonnet-4-5"]',1,'{"builtin":true}','2026-01-01T00:00:00Z')`];
    for (const r of t) try {
      await this.db.prepare(r).run();
    } catch (i) {
      !((n = i.message) != null && n.includes("already exists")) && !((s = i.message) != null && s.includes("duplicate")) && console.error("Migration error:", (o = i.message) == null ? void 0 : o.slice(0, 120));
    }
  }
  async getSession(t) {
    const n = await this.db.prepare("SELECT * FROM sessions WHERE session_id = ?").bind(t).first();
    return n ? { ...n, sliding_window: JSON.parse(n.sliding_window), running_state: JSON.parse(n.running_state), metadata: JSON.parse(n.metadata) } : null;
  }
  async upsertSession(t) {
    await this.db.prepare(`
        INSERT INTO sessions
          (session_id, user_id, project_id, token_budget, tokens_used,
           sliding_window, running_state, metadata, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(session_id) DO UPDATE SET
          tokens_used    = excluded.tokens_used,
          sliding_window = excluded.sliding_window,
          running_state  = excluded.running_state,
          metadata       = excluded.metadata,
          updated_at     = excluded.updated_at
      `).bind(t.session_id, t.user_id, t.project_id ?? null, t.token_budget, t.tokens_used, JSON.stringify(t.sliding_window), JSON.stringify(t.running_state), JSON.stringify(t.metadata), t.created_at, t.updated_at).run();
  }
  async getProject(t) {
    const n = await this.db.prepare("SELECT * FROM projects WHERE id = ?").bind(t).first();
    return n ? { ...n, skill_loadout: JSON.parse(n.skill_loadout), metadata: JSON.parse(n.metadata) } : null;
  }
  async upsertProject(t) {
    await this.db.prepare(`
        INSERT INTO projects
          (id, user_id, name, description, skill_loadout, model_override,
           thalamus_threshold, insula_mode, rag_top_k, created_at, updated_at, metadata)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name               = excluded.name,
          description        = excluded.description,
          skill_loadout      = excluded.skill_loadout,
          model_override     = excluded.model_override,
          thalamus_threshold = excluded.thalamus_threshold,
          insula_mode        = excluded.insula_mode,
          rag_top_k          = excluded.rag_top_k,
          updated_at         = excluded.updated_at,
          metadata           = excluded.metadata
      `).bind(t.id, t.user_id, t.name, t.description ?? "", JSON.stringify(t.skill_loadout ?? []), t.model_override ?? null, t.thalamus_threshold ?? 0.72, t.insula_mode ?? "standard", t.rag_top_k ?? 5, t.created_at, t.updated_at, JSON.stringify(t.metadata ?? {})).run();
  }
  async listProjects(t) {
    return (await this.db.prepare("SELECT * FROM projects WHERE user_id = ? ORDER BY updated_at DESC LIMIT 50").bind(t).all()).results.map((s) => ({ ...s, skill_loadout: JSON.parse(s.skill_loadout), metadata: JSON.parse(s.metadata) }));
  }
  async deleteProject(t, n) {
    await this.db.prepare("DELETE FROM projects WHERE id = ? AND user_id = ?").bind(t, n).run();
  }
  async insertMemoryItem(t) {
    var o, r, i, a;
    const n = ((o = t.source) == null ? void 0 : o.session_id) ?? ((r = t.provenance) == null ? void 0 : r.session_id) ?? "unknown", s = ((i = t.source) == null ? void 0 : i.type) ?? ((a = t.provenance) == null ? void 0 : a.source) ?? "system";
    await this.db.prepare(`
        INSERT OR REPLACE INTO memory_items
          (id, type, scope, content, embedding, tags, confidence, decay_score,
           token_count, session_id, project_id, user_id, source, created_at, last_accessed)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(t.id, t.type, t.scope, t.content, t.embedding ? JSON.stringify(t.embedding) : null, JSON.stringify(t.tags ?? []), t.confidence ?? 0.8, t.decay_score ?? 0, t.token_count ?? 0, n, t.project_id ?? null, t.user_id ?? "unknown", s, t.created_at, t.last_accessed).run();
  }
  async queryMemory(t) {
    const n = ["user_id = ?"], s = [t.user_id];
    t.scope && (n.push("(scope = ? OR scope = ?)"), s.push(t.scope, "global")), t.type && (n.push("type = ?"), s.push(t.type)), t.session_id && t.project_id ? (n.push("(session_id = ? OR project_id = ? OR scope = 'global')"), s.push(t.session_id, t.project_id)) : t.session_id && (n.push("(session_id = ? OR scope IN ('project','global'))"), s.push(t.session_id)), t.exclude_high_decay && n.push("decay_score < 0.8");
    const o = t.limit ?? 50, r = `
      SELECT * FROM memory_items
      WHERE ${n.join(" AND ")}
      ORDER BY last_accessed DESC, confidence DESC
      LIMIT ${o}
    `;
    return (await this.db.prepare(r).bind(...s).all()).results.map((a) => ({ ...a, embedding: a.embedding ? JSON.parse(a.embedding) : null, tags: JSON.parse(a.tags) }));
  }
  async touchMemoryItem(t) {
    await this.db.prepare("UPDATE memory_items SET last_accessed = ? WHERE id = ?").bind((/* @__PURE__ */ new Date()).toISOString(), t).run();
  }
  async queryMemoryWithEmbeddings(t) {
    const n = ["user_id = ?", "embedding IS NOT NULL"], s = [t.user_id];
    t.scope && (n.push("(scope = ? OR scope = ?)"), s.push(t.scope, "global")), t.session_id && (n.push("(session_id = ? OR scope IN ('project','global'))"), s.push(t.session_id)), n.push("decay_score < 0.85");
    const o = t.limit ?? 100, r = `
      SELECT * FROM memory_items
      WHERE ${n.join(" AND ")}
      ORDER BY last_accessed DESC, confidence DESC
      LIMIT ${o}
    `;
    return (await this.db.prepare(r).bind(...s).all()).results.map((a) => ({ ...a, embedding: a.embedding ? JSON.parse(a.embedding) : null, tags: JSON.parse(a.tags) }));
  }
  async updateMemoryEmbedding(t, n) {
    await this.db.prepare("UPDATE memory_items SET embedding = ? WHERE id = ?").bind(JSON.stringify(n), t).run();
  }
  async updateDecayScores(t) {
    for (const n of t) await this.db.prepare("UPDATE memory_items SET decay_score = ? WHERE id = ?").bind(n.decay_score, n.id).run();
  }
  async getMemoryItem(t) {
    const n = await this.db.prepare("SELECT * FROM memory_items WHERE id = ?").bind(t).first();
    return n ? { ...n, embedding: n.embedding ? JSON.parse(n.embedding) : null, tags: JSON.parse(n.tags) } : null;
  }
  async countMemoryByUser(t) {
    const n = await this.db.prepare("SELECT COUNT(*) as cnt FROM memory_items WHERE user_id = ?").bind(t).first();
    return (n == null ? void 0 : n.cnt) ?? 0;
  }
  async insertTrace(t) {
    await this.db.prepare(`
        INSERT OR REPLACE INTO request_traces
          (trace_id, session_id, user_id, request_at, completed_at, stage_log,
           retrieval_candidates, thalamus_scores, dropped_context,
           citations, memory_diff, token_breakdown,
           consolidation_queued, consolidation_type, error)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(t.trace_id, t.session_id, t.user_id, t.request_at, t.completed_at ?? null, JSON.stringify(t.stages ?? []), JSON.stringify(t.retrieval_candidates ?? []), JSON.stringify(t.thalamus_scores ?? []), JSON.stringify(t.dropped_context ?? []), JSON.stringify(t.citations ?? []), t.memory_diff ? JSON.stringify(t.memory_diff) : null, t.token_breakdown ? JSON.stringify(t.token_breakdown) : null, t.consolidation_queued ? 1 : 0, t.consolidation_type ?? null, t.error ?? null).run();
  }
  async getTrace(t) {
    const n = await this.db.prepare("SELECT * FROM request_traces WHERE trace_id = ?").bind(t).first();
    return n ? { ...n, stages: JSON.parse(n.stage_log), retrieval_candidates: JSON.parse(n.retrieval_candidates), thalamus_scores: JSON.parse(n.thalamus_scores), dropped_context: JSON.parse(n.dropped_context), citations: JSON.parse(n.citations || "[]"), memory_diff: n.memory_diff ? JSON.parse(n.memory_diff) : null, token_breakdown: n.token_breakdown ? JSON.parse(n.token_breakdown) : null } : null;
  }
  async listTraces(t) {
    const n = [], s = [];
    t.session_id && (n.push("session_id = ?"), s.push(t.session_id)), t.user_id && (n.push("user_id = ?"), s.push(t.user_id));
    const o = n.length ? `WHERE ${n.join(" AND ")}` : "", r = t.limit ?? 20;
    return (await this.db.prepare(`SELECT * FROM request_traces ${o} ORDER BY request_at DESC LIMIT ${r}`).bind(...s).all()).results.map((a) => ({ ...a, citations: JSON.parse(a.citations || "[]"), token_breakdown: a.token_breakdown ? JSON.parse(a.token_breakdown) : null }));
  }
  async insertConsolidationJob(t) {
    await this.db.prepare(`
        INSERT INTO consolidation_jobs
          (job_id, session_id, trace_id, consolidation_type, status,
           transcript, context_used, insula_permissions, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(t.job_id, t.session_id, t.trace_id, t.consolidation_type ?? "token_pressure", "pending", JSON.stringify(t.transcript), JSON.stringify(t.context_used), JSON.stringify(t.insula_permissions), (/* @__PURE__ */ new Date()).toISOString()).run();
  }
  async getPendingJobs(t = 10) {
    return (await this.db.prepare("SELECT * FROM consolidation_jobs WHERE status = 'pending' ORDER BY created_at ASC LIMIT ?").bind(t).all()).results.map((s) => ({ ...s, transcript: JSON.parse(s.transcript), context_used: JSON.parse(s.context_used), insula_permissions: JSON.parse(s.insula_permissions) }));
  }
  async updateJobStatus(t, n, s, o) {
    await this.db.prepare(`
        UPDATE consolidation_jobs
        SET status = ?, result = ?, error = ?, processed_at = ?
        WHERE job_id = ?
      `).bind(n, s ? JSON.stringify(s) : null, o ?? null, (/* @__PURE__ */ new Date()).toISOString(), t).run();
  }
  async listSkills(t) {
    return (await this.db.prepare("SELECT * FROM skill_packages WHERE enabled = 1 ORDER BY priority DESC").all()).results.map((s) => ({ ...s, tools: JSON.parse(s.tools), compatible_models: JSON.parse(s.compatible_models || "[]"), metadata: JSON.parse(s.metadata) }));
  }
  async getSkill(t) {
    const n = await this.db.prepare("SELECT * FROM skill_packages WHERE id = ?").bind(t).first();
    return n ? { ...n, tools: JSON.parse(n.tools), compatible_models: JSON.parse(n.compatible_models || "[]"), metadata: JSON.parse(n.metadata) } : null;
  }
  async validateApiKey(t) {
    const n = await this.db.prepare("SELECT user_id, rate_limit_rpm FROM api_keys WHERE key_hash = ? AND enabled = 1").bind(t).first();
    return n ? (await this.db.prepare("UPDATE api_keys SET last_used = ? WHERE key_hash = ?").bind((/* @__PURE__ */ new Date()).toISOString(), t).run(), { user_id: n.user_id, rate_limit_rpm: n.rate_limit_rpm }) : null;
  }
  async getSystemStats() {
    const [t, n, s, o] = await Promise.all([this.db.prepare("SELECT COUNT(*) as total_memories FROM memory_items").first(), this.db.prepare("SELECT COUNT(*) as total_traces FROM request_traces").first(), this.db.prepare("SELECT COUNT(*) as total_sessions FROM sessions").first(), this.db.prepare("SELECT COUNT(*) as pending_jobs FROM consolidation_jobs WHERE status = 'pending'").first()]);
    return { total_memories: (t == null ? void 0 : t.total_memories) ?? 0, total_traces: (n == null ? void 0 : n.total_traces) ?? 0, total_sessions: (s == null ? void 0 : s.total_sessions) ?? 0, pending_consolidation_jobs: (o == null ? void 0 : o.pending_jobs) ?? 0 };
  }
};
var ll = Object.freeze(Object.defineProperty({ __proto__: null, StorageService: X }, Symbol.toStringTag, { value: "Module" }));
var wn = { id: "default", name: "Default Loadout", model_profile: "default", budgets: { l1_window_tokens: 2e3, l2_budget_tokens: 3e3, skills: 1500, response_reserve: 4096 }, thresholds: { thalamus_threshold: 0.72, consolidation_trigger: 0.8, decay_write_threshold: 0.4 }, active_skills: ["general"], rag_top_k: 5, insula_mode: "standard", created_at: (/* @__PURE__ */ new Date()).toISOString() };
var no = { id: "fast", name: "Fast / Cheap (gpt-5-mini)", model_profile: "fast", budgets: { l1_window_tokens: 1e3, l2_budget_tokens: 1e3, skills: 500, response_reserve: 2048 }, thresholds: { thalamus_threshold: 0.72, consolidation_trigger: 0.8, decay_write_threshold: 0.6 }, active_skills: ["general"], rag_top_k: 3, insula_mode: "standard", created_at: (/* @__PURE__ */ new Date()).toISOString() };
var so = { id: "deep", name: "Deep Research (Opus)", model_profile: "deep", budgets: { l1_window_tokens: 4e3, l2_budget_tokens: 8e3, skills: 3e3, response_reserve: 4096 }, thresholds: { thalamus_threshold: 0.6, consolidation_trigger: 0.8, decay_write_threshold: 0.3 }, active_skills: ["general", "research", "code"], rag_top_k: 10, insula_mode: "standard", created_at: (/* @__PURE__ */ new Date()).toISOString() };
var oo = [{ id: "general", name: "General Assistant", version: "1.0.0", trigger: /./, system_fragment: `You are a helpful, precise, and memory-aware assistant.
You have access to conversation history and retrieved memories.
Use context efficiently. Be concise unless depth is requested.
When referencing retrieved memories, cite them explicitly.`, tools: [], priority: 0, token_budget: 200, max_context_tokens: 8192, compatible_models: ["gpt-5", "gpt-5-mini", "claude-sonnet-4-5", "claude-opus-4-5"], enabled: true, metadata: { builtin: true } }, { id: "code", name: "Code Assistant", version: "1.0.0", trigger: /\b(code|function|debug|implement|refactor|typescript|javascript|python|sql|api|bug|error|class|type|interface|module)\b/i, system_fragment: `You are also an expert software engineer.
When writing code: use TypeScript unless specified, add inline comments, consider edge cases.
Format code in proper markdown blocks with language tags.
For complex functions, describe the approach before the code.`, tools: [], priority: 10, token_budget: 300, max_context_tokens: 16384, compatible_models: ["gpt-5", "claude-sonnet-4-5", "claude-opus-4-5"], enabled: true, metadata: { builtin: true } }, { id: "research", name: "Research Mode", version: "1.0.0", trigger: /\b(research|analyze|compare|explain|why|how does|what is|deep dive|summarize|overview)\b/i, system_fragment: `You are also a thorough researcher.
Structure complex answers with clear sections. Cite reasoning explicitly.
When uncertain, state your confidence level (e.g. "High confidence:", "Uncertain:").
Provide balanced perspectives for ambiguous questions.`, tools: [], priority: 5, token_budget: 250, max_context_tokens: 16384, compatible_models: ["gpt-5", "claude-sonnet-4-5", "claude-opus-4-5"], enabled: true, metadata: { builtin: true } }, { id: "memory_aware", name: "Memory-Aware Mode", version: "1.0.0", trigger: /\b(remember|recall|earlier|before|last time|we discussed|you said|previously|in our|you mentioned)\b/i, system_fragment: `The user is referencing prior context.
Check the retrieved memories carefully. If you find relevant prior context,
reference it explicitly: "Based on our earlier discussion about [topic]...".
If you don't find the referenced memory, say so clearly.`, tools: [], priority: 15, token_budget: 150, max_context_tokens: 8192, compatible_models: ["gpt-5", "gpt-5-mini", "claude-haiku-4-5", "claude-sonnet-4-5"], enabled: true, metadata: { builtin: true } }, { id: "project_scope", name: "Project Scope", version: "1.0.0", trigger: /\b(project|workspace|this project|our project|in this context|for this|project memory)\b/i, system_fragment: `You are working within a specific project context.
Prioritize project-scoped memories and knowledge.
When answering, consider the project's goals, conventions, and constraints from memory.
Tag new facts with the project context when relevant.`, tools: [], priority: 8, token_budget: 200, max_context_tokens: 8192, compatible_models: ["gpt-5", "claude-sonnet-4-5"], enabled: true, metadata: { builtin: true } }];
var $e = { default: "mindbridge:anthropic/claude-sonnet-4-6", fast: "mindbridge:anthropic/claude-3-5-haiku-20241022", deep: "mindbridge:anthropic/claude-opus-4-6", code: "mindbridge:anthropic/claude-sonnet-4-6" };
var ft = { default: "mindbridge:openai/gpt-4o", fast: "mindbridge:openai/gpt-4o-mini", deep: "mindbridge:openai/o1", code: "mindbridge:openai/gpt-4o" };
var ro = { default: wn, fast: no, deep: so };
function H(e) {
  return e ? Math.ceil(e.length / 4) : 0;
}
__name(H, "H");
function io(e, t) {
  const n = Date.now(), s = new Date(e).getTime(), o = (n - s) / (1e3 * 60 * 60);
  return Math.min(0.95, 1 / (1 + Math.exp(-0.03 * (o - 48))));
}
__name(io, "io");
var ao = Object.freeze(Object.defineProperty({ __proto__: null, BUILTIN_SKILLS: oo, DEEP_LOADOUT: so, DEFAULT_LOADOUT: wn, FAST_LOADOUT: no, LOADOUT_MAP: ro, MODEL_MAP: $e, OPENAI_MODEL_MAP: ft, computeDecay: io, estimateTokens: H }, Symbol.toStringTag, { value: "Module" }));
var ul = class {
  static {
    __name(this, "ul");
  }
  constructor(t) {
    w(this, "skills");
    this.skills = t ?? oo;
  }
  decide(t, n, s) {
    const o = this.skills.filter((p) => p.enabled ? s != null && s.includes(p.id) ? true : typeof p.trigger == "string" ? new RegExp(p.trigger, "i").test(t) : p.trigger.test(t) : false).sort((p, _) => _.priority - p.priority);
    if (!o.some((p) => p.id === "general")) {
      const p = this.skills.find((_) => _.id === "general");
      p && o.unshift(p);
    }
    if (n.project_id) {
      const p = this.skills.find((_) => _.id === "project_scope");
      p && !o.some((_) => _.id === "project_scope") && o.push(p);
    }
    const r = ["session"];
    n.project_id && r.push("project");
    const i = /\b(remember|recall|earlier|before|last time|previously|you said|we discussed|always|never|prefer|profile|my name|i am|i'm)\b/i;
    i.test(t) && (r.includes("global") || r.push("global"));
    let a = "default";
    /\b(quick|fast|simple|brief|tldr|short|one.?line)\b/i.test(t) ? a = "fast" : /\b(deep dive|thorough|comprehensive|detailed|research|analyze|explain in depth|full analysis)\b/i.test(t) ? a = "deep" : /\b(code|implement|function|class|debug|refactor|build|write a|create a|typescript|javascript)\b/i.test(t) && (a = "code");
    const c = H(t) > 50 || i.test(t) || /\b(context|history|conversation|previous|before|project|knowledge)\b/i.test(t), l = ["knowledge_graph"];
    /\b(you said|earlier|before|last time|we talked|we discussed|the message|that response)\b/i.test(t) && l.push("chat_index"), n.project_id && l.push("project_docs");
    const u = c ? 10 : 5, f = [`Skills: ${o.map((p) => p.name).join(", ")}`, `Scopes: ${r.join(", ")}`, `Model: ${a}`, `RAG sources: ${l.join(", ")}`, `RAG top_k: ${u}`, `Deep retrieval: ${c}`, n.project_id ? `Project: ${n.project_id}` : ""].filter(Boolean).join(" | ");
    return { activated_skills: o, memory_scopes: r, model_profile: a, requires_deep_retrieval: c, rag_sources: l, rag_top_k: u, min_score: 0.72, reasoning: f, project_id: n.project_id ?? void 0 };
  }
};
var ns = "@cf/baai/bge-small-en-v1.5";
var bt = class _bt {
  static {
    __name(this, "bt");
  }
  constructor(t) {
    this.ai = t;
  }
  async embed(t) {
    var n, s;
    if (!this.ai) return null;
    try {
      const o = await this.ai.run(ns, { text: [t.slice(0, 2048)] }), r = (n = o == null ? void 0 : o.data) == null ? void 0 : n[0];
      return !Array.isArray(r) || r.length === 0 ? null : r;
    } catch (o) {
      return console.error("[EmbeddingService] embed error:", (s = o == null ? void 0 : o.message) == null ? void 0 : s.slice(0, 100)), null;
    }
  }
  async embedBatch(t) {
    var n;
    if (!this.ai || t.length === 0) return t.map(() => null);
    try {
      const s = await this.ai.run(ns, { text: t.map((r) => r.slice(0, 2048)) }), o = s == null ? void 0 : s.data;
      return Array.isArray(o) ? o : t.map(() => null);
    } catch (s) {
      return console.error("[EmbeddingService] embedBatch error:", (n = s == null ? void 0 : s.message) == null ? void 0 : n.slice(0, 100)), t.map(() => null);
    }
  }
  static cosineSimilarity(t, n) {
    if (t.length !== n.length || t.length === 0) return 0;
    let s = 0, o = 0, r = 0;
    for (let a = 0; a < t.length; a++) s += t[a] * n[a], o += t[a] * t[a], r += n[a] * n[a];
    const i = Math.sqrt(o) * Math.sqrt(r);
    return i === 0 ? 0 : Math.max(0, Math.min(1, s / i));
  }
  static rankBySimilarity(t, n) {
    return n.map((s) => ({ id: s.id, similarity: s.embedding ? _bt.cosineSimilarity(t, s.embedding) : 0 })).sort((s, o) => o.similarity - s.similarity);
  }
  isAvailable() {
    return this.ai !== null;
  }
};
var pl = class {
  static {
    __name(this, "pl");
  }
  constructor(t) {
    this.storage = t;
  }
  async retrieve(t) {
    const { user_id: n, session_id: s, project_id: o, query: r, queryEmbedding: i, decision: a, limit: d = 30 } = t, [c, l] = await Promise.all([this.storage.queryMemory({ user_id: n, session_id: s, project_id: o, exclude_high_decay: true, limit: d * 2 }), i ? this.storage.queryMemoryWithEmbeddings({ user_id: n, session_id: s, project_id: o, limit: 150 }) : Promise.resolve([])]);
    if (c.length === 0 && l.length === 0) return [];
    const u = /* @__PURE__ */ new Set(), f = [];
    for (const g of [...c, ...l]) u.has(g.id) || (u.add(g.id), f.push(g));
    const p = /* @__PURE__ */ new Map();
    if (i && l.length > 0) {
      const g = bt.rankBySimilarity(i, l);
      for (const k of g) p.set(k.id, k.similarity);
    }
    const _ = p.size > 0, v = f.map((g) => {
      var ce;
      const k = p.get(g.id) ?? 0, L = this.computeTextRelevance(r, g.content), $ = this.computeRecency(g.last_accessed), S = this.computeScopeMatch(g.scope, a.memory_scopes), j = this.computeTypeScore(g.type), G = g.decay_score ?? 0, M = this.computeSkillWeight(g.tags, a.activated_skills.map((U) => U.id)), C = _ && k > 0 ? 0.4 * k + 0.2 * $ + 0.15 * S + 0.1 * j + 0.1 * (1 - G) + 0.05 * M : 0.45 * L + 0.2 * $ + 0.15 * S + 0.1 * j + 0.05 * (1 - G) + 0.05 * M;
      return { id: g.id, source: "l2_memory", content: g.content, label: `[${g.type}:${g.scope}] ${((ce = g.tags) == null ? void 0 : ce.join(", ")) || "memory"}`, token_count: g.token_count || H(g.content), scores: { relevance: _ ? k : L, recency: $, scope_match: S, type_priority: j, decay_penalty: G, skill_weight: M, final: C }, metadata: { memory_id: g.id, type: g.type, scope: g.scope, tags: g.tags, confidence: g.confidence, created_at: g.created_at, has_embedding: k > 0, semantic_score: k, keyword_score: L }, dropped: false };
    });
    v.sort((g, k) => k.scores.final - g.scores.final);
    const y = v.slice(0, d);
    return y.forEach((g) => {
      this.storage.touchMemoryItem(g.id).catch(() => {
      });
    }), y;
  }
  computeTextRelevance(t, n) {
    if (!n || !t) return 0;
    const s = this.tokenize(t), o = new Set(this.tokenize(n));
    if (s.length === 0) return 0;
    const r = s.filter((i) => o.has(i)).length;
    return Math.min(1, r / s.length);
  }
  tokenize(t) {
    return t.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((n) => n.length > 2 && !fl.has(n));
  }
  computeRecency(t) {
    const n = (Date.now() - new Date(t).getTime()) / 36e5;
    return Math.exp(-0.028 * n);
  }
  computeScopeMatch(t, n) {
    return t === "global" ? 1 : n.includes(t) ? 0.9 : 0.3;
  }
  computeTypeScore(t) {
    return { summary: 1, semantic: 0.85, episodic: 0.65 }[t] ?? 0.5;
  }
  computeSkillWeight(t, n) {
    if (!t || t.length === 0) return 0;
    const s = t.filter((o) => n.includes(o)).length;
    return Math.min(1, s / Math.max(1, n.length));
  }
};
var fl = /* @__PURE__ */ new Set(["the", "and", "for", "are", "but", "not", "you", "all", "can", "had", "her", "was", "one", "our", "out", "day", "get", "has", "him", "his", "how", "man", "new", "now", "old", "see", "two", "way", "who", "boy", "did", "its", "let", "put", "say", "she", "too", "use", "that", "with", "this", "they", "have", "from", "will", "been", "said", "each", "about", "your", "more", "also", "into", "just", "like", "than", "then", "them", "some", "what", "when", "which", "there", "their", "would", "make", "could"]);
var ml = class {
  static {
    __name(this, "ml");
  }
  constructor(t) {
    this.storage = t;
  }
  async search(t) {
    const { query: n, user_id: s, session_id: o, project_id: r, decision: i, sliding_window: a, top_k: d = i.rag_top_k ?? 5, min_score: c = i.min_score ?? 0.72 } = t, l = [];
    if (i.rag_sources.includes("chat_index") && a.length > 0) {
      const g = this.searchChatIndex(n, a, o);
      l.push(...g);
    }
    if (i.rag_sources.includes("knowledge_graph")) {
      const g = await this.searchKnowledgeGraph({ query: n, user_id: s, session_id: o, project_id: r, limit: d * 3 });
      l.push(...g);
    }
    const u = /* @__PURE__ */ new Set(), f = l.filter((g) => u.has(g.id) ? false : (u.add(g.id), true));
    f.sort((g, k) => k.relevance - g.relevance);
    const v = f.filter((g) => g.relevance >= c).slice(0, d).map((g) => {
      const k = { source: g.source, source_type: g.source_type, message_id: g.message_id, memory_id: g.source_type === "memory" ? g.id : void 0, relevance: g.relevance, content_snippet: g.content.slice(0, 120) };
      return { id: `rag:${g.id}`, source: "rag", content: g.content, label: `[rag:${g.source_type}] ${g.source}`, token_count: g.token_count, citation: k, scores: { relevance: g.relevance, recency: 0.8, scope_match: 1, type_priority: g.source_type === "memory" ? 0.85 : 0.7, decay_penalty: 0, skill_weight: 0, final: g.relevance }, metadata: g.metadata, dropped: false };
    }), y = v.filter((g) => g.citation).map((g) => g.citation);
    return { candidates: v, citations: y };
  }
  searchChatIndex(t, n, s) {
    const o = this.tokenize(t);
    return o.length === 0 ? [] : n.filter((r) => r.role !== "system").map((r) => {
      var u;
      const i = new Set(this.tokenize(r.content)), a = o.filter((f) => i.has(f)).length, d = Math.min(1, a / Math.max(1, o.length)), c = Date.now() - new Date(r.timestamp).getTime(), l = Math.exp(-c / (1e3 * 60 * 60 * 2)) * 0.15;
      return { id: r.message_id ?? `chat:${r.timestamp}`, content: `[${r.role.toUpperCase()}]: ${r.content}`, source: `chat_${r.role}_${(u = r.timestamp) == null ? void 0 : u.slice(0, 10)}`, source_type: "chat", relevance: Math.min(1, d + l), token_count: r.token_count || H(r.content), message_id: r.message_id, metadata: { role: r.role, timestamp: r.timestamp, session_id: s } };
    }).filter((r) => r.relevance > 0.1).sort((r, i) => i.relevance - r.relevance);
  }
  async searchKnowledgeGraph(t) {
    const { query: n, user_id: s, session_id: o, project_id: r, limit: i } = t, a = await this.storage.queryMemory({ user_id: s, session_id: o, project_id: r, exclude_high_decay: true, limit: i });
    if (a.length === 0) return [];
    const d = this.tokenize(n);
    return d.length === 0 ? [] : a.map((c) => {
      const l = new Set(this.tokenize(c.content)), u = d.filter((L) => l.has(L)).length, f = Math.min(1, u / Math.max(1, d.length)), p = c.type === "summary" ? 0.15 : c.type === "semantic" ? 0.1 : 0, _ = c.tags ?? [], v = d.filter((L) => _.some(($) => $.toLowerCase().includes(L))).length, y = Math.min(0.15, v * 0.05), g = (c.decay_score ?? 0) * 0.2, k = Math.min(1, f + p + y - g);
      return { id: c.id, content: c.content, source: `memory_${c.type}_${c.scope}`, source_type: "memory", relevance: k, token_count: c.token_count || H(c.content), metadata: { memory_id: c.id, type: c.type, scope: c.scope, tags: c.tags, confidence: c.confidence, decay_score: c.decay_score, created_at: c.created_at } };
    });
  }
  tokenize(t) {
    return t.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((n) => n.length > 2 && !hl.has(n));
  }
  buildCitations(t) {
    return t.filter((n) => n.citation && !n.dropped).map((n) => ({ ...n.citation, relevance: n.scores.final }));
  }
};
var hl = /* @__PURE__ */ new Set(["the", "and", "for", "are", "but", "not", "you", "all", "can", "had", "her", "was", "one", "our", "out", "day", "get", "has", "him", "his", "how", "man", "new", "now", "old", "see", "two", "way", "who", "boy", "did", "its", "let", "put", "say", "she", "too", "use", "that", "with", "this", "they", "have", "from", "will", "been", "said", "each", "about", "your", "more", "also", "into", "just", "like", "than", "then", "them", "some", "what", "when", "which", "there", "their", "would", "make", "could", "very", "want", "need", "know", "think", "help", "tell", "show", "give"]);
var gl = class {
  static {
    __name(this, "gl");
  }
  pack(t) {
    const { session: n, loadout: s, retrievedCandidates: o, ragCandidates: r, activatedSkills: i, userMessage: a, baseSystem: d } = t, { budgets: c, thresholds: l } = s, u = l.thalamus_threshold, f = this.selectSlidingWindow(n.sliding_window, c.l1_window_tokens), p = f.reduce((b, V) => b + V.token_count, 0), _ = i.map((b) => {
      const V = H(b.system_fragment);
      return { id: `skill:${b.id}`, source: "skill", content: b.system_fragment, label: `[skill:${b.name}]`, token_count: Math.min(V, b.token_budget), scores: { relevance: 1, recency: 1, scope_match: 1, type_priority: 1, decay_penalty: 0, skill_weight: 1, final: 1 + b.priority * 0.01 }, metadata: { skill_id: b.id, priority: b.priority }, dropped: false };
    }), v = [...o, ...r], y = /* @__PURE__ */ new Map();
    for (const b of v) {
      const V = y.get(b.id);
      (!V || b.scores.final > V.scores.final) && y.set(b.id, b);
    }
    const g = Array.from(y.values()), k = g.filter((b) => b.scores.final >= u), $ = g.filter((b) => b.scores.final < u).map((b) => ({ ...b, dropped: true, drop_reason: `below_thalamus_threshold(${u})` })), S = [...k].sort((b, V) => V.scores.final - b.scores.final), j = [..._].sort((b, V) => V.scores.final - b.scores.final);
    let G = 0, M = 0;
    const C = [], ce = [...$];
    for (const b of j) G + b.token_count <= c.skills ? (C.push({ ...b, dropped: false }), G += b.token_count) : ce.push({ ...b, dropped: true, drop_reason: "skill_budget_exceeded" });
    for (const b of S) M + b.token_count <= c.l2_budget_tokens ? (C.push({ ...b, dropped: false }), M += b.token_count) : ce.push({ ...b, dropped: true, drop_reason: "l2_budget_exceeded" });
    const U = C.filter((b) => b.source === "skill"), Se = C.filter((b) => b.source !== "skill"), Q = [d];
    U.forEach((b) => Q.push(b.content));
    const xt = Q.filter(Boolean).join(`

`), Me = H(xt), Tt = Se.map((b) => ({ label: b.label, content: b.content, token_count: b.token_count, source: b.source, citation: b.citation })), de = Tt.reduce((b, V) => b + V.token_count, 0), Yt = f.filter((b) => b.role !== "system").map((b) => ({ role: b.role, content: b.content })), Et = H(a), St = Me + de + p + Et, oe = c.l1_window_tokens + c.l2_budget_tokens + c.skills + c.response_reserve, Qt = { system: xt, context_blocks: Tt, messages: Yt, token_breakdown: { system: Me, context: de, history: p, user_message: Et, total: St, budget_remaining: Math.max(0, oe - St) } }, ee = C.filter((b) => b.citation && !b.dropped).map((b) => b.citation);
    return { packed: C, dropped: ce, windowEntries: f, prompt: Qt, citations: ee };
  }
  selectSlidingWindow(t, n) {
    if (!t || t.length === 0) return [];
    let s = 0;
    const o = [];
    for (let r = t.length - 1; r >= 0; r--) {
      const i = t[r], a = i.token_count || H(i.content);
      if (s + a > n) break;
      o.unshift(i), s += a;
    }
    return o;
  }
  computePressure(t, n) {
    return t.total / Math.max(1, n);
  }
  compactL1(t, n) {
    const s = [];
    let o = [...t], r = o.reduce((i, a) => i + (a.token_count || H(a.content)), 0);
    for (; r > n && o.length > 2; ) {
      const i = o.shift();
      s.push(i), r -= i.token_count || H(i.content);
    }
    return { compacted: o, evicted: s };
  }
};
var Fe = [{ name: "email", pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g }, { name: "phone", pattern: /\b(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g }, { name: "ssn", pattern: /\b\d{3}-\d{2}-\d{4}\b/g }, { name: "credit_card", pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g }, { name: "api_key", pattern: /\b(sk-|pk-|api_key=|apikey=|Bearer\s+)[A-Za-z0-9_\-]{16,}\b/gi }, { name: "password", pattern: /\b(password|passwd|pwd)\s*[:=]\s*\S+/gi }, { name: "ip_address", pattern: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g }];
var _l = [/\bdon'?t (remember|store|save|log) this\b/i, /\boff the record\b/i, /\bno memory\b/i, /\bforget this\b/i, /\bprivate( mode)?\b/i, /\bthis is confidential\b/i, /\bdo not (save|store|record)\b/i];
var yl = [/\b(great|excellent|perfect|love|wonderful|amazing|fantastic|helpful|thanks|thank you|awesome|good|nice|happy|pleased|satisfied|correct|right|exactly|yes|sure)\b/i];
var vl = [/\b(wrong|bad|terrible|awful|hate|useless|broken|error|fail|failed|failure|incorrect|no|never|can'?t|won'?t|don'?t|not working|frustrat|disappoint|angry|upset|problem|issue|bug)\b/i];
var bl = [/\b(urgent|emergency|critical|crisis|deadline|immediately|asap|now|alert|danger|warning|serious)\b/i, /[!]{2,}/, /\bWHY\b|\bHELP\b|\bNOW\b/];
var co = class {
  static {
    __name(this, "co");
  }
  analyze(t, n, s = "standard") {
    const o = _l.some((l) => l.test(t));
    Fe.forEach((l) => {
      l.pattern.lastIndex = 0;
    });
    const r = Fe.some((l) => {
      const u = l.pattern.test(t);
      return l.pattern.lastIndex = 0, u;
    }), i = r ? Fe.filter((l) => {
      const u = l.pattern.test(t);
      return l.pattern.lastIndex = 0, u;
    }).map((l) => l.name) : [], { sentiment: a, sentiment_score: d } = this.analyzeSentiment(t);
    return { can_write_semantic: !o, can_write_episodic: !o && !r && !(s === "strict" && a === "volatile"), can_write_summary: !o, redacted_patterns: i, sentiment: a, sentiment_score: d, insula_mode: s, retention_override: o ? { forget_after_session: true, forget_after_project: true } : void 0 };
  }
  analyzeSentiment(t) {
    if (!t) return { sentiment: "neutral", sentiment_score: 0 };
    let n = 0, s = 0, o = 0;
    for (const c of yl) {
      const l = t.match(c);
      l && (n += l.length);
    }
    for (const c of vl) {
      const l = t.match(c);
      l && (s += l.length);
    }
    for (const c of bl) {
      const l = t.match(c);
      l && (o += l.length);
    }
    const r = n + s, i = r > 0 ? (n - s) / r : 0, a = Math.max(-1, Math.min(1, i));
    let d = "neutral";
    return o >= 2 || s > 0 && o >= 1 ? d = "volatile" : a > 0.2 ? d = "positive" : a < -0.2 && (d = "negative"), { sentiment: d, sentiment_score: a };
  }
  redact(t) {
    let n = t;
    for (const { name: s, pattern: o } of Fe) n = n.replace(o, `[REDACTED:${s.toUpperCase()}]`), o.lastIndex = 0;
    return n;
  }
  filterContextBlocks(t, n) {
    return t.map((s) => ({ ...s, content: this.redact(s.content) }));
  }
  shouldPersistToMemory(t, n, s) {
    return !(s === "episodic" && !n.can_write_episodic || s === "semantic" && !n.can_write_semantic || s === "summary" && !n.can_write_summary);
  }
  classifyForWrite(t, n) {
    var r;
    Fe.forEach((i) => {
      i.pattern.lastIndex = 0;
    });
    const s = Fe.some((i) => {
      const a = i.pattern.test(t);
      return i.pattern.lastIndex = 0, a;
    }), { sentiment: o } = this.analyzeSentiment(t);
    return (r = n.retention_override) != null && r.forget_after_session ? { safe: false, action: "block", reason: "forget_directive", pii_detected: s, sentiment: o } : s ? { safe: true, action: "redact", reason: "pii_detected", pii_detected: true, sentiment: o } : { safe: true, action: "store", pii_detected: false, sentiment: o };
  }
};
function kn(e) {
  if (e.context_blocks.length === 0) return "";
  const t = ["<retrieved_context>"];
  for (const n of e.context_blocks) t.push(`
${n.label}`), t.push(n.content);
  return t.push("</retrieved_context>"), t.join(`
`);
}
__name(kn, "kn");
async function wl(e) {
  var v, y, g;
  const { prompt: t, model_profile: n, max_tokens: s = 2048 } = e, o = ft[n] ?? ft.default, r = "https://api.soul-os.cc/v1", i = kn(t), d = [{ role: "system", content: i ? `${t.system}

${i}` : t.system }, ...t.messages.map((k) => ({ role: k.role, content: k.content }))], c = `${r}/chat/completions`, l = await fetch(c, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: o, max_tokens: s, messages: d }) });
  if (!l.ok) {
    const k = await l.text();
    throw new Error(`OpenAI API error ${l.status}: ${k}`);
  }
  const u = await l.json(), f = (v = u.choices) == null ? void 0 : v[0], p = u.usage ?? {}, _ = ((y = p.completion_tokens_details) == null ? void 0 : y.reasoning_tokens) ?? 0;
  return { response: ((g = f == null ? void 0 : f.message) == null ? void 0 : g.content) ?? "", model: u.model ?? o, usage: { input_tokens: p.prompt_tokens ?? 0, output_tokens: p.completion_tokens ?? 0, total_tokens: p.total_tokens ?? 0, reasoning_tokens: _ }, stop_reason: (f == null ? void 0 : f.finish_reason) ?? "unknown" };
}
__name(wl, "wl");
async function kl(e) {
  var p, _;
  const { prompt: t, model_profile: n, max_tokens: s = 2048 } = e, o = $e[n] ?? $e.default, r = "https://api.soul-os.cc/v1", i = kn(t), d = [{ role: "system", content: i ? `${t.system}

${i}` : t.system }, ...t.messages.map((v) => ({ role: v.role, content: v.content }))], c = await fetch(`${r}/chat/completions`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: o, max_tokens: s, messages: d }) });
  if (!c.ok) {
    const v = await c.text();
    throw new Error(`MindBridge API error ${c.status}: ${v}`);
  }
  const l = await c.json(), u = (p = l.choices) == null ? void 0 : p[0], f = l.usage ?? {};
  return { response: ((_ = u == null ? void 0 : u.message) == null ? void 0 : _.content) ?? "", model: l.model ?? o, usage: { input_tokens: f.prompt_tokens ?? 0, output_tokens: f.completion_tokens ?? 0, total_tokens: f.total_tokens ?? 0 }, stop_reason: (u == null ? void 0 : u.finish_reason) ?? "unknown" };
}
__name(kl, "kl");
var xl = class {
  static {
    __name(this, "xl");
  }
  async generate(t) {
    var s;
    const n = t.model_profile;
    return n && ((s = $e[n]) != null && s.includes("anthropic") || n.includes("anthropic")) ? kl(t) : wl(t);
  }
  async generateStream(t) {
    var u;
    const { prompt: n, model_profile: s, max_tokens: o = 2048 } = t, r = "https://api.soul-os.cc/v1", i = (u = $e[s]) != null && u.includes("anthropic") ? $e[s] ?? $e.default : ft[s] ?? ft.default, a = kn(n), c = [{ role: "system", content: a ? `${n.system}

${a}` : n.system }, ...n.messages.map((f) => ({ role: f.role, content: f.content }))], l = await fetch(`${r}/chat/completions`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: i, max_tokens: o, messages: c, stream: true }) });
    if (!l.ok) {
      const f = await l.text();
      throw new Error(`MindBridge stream error ${l.status}: ${f}`);
    }
    return l.body;
  }
};
var Tl = class {
  static {
    __name(this, "Tl");
  }
  constructor(t, n) {
    w(this, "wernicke");
    w(this, "retrieval");
    w(this, "rag");
    w(this, "thalamus");
    w(this, "insula");
    w(this, "model");
    w(this, "storage");
    w(this, "embeddings");
    this.storage = t, this.embeddings = new bt(n ?? null), this.wernicke = new ul(), this.retrieval = new pl(t), this.rag = new ml(t), this.thalamus = new gl(), this.insula = new co(), this.model = new xl();
  }
  async process(t, n, s) {
    var xn, Tn, En;
    const o = crypto.randomUUID(), r = (/* @__PURE__ */ new Date()).toISOString(), i = [], a = /* @__PURE__ */ __name((O, Oe, It = 0) => {
      i.push({ trace_id: o, session_id: t.session_id ?? "", stage: O, timestamp: (/* @__PURE__ */ new Date()).toISOString(), duration_ms: It, data: Oe });
    }, "a"), d = Date.now(), c = await this.ingestMessage(t);
    a("ingest", { session_id: c.session_id, project_id: c.project_id, message_len: t.message.length, window_size: c.sliding_window.length }, Date.now() - d);
    const l = Date.now(), u = ro[t.loadout_id ?? "default"] ?? wn;
    let f = { ...u };
    if (c.project_id) try {
      const O = await this.storage.getProject(c.project_id);
      O && (f = { ...u, thresholds: { ...u.thresholds, thalamus_threshold: O.thalamus_threshold ?? u.thresholds.thalamus_threshold }, insula_mode: O.insula_mode ?? u.insula_mode, rag_top_k: O.rag_top_k ?? u.rag_top_k });
    } catch {
    }
    const p = this.wernicke.decide(t.message, c, t.skill_hints);
    a("wernicke", { reasoning: p.reasoning, skills: p.activated_skills.map((O) => O.id), scopes: p.memory_scopes, model: p.model_profile, rag_sources: p.rag_sources, rag_top_k: p.rag_top_k, project_id: c.project_id }, Date.now() - l);
    const _ = Date.now(), v = await this.embeddings.embed(t.message), y = await this.retrieval.retrieve({ user_id: t.user_id, session_id: c.session_id, project_id: t.project_id ?? c.project_id ?? void 0, query: t.message, queryEmbedding: v, decision: p, limit: 25 }), { candidates: g, citations: k } = await this.rag.search({ query: t.message, user_id: t.user_id, session_id: c.session_id, project_id: t.project_id ?? c.project_id ?? void 0, decision: p, sliding_window: c.sliding_window, top_k: f.rag_top_k, min_score: f.thresholds.thalamus_threshold });
    a("rag", { memory_candidates: y.length, rag_candidates: g.length, citations_found: k.length, semantic_enabled: v !== null, embedding_dims: (v == null ? void 0 : v.length) ?? 0, top_rag_scores: g.slice(0, 3).map((O) => ({ label: O.label, score: O.scores.final.toFixed(3) })) }, Date.now() - _);
    const L = Date.now(), $ = `You are a helpful, memory-aware AI assistant with persistent context across conversations.
You have access to retrieved memories and conversation history.
When referencing retrieved information, cite it explicitly.
Current session: ${c.session_id.slice(0, 8)}...
${c.project_id ? `Project context: ${c.project_id}` : ""}`, { packed: S, dropped: j, windowEntries: G, prompt: M, citations: C } = this.thalamus.pack({ session: c, loadout: f, retrievedCandidates: y, ragCandidates: g, activatedSkills: p.activated_skills, userMessage: t.message, baseSystem: $ }), ce = f.budgets.l1_window_tokens + f.budgets.l2_budget_tokens + f.budgets.skills, U = this.thalamus.computePressure(M.token_breakdown, ce);
    a("thalamus", { packed_count: S.length, dropped_count: j.length, threshold_used: f.thresholds.thalamus_threshold, token_pressure: U.toFixed(2), token_breakdown: M.token_breakdown, dropped_items: j.slice(0, 5).map((O) => ({ label: O.label, reason: O.drop_reason, score: O.scores.final.toFixed(3) })) }, Date.now() - L);
    const Se = Date.now(), Q = this.insula.analyze(t.message, t.metadata, f.insula_mode), xt = this.insula.filterContextBlocks(M.context_blocks, Q), Me = { ...M, context_blocks: xt };
    a("insula", { can_write_semantic: Q.can_write_semantic, can_write_episodic: Q.can_write_episodic, sentiment: Q.sentiment, sentiment_score: Q.sentiment_score.toFixed(2), redacted: Q.redacted_patterns, has_forget_directive: !!Q.retention_override }, Date.now() - Se);
    const Tt = Date.now(), de = [...k, ...C.filter((O) => !k.some((Oe) => Oe.memory_id === O.memory_id))], Yt = [...Me.messages, { role: "user", content: t.message }], Et = de.length > 0 ? `

[Retrieved Context \u2014 ${de.length} sources]
` + de.slice(0, 5).map((O, Oe) => `[${Oe + 1}] ${O.source} (relevance: ${O.relevance.toFixed(2)})`).join(`
`) : "", St = Me.system + Et, oe = { ...Me, system: St, messages: Yt };
    a("assemble", { system_length: oe.system.length, context_blocks: oe.context_blocks.length, messages: oe.messages.length, citations: de.length, token_breakdown: oe.token_breakdown }, Date.now() - Tt);
    const Qt = Date.now();
    let ee;
    try {
      ee = await this.model.generate({ prompt: oe, model_profile: p.model_profile, api_key: n, base_url: s, max_tokens: f.budgets.response_reserve });
    } catch (O) {
      throw await this.saveTrace({ traceId: o, session: c, userId: t.user_id, requestAt: r, stages: i, candidates: y, packed: S, dropped: j, prompt: oe, citations: de, memoryDiff: null, consolidationQueued: false, consolidationType: void 0, error: O.message }), O;
    }
    a("generate", { model: ee.model, usage: ee.usage, stop_reason: ee.stop_reason, response_length: ee.response.length }, Date.now() - Qt);
    const b = (/* @__PURE__ */ new Date()).toISOString(), V = crypto.randomUUID(), mo = crypto.randomUUID(), ho = { role: "user", content: t.message, token_count: H(t.message), timestamp: r, trace_id: o, message_id: V }, go = { role: "assistant", content: ee.response, token_count: ee.usage.output_tokens || H(ee.response), timestamp: b, trace_id: o, message_id: mo };
    let Ue = [...c.sliding_window, ho, go], en = c.running_state.compaction_pass ?? 0;
    if (U >= f.thresholds.consolidation_trigger) {
      const O = Math.floor(f.budgets.l1_window_tokens * 0.6), { compacted: Oe, evicted: It } = this.thalamus.compactL1(Ue, O);
      It.length > 0 && (Ue = Oe, en++, a("compact", { evicted_count: It.length, compaction_pass: en, target_tokens: O }, 0));
    } else Ue = Ue.slice(-50);
    const _o = c.tokens_used + (ee.usage.total_tokens ?? 0), yo = { ...c, sliding_window: Ue, tokens_used: _o, running_state: { ...c.running_state, active_skills: p.activated_skills.map((O) => O.id), pending_consolidation: U >= f.thresholds.consolidation_trigger, compaction_pass: en }, updated_at: b };
    await this.storage.upsertSession(yo);
    let Ot = false, at;
    return Q.can_write_summary && (U >= f.thresholds.consolidation_trigger || ((xn = t.metadata) == null ? void 0 : xn.force_consolidate) === true || ((Tn = t.metadata) == null ? void 0 : Tn.session_end) === true) && (at = ((En = t.metadata) == null ? void 0 : En.session_end) === true ? "session_end" : U >= f.thresholds.consolidation_trigger ? "token_pressure" : "manual", await this.storage.insertConsolidationJob({ job_id: crypto.randomUUID(), session_id: c.session_id, trace_id: o, consolidation_type: at, transcript: Ue, context_used: oe, insula_permissions: Q }), Ot = true), a("consolidate", { queued: Ot, consolidation_type: at, pressure: U.toFixed(2), trigger_threshold: f.thresholds.consolidation_trigger }, 0), await this.saveTrace({ traceId: o, session: c, userId: t.user_id, requestAt: r, stages: i, candidates: y, packed: S, dropped: j, prompt: oe, citations: de, memoryDiff: null, consolidationQueued: Ot, consolidationType: at, error: null }), { trace_id: o, session_id: c.session_id, response: ee.response, model: ee.model, token_breakdown: oe.token_breakdown, skills_activated: p.activated_skills.map((O) => O.name), memory_items_retrieved: y.length + g.length, citations: de, memory_diff: null, consolidation_queued: Ot, consolidation_type: at };
  }
  async ingestMessage(t) {
    const n = (/* @__PURE__ */ new Date()).toISOString(), s = t.session_id ?? crypto.randomUUID();
    let o = await this.storage.getSession(s);
    return o || (o = { session_id: s, user_id: t.user_id, project_id: t.project_id ?? null, token_budget: 16e3, tokens_used: 0, sliding_window: [], running_state: { goals: [], active_skills: [], last_tool_results: {}, pending_consolidation: false, compaction_pass: 0 }, metadata: t.metadata ?? {}, created_at: n, updated_at: n }), o;
  }
  async saveTrace(t) {
    await this.storage.insertTrace({ trace_id: t.traceId, session_id: t.session.session_id, user_id: t.userId, request_at: t.requestAt, completed_at: (/* @__PURE__ */ new Date()).toISOString(), stages: t.stages, retrieval_candidates: t.candidates, thalamus_scores: t.packed, dropped_context: t.dropped.map((n) => {
      var s;
      return { label: n.label, reason: n.drop_reason, score: (s = n.scores) == null ? void 0 : s.final };
    }), citations: t.citations, memory_diff: t.memoryDiff, token_breakdown: t.prompt.token_breakdown, consolidation_queued: t.consolidationQueued, consolidation_type: t.consolidationType, error: t.error });
  }
};
var lo = class {
  static {
    __name(this, "lo");
  }
  constructor(t, n, s, o) {
    w(this, "insula");
    w(this, "embeddings");
    this.storage = t, this.apiKey = n, this.baseUrl = s, this.insula = new co(), this.embeddings = new bt(o ?? null);
  }
  async processJob(t) {
    await this.storage.updateJobStatus(t.job_id, "processing");
    try {
      const n = await this.runConsolidation(t);
      await this.storage.updateJobStatus(t.job_id, "done", n);
    } catch (n) {
      await this.storage.updateJobStatus(t.job_id, "failed", void 0, n.message);
    }
  }
  async processPendingJobs() {
    const t = await this.storage.getPendingJobs(5);
    let n = 0, s = 0;
    for (const o of t) try {
      await this.processJob(o), n++;
    } catch {
      s++;
    }
    return { processed: n, errors: s };
  }
  async runConsolidation(t) {
    const { session_id: n, transcript: s, insula_permissions: o } = t, r = o, i = t.consolidation_type ?? "token_pressure", a = await this.storage.getTrace(t.trace_id), d = (a == null ? void 0 : a.user_id) ?? "unknown", c = (a == null ? void 0 : a.project_id) ?? null, l = { added: 0, updated: 0, removed: 0, new_items: [], updated_items: [], key_facts_extracted: [] }, u = { semantic_candidates: [], decay_updates: [], memory_diff: l };
    if (r.can_write_summary && s.length >= 3) {
      const p = await this.summarizeTranscript(s, d, n, c, i);
      if (p) {
        u.summary = p.memoryItem;
        const _ = await this.embeddings.embed(p.memoryItem.content);
        _ && (p.memoryItem.embedding = _), l.key_facts_extracted = p.key_facts, this.insula.shouldPersistToMemory(p.memoryItem.content, r, "summary") && (await this.storage.insertMemoryItem(p.memoryItem), l.added++, l.new_items.push(p.memoryItem.id));
      }
    }
    if (r.can_write_semantic) {
      const p = await this.extractSemanticMemories(s, d, n, c);
      for (const _ of p) {
        const v = this.insula.classifyForWrite(_.content, r);
        if (v.action === "block") continue;
        const y = v.action === "redact" ? this.insula.redact(_.content) : _.content, g = { ..._, content: y }, k = await this.embeddings.embed(y);
        k && (g.embedding = k), this.insula.shouldPersistToMemory(g.content, r, "semantic") && (await this.storage.insertMemoryItem(g), u.semantic_candidates.push(g), l.added++, l.new_items.push(g.id));
      }
    }
    const f = await this.storage.queryMemory({ user_id: d, session_id: n, project_id: c ?? void 0, exclude_high_decay: false, limit: 200 });
    for (const p of f) {
      const _ = io(p.last_accessed, p.created_at);
      Math.abs(_ - p.decay_score) > 0.05 && u.decay_updates.push({ id: p.id, decay_score: _ });
    }
    return u.decay_updates.length > 0 && (await this.storage.updateDecayScores(u.decay_updates), l.updated += u.decay_updates.length, l.updated_items = u.decay_updates.map((p) => p.id).slice(0, 10)), u.memory_diff = l, u;
  }
  async summarizeTranscript(t, n, s, o, r) {
    if (t.length === 0) return null;
    const i = t.map((d) => `${d.role.toUpperCase()}: ${d.content}`).join(`
`), a = await this.callModel(`You are a memory consolidation engine. Analyze this conversation and extract a structured summary.

Return a JSON object with exactly this shape:
{
  "summary": "3-5 sentence summary of what was discussed",
  "key_facts": ["fact 1", "fact 2", "fact 3"],
  "consolidation_type": "${r}"
}

Rules for key_facts:
- Extract 3-7 durable facts that would be useful to remember in future sessions
- Format as short, declarative statements (e.g. "User prefers TypeScript over JavaScript")
- Only include facts likely to remain true across sessions
- Skip trivial or session-specific details

<conversation>
${i.slice(0, 4e3)}
</conversation>

JSON:`);
    if (!a) return null;
    try {
      const d = a.match(/\{[\s\S]*\}/);
      if (!d) return null;
      const c = JSON.parse(d[0]), l = c.summary ?? a, u = Array.isArray(c.key_facts) ? c.key_facts.slice(0, 7) : [], f = crypto.randomUUID(), p = (/* @__PURE__ */ new Date()).toISOString();
      return { memoryItem: { id: f, type: "summary", scope: o ? "project" : "session", project_id: o, content: l, embedding: null, source: { type: "consolidation", session_id: s }, tags: ["summary", "auto-generated", r], confidence: 0.9, decay_score: 0, created_at: p, last_accessed: p, token_count: H(l), user_id: n }, key_facts: u };
    } catch {
      const d = crypto.randomUUID(), c = (/* @__PURE__ */ new Date()).toISOString();
      return { memoryItem: { id: d, type: "summary", scope: "session", project_id: o, content: a.slice(0, 2e3), embedding: null, source: { type: "consolidation", session_id: s }, tags: ["summary", "auto-generated"], confidence: 0.8, decay_score: 0, created_at: c, last_accessed: c, token_count: H(a), user_id: n }, key_facts: [] };
    }
  }
  async extractSemanticMemories(t, n, s, o) {
    if (t.length === 0) return [];
    const r = t.map((a) => `${a.role.toUpperCase()}: ${a.content}`).join(`
`), i = await this.callModel(`Extract durable facts and preferences from this conversation.
Return ONLY a JSON array of objects:
[{"content": string, "tags": string[], "confidence": number, "scope": "session"|"project"|"global"}]

Rules:
- Only facts likely to remain true across sessions
- scope: "global" for universal user preferences; "project" for project-specific facts; "session" for one-time context
- Tags should be 1-3 relevant lowercase keywords
- Confidence: 0.5-1.0
- Max 5 items
- Return [] if nothing durable

<conversation>
${r.slice(0, 3e3)}
</conversation>

JSON:`);
    if (!i) return [];
    try {
      const a = i.match(/\[[\s\S]*\]/);
      if (!a) return [];
      const d = JSON.parse(a[0]), c = (/* @__PURE__ */ new Date()).toISOString();
      return d.slice(0, 5).map((l) => ({ id: crypto.randomUUID(), type: "semantic", scope: l.scope ?? "project", project_id: o, content: l.content, embedding: null, source: { type: "consolidation", session_id: s }, tags: l.tags ?? [], confidence: Math.min(1, Math.max(0, l.confidence ?? 0.7)), decay_score: 0, created_at: c, last_accessed: c, token_count: H(l.content), user_id: n }));
    } catch {
      return [];
    }
  }
  async callModel(t) {
    var n, s, o, r, i;
    try {
      if (this.baseUrl) {
        const c = await fetch(`${this.baseUrl}/chat/completions`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.apiKey}` }, body: JSON.stringify({ model: "gpt-5-mini", max_tokens: 2e3, messages: [{ role: "system", content: "You are a precise memory consolidation assistant. Return only valid JSON." }, { role: "user", content: t }] }) });
        return c.ok ? ((o = (s = (n = (await c.json()).choices) == null ? void 0 : n[0]) == null ? void 0 : s.message) == null ? void 0 : o.content) ?? null : null;
      }
      const a = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json", "x-api-key": this.apiKey, "anthropic-version": "2023-06-01" }, body: JSON.stringify({ model: "claude-haiku-4-5", max_tokens: 1024, messages: [{ role: "user", content: t }] }) });
      return a.ok ? ((i = (r = (await a.json()).content) == null ? void 0 : r[0]) == null ? void 0 : i.text) ?? null : null;
    } catch {
      return null;
    }
  }
};
var El = bn({ session_id: ne().uuid().optional(), user_id: ne().optional(), project_id: ne().optional(), message: ne().min(1).max(1e4), skill_hints: Vt(ne()).optional(), loadout_id: st(["default", "fast", "deep"]).optional(), stream: Dd().optional().default(false), metadata: Qs(Zt()).optional() });
var wt = new ot();
wt.post("/", Xt("json", El), async (e) => {
  var a;
  const t = e.req.valid("json"), n = e.get("user_id"), s = e.env.OPENAI_API_KEY || e.env.ANTHROPIC_API_KEY, o = e.env.OPENAI_API_KEY ? e.env.OPENAI_BASE_URL : void 0;
  if (!s) return e.json({ error: "No model API key configured (OPENAI_API_KEY or ANTHROPIC_API_KEY)." }, 503);
  if (!e.env.DB) return e.json({ error: "Database not configured." }, 503);
  const r = new X(e.env.DB), i = new Tl(r, e.env.AI ?? null);
  try {
    const d = await i.process({ ...t, user_id: n, metadata: t.metadata ?? {} }, s, o);
    return d.consolidation_queued && new lo(r, s, o, e.env.AI ?? null).processPendingJobs().catch(() => {
    }), e.json(d);
  } catch (d) {
    return e.json({ error: d.message ?? "Internal error", trace_id: null }, (a = d.message) != null && a.includes("API key") ? 401 : 500);
  }
});
wt.get("/sessions", async (e) => {
  const t = e.get("user_id");
  if (!e.env.DB) return e.json([]);
  new X(e.env.DB);
  const n = await e.env.DB.prepare(`SELECT session_id, project_id, tokens_used, token_budget, created_at, updated_at 
              FROM sessions WHERE user_id = ? ORDER BY updated_at DESC LIMIT 20`).bind(t).all();
  return e.json(n.results ?? []);
});
wt.get("/sessions/:id", async (e) => {
  const t = e.get("user_id"), n = e.req.param("id");
  if (!e.env.DB) return e.json({ error: "DB not configured" }, 503);
  const o = await new X(e.env.DB).getSession(n);
  return !o || o.user_id !== t ? e.json({ error: "Session not found" }, 404) : e.json(o);
});
wt.delete("/sessions/:id", async (e) => {
  const t = e.get("user_id"), n = e.req.param("id");
  return e.env.DB ? (await e.env.DB.prepare("DELETE FROM sessions WHERE session_id = ? AND user_id = ?").bind(n, t).run(), e.json({ deleted: true })) : e.json({ error: "DB not configured" }, 503);
});
var kt = new ot();
var Sl = bn({ content: ne().min(1).max(5e3), type: st(["episodic", "semantic", "summary"]).default("semantic"), scope: st(["session", "project", "global"]).default("project"), tags: Vt(ne()).default([]), confidence: ln().min(0).max(1).default(0.8), session_id: ne().optional(), project_id: ne().optional() });
kt.post("/", Xt("json", Sl), async (e) => {
  const t = e.req.valid("json"), n = e.get("user_id");
  if (!e.env.DB) return e.json({ error: "DB not configured" }, 503);
  const s = new X(e.env.DB), o = (/* @__PURE__ */ new Date()).toISOString(), r = crypto.randomUUID(), i = { id: r, type: t.type, scope: t.scope, content: t.content, embedding: null, tags: t.tags, confidence: t.confidence, decay_score: 0, token_count: H(t.content), provenance: { session_id: t.session_id ?? "manual", source: "user" }, project_id: t.project_id, user_id: n, created_at: o, last_accessed: o };
  return await s.insertMemoryItem(i), e.json({ id: r, created: true }, 201);
});
kt.get("/", async (e) => {
  const t = e.get("user_id");
  if (!e.env.DB) return e.json([]);
  const n = new X(e.env.DB), s = e.req.query("scope"), o = e.req.query("type"), r = e.req.query("session_id"), i = parseInt(e.req.query("limit") ?? "20", 10), a = await n.queryMemory({ user_id: t, session_id: r, scope: s, type: o, limit: i, exclude_high_decay: true });
  return e.json({ items: a, count: a.length });
});
kt.delete("/:id", async (e) => {
  const t = e.get("user_id"), n = e.req.param("id");
  return e.env.DB ? (await e.env.DB.prepare("DELETE FROM memory_items WHERE id = ? AND user_id = ?").bind(n, t).run(), e.json({ deleted: true })) : e.json({ error: "DB not configured" }, 503);
});
kt.get("/stats", async (e) => {
  const t = e.get("user_id");
  if (!e.env.DB) return e.json({ error: "DB not configured" }, 503);
  const n = await e.env.DB.prepare(`
      SELECT 
        COUNT(*) as total,
        type,
        scope,
        AVG(confidence) as avg_confidence,
        AVG(decay_score) as avg_decay,
        SUM(token_count) as total_tokens
      FROM memory_items 
      WHERE user_id = ?
      GROUP BY type, scope
    `).bind(t).all();
  return e.json({ stats: n.results });
});
var it = new ot();
it.get("/", async (e) => {
  const t = e.get("user_id");
  if (!e.env.DB) return e.json([]);
  const n = new X(e.env.DB), s = e.req.query("session_id"), o = parseInt(e.req.query("limit") ?? "20", 10), r = await n.listTraces({ user_id: t, session_id: s, limit: o });
  return e.json({ traces: r, count: r.length });
});
it.get("/:id", async (e) => {
  const t = e.get("user_id"), n = e.req.param("id");
  if (!e.env.DB) return e.json({ error: "DB not configured" }, 503);
  const o = await new X(e.env.DB).getTrace(n);
  return !o || o.user_id !== t ? e.json({ error: "Trace not found" }, 404) : e.json(o);
});
it.get("/session/:id", async (e) => {
  const t = e.get("user_id"), n = e.req.param("id");
  if (!e.env.DB) return e.json([]);
  const o = await new X(e.env.DB).listTraces({ user_id: t, session_id: n, limit: 50 });
  return e.json({ traces: o, count: o.length });
});
it.post("/consolidate", async (e) => {
  e.get("user_id");
  const t = e.env.OPENAI_API_KEY || e.env.ANTHROPIC_API_KEY, n = e.env.OPENAI_API_KEY ? e.env.OPENAI_BASE_URL : void 0;
  if (!e.env.DB || !t) return e.json({ error: "Service not configured" }, 503);
  const s = new X(e.env.DB), r = await new lo(s, t, n, e.env.AI ?? null).processPendingJobs();
  return e.json({ message: "Consolidation triggered", ...r });
});
it.get("/system/stats", async (e) => {
  if (!e.env.DB) return e.json({ error: "DB not configured" }, 503);
  const [t, n, s, o] = await Promise.all([e.env.DB.prepare("SELECT COUNT(*) as count FROM request_traces").first(), e.env.DB.prepare("SELECT COUNT(*) as count FROM memory_items").first(), e.env.DB.prepare("SELECT COUNT(*) as count FROM sessions").first(), e.env.DB.prepare("SELECT COUNT(*) as count FROM consolidation_jobs WHERE status = 'pending'").first()]);
  return e.json({ total_traces: (t == null ? void 0 : t.count) ?? 0, total_memories: (n == null ? void 0 : n.count) ?? 0, total_sessions: (s == null ? void 0 : s.count) ?? 0, pending_consolidation_jobs: (o == null ? void 0 : o.count) ?? 0, timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
var uo = bn({ name: ne().min(1).max(100), description: ne().max(500).optional().default(""), skill_loadout: Vt(ne()).optional().default([]), model_override: st(["default", "fast", "deep", "code"]).optional(), thalamus_threshold: ln().min(0.1).max(1).optional().default(0.72), insula_mode: st(["standard", "strict", "permissive"]).optional().default("standard"), rag_top_k: ln().min(1).max(20).optional().default(5), metadata: Qs(Zt()).optional().default({}) });
var Pe = new ot();
Pe.post("/", Xt("json", uo), async (e) => {
  const t = e.req.valid("json"), n = e.get("user_id");
  if (!e.env.DB) return e.json({ error: "DB not configured" }, 503);
  const s = new X(e.env.DB), o = (/* @__PURE__ */ new Date()).toISOString(), i = { id: `proj_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`, user_id: n, name: t.name, description: t.description, skill_loadout: t.skill_loadout, model_override: t.model_override ?? null, thalamus_threshold: t.thalamus_threshold, insula_mode: t.insula_mode, rag_top_k: t.rag_top_k, created_at: o, updated_at: o, metadata: t.metadata };
  return await s.upsertProject(i), e.json(i, 201);
});
Pe.get("/", async (e) => {
  const t = e.get("user_id");
  if (!e.env.DB) return e.json({ projects: [] });
  const s = await new X(e.env.DB).listProjects(t);
  return e.json({ projects: s, count: s.length });
});
Pe.get("/:id", async (e) => {
  const t = e.get("user_id"), n = e.req.param("id");
  if (!e.env.DB) return e.json({ error: "DB not configured" }, 503);
  const o = await new X(e.env.DB).getProject(n);
  return !o || o.user_id !== t ? e.json({ error: "Project not found" }, 404) : e.json(o);
});
Pe.put("/:id", Xt("json", uo.partial()), async (e) => {
  const t = e.req.valid("json"), n = e.get("user_id"), s = e.req.param("id");
  if (!e.env.DB) return e.json({ error: "DB not configured" }, 503);
  const o = new X(e.env.DB), r = await o.getProject(s);
  if (!r || r.user_id !== n) return e.json({ error: "Project not found" }, 404);
  const i = { ...r, ...t, id: s, user_id: n, updated_at: (/* @__PURE__ */ new Date()).toISOString() };
  return await o.upsertProject(i), e.json(i);
});
Pe.delete("/:id", async (e) => {
  const t = e.get("user_id"), n = e.req.param("id");
  return e.env.DB ? (await new X(e.env.DB).deleteProject(n, t), e.json({ deleted: true })) : e.json({ error: "DB not configured" }, 503);
});
Pe.get("/:id/memory", async (e) => {
  const t = e.get("user_id"), n = e.req.param("id");
  if (!e.env.DB) return e.json({ error: "DB not configured" }, 503);
  const o = await new X(e.env.DB).queryMemory({ user_id: t, project_id: n, scope: "project", limit: 50, exclude_high_decay: false });
  return e.json({ items: o, count: o.length, project_id: n });
});
var B = new ot();
B.use("*", tr({ origin: "*", allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], allowHeaders: ["Content-Type", "Authorization", "X-API-Key"] }));
B.use("/api/*", ar());
B.get("/api/health", (e) => e.json({ status: "ok", service: "Cognitive Runtime Service", version: "1.0.0", timestamp: (/* @__PURE__ */ new Date()).toISOString(), db: !!e.env.DB, model_configured: !!(e.env.OPENAI_API_KEY || e.env.ANTHROPIC_API_KEY), backend: e.env.OPENAI_API_KEY ? "openai-compatible" : e.env.ANTHROPIC_API_KEY ? "anthropic" : "none" }));
B.get("/api/init", async (e) => e.env.DB ? (await new X(e.env.DB).initialize(), e.json({ initialized: true, message: "Schema created + skills seeded." })) : e.json({ error: "No DB binding" }, 503));
B.use("/api/chat/*", Ht);
B.use("/api/memory/*", Ht);
B.use("/api/traces/*", Ht);
B.use("/api/projects/*", Ht);
B.route("/api/chat", wt);
B.route("/api/memory", kt);
B.route("/api/traces", it);
B.route("/api/projects", Pe);
B.get("/api/skills", async (e) => {
  const { BUILTIN_SKILLS: t } = await Promise.resolve().then(() => ao);
  return e.json({ skills: t.map((n) => ({ id: n.id, name: n.name, priority: n.priority, token_budget: n.token_budget, enabled: n.enabled })) });
});
B.get("/api/loadouts", async (e) => {
  const { LOADOUT_MAP: t } = await Promise.resolve().then(() => ao);
  return e.json({ loadouts: Object.values(t) });
});
B.get("/favicon.ico", (e) => {
  const t = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">\u{1F9E0}</text></svg>';
  return new Response(t, { headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400" } });
});
B.use("/static/*", _r({ root: "./" }));
B.get("/", (e) => e.html(po()));
B.get("/playground", (e) => e.html(po()));
function po() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Cognitive Runtime Service</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"/>
  <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"><\/script>
  <style>
    :root { --accent: #6366f1; --accent-dark: #4f46e5; }
    * { box-sizing: border-box; }
    body { font-family: 'Inter', system-ui, sans-serif; background: #0f172a; color: #e2e8f0; }
    .glass { background: rgba(255,255,255,0.04); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); }
    .accent-glow { box-shadow: 0 0 20px rgba(99,102,241,0.3); }
    pre { white-space: pre-wrap; word-break: break-word; }
    .tab-btn.active { background: var(--accent); color: white; }
    .tab-btn { background: rgba(255,255,255,0.05); color: #94a3b8; }
    .score-bar { height: 6px; border-radius: 3px; background: rgba(99,102,241,0.8); }
    @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.3} }
    .pulse { animation: pulse-dot 1.5s ease-in-out infinite; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }
    .msg-user { background: rgba(99,102,241,0.15); border-left: 3px solid #6366f1; }
    .msg-assistant { background: rgba(255,255,255,0.04); border-left: 3px solid #10b981; }
    .token-bar { background: linear-gradient(90deg, #6366f1, #10b981); height: 4px; border-radius: 2px; }
    .skill-badge { background: rgba(99,102,241,0.2); border: 1px solid rgba(99,102,241,0.4); }
    .memory-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); }
    .stage-done { color: #10b981; }
    .stage-line { border-left: 2px solid rgba(99,102,241,0.3); padding-left: 12px; margin-left: 6px; }
    textarea:focus, input:focus { outline: 2px solid var(--accent); outline-offset: 0; }
  </style>
</head>
<body class="min-h-screen">

<!-- Top Nav -->
<nav class="glass border-b border-white/5 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
  <div class="flex items-center gap-3">
    <div class="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
      <i class="fas fa-brain text-indigo-400 text-sm"></i>
    </div>
    <div>
      <span class="font-bold text-white text-sm">Cognitive Runtime</span>
      <span class="text-xs text-slate-500 ml-2">v1.0</span>
    </div>
  </div>
  <div class="flex items-center gap-4">
    <div id="health-dot" class="w-2 h-2 rounded-full bg-slate-600 pulse" title="Checking..."></div>
    <span id="health-label" class="text-xs text-slate-500">connecting...</span>
    <div class="flex gap-1">
      <input id="api-key-input" type="password" placeholder="API Key (crs_...)" 
             class="glass text-xs px-3 py-1.5 rounded text-slate-300 w-40 placeholder-slate-600"/>
      <button onclick="saveApiKey()" class="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded transition">Save</button>
    </div>
  </div>
</nav>

<!-- Main Layout -->
<div class="flex h-[calc(100vh-52px)]">
  <!-- Sidebar -->
  <aside class="glass border-r border-white/5 w-52 flex-shrink-0 flex flex-col">
    <div class="p-3 space-y-1">
      <button onclick="showTab('chat')" class="tab-btn w-full text-left px-3 py-2 rounded text-sm transition flex items-center gap-2 active" id="tab-chat">
        <i class="fas fa-comments w-4"></i> Chat
      </button>
      <button onclick="showTab('memory')" class="tab-btn w-full text-left px-3 py-2 rounded text-sm transition flex items-center gap-2" id="tab-memory">
        <i class="fas fa-memory w-4"></i> Memory
      </button>
      <button onclick="showTab('traces')" class="tab-btn w-full text-left px-3 py-2 rounded text-sm transition flex items-center gap-2" id="tab-traces">
        <i class="fas fa-route w-4"></i> Traces
      </button>
      <button onclick="showTab('inspector')" class="tab-btn w-full text-left px-3 py-2 rounded text-sm transition flex items-center gap-2" id="tab-inspector">
        <i class="fas fa-microscope w-4"></i> Inspector
      </button>
      <button onclick="showTab('skills')" class="tab-btn w-full text-left px-3 py-2 rounded text-sm transition flex items-center gap-2" id="tab-skills">
        <i class="fas fa-puzzle-piece w-4"></i> Skills
      </button>
      <button onclick="showTab('api')" class="tab-btn w-full text-left px-3 py-2 rounded text-sm transition flex items-center gap-2" id="tab-api">
        <i class="fas fa-book w-4"></i> API Docs
      </button>
    </div>

    <!-- Session Info -->
    <div class="mt-auto p-3 border-t border-white/5">
      <div class="text-xs text-slate-600 mb-1">Session</div>
      <div id="session-id-display" class="text-xs text-slate-500 font-mono break-all">\u2014</div>
      <button onclick="newSession()" class="mt-2 text-xs text-indigo-400 hover:text-indigo-300 transition">
        <i class="fas fa-plus mr-1"></i>New Session
      </button>
    </div>
  </aside>

  <!-- Content Area -->
  <main class="flex-1 overflow-hidden flex flex-col">

    <!-- CHAT TAB -->
    <div id="view-chat" class="flex flex-col h-full">
      <!-- Token Usage Bar -->
      <div class="glass border-b border-white/5 px-4 py-2 flex items-center gap-4">
        <div class="flex-1">
          <div class="flex justify-between text-xs text-slate-500 mb-1">
            <span>Token Usage</span>
            <span id="token-summary">\u2014</span>
          </div>
          <div class="bg-white/5 rounded-full h-1.5">
            <div id="token-bar-fill" class="token-bar" style="width:0%"></div>
          </div>
        </div>
        <div class="flex gap-3 text-xs text-slate-500">
          <span id="skills-active-display">No skills</span>
          <select id="loadout-select" class="glass text-xs px-2 py-1 rounded text-slate-300 cursor-pointer">
            <option value="default">Default</option>
            <option value="fast">Fast</option>
            <option value="deep">Deep</option>
          </select>
        </div>
      </div>
      
      <!-- Messages -->
      <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-3">
        <div class="text-center text-slate-600 text-sm mt-8">
          <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-3">
            <i class="fas fa-brain text-indigo-500 text-lg"></i>
          </div>
          <div class="font-medium text-slate-400">Cognitive Runtime Service</div>
          <div class="text-xs mt-1">Claude is the cortex. This service is the nervous system.</div>
          <div class="text-xs mt-3 text-slate-600">Set your API key, then start chatting. Memory persists across turns.</div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="glass border-t border-white/5 p-4">
        <div class="flex gap-3">
          <textarea id="chat-input" 
            placeholder="Message the cognitive runtime..." 
            class="glass flex-1 px-4 py-2.5 rounded-lg text-sm text-white placeholder-slate-600 resize-none"
            rows="2"
            onkeydown="if(event.key==='Enter' && !event.shiftKey){event.preventDefault();sendMessage()}"></textarea>
          <button onclick="sendMessage()" id="send-btn"
            class="bg-indigo-600 hover:bg-indigo-500 text-white px-5 rounded-lg text-sm font-medium transition accent-glow flex items-center gap-2">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
        <div class="flex gap-2 mt-2 text-xs text-slate-600">
          <span>Shift+Enter for newline</span>
          <span>\u2022</span>
          <span id="last-trace-id">No trace yet</span>
        </div>
      </div>
    </div>

    <!-- MEMORY TAB -->
    <div id="view-memory" class="hidden flex-col h-full">
      <div class="glass border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div class="flex gap-2">
          <select id="memory-scope-filter" class="glass text-xs px-2 py-1 rounded text-slate-300" onchange="loadMemory()">
            <option value="">All Scopes</option>
            <option value="session">Session</option>
            <option value="project">Project</option>
            <option value="global">Global</option>
          </select>
          <select id="memory-type-filter" class="glass text-xs px-2 py-1 rounded text-slate-300" onchange="loadMemory()">
            <option value="">All Types</option>
            <option value="episodic">Episodic</option>
            <option value="semantic">Semantic</option>
            <option value="summary">Summary</option>
          </select>
          <button onclick="loadMemory()" class="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded transition">Refresh</button>
        </div>
        <div id="memory-stats" class="text-xs text-slate-500">Loading stats...</div>
      </div>
      <div id="memory-list" class="flex-1 overflow-y-auto p-4">
        <div class="text-center text-slate-600 text-sm mt-8">Click Refresh to load memories</div>
      </div>
    </div>

    <!-- TRACES TAB -->
    <div id="view-traces" class="hidden flex-col h-full">
      <div class="glass border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div class="flex gap-2">
          <button onclick="loadTraces()" class="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded transition">Refresh</button>
          <button onclick="triggerConsolidation()" class="text-xs bg-emerald-600/50 hover:bg-emerald-600 text-white px-3 py-1 rounded transition">Run Consolidation</button>
        </div>
        <div id="traces-count" class="text-xs text-slate-500">\u2014</div>
      </div>
      <div id="traces-list" class="flex-1 overflow-y-auto p-4 space-y-2">
        <div class="text-center text-slate-600 text-sm mt-8">Click Refresh to load traces</div>
      </div>
    </div>

    <!-- INSPECTOR TAB -->
    <div id="view-inspector" class="hidden flex-col h-full">
      <div class="glass border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <input id="inspector-trace-id" type="text" placeholder="Paste trace_id..." 
               class="glass flex-1 px-3 py-1.5 rounded text-sm text-white placeholder-slate-600"/>
        <button onclick="inspectTrace()" class="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded transition">Inspect</button>
      </div>
      <div id="inspector-content" class="flex-1 overflow-y-auto p-4">
        <div class="text-center text-slate-600 text-sm mt-8">
          <i class="fas fa-microscope text-2xl mb-3 block text-slate-700"></i>
          Enter a trace ID to inspect the full cognitive pipeline
        </div>
      </div>
    </div>

    <!-- SKILLS TAB -->
    <div id="view-skills" class="hidden flex-col h-full">
      <div class="glass border-b border-white/5 px-4 py-3">
        <button onclick="loadSkills()" class="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded transition">Load Skills</button>
      </div>
      <div id="skills-list" class="flex-1 overflow-y-auto p-4">
        <div class="text-center text-slate-600 text-sm mt-8">Click Load Skills to view registered skill packages</div>
      </div>
    </div>

    <!-- API DOCS TAB -->
    <div id="view-api" class="hidden flex-col h-full overflow-y-auto">
      <div class="max-w-3xl mx-auto p-6 space-y-6">
        <div>
          <h2 class="text-lg font-bold text-white mb-1">API Reference</h2>
          <p class="text-sm text-slate-400">Cognitive Runtime Service \u2014 REST API</p>
        </div>
        
        <div class="glass rounded-lg p-4">
          <div class="font-mono text-xs text-indigo-400 mb-2">Authentication</div>
          <pre class="text-xs text-slate-300">Authorization: Bearer &lt;api_key&gt;
X-API-Key: &lt;api_key&gt;

# Demo: any key starting with "crs_" works
# e.g. crs_demo123</pre>
        </div>

        ${le("POST", "/api/chat", "Send a message through the cognitive pipeline", `{
  "message": "string (required)",
  "session_id": "uuid (optional, creates new if omitted)",
  "project_id": "string (optional)",
  "loadout_id": "default|fast|deep (default: default)",
  "skill_hints": ["code", "research"] (optional),
  "metadata": {} (optional)
}`, `{
  "trace_id": "uuid",
  "session_id": "uuid",
  "response": "Claude's response",
  "model": "claude-opus-4-5",
  "token_breakdown": {
    "system": 450, "context": 820,
    "history": 340, "user_message": 12, "total": 1622
  },
  "skills_activated": ["General Assistant", "Code Assistant"],
  "memory_items_retrieved": 3,
  "consolidation_queued": false
}`)}

        ${le("GET", "/api/chat/sessions", "List user sessions", null, '[{ "session_id": "...", "tokens_used": 1234, ... }]')}
        ${le("GET", "/api/memory", "Query memory items", "Query: scope, type, session_id, limit", '{ "items": [...], "count": 5 }')}
        ${le("POST", "/api/memory", "Store a memory item manually", `{
  "content": "User prefers TypeScript",
  "type": "semantic",
  "scope": "global",
  "tags": ["preference"],
  "confidence": 0.9
}`, '{ "id": "uuid", "created": true }')}
        ${le("GET", "/api/traces", "List request traces (observability)", "Query: session_id, limit", '{ "traces": [...], "count": N }')}
        ${le("GET", "/api/traces/:id", "Full trace with Thalamus scores, dropped context, token breakdown", null, "Full trace object")}
        ${le("POST", "/api/traces/consolidate", "Manually trigger consolidation worker", null, '{ "processed": 2, "errors": 0 }')}
        ${le("GET", "/api/health", "Health check", null, '{ "status": "ok", "db": true, "model_configured": true }')}
        ${le("GET", "/api/init", "Initialize DB schema (run once)", null, '{ "initialized": true }')}
      </div>
    </div>

  </main>
</div>

<script>
// \u2500\u2500 State \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
let state = {
  apiKey: localStorage.getItem('crs_api_key') || 'crs_demo',
  sessionId: localStorage.getItem('crs_session_id') || null,
  isStreaming: false,
  lastTraceId: null,
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('api-key-input').value = state.apiKey
  updateSessionDisplay()
  checkHealth()
  setInterval(checkHealth, 30000)
})

function saveApiKey() {
  state.apiKey = document.getElementById('api-key-input').value.trim()
  localStorage.setItem('crs_api_key', state.apiKey)
  showToast('API key saved')
}

function newSession() {
  state.sessionId = null
  localStorage.removeItem('crs_session_id')
  updateSessionDisplay()
  document.getElementById('chat-messages').innerHTML = \`
    <div class="text-center text-slate-600 text-sm mt-8">
      <i class="fas fa-circle-notch text-indigo-500 mb-3 text-2xl block"></i>
      New session started. Send a message to begin.
    </div>\`
  showToast('New session started')
}

function updateSessionDisplay() {
  const el = document.getElementById('session-id-display')
  el.textContent = state.sessionId ? state.sessionId.slice(0,16) + '...' : 'None (auto)'
}

// \u2500\u2500 Health Check \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
async function checkHealth() {
  try {
    const r = await fetch('/api/health')
    const d = await r.json()
    const dot = document.getElementById('health-dot')
    const label = document.getElementById('health-label')
    if (d.status === 'ok') {
      dot.className = 'w-2 h-2 rounded-full bg-emerald-400'
      label.textContent = d.model_configured ? 'Ready' : 'No API key'
      label.className = d.model_configured ? 'text-xs text-emerald-400' : 'text-xs text-yellow-400'
    }
  } catch {
    document.getElementById('health-dot').className = 'w-2 h-2 rounded-full bg-red-500 pulse'
    document.getElementById('health-label').textContent = 'offline'
  }
}

// \u2500\u2500 Tab Navigation \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function showTab(name) {
  ['chat','memory','traces','inspector','skills','api'].forEach(t => {
    document.getElementById('view-' + t).classList.add('hidden')
    document.getElementById('view-' + t).classList.remove('flex')
    document.getElementById('tab-' + t).classList.remove('active')
  })
  document.getElementById('view-' + name).classList.remove('hidden')
  document.getElementById('view-' + name).classList.add('flex')
  document.getElementById('tab-' + name).classList.add('active')
}

// \u2500\u2500 Chat \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
async function sendMessage() {
  const input = document.getElementById('chat-input')
  const msg = input.value.trim()
  if (!msg || state.isStreaming) return

  state.isStreaming = true
  input.value = ''
  document.getElementById('send-btn').disabled = true
  document.getElementById('send-btn').innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>'

  // Add user message
  appendMessage('user', msg)

  // Add thinking indicator
  const thinkingId = 'thinking-' + Date.now()
  appendThinking(thinkingId)

  const loadoutId = document.getElementById('loadout-select').value

  try {
    const r = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + state.apiKey,
      },
      body: JSON.stringify({
        message: msg,
        session_id: state.sessionId || undefined,
        loadout_id: loadoutId,
        metadata: {},
      })
    })

    if (!r.ok) {
      const err = await r.json()
      throw new Error(err.error || 'Request failed')
    }

    const data = await r.json()

    // Update session
    if (data.session_id) {
      state.sessionId = data.session_id
      localStorage.setItem('crs_session_id', data.session_id)
      updateSessionDisplay()
    }

    // Remove thinking
    document.getElementById(thinkingId)?.remove()

    // Add response
    appendMessage('assistant', data.response, {
      skills: data.skills_activated,
      memory: data.memory_items_retrieved,
      tokens: data.token_breakdown,
      trace_id: data.trace_id,
      consolidation: data.consolidation_queued,
    })

    // Update trace
    state.lastTraceId = data.trace_id
    document.getElementById('last-trace-id').innerHTML = 
      \`<span class="cursor-pointer text-indigo-400 hover:text-indigo-300" onclick="inspectTraceId('\${data.trace_id}')">\${data.trace_id.slice(0,8)}...</span>\`

    // Update token bar
    if (data.token_breakdown) {
      const total = data.token_breakdown.total
      const pct = Math.min(100, (total / 8000) * 100)
      document.getElementById('token-bar-fill').style.width = pct + '%'
      document.getElementById('token-summary').textContent = 
        \`\${total} tokens (sys:\${data.token_breakdown.system} ctx:\${data.token_breakdown.context} hist:\${data.token_breakdown.history})\`
    }

    // Update skills
    if (data.skills_activated?.length) {
      document.getElementById('skills-active-display').textContent = data.skills_activated.join(', ')
    }

  } catch (err) {
    document.getElementById(thinkingId)?.remove()
    appendMessage('system', '\u26A0\uFE0F Error: ' + err.message)
  } finally {
    state.isStreaming = false
    document.getElementById('send-btn').disabled = false
    document.getElementById('send-btn').innerHTML = '<i class="fas fa-paper-plane"></i>'
  }
}

function appendMessage(role, content, meta) {
  const container = document.getElementById('chat-messages')
  const div = document.createElement('div')
  const roleClass = role === 'user' ? 'msg-user' : role === 'assistant' ? 'msg-assistant' : 'glass'
  const roleIcon = role === 'user' ? '\u{1F464}' : role === 'assistant' ? '\u{1F9E0}' : '\u2699\uFE0F'
  
  let metaHtml = ''
  if (meta) {
    const skillBadges = (meta.skills || []).map(s => 
      \`<span class="skill-badge text-xs px-1.5 py-0.5 rounded text-indigo-300">\${s}</span>\`
    ).join('')
    
    metaHtml = \`<div class="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-white/5">
      \${skillBadges}
      <span class="text-xs text-slate-600">\${meta.memory || 0} memories retrieved</span>
      \${meta.consolidation ? '<span class="text-xs text-amber-500"><i class="fas fa-layer-group mr-1"></i>consolidating</span>' : ''}
    </div>\`
  }

  div.className = \`\${roleClass} rounded-lg p-3\`
  div.innerHTML = \`
    <div class="flex items-start gap-2">
      <span class="text-base">\${roleIcon}</span>
      <div class="flex-1 min-w-0">
        <div class="text-xs text-slate-500 mb-1">\${role === 'user' ? 'You' : role === 'assistant' ? 'Cognitive Runtime' : 'System'}</div>
        <div class="text-sm text-slate-200 leading-relaxed">\${escapeHtml(content).replace(/\\n/g,'<br>')}</div>
        \${metaHtml}
      </div>
    </div>\`

  container.appendChild(div)
  container.scrollTop = container.scrollHeight
}

function appendThinking(id) {
  const container = document.getElementById('chat-messages')
  const div = document.createElement('div')
  div.id = id
  div.className = 'glass rounded-lg p-3 msg-assistant'
  div.innerHTML = \`<div class="flex items-center gap-2 text-slate-400 text-sm">
    <i class="fas fa-brain text-indigo-400"></i>
    <span>Processing through cognitive pipeline...</span>
    <div class="flex gap-1">
      <div class="w-1.5 h-1.5 bg-indigo-400 rounded-full pulse"></div>
      <div class="w-1.5 h-1.5 bg-indigo-400 rounded-full pulse" style="animation-delay:0.3s"></div>
      <div class="w-1.5 h-1.5 bg-indigo-400 rounded-full pulse" style="animation-delay:0.6s"></div>
    </div>
  </div>\`
  container.appendChild(div)
  container.scrollTop = container.scrollHeight
}

// \u2500\u2500 Memory \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
async function loadMemory() {
  const scope = document.getElementById('memory-scope-filter').value
  const type = document.getElementById('memory-type-filter').value
  const params = new URLSearchParams()
  if (scope) params.set('scope', scope)
  if (type) params.set('type', type)
  if (state.sessionId) params.set('session_id', state.sessionId)
  params.set('limit', '30')

  const container = document.getElementById('memory-list')
  container.innerHTML = '<div class="text-slate-600 text-sm">Loading...</div>'

  try {
    const [memR, statsR] = await Promise.all([
      apiGet('/api/memory?' + params),
      apiGet('/api/memory/stats')
    ])

    // Stats
    const statsEl = document.getElementById('memory-stats')
    if (statsR.stats) {
      const total = statsR.stats.reduce((s, r) => s + (r.total || 0), 0)
      const totalTokens = statsR.stats.reduce((s, r) => s + (r.total_tokens || 0), 0)
      statsEl.textContent = \`\${total} items \xB7 \${totalTokens} tokens\`
    }

    if (!memR.items || memR.items.length === 0) {
      container.innerHTML = '<div class="text-center text-slate-600 text-sm mt-8">No memories found for the selected filters.</div>'
      return
    }

    container.innerHTML = ''
    memR.items.forEach(item => {
      const card = document.createElement('div')
      card.className = 'memory-card rounded-lg p-3 mb-2'
      const decayColor = item.decay_score > 0.5 ? 'text-red-400' : item.decay_score > 0.2 ? 'text-yellow-400' : 'text-emerald-400'
      const typeColor = item.type === 'summary' ? 'text-purple-400' : item.type === 'semantic' ? 'text-blue-400' : 'text-slate-400'
      card.innerHTML = \`
        <div class="flex items-start justify-between gap-2 mb-1.5">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs px-1.5 py-0.5 rounded bg-white/5 \${typeColor}">\${item.type}</span>
            <span class="text-xs text-slate-600">\${item.scope}</span>
            \${(item.tags || []).map(t => \`<span class="text-xs text-indigo-400 bg-indigo-500/10 px-1.5 rounded">\${t}</span>\`).join('')}
          </div>
          <div class="flex items-center gap-2 text-xs flex-shrink-0">
            <span class="\${decayColor}">decay:\${(item.decay_score || 0).toFixed(2)}</span>
            <span class="text-slate-600">conf:\${(item.confidence || 0).toFixed(2)}</span>
            <button onclick="deleteMemory('\${item.id}')" class="text-red-400/50 hover:text-red-400 transition"><i class="fas fa-times"></i></button>
          </div>
        </div>
        <div class="text-sm text-slate-300">\${escapeHtml(item.content)}</div>
        <div class="text-xs text-slate-600 mt-1">\${new Date(item.created_at).toLocaleString()} \xB7 \${item.token_count || 0} tokens</div>
      \`
      container.appendChild(card)
    })
  } catch (err) {
    container.innerHTML = \`<div class="text-red-400 text-sm">\${err.message}</div>\`
  }
}

async function deleteMemory(id) {
  await apiDelete('/api/memory/' + id)
  await loadMemory()
  showToast('Memory deleted')
}

// \u2500\u2500 Traces \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
async function loadTraces() {
  const params = state.sessionId ? '?session_id=' + state.sessionId : '?limit=20'
  const container = document.getElementById('traces-list')
  container.innerHTML = '<div class="text-slate-600 text-sm">Loading...</div>'

  try {
    const data = await apiGet('/api/traces' + params)
    document.getElementById('traces-count').textContent = (data.count || 0) + ' traces'

    if (!data.traces || data.traces.length === 0) {
      container.innerHTML = '<div class="text-center text-slate-600 text-sm mt-8">No traces yet. Send a message first.</div>'
      return
    }

    container.innerHTML = ''
    data.traces.forEach(trace => {
      const card = document.createElement('div')
      card.className = 'glass rounded-lg p-3 cursor-pointer hover:border-indigo-500/30 transition'
      card.onclick = () => inspectTraceId(trace.trace_id)
      const tb = trace.token_breakdown || {}
      const error = trace.error
      card.innerHTML = \`
        <div class="flex items-center justify-between mb-1">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full \${error ? 'bg-red-400' : 'bg-emerald-400'}"></span>
            <span class="font-mono text-xs text-indigo-400">\${trace.trace_id?.slice(0,12)}...</span>
          </div>
          <span class="text-xs text-slate-500">\${new Date(trace.request_at).toLocaleTimeString()}</span>
        </div>
        <div class="text-xs text-slate-500 flex gap-3">
          <span>tokens: \${tb.total || '\u2014'}</span>
          <span>session: \${trace.session_id?.slice(0,8) || '\u2014'}...</span>
          \${trace.consolidation_queued ? '<span class="text-amber-400">consolidated</span>' : ''}
          \${error ? \`<span class="text-red-400">error</span>\` : ''}
        </div>
      \`
      container.appendChild(card)
    })
  } catch (err) {
    container.innerHTML = \`<div class="text-red-400 text-sm">\${err.message}</div>\`
  }
}

async function triggerConsolidation() {
  try {
    const data = await apiPost('/api/traces/consolidate', {})
    showToast(\`Consolidation: \${data.processed} processed, \${data.errors} errors\`)
    await loadTraces()
  } catch (err) {
    showToast('Consolidation error: ' + err.message, true)
  }
}

// \u2500\u2500 Inspector \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function inspectTraceId(id) {
  document.getElementById('inspector-trace-id').value = id
  showTab('inspector')
  inspectTrace()
}

async function inspectTrace() {
  const traceId = document.getElementById('inspector-trace-id').value.trim()
  if (!traceId) return

  const container = document.getElementById('inspector-content')
  container.innerHTML = '<div class="text-slate-600 text-sm">Loading trace...</div>'

  try {
    const trace = await apiGet('/api/traces/' + traceId)
    container.innerHTML = renderTraceDetail(trace)
  } catch (err) {
    container.innerHTML = \`<div class="text-red-400 text-sm">Error: \${err.message}</div>\`
  }
}

function renderTraceDetail(trace) {
  const tb = trace.token_breakdown || {}
  const stages = (trace.stages || [])
  const dropped = (trace.dropped_context || [])
  const scored = (trace.thalamus_scores || [])
  
  const stageHtml = stages.map(s => \`
    <div class="stage-line mb-3">
      <div class="flex items-center gap-2 mb-1">
        <i class="fas fa-check-circle stage-done text-xs"></i>
        <span class="text-xs font-bold text-white">\${s.stage.toUpperCase()}</span>
        <span class="text-xs text-slate-600">\${s.duration_ms}ms</span>
      </div>
      <pre class="text-xs text-slate-400 bg-black/20 rounded p-2 overflow-x-auto">\${JSON.stringify(s.data, null, 2)}</pre>
    </div>
  \`).join('')

  const droppedHtml = dropped.length === 0 
    ? '<div class="text-xs text-slate-600">None dropped</div>'
    : dropped.map(d => \`
        <div class="flex items-center gap-2 text-xs py-1 border-b border-white/5">
          <i class="fas fa-times text-red-400"></i>
          <span class="text-slate-400 flex-1">\${d.label}</span>
          <span class="text-slate-600">\${d.reason}</span>
          <span class="text-red-400">\${(d.score || 0).toFixed(3)}</span>
        </div>
      \`).join('')

  const scoredHtml = scored.slice(0, 10).map(c => \`
    <div class="mb-2 text-xs">
      <div class="flex justify-between mb-0.5">
        <span class="text-slate-300">\${c.label}</span>
        <span class="text-indigo-400 font-mono">\${(c.scores?.final || 0).toFixed(3)}</span>
      </div>
      <div class="bg-white/5 rounded h-1.5">
        <div class="score-bar" style="width:\${Math.min(100,(c.scores?.final||0)*100)}%"></div>
      </div>
    </div>
  \`).join('')

  return \`
    <div class="space-y-4">
      <!-- Header -->
      <div class="glass rounded-lg p-4">
        <div class="font-mono text-sm text-indigo-400 mb-1">\${trace.trace_id}</div>
        <div class="text-xs text-slate-500 flex gap-4">
          <span>Session: \${trace.session_id?.slice(0,12)}...</span>
          <span>\${new Date(trace.request_at).toLocaleString()}</span>
          \${trace.error ? \`<span class="text-red-400">Error: \${trace.error}</span>\` : '<span class="text-emerald-400">Success</span>'}
        </div>
      </div>

      <!-- Token Breakdown -->
      <div class="glass rounded-lg p-4">
        <div class="text-xs font-bold text-white mb-3 flex items-center gap-2"><i class="fas fa-coins text-yellow-400"></i> Token Breakdown</div>
        <div class="grid grid-cols-4 gap-2">
          \${[['System', tb.system],['Context', tb.context],['History', tb.history],['User Msg', tb.user_message]].map(([k,v]) => \`
            <div class="bg-black/20 rounded p-2 text-center">
              <div class="text-xs text-slate-500">\${k}</div>
              <div class="text-sm font-mono text-white">\${v || 0}</div>
            </div>
          \`).join('')}
        </div>
        <div class="mt-2 text-xs text-slate-400 text-center">Total: <span class="text-white font-mono">\${tb.total || 0}</span> tokens</div>
      </div>

      <!-- Pipeline Stages -->
      <div class="glass rounded-lg p-4">
        <div class="text-xs font-bold text-white mb-3 flex items-center gap-2"><i class="fas fa-route text-indigo-400"></i> Pipeline Stages</div>
        \${stageHtml}
      </div>

      <!-- Thalamus Scores -->
      <div class="glass rounded-lg p-4">
        <div class="text-xs font-bold text-white mb-3 flex items-center gap-2"><i class="fas fa-chart-bar text-purple-400"></i> Thalamus Context Scores (top 10)</div>
        \${scoredHtml || '<div class="text-xs text-slate-600">No scored items</div>'}
      </div>

      <!-- Dropped Context -->
      <div class="glass rounded-lg p-4">
        <div class="text-xs font-bold text-white mb-3 flex items-center gap-2"><i class="fas fa-trash text-red-400"></i> Dropped Context (\${dropped.length})</div>
        \${droppedHtml}
      </div>
    </div>
  \`
}

// \u2500\u2500 Skills \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
async function loadSkills() {
  const container = document.getElementById('skills-list')
  container.innerHTML = '<div class="text-slate-600 text-sm">Loading...</div>'
  try {
    const data = await apiGet('/api/skills')
    container.innerHTML = ''
    ;(data.skills || []).forEach(skill => {
      const card = document.createElement('div')
      card.className = 'glass rounded-lg p-4 mb-2'
      card.innerHTML = \`
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="font-medium text-white text-sm">\${skill.name}</span>
            <span class="text-xs text-indigo-400 font-mono">\${skill.id}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-600">priority: \${skill.priority}</span>
            <span class="text-xs text-slate-600">\${skill.token_budget} tokens</span>
            <span class="text-xs \${skill.enabled ? 'text-emerald-400' : 'text-red-400'}">\${skill.enabled ? 'active' : 'disabled'}</span>
          </div>
        </div>
      \`
      container.appendChild(card)
    })
  } catch (err) {
    container.innerHTML = \`<div class="text-red-400 text-sm">\${err.message}</div>\`
  }
}

// \u2500\u2500 API Helpers \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function getHeaders() {
  return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + state.apiKey }
}

async function apiGet(path) {
  const r = await fetch(path, { headers: getHeaders() })
  if (!r.ok) { const e = await r.json(); throw new Error(e.error || r.statusText) }
  return r.json()
}

async function apiPost(path, body) {
  const r = await fetch(path, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) })
  if (!r.ok) { const e = await r.json(); throw new Error(e.error || r.statusText) }
  return r.json()
}

async function apiDelete(path) {
  const r = await fetch(path, { method: 'DELETE', headers: getHeaders() })
  if (!r.ok) { const e = await r.json(); throw new Error(e.error || r.statusText) }
  return r.json()
}

// \u2500\u2500 Utils \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function escapeHtml(text) {
  const div = document.createElement('div')
  div.appendChild(document.createTextNode(text || ''))
  return div.innerHTML
}

function showToast(msg, isError = false) {
  const toast = document.createElement('div')
  toast.className = \`fixed bottom-4 right-4 z-50 px-4 py-2 rounded-lg text-sm shadow-xl transition \${isError ? 'bg-red-600 text-white' : 'bg-indigo-600 text-white'}\`
  toast.textContent = msg
  document.body.appendChild(toast)
  setTimeout(() => toast.remove(), 3000)
}
<\/script>
</body>
</html>`;
}
__name(po, "po");
function le(e, t, n, s, o) {
  return `
    <div class="glass rounded-lg p-4">
      <div class="flex items-center gap-2 mb-2">
        <span class="font-mono text-xs font-bold ${e === "POST" ? "text-emerald-400" : e === "DELETE" ? "text-red-400" : "text-blue-400"}">${e}</span>
        <span class="font-mono text-xs text-white">${t}</span>
      </div>
      <div class="text-xs text-slate-400 mb-2">${n}</div>
      ${s ? `<div class="mb-2"><div class="text-xs text-slate-600 mb-1">Request:</div><pre class="text-xs text-slate-300 bg-black/30 rounded p-2 overflow-x-auto">${s}</pre></div>` : ""}
      <div><div class="text-xs text-slate-600 mb-1">Response:</div><pre class="text-xs text-slate-300 bg-black/30 rounded p-2 overflow-x-auto">${o}</pre></div>
    </div>`;
}
__name(le, "le");
var ss = new ot();
var Ol = Object.assign({ "/src/index.tsx": B });
var fo = false;
for (const [, e] of Object.entries(Ol)) e && (ss.route("/", e), ss.notFound(e.notFoundHandler), fo = true);
if (!fo) throw new Error("Can't import modules from ['/src/index.tsx','/app/server.ts']");
export {
  ss as default
};
//# sourceMappingURL=_worker.js.map
