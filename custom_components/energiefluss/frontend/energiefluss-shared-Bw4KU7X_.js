/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ut = globalThis, we = Ut.ShadowRoot && (Ut.ShadyCSS === void 0 || Ut.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, be = Symbol(), Ce = /* @__PURE__ */ new WeakMap();
let hs = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== be) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (we && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = Ce.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && Ce.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ks = (l) => new hs(typeof l == "string" ? l : l + "", void 0, be), qt = (l, ...t) => {
  const e = l.length === 1 ? l[0] : t.reduce((s, n, o) => s + ((i) => {
    if (i._$cssResult$ === !0) return i.cssText;
    if (typeof i == "number") return i;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + i + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + l[o + 1], l[0]);
  return new hs(e, l, be);
}, Ms = (l, t) => {
  if (we) l.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), n = Ut.litNonce;
    n !== void 0 && s.setAttribute("nonce", n), s.textContent = e.cssText, l.appendChild(s);
  }
}, Pe = we ? (l) => l : (l) => l instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return ks(e);
})(l) : l;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: As, defineProperty: Ls, getOwnPropertyDescriptor: Ss, getOwnPropertyNames: Es, getOwnPropertySymbols: zs, getPrototypeOf: Hs } = Object, Kt = globalThis, Be = Kt.trustedTypes, Cs = Be ? Be.emptyScript : "", Ps = Kt.reactiveElementPolyfillSupport, Mt = (l, t) => l, Dt = { toAttribute(l, t) {
  switch (t) {
    case Boolean:
      l = l ? Cs : null;
      break;
    case Object:
    case Array:
      l = l == null ? l : JSON.stringify(l);
  }
  return l;
}, fromAttribute(l, t) {
  let e = l;
  switch (t) {
    case Boolean:
      e = l !== null;
      break;
    case Number:
      e = l === null ? null : Number(l);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(l);
      } catch {
        e = null;
      }
  }
  return e;
} }, xe = (l, t) => !As(l, t), Te = { attribute: !0, type: String, converter: Dt, reflect: !1, useDefault: !1, hasChanged: xe };
Symbol.metadata ??= Symbol("metadata"), Kt.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let _t = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Te) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), n = this.getPropertyDescriptor(t, s, e);
      n !== void 0 && Ls(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: n, set: o } = Ss(this.prototype, t) ?? { get() {
      return this[e];
    }, set(i) {
      this[e] = i;
    } };
    return { get: n, set(i) {
      const a = n?.call(this);
      o?.call(this, i), this.requestUpdate(t, a, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Te;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Mt("elementProperties"))) return;
    const t = Hs(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Mt("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Mt("properties"))) {
      const e = this.properties, s = [...Es(e), ...zs(e)];
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
      for (const n of s) e.unshift(Pe(n));
    } else t !== void 0 && e.push(Pe(t));
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
    return Ms(t, this.constructor.elementStyles), t;
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
      const o = (s.converter?.toAttribute !== void 0 ? s.converter : Dt).toAttribute(e, s.type);
      this._$Em = t, o == null ? this.removeAttribute(n) : this.setAttribute(n, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, n = s._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const o = s.getPropertyOptions(n), i = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : Dt;
      this._$Em = n;
      const a = i.fromAttribute(e, o.type);
      this[n] = a ?? this._$Ej?.get(n) ?? a, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, n = !1, o) {
    if (t !== void 0) {
      const i = this.constructor;
      if (n === !1 && (o = this[t]), s ??= i.getPropertyOptions(t), !((s.hasChanged ?? xe)(o, e) || s.useDefault && s.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(i._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: n, wrapped: o }, i) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, i ?? e ?? this[t]), o !== !0 || i !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), n === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [n, o] of s) {
        const { wrapped: i } = o, a = this[n];
        i !== !0 || this._$AL.has(n) || a === void 0 || this.C(n, void 0, o, a);
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
_t.elementStyles = [], _t.shadowRootOptions = { mode: "open" }, _t[Mt("elementProperties")] = /* @__PURE__ */ new Map(), _t[Mt("finalized")] = /* @__PURE__ */ new Map(), Ps?.({ ReactiveElement: _t }), (Kt.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ve = globalThis, Oe = (l) => l, Gt = ve.trustedTypes, Ne = Gt ? Gt.createPolicy("lit-html", { createHTML: (l) => l }) : void 0, ds = "$lit$", st = `lit$${Math.random().toFixed(9).slice(2)}$`, ps = "?" + st, Bs = `<${ps}>`, ht = document, St = () => ht.createComment(""), Et = (l) => l === null || typeof l != "object" && typeof l != "function", ke = Array.isArray, Ts = (l) => ke(l) || typeof l?.[Symbol.iterator] == "function", ee = `[ 	
\f\r]`, bt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Re = /-->/g, Ie = />/g, ot = RegExp(`>|${ee}(?:([^\\s"'>=/]+)(${ee}*=${ee}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ve = /'/g, Fe = /"/g, us = /^(?:script|style|textarea|title)$/i, _s = (l) => (t, ...e) => ({ _$litType$: l, strings: t, values: e }), b = _s(1), _ = _s(2), gt = Symbol.for("lit-noChange"), $ = Symbol.for("lit-nothing"), We = /* @__PURE__ */ new WeakMap(), at = ht.createTreeWalker(ht, 129);
function fs(l, t) {
  if (!ke(l) || !l.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ne !== void 0 ? Ne.createHTML(t) : t;
}
const Os = (l, t) => {
  const e = l.length - 1, s = [];
  let n, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", i = bt;
  for (let a = 0; a < e; a++) {
    const r = l[a];
    let c, h, p = -1, g = 0;
    for (; g < r.length && (i.lastIndex = g, h = i.exec(r), h !== null); ) g = i.lastIndex, i === bt ? h[1] === "!--" ? i = Re : h[1] !== void 0 ? i = Ie : h[2] !== void 0 ? (us.test(h[2]) && (n = RegExp("</" + h[2], "g")), i = ot) : h[3] !== void 0 && (i = ot) : i === ot ? h[0] === ">" ? (i = n ?? bt, p = -1) : h[1] === void 0 ? p = -2 : (p = i.lastIndex - h[2].length, c = h[1], i = h[3] === void 0 ? ot : h[3] === '"' ? Fe : Ve) : i === Fe || i === Ve ? i = ot : i === Re || i === Ie ? i = bt : (i = ot, n = void 0);
    const d = i === ot && l[a + 1].startsWith("/>") ? " " : "";
    o += i === bt ? r + Bs : p >= 0 ? (s.push(c), r.slice(0, p) + ds + r.slice(p) + st + d) : r + st + (p === -2 ? a : d);
  }
  return [fs(l, o + (l[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class zt {
  constructor({ strings: t, _$litType$: e }, s) {
    let n;
    this.parts = [];
    let o = 0, i = 0;
    const a = t.length - 1, r = this.parts, [c, h] = Os(t, e);
    if (this.el = zt.createElement(c, s), at.currentNode = this.el.content, e === 2 || e === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (n = at.nextNode()) !== null && r.length < a; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const p of n.getAttributeNames()) if (p.endsWith(ds)) {
          const g = h[i++], d = n.getAttribute(p).split(st), m = /([.?@])?(.*)/.exec(g);
          r.push({ type: 1, index: o, name: m[2], strings: d, ctor: m[1] === "." ? Rs : m[1] === "?" ? Is : m[1] === "@" ? Vs : Jt }), n.removeAttribute(p);
        } else p.startsWith(st) && (r.push({ type: 6, index: o }), n.removeAttribute(p));
        if (us.test(n.tagName)) {
          const p = n.textContent.split(st), g = p.length - 1;
          if (g > 0) {
            n.textContent = Gt ? Gt.emptyScript : "";
            for (let d = 0; d < g; d++) n.append(p[d], St()), at.nextNode(), r.push({ type: 2, index: ++o });
            n.append(p[g], St());
          }
        }
      } else if (n.nodeType === 8) if (n.data === ps) r.push({ type: 2, index: o });
      else {
        let p = -1;
        for (; (p = n.data.indexOf(st, p + 1)) !== -1; ) r.push({ type: 7, index: o }), p += st.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const s = ht.createElement("template");
    return s.innerHTML = t, s;
  }
}
function $t(l, t, e = l, s) {
  if (t === gt) return t;
  let n = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const o = Et(t) ? void 0 : t._$litDirective$;
  return n?.constructor !== o && (n?._$AO?.(!1), o === void 0 ? n = void 0 : (n = new o(l), n._$AT(l, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = n : e._$Cl = n), n !== void 0 && (t = $t(l, n._$AS(l, t.values), n, s)), t;
}
class Ns {
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
    const { el: { content: e }, parts: s } = this._$AD, n = (t?.creationScope ?? ht).importNode(e, !0);
    at.currentNode = n;
    let o = at.nextNode(), i = 0, a = 0, r = s[0];
    for (; r !== void 0; ) {
      if (i === r.index) {
        let c;
        r.type === 2 ? c = new Ht(o, o.nextSibling, this, t) : r.type === 1 ? c = new r.ctor(o, r.name, r.strings, this, t) : r.type === 6 && (c = new Fs(o, this, t)), this._$AV.push(c), r = s[++a];
      }
      i !== r?.index && (o = at.nextNode(), i++);
    }
    return at.currentNode = ht, n;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class Ht {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, n) {
    this.type = 2, this._$AH = $, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = n, this._$Cv = n?.isConnected ?? !0;
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
    t = $t(this, t, e), Et(t) ? t === $ || t == null || t === "" ? (this._$AH !== $ && this._$AR(), this._$AH = $) : t !== this._$AH && t !== gt && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ts(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== $ && Et(this._$AH) ? this._$AA.nextSibling.data = t : this.T(ht.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, n = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = zt.createElement(fs(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === n) this._$AH.p(e);
    else {
      const o = new Ns(n, this), i = o.u(this.options);
      o.p(e), this.T(i), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = We.get(t.strings);
    return e === void 0 && We.set(t.strings, e = new zt(t)), e;
  }
  k(t) {
    ke(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, n = 0;
    for (const o of t) n === e.length ? e.push(s = new Ht(this.O(St()), this.O(St()), this, this.options)) : s = e[n], s._$AI(o), n++;
    n < e.length && (this._$AR(s && s._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = Oe(t).nextSibling;
      Oe(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class Jt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, n, o) {
    this.type = 1, this._$AH = $, this._$AN = void 0, this.element = t, this.name = e, this._$AM = n, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = $;
  }
  _$AI(t, e = this, s, n) {
    const o = this.strings;
    let i = !1;
    if (o === void 0) t = $t(this, t, e, 0), i = !Et(t) || t !== this._$AH && t !== gt, i && (this._$AH = t);
    else {
      const a = t;
      let r, c;
      for (t = o[0], r = 0; r < o.length - 1; r++) c = $t(this, a[s + r], e, r), c === gt && (c = this._$AH[r]), i ||= !Et(c) || c !== this._$AH[r], c === $ ? t = $ : t !== $ && (t += (c ?? "") + o[r + 1]), this._$AH[r] = c;
    }
    i && !n && this.j(t);
  }
  j(t) {
    t === $ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Rs extends Jt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === $ ? void 0 : t;
  }
}
class Is extends Jt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== $);
  }
}
class Vs extends Jt {
  constructor(t, e, s, n, o) {
    super(t, e, s, n, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = $t(this, t, e, 0) ?? $) === gt) return;
    const s = this._$AH, n = t === $ && s !== $ || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, o = t !== $ && (s === $ || n);
    n && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Fs {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    $t(this, t);
  }
}
const Ws = ve.litHtmlPolyfillSupport;
Ws?.(zt, Ht), (ve.litHtmlVersions ??= []).push("3.3.3");
const Us = (l, t, e) => {
  const s = e?.renderBefore ?? t;
  let n = s._$litPart$;
  if (n === void 0) {
    const o = e?.renderBefore ?? null;
    s._$litPart$ = n = new Ht(t.insertBefore(St(), o), o, void 0, e ?? {});
  }
  return n._$AI(l), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Me = globalThis;
class lt extends _t {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Us(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return gt;
  }
}
lt._$litElement$ = !0, lt.finalized = !0, Me.litElementHydrateSupport?.({ LitElement: lt });
const js = Me.litElementPolyfillSupport;
js?.({ LitElement: lt });
(Me.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ds = { attribute: !0, type: String, converter: Dt, reflect: !1, hasChanged: xe }, Gs = (l = Ds, t, e) => {
  const { kind: s, metadata: n } = e;
  let o = globalThis.litPropertyMetadata.get(n);
  if (o === void 0 && globalThis.litPropertyMetadata.set(n, o = /* @__PURE__ */ new Map()), s === "setter" && ((l = Object.create(l)).wrapped = !0), o.set(e.name, l), s === "accessor") {
    const { name: i } = e;
    return { set(a) {
      const r = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(i, r, l, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(i, void 0, l, a), a;
    } };
  }
  if (s === "setter") {
    const { name: i } = e;
    return function(a) {
      const r = this[i];
      t.call(this, a), this.requestUpdate(i, r, l, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function mt(l) {
  return (t, e) => typeof e == "object" ? Gs(l, t, e) : ((s, n, o) => {
    const i = n.hasOwnProperty(o);
    return n.constructor.createProperty(o, s), i ? Object.getOwnPropertyDescriptor(n, o) : void 0;
  })(l, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function O(l) {
  return mt({ ...l, state: !0, attribute: !1 });
}
const Ys = { W: 1, kW: 1e3, MW: 1e6, mW: 1e-3 }, Xs = { Wh: 1e-3, kWh: 1, MWh: 1e3 };
function E(l) {
  if (!l) return null;
  const t = parseFloat(l.state);
  return Number.isFinite(t) ? t : null;
}
function Z(l) {
  const t = E(l);
  if (t === null) return null;
  const e = l.attributes.unit_of_measurement ?? "W";
  return t * (Ys[e] ?? 1);
}
function Pt(l) {
  const t = E(l);
  if (t === null) return null;
  const e = l.attributes.unit_of_measurement ?? "kWh";
  return t * (Xs[e] ?? 1);
}
function C(l, t = "de") {
  return l === null ? "–" : Math.abs(l) < 1e3 ? `${Math.round(l).toLocaleString(t)} W` : `${(l / 1e3).toLocaleString(t, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kW`;
}
function F(l, t = "de") {
  return l === null ? "–" : `${l.toLocaleString(t, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kWh`;
}
function At(l, t = "de") {
  return l === null ? "–" : `${Math.round(l).toLocaleString(t)} %`;
}
function Zs(l, t) {
  return +(6 - 5 * Math.min(Math.abs(l) / Math.max(t, 1), 1)).toFixed(2);
}
function qs(l, t) {
  return l === null ? 1 : +(1 + 3 * Math.min(Math.abs(l) / Math.max(t, 1), 1)).toFixed(2);
}
function Lt(l, t = 9) {
  return l.length > t ? l.slice(0, t - 1) + "…" : l;
}
function he(l) {
  const t = E(l);
  if (t === null) return null;
  const e = String(l.attributes.unit_of_measurement ?? "").toLowerCase();
  return e.includes("ct") || e.includes("cent") ? t : t * 100;
}
function Ae(l, t = "de") {
  return l === null ? "" : `${l.toLocaleString(t, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ct/kWh`;
}
const Ks = ["W", "kW", "MW", "mW"];
function Ue(l) {
  if (!l) return "Sensor nicht gefunden";
  const t = l.attributes.unit_of_measurement;
  return t && !Ks.includes(t) ? `Einheit „${t}“ ist keine Leistung (W/kW)` : null;
}
function je(l, t) {
  if (l === null) return "kein Wert";
  const e = t ? -l : l;
  return Math.abs(e) < 5 ? "ruht" : e > 0 ? "lädt" : "entlädt";
}
function De(l, t) {
  if (l === null) return "kein Wert";
  const e = t ? -l : l;
  return Math.abs(e) < 5 ? "ausgeglichen" : e > 0 ? "Bezug" : "Einspeisung";
}
const Js = 44, Qs = 290;
function tn(l) {
  if (l <= 0) return [];
  const t = [[230], [195, 275], [160, 228, 296], [140, 192, 244, 296], [136, 184, 232, 280, 328]][Math.min(l, 5) - 1], e = l <= 3 ? 54 : l === 4 ? 46 : 44;
  return t.map((s, n) => {
    const o = t.length - 1 - n;
    return { cx: s, top: Qs + (o % 2 === 1 ? Js : 0), w: e };
  });
}
function de(l, t = 15, e = 19) {
  const s = l.trim();
  if (s.length <= t) return { lines: [s], small: !1 };
  const n = (r) => r.length > e ? r.slice(0, e - 1) + "…" : r, o = [...s.matchAll(/ /g)].map((r) => r.index), i = o.filter((r) => r <= e && s.length - r - 1 <= e), a = i.length ? i : o.filter((r) => r <= e);
  if (a.length) {
    const r = s.length / 2, c = a.reduce((h, p) => Math.abs(p - r) < Math.abs(h - r) ? p : h);
    return { lines: [s.slice(0, c), n(s.slice(c + 1))], small: !0 };
  }
  return { lines: [s.slice(0, e), n(s.slice(e))], small: !0 };
}
const en = 4 / 3;
function sn(l, t) {
  const e = Math.min(Math.abs(l) / Math.max(t, 1), 1);
  return +((1.6 + 3.4 * Math.sqrt(e)) * en).toFixed(2);
}
function pe(l) {
  const t = l.trim().split(/[\s,]+/);
  let e = 0, s = 0, n = 0;
  const o = (i) => {
    const a = (h) => {
      let p = i.map((g) => [...g]);
      for (; p.length > 1; ) p = p.slice(1).map((g, d) => [p[d][0] + (g[0] - p[d][0]) * h, p[d][1] + (g[1] - p[d][1]) * h]);
      return p[0];
    };
    let [r, c] = i[0];
    for (let h = 1; h <= 24; h++) {
      const [p, g] = a(h / 24);
      n += Math.hypot(p - r, g - c), [r, c] = [p, g];
    }
  };
  for (let i = 0; i < t.length; i++) {
    const a = t[i];
    if (a === "M")
      e = +t[++i], s = +t[++i];
    else if (a === "H") {
      const r = +t[++i];
      n += Math.abs(r - e), e = r;
    } else if (a === "V") {
      const r = +t[++i];
      n += Math.abs(r - s), s = r;
    } else if (a === "L") {
      const r = +t[++i], c = +t[++i];
      n += Math.hypot(r - e, c - s), [e, s] = [r, c];
    } else if (a === "Q" || a === "C") {
      const r = a === "Q" ? 2 : 3, c = [[e, s]];
      for (let h = 0; h < r; h++) c.push([+t[++i], +t[++i]]);
      o(c), [e, s] = c[r];
    }
  }
  return n;
}
function Bt(l, t = 10) {
  const e = Math.floor(Math.abs(l) + 1e-9), s = Math.floor(e / 1e3), n = Math.floor(e % 1e3 / 100), o = Math.floor(e % 100 / 10);
  return [
    ...Array(Math.min(s, t)).fill("big"),
    ...Array(n).fill("medium"),
    ...Array(o).fill("small")
  ];
}
function nn(l, t, e) {
  const s = [l, t, e].map((o) => Math.max(0, o ?? 0)), n = s.reduce((o, i) => o + i, 0);
  return n > 0 ? s.map((o) => o / n) : [1, 0, 0];
}
function on(l, t) {
  const e = (n) => {
    const o = t.map((c) => c * n), i = o.map(Math.floor), a = o.map((c, h) => [c - Math.floor(c), h]).sort((c, h) => h[0] - c[0] || c[1] - h[1]), r = n - i.reduce((c, h) => c + h, 0);
    for (let c = 0; c < r; c++) i[a[c][1]]++;
    return i.flatMap((c, h) => Array(c).fill(h));
  }, s = new Map(["big", "medium", "small"].map((n) => [n, e(l.filter((o) => o === n).length)]));
  return l.map((n) => s.get(n).shift());
}
var rn = Object.defineProperty, U = (l, t, e, s) => {
  for (var n = void 0, o = l.length - 1, i; o >= 0; o--)
    (i = l[o]) && (n = i(t, e, n) || n);
  return n && rn(t, e, n), n;
};
const Ge = [
  ["solar_today", "PV-Ertrag heute"],
  ["solar_forecast_remaining", "PV-Prognose Rest heute"],
  ["grid_price", "Strompreis Bezug"],
  ["grid_import_today", "Bezug heute"],
  ["grid_export_today", "Einspeisung heute"],
  ["home_power", "Hausverbrauch gemessen"],
  ["wallbox_power", "Wallbox"],
  ["wallbox_soc", "Ladestand Auto"]
], Tt = 5, Ye = 2, R = { entity: { domain: "sensor" } }, Yt = { entity: { domain: "sensor", multiple: !0, reorder: !0 } }, an = [
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
], ln = [
  { name: "solar_strings", selector: Yt },
  { name: "solar_today", selector: R },
  { name: "solar_forecast_remaining", selector: R }
], gs = (l) => ({
  name: l,
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
function cn(l, t = !0) {
  const e = l.mode === "split" ? [
    { name: "charge_power", selector: R },
    { name: "discharge_power", selector: R }
  ] : [
    { name: "power", selector: R },
    { name: "invert", selector: { boolean: {} } }
  ];
  return [
    { name: "name", selector: { text: {} } },
    gs("mode"),
    ...e,
    { name: "soc", selector: R },
    { name: "capacity_kwh", selector: { number: { min: 0, max: 200, step: 0.1, mode: "box", unit_of_measurement: "kWh" } } },
    ...t ? [{ name: "backup_loads", selector: Yt }] : [],
    ...t && l.mode === "split" ? [{ name: "backup_only", selector: { boolean: {} } }] : []
  ];
}
function hn(l) {
  const t = l.grid_mode === "split" ? [
    { name: "grid_import_power", selector: R },
    { name: "grid_export_power", selector: R }
  ] : [
    { name: "grid_power", selector: R },
    { name: "grid_invert", selector: { boolean: {} } }
  ];
  return [gs("grid_mode"), ...t, ...pn];
}
const dn = [
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
], pn = [
  { name: "grid_price", selector: R },
  {
    name: "grid_export_price_fixed",
    selector: { number: { min: 0, max: 100, step: 0.01, mode: "box", unit_of_measurement: "ct/kWh" } }
  },
  { name: "grid_export_price", selector: R },
  { name: "grid_import_today", selector: R },
  { name: "grid_export_today", selector: R }
], un = [
  { name: "fixed_loads", selector: Yt },
  { name: "flexible_loads", selector: Yt },
  { name: "home_power", selector: R }
], _n = [
  { name: "wallbox_name", selector: { text: {} } },
  { name: "wallbox_power", selector: R },
  { name: "wallbox_flexible", selector: { boolean: {} } },
  { name: "wallbox_soc", selector: R }
], fn = {
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
}, gn = {
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
async function $s() {
  if (customElements.get("ha-form") && customElements.get("ha-entity-picker")) return;
  const l = await window.loadCardHelpers();
  for (const t of ["tile", "entities"])
    await (await l.createCardElement({ type: t, entity: "sun.sun", entities: [] })).constructor.getConfigElement?.();
}
const se = (l) => JSON.parse(JSON.stringify(l ?? {}));
function $n(l) {
  const t = l;
  return t === 3 || typeof t == "object" && t?.code === 3 ? "Verbindung zu Home Assistant unterbrochen – bitte erneut speichern." : typeof t == "object" && t && typeof t.message == "string" ? t.message : typeof l == "string" ? l : "Speichern fehlgeschlagen – bitte erneut versuchen.";
}
const ue = "energiefluss-updated", Le = class Le extends lt {
  constructor() {
    super(...arguments), this.compact = !1, this._ready = !1, this._title = "", this._draft = {}, this._saved = "", this._saving = !1, this._computed = [], this._detecting = !1;
  }
  async firstUpdated() {
    await $s(), this._ready = !0;
  }
  updated(t) {
    (t.has("entryId") || t.has("hass")) && this.hass && this.entryId && this._loadedFor !== this.entryId && (this._loadedFor = this.entryId, this._load());
  }
  async _load() {
    const t = await this.hass.callWS({
      type: "energiefluss/get_options",
      entry_id: this.entryId
    });
    this._computed = t.computed ?? [], this._title = t.title, this._draft = se(t.options), this._saved = this._snapshot(), this._message = void 0;
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
    for (const o of e) {
      if (o === "title") continue;
      const i = s[o];
      i === void 0 || i === "" || Array.isArray(i) && i.length === 0 ? delete n[o] : n[o] = i;
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
    this._hasBattery(t) || (this._draft.batteries ?? []).length >= Tt || (this._draft = { ...this._draft, batteries: [...this._draft.batteries ?? [], { ...t }] });
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
    for (const [s] of Ge) {
      const n = t[s];
      n && !this._draft[s] && this._apply({ [s]: n.value });
    }
    for (const s of t.batteries ?? []) s.duplicate || this._applyBattery(s.value);
  }
  _addBattery() {
    const t = [...this._draft.batteries ?? []];
    t.length >= Tt || (t.push({ mode: "combined" }), this._draft = { ...this._draft, batteries: t });
  }
  _removeBattery(t) {
    const e = [...this._draft.batteries ?? []];
    e.splice(t, 1), this._draft = { ...this._draft, batteries: e };
  }
  /** Drop values that belong to the mode not selected (kept while editing). */
  _cleaned() {
    const t = se(this._draft);
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
        this._title = t.title, this._draft = se(t.options), this._saved = this._snapshot(), await new Promise((s) => setTimeout(s, 1200)), window.dispatchEvent(new CustomEvent(ue, { detail: { entry_id: this.entryId } }));
        const e = await this.hass.callWS({
          type: "energiefluss/get_options",
          entry_id: this.entryId
        });
        this._computed = e.computed ?? [], this._message = { kind: "ok", text: "Anlage gespeichert." };
      } catch (t) {
        this._message = { kind: "error", text: $n(t) };
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
    if (!e) return $;
    const n = this._s(e), o = Ue(n);
    return b`<div class="row">
        <span>${t}</span>
        <span>${C(Z(n), this._loc)}${s ? b` → <b>${s}</b>` : $}</span>
      </div>
      ${o ? b`<div class="warn">⚠ ${o}</div>` : $}`;
  }
  _solarLive() {
    const t = this._draft.solar_strings ?? [];
    if (!t.length)
      return b`<div class="live">
        ${this._calcNote(
        this._computed.includes("solar") ? "PV-Leistung wird aus der Energiebilanz berechnet." : "Ohne PV-Sensor: wird berechnet, wenn Netz und Hausverbrauch gemessen werden."
      )}
      </div>`;
    const e = t.reduce((s, n) => s + (Z(this._s(n)) ?? 0), 0);
    return b`<div class="live">
      ${t.map((s) => this._powerLine(this._name(s), s))}
      <div class="row total"><span>Summe</span><span>${C(e, this._loc)}</span></div>
      ${this._draft.solar_today ? $ : this._calcNote("PV-Ertrag heute zählt die Integration selbst.")}
    </div>`;
  }
  _calcNote(t) {
    return b`<div class="calc">≈ ${t}</div>`;
  }
  _batteryLive(t, e) {
    const s = t.mode === "split", n = s ? !!(t.charge_power || t.discharge_power) : !!t.power, o = E(this._s(t.soc));
    let i = $;
    if (s && n) {
      const r = Z(this._s(t.charge_power)), c = Z(this._s(t.discharge_power)), h = r === null && c === null ? null : Math.abs(r ?? 0) - Math.abs(c ?? 0);
      i = b`${this._powerLine("Laden", t.charge_power)}${this._powerLine("Entladen", t.discharge_power)}
        <div class="row total"><span>Ergebnis</span>
          <span>${C(h === null ? null : Math.abs(h), this._loc)} → <b>${je(h, !1)}</b></span>
        </div>`;
    } else n && (i = this._powerLine("Leistung", t.power, je(Z(this._s(t.power)), !!t.invert)));
    const a = this._computed.includes(`battery_${e + 1}`);
    return !n && !t.soc && !(t.backup_loads ?? []).length ? $ : b`<div class="live">
      ${i}
      ${n ? $ : this._calcNote(
      a ? "Leistung wird aus der Energiebilanz berechnet." : "Ohne Leistungssensor: wird nur berechnet, wenn der Hausverbrauch gemessen wird und dies die einzige Batterie ohne Sensor ist."
    )}
      ${t.soc ? b`<div class="row"><span>Ladestand</span><span>${o === null ? "–" : `${Math.round(o)} %`}</span></div>` : $}
      ${(t.backup_loads ?? []).length ? b`<div class="row">
            <span>Notstrom-Abgang: ${t.backup_loads.length} Geräte</span>
            <span>${C(t.backup_loads.reduce((r, c) => r + (Z(this._s(c)) ?? 0), 0), this._loc)}</span>
          </div>` : $}
    </div>`;
  }
  _gridLive() {
    const t = this._draft, e = t.grid_mode === "split", s = e ? !!(t.grid_import_power || t.grid_export_power) : !!t.grid_power;
    let n = $;
    if (e && s) {
      const a = Z(this._s(t.grid_import_power)), r = Z(this._s(t.grid_export_power)), c = a === null && r === null ? null : Math.abs(a ?? 0) - Math.abs(r ?? 0);
      n = b`${this._powerLine("Bezug", t.grid_import_power)}${this._powerLine("Einspeisung", t.grid_export_power)}
        <div class="row total"><span>Ergebnis</span>
          <span>${C(c === null ? null : Math.abs(c), this._loc)} → <b>${De(c, !1)}</b></span>
        </div>`;
    } else s && (n = this._powerLine("Netz", t.grid_power, De(Z(this._s(t.grid_power)), !!t.grid_invert)));
    let o = $;
    s || (o = this._calcNote(
      t.home_power ? "Netzleistung wird aus der Energiebilanz berechnet (gemessener Hausverbrauch)." : "Ohne Netzsensor fehlt ein Wert der Bilanz – bitte Netzsensor wählen oder Hausverbrauch messen."
    ));
    const i = !t.grid_import_today || !t.grid_export_today ? this._calcNote("Fehlende Tageswerte für Bezug/Einspeisung zählt die Integration selbst.") : $;
    return b`<div class="live">
      ${n}${o}
      ${t.grid_price ? b`<div class="row">
            <span>Preis Bezug</span><span>${Ae(he(this._s(t.grid_price)), this._loc) || "–"}</span>
          </div>` : $}
      ${i}
    </div>`;
  }
  _wallboxLive() {
    const t = this._draft;
    if (!t.wallbox_power) return $;
    const e = E(this._s(t.wallbox_soc));
    return b`<div class="live">
      ${this._powerLine("Wallbox", t.wallbox_power, t.wallbox_flexible ?? !0 ? "Zusatzverbraucher" : "Grundlast")}
      ${t.wallbox_soc ? b`<div class="row"><span>Auto</span><span>${e === null ? "–" : `${Math.round(e)} %`}</span></div>` : $}
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
    const t = this._linkableLoads(), e = Object.entries(this._draft.load_parents ?? {}), s = (i, a, r) => {
      const c = [...e];
      c[i] = [a, r], this._setParents(c);
    }, n = () => {
      const i = new Set(e.flatMap(([c, h]) => [c, h])), a = t.find((c) => !i.has(c)) ?? t[0], r = t.find((c) => c !== a && !e.some(([h]) => h === c)) ?? "";
      a && r && this._setParents([...e, [a, r]]);
    }, o = (i, a) => b`<option value=${i} ?selected=${i === a}>${this._name(i)}</option>`;
    return b`<div class="pairs">
      <h3>Enthaltene Verbraucher</h3>
      <p class="hint">
        Ist ein Gerät schon im Wert eines anderen enthalten (z. B. Wasserkocher im Unterzähler „Neubau“), wird es
        nur einmal gezählt und auf der Karte eingerückt darunter angezeigt.
      </p>
      ${e.map(
      ([i, a], r) => b`<div class="pair">
          <select @change=${(c) => s(r, c.target.value, a)}>
            ${t.map((c) => o(c, i))}
          </select>
          <span>ist enthalten in</span>
          <select @change=${(c) => s(r, i, c.target.value)}>
            ${t.filter((c) => c !== i).map((c) => o(c, a))}
          </select>
          <button class="link" @click=${() => this._setParents(e.filter((c, h) => h !== r))}>Entfernen</button>
        </div>
        ${i === a || e.some(([c]) => c === a) ? b`<div class="warn">⚠ Ungültig: ein Gerät kann nicht in sich selbst oder in einem enthaltenen Gerät stecken.</div>` : $}`
    )}
      <button class="add" ?disabled=${t.length < 2} @click=${n}>+ Enthaltenen Verbraucher hinzufügen</button>
    </div>`;
  }
  _loadsLive() {
    const t = [
      ["Grundlast", this._draft.fixed_loads ?? []],
      ["Zusatzverbraucher", this._draft.flexible_loads ?? []]
    ];
    if (!t.some(([, n]) => n.length)) return $;
    const e = [
      ...t.flatMap(([, n]) => n),
      ...(this._draft.batteries ?? []).flatMap((n) => n.backup_loads ?? []),
      ...this._draft.wallbox_power ? [this._draft.wallbox_power] : []
    ], s = [...new Set(e.filter((n, o) => e.indexOf(n) !== o))];
    return b`<div class="live">
      ${t.map(([n, o]) => {
      const i = this._draft.load_parents ?? {}, a = o.filter((c) => !(c in i)).reduce((c, h) => c + (Z(this._s(h)) ?? 0), 0), r = o.map((c) => [c, Ue(this._s(c))]).filter(([, c]) => c);
      return b`<div class="row"><span>${n}: ${o.length} Geräte</span><span>${C(a, this._loc)}</span></div>
          ${r.map(([c, h]) => b`<div class="warn">⚠ ${this._name(c)}: ${h}</div>`)}`;
    })}
      ${s.length ? b`<div class="warn">⚠ In mehreren Gruppen: ${s.map((n) => this._name(n)).join(", ")}</div>` : $}
    </div>`;
  }
  _suggestRow(t, e, s, n, o, i = "Übernehmen") {
    return b`<div class="sg-row">
      <div class="sg-text"><b>${t}</b><span>${e}</span><small>${s}</small></div>
      ${n ? b`<span class="sg-done">✓ gesetzt</span>` : b`<button @click=${o}>${i}</button>`}
    </div>`;
  }
  _suggestionsPanel() {
    const t = this._suggestions;
    if (!t) return $;
    const e = this._draft, s = (a) => a.map((r) => this._name(r)).join(", "), n = [];
    if (t.solar_strings) {
      const a = t.solar_strings.value, r = JSON.stringify(e.solar_strings ?? []) === JSON.stringify(a);
      n.push(this._suggestRow("PV-Leistung", s(a), t.solar_strings.source, r, () => this._apply({ solar_strings: a })));
    }
    if (t.grid) {
      const a = t.grid.value, r = [a.grid_power, a.grid_import_power, a.grid_export_power].filter((p) => !!p), c = r.every((p) => [e.grid_power, e.grid_import_power, e.grid_export_power].includes(p)), h = a.grid_mode === "split" ? `Bezug: ${this._name(a.grid_import_power)} · Einspeisung: ${this._name(a.grid_export_power)}` : s(r);
      n.push(this._suggestRow("Netz", h, t.grid.source, c, () => this._apply(a)));
    }
    for (const [a, r] of Ge) {
      const c = t[a];
      c && n.push(
        this._suggestRow(
          r,
          this._name(c.value),
          c.source,
          e[a] === c.value,
          () => this._apply({ [a]: c.value })
        )
      );
    }
    for (const a of t.batteries ?? []) {
      const r = a.value, c = r.mode === "split" ? "Laden + Entladen" : "Leistung";
      n.push(
        this._suggestRow(
          "Batterie",
          `${r.name ?? ""} (${c}${r.soc ? " + Ladestand" : ""})`,
          a.source,
          this._hasBattery(r),
          () => this._applyBattery(r),
          "Hinzufügen"
        )
      );
    }
    const o = /* @__PURE__ */ new Set([
      ...e.fixed_loads ?? [],
      ...e.flexible_loads ?? [],
      ...e.wallbox_power ? [e.wallbox_power] : [],
      ...(e.batteries ?? []).flatMap((a) => a.backup_loads ?? [])
    ]), i = (t.loads ?? []).filter((a) => !o.has(a.entity));
    return b`<div class="suggest">
      <div class="sg-head">
        <h2>Vorschläge</h2>
        <div>
          <button class="primary" @click=${this._applyAllEmpty}>Alle leeren Felder füllen</button>
          <button @click=${() => this._suggestions = void 0}>Schließen</button>
        </div>
      </div>
      <p class="hint">Erkannt an Integration, Gerät, Einheit und Namen. Übernommenes landet im Entwurf – erst „Anlage speichern“ übernimmt es.</p>
      ${n.length ? n : b`<p class="hint">Keine passenden Sensoren gefunden.</p>`}
      ${i.length ? b`<h3>Mögliche Verbraucher</h3>
            ${i.map(
      (a) => b`<div class="sg-row">
                <div class="sg-text"><span>${a.name}</span><small>${a.source}</small></div>
                <div class="sg-btns">
                  <button @click=${() => this._applyLoad(a.entity, "fixed_loads")}>Grundlast</button>
                  <button @click=${() => this._applyLoad(a.entity, "flexible_loads")}>Zusatzverbraucher</button>
                </div>
              </div>`
    )}` : $}
    </div>`;
  }
  // -- render ---------------------------------------------------------------------------
  _form(t, e, s, n = {}, o = {}) {
    return b`<ha-form
      .hass=${this.hass}
      .data=${e}
      .schema=${t}
      .computeLabel=${(i) => n[i.name] ?? fn[i.name] ?? i.name}
      .computeHelper=${(i) => o[i.name] ?? gn[i.name]}
      @value-changed=${s}
    ></ha-form>`;
  }
  _section(t, e, s) {
    const n = b`<div class="section">
      <h2>${t}</h2>
      ${s ? b`<p class="hint">${s}</p>` : $}
      ${e}
    </div>`;
    return this.compact ? b`<div class="plain">${n}</div>` : b`<ha-card>${n}</ha-card>`;
  }
  render() {
    if (!this._ready || !this._loadedFor) return b`<div class="hint">Lade …</div>`;
    const t = this._draft, e = t.batteries ?? [], s = this._saving, n = this._message ? b`<span class="msg ${this._message.kind}">${this._message.text}</span>` : b`<span class="msg">${this.dirty ? "Ungespeicherte Änderungen an der Anlage" : ""}</span>`;
    return b`
      <div class="actions">
        ${n}
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
        an,
        { title: this._title, energy_period: t.energy_period ?? "midnight" },
        (o) => this._onForm(o, ["title", "energy_period"])
      )
    )}
      ${this._section(
      "Solar",
      b`${this._form(
        ln,
        t,
        (o) => this._onForm(o, ["solar_strings", "solar_today", "solar_forecast_remaining"])
      )}${this._solarLive()}`
    )}
      ${this._section(
      "Batterien",
      b`${e.map((o, i) => {
        const a = { mode: "combined", ...o };
        return b`<div class="sub">
            <div class="subhead">
              <h3>Batterie ${i + 1}${o.name ? ` – ${o.name}` : ""}</h3>
              <button class="link" @click=${() => this._removeBattery(i)}>Entfernen</button>
            </div>
            ${this._form(
          cn(
            o,
            !!(o.backup_loads ?? []).length || e.filter((r) => (r.backup_loads ?? []).length).length < Ye
          ),
          a,
          (r) => this._onBattery(i, r),
          { backup_loads: "Notstrom-Abgang: Verbraucher an dieser Batterie" },
          {
            backup_loads: "Geräte am eigenen Ausgang der Batterie (z. B. Zendure, Ecoflow). Zählen zum Notstrom.",
            backup_only: "Für Geräte wie EcoFlow, die nicht ins Haus einspeisen können: Ladeleistung = Eingang aus dem Haus (auch was nur durchgeleitet wird), Entladeleistung = Ausgang an die Notstrom-Geräte."
          }
        )}
            ${this._batteryLive(o, i)}
          </div>`;
      })}
        ${e.length < Tt ? b`<button class="add" @click=${this._addBattery}>+ Batterie hinzufügen</button>` : $}`,
      `Ein Sensor mit + und − (positiv = lädt, sonst Schalter setzen) oder zwei getrennte Sensoren für Laden und Entladen. Bis zu ${Tt} Batterien, davon höchstens ${Ye} mit Notstrom-Abgang.`
    )}
      ${this._section(
      "Netz",
      b`${this._form(
        hn(t),
        { grid_mode: "combined", ...t },
        (o) => this._onForm(o, dn)
      )}${this._gridLive()}`,
      "Ein Sensor mit + und − (positiv = Bezug) oder getrennt, z. B. Tibber Pulse: „Leistung“ und „Leistung Produktion“."
    )}
      ${this._section(
      "Wallbox / E-Auto",
      b`${this._form(
        _n,
        { wallbox_flexible: !0, ...t },
        (o) => this._onForm(o, ["wallbox_name", "wallbox_power", "wallbox_soc", "wallbox_flexible"])
      )}${this._wallboxLive()}`,
      "Optional. Hängt am Wechselrichter und zählt zum Hausverbrauch; standardmäßig als Zusatzverbraucher."
    )}
      ${this._section(
      "Verbraucher",
      b`${this._form(
        un,
        t,
        (o) => this._onForm(o, ["fixed_loads", "flexible_loads", "home_power"])
      )}${this._loadsLive()}${this._parentsEditor()}`,
      "Alle Verbraucher zählen zum Haus. Notstrom-Geräte trägst du direkt bei der jeweiligen Batterie ein."
    )}
    `;
  }
};
Le.styles = qt`
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
let I = Le;
U([
  mt({ attribute: !1 })
], I.prototype, "hass");
U([
  mt({ attribute: !1 })
], I.prototype, "entryId");
U([
  mt({ type: Boolean })
], I.prototype, "compact");
U([
  O()
], I.prototype, "_ready");
U([
  O()
], I.prototype, "_loadedFor");
U([
  O()
], I.prototype, "_title");
U([
  O()
], I.prototype, "_draft");
U([
  O()
], I.prototype, "_saved");
U([
  O()
], I.prototype, "_saving");
U([
  O()
], I.prototype, "_message");
U([
  O()
], I.prototype, "_computed");
U([
  O()
], I.prototype, "_suggestions");
U([
  O()
], I.prototype, "_detecting");
customElements.get("energiefluss-editor") || customElements.define("energiefluss-editor", I);
var mn = Object.defineProperty, Qt = (l, t, e, s) => {
  for (var n = void 0, o = l.length - 1, i; o >= 0; o--)
    (i = l[o]) && (n = i(t, e, n) || n);
  return n && mn(t, e, n), n;
};
const yn = {
  entry_id: "Anlage",
  title: "Titel der Karte (optional)",
  flow_style: "Animation",
  max_power: "Leistung für größte bzw. schnellste Punkte"
}, wn = {
  max_power: "Ab dieser Leistung sind die Punkte am größten bzw. schnellsten. Standard 5000 W."
}, Se = class Se extends lt {
  constructor() {
    super(...arguments), this._instances = [], this._ready = !1;
  }
  setConfig(t) {
    this._config = t;
  }
  async firstUpdated() {
    await $s(), this.hass && (this._instances = await this.hass.callWS({ type: "energiefluss/instances" })), this._ready = !0;
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
    return !this._ready || !this._config ? b`<div class="hint">Lade …</div>` : this._instances.length ? b`
      <h2>Karte</h2>
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._schema()}
        .computeLabel=${(t) => yn[t.name] ?? t.name}
        .computeHelper=${(t) => wn[t.name]}
        @value-changed=${this._cardChanged}
      ></ha-form>
      <h2 class="spaced">Anlage</h2>
      <p class="hint">
        Gilt für alle Karten dieser Anlage. Änderungen hier mit <b>„Anlage speichern“</b> übernehmen – das
        Speichern unten im Dialog speichert nur die Karten-Einstellungen oben.
      </p>
      ${this._entryId ? b`<energiefluss-editor compact .hass=${this.hass} .entryId=${this._entryId}></energiefluss-editor>` : $}
    ` : b`<div class="hint">
        Noch keine Anlage angelegt: Einstellungen → Geräte &amp; Dienste → Integration hinzufügen → „Wattrio“.
      </div>`;
  }
};
Se.styles = qt`
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
let dt = Se;
Qt([
  mt({ attribute: !1 })
], dt.prototype, "hass");
Qt([
  O()
], dt.prototype, "_config");
Qt([
  O()
], dt.prototype, "_instances");
Qt([
  O()
], dt.prototype, "_ready");
customElements.get("energiefluss-card-editor") || customElements.define("energiefluss-card-editor", dt);
var bn = Object.defineProperty, Ct = (l, t, e, s) => {
  for (var n = void 0, o = l.length - 1, i; o >= 0; o--)
    (i = l[o]) && (n = i(t, e, n) || n);
  return n && bn(t, e, n), n;
};
const xn = (l) => l.reduce((t, e) => t + 1 + (e.children?.length ?? 0), 0), vn = {
  solar: "#ff9800",
  battery: "#ff69b4",
  grid: "#5490c2",
  home: "#5fb6ad",
  flexible: "#9575cd",
  backup: "#ef5350",
  inverter: "#959595"
}, kn = 554, Mn = 148, Xe = 400, Ze = 240, jt = 22, N = 396, rt = N - 20, nt = 504, Q = 40, K = 550, et = 42, An = 22, qe = 358, Ln = 37, Ke = 364, Je = 370, B = 5, Qe = 40, Sn = 14, En = 0.8, zn = "M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z", Hn = "M8.28,5.45L6.5,4.55L7.76,2H16.24L17.5,4.55L15.72,5.45L15,4H9L8.28,5.45M18.62,8H14.09L13.3,5H10.7L9.91,8H5.38L4.1,10.55L5.89,11.44L6.62,10H17.38L18.1,11.44L19.89,10.55L18.62,8M17.77,22H15.7L15.46,21.1L12,15.9L8.53,21.1L8.3,22H6.23L9.12,11H11.19L10.83,12.35L12,14.1L13.16,12.35L12.81,11H14.88L17.77,22M11.4,15L10.5,13.65L9.32,18.13L11.4,15M14.68,18.12L13.5,13.64L12.6,15L14.68,18.12Z", Cn = "M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z", Pn = "M4,2H20A2,2 0 0,1 22,4V14A2,2 0 0,1 20,16H15V20H18V22H13V16H11V22H6V20H9V16H4A2,2 0 0,1 2,14V4A2,2 0 0,1 4,2M4,4V8H11V4H4M4,14H11V10H4V14M20,14V10H13V14H20M20,4H13V8H20V4Z", Ee = class Ee extends lt {
  constructor() {
    super(...arguments), this._expanded = /* @__PURE__ */ new Set(), this._loading = !1, this._onUpdated = (t) => {
      const e = t.detail?.entry_id;
      (!e || !this._layout || e === this._layout.entry_id) && (this._layout = void 0, this._loadLayout());
    }, this._onTap = (t) => {
      const s = t.composedPath().find((n) => n instanceof Element && n.hasAttribute("data-entity"))?.getAttribute("data-entity");
      s && this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: s }, bubbles: !0, composed: !0 }));
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
    super.connectedCallback(), window.addEventListener(ue, this._onUpdated);
  }
  disconnectedCallback() {
    window.removeEventListener(ue, this._onUpdated), super.disconnectedCallback();
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
    return Z(this._s(t));
  }
  _own(t) {
    return E(this._s(this._layout?.entities[t]));
  }
  _name(t) {
    return this._s(t)?.attributes.friendly_name ?? t.split(".")[1];
  }
  get _loc() {
    return this.hass?.locale?.language ?? "de";
  }
  get _c() {
    return { ...vn, ...this._config?.colours ?? {} };
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
    return Ze;
  }
  /** The card is at least this tall. */
  get _minViewH() {
    return Xe;
  }
  /** Room the card keeps below the top of the lowest battery. */
  get _batteryTail() {
    return 138;
  }
  /** Height of one load list row; looks may make the lists denser. */
  get _rowH() {
    return An;
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
    return Mn;
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
  /** Dots of the house line (from the inverter to the house). */
  _houseDots(t, e, s) {
    return this._dot(t, e, s, !0);
  }
  /** Speed of the load list trains in px per second. */
  get _wagonSpeed() {
    return Qe;
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
    const t = E(this._s(this._layout?.home_today));
    if (t === null) return null;
    const e = (this._layout?.batteries ?? []).flatMap((s) => s.backup ?? []).reduce((s, n) => s + (E(this._s(n.today)) ?? 0), 0);
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
  _flow(t, e, s, n, o = !0) {
    return _`
      <path d=${t} fill="none" stroke=${e} stroke-width=${qs(s, this._max)} stroke-opacity="0.85" />
      ${o ? this._dot(t, e, s, n) : $}
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
  _dot(t, e, s, n = !0, o = 3.2, i) {
    if (s === null || Math.abs(s) < B) return _``;
    const a = this._bySize, r = i?.radius ?? (a ? Math.max(1.7, sn(s, this._max) * (o / 3.2)) : o);
    if (i) {
      const h = (i.travel / i.period).toFixed(4), p = { dur: `${i.period.toFixed(2)}s`, begin: `${i.begin.toFixed(2)}s` };
      return this._orb(
        r,
        e,
        _`<animateMotion dur=${p.dur} begin=${p.begin} repeatCount="indefinite" calcMode="linear" rotate="auto"
            keyPoints="0;1;1" keyTimes=${`0;${h};1`} path=${t} />
          <animate attributeName="opacity" dur=${p.dur} begin=${p.begin} repeatCount="indefinite"
            calcMode="discrete" values="1;0" keyTimes=${`0;${h}`} />`,
        !0
      );
    }
    const c = this._dotDuration(t, s);
    return this._orb(
      r,
      e,
      _`<animateMotion dur=${`${c.toFixed(2)}s`} repeatCount="indefinite" calcMode="linear"
        rotate=${n ? "auto" : "auto-reverse"}
        keyPoints=${n ? "0;1" : "1;0"} keyTimes="0;1" path=${t} />`
    );
  }
  /** Seconds a (non-train) dot needs for path `d`; looks use it to sync their own effects. */
  _dotDuration(t, e) {
    return this._bySize ? Math.max(0.6, pe(t) / Qe) : Zs(e, this._max);
  }
  /** Draws a moving dot; `motion` holds its animation elements. Looks override this. */
  _orb(t, e, s, n = !1) {
    return _`<circle r=${t} fill=${e} opacity=${n ? "0" : $}>${s}</circle>`;
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
  _panel(t, e, s, n, o) {
    return _`<rect x=${t} y=${e} width=${s} height=${n} rx="4" fill="none" stroke=${o} stroke-width="1" />`;
  }
  _box(t, e, s, n, o, i, a = 12) {
    return _`
      ${this._panel(t, e, s, n, o)}
      <text x=${t + s / 2} y=${e + n / 2 + a * 0.35} text-anchor="middle" class="val" font-size=${this._fs(a)}>${i}</text>
    `;
  }
  _icon(t, e, s, n, o) {
    return _`<path d=${t} fill=${o} transform=${`translate(${e} ${s}) scale(${n / 24})`} />`;
  }
  // -- sections ---------------------------------------------------------------
  _solar() {
    const t = this._layout, e = this._c.solar, s = this._own("solar_power"), n = t.solar.strings.slice(0, 4), o = this._stringPos, i = this._pvBoxY, [a, r] = this._pvBox, c = a + r + 6, h = Pt(this._s(t.solar.today)), p = Pt(this._s(t.solar.forecast_remaining)), g = n.map((f, v) => this._stringRoute(o[v][0], o[v][1])), d = n.length > 0 && g.every((f) => f !== null), m = `M ${this._solarX} ${i + 26} V ${this._solarY} H ${this._invX}`;
    return _`
      ${this._solarBack()}
      ${d ? (
      // the line first, the strings' dots on it, tiles and box on top (dots pass below the glass)
      _`${this._flow(m, e, s, !0, !1)}
            ${this._trainDots("pv", e, n.map((f, v) => ({ route: g[v], w: this._w(f.entity), forward: !0 })))}`
    ) : $}
      ${n.map((f, v) => {
      const [x, w] = o[v];
      return this._tap(f.entity, this._stringTile(x, w, f.entity, e));
    })}
      ${this._solarIcon(e)}
      ${this._tap(t.entities.solar_power, this._box(a, i, r, 26, e, C(s, this._loc), 13))}
      <text x=${c} y=${i + 9} class="lbl">PV gesamt</text>
      ${h !== null ? _`<text x=${c} y=${i + 22} class="small" fill=${e}>${F(h, this._loc)} heute</text>` : $}
      ${p !== null ? _`<text x=${c} y=${i + 34} class="small">Rest ${F(p, this._loc)}</text>` : $}
      ${d ? $ : this._flow(m, e, s, !0)}
    `;
  }
  /** Drawn first in the PV section, below the string tiles (nothing in the classic look). */
  _solarBack() {
    return _``;
  }
  /** Symbol next to the PV strings. */
  _solarIcon(t) {
    return this._icon(Pn, 152, 34, 26, t);
  }
  /** One PV string: value box with its name below (tile at x, y; 60 x 38 available). */
  _stringTile(t, e, s, n) {
    return _`${this._box(t, e, 60, 24, n, C(this._w(s), this._loc), 11)}
      <text x=${t} y=${e + 35} class="lbl">${Lt(this._name(s), 14)}</text>`;
  }
  /** Batteries in display order: those with a backup output go to the right. */
  _displayBatteries() {
    const t = this._layout?.batteries ?? [], e = t.filter((r) => !(r.backup ?? []).length), s = t.filter((r) => (r.backup ?? []).length), n = [...e, ...s], o = tn(n.length), i = this._batteryShift(n.length), a = this._storeY - Ze;
    return n.map((r, c) => ({ ...r, ...o[c], cx: o[c].cx + i, top: o[c].top + a, index: c }));
  }
  _batteries() {
    const t = this._layout, e = this._c.battery;
    if (!t.batteries.length) return _``;
    const s = this._own("battery_soc"), n = this._own("battery_energy"), o = this._displayBatteries();
    o.length;
    const i = o.map((w) => this._lineFlow(w.name, E(this._s(w.power)))), r = o.some((w) => w.backup_only || (w.backup ?? []).length) ? i.reduce((w, k) => k === null ? w : (w ?? 0) + k, null) : this._own("battery_power"), c = Math.min(...o.map((w) => w.cx - w.w / 2)), h = Math.max(...o.map((w) => w.cx + w.w / 2)) - c, [p, g] = this._invBottom, d = this._storeY, m = Math.min(Math.max(p, c + 10), c + h - 10), f = m === p ? `M ${p} ${g} V ${d}` : `M ${p} ${g} V ${d - 5} H ${m} V ${d}`, v = o.map((w) => this._batteryRoute(w.cx, w.top)), x = v.every((w) => w !== null);
    return _`
      ${o.map((w, k) => {
      const { cx: H, top: L, w: z } = w, T = E(this._s(w.power)), Y = E(this._s(w.soc)), V = `M ${H} ${d + jt} V ${L}`, j = T === null ? "" : T > B ? "lädt" : T < -B ? "entlädt" : "ruht", u = i[k];
      return _`
          ${this._flow(V, e, u, (u ?? 0) > 0, !x)}
          ${this._tap(w.power, this._batteryWidget(w.name, H, L, z, T, Y, j, e, w.capacity_kwh))}
        `;
    })}
      ${this._flow(f, e, r, (r ?? 0) > 0, !x)}
      ${x ? this._trainDots(
      "battery",
      e,
      o.map((w, k) => ({ route: v[k], w: i[k], forward: (i[k] ?? 0) > 0 }))
    ) : $}
      ${this._tap(t.entities.battery_soc, this._box(
      c,
      d,
      h,
      jt,
      e,
      `${h >= 120 ? "Speicher " : ""}${At(s, this._loc)}${n !== null && h >= 80 ? ` · ${F(n, this._loc)}` : ""}`,
      h >= 150 ? 11 : 10
    ))}
    `;
  }
  /** One battery below the storage box: widget spans top .. top + 104 around cx. */
  _batteryWidget(t, e, s, n, o, i, a, r, c = null) {
    const h = n < 54, p = Math.max(0, Math.min(100, i ?? 0));
    return _`
      ${this._box(e - n / 2, s, n, 22, r, C(o === null ? null : Math.abs(o), this._loc), h ? 10 : 11)}
      <text x=${e} y=${s + 32} text-anchor="middle" class="tiny">${a}</text>
      <rect x=${e - 9} y=${s + 42} width="18" height="32" rx="3" fill="none" stroke=${r} />
      <rect x=${e - 4} y=${s + 39} width="8" height="3" fill=${r} />
      <rect x=${e - 7} y=${s + 72 - 28 * p / 100} width="14" height=${28 * p / 100} rx="1" fill=${r} fill-opacity="0.7" />
      <text x=${e} y=${s + 91} text-anchor="middle" class="soc">${At(i, this._loc)}</text>
      <text x=${e} y=${s + 104} text-anchor="middle" class="tiny">${Lt(t, h ? 10 : 14)}</text>
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
    const e = this._c, s = rt, n = [], o = this._rowH, i = o / 2 - 1;
    let a = this._groupsTop;
    const r = (f, v, x, w, k, H, L, z) => {
      if (!x.length) return;
      const T = this._listLimit(f), Y = T !== null && x.length > T, V = this._expanded.has(f);
      let j = x;
      if (Y) {
        const q = (P) => E(this._s(P.today)) ?? 0, it = new Set([...x].sort((P, tt) => q(tt) - q(P)).slice(0, T)), wt = x.filter((P) => !it.has(P)), te = wt.reduce((P, tt) => {
          const pt = E(this._s(tt.today));
          return pt === null ? P : (P ?? 0) + pt;
        }, null), X = {
          entity: "",
          today: null,
          label: V ? "− weniger" : `+ ${wt.length} weitere`,
          more: { group: f, power: V ? null : this._sumW(wt), today: V ? null : te }
        };
        j = [...V ? x : x.filter((P) => it.has(P)), X];
      }
      const u = xn(j), y = Math.max(a + 6, L ? L.pref - 10 : 0), M = L ? Math.min(Math.max(y + i, L.lo), L.hi) : y + i, A = k(y + i, M), D = z?.(M), yt = D ? `${D} ${A.replace(/^M\s+\S+\s+\S+\s*/, "")}` : void 0;
      n.push({
        title: f,
        colour: v,
        power: w,
        titleY: y - 6,
        y0: y,
        trunk: A,
        loads: j.map((q) => ({ ...q, trunk: A, route: yt, source: H })),
        all: x,
        rows: u,
        more: Y ? { hidden: x.length - j.length, expanded: V } : void 0
      }), a = y + u * o + this._groupGap;
    }, c = [...t.loads.fixed], h = t.entities.unmeasured_power;
    this._unmeasuredInList && h && c.push({
      entity: h,
      today: t.unmeasured_today ?? null,
      label: "Nicht erfasst",
      tip: "Nicht erfasst · Hausverbrauch ohne die gemessenen Verbraucher"
    });
    const p = this._laneFinder(), g = this._houseY;
    r(
      "Grundlast",
      e.home,
      c,
      this._sumW(c),
      (f) => `M 285 ${g + 9} H ${p(300, g + 9, f)} V ${f} H ${s}`,
      void 0,
      void 0,
      () => this._houseLead(g + 9)
    ), r(
      "Zusätzlich",
      e.flexible,
      t.loads.flexible,
      this._sumW(t.loads.flexible),
      (f) => `M 285 ${g + 19} H ${p(306, g + 19, f)} V ${f} H ${s}`,
      void 0,
      void 0,
      () => this._houseLead(g + 19)
    );
    const d = t.wallbox;
    if (d && this._wallboxInList) {
      const f = E(this._s(d.soc ?? void 0)), v = f !== null ? `${d.name} Auto ${At(f, this._loc)}` : d.name;
      r(
        "Wallbox",
        d.flexible ? e.flexible : e.home,
        [{ entity: d.power, today: d.today, label: v, tip: `${d.name} · ${d.flexible ? "Zusatzverbraucher" : "Grundlast"}` }],
        this._w(d.power),
        (x, w) => `M ${this._invX + 60} ${w} H ${qe} V ${x} H ${s}`,
        void 0,
        { pref: this._invY + Ln, lo: this._invY + 6, hi: this._invY + 56 }
        // anywhere on the inverter's right edge
      );
    }
    return this._displayBatteries().filter((f) => (f.backup ?? []).length).reverse().forEach((f, v) => {
      const x = v === 0 ? Ke : Je, w = v === 0 ? { pref: f.top + 57, lo: f.top + 46, hi: f.top + 70 } : { pref: f.top + 68, lo: f.top + 64, hi: f.top + 72 };
      r(
        Lt(f.name, 12),
        // red colour + feed line from the battery mark it as backup
        e.backup,
        f.backup ?? [],
        this._sumW(f.backup ?? []),
        (k, H) => `M ${this._batteryOutX(f.cx, f.w)} ${H} H ${x} V ${k} H ${s}`,
        f.name,
        w,
        (k) => this._batteryLead(f.cx, f.top, f.w, k)
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
    return N - 3;
  }
  /** Lines inside a load list: the bracket with the rows' branches (one path),
   *  or the dashed link from a load to a load contained in it. */
  _branch(t, e, s) {
    return _`<path d=${t} fill="none" stroke=${e} stroke-width="1" stroke-opacity="0.6"
      stroke-dasharray=${s === "child" ? "2 2" : $} />`;
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
    const t = this._displayBatteries(), e = t.map((i) => ({ x0: i.cx - i.w / 2 - 3, x1: i.cx + i.w / 2 + 3, y0: i.top - 2, y1: i.top + 110 }));
    if (t.length) {
      const i = Math.min(...t.map((r) => r.cx - r.w / 2)) - 3, a = Math.max(...t.map((r) => r.cx + r.w / 2)) + 3;
      e.push({ x0: i, x1: a, y0: this._storeY - 3, y1: this._storeY + jt + 3 });
    }
    const s = [Ke, Je, ...this._layout?.wallbox && this._wallboxInList ? [qe] : []], n = [], o = (i, a, r) => {
      const [c, h] = a < r ? [a, r] : [r, a];
      return !e.some((p) => i >= p.x0 && i <= p.x1 && h >= p.y0 && c <= p.y1) && !s.some((p) => Math.abs(p - i) < 4) && !n.some((p) => Math.abs(p - i) < 5);
    };
    return (i, a, r) => {
      let c = i;
      for (; !o(c, a, r) && c < rt - 8; ) c += 3;
      return c >= rt - 8 && (c = i), n.push(c), c;
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
    const n = this._rowH, o = n / 2 - 1, i = (u) => u.w !== null && Math.abs(u.w) >= B, a = (u) => E(this._s(u.today)) ?? 0, r = (u, y) => this._idleByEnergy ? Number(i(y)) - Number(i(u)) || (i(u) ? y.w - u.w : a(y) - a(u)) || u.name.localeCompare(y.name) : (y.w ?? -1 / 0) - (u.w ?? -1 / 0) || u.name.localeCompare(y.name), c = t.map((u) => ({ ...u, w: u.more ? u.more.power : this._w(u.entity), name: u.label ?? this._name(u.entity) })).sort((u, y) => +!!u.more - +!!y.more || r(u, y)), h = [];
    for (const u of c) {
      const y = h.length;
      h.push({ ...u, child: !1 });
      const M = (u.children ?? []).map((A) => ({ ...u, ...A, children: void 0, label: void 0, w: this._w(A.entity), name: this._name(A.entity) })).sort(r);
      for (const A of M) h.push({ ...A, child: !0, parentRow: y });
    }
    const p = this._rowEntryX, g = (u, y) => `${u.route ?? u.trunk} V ${e + y * n + o} H ${p}`, d = (u, y) => `${g(u, u.parentRow ?? 0)} H ${N + 4} V ${e + y * n + o} H ${N + 10}`, m = (u) => {
      const y = h[u].w;
      if (y === null) return null;
      const M = h.filter((A) => A.child && A.parentRow === u).reduce((A, D) => A + Math.max(D.w ?? 0, 0), 0);
      return Math.max(y - M, 0);
    }, f = (u, y) => u.child ? u.w : m(y), v = h.map((u, y) => ({ l: u, i: y, w: f(u, y) })).filter(({ w: u }) => u !== null && Math.abs(u) >= B), x = this._wagonSpeed, w = v.flatMap(
      ({ l: u, i: y, w: M }) => (this._wagonBalls(M, s, u.source) ?? [void 0]).map((A) => ({ l: u, i: y, radius: A?.r, tint: A?.colour }))
    );
    w.some((u) => u.radius !== void 0) && w.sort((u, y) => (y.radius ?? 0) - (u.radius ?? 0));
    let k = 0;
    const H = w.map(({ l: u, i: y, radius: M, tint: A }, D) => (D && (k += M === void 0 ? Sn : (w[D - 1].radius ?? 0) + M + 2.5), { i: y, radius: M, tint: A, begin: k / x, travel: pe(u.child ? d(u, y) : g(u, y)) / x })), L = Math.max(1, ...H.map((u) => u.begin + u.travel)) + En, z = /* @__PURE__ */ new Map();
    for (const u of H)
      z.set(u.i, [...z.get(u.i) ?? [], { period: L, begin: u.begin, travel: u.travel, radius: u.radius, tint: u.tint }]);
    const T = (u, y, M) => (z.get(M) ?? []).map((A) => this._dot(u, A.tint ?? s, y, !0, 2.4, A)), Y = h.reduce((u, y, M) => y.child ? u : M, 0), V = this._pipeTrunk ? t[0]?.trunk : void 0, j = [
      ...V ? [V] : [],
      `M ${rt} ${V ? e + o : e + 4} V ${e + Y * n + o}`,
      ...h.flatMap((u, y) => u.child ? [] : [`M ${rt} ${e + y * n + o} H ${p}`])
    ].join(" ");
    return _`
      ${this._branch(j, s, "row")}
      ${h.map((u, y) => {
      const M = e + y * n, A = u.w === null || Math.abs(u.w) < B;
      if (u.child) {
        const q = e + (u.parentRow ?? 0) * n + n - 3, it = `${u.name} · enthalten in ${h[u.parentRow ?? 0].name}`;
        return _`
            ${this._branch(`M ${N + 4} ${q} V ${M + o} H ${N + 10}`, s, "child")}
            ${this._bySize ? T(d(u, y), u.w, y) : $}
            <g opacity=${A ? 0.45 : 0.85} class="tap" data-entity=${u.entity}>
              ${this._nameBox(u.name, M, s, it, 12)}
              ${this._valueCell(nt - Q, M + 1, Q, n - 4, s, C(u.w, this._loc), 9, "power")}
            </g>
            ${this._tap(u.today, this._valueCell(K - et, M + 1, et, n - 4, s, F(E(this._s(u.today)), this._loc), 8.5, "energy"))}`;
      }
      const D = this._bySize ? T(g(u, y), m(y), y) : this._dot(g(u, y), s, u.w, !0, 2.4);
      if (u.more) {
        const q = u.more.group;
        return _`
            ${D}
            <g class="more" opacity=${u.more.power !== null && A ? 0.55 : 1} @click=${() => this._toggleList(q)}>
              <rect x=${N - 8} y=${M} width=${K - N + 8} height=${n} fill="transparent" />
              <text x=${N + 2} y=${M + n * 0.62} class="small" fill=${s}>${u.name}</text>
              ${u.more.power !== null ? this._valueCell(nt - Q, M + 1, Q, n - 4, s, C(u.w, this._loc), 9, "power") : $}
              ${u.more.today !== null ? this._valueCell(K - et, M + 1, et, n - 4, s, F(u.more.today, this._loc), 8.5, "energy") : $}
            </g>`;
      }
      const yt = u.tip ?? (u.source ? `${u.name} · gespeist von ${u.source}` : u.name);
      return _`
          ${D}
          <g opacity=${A ? 0.45 : 1} class="tap" data-entity=${u.entity}>
            ${this._nameBox(u.name, M, s, yt)}
            ${this._valueCell(nt - Q, M + 1, Q, n - 4, s, C(u.w, this._loc), 9, "power")}
          </g>
          ${this._tap(u.today, this._valueCell(K - et, M + 1, et, n - 4, s, F(E(this._s(u.today)), this._loc), 8.5, "energy"))}`;
    })}
    `;
  }
  /** Power or energy of one list row. */
  _valueCell(t, e, s, n, o, i, a, r) {
    return this._box(t, e, s, n, o, i, a);
  }
  /** Name of a load in a rounded box; long names wrap to two smaller lines. */
  _nameBox(t, e, s, n = t, o = 0) {
    const i = N - 2 + o, a = nt - Q - 4 - i, { lines: r, small: c } = o ? de(t, 9, 12) : de(t, 11, 15);
    return _`<g>
      <title>${n}</title>
      <rect x=${i} y=${e + 1} width=${a} height="18" rx="4" fill="none" stroke=${s} stroke-width="1" />
      ${c ? _`<text x=${i + 4} y=${e + 9} class="name" font-size=${this._fs(7.5)}>${r[0]}</text>
              <text x=${i + 4} y=${e + 17} class="name" font-size=${this._fs(7.5)}>${r[1] ?? ""}</text>` : _`<text x=${i + 4} y=${e + 13.5} class="name" font-size=${this._fs(10)}>${r[0]}</text>`}
    </g>`;
  }
  _groupTitle(t, e, s, n, o) {
    const i = o.reduce((a, r) => {
      const c = E(this._s(r.today));
      return c === null ? a : (a ?? 0) + c;
    }, null);
    return _`
      <text x=${rt} y=${t} class="small grp" fill=${e}>${s}</text>
      <text x=${nt - Q / 2} y=${t} text-anchor="middle" class="small grp" fill=${e}>${C(n, this._loc)}</text>
      <text x=${K - et / 2} y=${t} text-anchor="middle" class="small grp" fill=${e}>${F(i, this._loc)}</text>`;
  }
  /** Total svg height needed for the load lists and the batteries. */
  get _viewH() {
    if (!this._layout) return Xe;
    const t = this._groups(), e = t[t.length - 1], s = e ? e.y0 + e.rows * this._rowH + 8 : 0, n = this._displayBatteries(), o = n.length ? Math.max(...n.map((i) => i.top)) + this._batteryTail : 0;
    return Math.max(this._minViewH, s, o);
  }
  /** House symbol above the house value (area 226..274 x 16..64). */
  _houseIcon(t) {
    return this._icon(zn, 226, 16, 48, t);
  }
  /** Background behind a load group (none in the classic look). */
  _groupPanel(t) {
    return _``;
  }
  /** Small symbol next to a group title. */
  _groupIcon(t) {
    return t.title === "Wallbox" ? this._icon(Cn, rt + 46, t.titleY - 11, 14, t.colour) : _``;
  }
  _home() {
    const t = this._layout, e = this._c.home, s = this._own("home_power"), n = this._own("unmeasured_power"), o = this._groups(), i = `M ${this._invTop[0]} ${this._invTop[1]} V ${Math.min(152, this._invTop[1] - 8)} H 250 V ${this._houseY + 26}`, a = s === null ? null : Math.max(s - this._offGridLoads, 0);
    return _`
      ${this._houseIcon(e)}
      ${n !== null && !this._unmeasuredInList ? _`<text x="256" y=${this._houseY + 42} class="tiny">nicht erfasst</text>
              <text x="256" y=${this._houseY + 52} class="tiny val">${C(n, this._loc)}</text>` : $}
      ${this._flow(i, e, a, !0, !1)}
      ${this._houseDots(this._houseIn() ?? i, e, a)}
      ${this._houseJunction(a)}
      ${o.length ? this._listsHeader(s) : $}
      ${o.length && this._periodLabel ? _`<text x=${K - et / 2} y="9" text-anchor="middle" class="tiny">${t.energy_period === "rolling24" ? "24 h" : "heute"}</text>` : $}
      ${o.map(
      (r) => _`
          ${this._groupPanel(r)}
          ${this._groupTitle(r.titleY, r.colour, r.title, r.power, r.all)}
          ${this._groupIcon(r)}
          ${this._pipeTrunk ? $ : this._flow(r.trunk, r.colour, r.power, !0, !1)}
          ${this._loadList(r.loads, r.y0, r.colour)}
        `
    )}
      ${this._tap(t.entities.home_power, this._box(215, this._houseY, 70, 26, e, C(a, this._loc), 13))}
      <text x="211" y=${this._houseY + 13} text-anchor="end" class="lbl">Haus</text>
      <text x="211" y=${this._houseY + 25} text-anchor="end" class="tiny val">${F(this._houseNetToday, this._loc)}</text>
    `;
  }
  /** Current grid values: power, direction, price and today's import / export. */
  _gridData() {
    const t = this._layout, e = this._own("grid_power"), s = (e ?? 0) < -B, n = s ? t.grid.export_price ? he(this._s(t.grid.export_price)) : t.grid.export_price_fixed ?? null : he(this._s(t.grid.price));
    return {
      grid: e,
      exporting: s,
      cents: n,
      label: e === null ? "" : e > B ? "Bezug" : s ? "Einspeisung" : "",
      power: C(e === null ? null : Math.abs(e), this._loc),
      imp: Pt(this._s(t.grid.import_today)),
      exp: Pt(this._s(t.grid.export_today))
    };
  }
  _grid() {
    const t = this._c.grid, { grid: e, exporting: s, cents: n, label: o, power: i, imp: a, exp: r } = this._gridData();
    return _`
      ${this._flow(`M ${this._invX} ${this._invY + 42} H 84`, t, e, s)}
      ${this._tap(this._layout.entities.grid_power, _`${this._panel(10, 192, 74, 40, t)}
        <text x="47" y=${n === null ? 217 : 209} text-anchor="middle" class="val" font-size=${this._fs(13)}>${i}</text>`)}
      ${n !== null ? _`<text x="47" y="225" text-anchor="middle" class="tiny" fill=${t}>${Ae(n, this._loc)}</text>` : $}
      <text x="90" y="207" class="tiny">${o}</text>
      ${this._icon(Hn, 27, 240, 40, t)}
      ${a !== null ? _`<text x="10" y="292" class="small" fill=${t}>↓ ${F(a, this._loc)}<tspan class="tiny"> Bezug</tspan></text>` : $}
      ${r !== null ? _`<text x="10" y="305" class="small">↑ ${F(r, this._loc)}<tspan class="tiny"> Einspeisung</tspan></text>` : $}
    `;
  }
  // -- render -----------------------------------------------------------------
  render() {
    if (this._error)
      return b`<ha-card><div class="msg">${this._error}</div></ha-card>`;
    if (!this._layout || !this.hass)
      return b`<ha-card><div class="msg">Lade Wattrio …</div></ha-card>`;
    const t = this._config?.title;
    return b`
      <ha-card .header=${t ?? $}>
        <svg viewBox=${`0 0 ${kn} ${this._viewH}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Wattrio – Energiefluss"
          @click=${this._onTap}>
          ${this._defs()} ${this._solar()} ${this._batteries()} ${this._inverter()} ${this._home()} ${this._grid()}
          ${this._overlay()}
        </svg>
      </ha-card>
    `;
  }
};
Ee.styles = qt`
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
let J = Ee;
Ct([
  mt({ attribute: !1 })
], J.prototype, "hass");
Ct([
  O()
], J.prototype, "_config");
Ct([
  O()
], J.prototype, "_layout");
Ct([
  O()
], J.prototype, "_error");
Ct([
  O()
], J.prototype, "_expanded");
customElements.get("energiefluss-card") || customElements.define("energiefluss-card", J);
window.customCards = window.customCards ?? [];
window.customCards.some((l) => l.type === "energiefluss-card") || window.customCards.push({
  type: "energiefluss-card",
  name: "Wattrio Energiefluss Klassik",
  description: "Wattrio: animierter Energiefluss im klassischen, flachen Look – eingerichtet über die Wattrio-Integration.",
  preview: !0
});
const Bn = `<svg
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
</svg>`, Tn = `<svg
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
</svg>`, On = `<svg
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
</svg>`, Nn = `<svg
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
</svg>`, Rn = `<svg
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
</svg>`, In = `<svg
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
</svg>`, Vn = `<svg
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
</svg>`, Fn = `<svg
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
</svg>`, Wn = `<svg
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
</svg>`, Un = `<svg
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
</svg>`, jn = `<svg
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
</svg>`, Dn = `<svg
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
</svg>`, Gn = `<svg
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
</svg>`, Yn = `<svg
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
</svg>`, Xn = `<svg
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
</svg>`, Zn = `<svg
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
</svg>`, qn = `<svg
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-server"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 7a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-2" />
  <path d="M3 15a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -2" />
  <path d="M7 8l0 .01" />
  <path d="M7 16l0 .01" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-solar-panel"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M4.28 14h15.44a1 1 0 0 0 .97 -1.243l-1.5 -6a1 1 0 0 0 -.97 -.757h-12.44a1 1 0 0 0 -.97 .757l-1.5 6a1 1 0 0 0 .97 1.243" />
  <path d="M4 10h16" />
  <path d="M10 6l-1 8" />
  <path d="M14 6l1 8" />
  <path d="M12 14v4" />
  <path d="M7 18h10" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-building-broadcast-tower"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  <path d="M16.616 13.924a5 5 0 1 0 -9.23 0" />
  <path d="M20.307 15.469a9 9 0 1 0 -16.615 0" />
  <path d="M9 21l3 -9l3 9" />
  <path d="M10 19h4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-device-tv"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 9a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -9" />
  <path d="M16 3l-4 4l-4 -4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-vacuum-cleaner"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M21 12a9 9 0 1 1 -18 0a9 9 0 0 1 18 0" />
  <path d="M14 9a2 2 0 1 1 -4 0a2 2 0 0 1 4 0" />
  <path d="M12 16h.01" />
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
function S(l) {
  return [...l.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((t) => t[1]).filter((t) => t !== "M0 0h24v24H0z");
}
const ni = {
  airConditioning: S(Bn),
  battery: S(Tn),
  bulb: S(On),
  car: S(Nn),
  chargingPile: S(Rn),
  coffee: S(In),
  cooker: S(Vn),
  desktop: S(Fn),
  droplet: S(Wn),
  flame: S(Un),
  fridge: S(jn),
  home: S(Dn),
  lamp: S(Gn),
  microwave: S(Yn),
  plug: S(Xn),
  pool: S(Zn),
  router: S(qn),
  server: S(Kn),
  solarPanel: S(Jn),
  tower: S(Qn),
  tv: S(ti),
  vacuum: S(ei),
  washMachine: S(si)
}, ii = [
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
function oi(l) {
  const t = l.toLowerCase();
  return ii.find(([e]) => e.test(t))?.[1] ?? "plug";
}
const G = {
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
}, ct = {
  file: "inverter-glass.png",
  width: 300,
  height: 278,
  top: [115.7, 23.5],
  bottom: [100.2, 221.8],
  left: [[18.7, 61], [18.7, 99.1], [18.7, 138.1]]
}, ft = {
  file: "solar-glass.png",
  width: 360,
  height: 222,
  face: [[16.8, 42.7], [329.6, 11.1], [348.9, 165], [34.1, 204]],
  across: [0.9949, -0.1005],
  down: [0.1063, 0.9943]
}, ri = {
  solar: "#ffd43b",
  // yellow, clearly apart from the other sources
  battery: "#3ee08f",
  grid: "#4db2ff",
  home: "#2fd4b4",
  flexible: "#6f9dff",
  backup: "#ff6a3d",
  inverter: "#a8d4ff"
}, W = "#cfeaff", ai = [
  [0, -2.2, 2.2, 0],
  [1.6, 2.4, -1.8, -1.2],
  [-1.2, -1, 2, 1.4],
  [0.8, 2.2, -2.4, 0.4]
], Ot = 26, li = 2.5, ci = 0.7, Nt = 72, hi = 0.6, di = 0.7, ms = 5.2, pi = 2.7, ui = 1.6, ts = { big: ms, medium: pi, small: ui }, ys = 6, ws = 0, bs = 130, _e = bs / ft.width, _i = import.meta.url.replace(/[^/]*$/, "") + ft.file, es = 0, Rt = 3.5, ne = 44, ie = 18, xs = ft.face.map(([l, t]) => [ys + l * _e, ws + t * _e]), xt = (l, t) => {
  const [e, s, n, o] = xs, i = [e[0] + (s[0] - e[0]) * l, e[1] + (s[1] - e[1]) * l], a = [o[0] + (n[0] - o[0]) * l, o[1] + (n[1] - o[1]) * l];
  return [i[0] + (a[0] - i[0]) * t, i[1] + (a[1] - i[1]) * t];
}, ss = (() => {
  const [l, t, , e] = xs, s = Math.hypot(t[0] - l[0], t[1] - l[1]), n = Math.hypot(e[0] - l[0], e[1] - l[1]), o = (es + Rt) / s, i = (es + Rt) / n, a = Rt / s, r = Rt / n, c = [
    [o, 0.5 - a / 2],
    [0.5 + a / 2, 1 - o]
  ], h = [
    [i, 0.5 - r / 2],
    [0.5 + r / 2, 1 - i]
  ];
  return [0, 1, 2, 3].map((p) => {
    const [g, d] = c[p % 2], [m, f] = h[Math.floor(p / 2)];
    return {
      corners: [xt(g, m), xt(d, m), xt(d, f), xt(g, f)],
      middle: xt((g + d) / 2, (m + f) / 2),
      size: [(d - g) * s, (f - m) * n]
    };
  });
})(), fe = 82, vt = [104, fe + 26], ge = 58, It = [250, ge + 26], $e = 196, Vt = $e, ns = "0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1", oe = (l, t = 0, e = 0) => l.map(([s, n, o, i]) => `M ${s + t} ${n + e} L ${o + t} ${i + e}`).join(" "), is = [
  [22, 40, 8, 86],
  [34, 40, 48, 86],
  [24, 10, 22, 40],
  [32, 10, 34, 40],
  [24, 10, 28, 2],
  [32, 10, 28, 2]
], os = [
  [12, 12, 44, 12],
  [12, 12, 23.5, 17],
  [44, 12, 32.5, 17],
  [6, 24, 50, 24],
  [6, 24, 22.7, 30],
  [50, 24, 33.3, 30],
  [2, 36, 54, 36],
  [2, 36, 22, 40],
  [54, 36, 34, 40]
], fi = [
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
], gi = [
  [8, 86, 15, 82],
  [48, 86, 55, 82],
  [22, 40, 29, 36],
  [34, 40, 41, 36],
  [28, 2, 35, -2]
], re = [
  [12, 12],
  [44, 12],
  [6, 24],
  [50, 24],
  [2, 36],
  [54, 36]
], rs = 10, as = 122, ae = 0.7, ut = 8, Ft = 48, ls = 1.25, kt = 15, cs = 196, Xt = 0.24, Zt = [250, 116], $i = import.meta.url.replace(/[^/]*$/, "") + ct.file, me = ([l, t]) => [
  Zt[0] + (l - ct.top[0]) * Xt,
  Zt[1] + (t - ct.top[1]) * Xt
], Wt = ct.left.map(me), le = 6, ce = 132, mi = import.meta.url.replace(/[^/]*$/, "") + G.file, yi = [
  [0, 0, 0, 0],
  [4, -1.5, -4, 1.5],
  [-1.5, 3, 1.5, -3],
  [-4, 1.5, 4, -1.5]
], wi = [
  [28, 2],
  [22, 40],
  [34, 40],
  [15.9, 60],
  [40.1, 60],
  [8, 86],
  [48, 86]
], ze = class ze extends J {
  constructor() {
    super(...arguments), this._seen = /* @__PURE__ */ new Map(), this._lastSeen = /* @__PURE__ */ new Map(), this._routeIdx = /* @__PURE__ */ new Map(), this._ghosts = [];
  }
  get _c() {
    return { ...ri, ...this._config?.colours ?? {} };
  }
  // inverter centred under the house; wallbox sits on the left below the pylon
  get _invX() {
    return Wt[0][0];
  }
  get _solarX() {
    return 104;
  }
  get _houseY() {
    return ge;
  }
  get _invY() {
    return Zt[1];
  }
  get _invTop() {
    return Zt;
  }
  get _invBottom() {
    return me(ct.bottom);
  }
  get _solarY() {
    return Wt[0][1];
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
    return Nt + 12;
  }
  // batteries closer together in height than in the classic look
  _displayBatteries() {
    const t = $e + 50;
    return super._displayBatteries().map((e) => ({ ...e, top: t + (e.top - t) * hi }));
  }
  // denser lists: rows of 15 instead of 22
  // the string labels sit on the middles of the panel's quarters
  get _stringPos() {
    return ss.map(({ middle: [t, e] }) => [t - ne / 2, e - ie / 2]);
  }
  get _pvBoxY() {
    return fe;
  }
  // wide enough to catch the trains of both tile columns (tile middles at 40 and 110)
  get _pvBox() {
    return [22, 96];
  }
  get _storeY() {
    return $e;
  }
  get _rowH() {
    return 15;
  }
  _fs(t) {
    return +(t * di).toFixed(2);
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
    return N - 1;
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
    return 16 + ls;
  }
  render() {
    return this._lastSeen = this._seen, this._seen = /* @__PURE__ */ new Map(), this._routeIdx = /* @__PURE__ */ new Map(), super.render();
  }
  updated(t) {
    super.updated(t);
    const e = this.renderRoot.querySelector("svg");
    if (!e || !this._lastSeen.size) return;
    const s = e.getCurrentTime();
    let n = !1;
    for (const [o, { colour: i, b: a }] of this._lastSeen) {
      if (this._seen.has(o) || s < a.begin) continue;
      const r = (s - a.begin) % a.period;
      if (r >= a.travel) continue;
      const c = a.travel - r;
      this._ghosts.push({ colour: i, route: a.route, forward: a.forward, r: a.r, from: r / a.travel, dur: c, start: s, until: performance.now() + c * 1e3 }), setTimeout(() => this.requestUpdate(), c * 1e3 + 50), n = !0;
    }
    this._lastSeen = /* @__PURE__ */ new Map(), n && this.requestUpdate();
  }
  _overlay() {
    const t = performance.now();
    return this._ghosts = this._ghosts.filter((e) => e.until > t), _`${this._ghosts.map((e) => {
      const s = `${e.dur.toFixed(2)}s`, n = `${e.start.toFixed(2)}s`, o = e.forward ? `${e.from.toFixed(4)};1` : `${(1 - e.from).toFixed(4)};0`;
      return this._orb(
        e.r,
        e.colour,
        _`<animateMotion dur=${s} begin=${n} fill="freeze" calcMode="linear" rotate="auto" keyPoints=${o}
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
          <stop offset="0" stop-color=${s} stop-opacity="0.55" />
          <stop offset="0.45" stop-color=${s} stop-opacity="0.18" />
          <stop offset="1" stop-color=${s} stop-opacity="0" />
        </radialGradient>`
    )}
    </defs>`;
  }
  // -- lines and balls ---------------------------------------------------------
  /** Glass tube: bright rim, dark bore tinted with the flow colour, a sheen line. */
  _flow(t, e, s, n, o = !0) {
    const i = s !== null && Math.abs(s) >= B;
    return _`<g class="tube">
        <path d=${t} class="rim" />
        <path d=${t} class="bore" />
        <path d=${t} class="tint" stroke=${e} stroke-opacity=${i ? 0.24 : 0.08} />
        <path d=${t} class="shine" />
      </g>
      ${o ? this._dot(t, e, s, n) : $}`;
  }
  /** The train on path `d`: radius and start time of each ball, travel time and period. */
  _trainOf(t, e) {
    const s = Bt(e).map((r) => ts[r]), n = [];
    let o = 0;
    s.forEach((r, c) => {
      c && (o += s[c - 1] + r + li), n.push(o / Ot);
    });
    const i = pe(t) / Ot, a = i + (n[n.length - 1] ?? 0) + ci;
    return { radii: s, begins: n, travel: i, period: a };
  }
  /**
   * Lines without their own train logic (everything except the load lists)
   * get a train of balls instead of one ball whose speed or size shows the power.
   */
  _dot(t, e, s, n = !0, o = 3.2, i) {
    if (i)
      return s === null || Math.abs(s) < B ? _`` : this._ball(e, { route: t, forward: n, r: i.radius ?? o, begin: i.begin, travel: i.travel, period: i.period });
    if (s === null || Math.abs(s) < B) return _``;
    const { radii: a, travel: r, period: c, begins: h } = this._trainOf(t, s);
    return _`${h.map(
      (p, g) => this._ball(e, { route: t, forward: n, r: a[g], begin: p, travel: r, period: c })
    )}`;
  }
  /** One ball riding its route once per period. */
  _ball(t, e) {
    const s = this._routeIdx.get(e.route) ?? 0;
    this._routeIdx.set(e.route, s + 1), this._seen.set(`${e.forward ? ">" : "<"}${e.route}#${s}`, { colour: t, b: e });
    const n = (e.travel / e.period).toFixed(4), o = `${e.period.toFixed(2)}s`, i = `${e.begin.toFixed(2)}s`;
    return this._orb(
      e.r,
      t,
      _`<animateMotion dur=${o} begin=${i} repeatCount="indefinite" calcMode="linear" rotate="auto"
          keyPoints=${e.forward ? "0;1;1" : "1;0;0"} keyTimes=${`0;${n};1`} path=${e.route} />
        <animate attributeName="opacity" dur=${o} begin=${i} repeatCount="indefinite" calcMode="discrete"
          values="1;0" keyTimes=${`0;${n}`} />`,
      !0
    );
  }
  /**
   * Where lines meet in a glass box, the trains are counted anew: the strings'
   * trains end inside the PV total box and the box sends one train with the
   * total PV power to the inverter; the storage box sends one train with the
   * total battery power to or from the inverter and one per battery.
   */
  _trainDots(t, e, s) {
    const n = (d) => t === "battery" && !d ? this._c.battery : e, o = (d, m, f) => t === "battery" && f ? this._mixedTrain(d, m) : this._dot(d, n(f), m, f), i = s.map((d) => o(d.route, d.w, d.forward));
    if (t === "pv") {
      const d = `M ${vt[0]} ${vt[1]} V ${this._solarY} H ${this._invX}`, m = this._own("solar_power"), f = s.flatMap((v) => this._arrivals(v.route, v.w));
      return _`${i}${this._dot(d, e, m, !0)}${this._blob(vt, e, m, f)}`;
    }
    const a = s.reduce((d, m) => m.w === null ? d : (d ?? 0) + m.w, null), [r, c] = this._invBottom, h = `M ${r.toFixed(1)} ${c.toFixed(1)} V ${Vt}`, p = (a ?? 0) > 0, g = [
      ...p ? this._arrivals(h, a) : [],
      ...s.filter((d) => !d.forward).flatMap((d) => this._arrivals(d.route, d.w))
    ];
    return _`${i}${o(h, a, p)}${this._blob([r, Vt], n(p), Math.abs(a ?? 0), g)}`;
  }
  /** When the balls of a train on `route` finish their way (at its end, or at its
   *  start for a train running backwards). */
  _arrivals(t, e) {
    if (e === null || Math.abs(e) < B) return [];
    const { radii: s, begins: n, travel: o, period: i } = this._trainOf(t, e);
    return n.map((a, r) => ({ at: a + o, period: i, big: s[r] === ms }));
  }
  /**
   * A drop of mercury where trains meet: its size shows the power that flows
   * through, it wobbles all the time and swells for a moment whenever a ball
   * runs into it (additive animations, one per arriving ball).
   */
  _blob([t, e], s, n, o) {
    if (n === null || Math.abs(n) < B) return _``;
    const i = 2.2 + 1.6 * Math.sqrt(Math.min(Math.abs(n), 8e3) / 1e3), a = Object.entries(this._c).find(([, h]) => h === s)?.[0], r = (h, p) => {
      const g = (h.big ? 1.4 : 0.6) * (p === "rx" ? 1.15 : 0.85), d = Math.min(0.2, 0.12 / h.period), m = Math.min(0.6, 0.55 / h.period);
      return _`<animate attributeName=${p} additive="sum" dur=${`${h.period.toFixed(2)}s`}
        begin=${`${h.at.toFixed(2)}s`} repeatCount="indefinite" values=${`0;${g};0;0`}
        keyTimes=${`0;${d.toFixed(4)};${m.toFixed(4)};1`} />`;
    }, c = (h, p, g) => {
      const d = h === "rx" ? [1, 1.1, 0.94, 1] : [1, 0.92, 1.07, 1];
      return _`<animate attributeName=${h} dur=${`${p}s`} begin=${`${g}s`} repeatCount="indefinite"
        calcMode="spline" keyTimes="0;0.33;0.66;1" keySplines=${"0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1"}
        values=${d.map((m) => (i * m).toFixed(2)).join(";")} />`;
    };
    return _`<g>
      <circle cx=${t} cy=${e} r=${i * 2.6} fill=${a ? `url(#ef-halo-${a})` : s} fill-opacity=${a ? $ : 0.2} />
      <ellipse cx=${t} cy=${e} rx=${i} ry=${i} fill=${s}>
        ${c("rx", 1.7, 0)}${c("ry", 1.7, 0)}
        ${o.map((h) => _`${r(h, "rx")}${r(h, "ry")}`)}
      </ellipse>
      <ellipse cx=${t} cy=${e} rx=${i} ry=${i} fill="url(#ef-ball)">
        ${c("rx", 1.7, 0)}${c("ry", 1.7, 0)}
        ${o.map((h) => _`${r(h, "rx")}${r(h, "ry")}`)}
      </ellipse>
      <ellipse cx=${t - i * 0.32} cy=${e - i * 0.38} rx=${i * 0.4} ry=${i * 0.24} fill="#ffffff" fill-opacity="0.85" />
    </g>`;
  }
  // the house power runs into a blob in the house box; the load trains leave it
  _houseJunction(t) {
    return this._blob(It, this._c.home, t, this._arrivals(this._houseIn(), t));
  }
  /** Glowing glass ball: soft halo, coloured body, white core and a sheen. */
  _orb(t, e, s, n = !1) {
    const o = t, i = Object.entries(this._c).find(([, a]) => a === e)?.[0];
    return _`<g opacity=${n ? "0" : $}>
      ${s}
      <circle r=${o * 2.8} fill=${i ? `url(#ef-halo-${i})` : e} fill-opacity=${i ? $ : 0.18} />
      <circle r=${o} fill=${e} />
      <circle r=${o} fill="url(#ef-ball)" />
      <circle cx=${-0.3 * o} cy=${-0.35 * o} r=${o * 0.38} fill="#ffffff" fill-opacity="0.85" />
    </g>`;
  }
  // -- glass building blocks -----------------------------------------------------
  /** A glass slab: drop shadow, tinted body, frosted gradient and a top sheen. */
  _panel(t, e, s, n, o) {
    const i = Math.min(7, n / 3);
    return _`<g>
      <rect x=${t + 1} y=${e + 2.5} width=${s} height=${n} rx=${i} fill="#020a14" fill-opacity="0.32" />
      <rect x=${t} y=${e} width=${s} height=${n} rx=${i} fill=${o} fill-opacity="0.1" />
      <rect x=${t} y=${e} width=${s} height=${n} rx=${i} fill="url(#ef-slab)" stroke=${o} stroke-opacity="0.55"
        stroke-width="0.9" />
      <rect x=${t + 1.5} y=${e + 1.2} width=${s - 3} height=${Math.min(n * 0.42, 12)} rx=${Math.max(1, i - 1)}
        fill="url(#ef-sheen)" />
    </g>`;
  }
  /** A Tabler line icon at (x, y), `size` px. */
  _line(t, e, s, n, o) {
    return _`<g transform=${`translate(${e} ${s}) scale(${n / 24})`} fill="none" stroke=${o} stroke-width="1.7"
      stroke-linecap="round" stroke-linejoin="round">${ni[t].map((i) => _`<path d=${i} />`)}</g>`;
  }
  // -- sections ------------------------------------------------------------------
  _solarIcon() {
    return _``;
  }
  /** The glass solar panel picture below the string labels. */
  _solarBack() {
    return _`<image href=${_i} x=${ys} y=${ws} width=${bs}
      height=${(ft.height * _e).toFixed(1)} />`;
  }
  /** One PV string: a glass label filling its quarter of the panel, lying in the
   *  panel's plane, with the same gap to the frame and to its neighbours. */
  _stringTile(t, e, s, n) {
    const o = t + ne / 2, i = e + ie / 2, a = ss.reduce(
      (m, f) => Math.hypot(f.middle[0] - o, f.middle[1] - i) < Math.hypot(m.middle[0] - o, m.middle[1] - i) ? f : m
    ), r = a.corners.map(([m, f]) => `${m.toFixed(1)},${f.toFixed(1)}`).join(" "), [c, h] = ft.across, [p, g] = ft.down, [, d] = a.size;
    return _`
      <polygon points=${r} fill="#020a14" fill-opacity="0.35" transform="translate(0.8 1.6)" />
      <polygon points=${r} fill=${n} fill-opacity="0.12" />
      <polygon points=${r} fill="url(#ef-slab)" stroke=${n} stroke-opacity="0.6" stroke-width="0.8"
        stroke-linejoin="round" />
      <g transform=${`matrix(${c} ${h} ${p} ${g} ${o.toFixed(1)} ${i.toFixed(1)})`}>
        <text x="0" y=${-d / 2 + d * 0.52} text-anchor="middle" class="val" font-size=${this._fs(12)} font-weight="600"
          >${C(this._w(s), this._loc)}</text>
        <text x="0" y=${-d / 2 + d * 0.84} text-anchor="middle" class="tiny" style=${`font-size:${this._fs(7.5)}px`}
          >${Lt(this._name(s), 16)}</text>
      </g>`;
  }
  /** The glass inverter picture, placed by its connectors. */
  _inverter() {
    const [t, e] = me([0, 0]);
    return _`<image href=${$i} x=${t.toFixed(1)} y=${e.toFixed(1)}
      width=${(ct.width * Xt).toFixed(1)} height=${(ct.height * Xt).toFixed(1)} />`;
  }
  /** Glass cylinder with a moving liquid level; name, SoC, kWh, power, status inside. */
  _batteryWidget(t, e, s, n, o, i, a, r, c = null) {
    const h = e - n / 2 + 2, p = e + n / 2 - 2, g = (p - h) / 2, d = 3.5, m = s + 8, f = s + Nt, v = Math.max(0, Math.min(100, i ?? 0)), x = f + d - (f + d - m) * (v / 100), w = `ef-bat-${Math.round(e)}-${Math.round(s)}`, k = `M ${h} ${m} V ${f} A ${g} ${d} 0 0 0 ${p} ${f} V ${m} A ${g} ${d} 0 0 0 ${h} ${m} Z`, H = o !== null && Math.abs(o) >= B, L = this._lineFlow(t, o), z = L !== null && L > B, T = H ? 3.4 : 5.5, Y = L !== null && L < -B, V = n < 54, j = c && i !== null ? F(c * i / 100, this._loc) : "";
    return _`<g>
      <ellipse cx=${e} cy=${f + 4} rx=${g + 8} ry="6" fill="url(#ef-shadow)" />
      <clipPath id=${w}><path d=${k} /></clipPath>
      <path d=${k} fill=${r} fill-opacity="0.07" />
      ${v > 0 ? _`<g clip-path=${`url(#${w})`}>
            ${this._liquid(h, p, x, f + d + 2, r, T)}
          </g>` : $}
      ${z ? _`<g clip-path=${`url(#${w})`}>${this._splash(e, m, x, g, r, L, s)}</g>` : $}
      <path d=${k} fill="url(#ef-tube)" stroke=${W} stroke-opacity="0.55" stroke-width="0.9" />
      ${Y ? this._riseIntoLine(e, f, s, this._c.battery, L) : $}
      <ellipse cx=${e} cy=${m} rx=${g} ry=${d} fill=${r} fill-opacity="0.12" stroke="#e6f6ff" stroke-opacity="0.7"
        stroke-width="0.8" />
      <rect x=${e - 6} y=${s + 3} width="12" height=${m - s - 3} fill=${r} fill-opacity="0.28" stroke=${W}
        stroke-opacity="0.6" stroke-width="0.7" />
      <ellipse cx=${e} cy=${s + 3} rx="6" ry="1.8" fill="#e6f6ff" fill-opacity="0.45" />
      <text x=${e} y=${s + 20} text-anchor="middle" class="bt" font-size=${this._fs(7.5)}>${Lt(t, V ? 9 : 11)}</text>
      <text x=${e} y=${s + 33} text-anchor="middle" class="bt" font-size=${this._fs(13)} font-weight="600">${At(i, this._loc)}</text>
      <text x=${e} y=${s + 43} text-anchor="middle" class="bt" font-size=${this._fs(8)}>${j}</text>
      <text x=${e} y=${s + 53} text-anchor="middle" class="bt" font-size=${this._fs(8.5)}>${C(o === null ? null : Math.abs(o), this._loc)}</text>
      <text x=${e} y=${s + 62} text-anchor="middle" class="bt" font-size=${this._fs(7.5)}>${a}</text>
    </g>`;
  }
  /**
   * Liquid like a phone's charging animation: one soft surface that slowly
   * sloshes between a few shapes (no repeating waves), a lighter layer behind
   * it and a bright rim. Every shape has the same commands so SMIL can morph
   * between them. Fills x0..x1 from `lvl` down to `bottom`; clip it outside.
   */
  _liquid(t, e, s, n, o, i) {
    const a = e - t, r = ([p, g, d, m], f) => `M ${t - 1} ${(f + p).toFixed(2)} C ${(t + a * 0.35).toFixed(2)} ${(f + g).toFixed(2)} ${(e - a * 0.35).toFixed(2)} ${(f + d).toFixed(2)} ${e + 1} ${(f + m).toFixed(2)}`, c = (p, g, d) => r(ai[p], g) + (d ? ` V ${n} H ${t - 1} Z` : ""), h = (p, g, d, m) => _`<path d=${c(d[0], p, g)}>
        <animate attributeName="d" dur=${`${m.toFixed(1)}s`} repeatCount="indefinite" calcMode="spline"
          keyTimes="0;0.25;0.5;0.75;1" keySplines=${ns}
          values=${[...d, d[0]].map((f) => c(f, p, g)).join(";")} />
      </path>`;
    return _`
      <g fill=${o} fill-opacity="0.35">${h(s - 1, !0, [2, 3, 0, 1], i * 1.3)}</g>
      <g fill="url(#ef-liquid)">${h(s, !0, [0, 1, 2, 3], i)}</g>
      <g fill="none" stroke="#e9fff3" stroke-opacity="0.55" stroke-width="0.8">${h(s, !1, [0, 1, 2, 3], i)}</g>`;
  }
  // load list trains count the power in balls as well, big ones in front
  _wagonBalls(t, e, s) {
    const n = Bt(t), o = e === this._c.backup ? this._tints(n, this._backupShares(s)) : this._tints(n);
    return n.map((i, a) => ({ r: ts[i], colour: o[a] }));
  }
  /**
   * Where a battery's backup loads get their power: from the battery (green);
   * a backup-only battery passes power from the house through as well, that
   * part has the house's colours (input up to its output, the rest from the cells).
   */
  _backupShares(t) {
    const e = this._layout?.batteries.find((a) => a.name === t);
    if (!e?.backup_only) return [0, 1, 0];
    const s = Math.max(this._w(e.charge) ?? 0, 0), n = Math.max(this._w(e.discharge) ?? 0, 0), o = n > 0 ? Math.min(s, n) / n : 0, i = this._houseShares();
    return [i[0] * o, i[1] * o + (1 - o), i[2] * o];
  }
  /** Shares of PV, batteries and grid in what the house net gets right now. */
  _houseShares() {
    const t = (this._layout?.batteries ?? []).filter((e) => !e.backup_only).reduce((e, s) => e + Math.max(0, -(E(this._s(s.power)) ?? 0)), 0);
    return nn(this._own("solar_power"), t, this._own("grid_power"));
  }
  /** Colours for a train's balls by source shares (PV, battery, grid); default: the house's mix. */
  _tints(t, e = this._houseShares()) {
    const s = [this._c.solar, this._c.battery, this._c.grid];
    return on(t, e).map((n) => s[n]);
  }
  /** A train whose balls show where the power comes from (PV, battery, grid). */
  _mixedTrain(t, e, s = !0) {
    if (e === null || Math.abs(e) < B) return _``;
    const { radii: n, begins: o, travel: i, period: a } = this._trainOf(t, e), r = this._tints(Bt(e));
    return _`${o.map((c, h) => this._ball(r[h], { route: t, forward: s, r: n[h], begin: c, travel: i, period: a }))}`;
  }
  _houseDots(t, e, s) {
    return this._mixedTrain(t, s);
  }
  get _wagonSpeed() {
    return Ot;
  }
  /** A battery's own line: from the blob in the storage box to the battery's cap. */
  _route(t, e) {
    return `M ${this._invBottom[0].toFixed(1)} ${Vt} V ${Vt + jt / 2} H ${t} V ${e}`;
  }
  _batteryRoute(t, e) {
    return this._route(t, e);
  }
  // Trains run into the glass boxes and new ones leave them: each PV string
  // into the middle of "PV gesamt", the house power from the inverter into
  // the middle of the house box, the load trains from there; backup trains
  // start at the bottom of their battery and leave through its shell.
  _stringRoute(t, e) {
    return `M ${t + ne / 2} ${e + ie / 2} V ${fe + 13} H ${vt[0]} V ${vt[1]}`;
  }
  _houseIn() {
    const [t, e] = this._invTop;
    return `M ${t} ${e} V ${It[1]}`;
  }
  _houseLead(t) {
    return `M ${It[0]} ${It[1]} H 281 V ${t} H 285`;
  }
  _batteryLead(t, e, s, n) {
    return `M ${t} ${e + Nt - 2} V ${n} H ${this._batteryOutX(t, s)}`;
  }
  /**
   * Bubbles of a discharging battery: each rises from the bottom to the cap
   * and arrives just when a ball of the outgoing train starts there, so it
   * looks as if the bubble drives on into the line.
   */
  _riseIntoLine(t, e, s, n, o) {
    const i = s + 3, { radii: a, begins: r, period: c } = this._trainOf(this._route(t, s), o);
    return _`${r.map((h, p) => {
      const g = a[p], d = Math.min(c * 0.8, (e - i) / Ot), m = (d / c).toFixed(4), f = `${c.toFixed(2)}s`, v = `${(h - d).toFixed(2)}s`;
      return _`<circle cx=${t} cy=${e} r=${g} fill=${n} stroke="#ffffff" stroke-opacity="0.75" stroke-width="0.5"
        opacity="0">
        <animate attributeName="cy" dur=${f} begin=${v} repeatCount="indefinite" values=${`${e};${i};${i}`}
          keyTimes=${`0;${m};1`} />
        <animate attributeName="r" dur=${f} begin=${v} repeatCount="indefinite"
          values=${`${g * 0.45};${g};${g}`} keyTimes=${`0;${m};1`} />
        <animate attributeName="opacity" dur=${f} begin=${v} repeatCount="indefinite" calcMode="discrete"
          values="0.9;0" keyTimes=${`0;${m}`} />
      </circle>`;
    })}`;
  }
  /**
   * A drop falls into the liquid each time a ball of the train arrives at the
   * battery, then a ripple spreads and two droplets jump. Uses the train's own
   * timing, so it stays in step with the arriving balls.
   */
  _splash(t, e, s, n, o, i, a) {
    const { travel: r, period: c, begins: h } = this._trainOf(this._route(t, a), i), p = this._tints(Bt(i));
    return _`${h.map((g, d) => this._splashOnce(t, e, s, n, p[d] ?? o, c, g + r))}`;
  }
  /** One drop with ripple, repeating every `period` s from `start` s on. */
  _splashOnce(t, e, s, n, o, i, a) {
    const c = Math.min(0.45, i * 0.35) / i, h = Math.min(0.97, c + 0.6 / i), p = c + (h - c) * 0.4, g = c + 1e-3, d = (x) => x.toFixed(3), m = `${i.toFixed(2)}s`, f = `${a.toFixed(2)}s`, v = (x, w, k, H = !1) => _`<animate attributeName=${x}
      dur=${m} begin=${f} repeatCount="indefinite" values=${w} keyTimes=${k}
      calcMode=${H ? "spline" : "linear"} keySplines=${H ? "0.55 0 1 0.6;0 0 1 1" : $} />`;
    return _`
      <ellipse cx=${t} cy=${e} rx="1.5" ry="2.1" fill=${o} stroke="#ffffff" stroke-opacity="0.7" stroke-width="0.4" opacity="0">
        ${v("cy", `${e + 1};${s - 1};${s - 1}`, `0;${d(c)};1`, !0)}
        ${v("opacity", "1;1;0;0", `0;${d(c)};${d(g)};1`)}
      </ellipse>
      <ellipse cx=${t} cy=${s} rx="1" ry="0.5" fill="none" stroke="#e9fff3" stroke-width="0.8" opacity="0">
        ${v("rx", `1;1;${d(n * 0.75)};${d(n * 0.75)}`, `0;${d(c)};${d(h)};1`)}
        ${v("ry", "0.5;0.5;2;2", `0;${d(c)};${d(h)};1`)}
        ${v("opacity", "0;0;0.9;0;0", `0;${d(c)};${d(g)};${d(h)};1`)}
      </ellipse>
      ${[-1, 1].map(
      (x) => _`<circle cx=${t + x * 3} cy=${s} r="0.9" fill=${o} stroke="#ffffff" stroke-opacity="0.6" stroke-width="0.3"
          opacity="0">
          ${v("cy", `${s};${s};${s - 6};${s};${s}`, `0;${d(c)};${d(p)};${d(h)};1`)}
          ${v("cx", `${t};${t};${t + x * 3};${t + x * 5};${t + x * 5}`, `0;${d(c)};${d(p)};${d(h)};1`)}
          ${v("opacity", "0;0;1;0;0", `0;${d(c)};${d(g)};${d(h)};1`)}
        </circle>`
    )}`;
  }
  /** 2.5D glass house: gable front, side wall, roof, chimney and warm windows. */
  _houseIcon(t) {
    const e = this._c.solar;
    return _`<g transform=${`translate(225 ${ge - 51}) scale(0.9)`}>
      <ellipse cx="28" cy="50" rx="30" ry="5" fill="url(#ef-shadow)" />
      <polygon points="4,28 14,18 42,6 32,16" fill=${t} fill-opacity="0.08" stroke=${W} stroke-opacity="0.3" stroke-width="0.7" />
      <polygon points="24,52 52,40 52,24 24,36" fill=${t} fill-opacity="0.12" stroke=${W} stroke-opacity="0.6" stroke-width="0.8" />
      <polygon points="24,52 52,40 52,24 24,36" fill="url(#ef-slab)" />
      <polygon points="4,44 24,52 24,36 14,18 4,28" fill=${t} fill-opacity="0.2" stroke=${W} stroke-opacity="0.75" stroke-width="0.9" />
      <polygon points="4,44 24,52 24,36 14,18 4,28" fill="url(#ef-slab)" />
      <polygon points="24,36 52,24 42,6 14,18" fill=${t} fill-opacity="0.28" stroke=${W} stroke-opacity="0.75" stroke-width="0.9" />
      <polygon points="24,36 52,24 42,6 14,18" fill="url(#ef-sheen)" />
      <polygon points="36.6,15 39.4,13.8 39.4,5.8 36.6,7" fill=${t} fill-opacity="0.35" stroke=${W} stroke-opacity="0.7" stroke-width="0.7" />
      <polygon points="28.2,43.2 35.2,40.2 35.2,32.2 28.2,35.2" fill=${e} fill-opacity="0.5" stroke=${e} stroke-opacity="0.8" stroke-width="0.6" />
      <polygon points="40.8,37.8 47.8,34.8 47.8,26.8 40.8,29.8" fill=${e} fill-opacity="0.5" stroke=${e} stroke-opacity="0.8" stroke-width="0.6" />
      <polygon points="12,47.2 17,49.2 17,37.2 12,35.2" fill=${t} fill-opacity="0.4" stroke=${W} stroke-opacity="0.7" stroke-width="0.6" />
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
  _grid() {
    const t = this._c.grid, e = this._invX, { grid: s, exporting: n, cents: o, label: i, power: a, imp: r, exp: c } = this._gridData(), [h, p] = re[re.length - 1], g = rs + h * ae, d = as + (p + 6) * ae, m = Wt[1][1], f = Math.max(d, m) + 12, v = `M ${g.toFixed(1)} ${d.toFixed(1)} Q ${((g + e) / 2).toFixed(1)} ${f.toFixed(1)} ${e} ${m}`, x = o !== null ? Ae(o, this._loc) : "", w = [
      { arrow: "↓", kwh: r, name: "Bez.", active: i === "Bezug" },
      { arrow: "↑", kwh: c, name: "Einsp.", active: i === "Einspeisung" }
    ].filter((z) => z.kwh !== null), k = cs, H = k + (o !== null ? 23 : 15), L = H - k + (w.length ? w.length * 8.5 + 3 : 0);
    return _`
      ${this._pylon(t)}
      ${this._flow(v, t, s, !n)}
      ${this._tap(this._layout.entities.grid_power, this._panel(ut, k, Ft, L, t))}
      <text x=${ut + Ft / 2} y=${k + 11} text-anchor="middle" class="val" font-size=${this._fs(11.5)} font-weight="600"
        >${a}</text>
      ${o !== null ? _`<text x=${ut + Ft / 2} y=${k + 19.5} text-anchor="middle" class="dim" style=${`font-size:${this._fs(8.5)}px`}>${x}</text>` : $}
      ${w.length ? _`<line x1=${ut + 3} x2=${ut + Ft - 3} y1=${H} y2=${H} class="sep" stroke=${t} />` : $}
      ${w.map(
      (z, T) => _`<text x=${ut + 3} y=${H + 8 + T * 8.5} class=${z.active ? "val" : "dim"} style=${`font-size:${this._fs(7.8)}px`}
          ><tspan fill=${z.active ? t : $}>${z.arrow}</tspan> ${F(z.kwh, this._loc)}<tspan
          class=${z.active ? "" : "tiny"} style=${`font-size:${this._fs(7.5)}px`} fill=${z.active ? t : $}> ${z.name}</tspan></text>`
    )}
      ${this._wallbox(this._carTop(k + L + 8))}
    `;
  }
  /** Top of the car picture: its plate ends flush with the lowest battery, but
   *  never higher than `min` (just below the grid tile). */
  _carTop(t) {
    const e = this._displayBatteries();
    if (!e.length) return t;
    const s = Math.max(...e.map((n) => n.top)) + Nt + 3.5;
    return Math.max(t, s - G.height * (ce / G.width));
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
    const s = e.flexible ? this._c.flexible : this._c.home, n = this._w(e.power), o = E(this._s(e.soc ?? void 0)), i = E(this._s(e.today ?? void 0)), a = n === null || Math.abs(n) < B, r = !a && (n ?? 0) > 0, c = ce / G.width, h = ([X, P]) => [le + X * c, t + P * c], p = o === null ? null : Math.max(0, Math.min(100, o)) / 100, g = (p ?? 0) * G.liquidHeight, [d, m, f, v] = G.floorQuad, x = ([X, P], tt) => `${X.toFixed(1)},${(P - tt).toFixed(1)}`, w = (X) => {
      const [P, tt, pt, He] = X.map((vs) => Math.max(0, g + vs));
      return {
        body: [x(d, 0), x(m, 0), x(f, 0), x(f, pt), x(v, He), x(d, P)].join(" "),
        surface: [x(d, P), x(m, tt), x(f, pt), x(v, He)].join(" "),
        edge: [x(d, P), x(m, tt), x(f, pt)].join(" ")
      };
    }, k = yi.map((X) => w(X)), H = r ? 3.4 : 5.5, L = (X) => _`<animate attributeName="points" dur=${`${H}s`}
      repeatCount="indefinite" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" keySplines=${ns}
      values=${[...k, k[0]].map((P) => P[X]).join(";")} />`, z = `ef-car-${Math.round(t)}`, T = `translate(${le} ${t}) scale(${c.toFixed(5)})`, Y = this._invX, V = Wt[2][1], [j, u] = h(G.wallboxTop), y = cs - 12, M = `M ${Y} ${V} H ${Y - 10} V ${y} H ${j.toFixed(1)} V ${u.toFixed(1)}`, [A, D] = h(G.powerText), [yt, q] = h(G.energyText), it = G.edgeAngle, [wt, te] = h([(m[0] + f[0]) / 2, (m[1] + f[1]) / 2 - Math.max(g / 2, 14)]);
    return _`
      ${this._flow(M, s, n, !0, !1)}
      ${this._mixedTrain(M, n)}
      <g class="tap" data-entity=${e.power}>
        <title>${e.name} · ${e.flexible ? "Zusatzverbraucher" : "Grundlast"}</title>
        <image href=${mi} x=${le} y=${t} width=${ce} height=${(G.height * c).toFixed(1)} />
        ${p ? _`<g transform=${T}>
              <clipPath id=${z}><polygon points=${G.tank} /></clipPath>
              <g clip-path=${`url(#${z})`} opacity="0.7">
                <polygon points=${k[0].body} fill="url(#ef-liquid)">${L("body")}</polygon>
                <polygon points=${k[0].surface} fill="#c8ffe0" fill-opacity="0.45">${L("surface")}</polygon>
                <polyline points=${k[0].edge} fill="none" stroke="#e9fff3" stroke-opacity="0.85" stroke-width="2.4"
                  stroke-linejoin="round">${L("edge")}</polyline>
              </g>
            </g>` : $}
        ${o !== null ? _`<text x=${wt.toFixed(1)} y=${te.toFixed(1)} text-anchor="middle" class="bt" font-size=${this._fs(9)}
              font-weight="600">${At(o, this._loc)}</text>` : $}
        <text transform=${`translate(${A.toFixed(1)} ${D.toFixed(1)}) rotate(${it})`} class=${a ? "dim" : "val"}
          style=${`font-size:${this._fs(11)}px`} font-weight="600">${C(n, this._loc)}</text>
        <text transform=${`translate(${yt.toFixed(1)} ${q.toFixed(1)}) rotate(${-it})`} class="dim"
          style=${`font-size:${this._fs(11)}px`}>${F(i, this._loc)}</text>
      </g>`;
  }
  /** Free-standing pylon of glass rods on a hexagonal glass plate. */
  _pylon(t) {
    const e = oe([...is, ...os, ...fi]), s = oe([...is, ...os], 7, -4), n = oe(gi), o = "65.5,84 48.5,92.7 14.5,92.7 -2.5,84 14.5,75.3 48.5,75.3";
    return _`<g transform=${`translate(${rs} ${as}) scale(${ae})`}>
      <ellipse cx="31.5" cy="97" rx="40" ry="7" fill="url(#ef-shadow)" />
      <polygon points=${"65.5,84 65.5,87 48.5,95.7 14.5,95.7 -2.5,87 -2.5,84 14.5,92.7 48.5,92.7"} fill=${t} fill-opacity="0.3" stroke=${W} stroke-opacity="0.4" stroke-width="0.6" />
      <polygon points=${o} fill=${t} fill-opacity="0.14" stroke=${W} stroke-opacity="0.65" stroke-width="0.8" />
      <polygon points=${o} fill="url(#ef-slab)" />
      <path d=${s} fill="none" stroke=${t} stroke-opacity="0.22" stroke-width="2.6" stroke-linecap="round" />
      <path d=${s} fill="none" stroke=${W} stroke-opacity="0.4" stroke-width="0.7" stroke-linecap="round" />
      <path d=${n} fill="none" stroke=${W} stroke-opacity="0.35" stroke-width="1.4" stroke-linecap="round" />
      <path d=${e} fill="none" stroke=${t} stroke-opacity="0.35" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" />
      <path d=${e} fill="none" stroke="#e6f6ff" stroke-opacity="0.9" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
      ${re.map(
      ([a, r]) => _`
          <path d=${`M ${a} ${r} V ${r + 6}`} stroke=${W} stroke-opacity="0.8" stroke-width="0.8" />
          <circle cx=${a} cy=${r + 2.5} r="1.4" fill=${t} /><circle cx=${a} cy=${r + 5} r="1.4" fill=${t} />
          <circle cx=${a} cy=${r + 3.7} r="0.6" fill="#ffffff" />`
    )}
      ${wi.map(([a, r]) => _`<circle cx=${a} cy=${r} r="1.3" fill="#ffffff" fill-opacity="0.85" />`)}
    </g>`;
  }
  // -- load groups -------------------------------------------------------------
  /** Each group sits on its own tinted glass slab. */
  // a small "Gesamt" box above all load groups: every consumer incl. backup loads
  get _groupsTop() {
    return 22 + kt + ls;
  }
  _listsHeader(t) {
    const e = N - 12, s = 4, n = this._c.home, o = E(this._s(this._layout?.home_today));
    return this._tap(this._layout?.entities.home_power, _`
      ${this._panel(e, s, K + 3 - e, kt, n)}
      <text x=${N - 6} y=${s + kt * 0.68} class="small grp" fill=${n}>Gesamt</text>
      <text x=${nt - 1} y=${s + kt * 0.68} text-anchor="end" class="val" style=${`font-size:${this._fs(10)}px`}
        font-weight="600">${C(t, this._loc)}</text>
      <text x=${K - 1} y=${s + kt * 0.68} text-anchor="end" class="dim" style=${`font-size:${this._fs(9)}px`}
        >${F(o, this._loc)}</text>`);
  }
  _groupPanel(t) {
    const e = N - 12, s = t.titleY - 13, n = t.y0 + t.rows * this._rowH + 3;
    return this._panel(e, s, K + 3 - e, n - s, t.colour);
  }
  _groupIcon() {
    return _``;
  }
  _groupTitle(t, e, s, n, o) {
    const i = o.reduce((a, r) => {
      const c = E(this._s(r.today));
      return c === null ? a : (a ?? 0) + c;
    }, null);
    return _`
      <text x=${N - 6} y=${t} class="small grp" fill=${e}>${s}</text>
      <text x=${nt - 1} y=${t} text-anchor="end" class="small" style=${`font-size:${this._fs(8)}px`} fill=${e}>${C(n, this._loc)}</text>
      <text x=${K - 1} y=${t} text-anchor="end" class="small" style=${`font-size:${this._fs(8)}px`} fill=${e}>${F(i, this._loc)}</text>`;
  }
  /** Line icon chosen from the name, then the name (wrapped if long). */
  _nameBox(t, e, s, n = t, o = 0) {
    const i = this._rowH, a = 9, r = N + o, c = r + a + 3, h = nt - Q - 2 - c, { lines: p, small: g } = de(t, Math.floor(h / 5.2), Math.floor(h / 4.2));
    return _`<g>
      <title>${n}</title>
      ${this._line(oi(t), r, e + (i - a) / 2, a, s)}
      ${g ? _`<text x=${c} y=${e + i / 2 - 1.5} class="name" font-size=${this._fs(7.5)}>${p[0]}</text>
              <text x=${c} y=${e + i / 2 + 5.5} class="name" font-size=${this._fs(7.5)}>${p[1] ?? ""}</text>` : _`<text x=${c} y=${e + i / 2 + 3} class="name" font-size=${this._fs(9.5)}>${p[0]}</text>`}
    </g>`;
  }
  /** Plain right-aligned numbers: the group slab is the glass. */
  _valueCell(t, e, s, n, o, i, a, r) {
    return _`<text x=${t + s - 1} y=${e + n / 2 + a * 0.36} text-anchor="end" class=${r === "power" ? "val" : "dim"}
      font-size=${this._fs(a + 0.5)}>${i}</text>`;
  }
};
ze.styles = [
  J.styles,
  qt`
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
let ye = ze;
customElements.get("energiefluss-glass-card") || customElements.define("energiefluss-glass-card", ye);
window.customCards = window.customCards ?? [];
window.customCards.some((l) => l.type === "energiefluss-glass-card") || window.customCards.push({
  type: "energiefluss-glass-card",
  name: "Wattrio Energiefluss Glas",
  description: "Wattrio: Energiefluss im 2.5D-Glas-Look mit Glasrohren und leuchtenden Kugelzügen – gleiche Daten wie Wattrio Klassik.",
  preview: !0
});
export {
  $ as A,
  qt as a,
  b,
  lt as i,
  mt as n,
  O as r
};
