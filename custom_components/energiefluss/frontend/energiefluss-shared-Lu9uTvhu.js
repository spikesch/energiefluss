/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const T = globalThis, K = T.ShadowRoot && (T.ShadyCSS === void 0 || T.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, J = Symbol(), te = /* @__PURE__ */ new WeakMap();
let me = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== J) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (K && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = te.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && te.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ae = (r) => new me(typeof r == "string" ? r : r + "", void 0, J), Se = (r, ...e) => {
  const t = r.length === 1 ? r[0] : e.reduce((s, i, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + r[n + 1], r[0]);
  return new me(t, r, J);
}, Ee = (r, e) => {
  if (K) r.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), i = T.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = t.cssText, r.appendChild(s);
  }
}, se = K ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return Ae(t);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ke, defineProperty: Le, getOwnPropertyDescriptor: Pe, getOwnPropertyNames: ze, getOwnPropertySymbols: Me, getPrototypeOf: Ce } = Object, V = globalThis, ie = V.trustedTypes, Ne = ie ? ie.emptyScript : "", Oe = V.reactiveElementPolyfillSupport, z = (r, e) => r, H = { toAttribute(r, e) {
  switch (e) {
    case Boolean:
      r = r ? Ne : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, e) {
  let t = r;
  switch (e) {
    case Boolean:
      t = r !== null;
      break;
    case Number:
      t = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(r);
      } catch {
        t = null;
      }
  }
  return t;
} }, Z = (r, e) => !ke(r, e), re = { attribute: !0, type: String, converter: H, reflect: !1, useDefault: !1, hasChanged: Z };
Symbol.metadata ??= Symbol("metadata"), V.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let E = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = re) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(e, s, t);
      i !== void 0 && Le(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: i, set: n } = Pe(this.prototype, e) ?? { get() {
      return this[t];
    }, set(o) {
      this[t] = o;
    } };
    return { get: i, set(o) {
      const a = i?.call(this);
      n?.call(this, o), this.requestUpdate(e, a, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? re;
  }
  static _$Ei() {
    if (this.hasOwnProperty(z("elementProperties"))) return;
    const e = Ce(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(z("properties"))) {
      const t = this.properties, s = [...ze(t), ...Me(t)];
      for (const i of s) this.createProperty(i, t[i]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [s, i] of t) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, s] of this.elementProperties) {
      const i = this._$Eu(t, s);
      i !== void 0 && this._$Eh.set(i, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const i of s) t.unshift(se(i));
    } else e !== void 0 && t.push(se(e));
    return t;
  }
  static _$Eu(e, t) {
    const s = t.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const s of t.keys()) this.hasOwnProperty(s) && (e.set(s, this[s]), delete this[s]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ee(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, t, s) {
    this._$AK(e, s);
  }
  _$ET(e, t) {
    const s = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, s);
    if (i !== void 0 && s.reflect === !0) {
      const n = (s.converter?.toAttribute !== void 0 ? s.converter : H).toAttribute(t, s.type);
      this._$Em = e, n == null ? this.removeAttribute(i) : this.setAttribute(i, n), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const s = this.constructor, i = s._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const n = s.getPropertyOptions(i), o = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : H;
      this._$Em = i;
      const a = o.fromAttribute(t, n.type);
      this[i] = a ?? this._$Ej?.get(i) ?? a, this._$Em = null;
    }
  }
  requestUpdate(e, t, s, i = !1, n) {
    if (e !== void 0) {
      const o = this.constructor;
      if (i === !1 && (n = this[e]), s ??= o.getPropertyOptions(e), !((s.hasChanged ?? Z)(n, t) || s.useDefault && s.reflect && n === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, s)))) return;
      this.C(e, t, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: s, reflect: i, wrapped: n }, o) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, o ?? t ?? this[e]), n !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
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
        const { wrapped: o } = n, a = this[i];
        o !== !0 || this._$AL.has(i) || a === void 0 || this.C(i, void 0, n, a);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(t)) : this._$EM();
    } catch (s) {
      throw e = !1, this._$EM(), s;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((t) => t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq &&= this._$Eq.forEach((t) => this._$ET(t, this[t])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
E.elementStyles = [], E.shadowRootOptions = { mode: "open" }, E[z("elementProperties")] = /* @__PURE__ */ new Map(), E[z("finalized")] = /* @__PURE__ */ new Map(), Oe?.({ ReactiveElement: E }), (V.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Y = globalThis, ne = (r) => r, W = Y.trustedTypes, oe = W ? W.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, be = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, $e = "?" + y, Be = `<${$e}>`, A = document, C = () => A.createComment(""), N = (r) => r === null || typeof r != "object" && typeof r != "function", X = Array.isArray, Ue = (r) => X(r) || typeof r?.[Symbol.iterator] == "function", F = `[ 	
\f\r]`, P = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ae = /-->/g, le = />/g, w = RegExp(`>|${F}(?:([^\\s"'>=/]+)(${F}*=${F}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), de = /'/g, ce = /"/g, ve = /^(?:script|style|textarea|title)$/i, ye = (r) => (e, ...t) => ({ _$litType$: r, strings: e, values: t }), c = ye(1), bt = ye(2), k = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), he = /* @__PURE__ */ new WeakMap(), x = A.createTreeWalker(A, 129);
function we(r, e) {
  if (!X(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return oe !== void 0 ? oe.createHTML(e) : e;
}
const Re = (r, e) => {
  const t = r.length - 1, s = [];
  let i, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = P;
  for (let a = 0; a < t; a++) {
    const l = r[a];
    let d, p, u = -1, $ = 0;
    for (; $ < l.length && (o.lastIndex = $, p = o.exec(l), p !== null); ) $ = o.lastIndex, o === P ? p[1] === "!--" ? o = ae : p[1] !== void 0 ? o = le : p[2] !== void 0 ? (ve.test(p[2]) && (i = RegExp("</" + p[2], "g")), o = w) : p[3] !== void 0 && (o = w) : o === w ? p[0] === ">" ? (o = i ?? P, u = -1) : p[1] === void 0 ? u = -2 : (u = o.lastIndex - p[2].length, d = p[1], o = p[3] === void 0 ? w : p[3] === '"' ? ce : de) : o === ce || o === de ? o = w : o === ae || o === le ? o = P : (o = w, i = void 0);
    const v = o === w && r[a + 1].startsWith("/>") ? " " : "";
    n += o === P ? l + Be : u >= 0 ? (s.push(d), l.slice(0, u) + be + l.slice(u) + y + v) : l + y + (u === -2 ? a : v);
  }
  return [we(r, n + (r[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class O {
  constructor({ strings: e, _$litType$: t }, s) {
    let i;
    this.parts = [];
    let n = 0, o = 0;
    const a = e.length - 1, l = this.parts, [d, p] = Re(e, t);
    if (this.el = O.createElement(d, s), x.currentNode = this.el.content, t === 2 || t === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (i = x.nextNode()) !== null && l.length < a; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const u of i.getAttributeNames()) if (u.endsWith(be)) {
          const $ = p[o++], v = i.getAttribute(u).split(y), R = /([.?@])?(.*)/.exec($);
          l.push({ type: 1, index: n, name: R[2], strings: v, ctor: R[1] === "." ? He : R[1] === "?" ? We : R[1] === "@" ? Ie : D }), i.removeAttribute(u);
        } else u.startsWith(y) && (l.push({ type: 6, index: n }), i.removeAttribute(u));
        if (ve.test(i.tagName)) {
          const u = i.textContent.split(y), $ = u.length - 1;
          if ($ > 0) {
            i.textContent = W ? W.emptyScript : "";
            for (let v = 0; v < $; v++) i.append(u[v], C()), x.nextNode(), l.push({ type: 2, index: ++n });
            i.append(u[$], C());
          }
        }
      } else if (i.nodeType === 8) if (i.data === $e) l.push({ type: 2, index: n });
      else {
        let u = -1;
        for (; (u = i.data.indexOf(y, u + 1)) !== -1; ) l.push({ type: 7, index: n }), u += y.length - 1;
      }
      n++;
    }
  }
  static createElement(e, t) {
    const s = A.createElement("template");
    return s.innerHTML = e, s;
  }
}
function L(r, e, t = r, s) {
  if (e === k) return e;
  let i = s !== void 0 ? t._$Co?.[s] : t._$Cl;
  const n = N(e) ? void 0 : e._$litDirective$;
  return i?.constructor !== n && (i?._$AO?.(!1), n === void 0 ? i = void 0 : (i = new n(r), i._$AT(r, t, s)), s !== void 0 ? (t._$Co ??= [])[s] = i : t._$Cl = i), i !== void 0 && (e = L(r, i._$AS(r, e.values), i, s)), e;
}
class Te {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: s } = this._$AD, i = (e?.creationScope ?? A).importNode(t, !0);
    x.currentNode = i;
    let n = x.nextNode(), o = 0, a = 0, l = s[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let d;
        l.type === 2 ? d = new U(n, n.nextSibling, this, e) : l.type === 1 ? d = new l.ctor(n, l.name, l.strings, this, e) : l.type === 6 && (d = new Ve(n, this, e)), this._$AV.push(d), l = s[++a];
      }
      o !== l?.index && (n = x.nextNode(), o++);
    }
    return x.currentNode = A, i;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class U {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, s, i) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = i, this._$Cv = i?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = L(this, e, t), N(e) ? e === h || e == null || e === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : e !== this._$AH && e !== k && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ue(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== h && N(this._$AH) ? this._$AA.nextSibling.data = e : this.T(A.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: s } = e, i = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = O.createElement(we(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === i) this._$AH.p(t);
    else {
      const n = new Te(i, this), o = n.u(this.options);
      n.p(t), this.T(o), this._$AH = n;
    }
  }
  _$AC(e) {
    let t = he.get(e.strings);
    return t === void 0 && he.set(e.strings, t = new O(e)), t;
  }
  k(e) {
    X(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, i = 0;
    for (const n of e) i === t.length ? t.push(s = new U(this.O(C()), this.O(C()), this, this.options)) : s = t[i], s._$AI(n), i++;
    i < t.length && (this._$AR(s && s._$AB.nextSibling, i), t.length = i);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const s = ne(e).nextSibling;
      ne(e).remove(), e = s;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class D {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, s, i, n) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = h;
  }
  _$AI(e, t = this, s, i) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) e = L(this, e, t, 0), o = !N(e) || e !== this._$AH && e !== k, o && (this._$AH = e);
    else {
      const a = e;
      let l, d;
      for (e = n[0], l = 0; l < n.length - 1; l++) d = L(this, a[s + l], t, l), d === k && (d = this._$AH[l]), o ||= !N(d) || d !== this._$AH[l], d === h ? e = h : e !== h && (e += (d ?? "") + n[l + 1]), this._$AH[l] = d;
    }
    o && !i && this.j(e);
  }
  j(e) {
    e === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class He extends D {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === h ? void 0 : e;
  }
}
class We extends D {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== h);
  }
}
class Ie extends D {
  constructor(e, t, s, i, n) {
    super(e, t, s, i, n), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = L(this, e, t, 0) ?? h) === k) return;
    const s = this._$AH, i = e === h && s !== h || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, n = e !== h && (s === h || i);
    i && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Ve {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    L(this, e);
  }
}
const De = Y.litHtmlPolyfillSupport;
De?.(O, U), (Y.litHtmlVersions ??= []).push("3.3.3");
const je = (r, e, t) => {
  const s = t?.renderBefore ?? e;
  let i = s._$litPart$;
  if (i === void 0) {
    const n = t?.renderBefore ?? null;
    s._$litPart$ = i = new U(e.insertBefore(C(), n), n, void 0, t ?? {});
  }
  return i._$AI(r), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Q = globalThis;
class M extends E {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = je(t, this.renderRoot, this.renderOptions);
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
M._$litElement$ = !0, M.finalized = !0, Q.litElementHydrateSupport?.({ LitElement: M });
const Fe = Q.litElementPolyfillSupport;
Fe?.({ LitElement: M });
(Q.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ge = { attribute: !0, type: String, converter: H, reflect: !1, hasChanged: Z }, qe = (r = Ge, e, t) => {
  const { kind: s, metadata: i } = t;
  let n = globalThis.litPropertyMetadata.get(i);
  if (n === void 0 && globalThis.litPropertyMetadata.set(i, n = /* @__PURE__ */ new Map()), s === "setter" && ((r = Object.create(r)).wrapped = !0), n.set(t.name, r), s === "accessor") {
    const { name: o } = t;
    return { set(a) {
      const l = e.get.call(this);
      e.set.call(this, a), this.requestUpdate(o, l, r, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(o, void 0, r, a), a;
    } };
  }
  if (s === "setter") {
    const { name: o } = t;
    return function(a) {
      const l = this[o];
      e.call(this, a), this.requestUpdate(o, l, r, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function j(r) {
  return (e, t) => typeof t == "object" ? qe(r, e, t) : ((s, i, n) => {
    const o = i.hasOwnProperty(n);
    return i.constructor.createProperty(n, s), o ? Object.getOwnPropertyDescriptor(i, n) : void 0;
  })(r, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function b(r) {
  return j({ ...r, state: !0, attribute: !1 });
}
const Ke = { W: 1, kW: 1e3, MW: 1e6, mW: 1e-3 }, Je = { Wh: 1e-3, kWh: 1, MWh: 1e3 };
function B(r) {
  if (!r) return null;
  const e = parseFloat(r.state);
  return Number.isFinite(e) ? e : null;
}
function m(r) {
  const e = B(r);
  if (e === null) return null;
  const t = r.attributes.unit_of_measurement ?? "W";
  return e * (Ke[t] ?? 1);
}
function $t(r) {
  const e = B(r);
  if (e === null) return null;
  const t = r.attributes.unit_of_measurement ?? "kWh";
  return e * (Je[t] ?? 1);
}
function S(r, e = "de") {
  return r === null ? "–" : Math.abs(r) < 1e3 ? `${Math.round(r).toLocaleString(e)} W` : `${(r / 1e3).toLocaleString(e, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kW`;
}
function vt(r, e = "de") {
  return r === null ? "–" : `${r.toLocaleString(e, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kWh`;
}
function yt(r, e = "de") {
  return r === null ? "–" : `${Math.round(r).toLocaleString(e)} %`;
}
function wt(r, e) {
  return +(6 - 5 * Math.min(Math.abs(r) / Math.max(e, 1), 1)).toFixed(2);
}
function xt(r, e) {
  return r === null ? 1 : +(1 + 3 * Math.min(Math.abs(r) / Math.max(e, 1), 1)).toFixed(2);
}
function At(r, e = 9) {
  return r.length > e ? r.slice(0, e - 1) + "…" : r;
}
function Ze(r) {
  const e = B(r);
  if (e === null) return null;
  const t = String(r.attributes.unit_of_measurement ?? "").toLowerCase();
  return t.includes("ct") || t.includes("cent") ? e : e * 100;
}
function Ye(r, e = "de") {
  return r === null ? "" : `${r.toLocaleString(e, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ct/kWh`;
}
const Xe = ["W", "kW", "MW", "mW"];
function pe(r) {
  if (!r) return "Sensor nicht gefunden";
  const e = r.attributes.unit_of_measurement;
  return e && !Xe.includes(e) ? `Einheit „${e}“ ist keine Leistung (W/kW)` : null;
}
function ue(r, e) {
  if (r === null) return "kein Wert";
  const t = e ? -r : r;
  return Math.abs(t) < 5 ? "ruht" : t > 0 ? "lädt" : "entlädt";
}
function _e(r, e) {
  if (r === null) return "kein Wert";
  const t = e ? -r : r;
  return Math.abs(t) < 5 ? "ausgeglichen" : t > 0 ? "Bezug" : "Einspeisung";
}
const Qe = 44, et = 290;
function St(r) {
  if (r <= 0) return [];
  const e = [[230], [195, 275], [160, 228, 296], [140, 192, 244, 296], [136, 184, 232, 280, 328]][Math.min(r, 5) - 1], t = r <= 3 ? 54 : r === 4 ? 46 : 44;
  return e.map((s, i) => {
    const n = e.length - 1 - i;
    return { cx: s, top: et + (n % 2 === 1 ? Qe : 0), w: t };
  });
}
function Et(r, e = 15, t = 19) {
  const s = r.trim();
  if (s.length <= e) return { lines: [s], small: !1 };
  const i = (l) => l.length > t ? l.slice(0, t - 1) + "…" : l, n = [...s.matchAll(/ /g)].map((l) => l.index), o = n.filter((l) => l <= t && s.length - l - 1 <= t), a = o.length ? o : n.filter((l) => l <= t);
  if (a.length) {
    const l = s.length / 2, d = a.reduce((p, u) => Math.abs(u - l) < Math.abs(p - l) ? u : p);
    return { lines: [s.slice(0, d), i(s.slice(d + 1))], small: !0 };
  }
  return { lines: [s.slice(0, t), i(s.slice(t))], small: !0 };
}
const tt = 4 / 3;
function kt(r, e) {
  const t = Math.min(Math.abs(r) / Math.max(e, 1), 1);
  return +((1.6 + 3.4 * Math.sqrt(t)) * tt).toFixed(2);
}
function Lt(r) {
  const e = r.trim().split(/\s+/);
  let t = 0, s = 0, i = 0;
  for (let n = 0; n < e.length; n++) {
    const o = e[n];
    if (o === "M")
      t = +e[++n], s = +e[++n];
    else if (o === "H") {
      const a = +e[++n];
      i += Math.abs(a - t), t = a;
    } else if (o === "V") {
      const a = +e[++n];
      i += Math.abs(a - s), s = a;
    }
  }
  return i;
}
var st = Object.defineProperty, f = (r, e, t, s) => {
  for (var i = void 0, n = r.length - 1, o; n >= 0; n--)
    (o = r[n]) && (i = o(e, t, i) || i);
  return i && st(e, t, i), i;
};
const ge = [
  ["solar_today", "PV-Ertrag heute"],
  ["solar_forecast_remaining", "PV-Prognose Rest heute"],
  ["grid_price", "Strompreis Bezug"],
  ["grid_import_today", "Bezug heute"],
  ["grid_export_today", "Einspeisung heute"],
  ["home_power", "Hausverbrauch gemessen"],
  ["wallbox_power", "Wallbox"],
  ["wallbox_soc", "Ladestand Auto"]
], G = 5, fe = 2, _ = { entity: { domain: "sensor" } }, I = { entity: { domain: "sensor", multiple: !0, reorder: !0 } }, it = [
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
], rt = [
  { name: "solar_strings", selector: I },
  { name: "solar_today", selector: _ },
  { name: "solar_forecast_remaining", selector: _ }
], xe = (r) => ({
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
function nt(r, e = !0) {
  const t = r.mode === "split" ? [
    { name: "charge_power", selector: _ },
    { name: "discharge_power", selector: _ }
  ] : [
    { name: "power", selector: _ },
    { name: "invert", selector: { boolean: {} } }
  ];
  return [
    { name: "name", selector: { text: {} } },
    xe("mode"),
    ...t,
    { name: "soc", selector: _ },
    { name: "capacity_kwh", selector: { number: { min: 0, max: 200, step: 0.1, mode: "box", unit_of_measurement: "kWh" } } },
    ...e ? [{ name: "backup_loads", selector: I }] : []
  ];
}
function ot(r) {
  const e = r.grid_mode === "split" ? [
    { name: "grid_import_power", selector: _ },
    { name: "grid_export_power", selector: _ }
  ] : [
    { name: "grid_power", selector: _ },
    { name: "grid_invert", selector: { boolean: {} } }
  ];
  return [xe("grid_mode"), ...e, ...lt];
}
const at = [
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
], lt = [
  { name: "grid_price", selector: _ },
  {
    name: "grid_export_price_fixed",
    selector: { number: { min: 0, max: 100, step: 0.01, mode: "box", unit_of_measurement: "ct/kWh" } }
  },
  { name: "grid_export_price", selector: _ },
  { name: "grid_import_today", selector: _ },
  { name: "grid_export_today", selector: _ }
], dt = [
  { name: "fixed_loads", selector: I },
  { name: "flexible_loads", selector: I },
  { name: "home_power", selector: _ }
], ct = [
  { name: "wallbox_name", selector: { text: {} } },
  { name: "wallbox_power", selector: _ },
  { name: "wallbox_flexible", selector: { boolean: {} } },
  { name: "wallbox_soc", selector: _ }
], ht = {
  wallbox_name: "Name",
  wallbox_power: "Ladeleistung",
  wallbox_flexible: "Steuerbar (zählt zu den steuerbaren Verbrauchern)",
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
  fixed_loads: "Nicht steuerbare Verbraucher",
  flexible_loads: "Steuerbare Verbraucher",
  home_power: "Hausverbrauch gemessen (optional)"
}, pt = {
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
async function ut() {
  if (customElements.get("ha-form") && customElements.get("ha-entity-picker")) return;
  const r = await window.loadCardHelpers();
  for (const e of ["tile", "entities"])
    await (await r.createCardElement({ type: e, entity: "sun.sun", entities: [] })).constructor.getConfigElement?.();
}
const q = (r) => JSON.parse(JSON.stringify(r ?? {}));
function _t(r) {
  const e = r;
  return e === 3 || typeof e == "object" && e?.code === 3 ? "Verbindung zu Home Assistant unterbrochen – bitte erneut speichern." : typeof e == "object" && e && typeof e.message == "string" ? e.message : typeof r == "string" ? r : "Speichern fehlgeschlagen – bitte erneut versuchen.";
}
const gt = "energiefluss-updated", ee = class ee extends M {
  constructor() {
    super(...arguments), this.compact = !1, this._ready = !1, this._title = "", this._draft = {}, this._saved = "", this._saving = !1, this._computed = [], this._detecting = !1;
  }
  async firstUpdated() {
    await ut(), this._ready = !0;
  }
  updated(e) {
    (e.has("entryId") || e.has("hass")) && this.hass && this.entryId && this._loadedFor !== this.entryId && (this._loadedFor = this.entryId, this._load());
  }
  async _load() {
    const e = await this.hass.callWS({
      type: "energiefluss/get_options",
      entry_id: this.entryId
    });
    this._computed = e.computed ?? [], this._title = e.title, this._draft = q(e.options), this._saved = this._snapshot(), this._message = void 0;
  }
  _snapshot() {
    return JSON.stringify({ t: this._title, o: this._draft });
  }
  get dirty() {
    return this._snapshot() !== this._saved;
  }
  // -- editing --------------------------------------------------------------------
  _onForm(e, t) {
    e.stopPropagation();
    const s = e.detail.value, i = { ...this._draft };
    for (const n of t) {
      if (n === "title") continue;
      const o = s[n];
      o === void 0 || o === "" || Array.isArray(o) && o.length === 0 ? delete i[n] : i[n] = o;
    }
    "title" in s && (this._title = String(s.title ?? "")), this._draft = i;
  }
  _onBattery(e, t) {
    t.stopPropagation();
    const s = [...this._draft.batteries ?? []];
    for (; s.length <= e; ) s.push({});
    s[e] = t.detail.value, this._draft = { ...this._draft, batteries: s };
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
  _batteryUses(e) {
    return [e.power, e.charge_power, e.discharge_power].filter((t) => !!t);
  }
  _hasBattery(e) {
    const t = this._batteryUses(e);
    return (this._draft.batteries ?? []).some((s) => this._batteryUses(s).some((i) => t.includes(i)));
  }
  _gridSet() {
    const e = this._draft;
    return !!(e.grid_power || e.grid_import_power || e.grid_export_power);
  }
  _apply(e) {
    this._draft = { ...this._draft, ...e };
  }
  _applyBattery(e) {
    this._hasBattery(e) || (this._draft = { ...this._draft, batteries: [...this._draft.batteries ?? [], { ...e }] });
  }
  _applyLoad(e, t) {
    const s = [...this._draft[t] ?? []];
    s.includes(e) || s.push(e), this._draft = { ...this._draft, [t]: s };
  }
  /** Fill every empty field from the suggestions; never overwrites anything. */
  _applyAllEmpty() {
    const e = this._suggestions;
    if (!e) return;
    const t = this._draft;
    e.solar_strings && !(t.solar_strings ?? []).length && this._apply({ solar_strings: e.solar_strings.value }), e.grid && !this._gridSet() && this._apply(e.grid.value);
    for (const [s] of ge) {
      const i = e[s];
      i && !this._draft[s] && this._apply({ [s]: i.value });
    }
    for (const s of e.batteries ?? []) this._applyBattery(s.value);
  }
  _addBattery() {
    const e = [...this._draft.batteries ?? []];
    e.length >= G || (e.push({ mode: "combined" }), this._draft = { ...this._draft, batteries: e });
  }
  _removeBattery(e) {
    const t = [...this._draft.batteries ?? []];
    t.splice(e, 1), this._draft = { ...this._draft, batteries: t };
  }
  /** Drop values that belong to the mode not selected (kept while editing). */
  _cleaned() {
    const e = q(this._draft);
    return e.batteries = (e.batteries ?? []).map((t) => {
      const s = { ...t };
      return s.mode === "split" ? (delete s.power, delete s.invert) : (delete s.charge_power, delete s.discharge_power), s;
    }).filter((t) => t.power || t.soc || t.charge_power || t.discharge_power), e.grid_mode === "split" ? (delete e.grid_power, delete e.grid_invert) : (delete e.grid_import_power, delete e.grid_export_power), e;
  }
  async save() {
    if (!(!this.hass || !this.entryId)) {
      this._saving = !0, this._message = void 0;
      try {
        const e = await this.hass.callWS({
          type: "energiefluss/save_options",
          entry_id: this.entryId,
          title: this._title,
          options: this._cleaned()
        });
        this._title = e.title, this._draft = q(e.options), this._saved = this._snapshot(), await new Promise((s) => setTimeout(s, 1200)), window.dispatchEvent(new CustomEvent(gt, { detail: { entry_id: this.entryId } }));
        const t = await this.hass.callWS({
          type: "energiefluss/get_options",
          entry_id: this.entryId
        });
        this._computed = t.computed ?? [], this._message = { kind: "ok", text: "Anlage gespeichert." };
      } catch (e) {
        this._message = { kind: "error", text: _t(e) };
      } finally {
        this._saving = !1;
      }
    }
  }
  discard() {
    this._load();
  }
  // -- live hints -------------------------------------------------------------------
  _s(e) {
    return e ? this.hass?.states[e] : void 0;
  }
  get _loc() {
    return this.hass?.locale?.language ?? "de";
  }
  _name(e) {
    return this._s(e)?.attributes.friendly_name ?? e;
  }
  _powerLine(e, t, s) {
    if (!t) return h;
    const i = this._s(t), n = pe(i);
    return c`<div class="row">
        <span>${e}</span>
        <span>${S(m(i), this._loc)}${s ? c` → <b>${s}</b>` : h}</span>
      </div>
      ${n ? c`<div class="warn">⚠ ${n}</div>` : h}`;
  }
  _solarLive() {
    const e = this._draft.solar_strings ?? [];
    if (!e.length)
      return c`<div class="live">
        ${this._calcNote(
        this._computed.includes("solar") ? "PV-Leistung wird aus der Energiebilanz berechnet." : "Ohne PV-Sensor: wird berechnet, wenn Netz und Hausverbrauch gemessen werden."
      )}
      </div>`;
    const t = e.reduce((s, i) => s + (m(this._s(i)) ?? 0), 0);
    return c`<div class="live">
      ${e.map((s) => this._powerLine(this._name(s), s))}
      <div class="row total"><span>Summe</span><span>${S(t, this._loc)}</span></div>
      ${this._draft.solar_today ? h : this._calcNote("PV-Ertrag heute zählt die Integration selbst.")}
    </div>`;
  }
  _calcNote(e) {
    return c`<div class="calc">≈ ${e}</div>`;
  }
  _batteryLive(e, t) {
    const s = e.mode === "split", i = s ? !!(e.charge_power || e.discharge_power) : !!e.power, n = B(this._s(e.soc));
    let o = h;
    if (s && i) {
      const l = m(this._s(e.charge_power)), d = m(this._s(e.discharge_power)), p = l === null && d === null ? null : Math.abs(l ?? 0) - Math.abs(d ?? 0);
      o = c`${this._powerLine("Laden", e.charge_power)}${this._powerLine("Entladen", e.discharge_power)}
        <div class="row total"><span>Ergebnis</span>
          <span>${S(p === null ? null : Math.abs(p), this._loc)} → <b>${ue(p, !1)}</b></span>
        </div>`;
    } else i && (o = this._powerLine("Leistung", e.power, ue(m(this._s(e.power)), !!e.invert)));
    const a = this._computed.includes(`battery_${t + 1}`);
    return !i && !e.soc && !(e.backup_loads ?? []).length ? h : c`<div class="live">
      ${o}
      ${i ? h : this._calcNote(
      a ? "Leistung wird aus der Energiebilanz berechnet." : "Ohne Leistungssensor: wird nur berechnet, wenn der Hausverbrauch gemessen wird und dies die einzige Batterie ohne Sensor ist."
    )}
      ${e.soc ? c`<div class="row"><span>Ladestand</span><span>${n === null ? "–" : `${Math.round(n)} %`}</span></div>` : h}
      ${(e.backup_loads ?? []).length ? c`<div class="row">
            <span>Notstrom-Abgang: ${e.backup_loads.length} Geräte</span>
            <span>${S(e.backup_loads.reduce((l, d) => l + (m(this._s(d)) ?? 0), 0), this._loc)}</span>
          </div>` : h}
    </div>`;
  }
  _gridLive() {
    const e = this._draft, t = e.grid_mode === "split", s = t ? !!(e.grid_import_power || e.grid_export_power) : !!e.grid_power;
    let i = h;
    if (t && s) {
      const a = m(this._s(e.grid_import_power)), l = m(this._s(e.grid_export_power)), d = a === null && l === null ? null : Math.abs(a ?? 0) - Math.abs(l ?? 0);
      i = c`${this._powerLine("Bezug", e.grid_import_power)}${this._powerLine("Einspeisung", e.grid_export_power)}
        <div class="row total"><span>Ergebnis</span>
          <span>${S(d === null ? null : Math.abs(d), this._loc)} → <b>${_e(d, !1)}</b></span>
        </div>`;
    } else s && (i = this._powerLine("Netz", e.grid_power, _e(m(this._s(e.grid_power)), !!e.grid_invert)));
    let n = h;
    s || (n = this._calcNote(
      e.home_power ? "Netzleistung wird aus der Energiebilanz berechnet (gemessener Hausverbrauch)." : "Ohne Netzsensor fehlt ein Wert der Bilanz – bitte Netzsensor wählen oder Hausverbrauch messen."
    ));
    const o = !e.grid_import_today || !e.grid_export_today ? this._calcNote("Fehlende Tageswerte für Bezug/Einspeisung zählt die Integration selbst.") : h;
    return c`<div class="live">
      ${i}${n}
      ${e.grid_price ? c`<div class="row">
            <span>Preis Bezug</span><span>${Ye(Ze(this._s(e.grid_price)), this._loc) || "–"}</span>
          </div>` : h}
      ${o}
    </div>`;
  }
  _wallboxLive() {
    const e = this._draft;
    if (!e.wallbox_power) return h;
    const t = B(this._s(e.wallbox_soc));
    return c`<div class="live">
      ${this._powerLine("Wallbox", e.wallbox_power, e.wallbox_flexible ?? !0 ? "steuerbar" : "nicht steuerbar")}
      ${e.wallbox_soc ? c`<div class="row"><span>Auto</span><span>${t === null ? "–" : `${Math.round(t)} %`}</span></div>` : h}
    </div>`;
  }
  /** All configured loads that can take part in a 'contained in' link. */
  _linkableLoads() {
    const e = this._draft;
    return [
      .../* @__PURE__ */ new Set([
        ...e.fixed_loads ?? [],
        ...e.flexible_loads ?? [],
        ...(e.batteries ?? []).flatMap((t) => t.backup_loads ?? [])
      ])
    ];
  }
  _setParents(e) {
    const t = { ...this._draft };
    e.length ? t.load_parents = Object.fromEntries(e) : delete t.load_parents, this._draft = t;
  }
  /** Editor for "<load> is contained in <load>" (counted only once). */
  _parentsEditor() {
    const e = this._linkableLoads(), t = Object.entries(this._draft.load_parents ?? {}), s = (o, a, l) => {
      const d = [...t];
      d[o] = [a, l], this._setParents(d);
    }, i = () => {
      const o = new Set(t.flatMap(([d, p]) => [d, p])), a = e.find((d) => !o.has(d)) ?? e[0], l = e.find((d) => d !== a && !t.some(([p]) => p === d)) ?? "";
      a && l && this._setParents([...t, [a, l]]);
    }, n = (o, a) => c`<option value=${o} ?selected=${o === a}>${this._name(o)}</option>`;
    return c`<div class="pairs">
      <h3>Enthaltene Verbraucher</h3>
      <p class="hint">
        Ist ein Gerät schon im Wert eines anderen enthalten (z. B. Wasserkocher im Unterzähler „Neubau“), wird es
        nur einmal gezählt und auf der Karte eingerückt darunter angezeigt.
      </p>
      ${t.map(
      ([o, a], l) => c`<div class="pair">
          <select @change=${(d) => s(l, d.target.value, a)}>
            ${e.map((d) => n(d, o))}
          </select>
          <span>ist enthalten in</span>
          <select @change=${(d) => s(l, o, d.target.value)}>
            ${e.filter((d) => d !== o).map((d) => n(d, a))}
          </select>
          <button class="link" @click=${() => this._setParents(t.filter((d, p) => p !== l))}>Entfernen</button>
        </div>
        ${o === a || t.some(([d]) => d === a) ? c`<div class="warn">⚠ Ungültig: ein Gerät kann nicht in sich selbst oder in einem enthaltenen Gerät stecken.</div>` : h}`
    )}
      <button class="add" ?disabled=${e.length < 2} @click=${i}>+ Enthaltenen Verbraucher hinzufügen</button>
    </div>`;
  }
  _loadsLive() {
    const e = [
      ["Nicht steuerbar", this._draft.fixed_loads ?? []],
      ["Steuerbar", this._draft.flexible_loads ?? []]
    ];
    if (!e.some(([, i]) => i.length)) return h;
    const t = [
      ...e.flatMap(([, i]) => i),
      ...(this._draft.batteries ?? []).flatMap((i) => i.backup_loads ?? []),
      ...this._draft.wallbox_power ? [this._draft.wallbox_power] : []
    ], s = [...new Set(t.filter((i, n) => t.indexOf(i) !== n))];
    return c`<div class="live">
      ${e.map(([i, n]) => {
      const o = this._draft.load_parents ?? {}, a = n.filter((d) => !(d in o)).reduce((d, p) => d + (m(this._s(p)) ?? 0), 0), l = n.map((d) => [d, pe(this._s(d))]).filter(([, d]) => d);
      return c`<div class="row"><span>${i}: ${n.length} Geräte</span><span>${S(a, this._loc)}</span></div>
          ${l.map(([d, p]) => c`<div class="warn">⚠ ${this._name(d)}: ${p}</div>`)}`;
    })}
      ${s.length ? c`<div class="warn">⚠ In mehreren Gruppen: ${s.map((i) => this._name(i)).join(", ")}</div>` : h}
    </div>`;
  }
  _suggestRow(e, t, s, i, n, o = "Übernehmen") {
    return c`<div class="sg-row">
      <div class="sg-text"><b>${e}</b><span>${t}</span><small>${s}</small></div>
      ${i ? c`<span class="sg-done">✓ gesetzt</span>` : c`<button @click=${n}>${o}</button>`}
    </div>`;
  }
  _suggestionsPanel() {
    const e = this._suggestions;
    if (!e) return h;
    const t = this._draft, s = (a) => a.map((l) => this._name(l)).join(", "), i = [];
    if (e.solar_strings) {
      const a = e.solar_strings.value, l = JSON.stringify(t.solar_strings ?? []) === JSON.stringify(a);
      i.push(this._suggestRow("PV-Leistung", s(a), e.solar_strings.source, l, () => this._apply({ solar_strings: a })));
    }
    if (e.grid) {
      const a = e.grid.value, l = [a.grid_power, a.grid_import_power, a.grid_export_power].filter((u) => !!u), d = l.every((u) => [t.grid_power, t.grid_import_power, t.grid_export_power].includes(u)), p = a.grid_mode === "split" ? `Bezug: ${this._name(a.grid_import_power)} · Einspeisung: ${this._name(a.grid_export_power)}` : s(l);
      i.push(this._suggestRow("Netz", p, e.grid.source, d, () => this._apply(a)));
    }
    for (const [a, l] of ge) {
      const d = e[a];
      d && i.push(
        this._suggestRow(
          l,
          this._name(d.value),
          d.source,
          t[a] === d.value,
          () => this._apply({ [a]: d.value })
        )
      );
    }
    for (const a of e.batteries ?? []) {
      const l = a.value, d = l.mode === "split" ? "Laden + Entladen" : "Leistung";
      i.push(
        this._suggestRow(
          "Batterie",
          `${l.name ?? ""} (${d}${l.soc ? " + Ladestand" : ""})`,
          a.source,
          this._hasBattery(l),
          () => this._applyBattery(l),
          "Hinzufügen"
        )
      );
    }
    const n = /* @__PURE__ */ new Set([
      ...t.fixed_loads ?? [],
      ...t.flexible_loads ?? [],
      ...t.wallbox_power ? [t.wallbox_power] : [],
      ...(t.batteries ?? []).flatMap((a) => a.backup_loads ?? [])
    ]), o = (e.loads ?? []).filter((a) => !n.has(a.entity));
    return c`<div class="suggest">
      <div class="sg-head">
        <h2>Vorschläge</h2>
        <div>
          <button class="primary" @click=${this._applyAllEmpty}>Alle leeren Felder füllen</button>
          <button @click=${() => this._suggestions = void 0}>Schließen</button>
        </div>
      </div>
      <p class="hint">Erkannt an Integration, Gerät, Einheit und Namen. Übernommenes landet im Entwurf – erst „Anlage speichern“ übernimmt es.</p>
      ${i.length ? i : c`<p class="hint">Keine passenden Sensoren gefunden.</p>`}
      ${o.length ? c`<h3>Mögliche Verbraucher</h3>
            ${o.map(
      (a) => c`<div class="sg-row">
                <div class="sg-text"><span>${a.name}</span><small>${a.source}</small></div>
                <div class="sg-btns">
                  <button @click=${() => this._applyLoad(a.entity, "fixed_loads")}>nicht steuerbar</button>
                  <button @click=${() => this._applyLoad(a.entity, "flexible_loads")}>steuerbar</button>
                </div>
              </div>`
    )}` : h}
    </div>`;
  }
  // -- render ---------------------------------------------------------------------------
  _form(e, t, s, i = {}, n = {}) {
    return c`<ha-form
      .hass=${this.hass}
      .data=${t}
      .schema=${e}
      .computeLabel=${(o) => i[o.name] ?? ht[o.name] ?? o.name}
      .computeHelper=${(o) => n[o.name] ?? pt[o.name]}
      @value-changed=${s}
    ></ha-form>`;
  }
  _section(e, t, s) {
    const i = c`<div class="section">
      <h2>${e}</h2>
      ${s ? c`<p class="hint">${s}</p>` : h}
      ${t}
    </div>`;
    return this.compact ? c`<div class="plain">${i}</div>` : c`<ha-card>${i}</ha-card>`;
  }
  render() {
    if (!this._ready || !this._loadedFor) return c`<div class="hint">Lade …</div>`;
    const e = this._draft, t = e.batteries ?? [], s = this._saving, i = this._message ? c`<span class="msg ${this._message.kind}">${this._message.text}</span>` : c`<span class="msg">${this.dirty ? "Ungespeicherte Änderungen an der Anlage" : ""}</span>`;
    return c`
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
        it,
        { title: this._title, energy_period: e.energy_period ?? "midnight" },
        (n) => this._onForm(n, ["title", "energy_period"])
      )
    )}
      ${this._section(
      "Solar",
      c`${this._form(
        rt,
        e,
        (n) => this._onForm(n, ["solar_strings", "solar_today", "solar_forecast_remaining"])
      )}${this._solarLive()}`
    )}
      ${this._section(
      "Batterien",
      c`${t.map((n, o) => {
        const a = { mode: "combined", ...n };
        return c`<div class="sub">
            <div class="subhead">
              <h3>Batterie ${o + 1}${n.name ? ` – ${n.name}` : ""}</h3>
              <button class="link" @click=${() => this._removeBattery(o)}>Entfernen</button>
            </div>
            ${this._form(
          nt(
            n,
            !!(n.backup_loads ?? []).length || t.filter((l) => (l.backup_loads ?? []).length).length < fe
          ),
          a,
          (l) => this._onBattery(o, l),
          { backup_loads: "Notstrom-Abgang: Verbraucher an dieser Batterie" },
          { backup_loads: "Geräte am eigenen Ausgang der Batterie (z. B. Zendure, Ecoflow). Zählen zum Notstrom." }
        )}
            ${this._batteryLive(n, o)}
          </div>`;
      })}
        ${t.length < G ? c`<button class="add" @click=${this._addBattery}>+ Batterie hinzufügen</button>` : h}`,
      `Ein Sensor mit + und − (positiv = lädt, sonst Schalter setzen) oder zwei getrennte Sensoren für Laden und Entladen. Bis zu ${G} Batterien, davon höchstens ${fe} mit Notstrom-Abgang.`
    )}
      ${this._section(
      "Netz",
      c`${this._form(
        ot(e),
        { grid_mode: "combined", ...e },
        (n) => this._onForm(n, at)
      )}${this._gridLive()}`,
      "Ein Sensor mit + und − (positiv = Bezug) oder getrennt, z. B. Tibber Pulse: „Leistung“ und „Leistung Produktion“."
    )}
      ${this._section(
      "Wallbox / E-Auto",
      c`${this._form(
        ct,
        { wallbox_flexible: !0, ...e },
        (n) => this._onForm(n, ["wallbox_name", "wallbox_power", "wallbox_soc", "wallbox_flexible"])
      )}${this._wallboxLive()}`,
      "Optional. Hängt am Wechselrichter und zählt zum Hausverbrauch; standardmäßig als steuerbarer Verbraucher."
    )}
      ${this._section(
      "Verbraucher",
      c`${this._form(
        dt,
        e,
        (n) => this._onForm(n, ["fixed_loads", "flexible_loads", "home_power"])
      )}${this._loadsLive()}${this._parentsEditor()}`,
      "Alle Verbraucher zählen zum Haus. Notstrom-Geräte trägst du direkt bei der jeweiligen Batterie ein."
    )}
    `;
  }
};
ee.styles = Se`
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
let g = ee;
f([
  j({ attribute: !1 })
], g.prototype, "hass");
f([
  j({ attribute: !1 })
], g.prototype, "entryId");
f([
  j({ type: Boolean })
], g.prototype, "compact");
f([
  b()
], g.prototype, "_ready");
f([
  b()
], g.prototype, "_loadedFor");
f([
  b()
], g.prototype, "_title");
f([
  b()
], g.prototype, "_draft");
f([
  b()
], g.prototype, "_saved");
f([
  b()
], g.prototype, "_saving");
f([
  b()
], g.prototype, "_message");
f([
  b()
], g.prototype, "_computed");
f([
  b()
], g.prototype, "_suggestions");
f([
  b()
], g.prototype, "_detecting");
customElements.get("energiefluss-editor") || customElements.define("energiefluss-editor", g);
export {
  h as A,
  gt as U,
  Se as a,
  c as b,
  B as c,
  bt as d,
  ut as e,
  kt as f,
  wt as g,
  S as h,
  M as i,
  vt as j,
  $t as k,
  xt as l,
  St as m,
  j as n,
  yt as o,
  Lt as p,
  Et as q,
  b as r,
  At as s,
  Ze as t,
  Ye as u,
  m as w
};
