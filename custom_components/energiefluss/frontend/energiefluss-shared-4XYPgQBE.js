/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const R = globalThis, q = R.ShadowRoot && (R.ShadyCSS === void 0 || R.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, K = Symbol(), et = /* @__PURE__ */ new WeakMap();
let ft = class {
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
const At = (r) => new ft(typeof r == "string" ? r : r + "", void 0, K), St = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((s, i, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + r[n + 1], r[0]);
  return new ft(e, r, K);
}, Et = (r, t) => {
  if (q) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = R.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, r.appendChild(s);
  }
}, st = q ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return At(e);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: kt, defineProperty: Mt, getOwnPropertyDescriptor: zt, getOwnPropertyNames: Lt, getOwnPropertySymbols: Pt, getPrototypeOf: Ct } = Object, D = globalThis, it = D.trustedTypes, Nt = it ? it.emptyScript : "", Bt = D.reactiveElementPolyfillSupport, L = (r, t) => r, T = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? Nt : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, t) {
  let e = r;
  switch (t) {
    case Boolean:
      e = r !== null;
      break;
    case Number:
      e = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(r);
      } catch {
        e = null;
      }
  }
  return e;
} }, J = (r, t) => !kt(r, t), rt = { attribute: !0, type: String, converter: T, reflect: !1, useDefault: !1, hasChanged: J };
Symbol.metadata ??= Symbol("metadata"), D.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let E = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = rt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && Mt(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: n } = zt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: i, set(o) {
      const c = i?.call(this);
      n?.call(this, o), this.requestUpdate(t, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? rt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(L("elementProperties"))) return;
    const t = Ct(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(L("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(L("properties"))) {
      const e = this.properties, s = [...Lt(e), ...Pt(e)];
      for (const i of s) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, i] of e) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const i = this._$Eu(e, s);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const i of s) e.unshift(st(i));
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
    return Et(t, this.constructor.elementStyles), t;
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
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const n = (s.converter?.toAttribute !== void 0 ? s.converter : T).toAttribute(e, s.type);
      this._$Em = t, n == null ? this.removeAttribute(i) : this.setAttribute(i, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const n = s.getPropertyOptions(i), o = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : T;
      this._$Em = i;
      const c = o.fromAttribute(e, n.type);
      this[i] = c ?? this._$Ej?.get(i) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, i = !1, n) {
    if (t !== void 0) {
      const o = this.constructor;
      if (i === !1 && (n = this[t]), s ??= o.getPropertyOptions(t), !((s.hasChanged ?? J)(n, e) || s.useDefault && s.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: n }, o) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [i, n] of this._$Ep) this[i] = n;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [i, n] of s) {
        const { wrapped: o } = n, c = this[i];
        o !== !0 || this._$AL.has(i) || c === void 0 || this.C(i, void 0, n, c);
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
E.elementStyles = [], E.shadowRootOptions = { mode: "open" }, E[L("elementProperties")] = /* @__PURE__ */ new Map(), E[L("finalized")] = /* @__PURE__ */ new Map(), Bt?.({ ReactiveElement: E }), (D.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Y = globalThis, nt = (r) => r, W = Y.trustedTypes, ot = W ? W.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, bt = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, $t = "?" + y, Ot = `<${$t}>`, A = document, C = () => A.createComment(""), N = (r) => r === null || typeof r != "object" && typeof r != "function", X = Array.isArray, Ht = (r) => X(r) || typeof r?.[Symbol.iterator] == "function", F = `[ 	
\f\r]`, z = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, at = /-->/g, lt = />/g, w = RegExp(`>|${F}(?:([^\\s"'>=/]+)(${F}*=${F}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ct = /'/g, dt = /"/g, vt = /^(?:script|style|textarea|title)$/i, yt = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), h = yt(1), be = yt(2), k = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), ht = /* @__PURE__ */ new WeakMap(), x = A.createTreeWalker(A, 129);
function wt(r, t) {
  if (!X(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ot !== void 0 ? ot.createHTML(t) : t;
}
const Ut = (r, t) => {
  const e = r.length - 1, s = [];
  let i, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = z;
  for (let c = 0; c < e; c++) {
    const a = r[c];
    let l, d, p = -1, _ = 0;
    for (; _ < a.length && (o.lastIndex = _, d = o.exec(a), d !== null); ) _ = o.lastIndex, o === z ? d[1] === "!--" ? o = at : d[1] !== void 0 ? o = lt : d[2] !== void 0 ? (vt.test(d[2]) && (i = RegExp("</" + d[2], "g")), o = w) : d[3] !== void 0 && (o = w) : o === w ? d[0] === ">" ? (o = i ?? z, p = -1) : d[1] === void 0 ? p = -2 : (p = o.lastIndex - d[2].length, l = d[1], o = d[3] === void 0 ? w : d[3] === '"' ? dt : ct) : o === dt || o === ct ? o = w : o === at || o === lt ? o = z : (o = w, i = void 0);
    const f = o === w && r[c + 1].startsWith("/>") ? " " : "";
    n += o === z ? a + Ot : p >= 0 ? (s.push(l), a.slice(0, p) + bt + a.slice(p) + y + f) : a + y + (p === -2 ? c : f);
  }
  return [wt(r, n + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class B {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let n = 0, o = 0;
    const c = t.length - 1, a = this.parts, [l, d] = Ut(t, e);
    if (this.el = B.createElement(l, s), x.currentNode = this.el.content, e === 2 || e === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (i = x.nextNode()) !== null && a.length < c; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const p of i.getAttributeNames()) if (p.endsWith(bt)) {
          const _ = d[o++], f = i.getAttribute(p).split(y), U = /([.?@])?(.*)/.exec(_);
          a.push({ type: 1, index: n, name: U[2], strings: f, ctor: U[1] === "." ? Tt : U[1] === "?" ? Wt : U[1] === "@" ? It : V }), i.removeAttribute(p);
        } else p.startsWith(y) && (a.push({ type: 6, index: n }), i.removeAttribute(p));
        if (vt.test(i.tagName)) {
          const p = i.textContent.split(y), _ = p.length - 1;
          if (_ > 0) {
            i.textContent = W ? W.emptyScript : "";
            for (let f = 0; f < _; f++) i.append(p[f], C()), x.nextNode(), a.push({ type: 2, index: ++n });
            i.append(p[_], C());
          }
        }
      } else if (i.nodeType === 8) if (i.data === $t) a.push({ type: 2, index: n });
      else {
        let p = -1;
        for (; (p = i.data.indexOf(y, p + 1)) !== -1; ) a.push({ type: 7, index: n }), p += y.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const s = A.createElement("template");
    return s.innerHTML = t, s;
  }
}
function M(r, t, e = r, s) {
  if (t === k) return t;
  let i = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const n = N(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== n && (i?._$AO?.(!1), n === void 0 ? i = void 0 : (i = new n(r), i._$AT(r, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = i : e._$Cl = i), i !== void 0 && (t = M(r, i._$AS(r, t.values), i, s)), t;
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
    const { el: { content: e }, parts: s } = this._$AD, i = (t?.creationScope ?? A).importNode(e, !0);
    x.currentNode = i;
    let n = x.nextNode(), o = 0, c = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let l;
        a.type === 2 ? l = new H(n, n.nextSibling, this, t) : a.type === 1 ? l = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (l = new Dt(n, this, t)), this._$AV.push(l), a = s[++c];
      }
      o !== a?.index && (n = x.nextNode(), o++);
    }
    return x.currentNode = A, i;
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
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = i?.isConnected ?? !0;
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
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = B.createElement(wt(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === i) this._$AH.p(e);
    else {
      const n = new Rt(i, this), o = n.u(this.options);
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
    let s, i = 0;
    for (const n of t) i === e.length ? e.push(s = new H(this.O(C()), this.O(C()), this, this.options)) : s = e[i], s._$AI(n), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
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
class V {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, n) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = u;
  }
  _$AI(t, e = this, s, i) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = M(this, t, e, 0), o = !N(t) || t !== this._$AH && t !== k, o && (this._$AH = t);
    else {
      const c = t;
      let a, l;
      for (t = n[0], a = 0; a < n.length - 1; a++) l = M(this, c[s + a], e, a), l === k && (l = this._$AH[a]), o ||= !N(l) || l !== this._$AH[a], l === u ? t = u : t !== u && (t += (l ?? "") + n[a + 1]), this._$AH[a] = l;
    }
    o && !i && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Tt extends V {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class Wt extends V {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class It extends V {
  constructor(t, e, s, i, n) {
    super(t, e, s, i, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = M(this, t, e, 0) ?? u) === k) return;
    const s = this._$AH, i = t === u && s !== u || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== u && (s === u || i);
    i && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
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
const Vt = Y.litHtmlPolyfillSupport;
Vt?.(B, H), (Y.litHtmlVersions ??= []).push("3.3.3");
const jt = (r, t, e) => {
  const s = e?.renderBefore ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const n = e?.renderBefore ?? null;
    s._$litPart$ = i = new H(t.insertBefore(C(), n), n, void 0, e ?? {});
  }
  return i._$AI(r), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Q = globalThis;
class P extends E {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = jt(e, this.renderRoot, this.renderOptions);
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
const Gt = { attribute: !0, type: String, converter: T, reflect: !1, hasChanged: J }, Zt = (r = Gt, t, e) => {
  const { kind: s, metadata: i } = e;
  let n = globalThis.litPropertyMetadata.get(i);
  if (n === void 0 && globalThis.litPropertyMetadata.set(i, n = /* @__PURE__ */ new Map()), s === "setter" && ((r = Object.create(r)).wrapped = !0), n.set(e.name, r), s === "accessor") {
    const { name: o } = e;
    return { set(c) {
      const a = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(o, a, r, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(o, void 0, r, c), c;
    } };
  }
  if (s === "setter") {
    const { name: o } = e;
    return function(c) {
      const a = this[o];
      t.call(this, c), this.requestUpdate(o, a, r, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function j(r) {
  return (t, e) => typeof e == "object" ? Zt(r, t, e) : ((s, i, n) => {
    const o = i.hasOwnProperty(n);
    return i.constructor.createProperty(n, s), o ? Object.getOwnPropertyDescriptor(i, n) : void 0;
  })(r, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function v(r) {
  return j({ ...r, state: !0, attribute: !1 });
}
const qt = { W: 1, kW: 1e3, MW: 1e6, mW: 1e-3 }, Kt = { Wh: 1e-3, kWh: 1, MWh: 1e3 };
function O(r) {
  if (!r) return null;
  const t = parseFloat(r.state);
  return Number.isFinite(t) ? t : null;
}
function $(r) {
  const t = O(r);
  if (t === null) return null;
  const e = r.attributes.unit_of_measurement ?? "W";
  return t * (qt[e] ?? 1);
}
function $e(r) {
  const t = O(r);
  if (t === null) return null;
  const e = r.attributes.unit_of_measurement ?? "kWh";
  return t * (Kt[e] ?? 1);
}
function S(r, t = "de") {
  return r === null ? "–" : Math.abs(r) < 1e3 ? `${Math.round(r).toLocaleString(t)} W` : `${(r / 1e3).toLocaleString(t, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kW`;
}
function ve(r, t = "de") {
  return r === null ? "–" : `${r.toLocaleString(t, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kWh`;
}
function ye(r, t = "de") {
  return r === null ? "–" : `${Math.round(r).toLocaleString(t)} %`;
}
function we(r, t) {
  return +(6 - 5 * Math.min(Math.abs(r) / Math.max(t, 1), 1)).toFixed(2);
}
function xe(r, t) {
  return r === null ? 1 : +(1 + 3 * Math.min(Math.abs(r) / Math.max(t, 1), 1)).toFixed(2);
}
function Ae(r, t = 9) {
  return r.length > t ? r.slice(0, t - 1) + "…" : r;
}
function Jt(r) {
  const t = O(r);
  if (t === null) return null;
  const e = String(r.attributes.unit_of_measurement ?? "").toLowerCase();
  return e.includes("ct") || e.includes("cent") ? t : t * 100;
}
function Yt(r, t = "de") {
  return r === null ? "" : `${r.toLocaleString(t, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ct/kWh`;
}
const Xt = ["W", "kW", "MW", "mW"];
function pt(r) {
  if (!r) return "Sensor nicht gefunden";
  const t = r.attributes.unit_of_measurement;
  return t && !Xt.includes(t) ? `Einheit „${t}“ ist keine Leistung (W/kW)` : null;
}
function ut(r, t) {
  if (r === null) return "kein Wert";
  const e = t ? -r : r;
  return Math.abs(e) < 5 ? "ruht" : e > 0 ? "lädt" : "entlädt";
}
function _t(r, t) {
  if (r === null) return "kein Wert";
  const e = t ? -r : r;
  return Math.abs(e) < 5 ? "ausgeglichen" : e > 0 ? "Bezug" : "Einspeisung";
}
const Qt = 44, te = 290;
function Se(r) {
  if (r <= 0) return [];
  const t = [[230], [195, 275], [160, 228, 296], [140, 192, 244, 296], [136, 184, 232, 280, 328]][Math.min(r, 5) - 1], e = r <= 3 ? 54 : r === 4 ? 46 : 44;
  return t.map((s, i) => {
    const n = t.length - 1 - i;
    return { cx: s, top: te + (n % 2 === 1 ? Qt : 0), w: e };
  });
}
function Ee(r, t = 15, e = 19) {
  const s = r.trim();
  if (s.length <= t) return { lines: [s], small: !1 };
  const i = (a) => a.length > e ? a.slice(0, e - 1) + "…" : a, n = [...s.matchAll(/ /g)].map((a) => a.index), o = n.filter((a) => a <= e && s.length - a - 1 <= e), c = o.length ? o : n.filter((a) => a <= e);
  if (c.length) {
    const a = s.length / 2, l = c.reduce((d, p) => Math.abs(p - a) < Math.abs(d - a) ? p : d);
    return { lines: [s.slice(0, l), i(s.slice(l + 1))], small: !0 };
  }
  return { lines: [s.slice(0, e), i(s.slice(e))], small: !0 };
}
const ee = 4 / 3;
function ke(r, t) {
  const e = Math.min(Math.abs(r) / Math.max(t, 1), 1);
  return +((1.6 + 3.4 * Math.sqrt(e)) * ee).toFixed(2);
}
function Me(r) {
  const t = r.trim().split(/[\s,]+/);
  let e = 0, s = 0, i = 0;
  const n = (o) => {
    const c = (d) => {
      let p = o.map((_) => [..._]);
      for (; p.length > 1; ) p = p.slice(1).map((_, f) => [p[f][0] + (_[0] - p[f][0]) * d, p[f][1] + (_[1] - p[f][1]) * d]);
      return p[0];
    };
    let [a, l] = o[0];
    for (let d = 1; d <= 24; d++) {
      const [p, _] = c(d / 24);
      i += Math.hypot(p - a, _ - l), [a, l] = [p, _];
    }
  };
  for (let o = 0; o < t.length; o++) {
    const c = t[o];
    if (c === "M")
      e = +t[++o], s = +t[++o];
    else if (c === "H") {
      const a = +t[++o];
      i += Math.abs(a - e), e = a;
    } else if (c === "V") {
      const a = +t[++o];
      i += Math.abs(a - s), s = a;
    } else if (c === "L") {
      const a = +t[++o], l = +t[++o];
      i += Math.hypot(a - e, l - s), [e, s] = [a, l];
    } else if (c === "Q" || c === "C") {
      const a = c === "Q" ? 2 : 3, l = [[e, s]];
      for (let d = 0; d < a; d++) l.push([+t[++o], +t[++o]]);
      n(l), [e, s] = l[a];
    }
  }
  return i;
}
function ze(r, t = 10) {
  const e = Math.floor(Math.abs(r) + 1e-9), s = Math.floor(e / 1e3), i = Math.floor(e % 1e3 / 100), n = Math.floor(e % 100 / 10);
  return [
    ...Array(Math.min(s, t)).fill("big"),
    ...Array(i).fill("medium"),
    ...Array(n).fill("small")
  ];
}
function Le(r, t, e) {
  const s = [r, t, e].map((n) => Math.max(0, n ?? 0)), i = s.reduce((n, o) => n + o, 0);
  return i > 0 ? s.map((n) => n / i) : [1, 0, 0];
}
function Pe(r, t) {
  const e = (i) => {
    const n = t.map((l) => l * i), o = n.map(Math.floor), c = n.map((l, d) => [l - Math.floor(l), d]).sort((l, d) => d[0] - l[0] || l[1] - d[1]), a = i - o.reduce((l, d) => l + d, 0);
    for (let l = 0; l < a; l++) o[c[l][1]]++;
    return o.flatMap((l, d) => Array(l).fill(d));
  }, s = new Map(["big", "medium", "small"].map((i) => [i, e(r.filter((n) => n === i).length)]));
  return r.map((i) => s.get(i).shift());
}
var se = Object.defineProperty, b = (r, t, e, s) => {
  for (var i = void 0, n = r.length - 1, o; n >= 0; n--)
    (o = r[n]) && (i = o(t, e, i) || i);
  return i && se(t, e, i), i;
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
], G = 5, mt = 2, g = { entity: { domain: "sensor" } }, I = { entity: { domain: "sensor", multiple: !0, reorder: !0 } }, ie = [
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
], re = [
  { name: "solar_strings", selector: I },
  { name: "solar_today", selector: g },
  { name: "solar_forecast_remaining", selector: g }
], xt = (r) => ({
  name: r,
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
function ne(r, t = !0) {
  const e = r.mode === "split" ? [
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
    ...t && r.mode === "split" ? [{ name: "backup_only", selector: { boolean: {} } }] : []
  ];
}
function oe(r) {
  const t = r.grid_mode === "split" ? [
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
  fixed_loads: "Laufen, wann sie müssen, ihr Verbrauch lässt sich kaum verschieben – z. B. Kühlschrank, Router, Server, Heizungspumpe, Licht, TV.",
  flexible_loads: "Du bestimmst selbst, wann sie laufen – z. B. Waschmaschine, Trockner, Spülmaschine, Wallbox, Pool-Pumpe. Diese lassen sich in Zeiten mit PV-Überschuss oder günstigem dynamischem Strompreis (z. B. Tibber) legen.",
  home_power: "Leer lassen: wird aus PV, Batterien und Netz berechnet.",
  solar_today: "Leer lassen: die Integration zählt selbst mit.",
  grid_import_today: "Leer lassen: die Integration zählt selbst mit.",
  grid_export_today: "Leer lassen: die Integration zählt selbst mit.",
  grid_power: "Leer lassen: wird berechnet, wenn der Hausverbrauch gemessen wird.",
  power: "Leer lassen: wird berechnet, wenn sonst alles gemessen ist (nur bei einer Batterie ohne Sensor)."
};
async function ue() {
  if (customElements.get("ha-form") && customElements.get("ha-entity-picker")) return;
  const r = await window.loadCardHelpers();
  for (const t of ["tile", "entities"])
    await (await r.createCardElement({ type: t, entity: "sun.sun", entities: [] })).constructor.getConfigElement?.();
}
const Z = (r) => JSON.parse(JSON.stringify(r ?? {}));
function _e(r) {
  const t = r;
  return t === 3 || typeof t == "object" && t?.code === 3 ? "Verbindung zu Home Assistant unterbrochen – bitte erneut speichern." : typeof t == "object" && t && typeof t.message == "string" ? t.message : typeof r == "string" ? r : "Speichern fehlgeschlagen – bitte erneut versuchen.";
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
    const s = t.detail.value, i = { ...this._draft };
    for (const n of e) {
      if (n === "title") continue;
      const o = s[n];
      o === void 0 || o === "" || Array.isArray(o) && o.length === 0 ? delete i[n] : i[n] = o;
    }
    "title" in s && (this._title = String(s.title ?? "")), this._draft = i;
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
    return (this._draft.batteries ?? []).some((s) => this._batteryUses(s).some((i) => e.includes(i)));
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
      const i = t[s];
      i && !this._draft[s] && this._apply({ [s]: i.value });
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
    const i = this._s(e), n = pt(i);
    return h`<div class="row">
        <span>${t}</span>
        <span>${S($(i), this._loc)}${s ? h` → <b>${s}</b>` : u}</span>
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
    const e = t.reduce((s, i) => s + ($(this._s(i)) ?? 0), 0);
    return h`<div class="live">
      ${t.map((s) => this._powerLine(this._name(s), s))}
      <div class="row total"><span>Summe</span><span>${S(e, this._loc)}</span></div>
      ${this._draft.solar_today ? u : this._calcNote("PV-Ertrag heute zählt die Integration selbst.")}
    </div>`;
  }
  _calcNote(t) {
    return h`<div class="calc">≈ ${t}</div>`;
  }
  _batteryLive(t, e) {
    const s = t.mode === "split", i = s ? !!(t.charge_power || t.discharge_power) : !!t.power, n = O(this._s(t.soc));
    let o = u;
    if (s && i) {
      const a = $(this._s(t.charge_power)), l = $(this._s(t.discharge_power)), d = a === null && l === null ? null : Math.abs(a ?? 0) - Math.abs(l ?? 0);
      o = h`${this._powerLine("Laden", t.charge_power)}${this._powerLine("Entladen", t.discharge_power)}
        <div class="row total"><span>Ergebnis</span>
          <span>${S(d === null ? null : Math.abs(d), this._loc)} → <b>${ut(d, !1)}</b></span>
        </div>`;
    } else i && (o = this._powerLine("Leistung", t.power, ut($(this._s(t.power)), !!t.invert)));
    const c = this._computed.includes(`battery_${e + 1}`);
    return !i && !t.soc && !(t.backup_loads ?? []).length ? u : h`<div class="live">
      ${o}
      ${i ? u : this._calcNote(
      c ? "Leistung wird aus der Energiebilanz berechnet." : "Ohne Leistungssensor: wird nur berechnet, wenn der Hausverbrauch gemessen wird und dies die einzige Batterie ohne Sensor ist."
    )}
      ${t.soc ? h`<div class="row"><span>Ladestand</span><span>${n === null ? "–" : `${Math.round(n)} %`}</span></div>` : u}
      ${(t.backup_loads ?? []).length ? h`<div class="row">
            <span>Notstrom-Abgang: ${t.backup_loads.length} Geräte</span>
            <span>${S(t.backup_loads.reduce((a, l) => a + ($(this._s(l)) ?? 0), 0), this._loc)}</span>
          </div>` : u}
    </div>`;
  }
  _gridLive() {
    const t = this._draft, e = t.grid_mode === "split", s = e ? !!(t.grid_import_power || t.grid_export_power) : !!t.grid_power;
    let i = u;
    if (e && s) {
      const c = $(this._s(t.grid_import_power)), a = $(this._s(t.grid_export_power)), l = c === null && a === null ? null : Math.abs(c ?? 0) - Math.abs(a ?? 0);
      i = h`${this._powerLine("Bezug", t.grid_import_power)}${this._powerLine("Einspeisung", t.grid_export_power)}
        <div class="row total"><span>Ergebnis</span>
          <span>${S(l === null ? null : Math.abs(l), this._loc)} → <b>${_t(l, !1)}</b></span>
        </div>`;
    } else s && (i = this._powerLine("Netz", t.grid_power, _t($(this._s(t.grid_power)), !!t.grid_invert)));
    let n = u;
    s || (n = this._calcNote(
      t.home_power ? "Netzleistung wird aus der Energiebilanz berechnet (gemessener Hausverbrauch)." : "Ohne Netzsensor fehlt ein Wert der Bilanz – bitte Netzsensor wählen oder Hausverbrauch messen."
    ));
    const o = !t.grid_import_today || !t.grid_export_today ? this._calcNote("Fehlende Tageswerte für Bezug/Einspeisung zählt die Integration selbst.") : u;
    return h`<div class="live">
      ${i}${n}
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
    }, i = () => {
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
      <button class="add" ?disabled=${t.length < 2} @click=${i}>+ Enthaltenen Verbraucher hinzufügen</button>
    </div>`;
  }
  _loadsLive() {
    const t = [
      ["Grundlast", this._draft.fixed_loads ?? []],
      ["Zusatzverbraucher", this._draft.flexible_loads ?? []]
    ];
    if (!t.some(([, i]) => i.length)) return u;
    const e = [
      ...t.flatMap(([, i]) => i),
      ...(this._draft.batteries ?? []).flatMap((i) => i.backup_loads ?? []),
      ...this._draft.wallbox_power ? [this._draft.wallbox_power] : []
    ], s = [...new Set(e.filter((i, n) => e.indexOf(i) !== n))];
    return h`<div class="live">
      ${t.map(([i, n]) => {
      const o = this._draft.load_parents ?? {}, c = n.filter((l) => !(l in o)).reduce((l, d) => l + ($(this._s(d)) ?? 0), 0), a = n.map((l) => [l, pt(this._s(l))]).filter(([, l]) => l);
      return h`<div class="row"><span>${i}: ${n.length} Geräte</span><span>${S(c, this._loc)}</span></div>
          ${a.map(([l, d]) => h`<div class="warn">⚠ ${this._name(l)}: ${d}</div>`)}`;
    })}
      ${s.length ? h`<div class="warn">⚠ In mehreren Gruppen: ${s.map((i) => this._name(i)).join(", ")}</div>` : u}
    </div>`;
  }
  _suggestRow(t, e, s, i, n, o = "Übernehmen") {
    return h`<div class="sg-row">
      <div class="sg-text"><b>${t}</b><span>${e}</span><small>${s}</small></div>
      ${i ? h`<span class="sg-done">✓ gesetzt</span>` : h`<button @click=${n}>${o}</button>`}
    </div>`;
  }
  _suggestionsPanel() {
    const t = this._suggestions;
    if (!t) return u;
    const e = this._draft, s = (c) => c.map((a) => this._name(a)).join(", "), i = [];
    if (t.solar_strings) {
      const c = t.solar_strings.value, a = JSON.stringify(e.solar_strings ?? []) === JSON.stringify(c);
      i.push(this._suggestRow("PV-Leistung", s(c), t.solar_strings.source, a, () => this._apply({ solar_strings: c })));
    }
    if (t.grid) {
      const c = t.grid.value, a = [c.grid_power, c.grid_import_power, c.grid_export_power].filter((p) => !!p), l = a.every((p) => [e.grid_power, e.grid_import_power, e.grid_export_power].includes(p)), d = c.grid_mode === "split" ? `Bezug: ${this._name(c.grid_import_power)} · Einspeisung: ${this._name(c.grid_export_power)}` : s(a);
      i.push(this._suggestRow("Netz", d, t.grid.source, l, () => this._apply(c)));
    }
    for (const [c, a] of gt) {
      const l = t[c];
      l && i.push(
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
      i.push(
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
      ${i.length ? i : h`<p class="hint">Keine passenden Sensoren gefunden.</p>`}
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
  _form(t, e, s, i = {}, n = {}) {
    return h`<ha-form
      .hass=${this.hass}
      .data=${e}
      .schema=${t}
      .computeLabel=${(o) => i[o.name] ?? he[o.name] ?? o.name}
      .computeHelper=${(o) => n[o.name] ?? pe[o.name]}
      @value-changed=${s}
    ></ha-form>`;
  }
  _section(t, e, s) {
    const i = h`<div class="section">
      <h2>${t}</h2>
      ${s ? h`<p class="hint">${s}</p>` : u}
      ${e}
    </div>`;
    return this.compact ? h`<div class="plain">${i}</div>` : h`<ha-card>${i}</ha-card>`;
  }
  render() {
    if (!this._ready || !this._loadedFor) return h`<div class="hint">Lade …</div>`;
    const t = this._draft, e = t.batteries ?? [], s = this._saving, i = this._message ? h`<span class="msg ${this._message.kind}">${this._message.text}</span>` : h`<span class="msg">${this.dirty ? "Ungespeicherte Änderungen an der Anlage" : ""}</span>`;
    return h`
      <div class="actions">
        ${i}
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
        ie,
        { title: this._title, energy_period: t.energy_period ?? "midnight" },
        (n) => this._onForm(n, ["title", "energy_period"])
      )
    )}
      ${this._section(
      "Solar",
      h`${this._form(
        re,
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
            !!(n.backup_loads ?? []).length || e.filter((a) => (a.backup_loads ?? []).length).length < mt
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
      `Ein Sensor mit + und − (positiv = lädt, sonst Schalter setzen) oder zwei getrennte Sensoren für Laden und Entladen. Bis zu ${G} Batterien, davon höchstens ${mt} mit Notstrom-Abgang.`
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
tt.styles = St`
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
let m = tt;
b([
  j({ attribute: !1 })
], m.prototype, "hass");
b([
  j({ attribute: !1 })
], m.prototype, "entryId");
b([
  j({ type: Boolean })
], m.prototype, "compact");
b([
  v()
], m.prototype, "_ready");
b([
  v()
], m.prototype, "_loadedFor");
b([
  v()
], m.prototype, "_title");
b([
  v()
], m.prototype, "_draft");
b([
  v()
], m.prototype, "_saved");
b([
  v()
], m.prototype, "_saving");
b([
  v()
], m.prototype, "_message");
b([
  v()
], m.prototype, "_computed");
b([
  v()
], m.prototype, "_suggestions");
b([
  v()
], m.prototype, "_detecting");
customElements.get("energiefluss-editor") || customElements.define("energiefluss-editor", m);
export {
  u as A,
  ge as U,
  St as a,
  h as b,
  O as c,
  be as d,
  ue as e,
  ke as f,
  we as g,
  S as h,
  P as i,
  ve as j,
  $e as k,
  xe as l,
  Se as m,
  j as n,
  ye as o,
  Me as p,
  Ee as q,
  v as r,
  Ae as s,
  Jt as t,
  Yt as u,
  ze as v,
  $ as w,
  Le as x,
  Pe as y
};
