/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const R = globalThis, q = R.ShadowRoot && (R.ShadyCSS === void 0 || R.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, K = Symbol(), et = /* @__PURE__ */ new WeakMap();
let mt = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== K) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (q && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = et.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && et.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const At = (i) => new mt(typeof i == "string" ? i : i + "", void 0, K), Et = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, r, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + i[n + 1], i[0]);
  return new mt(e, i, K);
}, St = (i, t) => {
  if (q) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), r = R.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = e.cssText, i.appendChild(s);
  }
}, st = q ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return At(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: kt, defineProperty: Mt, getOwnPropertyDescriptor: Lt, getOwnPropertyNames: zt, getOwnPropertySymbols: Pt, getPrototypeOf: Ct } = Object, D = globalThis, rt = D.trustedTypes, Nt = rt ? rt.emptyScript : "", Bt = D.reactiveElementPolyfillSupport, z = (i, t) => i, T = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? Nt : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, J = (i, t) => !kt(i, t), it = { attribute: !0, type: String, converter: T, reflect: !1, useDefault: !1, hasChanged: J };
Symbol.metadata ??= Symbol("metadata"), D.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let S = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = it) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(t, s, e);
      r !== void 0 && Mt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: r, set: n } = Lt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: r, set(o) {
      const c = r?.call(this);
      n?.call(this, o), this.requestUpdate(t, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? it;
  }
  static _$Ei() {
    if (this.hasOwnProperty(z("elementProperties"))) return;
    const t = Ct(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(z("properties"))) {
      const e = this.properties, s = [...zt(e), ...Pt(e)];
      for (const r of s) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, r] of e) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const r = this._$Eu(e, s);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const r of s) e.unshift(st(r));
    } else t !== void 0 && e.push(st(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return St(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    const s = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, s);
    if (r !== void 0 && s.reflect === !0) {
      const n = (s.converter?.toAttribute !== void 0 ? s.converter : T).toAttribute(e, s.type);
      this._$Em = t, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, r = s._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const n = s.getPropertyOptions(r), o = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : T;
      this._$Em = r;
      const c = o.fromAttribute(e, n.type);
      this[r] = c ?? this._$Ej?.get(r) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, r = !1, n) {
    if (t !== void 0) {
      const o = this.constructor;
      if (r === !1 && (n = this[t]), s ??= o.getPropertyOptions(t), !((s.hasChanged ?? J)(n, e) || s.useDefault && s.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: r, wrapped: n }, o) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [r, n] of this._$Ep) this[r] = n;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, n] of s) {
        const { wrapped: o } = n, c = this[r];
        o !== !0 || this._$AL.has(r) || c === void 0 || this.C(r, void 0, n, c);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
S.elementStyles = [], S.shadowRootOptions = { mode: "open" }, S[z("elementProperties")] = /* @__PURE__ */ new Map(), S[z("finalized")] = /* @__PURE__ */ new Map(), Bt?.({ ReactiveElement: S }), (D.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Y = globalThis, nt = (i) => i, W = Y.trustedTypes, ot = W ? W.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, bt = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, $t = "?" + y, Ot = `<${$t}>`, A = document, C = () => A.createComment(""), N = (i) => i === null || typeof i != "object" && typeof i != "function", X = Array.isArray, Ht = (i) => X(i) || typeof i?.[Symbol.iterator] == "function", F = `[ 	
\f\r]`, L = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, at = /-->/g, lt = />/g, w = RegExp(`>|${F}(?:([^\\s"'>=/]+)(${F}*=${F}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ct = /'/g, dt = /"/g, vt = /^(?:script|style|textarea|title)$/i, yt = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), h = yt(1), be = yt(2), k = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), ht = /* @__PURE__ */ new WeakMap(), x = A.createTreeWalker(A, 129);
function wt(i, t) {
  if (!X(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ot !== void 0 ? ot.createHTML(t) : t;
}
const Ut = (i, t) => {
  const e = i.length - 1, s = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = L;
  for (let c = 0; c < e; c++) {
    const a = i[c];
    let l, d, p = -1, _ = 0;
    for (; _ < a.length && (o.lastIndex = _, d = o.exec(a), d !== null); ) _ = o.lastIndex, o === L ? d[1] === "!--" ? o = at : d[1] !== void 0 ? o = lt : d[2] !== void 0 ? (vt.test(d[2]) && (r = RegExp("</" + d[2], "g")), o = w) : d[3] !== void 0 && (o = w) : o === w ? d[0] === ">" ? (o = r ?? L, p = -1) : d[1] === void 0 ? p = -2 : (p = o.lastIndex - d[2].length, l = d[1], o = d[3] === void 0 ? w : d[3] === '"' ? dt : ct) : o === dt || o === ct ? o = w : o === at || o === lt ? o = L : (o = w, r = void 0);
    const m = o === w && i[c + 1].startsWith("/>") ? " " : "";
    n += o === L ? a + Ot : p >= 0 ? (s.push(l), a.slice(0, p) + bt + a.slice(p) + y + m) : a + y + (p === -2 ? c : m);
  }
  return [wt(i, n + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class B {
  constructor({ strings: t, _$litType$: e }, s) {
    let r;
    this.parts = [];
    let n = 0, o = 0;
    const c = t.length - 1, a = this.parts, [l, d] = Ut(t, e);
    if (this.el = B.createElement(l, s), x.currentNode = this.el.content, e === 2 || e === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (r = x.nextNode()) !== null && a.length < c; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const p of r.getAttributeNames()) if (p.endsWith(bt)) {
          const _ = d[o++], m = r.getAttribute(p).split(y), U = /([.?@])?(.*)/.exec(_);
          a.push({ type: 1, index: n, name: U[2], strings: m, ctor: U[1] === "." ? Tt : U[1] === "?" ? Wt : U[1] === "@" ? It : j }), r.removeAttribute(p);
        } else p.startsWith(y) && (a.push({ type: 6, index: n }), r.removeAttribute(p));
        if (vt.test(r.tagName)) {
          const p = r.textContent.split(y), _ = p.length - 1;
          if (_ > 0) {
            r.textContent = W ? W.emptyScript : "";
            for (let m = 0; m < _; m++) r.append(p[m], C()), x.nextNode(), a.push({ type: 2, index: ++n });
            r.append(p[_], C());
          }
        }
      } else if (r.nodeType === 8) if (r.data === $t) a.push({ type: 2, index: n });
      else {
        let p = -1;
        for (; (p = r.data.indexOf(y, p + 1)) !== -1; ) a.push({ type: 7, index: n }), p += y.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const s = A.createElement("template");
    return s.innerHTML = t, s;
  }
}
function M(i, t, e = i, s) {
  if (t === k) return t;
  let r = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const n = N(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== n && (r?._$AO?.(!1), n === void 0 ? r = void 0 : (r = new n(i), r._$AT(i, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = r : e._$Cl = r), r !== void 0 && (t = M(i, r._$AS(i, t.values), r, s)), t;
}
class Rt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, r = (t?.creationScope ?? A).importNode(e, !0);
    x.currentNode = r;
    let n = x.nextNode(), o = 0, c = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let l;
        a.type === 2 ? l = new H(n, n.nextSibling, this, t) : a.type === 1 ? l = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (l = new Dt(n, this, t)), this._$AV.push(l), a = s[++c];
      }
      o !== a?.index && (n = x.nextNode(), o++);
    }
    return x.currentNode = A, r;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class H {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, r) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = M(this, t, e), N(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== k && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ht(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== u && N(this._$AH) ? this._$AA.nextSibling.data = t : this.T(A.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, r = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = B.createElement(wt(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(e);
    else {
      const n = new Rt(r, this), o = n.u(this.options);
      n.p(e), this.T(o), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = ht.get(t.strings);
    return e === void 0 && ht.set(t.strings, e = new B(t)), e;
  }
  k(t) {
    X(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, r = 0;
    for (const n of t) r === e.length ? e.push(s = new H(this.O(C()), this.O(C()), this, this.options)) : s = e[r], s._$AI(n), r++;
    r < e.length && (this._$AR(s && s._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = nt(t).nextSibling;
      nt(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class j {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, r, n) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = u;
  }
  _$AI(t, e = this, s, r) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = M(this, t, e, 0), o = !N(t) || t !== this._$AH && t !== k, o && (this._$AH = t);
    else {
      const c = t;
      let a, l;
      for (t = n[0], a = 0; a < n.length - 1; a++) l = M(this, c[s + a], e, a), l === k && (l = this._$AH[a]), o ||= !N(l) || l !== this._$AH[a], l === u ? t = u : t !== u && (t += (l ?? "") + n[a + 1]), this._$AH[a] = l;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Tt extends j {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class Wt extends j {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class It extends j {
  constructor(t, e, s, r, n) {
    super(t, e, s, r, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = M(this, t, e, 0) ?? u) === k) return;
    const s = this._$AH, r = t === u && s !== u || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== u && (s === u || r);
    r && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Dt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    M(this, t);
  }
}
const jt = Y.litHtmlPolyfillSupport;
jt?.(B, H), (Y.litHtmlVersions ??= []).push("3.3.3");
const Vt = (i, t, e) => {
  const s = e?.renderBefore ?? t;
  let r = s._$litPart$;
  if (r === void 0) {
    const n = e?.renderBefore ?? null;
    s._$litPart$ = r = new H(t.insertBefore(C(), n), n, void 0, e ?? {});
  }
  return r._$AI(i), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Q = globalThis;
class P extends S {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Vt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return k;
  }
}
P._$litElement$ = !0, P.finalized = !0, Q.litElementHydrateSupport?.({ LitElement: P });
const Ft = Q.litElementPolyfillSupport;
Ft?.({ LitElement: P });
(Q.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Gt = { attribute: !0, type: String, converter: T, reflect: !1, hasChanged: J }, Zt = (i = Gt, t, e) => {
  const { kind: s, metadata: r } = e;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), s === "setter" && ((i = Object.create(i)).wrapped = !0), n.set(e.name, i), s === "accessor") {
    const { name: o } = e;
    return { set(c) {
      const a = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(o, a, i, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(o, void 0, i, c), c;
    } };
  }
  if (s === "setter") {
    const { name: o } = e;
    return function(c) {
      const a = this[o];
      t.call(this, c), this.requestUpdate(o, a, i, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function V(i) {
  return (t, e) => typeof e == "object" ? Zt(i, t, e) : ((s, r, n) => {
    const o = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, s), o ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(i, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function v(i) {
  return V({ ...i, state: !0, attribute: !1 });
}
const qt = { W: 1, kW: 1e3, MW: 1e6, mW: 1e-3 }, Kt = { Wh: 1e-3, kWh: 1, MWh: 1e3 };
function O(i) {
  if (!i) return null;
  const t = parseFloat(i.state);
  return Number.isFinite(t) ? t : null;
}
function $(i) {
  const t = O(i);
  if (t === null) return null;
  const e = i.attributes.unit_of_measurement ?? "W";
  return t * (qt[e] ?? 1);
}
function $e(i) {
  const t = O(i);
  if (t === null) return null;
  const e = i.attributes.unit_of_measurement ?? "kWh";
  return t * (Kt[e] ?? 1);
}
function E(i, t = "de") {
  return i === null ? "–" : Math.abs(i) < 1e3 ? `${Math.round(i).toLocaleString(t)} W` : `${(i / 1e3).toLocaleString(t, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kW`;
}
function ve(i, t = "de") {
  return i === null ? "–" : `${i.toLocaleString(t, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kWh`;
}
function ye(i, t = "de") {
  return i === null ? "–" : `${Math.round(i).toLocaleString(t)} %`;
}
function we(i, t) {
  return +(6 - 5 * Math.min(Math.abs(i) / Math.max(t, 1), 1)).toFixed(2);
}
function xe(i, t) {
  return i === null ? 1 : +(1 + 3 * Math.min(Math.abs(i) / Math.max(t, 1), 1)).toFixed(2);
}
function Ae(i, t = 9) {
  return i.length > t ? i.slice(0, t - 1) + "…" : i;
}
function Jt(i) {
  const t = O(i);
  if (t === null) return null;
  const e = String(i.attributes.unit_of_measurement ?? "").toLowerCase();
  return e.includes("ct") || e.includes("cent") ? t : t * 100;
}
function Yt(i, t = "de") {
  return i === null ? "" : `${i.toLocaleString(t, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ct/kWh`;
}
const Xt = ["W", "kW", "MW", "mW"];
function pt(i) {
  if (!i) return "Sensor nicht gefunden";
  const t = i.attributes.unit_of_measurement;
  return t && !Xt.includes(t) ? `Einheit „${t}“ ist keine Leistung (W/kW)` : null;
}
function ut(i, t) {
  if (i === null) return "kein Wert";
  const e = t ? -i : i;
  return Math.abs(e) < 5 ? "ruht" : e > 0 ? "lädt" : "entlädt";
}
function _t(i, t) {
  if (i === null) return "kein Wert";
  const e = t ? -i : i;
  return Math.abs(e) < 5 ? "ausgeglichen" : e > 0 ? "Bezug" : "Einspeisung";
}
const Qt = 44, te = 290;
function Ee(i) {
  if (i <= 0) return [];
  const t = [[230], [195, 275], [160, 228, 296], [140, 192, 244, 296], [136, 184, 232, 280, 328]][Math.min(i, 5) - 1], e = i <= 3 ? 54 : i === 4 ? 46 : 44;
  return t.map((s, r) => {
    const n = t.length - 1 - r;
    return { cx: s, top: te + (n % 2 === 1 ? Qt : 0), w: e };
  });
}
function Se(i, t = 15, e = 19) {
  const s = i.trim();
  if (s.length <= t) return { lines: [s], small: !1 };
  const r = (a) => a.length > e ? a.slice(0, e - 1) + "…" : a, n = [...s.matchAll(/ /g)].map((a) => a.index), o = n.filter((a) => a <= e && s.length - a - 1 <= e), c = o.length ? o : n.filter((a) => a <= e);
  if (c.length) {
    const a = s.length / 2, l = c.reduce((d, p) => Math.abs(p - a) < Math.abs(d - a) ? p : d);
    return { lines: [s.slice(0, l), r(s.slice(l + 1))], small: !0 };
  }
  return { lines: [s.slice(0, e), r(s.slice(e))], small: !0 };
}
const ee = 4 / 3;
function ke(i, t) {
  const e = Math.min(Math.abs(i) / Math.max(t, 1), 1);
  return +((1.6 + 3.4 * Math.sqrt(e)) * ee).toFixed(2);
}
function Me(i) {
  const t = i.trim().split(/[\s,]+/);
  let e = 0, s = 0, r = 0;
  const n = (o) => {
    const c = (d) => {
      let p = o.map((_) => [..._]);
      for (; p.length > 1; ) p = p.slice(1).map((_, m) => [p[m][0] + (_[0] - p[m][0]) * d, p[m][1] + (_[1] - p[m][1]) * d]);
      return p[0];
    };
    let [a, l] = o[0];
    for (let d = 1; d <= 24; d++) {
      const [p, _] = c(d / 24);
      r += Math.hypot(p - a, _ - l), [a, l] = [p, _];
    }
  };
  for (let o = 0; o < t.length; o++) {
    const c = t[o];
    if (c === "M")
      e = +t[++o], s = +t[++o];
    else if (c === "H") {
      const a = +t[++o];
      r += Math.abs(a - e), e = a;
    } else if (c === "V") {
      const a = +t[++o];
      r += Math.abs(a - s), s = a;
    } else if (c === "L") {
      const a = +t[++o], l = +t[++o];
      r += Math.hypot(a - e, l - s), [e, s] = [a, l];
    } else if (c === "Q" || c === "C") {
      const a = c === "Q" ? 2 : 3, l = [[e, s]];
      for (let d = 0; d < a; d++) l.push([+t[++o], +t[++o]]);
      n(l), [e, s] = l[a];
    }
  }
  return r;
}
function Le(i, t = 10) {
  const e = Math.floor(Math.abs(i) + 1e-9), s = Math.floor(e / 1e3), r = Math.floor(e % 1e3 / 100), n = Math.floor(e % 100 / 10);
  return [
    ...Array(Math.min(s, t)).fill("big"),
    ...Array(r).fill("medium"),
    ...Array(n).fill("small")
  ];
}
function ze(i, t, e) {
  const s = [i, t, e].map((n) => Math.max(0, n ?? 0)), r = s.reduce((n, o) => n + o, 0);
  return r > 0 ? s.map((n) => n / r) : [1, 0, 0];
}
function Pe(i, t) {
  const e = (r) => {
    const n = t.map((l) => l * r), o = n.map(Math.floor), c = n.map((l, d) => [l - Math.floor(l), d]).sort((l, d) => d[0] - l[0] || l[1] - d[1]), a = r - o.reduce((l, d) => l + d, 0);
    for (let l = 0; l < a; l++) o[c[l][1]]++;
    return o.flatMap((l, d) => Array(l).fill(d));
  }, s = new Map(["big", "medium", "small"].map((r) => [r, e(i.filter((n) => n === r).length)]));
  return i.map((r) => s.get(r).shift());
}
var se = Object.defineProperty, b = (i, t, e, s) => {
  for (var r = void 0, n = i.length - 1, o; n >= 0; n--)
    (o = i[n]) && (r = o(t, e, r) || r);
  return r && se(t, e, r), r;
};
const gt = [
  ["solar_today", "PV-Ertrag heute"],
  ["solar_forecast_remaining", "PV-Prognose Rest heute"],
  ["grid_price", "Strompreis Bezug"],
  ["grid_import_today", "Bezug heute"],
  ["grid_export_today", "Einspeisung heute"],
  ["home_power", "Hausverbrauch gemessen"],
  ["wallbox_power", "Wallbox"],
  ["wallbox_soc", "Ladestand Auto"]
], G = 5, ft = 2, g = { entity: { domain: "sensor" } }, I = { entity: { domain: "sensor", multiple: !0, reorder: !0 } }, re = [
  { name: "title", selector: { text: {} } },
  {
    name: "energy_period",
    selector: {
      select: {
        mode: "list",
        options: [
          { value: "midnight", label: "Ab 0 Uhr (heute)" },
          { value: "rolling24", label: "Letzte 24 Stunden" }
        ]
      }
    }
  }
], ie = [
  { name: "solar_strings", selector: I },
  { name: "solar_today", selector: g },
  { name: "solar_forecast_remaining", selector: g }
], xt = (i) => ({
  name: i,
  selector: {
    select: {
      mode: "dropdown",
      options: [
        { value: "combined", label: "Ein Sensor mit + und −" },
        { value: "split", label: "Zwei Sensoren (getrennt, beide positiv)" }
      ]
    }
  }
});
function ne(i, t = !0) {
  const e = i.mode === "split" ? [
    { name: "charge_power", selector: g },
    { name: "discharge_power", selector: g }
  ] : [
    { name: "power", selector: g },
    { name: "invert", selector: { boolean: {} } }
  ];
  return [
    { name: "name", selector: { text: {} } },
    xt("mode"),
    ...e,
    { name: "soc", selector: g },
    { name: "capacity_kwh", selector: { number: { min: 0, max: 200, step: 0.1, mode: "box", unit_of_measurement: "kWh" } } },
    ...t ? [{ name: "backup_loads", selector: I }] : [],
    ...t && i.mode === "split" ? [{ name: "backup_only", selector: { boolean: {} } }] : []
  ];
}
function oe(i) {
  const t = i.grid_mode === "split" ? [
    { name: "grid_import_power", selector: g },
    { name: "grid_export_power", selector: g }
  ] : [
    { name: "grid_power", selector: g },
    { name: "grid_invert", selector: { boolean: {} } }
  ];
  return [xt("grid_mode"), ...t, ...le];
}
const ae = [
  "grid_mode",
  "grid_power",
  "grid_invert",
  "grid_import_power",
  "grid_export_power",
  "grid_price",
  "grid_export_price_fixed",
  "grid_export_price",
  "grid_import_today",
  "grid_export_today"
], le = [
  { name: "grid_price", selector: g },
  {
    name: "grid_export_price_fixed",
    selector: { number: { min: 0, max: 100, step: 0.01, mode: "box", unit_of_measurement: "ct/kWh" } }
  },
  { name: "grid_export_price", selector: g },
  { name: "grid_import_today", selector: g },
  { name: "grid_export_today", selector: g }
], ce = [
  { name: "fixed_loads", selector: I },
  { name: "flexible_loads", selector: I },
  { name: "home_power", selector: g }
], de = [
  { name: "wallbox_name", selector: { text: {} } },
  { name: "wallbox_power", selector: g },
  { name: "wallbox_flexible", selector: { boolean: {} } },
  { name: "wallbox_soc", selector: g }
], he = {
  wallbox_name: "Name",
  wallbox_power: "Ladeleistung",
  wallbox_flexible: "Zusatzverbraucher (sonst Grundlast)",
  wallbox_soc: "Ladestand Auto (optional)",
  title: "Name der Anlage",
  energy_period: "Tageswerte",
  solar_strings: "PV-Leistung (Strings / Wechselrichter)",
  solar_today: "PV-Ertrag heute",
  solar_forecast_remaining: "Prognose Rest heute",
  name: "Name",
  mode: "Leistung gemessen als",
  power: "Leistung",
  invert: "Sensor zählt Laden negativ",
  charge_power: "Ladeleistung",
  discharge_power: "Entladeleistung",
  backup_only: "Entlädt nur über Notstrom (nicht ins Haus)",
  grid_mode: "Netzleistung gemessen als",
  grid_import_power: "Bezug (z. B. Tibber „Leistung“)",
  grid_export_power: "Einspeisung (z. B. Tibber „Leistung Produktion“)",
  soc: "Ladestand (SoC)",
  capacity_kwh: "Kapazität",
  grid_power: "Netzleistung",
  grid_invert: "Sensor zählt Bezug negativ",
  grid_price: "Strompreis Bezug (z. B. Tibber)",
  grid_export_price_fixed: "Einspeisevergütung (fest)",
  grid_export_price: "Einspeisevergütung (Sensor)",
  grid_import_today: "Bezug heute",
  grid_export_today: "Einspeisung heute",
  fixed_loads: "Grundlast",
  flexible_loads: "Zusatzverbraucher",
  home_power: "Hausverbrauch gemessen (optional)"
}, pe = {
  energy_period: "Ab 0 Uhr setzt um Mitternacht auf null, 24 Stunden ist ein gleitendes Fenster.",
  solar_strings: "Mehrere Sensoren werden addiert. W oder kW.",
  grid_export_price: "Optional statt des festen Werts, falls sich die Vergütung ändert.",
  fixed_loads: "Laufen, wann sie müssen – z. B. Kühlschrank, TV, Server.",
  flexible_loads: "Zeitpunkt frei wählbar – z. B. Waschmaschine, Trockner, Wallbox.",
  home_power: "Leer lassen: wird aus PV, Batterien und Netz berechnet.",
  solar_today: "Leer lassen: die Integration zählt selbst mit.",
  grid_import_today: "Leer lassen: die Integration zählt selbst mit.",
  grid_export_today: "Leer lassen: die Integration zählt selbst mit.",
  grid_power: "Leer lassen: wird berechnet, wenn der Hausverbrauch gemessen wird.",
  power: "Leer lassen: wird berechnet, wenn sonst alles gemessen ist (nur bei einer Batterie ohne Sensor)."
};
async function ue() {
  if (customElements.get("ha-form") && customElements.get("ha-entity-picker")) return;
  const i = await window.loadCardHelpers();
  for (const t of ["tile", "entities"])
    await (await i.createCardElement({ type: t, entity: "sun.sun", entities: [] })).constructor.getConfigElement?.();
}
const Z = (i) => JSON.parse(JSON.stringify(i ?? {}));
function _e(i) {
  const t = i;
  return t === 3 || typeof t == "object" && t?.code === 3 ? "Verbindung zu Home Assistant unterbrochen – bitte erneut speichern." : typeof t == "object" && t && typeof t.message == "string" ? t.message : typeof i == "string" ? i : "Speichern fehlgeschlagen – bitte erneut versuchen.";
}
const ge = "energiefluss-updated", tt = class tt extends P {
  constructor() {
    super(...arguments), this.compact = !1, this._ready = !1, this._title = "", this._draft = {}, this._saved = "", this._saving = !1, this._computed = [], this._detecting = !1;
  }
  async firstUpdated() {
    await ue(), this._ready = !0;
  }
  updated(t) {
    (t.has("entryId") || t.has("hass")) && this.hass && this.entryId && this._loadedFor !== this.entryId && (this._loadedFor = this.entryId, this._load());
  }
  async _load() {
    const t = await this.hass.callWS({
      type: "energiefluss/get_options",
      entry_id: this.entryId
    });
    this._computed = t.computed ?? [], this._title = t.title, this._draft = Z(t.options), this._saved = this._snapshot(), this._message = void 0;
  }
  _snapshot() {
    return JSON.stringify({ t: this._title, o: this._draft });
  }
  get dirty() {
    return this._snapshot() !== this._saved;
  }
  // -- editing --------------------------------------------------------------------
  _onForm(t, e) {
    t.stopPropagation();
    const s = t.detail.value, r = { ...this._draft };
    for (const n of e) {
      if (n === "title") continue;
      const o = s[n];
      o === void 0 || o === "" || Array.isArray(o) && o.length === 0 ? delete r[n] : r[n] = o;
    }
    "title" in s && (this._title = String(s.title ?? "")), this._draft = r;
  }
  _onBattery(t, e) {
    e.stopPropagation();
    const s = [...this._draft.batteries ?? []];
    for (; s.length <= t; ) s.push({});
    s[t] = e.detail.value, this._draft = { ...this._draft, batteries: s };
  }
  // -- sensor detection ----------------------------------------------------------------
  async _detect() {
    if (this.hass) {
      this._detecting = !0;
      try {
        this._suggestions = await this.hass.callWS({ type: "energiefluss/suggest" });
      } finally {
        this._detecting = !1;
      }
    }
  }
  _batteryUses(t) {
    return [t.power, t.charge_power, t.discharge_power].filter((e) => !!e);
  }
  _hasBattery(t) {
    const e = this._batteryUses(t);
    return (this._draft.batteries ?? []).some((s) => this._batteryUses(s).some((r) => e.includes(r)));
  }
  _gridSet() {
    const t = this._draft;
    return !!(t.grid_power || t.grid_import_power || t.grid_export_power);
  }
  _apply(t) {
    this._draft = { ...this._draft, ...t };
  }
  _applyBattery(t) {
    this._hasBattery(t) || (this._draft = { ...this._draft, batteries: [...this._draft.batteries ?? [], { ...t }] });
  }
  _applyLoad(t, e) {
    const s = [...this._draft[e] ?? []];
    s.includes(t) || s.push(t), this._draft = { ...this._draft, [e]: s };
  }
  /** Fill every empty field from the suggestions; never overwrites anything. */
  _applyAllEmpty() {
    const t = this._suggestions;
    if (!t) return;
    const e = this._draft;
    t.solar_strings && !(e.solar_strings ?? []).length && this._apply({ solar_strings: t.solar_strings.value }), t.grid && !this._gridSet() && this._apply(t.grid.value);
    for (const [s] of gt) {
      const r = t[s];
      r && !this._draft[s] && this._apply({ [s]: r.value });
    }
    for (const s of t.batteries ?? []) this._applyBattery(s.value);
  }
  _addBattery() {
    const t = [...this._draft.batteries ?? []];
    t.length >= G || (t.push({ mode: "combined" }), this._draft = { ...this._draft, batteries: t });
  }
  _removeBattery(t) {
    const e = [...this._draft.batteries ?? []];
    e.splice(t, 1), this._draft = { ...this._draft, batteries: e };
  }
  /** Drop values that belong to the mode not selected (kept while editing). */
  _cleaned() {
    const t = Z(this._draft);
    return t.batteries = (t.batteries ?? []).map((e) => {
      const s = { ...e };
      return s.mode === "split" ? (delete s.power, delete s.invert) : (delete s.charge_power, delete s.discharge_power, delete s.backup_only), s;
    }).filter((e) => e.power || e.soc || e.charge_power || e.discharge_power), t.grid_mode === "split" ? (delete t.grid_power, delete t.grid_invert) : (delete t.grid_import_power, delete t.grid_export_power), t;
  }
  async save() {
    if (!(!this.hass || !this.entryId)) {
      this._saving = !0, this._message = void 0;
      try {
        const t = await this.hass.callWS({
          type: "energiefluss/save_options",
          entry_id: this.entryId,
          title: this._title,
          options: this._cleaned()
        });
        this._title = t.title, this._draft = Z(t.options), this._saved = this._snapshot(), await new Promise((s) => setTimeout(s, 1200)), window.dispatchEvent(new CustomEvent(ge, { detail: { entry_id: this.entryId } }));
        const e = await this.hass.callWS({
          type: "energiefluss/get_options",
          entry_id: this.entryId
        });
        this._computed = e.computed ?? [], this._message = { kind: "ok", text: "Anlage gespeichert." };
      } catch (t) {
        this._message = { kind: "error", text: _e(t) };
      } finally {
        this._saving = !1;
      }
    }
  }
  discard() {
    this._load();
  }
  // -- live hints -------------------------------------------------------------------
  _s(t) {
    return t ? this.hass?.states[t] : void 0;
  }
  get _loc() {
    return this.hass?.locale?.language ?? "de";
  }
  _name(t) {
    return this._s(t)?.attributes.friendly_name ?? t;
  }
  _powerLine(t, e, s) {
    if (!e) return u;
    const r = this._s(e), n = pt(r);
    return h`<div class="row">
        <span>${t}</span>
        <span>${E($(r), this._loc)}${s ? h` → <b>${s}</b>` : u}</span>
      </div>
      ${n ? h`<div class="warn">⚠ ${n}</div>` : u}`;
  }
  _solarLive() {
    const t = this._draft.solar_strings ?? [];
    if (!t.length)
      return h`<div class="live">
        ${this._calcNote(
        this._computed.includes("solar") ? "PV-Leistung wird aus der Energiebilanz berechnet." : "Ohne PV-Sensor: wird berechnet, wenn Netz und Hausverbrauch gemessen werden."
      )}
      </div>`;
    const e = t.reduce((s, r) => s + ($(this._s(r)) ?? 0), 0);
    return h`<div class="live">
      ${t.map((s) => this._powerLine(this._name(s), s))}
      <div class="row total"><span>Summe</span><span>${E(e, this._loc)}</span></div>
      ${this._draft.solar_today ? u : this._calcNote("PV-Ertrag heute zählt die Integration selbst.")}
    </div>`;
  }
  _calcNote(t) {
    return h`<div class="calc">≈ ${t}</div>`;
  }
  _batteryLive(t, e) {
    const s = t.mode === "split", r = s ? !!(t.charge_power || t.discharge_power) : !!t.power, n = O(this._s(t.soc));
    let o = u;
    if (s && r) {
      const a = $(this._s(t.charge_power)), l = $(this._s(t.discharge_power)), d = a === null && l === null ? null : Math.abs(a ?? 0) - Math.abs(l ?? 0);
      o = h`${this._powerLine("Laden", t.charge_power)}${this._powerLine("Entladen", t.discharge_power)}
        <div class="row total"><span>Ergebnis</span>
          <span>${E(d === null ? null : Math.abs(d), this._loc)} → <b>${ut(d, !1)}</b></span>
        </div>`;
    } else r && (o = this._powerLine("Leistung", t.power, ut($(this._s(t.power)), !!t.invert)));
    const c = this._computed.includes(`battery_${e + 1}`);
    return !r && !t.soc && !(t.backup_loads ?? []).length ? u : h`<div class="live">
      ${o}
      ${r ? u : this._calcNote(
      c ? "Leistung wird aus der Energiebilanz berechnet." : "Ohne Leistungssensor: wird nur berechnet, wenn der Hausverbrauch gemessen wird und dies die einzige Batterie ohne Sensor ist."
    )}
      ${t.soc ? h`<div class="row"><span>Ladestand</span><span>${n === null ? "–" : `${Math.round(n)} %`}</span></div>` : u}
      ${(t.backup_loads ?? []).length ? h`<div class="row">
            <span>Notstrom-Abgang: ${t.backup_loads.length} Geräte</span>
            <span>${E(t.backup_loads.reduce((a, l) => a + ($(this._s(l)) ?? 0), 0), this._loc)}</span>
          </div>` : u}
    </div>`;
  }
  _gridLive() {
    const t = this._draft, e = t.grid_mode === "split", s = e ? !!(t.grid_import_power || t.grid_export_power) : !!t.grid_power;
    let r = u;
    if (e && s) {
      const c = $(this._s(t.grid_import_power)), a = $(this._s(t.grid_export_power)), l = c === null && a === null ? null : Math.abs(c ?? 0) - Math.abs(a ?? 0);
      r = h`${this._powerLine("Bezug", t.grid_import_power)}${this._powerLine("Einspeisung", t.grid_export_power)}
        <div class="row total"><span>Ergebnis</span>
          <span>${E(l === null ? null : Math.abs(l), this._loc)} → <b>${_t(l, !1)}</b></span>
        </div>`;
    } else s && (r = this._powerLine("Netz", t.grid_power, _t($(this._s(t.grid_power)), !!t.grid_invert)));
    let n = u;
    s || (n = this._calcNote(
      t.home_power ? "Netzleistung wird aus der Energiebilanz berechnet (gemessener Hausverbrauch)." : "Ohne Netzsensor fehlt ein Wert der Bilanz – bitte Netzsensor wählen oder Hausverbrauch messen."
    ));
    const o = !t.grid_import_today || !t.grid_export_today ? this._calcNote("Fehlende Tageswerte für Bezug/Einspeisung zählt die Integration selbst.") : u;
    return h`<div class="live">
      ${r}${n}
      ${t.grid_price ? h`<div class="row">
            <span>Preis Bezug</span><span>${Yt(Jt(this._s(t.grid_price)), this._loc) || "–"}</span>
          </div>` : u}
      ${o}
    </div>`;
  }
  _wallboxLive() {
    const t = this._draft;
    if (!t.wallbox_power) return u;
    const e = O(this._s(t.wallbox_soc));
    return h`<div class="live">
      ${this._powerLine("Wallbox", t.wallbox_power, t.wallbox_flexible ?? !0 ? "Zusatzverbraucher" : "Grundlast")}
      ${t.wallbox_soc ? h`<div class="row"><span>Auto</span><span>${e === null ? "–" : `${Math.round(e)} %`}</span></div>` : u}
    </div>`;
  }
  /** All configured loads that can take part in a 'contained in' link. */
  _linkableLoads() {
    const t = this._draft;
    return [
      .../* @__PURE__ */ new Set([
        ...t.fixed_loads ?? [],
        ...t.flexible_loads ?? [],
        ...(t.batteries ?? []).flatMap((e) => e.backup_loads ?? [])
      ])
    ];
  }
  _setParents(t) {
    const e = { ...this._draft };
    t.length ? e.load_parents = Object.fromEntries(t) : delete e.load_parents, this._draft = e;
  }
  /** Editor for "<load> is contained in <load>" (counted only once). */
  _parentsEditor() {
    const t = this._linkableLoads(), e = Object.entries(this._draft.load_parents ?? {}), s = (o, c, a) => {
      const l = [...e];
      l[o] = [c, a], this._setParents(l);
    }, r = () => {
      const o = new Set(e.flatMap(([l, d]) => [l, d])), c = t.find((l) => !o.has(l)) ?? t[0], a = t.find((l) => l !== c && !e.some(([d]) => d === l)) ?? "";
      c && a && this._setParents([...e, [c, a]]);
    }, n = (o, c) => h`<option value=${o} ?selected=${o === c}>${this._name(o)}</option>`;
    return h`<div class="pairs">
      <h3>Enthaltene Verbraucher</h3>
      <p class="hint">
        Ist ein Gerät schon im Wert eines anderen enthalten (z. B. Wasserkocher im Unterzähler „Neubau“), wird es
        nur einmal gezählt und auf der Karte eingerückt darunter angezeigt.
      </p>
      ${e.map(
      ([o, c], a) => h`<div class="pair">
          <select @change=${(l) => s(a, l.target.value, c)}>
            ${t.map((l) => n(l, o))}
          </select>
          <span>ist enthalten in</span>
          <select @change=${(l) => s(a, o, l.target.value)}>
            ${t.filter((l) => l !== o).map((l) => n(l, c))}
          </select>
          <button class="link" @click=${() => this._setParents(e.filter((l, d) => d !== a))}>Entfernen</button>
        </div>
        ${o === c || e.some(([l]) => l === c) ? h`<div class="warn">⚠ Ungültig: ein Gerät kann nicht in sich selbst oder in einem enthaltenen Gerät stecken.</div>` : u}`
    )}
      <button class="add" ?disabled=${t.length < 2} @click=${r}>+ Enthaltenen Verbraucher hinzufügen</button>
    </div>`;
  }
  _loadsLive() {
    const t = [
      ["Grundlast", this._draft.fixed_loads ?? []],
      ["Zusatzverbraucher", this._draft.flexible_loads ?? []]
    ];
    if (!t.some(([, r]) => r.length)) return u;
    const e = [
      ...t.flatMap(([, r]) => r),
      ...(this._draft.batteries ?? []).flatMap((r) => r.backup_loads ?? []),
      ...this._draft.wallbox_power ? [this._draft.wallbox_power] : []
    ], s = [...new Set(e.filter((r, n) => e.indexOf(r) !== n))];
    return h`<div class="live">
      ${t.map(([r, n]) => {
      const o = this._draft.load_parents ?? {}, c = n.filter((l) => !(l in o)).reduce((l, d) => l + ($(this._s(d)) ?? 0), 0), a = n.map((l) => [l, pt(this._s(l))]).filter(([, l]) => l);
      return h`<div class="row"><span>${r}: ${n.length} Geräte</span><span>${E(c, this._loc)}</span></div>
          ${a.map(([l, d]) => h`<div class="warn">⚠ ${this._name(l)}: ${d}</div>`)}`;
    })}
      ${s.length ? h`<div class="warn">⚠ In mehreren Gruppen: ${s.map((r) => this._name(r)).join(", ")}</div>` : u}
    </div>`;
  }
  _suggestRow(t, e, s, r, n, o = "Übernehmen") {
    return h`<div class="sg-row">
      <div class="sg-text"><b>${t}</b><span>${e}</span><small>${s}</small></div>
      ${r ? h`<span class="sg-done">✓ gesetzt</span>` : h`<button @click=${n}>${o}</button>`}
    </div>`;
  }
  _suggestionsPanel() {
    const t = this._suggestions;
    if (!t) return u;
    const e = this._draft, s = (c) => c.map((a) => this._name(a)).join(", "), r = [];
    if (t.solar_strings) {
      const c = t.solar_strings.value, a = JSON.stringify(e.solar_strings ?? []) === JSON.stringify(c);
      r.push(this._suggestRow("PV-Leistung", s(c), t.solar_strings.source, a, () => this._apply({ solar_strings: c })));
    }
    if (t.grid) {
      const c = t.grid.value, a = [c.grid_power, c.grid_import_power, c.grid_export_power].filter((p) => !!p), l = a.every((p) => [e.grid_power, e.grid_import_power, e.grid_export_power].includes(p)), d = c.grid_mode === "split" ? `Bezug: ${this._name(c.grid_import_power)} · Einspeisung: ${this._name(c.grid_export_power)}` : s(a);
      r.push(this._suggestRow("Netz", d, t.grid.source, l, () => this._apply(c)));
    }
    for (const [c, a] of gt) {
      const l = t[c];
      l && r.push(
        this._suggestRow(
          a,
          this._name(l.value),
          l.source,
          e[c] === l.value,
          () => this._apply({ [c]: l.value })
        )
      );
    }
    for (const c of t.batteries ?? []) {
      const a = c.value, l = a.mode === "split" ? "Laden + Entladen" : "Leistung";
      r.push(
        this._suggestRow(
          "Batterie",
          `${a.name ?? ""} (${l}${a.soc ? " + Ladestand" : ""})`,
          c.source,
          this._hasBattery(a),
          () => this._applyBattery(a),
          "Hinzufügen"
        )
      );
    }
    const n = /* @__PURE__ */ new Set([
      ...e.fixed_loads ?? [],
      ...e.flexible_loads ?? [],
      ...e.wallbox_power ? [e.wallbox_power] : [],
      ...(e.batteries ?? []).flatMap((c) => c.backup_loads ?? [])
    ]), o = (t.loads ?? []).filter((c) => !n.has(c.entity));
    return h`<div class="suggest">
      <div class="sg-head">
        <h2>Vorschläge</h2>
        <div>
          <button class="primary" @click=${this._applyAllEmpty}>Alle leeren Felder füllen</button>
          <button @click=${() => this._suggestions = void 0}>Schließen</button>
        </div>
      </div>
      <p class="hint">Erkannt an Integration, Gerät, Einheit und Namen. Übernommenes landet im Entwurf – erst „Anlage speichern“ übernimmt es.</p>
      ${r.length ? r : h`<p class="hint">Keine passenden Sensoren gefunden.</p>`}
      ${o.length ? h`<h3>Mögliche Verbraucher</h3>
            ${o.map(
      (c) => h`<div class="sg-row">
                <div class="sg-text"><span>${c.name}</span><small>${c.source}</small></div>
                <div class="sg-btns">
                  <button @click=${() => this._applyLoad(c.entity, "fixed_loads")}>Grundlast</button>
                  <button @click=${() => this._applyLoad(c.entity, "flexible_loads")}>Zusatzverbraucher</button>
                </div>
              </div>`
    )}` : u}
    </div>`;
  }
  // -- render ---------------------------------------------------------------------------
  _form(t, e, s, r = {}, n = {}) {
    return h`<ha-form
      .hass=${this.hass}
      .data=${e}
      .schema=${t}
      .computeLabel=${(o) => r[o.name] ?? he[o.name] ?? o.name}
      .computeHelper=${(o) => n[o.name] ?? pe[o.name]}
      @value-changed=${s}
    ></ha-form>`;
  }
  _section(t, e, s) {
    const r = h`<div class="section">
      <h2>${t}</h2>
      ${s ? h`<p class="hint">${s}</p>` : u}
      ${e}
    </div>`;
    return this.compact ? h`<div class="plain">${r}</div>` : h`<ha-card>${r}</ha-card>`;
  }
  render() {
    if (!this._ready || !this._loadedFor) return h`<div class="hint">Lade …</div>`;
    const t = this._draft, e = t.batteries ?? [], s = this._saving, r = this._message ? h`<span class="msg ${this._message.kind}">${this._message.text}</span>` : h`<span class="msg">${this.dirty ? "Ungespeicherte Änderungen an der Anlage" : ""}</span>`;
    return h`
      <div class="actions">
        ${r}
        <button class="secondary" ?disabled=${this._detecting} @click=${this._detect}>
          ${this._detecting ? "Suche …" : "Sensoren erkennen"}
        </button>
        <button class="secondary" ?disabled=${!this.dirty || s} @click=${this.discard}>Verwerfen</button>
        <button class="primary" ?disabled=${!this.dirty || s} @click=${this.save}>
          ${s ? "Speichert …" : "Anlage speichern"}
        </button>
      </div>
      ${this._suggestionsPanel()}
      ${this._section(
      "Allgemein",
      this._form(
        re,
        { title: this._title, energy_period: t.energy_period ?? "midnight" },
        (n) => this._onForm(n, ["title", "energy_period"])
      )
    )}
      ${this._section(
      "Solar",
      h`${this._form(
        ie,
        t,
        (n) => this._onForm(n, ["solar_strings", "solar_today", "solar_forecast_remaining"])
      )}${this._solarLive()}`
    )}
      ${this._section(
      "Batterien",
      h`${e.map((n, o) => {
        const c = { mode: "combined", ...n };
        return h`<div class="sub">
            <div class="subhead">
              <h3>Batterie ${o + 1}${n.name ? ` – ${n.name}` : ""}</h3>
              <button class="link" @click=${() => this._removeBattery(o)}>Entfernen</button>
            </div>
            ${this._form(
          ne(
            n,
            !!(n.backup_loads ?? []).length || e.filter((a) => (a.backup_loads ?? []).length).length < ft
          ),
          c,
          (a) => this._onBattery(o, a),
          { backup_loads: "Notstrom-Abgang: Verbraucher an dieser Batterie" },
          {
            backup_loads: "Geräte am eigenen Ausgang der Batterie (z. B. Zendure, Ecoflow). Zählen zum Notstrom.",
            backup_only: "Für Geräte wie EcoFlow, die nicht ins Haus einspeisen können: Ladeleistung = Eingang aus dem Haus (auch was nur durchgeleitet wird), Entladeleistung = Ausgang an die Notstrom-Geräte."
          }
        )}
            ${this._batteryLive(n, o)}
          </div>`;
      })}
        ${e.length < G ? h`<button class="add" @click=${this._addBattery}>+ Batterie hinzufügen</button>` : u}`,
      `Ein Sensor mit + und − (positiv = lädt, sonst Schalter setzen) oder zwei getrennte Sensoren für Laden und Entladen. Bis zu ${G} Batterien, davon höchstens ${ft} mit Notstrom-Abgang.`
    )}
      ${this._section(
      "Netz",
      h`${this._form(
        oe(t),
        { grid_mode: "combined", ...t },
        (n) => this._onForm(n, ae)
      )}${this._gridLive()}`,
      "Ein Sensor mit + und − (positiv = Bezug) oder getrennt, z. B. Tibber Pulse: „Leistung“ und „Leistung Produktion“."
    )}
      ${this._section(
      "Wallbox / E-Auto",
      h`${this._form(
        de,
        { wallbox_flexible: !0, ...t },
        (n) => this._onForm(n, ["wallbox_name", "wallbox_power", "wallbox_soc", "wallbox_flexible"])
      )}${this._wallboxLive()}`,
      "Optional. Hängt am Wechselrichter und zählt zum Hausverbrauch; standardmäßig als Zusatzverbraucher."
    )}
      ${this._section(
      "Verbraucher",
      h`${this._form(
        ce,
        t,
        (n) => this._onForm(n, ["fixed_loads", "flexible_loads", "home_power"])
      )}${this._loadsLive()}${this._parentsEditor()}`,
      "Alle Verbraucher zählen zum Haus. Notstrom-Geräte trägst du direkt bei der jeweiligen Batterie ein."
    )}
    `;
  }
};
tt.styles = Et`
    :host {
      display: block;
    }
    .actions {
      position: sticky;
      top: 0;
      z-index: 2;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 0;
      margin-bottom: 8px;
      background: var(--ef-actions-bg, var(--card-background-color, var(--primary-background-color)));
    }
    .actions .msg {
      flex: 1;
      min-width: 0;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .msg.ok {
      color: var(--success-color, #43a047);
    }
    .msg.error {
      color: var(--error-color, #db4437);
    }
    button {
      flex: none;
      font: inherit;
      font-weight: 500;
      padding: 6px 14px;
      border-radius: 18px;
      cursor: pointer;
      border: 1px solid var(--primary-color);
      background: transparent;
      color: var(--primary-color);
    }
    button.primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    button:disabled {
      opacity: 0.4;
      cursor: default;
    }
    ha-card {
      display: block;
      margin-bottom: 16px;
    }
    .section {
      padding: 16px;
    }
    .plain .section {
      padding: 8px 0 16px;
      border-top: 1px solid var(--divider-color);
    }
    h2 {
      margin: 0 0 8px;
      font-size: 18px;
      font-weight: 500;
    }
    h3 {
      margin: 8px 0 4px;
      font-size: 15px;
      font-weight: 500;
    }
    .sub + .sub {
      margin-top: 12px;
      padding-top: 8px;
      border-top: 1px solid var(--divider-color);
    }
    .hint {
      margin: 0 0 8px;
      color: var(--secondary-text-color);
      font-size: 13px;
    }
    .live {
      margin-top: 8px;
      padding: 8px 12px;
      border-radius: 8px;
      background: var(--secondary-background-color);
      font-size: 13px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 2px 0;
    }
    .row.total {
      border-top: 1px solid var(--divider-color);
      margin-top: 2px;
      font-weight: 500;
    }
    .warn {
      color: var(--warning-color, #e69a00);
      padding: 2px 0;
    }
    .calc {
      color: var(--info-color, var(--primary-color));
      padding: 2px 0;
    }
    .subhead {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    button.link {
      border: none;
      padding: 2px 6px;
      font-size: 13px;
      color: var(--error-color, #db4437);
    }
    .suggest {
      margin-bottom: 16px;
      padding: 12px 16px;
      border: 1px solid var(--primary-color);
      border-radius: 12px;
      background: var(--card-background-color, var(--primary-background-color));
    }
    .sg-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }
    .sg-head div,
    .sg-btns {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .sg-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 6px 0;
      border-top: 1px solid var(--divider-color);
      font-size: 13px;
    }
    .sg-text {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .sg-text small {
      color: var(--secondary-text-color);
    }
    .sg-done {
      color: var(--success-color, #43a047);
      white-space: nowrap;
    }
    .suggest button {
      padding: 4px 10px;
      font-size: 12px;
    }
    .pairs {
      margin-top: 16px;
    }
    .pair {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
      padding: 4px 0;
      font-size: 13px;
    }
    .pair select {
      flex: 1;
      min-width: 110px;
      font: inherit;
      padding: 4px 6px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
    }
    button.add {
      margin-top: 12px;
      width: 100%;
      border-style: dashed;
    }
  `;
let f = tt;
b([
  V({ attribute: !1 })
], f.prototype, "hass");
b([
  V({ attribute: !1 })
], f.prototype, "entryId");
b([
  V({ type: Boolean })
], f.prototype, "compact");
b([
  v()
], f.prototype, "_ready");
b([
  v()
], f.prototype, "_loadedFor");
b([
  v()
], f.prototype, "_title");
b([
  v()
], f.prototype, "_draft");
b([
  v()
], f.prototype, "_saved");
b([
  v()
], f.prototype, "_saving");
b([
  v()
], f.prototype, "_message");
b([
  v()
], f.prototype, "_computed");
b([
  v()
], f.prototype, "_suggestions");
b([
  v()
], f.prototype, "_detecting");
customElements.get("energiefluss-editor") || customElements.define("energiefluss-editor", f);
export {
  u as A,
  ge as U,
  Et as a,
  h as b,
  O as c,
  be as d,
  ue as e,
  ke as f,
  we as g,
  E as h,
  P as i,
  ve as j,
  $e as k,
  xe as l,
  Ee as m,
  V as n,
  ye as o,
  Me as p,
  Se as q,
  v as r,
  Ae as s,
  Jt as t,
  Yt as u,
  Le as v,
  $ as w,
  ze as x,
  Pe as y
};
