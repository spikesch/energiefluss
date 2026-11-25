/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H = globalThis, q = H.ShadowRoot && (H.ShadyCSS === void 0 || H.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, J = Symbol(), Q = /* @__PURE__ */ new WeakMap();
let pt = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== J) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (q && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = Q.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && Q.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const vt = (i) => new pt(typeof i == "string" ? i : i + "", void 0, J), yt = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, r, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + i[n + 1], i[0]);
  return new pt(e, i, J);
}, bt = (i, t) => {
  if (q) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), r = H.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = e.cssText, i.appendChild(s);
  }
}, tt = q ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return vt(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: At, defineProperty: St, getOwnPropertyDescriptor: wt, getOwnPropertyNames: xt, getOwnPropertySymbols: Et, getPrototypeOf: Pt } = Object, W = globalThis, et = W.trustedTypes, Ct = et ? et.emptyScript : "", Mt = W.reactiveElementPolyfillSupport, M = (i, t) => i, z = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? Ct : null;
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
} }, G = (i, t) => !At(i, t), st = { attribute: !0, type: String, converter: z, reflect: !1, useDefault: !1, hasChanged: G };
Symbol.metadata ??= Symbol("metadata"), W.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let w = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = st) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(t, s, e);
      r !== void 0 && St(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: r, set: n } = wt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: r, set(o) {
      const h = r?.call(this);
      n?.call(this, o), this.requestUpdate(t, h, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? st;
  }
  static _$Ei() {
    if (this.hasOwnProperty(M("elementProperties"))) return;
    const t = Pt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(M("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(M("properties"))) {
      const e = this.properties, s = [...xt(e), ...Et(e)];
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
      for (const r of s) e.unshift(tt(r));
    } else t !== void 0 && e.push(tt(t));
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
    return bt(t, this.constructor.elementStyles), t;
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
      const n = (s.converter?.toAttribute !== void 0 ? s.converter : z).toAttribute(e, s.type);
      this._$Em = t, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, r = s._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const n = s.getPropertyOptions(r), o = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : z;
      this._$Em = r;
      const h = o.fromAttribute(e, n.type);
      this[r] = h ?? this._$Ej?.get(r) ?? h, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, r = !1, n) {
    if (t !== void 0) {
      const o = this.constructor;
      if (r === !1 && (n = this[t]), s ??= o.getPropertyOptions(t), !((s.hasChanged ?? G)(n, e) || s.useDefault && s.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, s)))) return;
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
        const { wrapped: o } = n, h = this[r];
        o !== !0 || this._$AL.has(r) || h === void 0 || this.C(r, void 0, n, h);
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
w.elementStyles = [], w.shadowRootOptions = { mode: "open" }, w[M("elementProperties")] = /* @__PURE__ */ new Map(), w[M("finalized")] = /* @__PURE__ */ new Map(), Mt?.({ ReactiveElement: w }), (W.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const K = globalThis, it = (i) => i, R = K.trustedTypes, rt = R ? R.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, _t = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, ft = "?" + v, kt = `<${ft}>`, A = document, O = () => A.createComment(""), U = (i) => i === null || typeof i != "object" && typeof i != "function", Z = Array.isArray, Ot = (i) => Z(i) || typeof i?.[Symbol.iterator] == "function", F = `[ 	
\f\r]`, P = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, nt = /-->/g, ot = />/g, y = RegExp(`>|${F}(?:([^\\s"'>=/]+)(${F}*=${F}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), at = /'/g, ht = /"/g, mt = /^(?:script|style|textarea|title)$/i, gt = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), c = gt(1), he = gt(2), x = Symbol.for("lit-noChange"), l = Symbol.for("lit-nothing"), lt = /* @__PURE__ */ new WeakMap(), b = A.createTreeWalker(A, 129);
function $t(i, t) {
  if (!Z(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return rt !== void 0 ? rt.createHTML(t) : t;
}
const Ut = (i, t) => {
  const e = i.length - 1, s = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = P;
  for (let h = 0; h < e; h++) {
    const a = i[h];
    let u, p, d = -1, g = 0;
    for (; g < a.length && (o.lastIndex = g, p = o.exec(a), p !== null); ) g = o.lastIndex, o === P ? p[1] === "!--" ? o = nt : p[1] !== void 0 ? o = ot : p[2] !== void 0 ? (mt.test(p[2]) && (r = RegExp("</" + p[2], "g")), o = y) : p[3] !== void 0 && (o = y) : o === y ? p[0] === ">" ? (o = r ?? P, d = -1) : p[1] === void 0 ? d = -2 : (d = o.lastIndex - p[2].length, u = p[1], o = p[3] === void 0 ? y : p[3] === '"' ? ht : at) : o === ht || o === at ? o = y : o === nt || o === ot ? o = P : (o = y, r = void 0);
    const $ = o === y && i[h + 1].startsWith("/>") ? " " : "";
    n += o === P ? a + kt : d >= 0 ? (s.push(u), a.slice(0, d) + _t + a.slice(d) + v + $) : a + v + (d === -2 ? h : $);
  }
  return [$t(i, n + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class L {
  constructor({ strings: t, _$litType$: e }, s) {
    let r;
    this.parts = [];
    let n = 0, o = 0;
    const h = t.length - 1, a = this.parts, [u, p] = Ut(t, e);
    if (this.el = L.createElement(u, s), b.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (r = b.nextNode()) !== null && a.length < h; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const d of r.getAttributeNames()) if (d.endsWith(_t)) {
          const g = p[o++], $ = r.getAttribute(d).split(v), T = /([.?@])?(.*)/.exec(g);
          a.push({ type: 1, index: n, name: T[2], strings: $, ctor: T[1] === "." ? Nt : T[1] === "?" ? Tt : T[1] === "@" ? Ht : B }), r.removeAttribute(d);
        } else d.startsWith(v) && (a.push({ type: 6, index: n }), r.removeAttribute(d));
        if (mt.test(r.tagName)) {
          const d = r.textContent.split(v), g = d.length - 1;
          if (g > 0) {
            r.textContent = R ? R.emptyScript : "";
            for (let $ = 0; $ < g; $++) r.append(d[$], O()), b.nextNode(), a.push({ type: 2, index: ++n });
            r.append(d[g], O());
          }
        }
      } else if (r.nodeType === 8) if (r.data === ft) a.push({ type: 2, index: n });
      else {
        let d = -1;
        for (; (d = r.data.indexOf(v, d + 1)) !== -1; ) a.push({ type: 7, index: n }), d += v.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const s = A.createElement("template");
    return s.innerHTML = t, s;
  }
}
function E(i, t, e = i, s) {
  if (t === x) return t;
  let r = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const n = U(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== n && (r?._$AO?.(!1), n === void 0 ? r = void 0 : (r = new n(i), r._$AT(i, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = r : e._$Cl = r), r !== void 0 && (t = E(i, r._$AS(i, t.values), r, s)), t;
}
class Lt {
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
    b.currentNode = r;
    let n = b.nextNode(), o = 0, h = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let u;
        a.type === 2 ? u = new N(n, n.nextSibling, this, t) : a.type === 1 ? u = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (u = new zt(n, this, t)), this._$AV.push(u), a = s[++h];
      }
      o !== a?.index && (n = b.nextNode(), o++);
    }
    return b.currentNode = A, r;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class N {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, r) {
    this.type = 2, this._$AH = l, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    t = E(this, t, e), U(t) ? t === l || t == null || t === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : t !== this._$AH && t !== x && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ot(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== l && U(this._$AH) ? this._$AA.nextSibling.data = t : this.T(A.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, r = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = L.createElement($t(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(e);
    else {
      const n = new Lt(r, this), o = n.u(this.options);
      n.p(e), this.T(o), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = lt.get(t.strings);
    return e === void 0 && lt.set(t.strings, e = new L(t)), e;
  }
  k(t) {
    Z(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, r = 0;
    for (const n of t) r === e.length ? e.push(s = new N(this.O(O()), this.O(O()), this, this.options)) : s = e[r], s._$AI(n), r++;
    r < e.length && (this._$AR(s && s._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = it(t).nextSibling;
      it(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class B {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, r, n) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = l;
  }
  _$AI(t, e = this, s, r) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = E(this, t, e, 0), o = !U(t) || t !== this._$AH && t !== x, o && (this._$AH = t);
    else {
      const h = t;
      let a, u;
      for (t = n[0], a = 0; a < n.length - 1; a++) u = E(this, h[s + a], e, a), u === x && (u = this._$AH[a]), o ||= !U(u) || u !== this._$AH[a], u === l ? t = l : t !== l && (t += (u ?? "") + n[a + 1]), this._$AH[a] = u;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Nt extends B {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === l ? void 0 : t;
  }
}
class Tt extends B {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== l);
  }
}
class Ht extends B {
  constructor(t, e, s, r, n) {
    super(t, e, s, r, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = E(this, t, e, 0) ?? l) === x) return;
    const s = this._$AH, r = t === l && s !== l || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== l && (s === l || r);
    r && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class zt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    E(this, t);
  }
}
const Rt = K.litHtmlPolyfillSupport;
Rt?.(L, N), (K.litHtmlVersions ??= []).push("3.3.3");
const Wt = (i, t, e) => {
  const s = e?.renderBefore ?? t;
  let r = s._$litPart$;
  if (r === void 0) {
    const n = e?.renderBefore ?? null;
    s._$litPart$ = r = new N(t.insertBefore(O(), n), n, void 0, e ?? {});
  }
  return r._$AI(i), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Y = globalThis;
class k extends w {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Wt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return x;
  }
}
k._$litElement$ = !0, k.finalized = !0, Y.litElementHydrateSupport?.({ LitElement: k });
const Bt = Y.litElementPolyfillSupport;
Bt?.({ LitElement: k });
(Y.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Dt = { attribute: !0, type: String, converter: z, reflect: !1, hasChanged: G }, It = (i = Dt, t, e) => {
  const { kind: s, metadata: r } = e;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), s === "setter" && ((i = Object.create(i)).wrapped = !0), n.set(e.name, i), s === "accessor") {
    const { name: o } = e;
    return { set(h) {
      const a = t.get.call(this);
      t.set.call(this, h), this.requestUpdate(o, a, i, !0, h);
    }, init(h) {
      return h !== void 0 && this.C(o, void 0, i, h), h;
    } };
  }
  if (s === "setter") {
    const { name: o } = e;
    return function(h) {
      const a = this[o];
      t.call(this, h), this.requestUpdate(o, a, i, !0, h);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function D(i) {
  return (t, e) => typeof e == "object" ? It(i, t, e) : ((s, r, n) => {
    const o = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, s), o ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(i, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function S(i) {
  return D({ ...i, state: !0, attribute: !1 });
}
const Ft = { W: 1, kW: 1e3, MW: 1e6, mW: 1e-3 }, jt = { Wh: 1e-3, kWh: 1, MWh: 1e3 };
function I(i) {
  if (!i) return null;
  const t = parseFloat(i.state);
  return Number.isFinite(t) ? t : null;
}
function C(i) {
  const t = I(i);
  if (t === null) return null;
  const e = i.attributes.unit_of_measurement ?? "W";
  return t * (Ft[e] ?? 1);
}
function le(i) {
  const t = I(i);
  if (t === null) return null;
  const e = i.attributes.unit_of_measurement ?? "kWh";
  return t * (jt[e] ?? 1);
}
function j(i, t = "de") {
  return i === null ? "–" : Math.abs(i) < 1e3 ? `${Math.round(i).toLocaleString(t)} W` : `${(i / 1e3).toLocaleString(t, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kW`;
}
function ce(i, t = "de") {
  return i === null ? "–" : `${i.toLocaleString(t, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kWh`;
}
function de(i, t = "de") {
  return i === null ? "–" : `${Math.round(i).toLocaleString(t)} %`;
}
function ue(i, t) {
  return +(6 - 5 * Math.min(Math.abs(i) / Math.max(t, 1), 1)).toFixed(2);
}
function pe(i, t) {
  return i === null ? 1 : +(1 + 3 * Math.min(Math.abs(i) / Math.max(t, 1), 1)).toFixed(2);
}
function _e(i, t = 9) {
  return i.length > t ? i.slice(0, t - 1) + "…" : i;
}
function Vt(i) {
  const t = I(i);
  if (t === null) return null;
  const e = String(i.attributes.unit_of_measurement ?? "").toLowerCase();
  return e.includes("ct") || e.includes("cent") ? t : t * 100;
}
function qt(i, t = "de") {
  return i === null ? "" : `${i.toLocaleString(t, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ct/kWh`;
}
const Jt = ["W", "kW", "MW", "mW"];
function ct(i) {
  if (!i) return "Sensor nicht gefunden";
  const t = i.attributes.unit_of_measurement;
  return t && !Jt.includes(t) ? `Einheit „${t}“ ist keine Leistung (W/kW)` : null;
}
function Gt(i, t) {
  if (i === null) return "kein Wert";
  const e = t ? -i : i;
  return Math.abs(e) < 5 ? "ruht" : e > 0 ? "lädt" : "entlädt";
}
function Kt(i, t) {
  if (i === null) return "kein Wert";
  const e = t ? -i : i;
  return Math.abs(e) < 5 ? "ausgeglichen" : e > 0 ? "Bezug" : "Einspeisung";
}
var Zt = Object.defineProperty, m = (i, t, e, s) => {
  for (var r = void 0, n = i.length - 1, o; n >= 0; n--)
    (o = i[n]) && (r = o(t, e, r) || r);
  return r && Zt(t, e, r), r;
};
const Yt = 3, f = { entity: { domain: "sensor" } }, V = { entity: { domain: "sensor", multiple: !0, reorder: !0 } }, Xt = [
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
], Qt = [
  { name: "solar_strings", selector: V },
  { name: "solar_today", selector: f },
  { name: "solar_forecast_remaining", selector: f }
], te = [
  { name: "name", selector: { text: {} } },
  { name: "power", selector: f },
  { name: "invert", selector: { boolean: {} } },
  { name: "soc", selector: f },
  { name: "capacity_kwh", selector: { number: { min: 0, max: 200, step: 0.1, mode: "box", unit_of_measurement: "kWh" } } }
], dt = [
  { name: "grid_power", selector: f },
  { name: "grid_invert", selector: { boolean: {} } },
  { name: "grid_price", selector: f },
  {
    name: "grid_export_price_fixed",
    selector: { number: { min: 0, max: 100, step: 0.01, mode: "box", unit_of_measurement: "ct/kWh" } }
  },
  { name: "grid_export_price", selector: f },
  { name: "grid_import_today", selector: f },
  { name: "grid_export_today", selector: f }
], ee = [
  { name: "fixed_loads", selector: V },
  { name: "flexible_loads", selector: V },
  { name: "home_power", selector: f }
], se = {
  title: "Name der Anlage",
  energy_period: "Tageswerte",
  solar_strings: "PV-Leistung (Strings / Wechselrichter)",
  solar_today: "PV-Ertrag heute",
  solar_forecast_remaining: "Prognose Rest heute",
  name: "Name",
  power: "Leistung",
  invert: "Sensor zählt Laden negativ",
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
}, ie = {
  energy_period: "Ab 0 Uhr setzt um Mitternacht auf null, 24 Stunden ist ein gleitendes Fenster.",
  solar_strings: "Mehrere Sensoren werden addiert. W oder kW.",
  grid_export_price: "Optional statt des festen Werts, falls sich die Vergütung ändert.",
  fixed_loads: "Laufen, wann sie müssen – z. B. Kühlschrank, TV, Server.",
  flexible_loads: "Zeitpunkt frei wählbar – z. B. Waschmaschine, Trockner, Wallbox.",
  home_power: "Leer lassen: wird aus PV, Batterien und Netz berechnet."
};
async function re() {
  if (customElements.get("ha-form") && customElements.get("ha-entity-picker")) return;
  const i = await window.loadCardHelpers();
  for (const t of ["tile", "entities"])
    await (await i.createCardElement({ type: t, entity: "sun.sun", entities: [] })).constructor.getConfigElement?.();
}
const ut = (i) => JSON.parse(JSON.stringify(i ?? {})), ne = "energiefluss-updated", X = class X extends k {
  constructor() {
    super(...arguments), this.compact = !1, this._ready = !1, this._title = "", this._draft = {}, this._saved = "", this._saving = !1;
  }
  async firstUpdated() {
    await re(), this._ready = !0;
  }
  updated(t) {
    (t.has("entryId") || t.has("hass")) && this.hass && this.entryId && this._loadedFor !== this.entryId && (this._loadedFor = this.entryId, this._load());
  }
  async _load() {
    const t = await this.hass.callWS({
      type: "energiefluss/get_options",
      entry_id: this.entryId
    });
    this._title = t.title, this._draft = ut(t.options), this._saved = this._snapshot(), this._message = void 0;
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
  async save() {
    if (!(!this.hass || !this.entryId)) {
      this._saving = !0, this._message = void 0;
      try {
        const t = (this._draft.batteries ?? []).filter((s) => s && (s.power || s.soc)), e = await this.hass.callWS({
          type: "energiefluss/save_options",
          entry_id: this.entryId,
          title: this._title,
          options: { ...this._draft, batteries: t }
        });
        this._title = e.title, this._draft = ut(e.options), this._saved = this._snapshot(), await new Promise((s) => setTimeout(s, 1200)), window.dispatchEvent(new CustomEvent(ne, { detail: { entry_id: this.entryId } })), this._message = { kind: "ok", text: "Anlage gespeichert." };
      } catch (t) {
        this._message = { kind: "error", text: t.message ?? String(t) };
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
    if (!e) return l;
    const r = this._s(e), n = ct(r);
    return c`<div class="row">
        <span>${t}</span>
        <span>${j(C(r), this._loc)}${s ? c` → <b>${s}</b>` : l}</span>
      </div>
      ${n ? c`<div class="warn">⚠ ${n}</div>` : l}`;
  }
  _solarLive() {
    const t = this._draft.solar_strings ?? [];
    if (!t.length) return l;
    const e = t.reduce((s, r) => s + (C(this._s(r)) ?? 0), 0);
    return c`<div class="live">
      ${t.map((s) => this._powerLine(this._name(s), s))}
      <div class="row total"><span>Summe</span><span>${j(e, this._loc)}</span></div>
    </div>`;
  }
  _batteryLive(t) {
    if (!t.power && !t.soc) return l;
    const e = I(this._s(t.soc));
    return c`<div class="live">
      ${this._powerLine("Leistung", t.power, Gt(C(this._s(t.power)), !!t.invert))}
      ${t.soc ? c`<div class="row"><span>Ladestand</span><span>${e === null ? "–" : `${Math.round(e)} %`}</span></div>` : l}
    </div>`;
  }
  _gridLive() {
    const t = this._draft;
    if (!t.grid_power && !t.grid_price) return l;
    const e = C(this._s(t.grid_power));
    return c`<div class="live">
      ${this._powerLine("Netz", t.grid_power, Kt(e, !!t.grid_invert))}
      ${t.grid_price ? c`<div class="row">
            <span>Preis Bezug</span><span>${qt(Vt(this._s(t.grid_price)), this._loc) || "–"}</span>
          </div>` : l}
    </div>`;
  }
  _loadsLive() {
    const t = [
      ["Nicht steuerbar", this._draft.fixed_loads ?? []],
      ["Steuerbar", this._draft.flexible_loads ?? []]
    ];
    if (!t.some(([, s]) => s.length)) return l;
    const e = t[0][1].filter((s) => t[1][1].includes(s));
    return c`<div class="live">
      ${t.map(([s, r]) => {
      const n = r.reduce((h, a) => h + (C(this._s(a)) ?? 0), 0), o = r.map((h) => [h, ct(this._s(h))]).filter(([, h]) => h);
      return c`<div class="row"><span>${s}: ${r.length} Geräte</span><span>${j(n, this._loc)}</span></div>
          ${o.map(([h, a]) => c`<div class="warn">⚠ ${this._name(h)}: ${a}</div>`)}`;
    })}
      ${e.length ? c`<div class="warn">⚠ In beiden Gruppen: ${e.map((s) => this._name(s)).join(", ")}</div>` : l}
    </div>`;
  }
  // -- render ---------------------------------------------------------------------------
  _form(t, e, s) {
    return c`<ha-form
      .hass=${this.hass}
      .data=${e}
      .schema=${t}
      .computeLabel=${(r) => se[r.name] ?? r.name}
      .computeHelper=${(r) => ie[r.name]}
      @value-changed=${s}
    ></ha-form>`;
  }
  _section(t, e, s) {
    const r = c`<div class="section">
      <h2>${t}</h2>
      ${s ? c`<p class="hint">${s}</p>` : l}
      ${e}
    </div>`;
    return this.compact ? c`<div class="plain">${r}</div>` : c`<ha-card>${r}</ha-card>`;
  }
  render() {
    if (!this._ready || !this._loadedFor) return c`<div class="hint">Lade …</div>`;
    const t = this._draft, e = t.batteries ?? [], s = this._saving, r = this._message ? c`<span class="msg ${this._message.kind}">${this._message.text}</span>` : c`<span class="msg">${this.dirty ? "Ungespeicherte Änderungen an der Anlage" : ""}</span>`;
    return c`
      <div class="actions">
        ${r}
        <button class="secondary" ?disabled=${!this.dirty || s} @click=${this.discard}>Verwerfen</button>
        <button class="primary" ?disabled=${!this.dirty || s} @click=${this.save}>
          ${s ? "Speichert …" : "Anlage speichern"}
        </button>
      </div>
      ${this._section(
      "Allgemein",
      this._form(
        Xt,
        { title: this._title, energy_period: t.energy_period ?? "midnight" },
        (n) => this._onForm(n, ["title", "energy_period"])
      )
    )}
      ${this._section(
      "Solar",
      c`${this._form(
        Qt,
        t,
        (n) => this._onForm(n, ["solar_strings", "solar_today", "solar_forecast_remaining"])
      )}${this._solarLive()}`
    )}
      ${this._section(
      "Batterien",
      c`${Array.from({ length: Yt }, (n, o) => {
        const h = e[o] ?? {};
        return c`<div class="sub">
            <h3>Batterie ${o + 1}${h.name ? ` – ${h.name}` : ""}</h3>
            ${this._form(te, h, (a) => this._onBattery(o, a))}
            ${this._batteryLive(h)}
          </div>`;
      })}`,
      "Leer lassen, wenn nicht vorhanden. Positiv soll „lädt“ bedeuten – sonst den Schalter setzen."
    )}
      ${this._section(
      "Netz",
      c`${this._form(
        dt,
        t,
        (n) => this._onForm(n, dt.map((o) => o.name))
      )}${this._gridLive()}`,
      "Positiv soll „Bezug“ bedeuten – sonst den Schalter setzen."
    )}
      ${this._section(
      "Verbraucher",
      c`${this._form(
        ee,
        t,
        (n) => this._onForm(n, ["fixed_loads", "flexible_loads", "home_power"])
      )}${this._loadsLive()}`,
      "Alle Verbraucher zählen zum Haus. Je Gerät wird der Tagesverbrauch mitgezählt."
    )}
    `;
  }
};
X.styles = yt`
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
  `;
let _ = X;
m([
  D({ attribute: !1 })
], _.prototype, "hass");
m([
  D({ attribute: !1 })
], _.prototype, "entryId");
m([
  D({ type: Boolean })
], _.prototype, "compact");
m([
  S()
], _.prototype, "_ready");
m([
  S()
], _.prototype, "_loadedFor");
m([
  S()
], _.prototype, "_title");
m([
  S()
], _.prototype, "_draft");
m([
  S()
], _.prototype, "_saved");
m([
  S()
], _.prototype, "_saving");
m([
  S()
], _.prototype, "_message");
customElements.get("energiefluss-editor") || customElements.define("energiefluss-editor", _);
export {
  l as A,
  ne as U,
  yt as a,
  c as b,
  I as c,
  he as d,
  re as e,
  ue as f,
  j as g,
  ce as h,
  k as i,
  de as j,
  le as k,
  pe as l,
  Vt as m,
  D as n,
  qt as o,
  S as r,
  _e as s,
  C as w
};
