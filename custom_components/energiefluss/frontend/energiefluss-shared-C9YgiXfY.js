/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const qt = globalThis, ke = qt.ShadowRoot && (qt.ShadyCSS === void 0 || qt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Me = Symbol(), Oe = /* @__PURE__ */ new WeakMap();
let _s = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== Me) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (ke && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = Oe.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && Oe.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ls = (r) => new _s(typeof r == "string" ? r : r + "", void 0, Me), se = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((s, n, i) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + r[i + 1], r[0]);
  return new _s(e, r, Me);
}, Hs = (r, t) => {
  if (ke) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), n = qt.litNonce;
    n !== void 0 && s.setAttribute("nonce", n), s.textContent = e.cssText, r.appendChild(s);
  }
}, Ne = ke ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return Ls(e);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: zs, defineProperty: Cs, getOwnPropertyDescriptor: Ts, getOwnPropertyNames: Ps, getOwnPropertySymbols: Bs, getPrototypeOf: Os } = Object, ne = globalThis, Ie = ne.trustedTypes, Ns = Ie ? Ie.emptyScript : "", Is = ne.reactiveElementPolyfillSupport, Lt = (r, t) => r, Kt = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? Ns : null;
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
} }, Ae = (r, t) => !zs(r, t), Re = { attribute: !0, type: String, converter: Kt, reflect: !1, useDefault: !1, hasChanged: Ae };
Symbol.metadata ??= Symbol("metadata"), ne.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let yt = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Re) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), n = this.getPropertyDescriptor(t, s, e);
      n !== void 0 && Cs(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: n, set: i } = Ts(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: n, set(o) {
      const c = n?.call(this);
      i?.call(this, o), this.requestUpdate(t, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Re;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Lt("elementProperties"))) return;
    const t = Os(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Lt("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Lt("properties"))) {
      const e = this.properties, s = [...Ps(e), ...Bs(e)];
      for (const n of s) this.createProperty(n, e[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, n] of e) this.elementProperties.set(s, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const n = this._$Eu(e, s);
      n !== void 0 && this._$Eh.set(n, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const n of s) e.unshift(Ne(n));
    } else t !== void 0 && e.push(Ne(t));
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
    return Hs(t, this.constructor.elementStyles), t;
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
    const s = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, s);
    if (n !== void 0 && s.reflect === !0) {
      const i = (s.converter?.toAttribute !== void 0 ? s.converter : Kt).toAttribute(e, s.type);
      this._$Em = t, i == null ? this.removeAttribute(n) : this.setAttribute(n, i), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, n = s._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const i = s.getPropertyOptions(n), o = typeof i.converter == "function" ? { fromAttribute: i.converter } : i.converter?.fromAttribute !== void 0 ? i.converter : Kt;
      this._$Em = n;
      const c = o.fromAttribute(e, i.type);
      this[n] = c ?? this._$Ej?.get(n) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, n = !1, i) {
    if (t !== void 0) {
      const o = this.constructor;
      if (n === !1 && (i = this[t]), s ??= o.getPropertyOptions(t), !((s.hasChanged ?? Ae)(i, e) || s.useDefault && s.reflect && i === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: n, wrapped: i }, o) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), i !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), n === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [n, i] of this._$Ep) this[n] = i;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [n, i] of s) {
        const { wrapped: o } = i, c = this[n];
        o !== !0 || this._$AL.has(n) || c === void 0 || this.C(n, void 0, i, c);
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
yt.elementStyles = [], yt.shadowRootOptions = { mode: "open" }, yt[Lt("elementProperties")] = /* @__PURE__ */ new Map(), yt[Lt("finalized")] = /* @__PURE__ */ new Map(), Is?.({ ReactiveElement: yt }), (ne.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Se = globalThis, Fe = (r) => r, Jt = Se.trustedTypes, We = Jt ? Jt.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, fs = "$lit$", ot = `lit$${Math.random().toFixed(9).slice(2)}$`, gs = "?" + ot, Rs = `<${gs}>`, ut = document, zt = () => ut.createComment(""), Ct = (r) => r === null || typeof r != "object" && typeof r != "function", Ee = Array.isArray, Fs = (r) => Ee(r) || typeof r?.[Symbol.iterator] == "function", re = `[ 	
\f\r]`, Mt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ve = /-->/g, Ue = />/g, lt = RegExp(`>|${re}(?:([^\\s"'>=/]+)(${re}*=${re}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), je = /'/g, De = /"/g, $s = /^(?:script|style|textarea|title)$/i, ms = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), m = ms(1), _ = ms(2), xt = Symbol.for("lit-noChange"), f = Symbol.for("lit-nothing"), Ge = /* @__PURE__ */ new WeakMap(), ht = ut.createTreeWalker(ut, 129);
function ys(r, t) {
  if (!Ee(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return We !== void 0 ? We.createHTML(t) : t;
}
const Ws = (r, t) => {
  const e = r.length - 1, s = [];
  let n, i = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = Mt;
  for (let c = 0; c < e; c++) {
    const a = r[c];
    let l, h, d = -1, $ = 0;
    for (; $ < a.length && (o.lastIndex = $, h = o.exec(a), h !== null); ) $ = o.lastIndex, o === Mt ? h[1] === "!--" ? o = Ve : h[1] !== void 0 ? o = Ue : h[2] !== void 0 ? ($s.test(h[2]) && (n = RegExp("</" + h[2], "g")), o = lt) : h[3] !== void 0 && (o = lt) : o === lt ? h[0] === ">" ? (o = n ?? Mt, d = -1) : h[1] === void 0 ? d = -2 : (d = o.lastIndex - h[2].length, l = h[1], o = h[3] === void 0 ? lt : h[3] === '"' ? De : je) : o === De || o === je ? o = lt : o === Ve || o === Ue ? o = Mt : (o = lt, n = void 0);
    const u = o === lt && r[c + 1].startsWith("/>") ? " " : "";
    i += o === Mt ? a + Rs : d >= 0 ? (s.push(l), a.slice(0, d) + fs + a.slice(d) + ot + u) : a + ot + (d === -2 ? c : u);
  }
  return [ys(r, i + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class Tt {
  constructor({ strings: t, _$litType$: e }, s) {
    let n;
    this.parts = [];
    let i = 0, o = 0;
    const c = t.length - 1, a = this.parts, [l, h] = Ws(t, e);
    if (this.el = Tt.createElement(l, s), ht.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (n = ht.nextNode()) !== null && a.length < c; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const d of n.getAttributeNames()) if (d.endsWith(fs)) {
          const $ = h[o++], u = n.getAttribute(d).split(ot), y = /([.?@])?(.*)/.exec($);
          a.push({ type: 1, index: i, name: y[2], strings: u, ctor: y[1] === "." ? Us : y[1] === "?" ? js : y[1] === "@" ? Ds : ie }), n.removeAttribute(d);
        } else d.startsWith(ot) && (a.push({ type: 6, index: i }), n.removeAttribute(d));
        if ($s.test(n.tagName)) {
          const d = n.textContent.split(ot), $ = d.length - 1;
          if ($ > 0) {
            n.textContent = Jt ? Jt.emptyScript : "";
            for (let u = 0; u < $; u++) n.append(d[u], zt()), ht.nextNode(), a.push({ type: 2, index: ++i });
            n.append(d[$], zt());
          }
        }
      } else if (n.nodeType === 8) if (n.data === gs) a.push({ type: 2, index: i });
      else {
        let d = -1;
        for (; (d = n.data.indexOf(ot, d + 1)) !== -1; ) a.push({ type: 7, index: i }), d += ot.length - 1;
      }
      i++;
    }
  }
  static createElement(t, e) {
    const s = ut.createElement("template");
    return s.innerHTML = t, s;
  }
}
function vt(r, t, e = r, s) {
  if (t === xt) return t;
  let n = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const i = Ct(t) ? void 0 : t._$litDirective$;
  return n?.constructor !== i && (n?._$AO?.(!1), i === void 0 ? n = void 0 : (n = new i(r), n._$AT(r, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = n : e._$Cl = n), n !== void 0 && (t = vt(r, n._$AS(r, t.values), n, s)), t;
}
class Vs {
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
    const { el: { content: e }, parts: s } = this._$AD, n = (t?.creationScope ?? ut).importNode(e, !0);
    ht.currentNode = n;
    let i = ht.nextNode(), o = 0, c = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let l;
        a.type === 2 ? l = new Bt(i, i.nextSibling, this, t) : a.type === 1 ? l = new a.ctor(i, a.name, a.strings, this, t) : a.type === 6 && (l = new Gs(i, this, t)), this._$AV.push(l), a = s[++c];
      }
      o !== a?.index && (i = ht.nextNode(), o++);
    }
    return ht.currentNode = ut, n;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class Bt {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, n) {
    this.type = 2, this._$AH = f, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = n, this._$Cv = n?.isConnected ?? !0;
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
    t = vt(this, t, e), Ct(t) ? t === f || t == null || t === "" ? (this._$AH !== f && this._$AR(), this._$AH = f) : t !== this._$AH && t !== xt && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Fs(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== f && Ct(this._$AH) ? this._$AA.nextSibling.data = t : this.T(ut.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, n = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = Tt.createElement(ys(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === n) this._$AH.p(e);
    else {
      const i = new Vs(n, this), o = i.u(this.options);
      i.p(e), this.T(o), this._$AH = i;
    }
  }
  _$AC(t) {
    let e = Ge.get(t.strings);
    return e === void 0 && Ge.set(t.strings, e = new Tt(t)), e;
  }
  k(t) {
    Ee(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, n = 0;
    for (const i of t) n === e.length ? e.push(s = new Bt(this.O(zt()), this.O(zt()), this, this.options)) : s = e[n], s._$AI(i), n++;
    n < e.length && (this._$AR(s && s._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = Fe(t).nextSibling;
      Fe(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class ie {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, n, i) {
    this.type = 1, this._$AH = f, this._$AN = void 0, this.element = t, this.name = e, this._$AM = n, this.options = i, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = f;
  }
  _$AI(t, e = this, s, n) {
    const i = this.strings;
    let o = !1;
    if (i === void 0) t = vt(this, t, e, 0), o = !Ct(t) || t !== this._$AH && t !== xt, o && (this._$AH = t);
    else {
      const c = t;
      let a, l;
      for (t = i[0], a = 0; a < i.length - 1; a++) l = vt(this, c[s + a], e, a), l === xt && (l = this._$AH[a]), o ||= !Ct(l) || l !== this._$AH[a], l === f ? t = f : t !== f && (t += (l ?? "") + i[a + 1]), this._$AH[a] = l;
    }
    o && !n && this.j(t);
  }
  j(t) {
    t === f ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Us extends ie {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === f ? void 0 : t;
  }
}
class js extends ie {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== f);
  }
}
class Ds extends ie {
  constructor(t, e, s, n, i) {
    super(t, e, s, n, i), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = vt(this, t, e, 0) ?? f) === xt) return;
    const s = this._$AH, n = t === f && s !== f || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, i = t !== f && (s === f || n);
    n && this.element.removeEventListener(this.name, this, s), i && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Gs {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    vt(this, t);
  }
}
const Ys = Se.litHtmlPolyfillSupport;
Ys?.(Tt, Bt), (Se.litHtmlVersions ??= []).push("3.3.3");
const Xs = (r, t, e) => {
  const s = e?.renderBefore ?? t;
  let n = s._$litPart$;
  if (n === void 0) {
    const i = e?.renderBefore ?? null;
    s._$litPart$ = n = new Bt(t.insertBefore(zt(), i), i, void 0, e ?? {});
  }
  return n._$AI(r), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Le = globalThis;
let dt = class extends yt {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Xs(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return xt;
  }
};
dt._$litElement$ = !0, dt.finalized = !0, Le.litElementHydrateSupport?.({ LitElement: dt });
const qs = Le.litElementPolyfillSupport;
qs?.({ LitElement: dt });
(Le.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Zs = { attribute: !0, type: String, converter: Kt, reflect: !1, hasChanged: Ae }, Ks = (r = Zs, t, e) => {
  const { kind: s, metadata: n } = e;
  let i = globalThis.litPropertyMetadata.get(n);
  if (i === void 0 && globalThis.litPropertyMetadata.set(n, i = /* @__PURE__ */ new Map()), s === "setter" && ((r = Object.create(r)).wrapped = !0), i.set(e.name, r), s === "accessor") {
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
function ft(r) {
  return (t, e) => typeof e == "object" ? Ks(r, t, e) : ((s, n, i) => {
    const o = n.hasOwnProperty(i);
    return n.constructor.createProperty(i, s), o ? Object.getOwnPropertyDescriptor(n, i) : void 0;
  })(r, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function H(r) {
  return ft({ ...r, state: !0, attribute: !1 });
}
const Js = { W: 1, kW: 1e3, MW: 1e6, mW: 1e-3 }, Qs = { Wh: 1e-3, kWh: 1, MWh: 1e3 };
function C(r) {
  if (!r) return null;
  const t = parseFloat(r.state);
  return Number.isFinite(t) ? t : null;
}
function G(r) {
  const t = C(r);
  if (t === null) return null;
  const e = r.attributes.unit_of_measurement ?? "W";
  return t * (Js[e] ?? 1);
}
function Ot(r) {
  const t = C(r);
  if (t === null) return null;
  const e = r.attributes.unit_of_measurement ?? "kWh";
  return t * (Qs[e] ?? 1);
}
function L(r, t = "de") {
  return r === null ? "–" : Math.abs(r) < 1e3 ? `${Math.round(r).toLocaleString(t)} W` : `${(r / 1e3).toLocaleString(t, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kW`;
}
function V(r, t = "de") {
  return r === null ? "–" : `${r.toLocaleString(t, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kWh`;
}
function Ht(r, t = "de") {
  return r === null ? "–" : `${Math.round(r).toLocaleString(t)} %`;
}
function tn(r, t) {
  return +(6 - 5 * Math.min(Math.abs(r) / Math.max(t, 1), 1)).toFixed(2);
}
function en(r, t) {
  return r === null ? 1 : +(1 + 3 * Math.min(Math.abs(r) / Math.max(t, 1), 1)).toFixed(2);
}
function bt(r, t = 9) {
  if (r.length <= t) return r;
  const e = /\s*\d+$/.exec(r)?.[0] ?? "";
  return e && e.length <= t - 3 ? r.slice(0, t - e.length - 1).trimEnd() + "…" + e : r.slice(0, t - 1) + "…";
}
function fe(r) {
  const t = C(r);
  if (t === null) return null;
  const e = String(r.attributes.unit_of_measurement ?? "").toLowerCase();
  return e.includes("ct") || e.includes("cent") ? t : t * 100;
}
function He(r, t = "de") {
  return r === null ? "" : `${r.toLocaleString(t, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ct/kWh`;
}
const sn = ["W", "kW", "MW", "mW"];
function Ye(r) {
  if (!r) return "Sensor nicht gefunden";
  const t = r.attributes.unit_of_measurement;
  return t && !sn.includes(t) ? `Einheit „${t}“ ist keine Leistung (W/kW)` : null;
}
function Xe(r, t) {
  if (r === null) return "kein Wert";
  const e = t ? -r : r;
  return Math.abs(e) < 5 ? "ruht" : e > 0 ? "lädt" : "entlädt";
}
function qe(r, t) {
  if (r === null) return "kein Wert";
  const e = t ? -r : r;
  return Math.abs(e) < 5 ? "ausgeglichen" : e > 0 ? "Bezug" : "Einspeisung";
}
const nn = 44, on = 290;
function rn(r) {
  if (r <= 0) return [];
  const t = [[230], [195, 275], [160, 228, 296], [140, 192, 244, 296], [136, 184, 232, 280, 328]][Math.min(r, 5) - 1], e = r <= 3 ? 54 : r === 4 ? 46 : 44;
  return t.map((s, n) => {
    const i = t.length - 1 - n;
    return { cx: s, top: on + (i % 2 === 1 ? nn : 0), w: e };
  });
}
function ge(r, t = 15, e = 19) {
  const s = r.trim();
  if (s.length <= t) return { lines: [s], small: !1 };
  const n = (l) => l.length > e ? l.slice(0, e - 1) + "…" : l, i = [...s.matchAll(/ /g)].map((l) => l.index), o = i.filter((l) => l <= e && s.length - l - 1 <= e), c = o.length ? o : i.filter((l) => l <= e);
  if (c.length) {
    const l = s.length / 2, h = c.reduce((d, $) => Math.abs($ - l) < Math.abs(d - l) ? $ : d);
    return { lines: [s.slice(0, h), n(s.slice(h + 1))], small: !0 };
  }
  const a = s.indexOf(" ");
  return a < 0 ? { lines: [n(s)], small: !0 } : { lines: [n(s.slice(0, a)), n(s.slice(a + 1).trim())], small: !0 };
}
const an = 4 / 3;
function ln(r, t) {
  const e = Math.min(Math.abs(r) / Math.max(t, 1), 1);
  return +((1.6 + 3.4 * Math.sqrt(e)) * an).toFixed(2);
}
function $e(r) {
  const t = r.trim().split(/[\s,]+/);
  let e = 0, s = 0, n = 0;
  const i = (o) => {
    const c = (h) => {
      let d = o.map(($) => [...$]);
      for (; d.length > 1; ) d = d.slice(1).map(($, u) => [d[u][0] + ($[0] - d[u][0]) * h, d[u][1] + ($[1] - d[u][1]) * h]);
      return d[0];
    };
    let [a, l] = o[0];
    for (let h = 1; h <= 24; h++) {
      const [d, $] = c(h / 24);
      n += Math.hypot(d - a, $ - l), [a, l] = [d, $];
    }
  };
  for (let o = 0; o < t.length; o++) {
    const c = t[o];
    if (c === "M")
      e = +t[++o], s = +t[++o];
    else if (c === "H") {
      const a = +t[++o];
      n += Math.abs(a - e), e = a;
    } else if (c === "V") {
      const a = +t[++o];
      n += Math.abs(a - s), s = a;
    } else if (c === "L") {
      const a = +t[++o], l = +t[++o];
      n += Math.hypot(a - e, l - s), [e, s] = [a, l];
    } else if (c === "Q" || c === "C") {
      const a = c === "Q" ? 2 : 3, l = [[e, s]];
      for (let h = 0; h < a; h++) l.push([+t[++o], +t[++o]]);
      i(l), [e, s] = l[a];
    }
  }
  return n;
}
function Nt(r, t = 10) {
  const e = Math.floor(Math.abs(r) + 1e-9), s = Math.floor(e / 1e3), n = Math.floor(e % 1e3 / 100), i = Math.floor(e % 100 / 10);
  return [
    ...Array(Math.min(s, t)).fill("big"),
    ...Array(n).fill("medium"),
    ...Array(i).fill("small")
  ];
}
function cn(r, t, e) {
  const s = [r, t, e].map((i) => Math.max(0, i ?? 0)), n = s.reduce((i, o) => i + o, 0);
  return n > 0 ? s.map((i) => i / n) : [1, 0, 0];
}
function hn(r, t) {
  const e = (n) => {
    const i = t.map((l) => l * n), o = i.map(Math.floor), c = i.map((l, h) => [l - Math.floor(l), h]).sort((l, h) => h[0] - l[0] || l[1] - h[1]), a = n - o.reduce((l, h) => l + h, 0);
    for (let l = 0; l < a; l++) o[c[l][1]]++;
    return o.flatMap((l, h) => Array(l).fill(h));
  }, s = new Map(["big", "medium", "small"].map((n) => [n, e(r.filter((i) => i === n).length)]));
  return r.map((n) => s.get(n).shift());
}
var dn = Object.defineProperty, N = (r, t, e, s) => {
  for (var n = void 0, i = r.length - 1, o; i >= 0; i--)
    (o = r[i]) && (n = o(t, e, n) || n);
  return n && dn(t, e, n), n;
};
const It = 5, Ze = 2, Ke = 3, ae = ["battery", "solar", "tariff", "wallbox"], bs = ["grid", "battery", "solar", "tariff", "wallbox", "loads"];
function Gi(r) {
  const t = r.checked ?? [], e = (n) => {
    const i = r[n];
    return Array.isArray(i) ? i.length > 0 : !!i;
  }, s = {
    battery: e("batteries"),
    solar: e("solar_strings") || e("solar_total"),
    tariff: e("grid_price"),
    wallbox: e("wallbox_power")
  };
  return bs.some((n) => !t.includes(n) && (!(n in s) || s[n] || (r.topics ?? []).includes(n)));
}
const R = { entity: { domain: "sensor" } }, Pt = { entity: { domain: "sensor", multiple: !0, reorder: !0 } }, pn = [
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
], un = [
  { name: "solar_strings", selector: Pt },
  { name: "solar_total", selector: R },
  { name: "solar_today", selector: R },
  { name: "solar_forecast_remaining", selector: R }
], ws = (r) => ({
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
function _n(r, t = !0) {
  const e = r.mode === "split" ? [
    { name: "charge_power", selector: R },
    { name: "discharge_power", selector: R }
  ] : [
    { name: "power", selector: R },
    { name: "invert", selector: { boolean: {} } }
  ];
  return [
    { name: "name", selector: { text: {} } },
    ws("mode"),
    ...e,
    { name: "soc", selector: R },
    { name: "capacity_kwh", selector: { number: { min: 0, max: 200, step: 0.1, mode: "box", unit_of_measurement: "kWh" } } },
    ...t ? [{ name: "backup_loads", selector: Pt }] : [],
    ...t && r.mode === "split" ? [{ name: "backup_only", selector: { boolean: {} } }] : []
  ];
}
function fn(r) {
  const t = r.grid_mode === "split" ? [
    { name: "grid_import_power", selector: R },
    { name: "grid_export_power", selector: R }
  ] : [
    { name: "grid_power", selector: R },
    { name: "grid_invert", selector: { boolean: {} } }
  ];
  return [ws("grid_mode"), ...t, ...mn];
}
const gn = [
  "grid_mode",
  "grid_power",
  "grid_invert",
  "grid_import_power",
  "grid_export_power",
  "grid_export_price_fixed",
  "grid_export_price",
  "grid_import_today",
  "grid_export_today"
], $n = [{ name: "grid_price", selector: R }], mn = [
  {
    name: "grid_export_price_fixed",
    selector: { number: { min: 0, max: 100, step: 0.01, mode: "box", unit_of_measurement: "ct/kWh" } }
  },
  { name: "grid_export_price", selector: R },
  { name: "grid_import_today", selector: R },
  { name: "grid_export_today", selector: R }
], yn = [
  { name: "fixed_loads", selector: Pt },
  { name: "flexible_loads", selector: Pt },
  { name: "home_power", selector: R }
], bn = [
  { name: "wallbox_name", selector: { text: {} } },
  { name: "wallbox_power", selector: R },
  { name: "wallbox_flexible", selector: { boolean: {} } },
  { name: "wallbox_soc", selector: R }
], wn = {
  wallbox_name: "Name",
  wallbox_power: "Ladeleistung",
  wallbox_flexible: "Zusatzverbraucher (sonst Grundlast)",
  wallbox_soc: "Ladestand Auto (optional)",
  title: "Name der Anlage",
  energy_period: "Tageswerte",
  solar_strings: "PV-Leistung (Strings / Wechselrichter)",
  solar_total: "PV-Gesamtleistung (optional)",
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
}, xn = {
  energy_period: "Ab 0 Uhr setzt um Mitternacht auf null, 24 Stunden ist ein gleitendes Fenster.",
  solar_strings: "Mehrere Sensoren werden addiert. W oder kW.",
  solar_total: "Leer lassen: Summe der Stränge. Sonst zeigt „PV gesamt“ diesen Sensor, z. B. die Leistung des Wechselrichters.",
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
async function xs() {
  if (customElements.get("ha-form") && customElements.get("ha-entity-picker")) return;
  const r = await window.loadCardHelpers();
  for (const t of ["tile", "entities"])
    await (await r.createCardElement({ type: t, entity: "sun.sun", entities: [] })).constructor.getConfigElement?.();
}
const le = (r) => JSON.parse(JSON.stringify(r ?? {}));
function vn(r) {
  const t = r;
  return t === 3 || typeof t == "object" && t?.code === 3 ? "Verbindung zu Home Assistant unterbrochen – bitte erneut speichern." : typeof t == "object" && t && typeof t.message == "string" ? t.message : typeof r == "string" ? r : "Speichern fehlgeschlagen – bitte erneut versuchen.";
}
const Qt = "energiefluss-updated";
function kn(r) {
  const t = [
    ...r.solar_strings?.value ?? [],
    r.solar_today?.value,
    r.solar_forecast_remaining?.value,
    r.grid?.value.grid_power,
    r.grid?.value.grid_import_power,
    r.grid?.value.grid_export_power,
    r.grid_price?.value,
    r.grid_import_today?.value,
    r.grid_export_today?.value,
    r.home_power?.value,
    r.wallbox_power?.value,
    r.wallbox_soc?.value,
    ...(r.batteries ?? []).flatMap(({ value: e }) => [e.power, e.charge_power, e.discharge_power, e.soc]),
    ...(r.loads ?? []).map((e) => e.entity)
  ];
  return [...new Set(t.filter((e) => !!e))];
}
const ze = class ze extends dt {
  constructor() {
    super(...arguments), this.compact = !1, this._ready = !1, this._title = "", this._draft = {}, this._saved = "", this._saving = !1, this._computed = [], this._detecting = !1, this._usage = {}, this._usageAsked = /* @__PURE__ */ new Set(), this._look = "glass", this._open = /* @__PURE__ */ new Set(), this._choice = {}, this._detectIn = /* @__PURE__ */ new Set(), this._skipped = /* @__PURE__ */ new Set(), this._backupYes = /* @__PURE__ */ new Set();
  }
  async firstUpdated() {
    await xs(), this._ready = !0;
  }
  updated(t) {
    (t.has("entryId") || t.has("hass")) && this.hass && this.entryId && this._loadedFor !== this.entryId && (this._loadedFor = this.entryId, this._load()), this._open.has("loads") && this._loadUsage(this._linkableLoads());
  }
  async _load() {
    const t = await this.hass.callWS({
      type: "energiefluss/get_options",
      entry_id: this.entryId
    });
    this._computed = t.computed ?? [], this._title = t.title, this._look = t.options.look === "classic" ? "classic" : "glass", this._draft = le(t.options), this._saved = this._snapshot(), this._message = void 0;
    const e = this._nextOpen();
    this._open = new Set(e ? [e] : []);
  }
  /** A field of the card was clicked in settings mode: open its section and show it. */
  async focusTarget(t) {
    if (!this._loadedFor) return;
    ae.includes(t.topic) && !this._isOn(t.topic) && (this._choice = { ...this._choice, [t.topic]: !0 });
    const e = this._open.has(t.topic);
    this._open = /* @__PURE__ */ new Set([t.topic]), await this.updateComplete, e || await new Promise((o) => setTimeout(o, 250));
    const s = (o) => this.renderRoot.querySelector(`[data-focus="${CSS.escape(o)}"]`), n = t.load && s(`load-${t.load}`) || t.battery !== void 0 && s(`battery-${t.battery}`) || s(t.topic);
    if (!n) return;
    n.scrollIntoView({ behavior: "smooth", block: n.dataset.focus === t.topic ? "start" : "center" }), n.classList.remove("flash"), n.offsetWidth, n.classList.add("flash"), n.addEventListener("animationend", () => n.classList.remove("flash"), { once: !0 });
    const i = n.dataset.focus?.startsWith("load-") ? n.querySelector("input") : null;
    i && setTimeout(() => i.focus({ preventScroll: !0 }), 400);
  }
  /** The first section of the guide that is switched on and not yet ticked off. */
  _nextOpen() {
    const t = this._draft.checked ?? [];
    return bs.find((e) => this._isOn(e) && !t.includes(e));
  }
  /** Save, tick the section off, close it and open the next one. */
  async _saveSection(t) {
    const e = [.../* @__PURE__ */ new Set([...this._draft.checked ?? [], t])];
    if (this._draft = { ...this._draft, checked: e }, await this.save(), this._message?.kind !== "ok") return;
    const s = this._nextOpen();
    this._open = new Set(s ? [s] : []), this._message = { kind: "ok", text: s ? "Gespeichert – weiter mit dem nächsten Abschnitt." : "Gespeichert – alles eingerichtet." };
  }
  async _setLook(t) {
    !this.hass || !this.entryId || (await this.hass.callWS({ type: "energiefluss/set_look", entry_id: this.entryId, look: t }), this._look = t, await new Promise((e) => setTimeout(e, 1200)), window.dispatchEvent(new CustomEvent(Qt, { detail: { entry_id: this.entryId } })));
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
    const s = t.detail.value, n = { ...this._draft };
    for (const i of e) {
      if (i === "title") continue;
      const o = s[i];
      o === void 0 || o === "" || Array.isArray(o) && o.length === 0 ? delete n[i] : n[i] = o;
    }
    "title" in s && (this._title = String(s.title ?? "")), this._draft = n;
  }
  _onBattery(t, e) {
    e.stopPropagation();
    const s = [...this._draft.batteries ?? []];
    for (; s.length <= t; ) s.push({});
    s[t] = e.detail.value, this._draft = { ...this._draft, batteries: s };
  }
  // -- sensor detection ----------------------------------------------------------------
  async _detect(t) {
    if (this.hass) {
      this._detectIn = /* @__PURE__ */ new Set([...this._detectIn, t]), this._skipped = /* @__PURE__ */ new Set(), this._detecting = !0;
      try {
        this._suggestions = await this.hass.callWS({ type: "energiefluss/suggest" }), this._loadUsage(kn(this._suggestions));
      } finally {
        this._detecting = !1;
      }
    }
  }
  /** Ask once per sensor where else it is used. The hints are optional: on errors none are shown. */
  async _loadUsage(t) {
    const e = t.filter((s) => !this._usageAsked.has(s));
    if (!(!e.length || !this.hass)) {
      e.forEach((s) => this._usageAsked.add(s));
      try {
        const s = await this.hass.callWS({ type: "energiefluss/usage", entity_ids: e });
        this._usage = { ...this._usage, ...s };
      } catch (s) {
        console.warn("Wattrio: usage search failed", s);
      }
    }
  }
  // -- backup sockets of one battery ---------------------------------------------------
  _backupOn(t, e) {
    return this._backupYes.has(e) || !!(t.backup_loads ?? []).length || !!t.backup_only;
  }
  _setBackup(t, e) {
    const s = new Set(this._backupYes);
    if (e ? s.add(t) : s.delete(t), this._backupYes = s, !e) {
      const n = [...this._draft.batteries ?? []], { backup_loads: i, backup_only: o, ...c } = n[t];
      n[t] = c, this._draft = { ...this._draft, batteries: n };
    }
  }
  _backupPart(t, e) {
    const s = this._draft.batteries ?? [], n = this._backupOn(t, e), i = s.filter((a, l) => l !== e && this._backupOn(a, l)).length, o = !n && i >= Ze, c = [
      { name: "backup_loads", selector: Pt },
      ...t.mode === "split" ? [{ name: "backup_only", selector: { boolean: {} } }] : []
    ];
    return m`<div class="backup">
      <div class="head">
        <span class="bq">Hat diese Batterie Notstrom-Steckdosen?</span>
        <div class="yesno" role="group" aria-label="Notstrom-Steckdosen">
          <button class=${n ? "on" : ""} ?disabled=${o} @click=${() => this._setBackup(e, !0)}>Ja</button>
          <button class=${n ? "" : "on"} @click=${() => this._setBackup(e, !1)}>Nein</button>
        </div>
      </div>
      ${o ? m`<p class="hint">Höchstens ${Ze} Batterien mit Notstrom.</p>` : f}
      ${n ? this._form(
      c,
      { mode: "combined", ...t },
      (a) => this._onBattery(e, a),
      { backup_loads: "Welche Geräte hängen dran?" },
      {
        backup_loads: "Leistungs-Sensoren der Geräte an den Notstrom-Steckdosen dieser Batterie.",
        backup_only: "Für Geräte wie EcoFlow, die nicht ins Haus einspeisen können: Ladeleistung = Eingang aus dem Haus, Entladeleistung = Ausgang an die Notstrom-Geräte."
      }
    ) : f}
    </div>`;
  }
  // -- sections: open / closed and "Ja / Nein" -----------------------------------------
  _has(t) {
    const e = this._draft, s = e.batteries ?? [];
    switch (t) {
      case "solar":
        return !!((e.solar_strings ?? []).length || e.solar_total || e.solar_today || e.solar_forecast_remaining);
      case "battery":
        return s.length > 0;
      case "wallbox":
        return !!(e.wallbox_power || e.wallbox_soc);
      case "tariff":
        return !!e.grid_price;
      default:
        return !0;
    }
  }
  _isOn(t) {
    return ae.includes(t) ? this._choice[t] ?? (this._has(t) || (this._draft.topics ?? []).includes(t)) : !0;
  }
  _toggleOpen(t) {
    const e = new Set(this._open);
    e.has(t) ? e.delete(t) : e.add(t), this._open = e;
  }
  _answer(t, e) {
    if (this._choice = { ...this._choice, [t]: e }, e) {
      this._open = /* @__PURE__ */ new Set([...this._open, t]);
      return;
    }
    this._clear(t), this._draft = { ...this._draft, topics: (this._draft.topics ?? []).filter((s) => s !== t) }, this._saveSection(t);
  }
  /** "Nein": take the topic's sensors out of the draft (undo with "Verwerfen"). */
  _clear(t) {
    const e = { ...this._draft }, s = (...n) => n.forEach((i) => delete e[i]);
    t === "solar" && s("solar_strings", "solar_total", "solar_today", "solar_forecast_remaining"), t === "battery" && s("batteries"), t === "wallbox" && s("wallbox_name", "wallbox_power", "wallbox_soc", "wallbox_flexible"), t === "tariff" && s("grid_price"), this._draft = e;
  }
  _batteryUses(t) {
    return [t.power, t.charge_power, t.discharge_power].filter((e) => !!e);
  }
  _hasBattery(t) {
    const e = this._batteryUses(t);
    return (this._draft.batteries ?? []).some((s) => this._batteryUses(s).some((n) => e.includes(n)));
  }
  _gridSet() {
    const t = this._draft;
    return !!(t.grid_power || t.grid_import_power || t.grid_export_power);
  }
  _apply(t) {
    this._draft = { ...this._draft, ...t };
  }
  _applyBattery(t) {
    this._hasBattery(t) || (this._draft.batteries ?? []).length >= It || (this._draft = { ...this._draft, batteries: [...this._draft.batteries ?? [], { ...t }] });
  }
  _applyLoad(t, e) {
    const s = [...this._draft[e] ?? []];
    s.includes(t) || s.push(t), this._draft = { ...this._draft, [e]: s };
  }
  _addBattery() {
    const t = [...this._draft.batteries ?? []];
    t.length >= It || (t.push({ mode: "combined" }), this._draft = { ...this._draft, batteries: t });
  }
  _removeBattery(t) {
    this._backupYes = new Set([...this._backupYes].filter((s) => s !== t).map((s) => s > t ? s - 1 : s));
    const e = [...this._draft.batteries ?? []];
    e.splice(t, 1), this._draft = { ...this._draft, batteries: e };
  }
  /** Drop values that belong to the mode not selected (kept while editing). */
  _cleaned() {
    const t = le(this._draft);
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
        this._title = t.title, this._draft = le(t.options), this._saved = this._snapshot(), await new Promise((s) => setTimeout(s, 1200)), window.dispatchEvent(new CustomEvent(Qt, { detail: { entry_id: this.entryId } }));
        const e = await this.hass.callWS({
          type: "energiefluss/get_options",
          entry_id: this.entryId
        });
        this._computed = e.computed ?? [], this._message = { kind: "ok", text: "Anlage gespeichert." };
      } catch (t) {
        this._message = { kind: "error", text: vn(t) };
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
  _haName(t) {
    return this._s(t)?.attributes.friendly_name ?? t;
  }
  _name(t) {
    return this._draft.load_names?.[t] || this._haName(t);
  }
  // -- own names and where a sensor is used elsewhere -----------------------------
  _setLoadName(t, e) {
    const s = { ...this._draft.load_names ?? {} };
    e ? s[t] = e : delete s[t];
    const n = { ...this._draft, load_names: s };
    Object.keys(s).length || delete n.load_names, this._draft = n;
  }
  _places(t) {
    const e = t.length - Ke;
    return t.slice(0, Ke).join(", ") + (e > 0 ? ` + ${e} weitere` : "");
  }
  /** Read-only hint below a suggested grid, PV, battery, ... sensor. */
  _usageHint(t) {
    const e = this._usage[t];
    if (!e?.names.length && !e?.used.length) return f;
    const s = e.names.map((i) => `„${i.name}“ (${i.where})`).join(", "), n = s ? `heißt auch ${s}` : `verwendet in ${this._places(e.used)}`;
    return m`<small>${this._haName(t)}: ${n}</small>`;
  }
  /** Names found elsewhere as buttons: click to use one, click again to drop it. */
  _nameChips(t) {
    const e = this._usage[t]?.names ?? [];
    if (!e.length) return f;
    const s = this._draft.load_names?.[t];
    return m`<div class="chips">
      <small>Heißt anderswo:</small>
      ${e.map(
      (n) => m`<button
          class="chip ${s === n.name ? "on" : ""}"
          aria-pressed=${s === n.name}
          title="Diesen Namen in Wattrio verwenden"
          @click=${() => this._setLoadName(t, s === n.name ? "" : n.name)}
        >
          ${n.name}<span>${n.where}</span>
        </button>`
    )}
    </div>`;
  }
  _usedLine(t) {
    const e = this._usage[t]?.used ?? [];
    return e.length ? m`<small>Verwendet in: ${this._places(e)}</small>` : f;
  }
  /** "sensor.xyz · 45 W · Büro · Steckdose 3 · shelly": helps to recognise a cryptic sensor. */
  _facts(t, e) {
    const s = this._usage[t], n = G(this._s(t));
    return [t, n === null ? "" : L(n, this._loc), s?.area, s?.device, e].filter(Boolean).join(" · ");
  }
  _namesEditor() {
    const t = this._linkableLoads();
    return t.length ? m`<div class="names">
      <h3>Namen auf der Karte</h3>
      <p class="hint">Leer lassen: der Name aus Home Assistant. Der Sensor selbst wird nicht umbenannt.</p>
      ${t.map(
      (e) => m`<div class="name-row" data-focus=${`load-${e}`}>
          <label>
            <span>${this._haName(e)}</span>
            <input
              type="text"
              maxlength="60"
              placeholder=${this._haName(e)}
              .value=${this._draft.load_names?.[e] ?? ""}
              @input=${(s) => this._setLoadName(e, s.target.value)}
              @change=${(s) => s.stopPropagation()}
            />
          </label>
          ${this._nameChips(e)}${this._usedLine(e)}
        </div>`
    )}
    </div>` : f;
  }
  _powerLine(t, e, s) {
    if (!e) return f;
    const n = this._s(e), i = Ye(n);
    return m`<div class="row">
        <span>${t}</span>
        <span>${L(G(n), this._loc)}${s ? m` → <b>${s}</b>` : f}</span>
      </div>
      ${i ? m`<div class="warn">⚠ ${i}</div>` : f}`;
  }
  _solarLive() {
    const t = this._draft.solar_strings ?? [], e = this._draft.solar_total;
    if (!t.length && !e)
      return m`<div class="live">
        ${this._calcNote(
        this._computed.includes("solar") ? "PV-Leistung wird aus der Energiebilanz berechnet." : "Ohne PV-Sensor: wird berechnet, wenn Netz und Hausverbrauch gemessen werden."
      )}
      </div>`;
    const s = t.reduce((n, i) => n + (G(this._s(i)) ?? 0), 0);
    return m`<div class="live">
      ${t.map((n) => this._powerLine(this._name(n), n))}
      ${t.length ? m`<div class="row total"><span>Summe</span><span>${L(s, this._loc)}</span></div>` : f}
      ${e ? m`<div class="row total"><span>PV gesamt (Sensor)</span><span>${L(G(this._s(e)), this._loc)}</span></div>` : f}
      ${this._draft.solar_today ? f : this._calcNote("PV-Ertrag heute zählt die Integration selbst.")}
    </div>`;
  }
  _calcNote(t) {
    return m`<div class="calc">≈ ${t}</div>`;
  }
  _batteryLive(t, e) {
    const s = t.mode === "split", n = s ? !!(t.charge_power || t.discharge_power) : !!t.power, i = C(this._s(t.soc));
    let o = f;
    if (s && n) {
      const a = G(this._s(t.charge_power)), l = G(this._s(t.discharge_power)), h = a === null && l === null ? null : Math.abs(a ?? 0) - Math.abs(l ?? 0);
      o = m`${this._powerLine("Laden", t.charge_power)}${this._powerLine("Entladen", t.discharge_power)}
        <div class="row total"><span>Ergebnis</span>
          <span>${L(h === null ? null : Math.abs(h), this._loc)} → <b>${Xe(h, !1)}</b></span>
        </div>`;
    } else n && (o = this._powerLine("Leistung", t.power, Xe(G(this._s(t.power)), !!t.invert)));
    const c = this._computed.includes(`battery_${e + 1}`);
    return !n && !t.soc && !(t.backup_loads ?? []).length ? f : m`<div class="live">
      ${o}
      ${n ? f : this._calcNote(
      c ? "Leistung wird aus der Energiebilanz berechnet." : "Ohne Leistungssensor: wird nur berechnet, wenn der Hausverbrauch gemessen wird und dies die einzige Batterie ohne Sensor ist."
    )}
      ${t.soc ? m`<div class="row"><span>Ladestand</span><span>${i === null ? "–" : `${Math.round(i)} %`}</span></div>` : f}
      ${(t.backup_loads ?? []).length ? m`<div class="row">
            <span>Notstrom-Abgang: ${t.backup_loads.length} Geräte</span>
            <span>${L(t.backup_loads.reduce((a, l) => a + (G(this._s(l)) ?? 0), 0), this._loc)}</span>
          </div>` : f}
    </div>`;
  }
  _gridLive() {
    const t = this._draft, e = t.grid_mode === "split", s = e ? !!(t.grid_import_power || t.grid_export_power) : !!t.grid_power;
    let n = f;
    if (e && s) {
      const c = G(this._s(t.grid_import_power)), a = G(this._s(t.grid_export_power)), l = c === null && a === null ? null : Math.abs(c ?? 0) - Math.abs(a ?? 0);
      n = m`${this._powerLine("Bezug", t.grid_import_power)}${this._powerLine("Einspeisung", t.grid_export_power)}
        <div class="row total"><span>Ergebnis</span>
          <span>${L(l === null ? null : Math.abs(l), this._loc)} → <b>${qe(l, !1)}</b></span>
        </div>`;
    } else s && (n = this._powerLine("Netz", t.grid_power, qe(G(this._s(t.grid_power)), !!t.grid_invert)));
    let i = f;
    s || (i = this._calcNote(
      t.home_power ? "Netzleistung wird aus der Energiebilanz berechnet (gemessener Hausverbrauch)." : "Ohne Netzsensor fehlt ein Wert der Bilanz – bitte Netzsensor wählen oder Hausverbrauch messen."
    ));
    const o = !t.grid_import_today || !t.grid_export_today ? this._calcNote("Fehlende Tageswerte für Bezug/Einspeisung zählt die Integration selbst.") : f;
    return m`<div class="live">
      ${n}${i}
      ${t.grid_price ? m`<div class="row">
            <span>Preis Bezug</span><span>${He(fe(this._s(t.grid_price)), this._loc) || "–"}</span>
          </div>` : f}
      ${o}
    </div>`;
  }
  _wallboxLive() {
    const t = this._draft;
    if (!t.wallbox_power) return f;
    const e = C(this._s(t.wallbox_soc));
    return m`<div class="live">
      ${this._powerLine("Wallbox", t.wallbox_power, t.wallbox_flexible ?? !0 ? "Zusatzverbraucher" : "Grundlast")}
      ${t.wallbox_soc ? m`<div class="row"><span>Auto</span><span>${e === null ? "–" : `${Math.round(e)} %`}</span></div>` : f}
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
    }, n = () => {
      const o = new Set(e.flatMap(([l, h]) => [l, h])), c = t.find((l) => !o.has(l)) ?? t[0], a = t.find((l) => l !== c && !e.some(([h]) => h === l)) ?? "";
      c && a && this._setParents([...e, [c, a]]);
    }, i = (o, c) => m`<option value=${o} ?selected=${o === c}>${this._name(o)}</option>`;
    return m`<div class="pairs">
      <h3>Enthaltene Verbraucher</h3>
      <p class="hint">
        Ist ein Gerät schon im Wert eines anderen enthalten (z. B. Wasserkocher im Unterzähler „Neubau“), wird es
        nur einmal gezählt und auf der Karte eingerückt darunter angezeigt.
      </p>
      ${e.map(
      ([o, c], a) => m`<div class="pair">
          <select @change=${(l) => s(a, l.target.value, c)}>
            ${t.map((l) => i(l, o))}
          </select>
          <span>ist enthalten in</span>
          <select @change=${(l) => s(a, o, l.target.value)}>
            ${t.filter((l) => l !== o).map((l) => i(l, c))}
          </select>
          <button class="link" @click=${() => this._setParents(e.filter((l, h) => h !== a))}>Entfernen</button>
        </div>
        ${o === c || e.some(([l]) => l === c) ? m`<div class="warn">⚠ Ungültig: ein Gerät kann nicht in sich selbst oder in einem enthaltenen Gerät stecken.</div>` : f}`
    )}
      <button class="add" ?disabled=${t.length < 2} @click=${n}>+ Enthaltenen Verbraucher hinzufügen</button>
    </div>`;
  }
  _loadsLive() {
    const t = [
      ["Grundlast", this._draft.fixed_loads ?? []],
      ["Zusatzverbraucher", this._draft.flexible_loads ?? []]
    ];
    if (!t.some(([, n]) => n.length)) return f;
    const e = [
      ...t.flatMap(([, n]) => n),
      ...(this._draft.batteries ?? []).flatMap((n) => n.backup_loads ?? []),
      ...this._draft.wallbox_power ? [this._draft.wallbox_power] : []
    ], s = [...new Set(e.filter((n, i) => e.indexOf(n) !== i))];
    return m`<div class="live">
      ${t.map(([n, i]) => {
      const o = this._draft.load_parents ?? {}, c = i.filter((l) => !(l in o)).reduce((l, h) => l + (G(this._s(h)) ?? 0), 0), a = i.map((l) => [l, Ye(this._s(l))]).filter(([, l]) => l);
      return m`<div class="row"><span>${n}: ${i.length} Geräte</span><span>${L(c, this._loc)}</span></div>
          ${a.map(([l, h]) => m`<div class="warn">⚠ ${this._name(l)}: ${h}</div>`)}`;
    })}
      ${s.length ? m`<div class="warn">⚠ In mehreren Gruppen: ${s.map((n) => this._name(n)).join(", ")}</div>` : f}
    </div>`;
  }
  _suggestRow(t, e, s, n, i, o, c = "Übernehmen") {
    return m`<div class="sg-row">
      <div class="sg-text">
        <b>${t}</b><span>${e}</span><small>${s}</small>
        ${o.map((a) => a ? this._usageHint(a) : f)}
      </div>
      ${n ? m`<span class="sg-done">✓ gesetzt</span>` : m`<button @click=${i}>${c}</button>`}
    </div>`;
  }
  /** Detected sensors that belong to one section, each with "Übernehmen". */
  _topicSuggestions(t) {
    if (!this._detectIn.has(t)) return f;
    const e = this._suggestions;
    if (!e) return m`<p class="hint">Suche …</p>`;
    const s = this._draft, n = (a) => a.map((l) => this._name(l)).join(", "), i = [], o = (a, l) => {
      const h = e[a];
      h && i.push(
        this._suggestRow(
          l,
          this._name(h.value),
          h.source,
          s[a] === h.value,
          () => this._apply({ [a]: h.value }),
          [h.value]
        )
      );
    };
    if (t === "solar") {
      if (e.solar_strings) {
        const a = e.solar_strings.value, l = a.every((d) => (s.solar_strings ?? []).includes(d)), h = () => this._apply({ solar_strings: a });
        i.push(this._suggestRow("PV-Leistung", n(a), e.solar_strings.source, l, h, a));
      }
      o("solar_today", "PV-Ertrag heute"), o("solar_forecast_remaining", "PV-Prognose Rest heute");
    }
    if (t === "grid") {
      if (e.grid) {
        const a = e.grid.value, l = [a.grid_power, a.grid_import_power, a.grid_export_power].filter(($) => !!$), h = l.every(($) => [s.grid_power, s.grid_import_power, s.grid_export_power].includes($)), d = a.grid_mode === "split" ? `Bezug: ${this._name(a.grid_import_power)} · Einspeisung: ${this._name(a.grid_export_power)}` : n(l);
        i.push(this._suggestRow("Netz", d, e.grid.source, h, () => this._apply(a), l));
      }
      o("grid_import_today", "Bezug heute"), o("grid_export_today", "Einspeisung heute");
    }
    if (t === "tariff" && o("grid_price", "Strompreis"), t === "wallbox" && (o("wallbox_power", "Ladeleistung"), o("wallbox_soc", "Ladestand Auto")), t === "battery")
      for (const a of e.batteries ?? []) {
        const l = a.value, h = l.mode === "split" ? "Laden + Entladen" : "Leistung", d = a.duplicate ? " – vermutlich dieselbe Batterie wie eine andere" : "";
        i.push(
          this._suggestRow(
            l.name ?? "Batterie",
            `${h}${l.soc ? " + Ladestand" : ""}${d}`,
            a.source,
            this._hasBattery(l),
            () => this._applyBattery(l),
            [l.power, l.charge_power, l.discharge_power, l.soc],
            "Hinzufügen"
          )
        );
      }
    let c = f;
    if (t === "loads") {
      o("home_power", "Hausverbrauch gemessen");
      const a = /* @__PURE__ */ new Set([
        ...s.fixed_loads ?? [],
        ...s.flexible_loads ?? [],
        ...s.wallbox_power ? [s.wallbox_power] : [],
        ...(s.batteries ?? []).flatMap((h) => h.backup_loads ?? [])
      ]), l = (e.loads ?? []).filter((h) => !a.has(h.entity) && !this._skipped.has(h.entity));
      c = l.length ? m`<h3>Mögliche Verbraucher</h3>
            ${l.map(
        (h) => m`<div class="sg-row">
                <div class="sg-text">
                  <span>${this._name(h.entity)}</span>
                  <small>${this._facts(h.entity, h.source)}</small>
                  ${this._usedLine(h.entity)}${this._nameChips(h.entity)}
                </div>
                <div class="sg-btns">
                  <button @click=${() => this._applyLoad(h.entity, "fixed_loads")}>Grundlast</button>
                  <button @click=${() => this._applyLoad(h.entity, "flexible_loads")}>Zusatzverbraucher</button>
                  <button
                    class="skip"
                    title="Ausblenden – beim nächsten „Sensoren erkennen“ wieder dabei"
                    @click=${() => this._skipped = /* @__PURE__ */ new Set([...this._skipped, h.entity])}
                  >
                    Jetzt nicht
                  </button>
                </div>
              </div>`
      )}` : f;
    }
    return m`<div class="suggest">
      <div class="sg-head">
        <h3>Gefunden</h3>
        <button @click=${() => this._detectIn = new Set([...this._detectIn].filter((a) => a !== t))}>
          Schließen
        </button>
      </div>
      ${i.length || c !== f ? i : m`<p class="hint">Hier nichts Passendes gefunden – bitte unten selbst wählen.</p>`}
      ${c}
      <p class="hint">Übernommenes landet im Entwurf – erst „Speichern“ übernimmt es.</p>
    </div>`;
  }
  // -- render ---------------------------------------------------------------------------
  _form(t, e, s, n = {}, i = {}) {
    return m`<ha-form
      .hass=${this.hass}
      .data=${e}
      .schema=${t}
      .computeLabel=${(o) => n[o.name] ?? wn[o.name] ?? o.name}
      .computeHelper=${(o) => i[o.name] ?? xn[o.name]}
      @value-changed=${s}
    ></ha-form>`;
  }
  _section(t, e, s, n, i, o = !0) {
    const c = ae.includes(t), a = this._isOn(t), l = a && this._open.has(t), d = m`<div class="section" data-focus=${t}>
      <div class="head">
        <button class="fold" ?disabled=${!a} @click=${() => this._toggleOpen(t)} aria-expanded=${l}>
          <span class="chev ${l ? "open" : ""}">›</span>
          <span class="htitle">${e}</span>
          ${(this._draft.checked ?? []).includes(t) ? m`<span class="tick" title="geprüft und gespeichert">✓</span>` : f}
        </button>
        ${c ? m`<div class="yesno" role="group" aria-label=${i ?? e}>
              <button class=${a ? "on" : ""} ?disabled=${!1} @click=${() => this._answer(t, !0)}>Ja</button>
              <button class=${a ? "" : "on"} @click=${() => this._answer(t, !1)}>Nein</button>
            </div>` : f}
      </div>
      ${c && !l ? m`<p class="hint q">${i}</p>` : f}
      ${l ? m`${n ? m`<p class="hint">${n}</p>` : f}
            ${o ? m`<button class="secondary detect" ?disabled=${this._detecting} @click=${() => this._detect(t)}>
                  ${this._detecting ? "Suche …" : "Sensoren erkennen"}
                </button>` : f}
            ${this._topicSuggestions(t)} ${s()}
            <div class="secsave">
              <button class="primary" ?disabled=${this._saving} @click=${() => this._saveSection(t)}>
                ${this._saving ? "Speichert …" : "Speichern"}
              </button>
            </div>` : f}
    </div>`;
    return this.compact ? m`<div class="plain">${d}</div>` : m`<ha-card>${d}</ha-card>`;
  }
  render() {
    if (!this._ready || !this._loadedFor) return m`<div class="hint">Lade …</div>`;
    const t = this._draft, e = t.batteries ?? [], s = this._saving, n = this._message ? m`<span class="msg ${this._message.kind}">${this._message.text}</span>` : m`<span class="msg">${this.dirty ? "Noch nicht gespeichert – im Abschnitt auf „Speichern“." : ""}</span>`;
    return m`
      <div class="actions">
        ${n}
        <button class="secondary" ?disabled=${!this.dirty || s} @click=${this.discard}>Verwerfen</button>
      </div>
      ${this._section(
      "general",
      "Allgemein",
      () => m`${this._form(
        pn,
        { title: this._title, energy_period: t.energy_period ?? "midnight" },
        (i) => this._onForm(i, ["title", "energy_period"])
      )}
            <div class="lookrow">
              <span>Look der Karte</span>
              <div class="yesno" role="group" aria-label="Look">
                <button class=${this._look === "glass" ? "on" : ""} @click=${() => this._setLook("glass")}>Glas</button>
                <button class=${this._look === "classic" ? "on" : ""} @click=${() => this._setLook("classic")}>Klassik</button>
              </div>
            </div>`,
      void 0,
      void 0,
      !1
    )}
      ${this._section(
      "grid",
      "Netz",
      () => m`${this._form(
        fn(t),
        { grid_mode: "combined", ...t },
        (i) => this._onForm(i, gn)
      )}${this._gridLive()}`,
      "Ein Sensor mit + und − (positiv = Bezug) oder getrennt, z. B. Tibber Pulse: „Leistung“ und „Leistung Produktion“."
    )}
      ${this._section(
      "battery",
      "Batteriespeicher",
      () => m`${e.map((i, o) => {
        const c = { mode: "combined", ...i };
        return m`<div class="sub" data-focus=${`battery-${o}`}>
            <div class="subhead">
              <h3>Batterie ${o + 1}${i.name ? ` – ${i.name}` : ""}</h3>
              <button class="link" @click=${() => this._removeBattery(o)}>Entfernen</button>
            </div>
            ${this._form(_n(i, !1), c, (a) => this._onBattery(o, a))}
            ${this._batteryLive(i, o)}
            ${this._backupPart(i, o)}
          </div>`;
      })}
        ${e.length < It ? m`<button class="add" @click=${this._addBattery}>+ Batterie hinzufügen</button>` : f}`,
      `Ein Sensor mit + und − (positiv = lädt, sonst Schalter setzen) oder zwei getrennte Sensoren für Laden und Entladen. Bis zu ${It} Batterien.`,
      "Hast du einen oder mehrere Batteriespeicher?"
    )}
      ${this._section(
      "solar",
      "Photovoltaik",
      () => m`${this._form(
        un,
        t,
        (i) => this._onForm(i, ["solar_strings", "solar_total", "solar_today", "solar_forecast_remaining"])
      )}${this._solarLive()}`,
      "Ein Sensor je Strang (z. B. Dachseite), höchstens 4 – jeder wird ein Feld auf dem Solarmodul.",
      "Hast du Solarpanele?"
    )}
      ${this._section(
      "tariff",
      "Dynamischer Stromtarif",
      () => this._form($n, t, (i) => this._onForm(i, ["grid_price"])),
      "Preis-Sensor in €/kWh, z. B. von Tibber.",
      "Hast du einen dynamischen Stromtarif (z. B. Tibber)?"
    )}
      ${this._section(
      "wallbox",
      "E-Auto / Wallbox",
      () => m`${this._form(
        bn,
        { wallbox_flexible: !0, ...t },
        (i) => this._onForm(i, ["wallbox_name", "wallbox_power", "wallbox_soc", "wallbox_flexible"])
      )}${this._wallboxLive()}`,
      "Hängt am Wechselrichter und zählt zum Hausverbrauch; standardmäßig als Zusatzverbraucher.",
      "Hast du ein E-Auto oder eine Wallbox?"
    )}
      ${this._section(
      "loads",
      "Verbraucher",
      () => m`${this._form(
        yn,
        t,
        (i) => this._onForm(i, ["fixed_loads", "flexible_loads", "home_power"])
      )}${this._namesEditor()}${this._loadsLive()}${this._parentsEditor()}`,
      "Alle Verbraucher zählen zum Haus. Grundlast läuft sowieso, Zusatzverbraucher lassen sich zeitlich verschieben."
    )}
    `;
  }
};
ze.styles = se`
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
      overflow-wrap: anywhere;
    }
    .chips {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
      padding: 4px 0;
    }
    .chips small,
    .name-row > small {
      color: var(--secondary-text-color);
    }
    button.chip,
    .suggest button.chip {
      padding: 2px 10px;
      font-size: 12px;
      text-align: left;
    }
    button.chip span {
      margin-left: 6px;
      font-weight: 400;
      opacity: 0.7;
    }
    button.chip.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .names {
      margin-top: 16px;
    }
    .name-row {
      padding: 8px 0;
      border-top: 1px solid var(--divider-color);
      font-size: 13px;
    }
    .name-row label {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }
    .name-row label span {
      flex: 1;
      min-width: 140px;
      overflow-wrap: anywhere;
    }
    .name-row input {
      flex: 1;
      min-width: 140px;
      font: inherit;
      padding: 6px 8px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
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
    .head {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    button.fold {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      border: none;
      padding: 4px 0;
      border-radius: 0;
      color: var(--primary-text-color);
      text-align: left;
    }
    button.fold:disabled {
      opacity: 1;
    }
    .htitle {
      font-size: 18px;
      font-weight: 500;
    }
    .chev {
      display: inline-block;
      width: 14px;
      font-size: 20px;
      line-height: 1;
      transition: transform 0.15s;
      color: var(--secondary-text-color);
    }
    .chev.open {
      transform: rotate(90deg);
    }
    button.fold:disabled .chev {
      visibility: hidden;
    }
    .yesno {
      display: flex;
    }
    .yesno button {
      padding: 4px 14px;
      border-radius: 0;
    }
    .yesno button:first-child {
      border-radius: 16px 0 0 16px;
    }
    .yesno button:last-child {
      border-radius: 0 16px 16px 0;
      border-left: none;
    }
    .yesno button.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .hint.q {
      margin: 4px 0 0 22px;
    }
    button.detect {
      margin: 4px 0 12px;
    }
    .flash {
      animation: ef-flash 1.8s ease-out;
    }
    @keyframes ef-flash {
      0%,
      30% {
        box-shadow: 0 0 0 3px var(--primary-color, #03a9f4);
        border-radius: 8px;
      }
      100% {
        box-shadow: 0 0 0 3px transparent;
        border-radius: 8px;
      }
    }
    .sg-btns .skip {
      opacity: 0.75;
    }
    .secsave {
      display: flex;
      justify-content: flex-end;
      margin-top: 14px;
    }
    .tick {
      color: var(--success-color, #43a047);
      font-weight: 700;
    }
    .lookrow {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-top: 8px;
    }
    .backup {
      margin-top: 10px;
      padding-top: 8px;
      border-top: 1px dashed var(--divider-color);
    }
    .bq {
      flex: 1;
      font-size: 14px;
      font-weight: 500;
    }
  `;
let T = ze;
N([
  ft({ attribute: !1 })
], T.prototype, "hass");
N([
  ft({ attribute: !1 })
], T.prototype, "entryId");
N([
  ft({ type: Boolean })
], T.prototype, "compact");
N([
  H()
], T.prototype, "_ready");
N([
  H()
], T.prototype, "_loadedFor");
N([
  H()
], T.prototype, "_title");
N([
  H()
], T.prototype, "_draft");
N([
  H()
], T.prototype, "_saved");
N([
  H()
], T.prototype, "_saving");
N([
  H()
], T.prototype, "_message");
N([
  H()
], T.prototype, "_computed");
N([
  H()
], T.prototype, "_suggestions");
N([
  H()
], T.prototype, "_detecting");
N([
  H()
], T.prototype, "_usage");
N([
  H()
], T.prototype, "_look");
N([
  H()
], T.prototype, "_open");
N([
  H()
], T.prototype, "_choice");
N([
  H()
], T.prototype, "_detectIn");
N([
  H()
], T.prototype, "_skipped");
N([
  H()
], T.prototype, "_backupYes");
customElements.get("energiefluss-editor") || customElements.define("energiefluss-editor", T);
const Mn = "energiefluss-edit";
function Je(r, t) {
  for (const e of r) {
    if (e.entity === t || e.today === t) return e.entity;
    const s = (e.children ?? []).find((n) => n.entity === t || n.today === t);
    if (s) return s.entity;
  }
}
function An(r, t) {
  const e = r.entities, s = (...i) => i.some((o) => !!o && o === t);
  if (s(e.solar_power, e.surplus, r.solar.today, r.solar.forecast_remaining) || r.solar.strings.some((i) => i.entity === t))
    return { topic: "solar", entity: t };
  for (const [i, o] of r.batteries.entries())
    if (s(o.power, o.soc, o.charge, o.discharge) || Je(o.backup ?? [], t))
      return { topic: "battery", battery: i, entity: t };
  if (s(e.battery_power, e.battery_soc, e.battery_energy, e.backup_power)) return { topic: "battery", entity: t };
  if (r.wallbox && s(r.wallbox.power, r.wallbox.soc, r.wallbox.today, e.wallbox_power)) return { topic: "wallbox", entity: t };
  if (s(r.grid.price)) return { topic: "tariff", entity: t };
  if (s(e.grid_power, e.grid_import, e.grid_export, r.grid.import_today, r.grid.export_today, r.grid.export_price))
    return { topic: "grid", entity: t };
  const n = Je([...r.loads.fixed, ...r.loads.flexible], t);
  if (n) return { topic: "loads", load: n, entity: t };
  if (s(e.home_power, e.fixed_power, e.flexible_power, e.unmeasured_power, r.home_today, r.unmeasured_today))
    return { topic: "loads", entity: t };
}
const Qe = /^[a-z0-9_]+\.[a-z0-9_]+$/;
function Sn(r) {
  const t = /* @__PURE__ */ new Set(), e = (s) => {
    if (typeof s == "string")
      Qe.test(s) && t.add(s);
    else if (Array.isArray(s))
      s.forEach(e);
    else if (s && typeof s == "object")
      for (const [n, i] of Object.entries(s))
        Qe.test(n) && t.add(n), e(i);
  };
  return e(r), t;
}
function En(r, t, e) {
  for (const s of r) if (t[s] !== e[s]) return !0;
  return !1;
}
var Ln = Object.defineProperty, oe = (r, t, e, s) => {
  for (var n = void 0, i = r.length - 1, o; i >= 0; i--)
    (o = r[i]) && (n = o(t, e, n) || n);
  return n && Ln(t, e, n), n;
};
const Hn = {
  entry_id: "Anlage",
  title: "Titel der Karte (optional)",
  flow_style: "Animation",
  max_power: "Leistung für größte bzw. schnellste Punkte"
}, zn = {
  max_power: "Ab dieser Leistung sind die Punkte am größten bzw. schnellsten. Standard 5000 W."
}, Ce = class Ce extends dt {
  constructor() {
    super(...arguments), this._instances = [], this._ready = !1;
  }
  setConfig(t) {
    this._config = t;
  }
  async firstUpdated() {
    await xs(), this.hass && (this._instances = await this.hass.callWS({ type: "energiefluss/instances" })), this._ready = !0;
  }
  get _entryId() {
    return this._config?.entry_id ?? this._instances[0]?.entry_id;
  }
  _schema() {
    const t = [];
    return this._instances.length > 1 && t.push({
      name: "entry_id",
      selector: {
        select: { mode: "dropdown", options: this._instances.map((e) => ({ value: e.entry_id, label: e.title })) }
      }
    }), t.push(
      { name: "title", selector: { text: {} } },
      {
        name: "flow_style",
        selector: {
          select: {
            mode: "list",
            options: [
              { value: "speed", label: "Tempo der Punkte zeigt die Leistung" },
              { value: "size", label: "Größe der Punkte zeigt die Leistung" }
            ]
          }
        }
      },
      { name: "max_power", selector: { number: { min: 500, max: 3e4, step: 100, mode: "box", unit_of_measurement: "W" } } }
    ), t;
  }
  _cardChanged(t) {
    t.stopPropagation();
    const e = { ...this._config, ...t.detail.value };
    for (const s of ["entry_id", "title", "max_power", "flow_style"])
      (e[s] === void 0 || e[s] === "" || e[s] === null) && delete e[s];
    this._config = e, this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: e }, bubbles: !0, composed: !0 }));
  }
  render() {
    return !this._ready || !this._config ? m`<div class="hint">Lade …</div>` : this._instances.length ? m`
      <h2>Karte</h2>
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._schema()}
        .computeLabel=${(t) => Hn[t.name] ?? t.name}
        .computeHelper=${(t) => zn[t.name]}
        @value-changed=${this._cardChanged}
      ></ha-form>
      <h2 class="spaced">Anlage</h2>
      <p class="hint">
        Gilt für alle Karten dieser Anlage. Änderungen hier mit <b>„Anlage speichern“</b> übernehmen – das
        Speichern unten im Dialog speichert nur die Karten-Einstellungen oben.
      </p>
      ${this._entryId ? m`<energiefluss-editor compact .hass=${this.hass} .entryId=${this._entryId}></energiefluss-editor>` : f}
    ` : m`<div class="hint">
        Noch keine Anlage angelegt: Einstellungen → Geräte &amp; Dienste → Integration hinzufügen → „Wattrio“.
      </div>`;
  }
};
Ce.styles = se`
    :host {
      display: block;
    }
    h2 {
      margin: 0 0 8px;
      font-size: 18px;
      font-weight: 500;
    }
    h2.spaced {
      margin-top: 24px;
    }
    .hint {
      margin: 0 0 8px;
      color: var(--secondary-text-color);
      font-size: 13px;
    }
  `;
let _t = Ce;
oe([
  ft({ attribute: !1 })
], _t.prototype, "hass");
oe([
  H()
], _t.prototype, "_config");
oe([
  H()
], _t.prototype, "_instances");
oe([
  H()
], _t.prototype, "_ready");
customElements.get("energiefluss-card-editor") || customElements.define("energiefluss-card-editor", _t);
var Cn = Object.defineProperty, kt = (r, t, e, s) => {
  for (var n = void 0, i = r.length - 1, o; i >= 0; i--)
    (o = r[i]) && (n = o(t, e, n) || n);
  return n && Cn(t, e, n), n;
};
const Tn = (r) => r.reduce((t, e) => t + 1 + (e.children?.length ?? 0), 0), Pn = {
  solar: "#ff9800",
  battery: "#ff69b4",
  grid: "#5490c2",
  home: "#5fb6ad",
  flexible: "#9575cd",
  backup: "#ef5350",
  inverter: "#959595"
}, Bn = 554, On = 148, ts = 400, es = 240, Zt = 22, F = 396, st = F - 20, rt = 504, nt = 40, tt = 550, it = 42, Nn = 22, ss = 358, In = 37, ns = 364, is = 370, B = 5, os = 40, Rn = 14, Fn = 0.8, Wn = "M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z", Vn = "M8.28,5.45L6.5,4.55L7.76,2H16.24L17.5,4.55L15.72,5.45L15,4H9L8.28,5.45M18.62,8H14.09L13.3,5H10.7L9.91,8H5.38L4.1,10.55L5.89,11.44L6.62,10H17.38L18.1,11.44L19.89,10.55L18.62,8M17.77,22H15.7L15.46,21.1L12,15.9L8.53,21.1L8.3,22H6.23L9.12,11H11.19L10.83,12.35L12,14.1L13.16,12.35L12.81,11H14.88L17.77,22M11.4,15L10.5,13.65L9.32,18.13L11.4,15M14.68,18.12L13.5,13.64L12.6,15L14.68,18.12Z", Un = "M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z", jn = "M4,2H20A2,2 0 0,1 22,4V14A2,2 0 0,1 20,16H15V20H18V22H13V16H11V22H6V20H9V16H4A2,2 0 0,1 2,14V4A2,2 0 0,1 4,2M4,4V8H11V4H4M4,14H11V10H4V14M20,14V10H13V14H20M20,4H13V8H20V4Z", Te = class Te extends dt {
  constructor() {
    super(...arguments), this.editMode = !1, this._expanded = /* @__PURE__ */ new Set(), this._loading = !1, this._onUpdated = (t) => {
      const e = t.detail?.entry_id;
      (!e || !this._layout || e === this._layout.entry_id) && (this._layout = void 0, this._loadLayout());
    }, this._onTap = (t) => {
      const s = t.composedPath().find((i) => i instanceof Element && i.hasAttribute("data-entity"))?.getAttribute("data-entity");
      if (!s) return;
      const n = this.editMode && this._layout ? An(this._layout, s) : void 0;
      if (n) {
        this.dispatchEvent(new CustomEvent(Mn, { detail: n, bubbles: !0, composed: !0 }));
        return;
      }
      this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: s }, bubbles: !0, composed: !0 }));
    };
  }
  static getStubConfig() {
    return {};
  }
  /** Visual editor in the dashboard's "edit card" dialog. */
  static getConfigElement() {
    return document.createElement("energiefluss-card-editor");
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener(Qt, this._onUpdated);
  }
  disconnectedCallback() {
    window.removeEventListener(Qt, this._onUpdated), super.disconnectedCallback();
  }
  setConfig(t) {
    this._config = t, this._layout = void 0;
  }
  getCardSize() {
    return 8;
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: "auto" };
  }
  // Home Assistant hands over a new `hass` on every state change anywhere in
  // the house: redraw only when one of this card's sensors (or the language)
  // changed. Everything else (config, layout, unfolded lists, the settings
  // mode, a look's own requests) always redraws.
  shouldUpdate(t) {
    if (t.size !== 1 || !t.has("hass")) return !0;
    const e = t.get("hass"), s = this.hass;
    return !e || !s || !this._layout || e.locale?.language !== s.locale?.language ? !0 : (this._watched?.layout !== this._layout && (this._watched = { layout: this._layout, ids: [...Sn(this._layout)] }), En(this._watched.ids, e.states, s.states));
  }
  updated(t) {
    (t.has("hass") || t.has("_config")) && this.hass && !this._layout && !this._loading && this._loadLayout();
  }
  async _loadLayout() {
    if (this.hass) {
      this._loading = !0;
      try {
        const t = { type: "energiefluss/config" };
        this._config?.entry_id && (t.entry_id = this._config.entry_id);
        const e = await this.hass.callWS(t);
        this._layout = e.instance, this._error = void 0;
      } catch (t) {
        this._error = t?.message ?? "Wattrio-Integration nicht gefunden. Bitte unter Einstellungen → Geräte & Dienste einrichten.";
      } finally {
        this._loading = !1;
      }
    }
  }
  // -- state helpers --------------------------------------------------------
  _s(t) {
    return t ? this.hass?.states[t] : void 0;
  }
  _w(t) {
    return G(this._s(t));
  }
  _own(t) {
    return C(this._s(this._layout?.entities[t]));
  }
  _name(t) {
    const e = this._layout?.names?.[t];
    return e || (this._s(t)?.attributes.friendly_name ?? t.split(".")[1]);
  }
  get _loc() {
    return this.hass?.locale?.language ?? "de";
  }
  get _c() {
    return { ...Pn, ...this._config?.colours ?? {} };
  }
  get _max() {
    return this._config?.max_power ?? 5e3;
  }
  /** Top left corners of the PV string tiles. */
  get _stringPos() {
    return [
      [10, 10],
      [80, 10],
      [10, 58],
      [80, 58]
    ];
  }
  /** Left edge and width of the "PV gesamt" box. */
  get _pvBox() {
    return [45, 70];
  }
  /** Top of the "PV gesamt" box (26 high). */
  get _pvBoxY() {
    return 108;
  }
  /** Top of the storage box above the batteries. */
  get _storeY() {
    return es;
  }
  /** The card is at least this tall. */
  get _minViewH() {
    return ts;
  }
  /** Room the card keeps below the top of the lowest battery. */
  get _batteryTail() {
    return 138;
  }
  /** Height of one load list row; looks may make the lists denser. */
  get _rowH() {
    return Nn;
  }
  /** Makes `content` open the more-info dialog of `entity` when clicked. */
  _tap(t, e) {
    return t ? _`<g class="tap" data-entity=${t}>${e}</g>` : e;
  }
  /** Font size for text set in the templates; looks may scale all of it. */
  _fs(t) {
    return t;
  }
  // -- layout knobs that alternative looks may move ----------------------------
  /** Left edge of the inverter box (60 x 60). */
  get _invX() {
    return On;
  }
  /** Top of the house value box (70 x 26 at x 215). */
  get _houseY() {
    return 70;
  }
  /** Top edge of the inverter box. */
  get _invY() {
    return 170;
  }
  /** Where the house line leaves the inverter (top) ... */
  get _invTop() {
    return [this._invX + 30, this._invY];
  }
  /** ... and where the storage line leaves it (bottom). */
  get _invBottom() {
    return [this._invX + 30, this._invY + 60];
  }
  /** Where the PV line leaves the PV total box (x) and enters the inverter (y). */
  get _solarX() {
    return 80;
  }
  get _solarY() {
    return this._invY + 15;
  }
  /** Whether the not measured part of the house is a row of its own in the
   *  "Grundlast" (base load) list (instead of a small note below the house). */
  get _unmeasuredInList() {
    return !1;
  }
  /** Where a battery's own (backup) output leaves the battery symbol, to the right. */
  _batteryOutX(t, e) {
    return t + 10;
  }
  /** Path of the house line's dots (from the inverter into the house box);
   *  null = along the drawn line. */
  _houseIn() {
    return null;
  }
  /** Drawn where the house line's dots end (nothing in the classic look). */
  _houseJunction(t) {
    return _``;
  }
  /** Path inside the house box to its right side at height `y` (where a load
   *  list's trunk starts); null = the list's dots start at the box's side. */
  _houseLead(t) {
    return null;
  }
  /** Path inside a battery up to its own (backup) output at height `y`; null =
   *  the backup dots start at the battery's side. */
  _batteryLead(t, e, s, n) {
    return null;
  }
  /** Path from a PV string tile (top left x, y) through the PV total box to the
   *  inverter; null = one dot line from the PV total box only. */
  _stringRoute(t, e) {
    return null;
  }
  /** Dots of several routes that share part of their way: the PV strings (they
   *  join at the PV total box) or the batteries (they part at the storage box).
   *  Looks may let them form one train there. */
  _trainDots(t, e, s) {
    return _`${s.map((n) => this._dot(n.route, e, n.w, n.forward))}`;
  }
  /** Balls (radius, colour) a load's dots consist of, for looks that count the
   *  power in balls; null = one wagon per load whose size shows the power. */
  _wagonBalls(t, e, s) {
    return null;
  }
  /** One train for a whole group on its shared feed (house to the list's
   *  bracket); null = every load's wagon rides the whole way from the house. */
  _feedTrain(t, e, s, n) {
    return null;
  }
  /** Dots of the house line (from the inverter to the house). */
  _houseDots(t, e, s) {
    return this._dot(t, e, s, !0);
  }
  /** Speed of the load list trains in px per second. */
  get _wagonSpeed() {
    return os;
  }
  /** A battery's whole route from the inverter through the storage box to the
   *  battery (for dots that pass through the box); null = dots stop at the box. */
  _batteryRoute(t, e) {
    return null;
  }
  /**
   * Power on the line between a battery and the storage box (+ = into the
   * battery). Usually its own power; a battery that can only give power to
   * its backup loads (e.g. EcoFlow) only ever takes power in: its input,
   * including what it just passes through to its backup loads.
   */
  _lineFlow(t, e) {
    const s = this._layout?.batteries.find((n) => n.name === t);
    return s?.backup_only ? Math.max(this._w(s.charge) ?? 0, 0) : e === null || !s?.backup?.length ? e : e + Math.max(this._sumW(s.backup) ?? 0, 0);
  }
  /** Today's energy of the house net: the house's daily energy minus that of all
   *  backup loads (each has its own daily counter). */
  get _houseNetToday() {
    const t = C(this._s(this._layout?.home_today));
    if (t === null) return null;
    const e = (this._layout?.batteries ?? []).flatMap((s) => s.backup ?? []).reduce((s, n) => s + (C(this._s(n.today)) ?? 0), 0);
    return Math.max(t - e, 0);
  }
  /** Active power of all backup loads: batteries feed them straight from their own
   *  output, they are not on the house net. Their own sensors, not a battery's
   *  output (that may be apparent power and include its own consumption). */
  get _offGridLoads() {
    return (this._layout?.batteries ?? []).reduce((t, e) => t + Math.max(this._sumW(e.backup ?? []) ?? 0, 0), 0);
  }
  /** Horizontal offset of the whole storage area (n = number of batteries). */
  _batteryShift(t) {
    return 0;
  }
  /** Whether the wallbox is shown as a group in the load lists on the right. */
  get _wallboxInList() {
    return !0;
  }
  // -- svg building blocks --------------------------------------------------
  /** A line with an animated dot. `forward` = dot travels along the path direction. */
  _flow(t, e, s, n, i = !0) {
    return _`
      <path d=${t} fill="none" stroke=${e} stroke-width=${en(s, this._max)} stroke-opacity="0.85" />
      ${i ? this._dot(t, e, s, n) : f}
    `;
  }
  /** Only the moving dot (for paths whose line is drawn elsewhere). */
  get _bySize() {
    return this._config?.flow_style === "size";
  }
  /**
   * One moving dot. "size" style: constant speed, the dot's size shows the
   * power; default "speed" style: the reverse. `timing` lets a group of dots
   * share one period and start staggered (see _loadList).
   */
  _dot(t, e, s, n = !0, i = 3.2, o) {
    if (s === null || Math.abs(s) < B) return _``;
    const c = this._bySize, a = o?.radius ?? (c ? Math.max(1.7, ln(s, this._max) * (i / 3.2)) : i);
    if (o) {
      const h = (o.travel / o.period).toFixed(4), d = { dur: `${o.period.toFixed(2)}s`, begin: `${o.begin.toFixed(2)}s` };
      return this._orb(
        a,
        e,
        _`<animateMotion dur=${d.dur} begin=${d.begin} repeatCount="indefinite" calcMode="linear" rotate="auto"
            keyPoints="0;1;1" keyTimes=${`0;${h};1`} path=${t} />
          <animate attributeName="opacity" dur=${d.dur} begin=${d.begin} repeatCount="indefinite"
            calcMode="discrete" values="1;0" keyTimes=${`0;${h}`} />`,
        !0
      );
    }
    const l = this._dotDuration(t, s);
    return this._orb(
      a,
      e,
      _`<animateMotion dur=${`${l.toFixed(2)}s`} repeatCount="indefinite" calcMode="linear"
        rotate=${n ? "auto" : "auto-reverse"}
        keyPoints=${n ? "0;1" : "1;0"} keyTimes="0;1" path=${t} />`
    );
  }
  /** Seconds a (non-train) dot needs for path `d`; looks use it to sync their own effects. */
  _dotDuration(t, e) {
    return this._bySize ? Math.max(0.6, $e(t) / os) : tn(e, this._max);
  }
  /** Draws a moving dot; `motion` holds its animation elements. Looks override this. */
  _orb(t, e, s, n = !1) {
    return _`<circle r=${t} fill=${e} opacity=${n ? "0" : f}>${s}</circle>`;
  }
  /** Drawn last, on top of everything (nothing in the classic look). */
  _overlay() {
    return _``;
  }
  /** Extra <defs> (filters, gradients) for alternative looks. */
  _defs() {
    return _``;
  }
  /** Background of a box; looks override this. */
  _panel(t, e, s, n, i) {
    return _`<rect x=${t} y=${e} width=${s} height=${n} rx="4" fill="none" stroke=${i} stroke-width="1" />`;
  }
  _box(t, e, s, n, i, o, c = 12) {
    return _`
      ${this._panel(t, e, s, n, i)}
      <text x=${t + s / 2} y=${e + n / 2 + c * 0.35} text-anchor="middle" class="val" font-size=${this._fs(c)}>${o}</text>
    `;
  }
  _icon(t, e, s, n, i) {
    return _`<path d=${t} fill=${i} transform=${`translate(${e} ${s}) scale(${n / 24})`} />`;
  }
  // -- sections ---------------------------------------------------------------
  _solar() {
    const t = this._layout, e = this._c.solar, s = this._own("solar_power"), n = t.solar.strings.slice(0, 4), i = this._stringPos, o = this._pvBoxY, [c, a] = this._pvBox, l = c + a + 6, h = Ot(this._s(t.solar.today)), d = Ot(this._s(t.solar.forecast_remaining)), $ = n.map((g, v) => this._stringRoute(i[v][0], i[v][1])), u = n.length > 0 && $.every((g) => g !== null), y = `M ${this._solarX} ${o + 26} V ${this._solarY} H ${this._invX}`;
    return _`
      ${this._solarBack()}
      ${u ? (
      // the line first, the strings' dots on it, tiles and box on top (dots pass below the glass)
      _`${this._flow(y, e, s, !0, !1)}
            ${this._trainDots("pv", e, n.map((g, v) => ({ route: $[v], w: this._w(g.entity), forward: !0 })))}`
    ) : f}
      ${n.map((g, v) => {
      const [w, x] = i[v];
      return this._tap(g.entity, this._stringTile(w, x, g.entity, e));
    })}
      ${this._solarIcon(e)}
      ${this._tap(t.entities.solar_power, this._box(c, o, a, 26, e, L(s, this._loc), 13))}
      <text x=${l} y=${o + 9} class="lbl">PV gesamt</text>
      ${h !== null ? _`<text x=${l} y=${o + 22} class="small" fill=${e}>${V(h, this._loc)} heute</text>` : f}
      ${d !== null ? _`<text x=${l} y=${o + 34} class="small">Rest ${V(d, this._loc)}</text>` : f}
      ${u ? f : this._flow(y, e, s, !0)}
    `;
  }
  /** Drawn first in the PV section, below the string tiles (nothing in the classic look). */
  _solarBack() {
    return _``;
  }
  /** Symbol next to the PV strings. */
  _solarIcon(t) {
    return this._icon(jn, 152, 34, 26, t);
  }
  /** One PV string: value box with its name below (tile at x, y; 60 x 38 available). */
  _stringTile(t, e, s, n) {
    return _`${this._box(t, e, 60, 24, n, L(this._w(s), this._loc), 11)}
      <text x=${t} y=${e + 35} class="lbl">${bt(this._name(s), 14)}</text>`;
  }
  /** Batteries in display order: those with a backup output go to the right. */
  _displayBatteries() {
    const t = this._layout?.batteries ?? [], e = t.filter((a) => !(a.backup ?? []).length), s = t.filter((a) => (a.backup ?? []).length), n = [...e, ...s], i = rn(n.length), o = this._batteryShift(n.length), c = this._storeY - es;
    return n.map((a, l) => ({ ...a, ...i[l], cx: i[l].cx + o, top: i[l].top + c, index: l }));
  }
  _batteries() {
    const t = this._layout, e = this._c.battery;
    if (!t.batteries.length) return _``;
    const s = this._own("battery_soc"), n = this._own("battery_energy"), i = this._displayBatteries();
    i.length;
    const o = i.map((x) => this._lineFlow(x.name, C(this._s(x.power)))), a = i.some((x) => x.backup_only || (x.backup ?? []).length) ? o.reduce((x, k) => k === null ? x : (x ?? 0) + k, null) : this._own("battery_power"), l = Math.min(...i.map((x) => x.cx - x.w / 2)), h = Math.max(...i.map((x) => x.cx + x.w / 2)) - l, [d, $] = this._invBottom, u = this._storeY, y = Math.min(Math.max(d, l + 10), l + h - 10), g = y === d ? `M ${d} ${$} V ${u}` : `M ${d} ${$} V ${u - 5} H ${y} V ${u}`, v = i.map((x) => this._batteryRoute(x.cx, x.top)), w = v.every((x) => x !== null);
    return _`
      ${i.map((x, k) => {
      const { cx: O, top: S, w: P } = x, I = C(this._s(x.power)), X = C(this._s(x.soc)), W = `M ${O} ${u + Zt} V ${S}`, U = I === null ? "" : I > B ? "lädt" : I < -B ? "entlädt" : "ruht", K = o[k];
      return _`
          ${this._flow(W, e, K, (K ?? 0) > 0, !w)}
          ${this._tap(x.power, this._batteryWidget(x.name, O, S, P, I, X, U, e, x.capacity_kwh))}
        `;
    })}
      ${this._flow(g, e, a, (a ?? 0) > 0, !w)}
      ${w ? this._trainDots(
      "battery",
      e,
      i.map((x, k) => ({ route: v[k], w: o[k], forward: (o[k] ?? 0) > 0 }))
    ) : f}
      ${this._tap(t.entities.battery_soc, this._box(
      l,
      u,
      h,
      Zt,
      e,
      [
        `${h >= 120 ? "Speicher " : ""}${Ht(s, this._loc)}`,
        n !== null && h >= 80 ? V(n, this._loc) : "",
        // what all batteries together take in or give out right now
        a !== null && Math.abs(a) >= B && h >= 110 ? `${h >= 200 ? a > 0 ? "lädt " : "entlädt " : a > 0 ? "+" : "−"}${L(Math.abs(a), this._loc)}` : ""
      ].filter(Boolean).join(" · "),
      h >= 150 ? 11 : 10
    ))}
    `;
  }
  /** One battery below the storage box: widget spans top .. top + 104 around cx. */
  _batteryWidget(t, e, s, n, i, o, c, a, l = null) {
    const h = n < 54, d = Math.max(0, Math.min(100, o ?? 0));
    return _`
      ${this._box(e - n / 2, s, n, 22, a, L(i === null ? null : Math.abs(i), this._loc), h ? 10 : 11)}
      <text x=${e} y=${s + 32} text-anchor="middle" class="tiny">${c}</text>
      <rect x=${e - 9} y=${s + 42} width="18" height="32" rx="3" fill="none" stroke=${a} />
      <rect x=${e - 4} y=${s + 39} width="8" height="3" fill=${a} />
      <rect x=${e - 7} y=${s + 72 - 28 * d / 100} width="14" height=${28 * d / 100} rx="1" fill=${a} fill-opacity="0.7" />
      <text x=${e} y=${s + 91} text-anchor="middle" class="soc">${Ht(o, this._loc)}</text>
      <text x=${e} y=${s + 104} text-anchor="middle" class="tiny">${bt(t, h ? 10 : 14)}</text>
    `;
  }
  _inverter() {
    const t = this._c.inverter, e = this._invX, s = this._invY;
    return _`
      <rect x=${e} y=${s} width="60" height="60" rx="6" fill="none" stroke=${t} stroke-width="1.5" />
      <path d=${`M ${e + 12} ${s + 40} q 6 -12 12 0 t 12 0`} fill="none" stroke=${t} stroke-width="1.5" />
      <line x1=${e + 12} y1=${s + 20} x2=${e + 48} y2=${s + 20} stroke=${t} stroke-width="1.5" />
    `;
  }
  /**
   * All load groups on the right, top to bottom, with their positions and the
   * feed path (trunk) from their source: house, inverter backup output or a
   * battery's own output (one group per battery).
   */
  _groups() {
    const t = this._layout;
    if (!t) return [];
    const e = this._c, s = st, n = [], i = this._rowH, o = i / 2 - 1;
    let c = this._groupsTop;
    const a = (g, v, w, x, k, O, S, P) => {
      if (!w.length) return;
      const I = this._listLimit(g), X = I !== null && w.length > I, W = this._expanded.has(g);
      let U = w;
      if (X) {
        const b = (E) => C(this._s(E.today)) ?? 0, M = new Set([...w].sort((E, Q) => b(Q) - b(E)).slice(0, I)), A = w.filter((E) => !M.has(E)), q = A.reduce((E, Q) => {
          const $t = C(this._s(Q.today));
          return $t === null ? E : (E ?? 0) + $t;
        }, null), j = {
          entity: "",
          today: null,
          label: W ? "− weniger" : `+ ${A.length} weitere`,
          more: { group: g, power: W ? null : this._sumW(A), today: W ? null : q }
        };
        U = [...W ? w : w.filter((E) => M.has(E)), j];
      }
      const K = Tn(U), J = Math.max(c + 6, S ? S.pref - 10 : 0), at = S ? Math.min(Math.max(J + o, S.lo), S.hi) : J + o, et = k(J + o, at), gt = P?.(at), p = gt ? `${gt} ${et.replace(/^M\s+\S+\s+\S+\s*/, "")}` : void 0;
      n.push({
        title: g,
        colour: v,
        power: x,
        titleY: J - 6,
        y0: J,
        trunk: et,
        loads: U.map((b) => ({ ...b, trunk: et, route: p, source: O })),
        all: w,
        rows: K,
        more: X ? { hidden: w.length - U.length, expanded: W } : void 0
      }), c = J + K * i + this._groupGap;
    }, l = [...t.loads.fixed], h = t.entities.unmeasured_power;
    this._unmeasuredInList && h && l.push({
      entity: h,
      today: t.unmeasured_today ?? null,
      label: "Nicht erfasst",
      tip: "Nicht erfasst · Hausverbrauch ohne die gemessenen Verbraucher"
    });
    const d = this._laneFinder(), $ = this._houseY;
    a(
      "Grundlast",
      e.home,
      l,
      this._sumW(l),
      (g) => `M 285 ${$ + 9} H ${d(300, $ + 9, g)} V ${g} H ${s}`,
      void 0,
      void 0,
      () => this._houseLead($ + 9)
    ), a(
      "Zusätzlich",
      e.flexible,
      t.loads.flexible,
      this._sumW(t.loads.flexible),
      (g) => `M 285 ${$ + 19} H ${d(306, $ + 19, g)} V ${g} H ${s}`,
      void 0,
      void 0,
      () => this._houseLead($ + 19)
    );
    const u = t.wallbox;
    if (u && this._wallboxInList) {
      const g = C(this._s(u.soc ?? void 0)), v = g !== null ? `${u.name} Auto ${Ht(g, this._loc)}` : u.name;
      a(
        "Wallbox",
        u.flexible ? e.flexible : e.home,
        [{ entity: u.power, today: u.today, label: v, tip: `${u.name} · ${u.flexible ? "Zusatzverbraucher" : "Grundlast"}` }],
        this._w(u.power),
        (w, x) => `M ${this._invX + 60} ${x} H ${ss} V ${w} H ${s}`,
        void 0,
        { pref: this._invY + In, lo: this._invY + 6, hi: this._invY + 56 }
        // anywhere on the inverter's right edge
      );
    }
    const y = this._displayBatteries().filter((g) => (g.backup ?? []).length).reverse();
    return y.forEach((g, v) => {
      const w = v === 0 ? ns : is, x = v === 0 ? { pref: g.top + 57, lo: g.top + 46, hi: g.top + 70 } : { pref: g.top + 68, lo: g.top + 64, hi: g.top + 72 };
      a(
        // red colour + feed line from the battery mark it as backup; with two
        // backup batteries the name tells them apart
        y.length > 1 ? `Notstrom – ${bt(g.name, 10)}` : "Notstrom",
        e.backup,
        g.backup ?? [],
        this._sumW(g.backup ?? []),
        (k, O) => `M ${this._batteryOutX(g.cx, g.w)} ${O} H ${w} V ${k} H ${s}`,
        g.name,
        x,
        (k) => this._batteryLead(g.cx, g.top, g.w, k)
      );
    }), n;
  }
  /** Baseline of the first load group's title. */
  get _groupsTop() {
    return 22;
  }
  /** Drawn above all load groups (nothing in the classic look); `home` = total consumption. */
  _listsHeader(t) {
    return _``;
  }
  /** Show "heute" / "24 h" above the energy column of the load lists. */
  get _periodLabel() {
    return !0;
  }
  /** Draw a load group's feed as part of its list's pipes (same look, clean joins). */
  get _pipeTrunk() {
    return !1;
  }
  /** Where a load list's branch line ends at its row. */
  get _rowEntryX() {
    return F - 3;
  }
  /** Lines inside a load list: the bracket with the rows' branches (one path),
   *  or the dashed link from a load to a load contained in it. */
  _branch(t, e, s) {
    return _`<path d=${t} fill="none" stroke=${e} stroke-width="1" stroke-opacity="0.6"
      stroke-dasharray=${s === "child" ? "2 2" : f} />`;
  }
  /** How many loads a group shows before it folds the rest away (by title);
   *  null = all. */
  _listLimit(t) {
    return null;
  }
  /** Sort idle loads by today's energy (after the running ones) instead of by name. */
  get _idleByEnergy() {
    return !1;
  }
  _toggleList(t) {
    const e = new Set(this._expanded);
    e.has(t) ? e.delete(t) : e.add(t), this._expanded = e;
  }
  /**
   * Finds a free vertical lane for a feed from the house down (or up) to a
   * load list: the preferred x if the line from y1 to y2 passes no battery and
   * not the storage box, otherwise the next free lane to the right of them,
   * left of the lanes the battery (backup) and wallbox feeds use.
   */
  _laneFinder() {
    const t = this._displayBatteries(), e = t.map((o) => ({ x0: o.cx - o.w / 2 - 3, x1: o.cx + o.w / 2 + 3, y0: o.top - 2, y1: o.top + 110 }));
    if (t.length) {
      const o = Math.min(...t.map((a) => a.cx - a.w / 2)) - 3, c = Math.max(...t.map((a) => a.cx + a.w / 2)) + 3;
      e.push({ x0: o, x1: c, y0: this._storeY - 3, y1: this._storeY + Zt + 3 });
    }
    const s = [ns, is, ...this._layout?.wallbox && this._wallboxInList ? [ss] : []], n = [], i = (o, c, a) => {
      const [l, h] = c < a ? [c, a] : [a, c];
      return !e.some((d) => o >= d.x0 && o <= d.x1 && h >= d.y0 && l <= d.y1) && !s.some((d) => Math.abs(d - o) < 4) && !n.some((d) => Math.abs(d - o) < 5);
    };
    return (o, c, a) => {
      let l = o;
      for (; !i(l, c, a) && l < st - 8; ) l += 3;
      return l >= st - 8 && (l = o), n.push(l), l;
    };
  }
  /** Vertical space between two load groups. */
  get _groupGap() {
    return 16;
  }
  _sumW(t) {
    return t.reduce((e, s) => {
      const n = this._w(s.entity);
      return n === null ? e : (e ?? 0) + n;
    }, null);
  }
  /** One group as a vertical list, biggest consumer on top: name, power, energy.
   *  Every row knows the feed path (`trunk`) from its source; a running load
   *  gets its own dot that travels the trunk and on to its row. */
  _loadList(t, e, s) {
    const n = this._rowH, i = n / 2 - 1, o = (p) => p.w !== null && Math.abs(p.w) >= B, c = (p) => C(this._s(p.today)) ?? 0, a = (p, b) => this._idleByEnergy ? Number(o(b)) - Number(o(p)) || (o(p) ? b.w - p.w : c(b) - c(p)) || p.name.localeCompare(b.name) : (b.w ?? -1 / 0) - (p.w ?? -1 / 0) || p.name.localeCompare(b.name), l = t.map((p) => ({ ...p, w: p.more ? p.more.power : this._w(p.entity), name: p.label ?? this._name(p.entity) })).sort((p, b) => +!!p.more - +!!b.more || a(p, b)), h = [];
    for (const p of l) {
      const b = h.length;
      h.push({ ...p, child: !1 });
      const M = (p.children ?? []).map((A) => ({ ...p, ...A, children: void 0, label: void 0, w: this._w(A.entity), name: this._name(A.entity) })).sort(a);
      for (const A of M) h.push({ ...A, child: !0, parentRow: b });
    }
    const d = this._rowEntryX, $ = t[0]?.route ?? t[0]?.trunk, y = ($ ? this._feedTrain($, 0, s) : null) !== null, g = (p, b) => y ? `M ${st} ${e + i} V ${e + b * n + i} H ${d}` : `${p.route ?? p.trunk} V ${e + b * n + i} H ${d}`, v = (p, b) => `${g(p, p.parentRow ?? 0)} H ${F + 4} V ${e + b * n + i} H ${F + 10}`, w = (p) => {
      const b = h[p].w;
      if (b === null) return null;
      const M = h.filter((A) => A.child && A.parentRow === p).reduce((A, q) => A + Math.max(q.w ?? 0, 0), 0);
      return Math.max(b - M, 0);
    }, x = (p, b) => p.child ? p.w : w(b), k = h.map((p, b) => ({ l: p, i: b, w: x(p, b) })).filter(({ w: p }) => p !== null && Math.abs(p) >= B), O = this._wagonSpeed, S = k.flatMap(
      ({ l: p, i: b, w: M }) => (this._wagonBalls(M, s, p.source) ?? [void 0]).map((A) => ({ l: p, i: b, radius: A?.r, tint: A?.colour }))
    );
    S.some((p) => p.radius !== void 0) && S.sort((p, b) => (b.radius ?? 0) - (p.radius ?? 0));
    let P = 0;
    const I = S.map(({ l: p, i: b, radius: M, tint: A }, q) => (q && (P += M === void 0 ? Rn : (S[q - 1].radius ?? 0) + M + 2.5), { i: b, radius: M, tint: A, begin: P / O, travel: $e(p.child ? v(p, b) : g(p, b)) / O })), X = Math.max(1, ...I.map((p) => p.begin + p.travel)) + Fn, W = /* @__PURE__ */ new Map();
    for (const p of I)
      W.set(p.i, [...W.get(p.i) ?? [], { period: X, begin: p.begin, travel: p.travel, radius: p.radius, tint: p.tint }]);
    const U = (p, b, M) => (W.get(M) ?? []).map((A) => this._dot(p, A.tint ?? s, b, !0, 2.4, A)), K = k.reduce((p, { w: b }) => p + Math.max(b ?? 0, 0), 0), J = y && $ && K >= B ? this._feedTrain($, K, s, t[0]?.source) : f, at = h.reduce((p, b, M) => b.child ? p : M, 0), et = this._pipeTrunk ? t[0]?.trunk : void 0, gt = [
      ...et ? [et] : [],
      `M ${st} ${et ? e + i : e + 4} V ${e + at * n + i}`,
      ...h.flatMap((p, b) => p.child ? [] : [`M ${st} ${e + b * n + i} H ${d}`])
    ].join(" ");
    return _`
      ${this._branch(gt, s, "row")}
      ${J}
      ${h.map((p, b) => {
      const M = e + b * n, A = p.w === null || Math.abs(p.w) < B;
      if (p.child) {
        const E = e + (p.parentRow ?? 0) * n + n - 3, Q = `${p.name} · enthalten in ${h[p.parentRow ?? 0].name}`;
        return _`
            ${this._branch(`M ${F + 4} ${E} V ${M + i} H ${F + 10}`, s, "child")}
            ${this._bySize ? U(v(p, b), p.w, b) : y ? this._feedTrain(v(p, b), p.w ?? 0, s, p.source) : f}
            <g opacity=${A ? 0.45 : 0.85} class="tap" data-entity=${p.entity}>
              ${this._nameBox(p.name, M, s, Q, 12)}
              ${this._valueCell(rt - nt, M + 1, nt, n - 4, s, L(p.w, this._loc), 9, "power")}
            </g>
            ${this._tap(p.today, this._valueCell(tt - it, M + 1, it, n - 4, s, V(C(this._s(p.today)), this._loc), 8.5, "energy"))}`;
      }
      const q = this._bySize ? U(g(p, b), w(b), b) : y ? this._feedTrain(g(p, b), (p.more ? p.w : w(b)) ?? 0, s, p.source) : this._dot(g(p, b), s, p.w, !0, 2.4);
      if (p.more) {
        const E = p.more.group;
        return _`
            ${q}
            <g class="more" opacity=${p.more.power !== null && A ? 0.55 : 1} @click=${() => this._toggleList(E)}>
              <rect x=${F - 8} y=${M} width=${tt - F + 8} height=${n} fill="transparent" />
              <text x=${F + 2} y=${M + n * 0.62} class="small" fill=${s}>${p.name}</text>
              ${p.more.power !== null ? this._valueCell(rt - nt, M + 1, nt, n - 4, s, L(p.w, this._loc), 9, "power") : f}
              ${p.more.today !== null ? this._valueCell(tt - it, M + 1, it, n - 4, s, V(p.more.today, this._loc), 8.5, "energy") : f}
            </g>`;
      }
      const j = p.tip ?? (p.source ? `${p.name} · gespeist von ${p.source}` : p.name);
      return _`
          ${q}
          <g opacity=${A ? 0.45 : 1} class="tap" data-entity=${p.entity}>
            ${this._nameBox(p.name, M, s, j)}
            ${this._valueCell(rt - nt, M + 1, nt, n - 4, s, L(p.w, this._loc), 9, "power")}
          </g>
          ${this._tap(p.today, this._valueCell(tt - it, M + 1, it, n - 4, s, V(C(this._s(p.today)), this._loc), 8.5, "energy"))}`;
    })}
    `;
  }
  /** Power or energy of one list row. */
  _valueCell(t, e, s, n, i, o, c, a) {
    return this._box(t, e, s, n, i, o, c);
  }
  /** Name of a load in a rounded box; long names wrap to two smaller lines. */
  _nameBox(t, e, s, n = t, i = 0) {
    const o = F - 2 + i, c = rt - nt - 4 - o, { lines: a, small: l } = i ? ge(t, 9, 12) : ge(t, 11, 15);
    return _`<g>
      <title>${n}</title>
      <rect x=${o} y=${e + 1} width=${c} height="18" rx="4" fill="none" stroke=${s} stroke-width="1" />
      ${l && a.length > 1 ? _`<text x=${o + 4} y=${e + 9} class="name" font-size=${this._fs(7.5)}>${a[0]}</text>
              <text x=${o + 4} y=${e + 17} class="name" font-size=${this._fs(7.5)}>${a[1]}</text>` : _`<text x=${o + 4} y=${e + (l ? 12.6 : 13.5)} class="name" font-size=${this._fs(l ? 7.5 : 10)}>${a[0]}</text>`}
    </g>`;
  }
  _groupTitle(t, e, s, n, i) {
    const o = i.reduce((c, a) => {
      const l = C(this._s(a.today));
      return l === null ? c : (c ?? 0) + l;
    }, null);
    return _`
      <text x=${st} y=${t} class="small grp" fill=${e}
        >${bt(s, 15)}${s.length > 15 ? _`<title>${s}</title>` : f}</text>
      <text x=${rt - nt / 2} y=${t} text-anchor="middle" class="small grp" fill=${e}>${L(n, this._loc)}</text>
      <text x=${tt - it / 2} y=${t} text-anchor="middle" class="small grp" fill=${e}>${V(o, this._loc)}</text>`;
  }
  /** Total svg height needed for the load lists and the batteries. */
  get _viewH() {
    if (!this._layout) return ts;
    const t = this._groups(), e = t[t.length - 1], s = e ? e.y0 + e.rows * this._rowH + 8 : 0, n = this._displayBatteries(), i = n.length ? Math.max(...n.map((o) => o.top)) + this._batteryTail : 0;
    return Math.max(this._minViewH, s, i);
  }
  /** House symbol above the house value (area 226..274 x 16..64). */
  _houseIcon(t) {
    return this._icon(Wn, 226, 16, 48, t);
  }
  /** Background behind a load group (none in the classic look). */
  _groupPanel(t) {
    return _``;
  }
  /** Small symbol next to a group title. */
  _groupIcon(t) {
    return t.title === "Wallbox" ? this._icon(Un, st + 46, t.titleY - 11, 14, t.colour) : _``;
  }
  _home() {
    const t = this._layout, e = this._c.home, s = this._own("home_power"), n = this._own("unmeasured_power"), i = this._groups(), o = `M ${this._invTop[0]} ${this._invTop[1]} V ${Math.min(152, this._invTop[1] - 8)} H 250 V ${this._houseY + 26}`, c = s === null ? null : Math.max(s - this._offGridLoads, 0);
    return _`
      ${this._houseIcon(e)}
      ${n !== null && !this._unmeasuredInList ? _`<text x="256" y=${this._houseY + 42} class="tiny">nicht erfasst</text>
              <text x="256" y=${this._houseY + 52} class="tiny val">${L(n, this._loc)}</text>` : f}
      ${this._flow(o, e, c, !0, !1)}
      ${this._houseDots(this._houseIn() ?? o, e, c)}
      ${this._houseJunction(c)}
      ${i.length ? this._listsHeader(s) : f}
      ${i.length && this._periodLabel ? _`<text x=${tt - it / 2} y="9" text-anchor="middle" class="tiny">${t.energy_period === "rolling24" ? "24 h" : "heute"}</text>` : f}
      ${i.map(
      (a) => _`
          ${this._groupPanel(a)}
          ${this._groupTitle(a.titleY, a.colour, a.title, a.power, a.all)}
          ${this._groupIcon(a)}
          ${this._pipeTrunk ? f : this._flow(a.trunk, a.colour, a.power, !0, !1)}
          ${this._loadList(a.loads, a.y0, a.colour)}
        `
    )}
      ${this._tap(t.entities.home_power, this._box(215, this._houseY, 70, 26, e, L(c, this._loc), 13))}
      <text x="211" y=${this._houseY + 13} text-anchor="end" class="lbl">Haus</text>
      <text x="211" y=${this._houseY + 25} text-anchor="end" class="tiny val">${V(this._houseNetToday, this._loc)}</text>
    `;
  }
  /** Colour of the current price: buying (pale red) or selling (pale green). */
  _priceColour(t) {
    return t ? "#4e9e62" : "#cc5a52";
  }
  /** Current grid values: power, direction, price and today's import / export. */
  _gridData() {
    const t = this._layout, e = this._own("grid_power"), s = (e ?? 0) < -B, n = s ? t.grid.export_price ? fe(this._s(t.grid.export_price)) : t.grid.export_price_fixed ?? null : fe(this._s(t.grid.price));
    return {
      grid: e,
      exporting: s,
      cents: n,
      label: e === null ? "" : e > B ? "Bezug" : s ? "Einspeisung" : "",
      power: L(e === null ? null : Math.abs(e), this._loc),
      imp: Ot(this._s(t.grid.import_today)),
      exp: Ot(this._s(t.grid.export_today))
    };
  }
  _grid() {
    const t = this._c.grid, { grid: e, exporting: s, cents: n, label: i, power: o, imp: c, exp: a } = this._gridData();
    return _`
      ${this._flow(`M ${this._invX} ${this._invY + 42} H 84`, t, e, s)}
      ${this._tap(this._layout.entities.grid_power, _`${this._panel(10, 192, 74, 40, t)}
        <text x="47" y=${n === null ? 217 : 209} text-anchor="middle" class="val" font-size=${this._fs(13)}>${o}</text>`)}
      ${n !== null ? _`<text x="47" y="225" text-anchor="middle" class="tiny" style=${`fill:${this._priceColour(s)}`}>${He(n, this._loc)}</text>` : f}
      <text x="90" y="207" class="tiny">${i}</text>
      ${this._icon(Vn, 27, 240, 40, t)}
      ${c !== null ? _`<text x="10" y="292" class="small" fill=${t}>↓ ${V(c, this._loc)}<tspan class="tiny"> Bezug</tspan></text>` : f}
      ${a !== null ? _`<text x="10" y="305" class="small">↑ ${V(a, this._loc)}<tspan class="tiny"> Einspeisung</tspan></text>` : f}
    `;
  }
  // -- render -----------------------------------------------------------------
  render() {
    if (this._error)
      return m`<ha-card><div class="msg">${this._error}</div></ha-card>`;
    if (!this._layout || !this.hass)
      return m`<ha-card><div class="msg">Lade Wattrio …</div></ha-card>`;
    const t = this._config?.title;
    return m`
      <ha-card .header=${t ?? f}>
        <svg viewBox=${`0 0 ${Bn} ${this._viewH}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Wattrio – Energiefluss"
          @click=${this._onTap}>
          ${this._defs()} ${this._solar()} ${this._batteries()} ${this._inverter()} ${this._home()} ${this._grid()}
          ${this._overlay()}
        </svg>
      </ha-card>
    `;
  }
};
Te.styles = se`
    ha-card {
      padding: 8px;
    }
    svg {
      width: 100%;
      height: auto;
      display: block;
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
    }
    .val {
      fill: var(--primary-text-color);
    }
    .lbl {
      fill: var(--secondary-text-color);
      font-size: 10px;
    }
    .small {
      fill: var(--secondary-text-color);
      font-size: 10px;
    }
    .tiny {
      fill: var(--secondary-text-color);
      font-size: 8px;
    }
    .grp {
      font-weight: 600;
    }
    .more,
    .tap {
      cursor: pointer;
    }
    .more:hover text {
      text-decoration: underline;
    }
    .soc {
      fill: var(--primary-text-color);
      font-size: 13px;
    }
    .name {
      fill: var(--primary-text-color);
    }
    .tiny.val {
      fill: var(--primary-text-color);
    }
    .big {
      fill: var(--primary-text-color);
      font-size: 16px;
    }
    .msg {
      padding: 16px;
      color: var(--secondary-text-color);
    }
  `;
let Z = Te;
kt([
  ft({ attribute: !1 })
], Z.prototype, "hass");
kt([
  ft({ type: Boolean })
], Z.prototype, "editMode");
kt([
  H()
], Z.prototype, "_config");
kt([
  H()
], Z.prototype, "_layout");
kt([
  H()
], Z.prototype, "_error");
kt([
  H()
], Z.prototype, "_expanded");
customElements.get("energiefluss-card") || customElements.define("energiefluss-card", Z);
window.customCards = window.customCards ?? [];
window.customCards.some((r) => r.type === "energiefluss-card") || window.customCards.push({
  type: "energiefluss-card",
  name: "Wattrio Energiefluss Klassik",
  description: "Wattrio: animierter Energiefluss im klassischen, flachen Look – eingerichtet über die Wattrio-Integration.",
  preview: !0
});
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Dn = (r) => (...t) => ({ _$litDirective$: r, values: t });
let Gn = class {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, s) {
    this._$Ct = t, this._$AM = e, this._$Ci = s;
  }
  _$AS(t, e) {
    return this.update(t, e);
  }
  update(t, e) {
    return this.render(...e);
  }
};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Yn = {}, Xn = (r, t = Yn) => r._$AH = t;
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const qn = Dn(class extends Gn {
  constructor() {
    super(...arguments), this.key = f;
  }
  render(r, t) {
    return this.key = r, t;
  }
  update(r, [t, e]) {
    return t !== this.key && (Xn(r), this.key = t), e;
  }
}), Zn = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-air-conditioning"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M8 16a3 3 0 0 1 -3 3" />
  <path d="M16 16a3 3 0 0 0 3 3" />
  <path d="M12 16v4" />
  <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -4" />
  <path d="M7 13v-3a1 1 0 0 1 1 -1h8a1 1 0 0 1 1 1v3" />
</svg>`, Kn = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-battery-2"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M6 7h11a2 2 0 0 1 2 2v.5a.5 .5 0 0 0 .5 .5a.5 .5 0 0 1 .5 .5v3a.5 .5 0 0 1 -.5 .5a.5 .5 0 0 0 -.5 .5v.5a2 2 0 0 1 -2 2h-11a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2" />
  <path d="M7 10l0 4" />
  <path d="M10 10l0 4" />
</svg>`, Jn = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-bulb"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7" />
  <path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3" />
  <path d="M9.7 17l4.6 0" />
</svg>`, Qn = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-car"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
</svg>`, ti = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-charging-pile"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M18 7l-1 1" />
  <path d="M14 11h1a2 2 0 0 1 2 2v3a1.5 1.5 0 0 0 3 0v-7l-3 -3" />
  <path d="M4 20v-14a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v14" />
  <path d="M9 11.5l-1.5 2.5h3l-1.5 2.5" />
  <path d="M3 20l12 0" />
  <path d="M4 8l10 0" />
</svg>`, ei = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-coffee"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 14c.83 .642 2.077 1.017 3.5 1c1.423 .017 2.67 -.358 3.5 -1c.83 -.642 2.077 -1.017 3.5 -1c1.423 -.017 2.67 .358 3.5 1" />
  <path d="M8 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
  <path d="M12 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
  <path d="M3 10h14v5a6 6 0 0 1 -6 6h-2a6 6 0 0 1 -6 -6v-5" />
  <path d="M16.746 16.726a3 3 0 1 0 .252 -5.555" />
</svg>`, si = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-cooker"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 7h.01" />
  <path d="M15 7h.01" />
  <path d="M9 7h.01" />
  <path d="M5 5a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -14" />
  <path d="M9 15h6" />
  <path d="M5 11h14" />
</svg>`, ni = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-device-desktop"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 5a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10" />
  <path d="M7 20h10" />
  <path d="M9 16v4" />
  <path d="M15 16v4" />
</svg>`, ii = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-droplet"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M7.502 19.423c2.602 2.105 6.395 2.105 8.996 0c2.602 -2.105 3.262 -5.708 1.566 -8.546l-4.89 -7.26c-.42 -.625 -1.287 -.803 -1.936 -.397a1.376 1.376 0 0 0 -.41 .397l-4.893 7.26c-1.695 2.838 -1.035 6.441 1.567 8.546" />
</svg>`, oi = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-flame"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 10.941c2.333 -3.308 .167 -7.823 -1 -8.941c0 3.395 -2.235 5.299 -3.667 6.706c-1.43 1.408 -2.333 3.294 -2.333 5.588c0 3.704 3.134 6.706 7 6.706c3.866 0 7 -3.002 7 -6.706c0 -1.712 -1.232 -4.403 -2.333 -5.588c-2.084 3.353 -3.257 3.353 -4.667 2.235" />
</svg>`, ri = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-fridge"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 5a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -14" />
  <path d="M5 10h14" />
  <path d="M9 13v3" />
  <path d="M9 6v1" />
</svg>`, ai = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-home"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
  <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
  <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
</svg>`, li = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-lamp"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M9 20h6" />
  <path d="M12 20v-8" />
  <path d="M5 12h14l-4 -8h-6l-4 8" />
</svg>`, ci = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-microwave"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 7a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1l0 -10" />
  <path d="M15 6v12" />
  <path d="M18 12h.01" />
  <path d="M18 15h.01" />
  <path d="M18 9h.01" />
  <path d="M6.5 10.5c1 -.667 1.5 -.667 2.5 0c.833 .347 1.667 .926 2.5 0" />
  <path d="M6.5 13.5c1 -.667 1.5 -.667 2.5 0c.833 .347 1.667 .926 2.5 0" />
</svg>`, hi = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-plug"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M9.785 6l8.215 8.215l-2.054 2.054a5.81 5.81 0 1 1 -8.215 -8.215l2.054 -2.054" />
  <path d="M4 20l3.5 -3.5" />
  <path d="M15 4l-3.5 3.5" />
  <path d="M20 9l-3.5 3.5" />
</svg>`, di = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-pool"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M2 20a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1" />
  <path d="M2 16a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1" />
  <path d="M15 12v-7.5a1.5 1.5 0 0 1 3 0" />
  <path d="M9 12v-7.5a1.5 1.5 0 0 0 -3 0" />
  <path d="M15 5l-6 0" />
  <path d="M9 10l6 0" />
</svg>`, pi = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-router"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 15a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -4" />
  <path d="M17 17l0 .01" />
  <path d="M13 17l0 .01" />
  <path d="M15 13l0 -2" />
  <path d="M11.75 8.75a4 4 0 0 1 6.5 0" />
  <path d="M8.5 6.5a8 8 0 0 1 13 0" />
</svg>`, ui = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-server"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 7a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-2" />
  <path d="M3 15a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -2" />
  <path d="M7 8l0 .01" />
  <path d="M7 16l0 .01" />
</svg>`, _i = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-solar-panel"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M4.28 14h15.44a1 1 0 0 0 .97 -1.243l-1.5 -6a1 1 0 0 0 -.97 -.757h-12.44a1 1 0 0 0 -.97 .757l-1.5 6a1 1 0 0 0 .97 1.243" />
  <path d="M4 10h16" />
  <path d="M10 6l-1 8" />
  <path d="M14 6l1 8" />
  <path d="M12 14v4" />
  <path d="M7 18h10" />
</svg>`, fi = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-building-broadcast-tower"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  <path d="M16.616 13.924a5 5 0 1 0 -9.23 0" />
  <path d="M20.307 15.469a9 9 0 1 0 -16.615 0" />
  <path d="M9 21l3 -9l3 9" />
  <path d="M10 19h4" />
</svg>`, gi = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-device-tv"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 9a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -9" />
  <path d="M16 3l-4 4l-4 -4" />
</svg>`, $i = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-vacuum-cleaner"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M21 12a9 9 0 1 1 -18 0a9 9 0 0 1 18 0" />
  <path d="M14 9a2 2 0 1 1 -4 0a2 2 0 0 1 4 0" />
  <path d="M12 16h.01" />
</svg>`, mi = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-wash-machine"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 5a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -14" />
  <path d="M8 14a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
  <path d="M8 6h.01" />
  <path d="M11 6h.01" />
  <path d="M14 6h2" />
  <path d="M8 14c1.333 -.667 2.667 -.667 4 0c1.333 .667 2.667 .667 4 0" />
</svg>`;
function z(r) {
  return [...r.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((t) => t[1]).filter((t) => t !== "M0 0h24v24H0z");
}
const yi = {
  airConditioning: z(Zn),
  battery: z(Kn),
  bulb: z(Jn),
  car: z(Qn),
  chargingPile: z(ti),
  coffee: z(ei),
  cooker: z(si),
  desktop: z(ni),
  droplet: z(ii),
  flame: z(oi),
  fridge: z(ri),
  home: z(ai),
  lamp: z(li),
  microwave: z(ci),
  plug: z(hi),
  pool: z(di),
  router: z(pi),
  server: z(ui),
  solarPanel: z(_i),
  tower: z(fi),
  tv: z(gi),
  vacuum: z($i),
  washMachine: z(mi)
}, bi = [
  [/k(ü|ue)hl|gefrier|fridge|freez/, "fridge"],
  [/wasch|washer|trockn|dryer/, "washMachine"],
  [/klima|air.?con|\bac\b|split/, "airConditioning"],
  [/wallbox|lade(station|punkt)|charger|evcc/, "chargingPile"],
  [/\bauto\b|\bcar\b|tesla|e.?auto/, "car"],
  [/\btv\b|fernseh|television/, "tv"],
  [/b(ü|ue)ro|office|\bpc\b|computer|desktop|rechner/, "desktop"],
  [/router|netzwerk|switch|fritz|wlan/, "router"],
  [/server|\bnas\b|synology/, "server"],
  [/heiz|heater|therme|w(ä|ae)rmepumpe|heat|boiler/, "flame"],
  [/kocher|kettle|kaffee|coffee|espresso/, "coffee"],
  [/dusch|warmwasser|wasser|shower|durchlauf/, "droplet"],
  [/mikro|microwave/, "microwave"],
  [/herd|ofen|oven|cooker|backofen/, "cooker"],
  [/pool|pumpe|pump/, "pool"],
  [/staubsaug|vacuum|robo/, "vacuum"],
  [/lampe|lamp|licht|light|leuchte/, "lamp"],
  [/ecoflow|powerstation|akku|speicher|batter/, "battery"]
];
function wi(r) {
  const t = r.toLowerCase();
  return bi.find(([e]) => e.test(t))?.[1] ?? "plug";
}
const Y = {
  file: "car-glass.png",
  width: 420,
  height: 269,
  tank: "82.5,161.1 80.5,141.8 85.4,118.6 100.8,102.2 125.9,83.9 135.5,76.7 168.3,38.1 187.6,25.1 226.2,11.6 264.7,2.9 293.7,7.7 325.0,25.1 339.5,40.5 355.4,64.6 362.6,83.9 360.2,97.4 349.1,92.6 337.1,92.6 326.5,99.3 320.7,112.8 318.7,136.0 226.2,174.6 222.3,163.0 211.7,156.2 197.2,157.2 187.6,165.9 182.8,180.3 181.8,203.5 158.6,199.6 100.8,180.3",
  floorQuad: [[80.5, 154.8], [168.3, 199.6], [361.2, 119.1], [273.4, 74.3]],
  liquidHeight: 96.4,
  powerText: [28.5, 166.8],
  energyText: [240.6, 229.5],
  edgeAngle: 27.4,
  wallboxTop: [385.3, 21.2]
}, pt = {
  file: "inverter-glass.png",
  width: 300,
  height: 278,
  top: [115.7, 23.5],
  bottom: [100.2, 221.8],
  left: [[18.7, 61], [18.7, 99.1], [18.7, 138.1]]
}, wt = {
  file: "solar-glass.png",
  width: 360,
  height: 222,
  face: [[16.8, 42.7], [329.6, 11.1], [348.9, 165], [34.1, 204]],
  across: [0.9949, -0.1005],
  down: [0.1063, 0.9943]
}, xi = {
  solar: "#ffd43b",
  // yellow, clearly apart from the other sources
  battery: "#3ee08f",
  grid: "#4db2ff",
  home: "#2fd4b4",
  flexible: "#3f86ff",
  backup: "#ff6a3d",
  inverter: "#a8d4ff"
}, D = "#cfeaff", vi = 0.72, ki = 0.93, Rt = 0.6;
function ct(r) {
  const t = /^#([0-9a-f]{6})$/i.exec(r);
  if (!t) return r;
  const e = parseInt(t[1], 16), s = [e >> 16 & 255, e >> 8 & 255, e & 255], n = 0.2126 * s[0] + 0.7152 * s[1] + 0.0722 * s[2];
  return `#${s.map((o) => Math.round(Math.min(255, Math.max(0, (n + vi * (o - n)) * ki)))).map((o) => o.toString(16).padStart(2, "0")).join("")}`;
}
const Mi = [
  [0, -2.2, 2.2, 0],
  [1.6, 2.4, -1.8, -1.2],
  [-1.2, -1, 2, 1.4],
  [0.8, 2.2, -2.4, 0.4]
], Ft = 26, Ai = 2.5, Si = 0.7, Wt = 72, Ei = 0.6, Li = 0.7, vs = 5.2, Hi = 3.3, zi = 1.6, rs = { big: vs, medium: Hi, small: zi }, ks = 6, Ms = 0, As = 130, me = As / wt.width, Ci = import.meta.url.replace(/[^/]*$/, "") + wt.file, as = 0, Vt = 3.5, ce = 44, he = 18, Ss = wt.face.map(([r, t]) => [ks + r * me, Ms + t * me]), At = (r, t) => {
  const [e, s, n, i] = Ss, o = [e[0] + (s[0] - e[0]) * r, e[1] + (s[1] - e[1]) * r], c = [i[0] + (n[0] - i[0]) * r, i[1] + (n[1] - i[1]) * r];
  return [o[0] + (c[0] - o[0]) * t, o[1] + (c[1] - o[1]) * t];
}, Ti = (r) => {
  const [t, e, , s] = Ss, n = Math.hypot(e[0] - t[0], e[1] - t[1]), i = Math.hypot(s[0] - t[0], s[1] - t[1]), o = (as + Vt) / n, c = (as + Vt) / i, a = Vt / n, l = Vt / i, h = (u, y) => [
    [u, 0.5 - y / 2],
    [0.5 + y / 2, 1 - u]
  ], d = r === 1 ? [[o, 1 - o]] : h(o, a);
  return (r <= 2 ? [[c, 1 - c]] : h(c, l)).flatMap(
    ([u, y]) => d.map(([g, v]) => ({
      corners: [At(g, u), At(v, u), At(v, y), At(g, y)],
      middle: At((g + v) / 2, (u + y) / 2),
      size: [(v - g) * n, (y - u) * i]
    }))
  );
}, ye = 82, St = [104, ye + 26], be = 58, Ut = [250, be + 26], we = 196, jt = we, ls = "0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1", de = (r, t = 0, e = 0) => r.map(([s, n, i, o]) => `M ${s + t} ${n + e} L ${i + t} ${o + e}`).join(" "), cs = [
  [22, 40, 8, 86],
  [34, 40, 48, 86],
  [24, 10, 22, 40],
  [32, 10, 34, 40],
  [24, 10, 28, 2],
  [32, 10, 28, 2]
], hs = [
  [12, 12, 44, 12],
  [12, 12, 23.5, 17],
  [44, 12, 32.5, 17],
  [6, 24, 50, 24],
  [6, 24, 22.7, 30],
  [50, 24, 33.3, 30],
  [2, 36, 54, 36],
  [2, 36, 22, 40],
  [54, 36, 34, 40]
], Pi = [
  [23.9, 12, 32.9, 24],
  [32.1, 12, 23.1, 24],
  [23.1, 24, 33.7, 36],
  [32.9, 24, 22.3, 36],
  [22, 40, 34, 40],
  [15.9, 60, 40.1, 60],
  [22, 40, 40.1, 60],
  [34, 40, 15.9, 60],
  [15.9, 60, 48, 86],
  [40.1, 60, 8, 86]
], Bi = [
  [8, 86, 15, 82],
  [48, 86, 55, 82],
  [22, 40, 29, 36],
  [34, 40, 41, 36],
  [28, 2, 35, -2]
], pe = [
  [12, 12],
  [44, 12],
  [6, 24],
  [50, 24],
  [2, 36],
  [54, 36]
], ds = 10, ps = 122, ue = 0.7, mt = 8, Dt = 48, us = 1.25, Oi = 30, Ni = 4, Ii = 3.2, Et = 15, _e = 196, te = 0.24, ee = [250, 116], Ri = import.meta.url.replace(/[^/]*$/, "") + pt.file, xe = ([r, t]) => [
  ee[0] + (r - pt.top[0]) * te,
  ee[1] + (t - pt.top[1]) * te
], Gt = pt.left.map(xe), Yt = 6, Xt = 132, Fi = import.meta.url.replace(/[^/]*$/, "") + Y.file, Wi = [
  [0, 0, 0, 0],
  [4, -1.5, -4, 1.5],
  [-1.5, 3, 1.5, -3],
  [-4, 1.5, 4, -1.5]
], Vi = [
  [28, 2],
  [22, 40],
  [34, 40],
  [15.9, 60],
  [40.1, 60],
  [8, 86],
  [48, 86]
], Pe = class Pe extends Z {
  constructor() {
    super(...arguments), this._seen = /* @__PURE__ */ new Map(), this._lastSeen = /* @__PURE__ */ new Map(), this._routeIdx = /* @__PURE__ */ new Map(), this._ghosts = [], this._epochs = /* @__PURE__ */ new Map(), this._nextEpochs = /* @__PURE__ */ new Map(), this._now = 0;
  }
  get _c() {
    return { ...xi, ...this._config?.colours ?? {} };
  }
  // inverter centred under the house; wallbox sits on the left below the pylon
  get _invX() {
    return Gt[0][0];
  }
  get _solarX() {
    return 104;
  }
  get _houseY() {
    return be;
  }
  get _invY() {
    return ee[1];
  }
  get _invTop() {
    return ee;
  }
  get _invBottom() {
    return xe(pt.bottom);
  }
  get _solarY() {
    return Gt[0][1];
  }
  get _unmeasuredInList() {
    return !0;
  }
  get _wallboxInList() {
    return !1;
  }
  // backup pipes end at the glass shell of the battery cylinder (see _batteryWidget)
  _batteryOutX(t, e) {
    return t + e / 2 - 2;
  }
  // storage area a bit to the right; with five batteries the backup lanes leave less room
  _batteryShift(t) {
    return t >= 5 ? 6 : 14;
  }
  // as low as the content allows (aiming at about 16:9)
  get _minViewH() {
    return 300;
  }
  // the glass battery ends at top + BAT_H (shadow below), little room below it
  get _batteryTail() {
    return Wt + 12;
  }
  // batteries closer together in height than in the classic look, and never
  // running into the glass car on the left (5 batteries get a bit narrower)
  _displayBatteries() {
    const t = we + 50, e = super._displayBatteries().map((c) => ({ ...c, top: t + (c.top - t) * Ei }));
    if (!this._layout?.wallbox || !e.length) return e;
    const s = Yt + Xt + 4;
    if (Math.min(...e.map((c) => c.cx - c.w / 2)) >= s) return e;
    const n = Math.max(...e.map((c) => c.cx + c.w / 2)), i = 4, o = Math.min(e[0].w, (n - s - i * (e.length - 1)) / e.length);
    return e.map((c, a) => ({ ...c, w: o, cx: s + o / 2 + a * (o + i) }));
  }
  // denser lists: rows of 15 instead of 22
  /** The string labels for the configured number of strings. */
  get _labels() {
    return Ti(Math.min(Math.max(this._layout?.solar.strings.length ?? 4, 1), 4));
  }
  // the string labels sit on the middles of their part of the panel
  get _stringPos() {
    return this._labels.map(({ middle: [t, e] }) => [t - ce / 2, e - he / 2]);
  }
  get _pvBoxY() {
    return ye;
  }
  // wide enough to catch the trains of both tile columns (tile middles at 40 and 110)
  get _pvBox() {
    return [22, 96];
  }
  get _storeY() {
    return we;
  }
  get _rowH() {
    return 15;
  }
  _fs(t) {
    return +(t * Li).toFixed(2);
  }
  // each group's feed is one pipe with its list's bracket and branches
  get _pipeTrunk() {
    return !0;
  }
  // no "heute" / "24 h" above the load lists
  get _periodLabel() {
    return !1;
  }
  // glass pipes run right up to each load's symbol
  get _rowEntryX() {
    return F - 1;
  }
  _branch(t, e, s) {
    return _`<g class=${`pipe ${s}`}>
      <path d=${t} class="rim" />
      <path d=${t} class="bore" />
      <path d=${t} class="tint" stroke=${e} />
      <path d=${t} class="shine" />
    </g>`;
  }
  // long lists: only the biggest daily consumers, the rest folds away
  _listLimit(t) {
    return t === "Grundlast" ? 8 : t === "Zusätzlich" ? 3 : null;
  }
  get _idleByEnergy() {
    return !0;
  }
  // a group's glass panel reaches 19 above its first row and 3 below its last;
  // the gap keeps PANEL_GAP of air between two panels
  get _groupGap() {
    return 16 + us;
  }
  render() {
    this._lastSeen = this._seen, this._seen = /* @__PURE__ */ new Map(), this._routeIdx = /* @__PURE__ */ new Map(), this._now = this.renderRoot?.querySelector("svg")?.getCurrentTime() ?? 0, this._nextEpochs = /* @__PURE__ */ new Map();
    const t = super.render();
    return this._epochs = this._nextEpochs, t;
  }
  /** Start time of the train with this rhythm on `route` (see _epochs). */
  _epoch(t, e, s, n) {
    const i = `${e ? ">" : "<"}${s.toFixed(3)}|${n.toFixed(3)}|${t}`;
    let o = this._nextEpochs.get(i) ?? this._epochs.get(i);
    return o === void 0 && (o = this._now > 0 ? Math.ceil(this._now * 20) / 20 : 0), this._nextEpochs.set(i, o), o;
  }
  /** Epoch of a train already drawn in this render (either direction), else 0. */
  _epochOf(t, e, s) {
    const n = `${e.toFixed(3)}|${s.toFixed(3)}|${t}`;
    return this._nextEpochs.get(`>${n}`) ?? this._nextEpochs.get(`<${n}`) ?? 0;
  }
  updated(t) {
    super.updated(t);
    const e = this.renderRoot.querySelector("svg");
    if (!e || !this._lastSeen.size) return;
    const s = e.getCurrentTime();
    let n = !1;
    for (const [i, { colour: o, b: c }] of this._lastSeen) {
      const a = this._seen.get(i)?.b;
      if (a && a.begin === c.begin && a.period === c.period && a.travel === c.travel && a.forward === c.forward || s < c.begin) continue;
      const h = (s - c.begin) % c.period;
      if (h >= c.travel) continue;
      const d = c.travel - h;
      this._ghosts.push({ colour: o, route: c.route, forward: c.forward, r: c.r, from: h / c.travel, dur: d, start: s, until: performance.now() + d * 1e3 }), setTimeout(() => this.requestUpdate(), d * 1e3 + 50), n = !0;
    }
    this._lastSeen = /* @__PURE__ */ new Map(), n && this.requestUpdate();
  }
  _overlay() {
    const t = performance.now();
    return this._ghosts = this._ghosts.filter((e) => e.until > t), _`${this._ghosts.map((e) => {
      const s = `${e.dur.toFixed(2)}s`, n = `${e.start.toFixed(2)}s`, i = e.forward ? `${e.from.toFixed(4)};1` : `${(1 - e.from).toFixed(4)};0`;
      return this._orb(
        e.r,
        e.colour,
        _`<animateMotion dur=${s} begin=${n} fill="freeze" calcMode="linear" rotate="auto" keyPoints=${i}
            keyTimes="0;1" path=${e.route} />
          <animate attributeName="opacity" dur=${s} begin=${n} fill="freeze" calcMode="discrete" values="1;0"
            keyTimes="0;1" />`
      );
    })}`;
  }
  /** Gradients for glass, shadows, liquid and the halos of the balls. */
  _defs() {
    const t = this._c;
    return _`<defs>
      <linearGradient id="ef-slab" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.16" />
        <stop offset="0.5" stop-color="#ffffff" stop-opacity="0.05" />
        <stop offset="1" stop-color="#ffffff" stop-opacity="0.03" />
      </linearGradient>
      <linearGradient id="ef-sheen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.26" />
        <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="ef-tube" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.04" />
        <stop offset="0.14" stop-color="#ffffff" stop-opacity="0.32" />
        <stop offset="0.26" stop-color="#ffffff" stop-opacity="0.05" />
        <stop offset="0.82" stop-color="#ffffff" stop-opacity="0" />
        <stop offset="0.93" stop-color="#ffffff" stop-opacity="0.14" />
        <stop offset="1" stop-color="#ffffff" stop-opacity="0.02" />
      </linearGradient>
      <linearGradient id="ef-liquid" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#b8ffd8" stop-opacity="0.95" />
        <stop offset="0.12" stop-color=${t.battery} stop-opacity="0.85" />
        <stop offset="1" stop-color="#0f7a45" stop-opacity="0.9" />
      </linearGradient>
      <radialGradient id="ef-ball" cx="0.35" cy="0.3" r="0.75">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.55" />
        <stop offset="0.55" stop-color="#ffffff" stop-opacity="0" />
        <stop offset="1" stop-color="#000000" stop-opacity="0.25" />
      </radialGradient>
      <radialGradient id="ef-shadow">
        <stop offset="0" stop-color="#00060f" stop-opacity="0.55" />
        <stop offset="1" stop-color="#00060f" stop-opacity="0" />
      </radialGradient>
      ${Object.entries(t).map(
      ([e, s]) => _`<radialGradient id=${`ef-halo-${e}`}>
          <stop offset="0" stop-color=${ct(s)} stop-opacity=${0.55 * Rt} />
          <stop offset="0.45" stop-color=${ct(s)} stop-opacity=${0.18 * Rt} />
          <stop offset="1" stop-color=${ct(s)} stop-opacity="0" />
        </radialGradient>`
    )}
    </defs>`;
  }
  // -- lines and balls ---------------------------------------------------------
  /** Glass tube: bright rim, dark bore tinted with the flow colour, a sheen line. */
  _flow(t, e, s, n, i = !0) {
    const o = s !== null && Math.abs(s) >= B;
    return _`<g class="tube">
        <path d=${t} class="rim" />
        <path d=${t} class="bore" />
        <path d=${t} class="tint" stroke=${e} stroke-opacity=${o ? 0.24 : 0.08} />
        <path d=${t} class="shine" />
      </g>
      ${i ? this._dot(t, e, s, n) : f}`;
  }
  /** The train on path `d`: radius and start time of each ball, travel time and period. */
  _trainOf(t, e) {
    const s = Nt(e).map((a) => rs[a]), n = [];
    let i = 0;
    s.forEach((a, l) => {
      l && (i += s[l - 1] + a + Ai), n.push(i / Ft);
    });
    const o = $e(t) / Ft, c = o + (n[n.length - 1] ?? 0) + Si;
    return { radii: s, begins: n, travel: o, period: c };
  }
  /**
   * Lines without their own train logic (everything except the load lists)
   * get a train of balls instead of one ball whose speed or size shows the power.
   */
  _dot(t, e, s, n = !0, i = 3.2, o) {
    if (o)
      return s === null || Math.abs(s) < B ? _`` : this._ball(e, { route: t, forward: n, r: o.radius ?? i, begin: o.begin, travel: o.travel, period: o.period });
    if (s === null || Math.abs(s) < B) return _``;
    const { radii: c, travel: a, period: l, begins: h } = this._trainOf(t, s);
    return _`${h.map(
      (d, $) => this._ball(e, { route: t, forward: n, r: c[$], begin: d, travel: a, period: l })
    )}`;
  }
  /** One ball riding its route once per period. */
  _ball(t, e) {
    const s = { ...e, begin: e.begin + this._epoch(e.route, e.forward, e.period, e.travel) }, n = this._routeIdx.get(s.route) ?? 0;
    this._routeIdx.set(s.route, n + 1), this._seen.set(`${s.forward ? ">" : "<"}${s.route}#${n}`, { colour: t, b: s });
    const i = (s.travel / s.period).toFixed(4), o = `${s.period.toFixed(2)}s`, c = `${s.begin.toFixed(2)}s`;
    return qn(
      `${c}|${o}|${i}|${s.forward}`,
      this._orb(
        s.r,
        t,
        _`<animateMotion dur=${o} begin=${c} repeatCount="indefinite" calcMode="linear" rotate="auto"
            keyPoints=${s.forward ? "0;1;1" : "1;0;0"} keyTimes=${`0;${i};1`} path=${s.route} />
          <animate attributeName="opacity" dur=${o} begin=${c} repeatCount="indefinite" calcMode="discrete"
            values="1;0" keyTimes=${`0;${i}`} />`,
        !0
      )
    );
  }
  /**
   * Where lines meet in a glass box, the trains are counted anew: the strings'
   * trains end inside the PV total box and the box sends one train with the
   * total PV power to the inverter; the storage box sends one train with the
   * total battery power to or from the inverter and one per battery.
   */
  _trainDots(t, e, s) {
    const n = (u) => t === "battery" && !u ? this._c.battery : e, i = (u, y, g) => t === "battery" && g ? this._mixedTrain(u, y) : this._dot(u, n(g), y, g), o = s.map((u) => i(u.route, u.w, u.forward));
    if (t === "pv") {
      const u = `M ${St[0]} ${St[1]} V ${this._solarY} H ${this._invX}`, y = this._own("solar_power"), g = s.flatMap((v) => this._arrivals(v.route, v.w));
      return _`${o}${this._dot(u, e, y, !0)}${this._blob(St, e, y, g)}`;
    }
    const c = s.reduce((u, y) => y.w === null ? u : (u ?? 0) + y.w, null), [a, l] = this._invBottom, h = `M ${a.toFixed(1)} ${l.toFixed(1)} V ${jt}`, d = (c ?? 0) > 0, $ = [
      ...d ? this._arrivals(h, c) : [],
      ...s.filter((u) => !u.forward).flatMap((u) => this._arrivals(u.route, u.w))
    ];
    return _`${o}${i(h, c, d)}${this._blob([a, jt], n(d), Math.abs(c ?? 0), $)}`;
  }
  /** When the balls of a train on `route` finish their way (at its end, or at its
   *  start for a train running backwards). */
  _arrivals(t, e) {
    if (e === null || Math.abs(e) < B) return [];
    const { radii: s, begins: n, travel: i, period: o } = this._trainOf(t, e), c = this._epochOf(t, o, i);
    return n.map((a, l) => ({ at: c + a + i, period: o, big: s[l] === vs }));
  }
  /**
   * A drop of mercury where trains meet: its size shows the power that flows
   * through, it wobbles all the time and swells for a moment whenever a ball
   * runs into it (additive animations, one per arriving ball).
   */
  _blob([t, e], s, n, i) {
    if (n === null || Math.abs(n) < B) return _``;
    const o = 2.2 + 1.6 * Math.sqrt(Math.min(Math.abs(n), 8e3) / 1e3), c = Object.entries(this._c).find(([, h]) => h === s)?.[0], a = (h, d) => {
      const $ = (h.big ? 1.4 : 0.6) * (d === "rx" ? 1.15 : 0.85), u = Math.min(0.2, 0.12 / h.period), y = Math.min(0.6, 0.55 / h.period);
      return _`<animate attributeName=${d} additive="sum" dur=${`${h.period.toFixed(2)}s`}
        begin=${`${h.at.toFixed(2)}s`} repeatCount="indefinite" values=${`0;${$};0;0`}
        keyTimes=${`0;${u.toFixed(4)};${y.toFixed(4)};1`} />`;
    }, l = (h, d, $) => {
      const u = h === "rx" ? [1, 1.1, 0.94, 1] : [1, 0.92, 1.07, 1];
      return _`<animate attributeName=${h} dur=${`${d}s`} begin=${`${$}s`} repeatCount="indefinite"
        calcMode="spline" keyTimes="0;0.33;0.66;1" keySplines=${"0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1"}
        values=${u.map((y) => (o * y).toFixed(2)).join(";")} />`;
    };
    return _`<g class="orb blob">
      <circle class="halo" cx=${t} cy=${e} r=${o * 2.6} fill=${c ? `url(#ef-halo-${c})` : ct(s)} fill-opacity=${c ? f : 0.2 * Rt} />
      <ellipse class="body" cx=${t} cy=${e} rx=${o} ry=${o} fill=${ct(s)}>
        ${l("rx", 1.7, 0)}${l("ry", 1.7, 0)}
        ${i.map((h) => _`${a(h, "rx")}${a(h, "ry")}`)}
      </ellipse>
      <ellipse cx=${t} cy=${e} rx=${o} ry=${o} fill="url(#ef-ball)">
        ${l("rx", 1.7, 0)}${l("ry", 1.7, 0)}
        ${i.map((h) => _`${a(h, "rx")}${a(h, "ry")}`)}
      </ellipse>
      <ellipse class="sheen" cx=${t - o * 0.32} cy=${e - o * 0.38} rx=${o * 0.4} ry=${o * 0.24} fill="#ffffff" fill-opacity="0.6" />
    </g>`;
  }
  // the house power runs into a blob in the house box; the load trains leave it
  _houseJunction(t) {
    return this._blob(Ut, this._c.home, t, this._arrivals(this._houseIn(), t));
  }
  /** Glowing glass ball: soft halo, coloured body, white core and a sheen. */
  _orb(t, e, s, n = !1) {
    const i = t, o = Object.entries(this._c).find(([, c]) => c === e)?.[0];
    return _`<g class="orb" opacity=${n ? "0" : f}>
      ${s}
      <circle class="halo" r=${i * 2.8} fill=${o ? `url(#ef-halo-${o})` : ct(e)} fill-opacity=${o ? f : 0.18 * Rt} />
      <circle class="body" r=${i} fill=${ct(e)} />
      <circle r=${i} fill="url(#ef-ball)" />
      <circle class="sheen" cx=${-0.3 * i} cy=${-0.35 * i} r=${i * 0.38} fill="#ffffff" fill-opacity="0.6" />
    </g>`;
  }
  // -- glass building blocks -----------------------------------------------------
  /** A glass slab: drop shadow, tinted body, frosted gradient and a top sheen. */
  _panel(t, e, s, n, i) {
    const o = Math.min(7, n / 3);
    return _`<g>
      <rect x=${t + 1} y=${e + 2.5} width=${s} height=${n} rx=${o} fill="#020a14" fill-opacity="0.32" />
      <rect x=${t} y=${e} width=${s} height=${n} rx=${o} fill=${i} fill-opacity="0.1" />
      <rect x=${t} y=${e} width=${s} height=${n} rx=${o} fill="url(#ef-slab)" stroke=${i} stroke-opacity="0.55"
        stroke-width="0.9" />
      <rect x=${t + 1.5} y=${e + 1.2} width=${s - 3} height=${Math.min(n * 0.42, 12)} rx=${Math.max(1, o - 1)}
        fill="url(#ef-sheen)" />
    </g>`;
  }
  /** A Tabler line icon at (x, y), `size` px. */
  _line(t, e, s, n, i) {
    return _`<g transform=${`translate(${e} ${s}) scale(${n / 24})`} fill="none" stroke=${i} stroke-width="1.7"
      stroke-linecap="round" stroke-linejoin="round">${yi[t].map((o) => _`<path d=${o} />`)}</g>`;
  }
  // -- sections ------------------------------------------------------------------
  _solarIcon() {
    return _``;
  }
  /** The glass solar panel picture below the string labels. */
  _solarBack() {
    return _`<image href=${Ci} x=${ks} y=${Ms} width=${As}
      height=${(wt.height * me).toFixed(1)} />`;
  }
  /** One PV string: a glass label filling its part of the panel, lying in the
   *  panel's plane, with the same gap to the frame and to its neighbours. A single
   *  string has no label: its numbers sit right on the glass panel. */
  _stringTile(t, e, s, n) {
    const i = t + ce / 2, o = e + he / 2, c = this._labels, a = c.length === 1, h = c.reduce(
      (x, k) => Math.hypot(k.middle[0] - i, k.middle[1] - o) < Math.hypot(x.middle[0] - i, x.middle[1] - o) ? k : x
    ).corners.map(([x, k]) => `${x.toFixed(1)},${k.toFixed(1)}`).join(" "), [d, $] = wt.across, [u, y] = wt.down, g = c.length === 1 ? 17 : c.length === 2 ? 14 : 12, v = c.length === 1 ? 9 : c.length === 2 ? 8 : 7.5, w = g * 0.35;
    return _`
      ${a ? f : _`<polygon points=${h} fill="#020a14" fill-opacity="0.35" transform="translate(0.8 1.6)" />
          <polygon points=${h} fill=${n} fill-opacity="0.12" />
          <polygon points=${h} fill="url(#ef-slab)" stroke=${n} stroke-opacity="0.6" stroke-width="0.8"
            stroke-linejoin="round" />`}
      <g transform=${`matrix(${d} ${$} ${u} ${y} ${i.toFixed(1)} ${o.toFixed(1)})`}
        style=${a ? "filter: drop-shadow(0 1px 1.5px rgba(0, 6, 15, 0.8))" : f}>
        <text x="0" y=${w} text-anchor="middle" class="val" font-size=${this._fs(g)} font-weight="600"
          >${L(this._w(s), this._loc)}</text>
        <text x="0" y=${w + v + 3} text-anchor="middle" class="tiny" style=${`font-size:${this._fs(v)}px`}
          >${bt(this._name(s), c.length === 4 || c.length === 3 ? 16 : 22)}</text>
      </g>`;
  }
  /** The glass inverter picture, placed by its connectors. */
  _inverter() {
    const [t, e] = xe([0, 0]);
    return _`<image href=${Ri} x=${t.toFixed(1)} y=${e.toFixed(1)}
      width=${(pt.width * te).toFixed(1)} height=${(pt.height * te).toFixed(1)} />`;
  }
  /** Glass cylinder with a moving liquid level; name, SoC, kWh, power, status inside. */
  _batteryWidget(t, e, s, n, i, o, c, a, l = null) {
    const h = e - n / 2 + 2, d = e + n / 2 - 2, $ = (d - h) / 2, u = 3.5, y = s + 8, g = s + Wt, v = Math.max(0, Math.min(100, o ?? 0)), w = g + u - (g + u - y) * (v / 100), x = `ef-bat-${Math.round(e)}-${Math.round(s)}`, k = `M ${h} ${y} V ${g} A ${$} ${u} 0 0 0 ${d} ${g} V ${y} A ${$} ${u} 0 0 0 ${h} ${y} Z`, O = i !== null && Math.abs(i) >= B, S = this._lineFlow(t, i), P = S !== null && S > B, I = O ? 3.4 : 5.5, X = S !== null && S < -B, W = n < 54, U = l && o !== null ? V(l * o / 100, this._loc) : "";
    return _`<g>
      <ellipse cx=${e} cy=${g + 4} rx=${$ + 8} ry="6" fill="url(#ef-shadow)" />
      <clipPath id=${x}><path d=${k} /></clipPath>
      <path d=${k} fill=${a} fill-opacity="0.07" />
      ${v > 0 ? _`<g clip-path=${`url(#${x})`}>
            ${this._liquid(h, d, w, g + u + 2, a, I)}
          </g>` : f}
      ${P ? _`<g clip-path=${`url(#${x})`}>${this._splash(e, y, w, $, a, S, s)}</g>` : f}
      <path d=${k} fill="url(#ef-tube)" stroke=${D} stroke-opacity="0.55" stroke-width="0.9" />
      ${X ? this._riseIntoLine(e, g, s, this._c.battery, S) : f}
      <ellipse cx=${e} cy=${y} rx=${$} ry=${u} fill=${a} fill-opacity="0.12" stroke="#e6f6ff" stroke-opacity="0.7"
        stroke-width="0.8" />
      <rect x=${e - 6} y=${s + 3} width="12" height=${y - s - 3} fill=${a} fill-opacity="0.28" stroke=${D}
        stroke-opacity="0.6" stroke-width="0.7" />
      <ellipse cx=${e} cy=${s + 3} rx="6" ry="1.8" fill="#e6f6ff" fill-opacity="0.45" />
      <text x=${e} y=${s + 20} text-anchor="middle" class="bt" font-size=${this._fs(7.5)}>${bt(t, W ? 9 : 11)}</text>
      <text x=${e} y=${s + 33} text-anchor="middle" class="bt" font-size=${this._fs(13)} font-weight="600">${Ht(o, this._loc)}</text>
      <text x=${e} y=${s + 43} text-anchor="middle" class="bt" font-size=${this._fs(8)}>${U}</text>
      <text x=${e} y=${s + 53} text-anchor="middle" class="bt" font-size=${this._fs(8.5)}>${L(i === null ? null : Math.abs(i), this._loc)}</text>
      <text x=${e} y=${s + 62} text-anchor="middle" class="bt" font-size=${this._fs(7.5)}>${c}</text>
    </g>`;
  }
  /**
   * Liquid like a phone's charging animation: one soft surface that slowly
   * sloshes between a few shapes (no repeating waves), a lighter layer behind
   * it and a bright rim. Every shape has the same commands so SMIL can morph
   * between them. Fills x0..x1 from `lvl` down to `bottom`; clip it outside.
   */
  _liquid(t, e, s, n, i, o) {
    const c = e - t, a = ([d, $, u, y], g) => `M ${t - 1} ${(g + d).toFixed(2)} C ${(t + c * 0.35).toFixed(2)} ${(g + $).toFixed(2)} ${(e - c * 0.35).toFixed(2)} ${(g + u).toFixed(2)} ${e + 1} ${(g + y).toFixed(2)}`, l = (d, $, u) => a(Mi[d], $) + (u ? ` V ${n} H ${t - 1} Z` : ""), h = (d, $, u, y) => _`<path d=${l(u[0], d, $)}>
        <animate attributeName="d" dur=${`${y.toFixed(1)}s`} repeatCount="indefinite" calcMode="spline"
          keyTimes="0;0.25;0.5;0.75;1" keySplines=${ls}
          values=${[...u, u[0]].map((g) => l(g, d, $)).join(";")} />
      </path>`;
    return _`
      <g fill=${i} fill-opacity="0.35">${h(s - 1, !0, [2, 3, 0, 1], o * 1.3)}</g>
      <g fill="url(#ef-liquid)">${h(s, !0, [0, 1, 2, 3], o)}</g>
      <g fill="none" stroke="#e9fff3" stroke-opacity="0.55" stroke-width="0.8">${h(s, !1, [0, 1, 2, 3], o)}</g>`;
  }
  // load list trains count the power in balls as well, big ones in front
  _wagonBalls(t, e, s) {
    const n = Nt(t), i = e === this._c.backup ? this._tints(n, this._backupShares(s)) : this._tints(n);
    return n.map((o, c) => ({ r: rs[o], colour: i[c] }));
  }
  // on the shared feed of a list the balls are consolidated (big ones per
  // full 1000 W of the whole group); they split up at the bracket
  _feedTrain(t, e, s, n) {
    if (e < B) return _``;
    const i = this._wagonBalls(e, s, n), { begins: o, travel: c, period: a } = this._trainOf(t, e);
    return _`${i.map(
      (l, h) => this._ball(l.colour, { route: t, forward: !0, r: l.r, begin: o[h], travel: c, period: a })
    )}`;
  }
  /**
   * Where a battery's backup loads get their power: from the battery (green);
   * a backup-only battery passes power from the house through as well, that
   * part has the house's colours (input up to its output, the rest from the cells).
   */
  _backupShares(t) {
    const e = this._layout?.batteries.find((c) => c.name === t);
    if (!e?.backup_only) return [0, 1, 0];
    const s = Math.max(this._w(e.charge) ?? 0, 0), n = Math.max(this._w(e.discharge) ?? 0, 0), i = n > 0 ? Math.min(s, n) / n : 0, o = this._houseShares();
    return [o[0] * i, o[1] * i + (1 - i), o[2] * i];
  }
  /** Shares of PV, batteries and grid in what the house net gets right now. */
  _houseShares() {
    const t = (this._layout?.batteries ?? []).filter((e) => !e.backup_only).reduce((e, s) => e + Math.max(0, -(C(this._s(s.power)) ?? 0)), 0);
    return cn(this._own("solar_power"), t, this._own("grid_power"));
  }
  /** Colours for a train's balls by source shares (PV, battery, grid); default: the house's mix. */
  _tints(t, e = this._houseShares()) {
    const s = [this._c.solar, this._c.battery, this._c.grid];
    return hn(t, e).map((n) => s[n]);
  }
  /** A train whose balls show where the power comes from (PV, battery, grid). */
  _mixedTrain(t, e, s = !0) {
    if (e === null || Math.abs(e) < B) return _``;
    const { radii: n, begins: i, travel: o, period: c } = this._trainOf(t, e), a = this._tints(Nt(e));
    return _`${i.map((l, h) => this._ball(a[h], { route: t, forward: s, r: n[h], begin: l, travel: o, period: c }))}`;
  }
  _houseDots(t, e, s) {
    return this._mixedTrain(t, s);
  }
  get _wagonSpeed() {
    return Ft;
  }
  /** A battery's own line: from the blob in the storage box to the battery's cap. */
  _route(t, e) {
    return `M ${this._invBottom[0].toFixed(1)} ${jt} V ${jt + Zt / 2} H ${t} V ${e}`;
  }
  _batteryRoute(t, e) {
    return this._route(t, e);
  }
  // Trains run into the glass boxes and new ones leave them: each PV string
  // into the middle of "PV gesamt", the house power from the inverter into
  // the middle of the house box, the load trains from there; backup trains
  // start at the bottom of their battery and leave through its shell.
  _stringRoute(t, e) {
    return `M ${t + ce / 2} ${e + he / 2} V ${ye + 13} H ${St[0]} V ${St[1]}`;
  }
  _houseIn() {
    const [t, e] = this._invTop;
    return `M ${t} ${e} V ${Ut[1]}`;
  }
  _houseLead(t) {
    return `M ${Ut[0]} ${Ut[1]} H 281 V ${t} H 285`;
  }
  _batteryLead(t, e, s, n) {
    return `M ${t} ${e + Wt - 2} V ${n} H ${this._batteryOutX(t, s)}`;
  }
  /**
   * Bubbles of a discharging battery: each rises from the bottom to the cap
   * and arrives just when a ball of the outgoing train starts there, so it
   * looks as if the bubble drives on into the line.
   */
  _riseIntoLine(t, e, s, n, i) {
    const o = s + 3, { radii: c, begins: a, period: l } = this._trainOf(this._route(t, s), i);
    return _`${a.map((h, d) => {
      const $ = c[d], u = Math.min(l * 0.8, (e - o) / Ft), y = (u / l).toFixed(4), g = `${l.toFixed(2)}s`, v = `${(h - u).toFixed(2)}s`;
      return _`<circle cx=${t} cy=${e} r=${$} fill=${n} stroke="#ffffff" stroke-opacity="0.75" stroke-width="0.5"
        opacity="0">
        <animate attributeName="cy" dur=${g} begin=${v} repeatCount="indefinite" values=${`${e};${o};${o}`}
          keyTimes=${`0;${y};1`} />
        <animate attributeName="r" dur=${g} begin=${v} repeatCount="indefinite"
          values=${`${$ * 0.45};${$};${$}`} keyTimes=${`0;${y};1`} />
        <animate attributeName="opacity" dur=${g} begin=${v} repeatCount="indefinite" calcMode="discrete"
          values="0.9;0" keyTimes=${`0;${y}`} />
      </circle>`;
    })}`;
  }
  /**
   * A drop falls into the liquid each time a ball of the train arrives at the
   * battery, then a ripple spreads and two droplets jump. Uses the train's own
   * timing, so it stays in step with the arriving balls.
   */
  _splash(t, e, s, n, i, o, c) {
    const { travel: a, period: l, begins: h } = this._trainOf(this._route(t, c), o), d = this._tints(Nt(o));
    return _`${h.map(($, u) => this._splashOnce(t, e, s, n, d[u] ?? i, l, $ + a))}`;
  }
  /** One drop with ripple, repeating every `period` s from `start` s on. */
  _splashOnce(t, e, s, n, i, o, c) {
    const l = Math.min(0.45, o * 0.35) / o, h = Math.min(0.97, l + 0.6 / o), d = l + (h - l) * 0.4, $ = l + 1e-3, u = (w) => w.toFixed(3), y = `${o.toFixed(2)}s`, g = `${c.toFixed(2)}s`, v = (w, x, k, O = !1) => _`<animate attributeName=${w}
      dur=${y} begin=${g} repeatCount="indefinite" values=${x} keyTimes=${k}
      calcMode=${O ? "spline" : "linear"} keySplines=${O ? "0.55 0 1 0.6;0 0 1 1" : f} />`;
    return _`
      <ellipse cx=${t} cy=${e} rx="1.5" ry="2.1" fill=${i} stroke="#ffffff" stroke-opacity="0.7" stroke-width="0.4" opacity="0">
        ${v("cy", `${e + 1};${s - 1};${s - 1}`, `0;${u(l)};1`, !0)}
        ${v("opacity", "1;1;0;0", `0;${u(l)};${u($)};1`)}
      </ellipse>
      <ellipse cx=${t} cy=${s} rx="1" ry="0.5" fill="none" stroke="#e9fff3" stroke-width="0.8" opacity="0">
        ${v("rx", `1;1;${u(n * 0.75)};${u(n * 0.75)}`, `0;${u(l)};${u(h)};1`)}
        ${v("ry", "0.5;0.5;2;2", `0;${u(l)};${u(h)};1`)}
        ${v("opacity", "0;0;0.9;0;0", `0;${u(l)};${u($)};${u(h)};1`)}
      </ellipse>
      ${[-1, 1].map(
      (w) => _`<circle cx=${t + w * 3} cy=${s} r="0.9" fill=${i} stroke="#ffffff" stroke-opacity="0.6" stroke-width="0.3"
          opacity="0">
          ${v("cy", `${s};${s};${s - 6};${s};${s}`, `0;${u(l)};${u(d)};${u(h)};1`)}
          ${v("cx", `${t};${t};${t + w * 3};${t + w * 5};${t + w * 5}`, `0;${u(l)};${u(d)};${u(h)};1`)}
          ${v("opacity", "0;0;1;0;0", `0;${u(l)};${u($)};${u(h)};1`)}
        </circle>`
    )}`;
  }
  /** 2.5D glass house: gable front, side wall, roof, chimney and warm windows. */
  _houseIcon(t) {
    const e = this._c.solar;
    return _`<g transform=${`translate(225 ${be - 51}) scale(0.9)`}>
      <ellipse cx="28" cy="50" rx="30" ry="5" fill="url(#ef-shadow)" />
      <polygon points="4,28 14,18 42,6 32,16" fill=${t} fill-opacity="0.08" stroke=${D} stroke-opacity="0.3" stroke-width="0.7" />
      <polygon points="24,52 52,40 52,24 24,36" fill=${t} fill-opacity="0.12" stroke=${D} stroke-opacity="0.6" stroke-width="0.8" />
      <polygon points="24,52 52,40 52,24 24,36" fill="url(#ef-slab)" />
      <polygon points="4,44 24,52 24,36 14,18 4,28" fill=${t} fill-opacity="0.2" stroke=${D} stroke-opacity="0.75" stroke-width="0.9" />
      <polygon points="4,44 24,52 24,36 14,18 4,28" fill="url(#ef-slab)" />
      <polygon points="24,36 52,24 42,6 14,18" fill=${t} fill-opacity="0.28" stroke=${D} stroke-opacity="0.75" stroke-width="0.9" />
      <polygon points="24,36 52,24 42,6 14,18" fill="url(#ef-sheen)" />
      <polygon points="36.6,15 39.4,13.8 39.4,5.8 36.6,7" fill=${t} fill-opacity="0.35" stroke=${D} stroke-opacity="0.7" stroke-width="0.7" />
      <polygon points="28.2,43.2 35.2,40.2 35.2,32.2 28.2,35.2" fill=${e} fill-opacity="0.5" stroke=${e} stroke-opacity="0.8" stroke-width="0.6" />
      <polygon points="40.8,37.8 47.8,34.8 47.8,26.8 40.8,29.8" fill=${e} fill-opacity="0.5" stroke=${e} stroke-opacity="0.8" stroke-width="0.6" />
      <polygon points="12,47.2 17,49.2 17,37.2 12,35.2" fill=${t} fill-opacity="0.4" stroke=${D} stroke-opacity="0.7" stroke-width="0.6" />
      <ellipse cx="14" cy="28" rx="2.2" ry="2.6" fill=${e} fill-opacity="0.45" stroke=${e} stroke-opacity="0.7" stroke-width="0.5" />
      <path d="M 14 18 L 42 6" stroke="#ffffff" stroke-opacity="0.95" stroke-width="1.2" stroke-linecap="round" />
      <path d="M 4 28 V 44 M 24 36 V 52" stroke="#ffffff" stroke-opacity="0.55" stroke-width="0.8" />
    </g>`;
  }
  /**
   * Left column as in the glass concept: a free-standing glass pylon with one
   * glass cable into the inverter, the grid tile below it and the wallbox
   * below that.
   */
  // pale on the dark glass: present, but not loud
  _priceColour(t) {
    return t ? "#86d69a" : "#f08a84";
  }
  _grid() {
    const t = this._c.grid, e = this._invX, { grid: s, exporting: n, cents: i, label: o, power: c, imp: a, exp: l } = this._gridData(), [h, d] = pe[pe.length - 1], $ = ds + h * ue, u = ps + (d + 6) * ue, y = Gt[1][1], g = Math.max(u, y) + 12, v = `M ${$.toFixed(1)} ${u.toFixed(1)} Q ${(($ + e) / 2).toFixed(1)} ${g.toFixed(1)} ${e} ${y}`, w = i !== null ? He(i, this._loc) : "", x = [
      { arrow: "↓", kwh: a, name: "Bez.", active: o === "Bezug" },
      { arrow: "↑", kwh: l, name: "Einsp.", active: o === "Einspeisung" }
    ].filter((P) => P.kwh !== null), k = _e, O = k + (i !== null ? 23 : 15), S = this._gridTileH();
    return _`
      ${this._pylon(t)}
      ${this._flow(v, t, s, !n)}
      ${this._tap(this._layout.entities.grid_power, this._panel(mt, k, Dt, S, t))}
      <text x=${mt + Dt / 2} y=${k + 11} text-anchor="middle" class="val" font-size=${this._fs(11.5)} font-weight="600"
        >${c}</text>
      ${i !== null ? _`<text x=${mt + Dt / 2} y=${k + 19.5} text-anchor="middle" class="price" fill=${this._priceColour(n)}
            style=${`font-size:${this._fs(8.5)}px`}>${w}</text>` : f}
      ${x.length ? _`<line x1=${mt + 3} x2=${mt + Dt - 3} y1=${O} y2=${O} class="sep" stroke=${t} />` : f}
      ${x.map(
      (P, I) => _`<text x=${mt + 3} y=${O + 8 + I * 8.5} class=${P.active ? "val" : "dim"} style=${`font-size:${this._fs(7.8)}px`}
          ><tspan fill=${P.active ? t : f}>${P.arrow}</tspan> ${V(P.kwh, this._loc)}<tspan
          class=${P.active ? "" : "tiny"} style=${`font-size:${this._fs(7.5)}px`} fill=${P.active ? t : f}> ${P.name}</tspan></text>`
    )}
      ${this._wallbox(this._carTop())}
    `;
  }
  /** Height of the grid tile: power, the price if there is one, today's import / export. */
  _gridTileH() {
    const { cents: t, imp: e, exp: s } = this._gridData(), n = (e !== null ? 1 : 0) + (s !== null ? 1 : 0);
    return (t !== null ? 23 : 15) + (n ? n * 8.5 + 3 : 0);
  }
  /** Height of the car picture in card units. */
  get _carH() {
    return Y.height * (Xt / Y.width);
  }
  // the car hangs below the grid tile: without batteries (or with few lists)
  // it may reach further down than anything else, the card grows with it
  get _viewH() {
    const t = super._viewH;
    return this._layout?.wallbox ? Math.max(t, this._carTop() + this._carH + 4) : t;
  }
  /** Top of the car picture: its plate ends flush with the lowest battery, but
   *  never higher than just below the grid tile. */
  _carTop(t = _e + this._gridTileH() + 8) {
    const e = this._displayBatteries();
    if (!e.length) return t;
    const s = Math.max(...e.map((n) => n.top)) + Wt + 3.5;
    return Math.max(t, s - this._carH);
  }
  /**
   * Wallbox below the grid tile: the glass car picture (car, glass plate and
   * wallbox) with sloshing liquid inside the car body up to its state of
   * charge; power and today's energy are written on the plate along its front
   * edges. Fed from the inverter's left side into the wallbox.
   */
  _wallbox(t) {
    const e = this._layout?.wallbox;
    if (!e) return _``;
    const s = e.flexible ? this._c.flexible : this._c.home, n = this._w(e.power), i = C(this._s(e.soc ?? void 0)), o = C(this._s(e.today ?? void 0)), c = n === null || Math.abs(n) < B, a = !c && (n ?? 0) > 0, l = Xt / Y.width, h = ([j, E]) => [Yt + j * l, t + E * l], d = i === null ? null : Math.max(0, Math.min(100, i)) / 100, $ = (d ?? 0) * Y.liquidHeight, [u, y, g, v] = Y.floorQuad, w = ([j, E], Q) => `${j.toFixed(1)},${(E - Q).toFixed(1)}`, x = (j) => {
      const [E, Q, $t, Be] = j.map((Es) => Math.max(0, $ + Es));
      return {
        body: [w(u, 0), w(y, 0), w(g, 0), w(g, $t), w(v, Be), w(u, E)].join(" "),
        surface: [w(u, E), w(y, Q), w(g, $t), w(v, Be)].join(" "),
        edge: [w(u, E), w(y, Q), w(g, $t)].join(" ")
      };
    }, k = Wi.map((j) => x(j)), O = a ? 3.4 : 5.5, S = (j) => _`<animate attributeName="points" dur=${`${O}s`}
      repeatCount="indefinite" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" keySplines=${ls}
      values=${[...k, k[0]].map((E) => E[j]).join(";")} />`, P = `ef-car-${Math.round(t)}`, I = `translate(${Yt} ${t}) scale(${l.toFixed(5)})`, X = this._invX, W = Gt[2][1], [U, K] = h(Y.wallboxTop), J = _e - 12, at = `M ${X} ${W} H ${X - 10} V ${J} H ${U.toFixed(1)} V ${K.toFixed(1)}`, [et, gt] = h(Y.powerText), [p, b] = h(Y.energyText), M = Y.edgeAngle, [A, q] = h([(y[0] + g[0]) / 2, (y[1] + g[1]) / 2 - Math.max($ / 2, 14)]);
    return _`
      ${this._flow(at, s, n, !0, !1)}
      ${this._mixedTrain(at, n)}
      <g class="tap" data-entity=${e.power}>
        <title>${e.name} · ${e.flexible ? "Zusatzverbraucher" : "Grundlast"}</title>
        <image href=${Fi} x=${Yt} y=${t} width=${Xt} height=${(Y.height * l).toFixed(1)} />
        ${d ? _`<g transform=${I}>
              <clipPath id=${P}><polygon points=${Y.tank} /></clipPath>
              <g clip-path=${`url(#${P})`} opacity="0.7">
                <polygon points=${k[0].body} fill="url(#ef-liquid)">${S("body")}</polygon>
                <polygon points=${k[0].surface} fill="#c8ffe0" fill-opacity="0.45">${S("surface")}</polygon>
                <polyline points=${k[0].edge} fill="none" stroke="#e9fff3" stroke-opacity="0.85" stroke-width="2.4"
                  stroke-linejoin="round">${S("edge")}</polyline>
              </g>
            </g>` : f}
        ${i !== null ? _`<text x=${A.toFixed(1)} y=${q.toFixed(1)} text-anchor="middle" class="bt" font-size=${this._fs(9)}
              font-weight="600">${Ht(i, this._loc)}</text>` : f}
        <text transform=${`translate(${et.toFixed(1)} ${gt.toFixed(1)}) rotate(${M})`} class=${c ? "dim" : "val"}
          style=${`font-size:${this._fs(11)}px`} font-weight="600">${L(n, this._loc)}</text>
        <text transform=${`translate(${p.toFixed(1)} ${b.toFixed(1)}) rotate(${-M})`} class="dim"
          style=${`font-size:${this._fs(11)}px`}>${V(o, this._loc)}</text>
      </g>`;
  }
  /** Free-standing pylon of glass rods on a hexagonal glass plate. */
  _pylon(t) {
    const e = de([...cs, ...hs, ...Pi]), s = de([...cs, ...hs], 7, -4), n = de(Bi), i = "65.5,84 48.5,92.7 14.5,92.7 -2.5,84 14.5,75.3 48.5,75.3";
    return _`<g transform=${`translate(${ds} ${ps}) scale(${ue})`}>
      <ellipse cx="31.5" cy="97" rx="40" ry="7" fill="url(#ef-shadow)" />
      <polygon points=${"65.5,84 65.5,87 48.5,95.7 14.5,95.7 -2.5,87 -2.5,84 14.5,92.7 48.5,92.7"} fill=${t} fill-opacity="0.3" stroke=${D} stroke-opacity="0.4" stroke-width="0.6" />
      <polygon points=${i} fill=${t} fill-opacity="0.14" stroke=${D} stroke-opacity="0.65" stroke-width="0.8" />
      <polygon points=${i} fill="url(#ef-slab)" />
      <path d=${s} fill="none" stroke=${t} stroke-opacity="0.22" stroke-width="2.6" stroke-linecap="round" />
      <path d=${s} fill="none" stroke=${D} stroke-opacity="0.4" stroke-width="0.7" stroke-linecap="round" />
      <path d=${n} fill="none" stroke=${D} stroke-opacity="0.35" stroke-width="1.4" stroke-linecap="round" />
      <path d=${e} fill="none" stroke=${t} stroke-opacity="0.35" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" />
      <path d=${e} fill="none" stroke="#e6f6ff" stroke-opacity="0.9" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
      ${pe.map(
      ([c, a]) => _`
          <path d=${`M ${c} ${a} V ${a + 6}`} stroke=${D} stroke-opacity="0.8" stroke-width="0.8" />
          <circle cx=${c} cy=${a + 2.5} r="1.4" fill=${t} /><circle cx=${c} cy=${a + 5} r="1.4" fill=${t} />
          <circle cx=${c} cy=${a + 3.7} r="0.6" fill="#ffffff" />`
    )}
      ${Vi.map(([c, a]) => _`<circle cx=${c} cy=${a} r="1.3" fill="#ffffff" fill-opacity="0.85" />`)}
    </g>`;
  }
  // -- load groups -------------------------------------------------------------
  /** Each group sits on its own tinted glass slab. */
  // a small "Gesamt" box above all load groups: every consumer incl. backup loads
  get _groupsTop() {
    return 22 + Et + us;
  }
  _listsHeader(t) {
    const e = F - 12, s = 4, n = this._c.home, i = C(this._s(this._layout?.home_today));
    return this._tap(this._layout?.entities.home_power, _`
      ${this._panel(e, s, tt + 3 - e, Et, n)}
      <text x=${F - 6} y=${s + Et * 0.68} class="small grp" fill=${n}>Gesamt</text>
      <text x=${rt - 1} y=${s + Et * 0.68} text-anchor="end" class="val" style=${`font-size:${this._fs(10)}px`}
        font-weight="600">${L(t, this._loc)}</text>
      <text x=${tt - 1} y=${s + Et * 0.68} text-anchor="end" class="dim" style=${`font-size:${this._fs(9)}px`}
        >${V(i, this._loc)}</text>`);
  }
  _groupPanel(t) {
    const e = F - 12, s = t.titleY - 13, n = t.y0 + t.rows * this._rowH + 3;
    return this._panel(e, s, tt + 3 - e, n - s, t.colour);
  }
  _groupIcon() {
    return _``;
  }
  _groupTitle(t, e, s, n, i) {
    const o = i.reduce((c, a) => {
      const l = C(this._s(a.today));
      return l === null ? c : (c ?? 0) + l;
    }, null);
    return _`
      <text x=${F - 6} y=${t} class="small grp" fill=${e}>${s}</text>
      <text x=${rt - 1} y=${t} text-anchor="end" class="small" style=${`font-size:${this._fs(8)}px`} fill=${e}>${L(n, this._loc)}</text>
      <text x=${tt - 1} y=${t} text-anchor="end" class="small" style=${`font-size:${this._fs(8)}px`} fill=${e}>${V(o, this._loc)}</text>`;
  }
  /** Line icon chosen from the name, then the name (wrapped if long). */
  _nameBox(t, e, s, n = t, i = 0) {
    const o = this._rowH, c = 9, a = F + i, l = a + c + 3, h = rt - Oi - l, { lines: d, small: $ } = ge(t, Math.floor(h / Ni), Math.floor(h / Ii));
    return _`<g>
      <title>${n}</title>
      ${this._line(wi(t), a, e + (o - c) / 2, c, s)}
      ${$ && d.length > 1 ? _`<text x=${l} y=${e + o / 2 - 1.5} class="name" font-size=${this._fs(7.5)}>${d[0]}</text>
              <text x=${l} y=${e + o / 2 + 5.5} class="name" font-size=${this._fs(7.5)}>${d[1]}</text>` : _`<text x=${l} y=${e + o / 2 + ($ ? 2.2 : 3)} class="name" font-size=${this._fs($ ? 7.5 : 9.5)}
            >${d[0]}</text>`}
    </g>`;
  }
  /** Plain right-aligned numbers: the group slab is the glass. */
  _valueCell(t, e, s, n, i, o, c, a) {
    return _`<text x=${t + s - 1} y=${e + n / 2 + c * 0.36} text-anchor="end" class=${a === "power" ? "val" : "dim"}
      font-size=${this._fs(c + 0.5)}>${o}</text>`;
  }
};
Pe.styles = [
  Z.styles,
  se`
      ha-card {
        padding: 10px;
        border-radius: 22px;
        border: 1px solid rgba(160, 215, 255, 0.14);
        background:
          radial-gradient(38% 30% at 18% 12%, rgba(255, 212, 59, 0.18), transparent 70%),
          radial-gradient(34% 32% at 10% 62%, rgba(62, 224, 143, 0.16), transparent 70%),
          radial-gradient(30% 26% at 62% 2%, rgba(62, 224, 143, 0.14), transparent 70%),
          radial-gradient(40% 36% at 42% 95%, rgba(62, 224, 143, 0.1), transparent 70%),
          radial-gradient(60% 50% at 96% 50%, rgba(77, 178, 255, 0.12), transparent 70%),
          linear-gradient(165deg, #0d2a47 0%, #0b3150 45%, #0a2440 100%);
        box-shadow:
          0 14px 40px rgba(0, 10, 25, 0.55),
          inset 0 1px 0 rgba(255, 255, 255, 0.08);
        color: #eaf6ff;
      }
      .val,
      .name,
      .big,
      .soc,
      .tiny.val {
        fill: #eef7ff;
      }
      .lbl,
      .small,
      .tiny {
        fill: rgba(214, 236, 255, 0.66);
      }
      /* the classic look's text classes at FONT_SCALE (0.8) */
      .lbl,
      .small {
        font-size: 8px;
      }
      .tiny {
        font-size: 6.4px;
      }
      .soc {
        font-size: 10.4px;
      }
      .big {
        font-size: 12.8px;
      }
      .dim {
        fill: rgba(214, 236, 255, 0.72);
      }
      .tube path {
        fill: none;
        stroke-linejoin: round;
        stroke-linecap: round;
      }
      .tube .rim {
        stroke: #bfe6ff;
        stroke-opacity: 0.3;
        stroke-width: 6.2;
      }
      .tube .bore {
        stroke: #0b2a46;
        stroke-opacity: 0.92;
        stroke-width: 4.4;
      }
      .tube .tint {
        stroke-width: 4.4;
      }
      .tube .shine {
        stroke: #ffffff;
        stroke-opacity: 0.22;
        stroke-width: 0.8;
      }
      /* the pipes inside the load lists: thinner glass tubes */
      .pipe path {
        fill: none;
        stroke-linejoin: round;
        stroke-linecap: round;
      }
      .pipe .rim {
        stroke: #bfe6ff;
        stroke-opacity: 0.28;
        stroke-width: 4.6;
      }
      .pipe .bore {
        stroke: #0b2a46;
        stroke-opacity: 0.9;
        stroke-width: 3;
      }
      .pipe .tint {
        stroke-width: 3;
        stroke-opacity: 0.22;
      }
      .pipe .shine {
        stroke: #ffffff;
        stroke-opacity: 0.2;
        stroke-width: 0.6;
      }
      .pipe.child .rim {
        stroke-width: 3.6;
      }
      .pipe.child .bore,
      .pipe.child .tint {
        stroke-width: 2.2;
      }
      .bt {
        fill: #f2fff8;
        paint-order: stroke;
        stroke: rgba(3, 28, 22, 0.55);
        stroke-width: 2px;
        stroke-linejoin: round;
      }
      line.sep {
        stroke-width: 0.6;
        stroke-opacity: 0.35;
      }
      .msg {
        color: rgba(214, 236, 255, 0.7);
      }
    `
];
let ve = Pe;
customElements.get("energiefluss-glass-card") || customElements.define("energiefluss-glass-card", ve);
window.customCards = window.customCards ?? [];
window.customCards.some((r) => r.type === "energiefluss-glass-card") || window.customCards.push({
  type: "energiefluss-glass-card",
  name: "Wattrio Energiefluss Glas",
  description: "Wattrio: Energiefluss im 2.5D-Glas-Look mit Glasrohren und leuchtenden Kugelzügen – gleiche Daten wie Wattrio Klassik.",
  preview: !0
});
export {
  f as A,
  Mn as E,
  Qt as U,
  se as a,
  m as b,
  Gi as g,
  dt as i,
  ft as n,
  H as r
};
