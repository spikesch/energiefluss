/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Yt = globalThis, be = Yt.ShadowRoot && (Yt.ShadyCSS === void 0 || Yt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, we = Symbol(), Ce = /* @__PURE__ */ new WeakMap();
let hs = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== we) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (be && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = Ce.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && Ce.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ms = (l) => new hs(typeof l == "string" ? l : l + "", void 0, we), Qt = (l, ...t) => {
  const e = l.length === 1 ? l[0] : t.reduce((s, n, o) => s + ((i) => {
    if (i._$cssResult$ === !0) return i.cssText;
    if (typeof i == "number") return i;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + i + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + l[o + 1], l[0]);
  return new hs(e, l, we);
}, As = (l, t) => {
  if (be) l.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), n = Yt.litNonce;
    n !== void 0 && s.setAttribute("nonce", n), s.textContent = e.cssText, l.appendChild(s);
  }
}, Pe = be ? (l) => l : (l) => l instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return Ms(e);
})(l) : l;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ss, defineProperty: Ls, getOwnPropertyDescriptor: Es, getOwnPropertyNames: zs, getOwnPropertySymbols: Hs, getPrototypeOf: Cs } = Object, te = globalThis, Be = te.trustedTypes, Ps = Be ? Be.emptyScript : "", Bs = te.reactiveElementPolyfillSupport, Mt = (l, t) => l, Xt = { toAttribute(l, t) {
  switch (t) {
    case Boolean:
      l = l ? Ps : null;
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
} }, xe = (l, t) => !Ss(l, t), Te = { attribute: !0, type: String, converter: Xt, reflect: !1, useDefault: !1, hasChanged: xe };
Symbol.metadata ??= Symbol("metadata"), te.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
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
    const { get: n, set: o } = Es(this.prototype, t) ?? { get() {
      return this[e];
    }, set(i) {
      this[e] = i;
    } };
    return { get: n, set(i) {
      const c = n?.call(this);
      o?.call(this, i), this.requestUpdate(t, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Te;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Mt("elementProperties"))) return;
    const t = Cs(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Mt("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Mt("properties"))) {
      const e = this.properties, s = [...zs(e), ...Hs(e)];
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
    return As(t, this.constructor.elementStyles), t;
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
      const o = (s.converter?.toAttribute !== void 0 ? s.converter : Xt).toAttribute(e, s.type);
      this._$Em = t, o == null ? this.removeAttribute(n) : this.setAttribute(n, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, n = s._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const o = s.getPropertyOptions(n), i = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : Xt;
      this._$Em = n;
      const c = i.fromAttribute(e, o.type);
      this[n] = c ?? this._$Ej?.get(n) ?? c, this._$Em = null;
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
        const { wrapped: i } = o, c = this[n];
        i !== !0 || this._$AL.has(n) || c === void 0 || this.C(n, void 0, o, c);
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
_t.elementStyles = [], _t.shadowRootOptions = { mode: "open" }, _t[Mt("elementProperties")] = /* @__PURE__ */ new Map(), _t[Mt("finalized")] = /* @__PURE__ */ new Map(), Bs?.({ ReactiveElement: _t }), (te.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ve = globalThis, Oe = (l) => l, qt = ve.trustedTypes, Ne = qt ? qt.createPolicy("lit-html", { createHTML: (l) => l }) : void 0, ds = "$lit$", st = `lit$${Math.random().toFixed(9).slice(2)}$`, ps = "?" + st, Ts = `<${ps}>`, ht = document, Lt = () => ht.createComment(""), Et = (l) => l === null || typeof l != "object" && typeof l != "function", ke = Array.isArray, Os = (l) => ke(l) || typeof l?.[Symbol.iterator] == "function", ie = `[ 	
\f\r]`, wt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ie = /-->/g, Re = />/g, ot = RegExp(`>|${ie}(?:([^\\s"'>=/]+)(${ie}*=${ie}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Fe = /'/g, Ve = /"/g, us = /^(?:script|style|textarea|title)$/i, _s = (l) => (t, ...e) => ({ _$litType$: l, strings: t, values: e }), y = _s(1), _ = _s(2), gt = Symbol.for("lit-noChange"), $ = Symbol.for("lit-nothing"), We = /* @__PURE__ */ new WeakMap(), at = ht.createTreeWalker(ht, 129);
function fs(l, t) {
  if (!ke(l) || !l.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ne !== void 0 ? Ne.createHTML(t) : t;
}
const Ns = (l, t) => {
  const e = l.length - 1, s = [];
  let n, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", i = wt;
  for (let c = 0; c < e; c++) {
    const r = l[c];
    let a, h, d = -1, g = 0;
    for (; g < r.length && (i.lastIndex = g, h = i.exec(r), h !== null); ) g = i.lastIndex, i === wt ? h[1] === "!--" ? i = Ie : h[1] !== void 0 ? i = Re : h[2] !== void 0 ? (us.test(h[2]) && (n = RegExp("</" + h[2], "g")), i = ot) : h[3] !== void 0 && (i = ot) : i === ot ? h[0] === ">" ? (i = n ?? wt, d = -1) : h[1] === void 0 ? d = -2 : (d = i.lastIndex - h[2].length, a = h[1], i = h[3] === void 0 ? ot : h[3] === '"' ? Ve : Fe) : i === Ve || i === Fe ? i = ot : i === Ie || i === Re ? i = wt : (i = ot, n = void 0);
    const p = i === ot && l[c + 1].startsWith("/>") ? " " : "";
    o += i === wt ? r + Ts : d >= 0 ? (s.push(a), r.slice(0, d) + ds + r.slice(d) + st + p) : r + st + (d === -2 ? c : p);
  }
  return [fs(l, o + (l[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class zt {
  constructor({ strings: t, _$litType$: e }, s) {
    let n;
    this.parts = [];
    let o = 0, i = 0;
    const c = t.length - 1, r = this.parts, [a, h] = Ns(t, e);
    if (this.el = zt.createElement(a, s), at.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (n = at.nextNode()) !== null && r.length < c; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const d of n.getAttributeNames()) if (d.endsWith(ds)) {
          const g = h[i++], p = n.getAttribute(d).split(st), m = /([.?@])?(.*)/.exec(g);
          r.push({ type: 1, index: o, name: m[2], strings: p, ctor: m[1] === "." ? Rs : m[1] === "?" ? Fs : m[1] === "@" ? Vs : ee }), n.removeAttribute(d);
        } else d.startsWith(st) && (r.push({ type: 6, index: o }), n.removeAttribute(d));
        if (us.test(n.tagName)) {
          const d = n.textContent.split(st), g = d.length - 1;
          if (g > 0) {
            n.textContent = qt ? qt.emptyScript : "";
            for (let p = 0; p < g; p++) n.append(d[p], Lt()), at.nextNode(), r.push({ type: 2, index: ++o });
            n.append(d[g], Lt());
          }
        }
      } else if (n.nodeType === 8) if (n.data === ps) r.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = n.data.indexOf(st, d + 1)) !== -1; ) r.push({ type: 7, index: o }), d += st.length - 1;
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
class Is {
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
    let o = at.nextNode(), i = 0, c = 0, r = s[0];
    for (; r !== void 0; ) {
      if (i === r.index) {
        let a;
        r.type === 2 ? a = new Ct(o, o.nextSibling, this, t) : r.type === 1 ? a = new r.ctor(o, r.name, r.strings, this, t) : r.type === 6 && (a = new Ws(o, this, t)), this._$AV.push(a), r = s[++c];
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
class Ct {
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
    t = $t(this, t, e), Et(t) ? t === $ || t == null || t === "" ? (this._$AH !== $ && this._$AR(), this._$AH = $) : t !== this._$AH && t !== gt && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Os(t) ? this.k(t) : this._(t);
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
      const o = new Is(n, this), i = o.u(this.options);
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
    for (const o of t) n === e.length ? e.push(s = new Ct(this.O(Lt()), this.O(Lt()), this, this.options)) : s = e[n], s._$AI(o), n++;
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
class ee {
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
      const c = t;
      let r, a;
      for (t = o[0], r = 0; r < o.length - 1; r++) a = $t(this, c[s + r], e, r), a === gt && (a = this._$AH[r]), i ||= !Et(a) || a !== this._$AH[r], a === $ ? t = $ : t !== $ && (t += (a ?? "") + o[r + 1]), this._$AH[r] = a;
    }
    i && !n && this.j(t);
  }
  j(t) {
    t === $ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Rs extends ee {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === $ ? void 0 : t;
  }
}
class Fs extends ee {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== $);
  }
}
class Vs extends ee {
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
class Ws {
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
const Us = ve.litHtmlPolyfillSupport;
Us?.(zt, Ct), (ve.litHtmlVersions ??= []).push("3.3.3");
const js = (l, t, e) => {
  const s = e?.renderBefore ?? t;
  let n = s._$litPart$;
  if (n === void 0) {
    const o = e?.renderBefore ?? null;
    s._$litPart$ = n = new Ct(t.insertBefore(Lt(), o), o, void 0, e ?? {});
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = js(e, this.renderRoot, this.renderOptions);
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
const Ds = Me.litElementPolyfillSupport;
Ds?.({ LitElement: lt });
(Me.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ys = { attribute: !0, type: String, converter: Xt, reflect: !1, hasChanged: xe }, Gs = (l = Ys, t, e) => {
  const { kind: s, metadata: n } = e;
  let o = globalThis.litPropertyMetadata.get(n);
  if (o === void 0 && globalThis.litPropertyMetadata.set(n, o = /* @__PURE__ */ new Map()), s === "setter" && ((l = Object.create(l)).wrapped = !0), o.set(e.name, l), s === "accessor") {
    const { name: i } = e;
    return { set(c) {
      const r = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(i, r, l, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(i, void 0, l, c), c;
    } };
  }
  if (s === "setter") {
    const { name: i } = e;
    return function(c) {
      const r = this[i];
      t.call(this, c), this.requestUpdate(i, r, l, !0, c);
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
function H(l) {
  return mt({ ...l, state: !0, attribute: !1 });
}
const Xs = { W: 1, kW: 1e3, MW: 1e6, mW: 1e-3 }, qs = { Wh: 1e-3, kWh: 1, MWh: 1e3 };
function E(l) {
  if (!l) return null;
  const t = parseFloat(l.state);
  return Number.isFinite(t) ? t : null;
}
function q(l) {
  const t = E(l);
  if (t === null) return null;
  const e = l.attributes.unit_of_measurement ?? "W";
  return t * (Xs[e] ?? 1);
}
function Bt(l) {
  const t = E(l);
  if (t === null) return null;
  const e = l.attributes.unit_of_measurement ?? "kWh";
  return t * (qs[e] ?? 1);
}
function P(l, t = "de") {
  return l === null ? "–" : Math.abs(l) < 1e3 ? `${Math.round(l).toLocaleString(t)} W` : `${(l / 1e3).toLocaleString(t, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kW`;
}
function W(l, t = "de") {
  return l === null ? "–" : `${l.toLocaleString(t, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kWh`;
}
function At(l, t = "de") {
  return l === null ? "–" : `${Math.round(l).toLocaleString(t)} %`;
}
function Zs(l, t) {
  return +(6 - 5 * Math.min(Math.abs(l) / Math.max(t, 1), 1)).toFixed(2);
}
function Ks(l, t) {
  return l === null ? 1 : +(1 + 3 * Math.min(Math.abs(l) / Math.max(t, 1), 1)).toFixed(2);
}
function St(l, t = 9) {
  return l.length > t ? l.slice(0, t - 1) + "…" : l;
}
function de(l) {
  const t = E(l);
  if (t === null) return null;
  const e = String(l.attributes.unit_of_measurement ?? "").toLowerCase();
  return e.includes("ct") || e.includes("cent") ? t : t * 100;
}
function Ae(l, t = "de") {
  return l === null ? "" : `${l.toLocaleString(t, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ct/kWh`;
}
const Js = ["W", "kW", "MW", "mW"];
function Ue(l) {
  if (!l) return "Sensor nicht gefunden";
  const t = l.attributes.unit_of_measurement;
  return t && !Js.includes(t) ? `Einheit „${t}“ ist keine Leistung (W/kW)` : null;
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
const Qs = 44, tn = 290;
function en(l) {
  if (l <= 0) return [];
  const t = [[230], [195, 275], [160, 228, 296], [140, 192, 244, 296], [136, 184, 232, 280, 328]][Math.min(l, 5) - 1], e = l <= 3 ? 54 : l === 4 ? 46 : 44;
  return t.map((s, n) => {
    const o = t.length - 1 - n;
    return { cx: s, top: tn + (o % 2 === 1 ? Qs : 0), w: e };
  });
}
function pe(l, t = 15, e = 19) {
  const s = l.trim();
  if (s.length <= t) return { lines: [s], small: !1 };
  const n = (r) => r.length > e ? r.slice(0, e - 1) + "…" : r, o = [...s.matchAll(/ /g)].map((r) => r.index), i = o.filter((r) => r <= e && s.length - r - 1 <= e), c = i.length ? i : o.filter((r) => r <= e);
  if (c.length) {
    const r = s.length / 2, a = c.reduce((h, d) => Math.abs(d - r) < Math.abs(h - r) ? d : h);
    return { lines: [s.slice(0, a), n(s.slice(a + 1))], small: !0 };
  }
  return { lines: [s.slice(0, e), n(s.slice(e))], small: !0 };
}
const sn = 4 / 3;
function nn(l, t) {
  const e = Math.min(Math.abs(l) / Math.max(t, 1), 1);
  return +((1.6 + 3.4 * Math.sqrt(e)) * sn).toFixed(2);
}
function ue(l) {
  const t = l.trim().split(/[\s,]+/);
  let e = 0, s = 0, n = 0;
  const o = (i) => {
    const c = (h) => {
      let d = i.map((g) => [...g]);
      for (; d.length > 1; ) d = d.slice(1).map((g, p) => [d[p][0] + (g[0] - d[p][0]) * h, d[p][1] + (g[1] - d[p][1]) * h]);
      return d[0];
    };
    let [r, a] = i[0];
    for (let h = 1; h <= 24; h++) {
      const [d, g] = c(h / 24);
      n += Math.hypot(d - r, g - a), [r, a] = [d, g];
    }
  };
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (c === "M")
      e = +t[++i], s = +t[++i];
    else if (c === "H") {
      const r = +t[++i];
      n += Math.abs(r - e), e = r;
    } else if (c === "V") {
      const r = +t[++i];
      n += Math.abs(r - s), s = r;
    } else if (c === "L") {
      const r = +t[++i], a = +t[++i];
      n += Math.hypot(r - e, a - s), [e, s] = [r, a];
    } else if (c === "Q" || c === "C") {
      const r = c === "Q" ? 2 : 3, a = [[e, s]];
      for (let h = 0; h < r; h++) a.push([+t[++i], +t[++i]]);
      o(a), [e, s] = a[r];
    }
  }
  return n;
}
function Tt(l, t = 10) {
  const e = Math.floor(Math.abs(l) + 1e-9), s = Math.floor(e / 1e3), n = Math.floor(e % 1e3 / 100), o = Math.floor(e % 100 / 10);
  return [
    ...Array(Math.min(s, t)).fill("big"),
    ...Array(n).fill("medium"),
    ...Array(o).fill("small")
  ];
}
function on(l, t, e) {
  const s = [l, t, e].map((o) => Math.max(0, o ?? 0)), n = s.reduce((o, i) => o + i, 0);
  return n > 0 ? s.map((o) => o / n) : [1, 0, 0];
}
function rn(l, t) {
  const e = (n) => {
    const o = t.map((a) => a * n), i = o.map(Math.floor), c = o.map((a, h) => [a - Math.floor(a), h]).sort((a, h) => h[0] - a[0] || a[1] - h[1]), r = n - i.reduce((a, h) => a + h, 0);
    for (let a = 0; a < r; a++) i[c[a][1]]++;
    return i.flatMap((a, h) => Array(a).fill(h));
  }, s = new Map(["big", "medium", "small"].map((n) => [n, e(l.filter((o) => o === n).length)]));
  return l.map((n) => s.get(n).shift());
}
var an = Object.defineProperty, N = (l, t, e, s) => {
  for (var n = void 0, o = l.length - 1, i; o >= 0; o--)
    (i = l[o]) && (n = i(t, e, n) || n);
  return n && an(t, e, n), n;
};
const Ot = 5, Ye = 2, Ge = ["battery", "solar", "tariff", "wallbox"], gs = ["grid", "battery", "solar", "tariff", "wallbox", "loads"];
function Mi(l) {
  const t = l.checked ?? [], e = (n) => {
    const o = l[n];
    return Array.isArray(o) ? o.length > 0 : !!o;
  }, s = {
    battery: e("batteries"),
    solar: e("solar_strings"),
    tariff: e("grid_price"),
    wallbox: e("wallbox_power")
  };
  return gs.some((n) => !t.includes(n) && (!(n in s) || s[n] || (l.topics ?? []).includes(n)));
}
const F = { entity: { domain: "sensor" } }, Ht = { entity: { domain: "sensor", multiple: !0, reorder: !0 } }, ln = [
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
], cn = [
  { name: "solar_strings", selector: Ht },
  { name: "solar_today", selector: F },
  { name: "solar_forecast_remaining", selector: F }
], $s = (l) => ({
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
function hn(l, t = !0) {
  const e = l.mode === "split" ? [
    { name: "charge_power", selector: F },
    { name: "discharge_power", selector: F }
  ] : [
    { name: "power", selector: F },
    { name: "invert", selector: { boolean: {} } }
  ];
  return [
    { name: "name", selector: { text: {} } },
    $s("mode"),
    ...e,
    { name: "soc", selector: F },
    { name: "capacity_kwh", selector: { number: { min: 0, max: 200, step: 0.1, mode: "box", unit_of_measurement: "kWh" } } },
    ...t ? [{ name: "backup_loads", selector: Ht }] : [],
    ...t && l.mode === "split" ? [{ name: "backup_only", selector: { boolean: {} } }] : []
  ];
}
function dn(l) {
  const t = l.grid_mode === "split" ? [
    { name: "grid_import_power", selector: F },
    { name: "grid_export_power", selector: F }
  ] : [
    { name: "grid_power", selector: F },
    { name: "grid_invert", selector: { boolean: {} } }
  ];
  return [$s("grid_mode"), ...t, ..._n];
}
const pn = [
  "grid_mode",
  "grid_power",
  "grid_invert",
  "grid_import_power",
  "grid_export_power",
  "grid_export_price_fixed",
  "grid_export_price",
  "grid_import_today",
  "grid_export_today"
], un = [{ name: "grid_price", selector: F }], _n = [
  {
    name: "grid_export_price_fixed",
    selector: { number: { min: 0, max: 100, step: 0.01, mode: "box", unit_of_measurement: "ct/kWh" } }
  },
  { name: "grid_export_price", selector: F },
  { name: "grid_import_today", selector: F },
  { name: "grid_export_today", selector: F }
], fn = [
  { name: "fixed_loads", selector: Ht },
  { name: "flexible_loads", selector: Ht },
  { name: "home_power", selector: F }
], gn = [
  { name: "wallbox_name", selector: { text: {} } },
  { name: "wallbox_power", selector: F },
  { name: "wallbox_flexible", selector: { boolean: {} } },
  { name: "wallbox_soc", selector: F }
], $n = {
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
}, mn = {
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
async function ms() {
  if (customElements.get("ha-form") && customElements.get("ha-entity-picker")) return;
  const l = await window.loadCardHelpers();
  for (const t of ["tile", "entities"])
    await (await l.createCardElement({ type: t, entity: "sun.sun", entities: [] })).constructor.getConfigElement?.();
}
const oe = (l) => JSON.parse(JSON.stringify(l ?? {}));
function yn(l) {
  const t = l;
  return t === 3 || typeof t == "object" && t?.code === 3 ? "Verbindung zu Home Assistant unterbrochen – bitte erneut speichern." : typeof t == "object" && t && typeof t.message == "string" ? t.message : typeof l == "string" ? l : "Speichern fehlgeschlagen – bitte erneut versuchen.";
}
const Zt = "energiefluss-updated", Se = class Se extends lt {
  constructor() {
    super(...arguments), this.compact = !1, this._ready = !1, this._title = "", this._draft = {}, this._saved = "", this._saving = !1, this._computed = [], this._detecting = !1, this._look = "glass", this._open = /* @__PURE__ */ new Set(), this._choice = {}, this._detectIn = /* @__PURE__ */ new Set(), this._backupYes = /* @__PURE__ */ new Set();
  }
  async firstUpdated() {
    await ms(), this._ready = !0;
  }
  updated(t) {
    (t.has("entryId") || t.has("hass")) && this.hass && this.entryId && this._loadedFor !== this.entryId && (this._loadedFor = this.entryId, this._load());
  }
  async _load() {
    const t = await this.hass.callWS({
      type: "energiefluss/get_options",
      entry_id: this.entryId
    });
    this._computed = t.computed ?? [], this._title = t.title, this._look = t.options.look === "classic" ? "classic" : "glass", this._draft = oe(t.options), this._saved = this._snapshot(), this._message = void 0;
    const e = this._nextOpen();
    this._open = new Set(e ? [e] : []);
  }
  /** The first section of the guide that is switched on and not yet ticked off. */
  _nextOpen() {
    const t = this._draft.checked ?? [];
    return gs.find((e) => this._isOn(e) && !t.includes(e));
  }
  /** Save, tick the section off, close it and open the next one. */
  async _saveSection(t) {
    const e = [.../* @__PURE__ */ new Set([...this._draft.checked ?? [], t])];
    if (this._draft = { ...this._draft, checked: e }, await this.save(), this._message?.kind !== "ok") return;
    const s = this._nextOpen();
    this._open = new Set(s ? [s] : []), this._message = { kind: "ok", text: s ? "Gespeichert – weiter mit dem nächsten Abschnitt." : "Gespeichert – alles eingerichtet." };
  }
  async _setLook(t) {
    !this.hass || !this.entryId || (await this.hass.callWS({ type: "energiefluss/set_look", entry_id: this.entryId, look: t }), this._look = t, await new Promise((e) => setTimeout(e, 1200)), window.dispatchEvent(new CustomEvent(Zt, { detail: { entry_id: this.entryId } })));
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
  async _detect(t) {
    if (this.hass && (this._detectIn = /* @__PURE__ */ new Set([...this._detectIn, t]), !this._suggestions)) {
      this._detecting = !0;
      try {
        this._suggestions = await this.hass.callWS({ type: "energiefluss/suggest" });
      } finally {
        this._detecting = !1;
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
      const n = [...this._draft.batteries ?? []], { backup_loads: o, backup_only: i, ...c } = n[t];
      n[t] = c, this._draft = { ...this._draft, batteries: n };
    }
  }
  _backupPart(t, e) {
    const s = this._draft.batteries ?? [], n = this._backupOn(t, e), o = s.filter((r, a) => a !== e && this._backupOn(r, a)).length, i = !n && o >= Ye, c = [
      { name: "backup_loads", selector: Ht },
      ...t.mode === "split" ? [{ name: "backup_only", selector: { boolean: {} } }] : []
    ];
    return y`<div class="backup">
      <div class="head">
        <span class="bq">Hat diese Batterie Notstrom-Steckdosen?</span>
        <div class="yesno" role="group" aria-label="Notstrom-Steckdosen">
          <button class=${n ? "on" : ""} ?disabled=${i} @click=${() => this._setBackup(e, !0)}>Ja</button>
          <button class=${n ? "" : "on"} @click=${() => this._setBackup(e, !1)}>Nein</button>
        </div>
      </div>
      ${i ? y`<p class="hint">Höchstens ${Ye} Batterien mit Notstrom.</p>` : $}
      ${n ? this._form(
      c,
      { mode: "combined", ...t },
      (r) => this._onBattery(e, r),
      { backup_loads: "Welche Geräte hängen dran?" },
      {
        backup_loads: "Leistungs-Sensoren der Geräte an den Notstrom-Steckdosen dieser Batterie.",
        backup_only: "Für Geräte wie EcoFlow, die nicht ins Haus einspeisen können: Ladeleistung = Eingang aus dem Haus, Entladeleistung = Ausgang an die Notstrom-Geräte."
      }
    ) : $}
    </div>`;
  }
  // -- sections: open / closed and "Ja / Nein" -----------------------------------------
  _has(t) {
    const e = this._draft, s = e.batteries ?? [];
    switch (t) {
      case "solar":
        return !!((e.solar_strings ?? []).length || e.solar_today || e.solar_forecast_remaining);
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
    return Ge.includes(t) ? this._choice[t] ?? (this._has(t) || (this._draft.topics ?? []).includes(t)) : !0;
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
    const e = { ...this._draft }, s = (...n) => n.forEach((o) => delete e[o]);
    t === "solar" && s("solar_strings", "solar_today", "solar_forecast_remaining"), t === "battery" && s("batteries"), t === "wallbox" && s("wallbox_name", "wallbox_power", "wallbox_soc", "wallbox_flexible"), t === "tariff" && s("grid_price"), this._draft = e;
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
    this._hasBattery(t) || (this._draft.batteries ?? []).length >= Ot || (this._draft = { ...this._draft, batteries: [...this._draft.batteries ?? [], { ...t }] });
  }
  _applyLoad(t, e) {
    const s = [...this._draft[e] ?? []];
    s.includes(t) || s.push(t), this._draft = { ...this._draft, [e]: s };
  }
  _addBattery() {
    const t = [...this._draft.batteries ?? []];
    t.length >= Ot || (t.push({ mode: "combined" }), this._draft = { ...this._draft, batteries: t });
  }
  _removeBattery(t) {
    this._backupYes = new Set([...this._backupYes].filter((s) => s !== t).map((s) => s > t ? s - 1 : s));
    const e = [...this._draft.batteries ?? []];
    e.splice(t, 1), this._draft = { ...this._draft, batteries: e };
  }
  /** Drop values that belong to the mode not selected (kept while editing). */
  _cleaned() {
    const t = oe(this._draft);
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
        this._title = t.title, this._draft = oe(t.options), this._saved = this._snapshot(), await new Promise((s) => setTimeout(s, 1200)), window.dispatchEvent(new CustomEvent(Zt, { detail: { entry_id: this.entryId } }));
        const e = await this.hass.callWS({
          type: "energiefluss/get_options",
          entry_id: this.entryId
        });
        this._computed = e.computed ?? [], this._message = { kind: "ok", text: "Anlage gespeichert." };
      } catch (t) {
        this._message = { kind: "error", text: yn(t) };
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
    return y`<div class="row">
        <span>${t}</span>
        <span>${P(q(n), this._loc)}${s ? y` → <b>${s}</b>` : $}</span>
      </div>
      ${o ? y`<div class="warn">⚠ ${o}</div>` : $}`;
  }
  _solarLive() {
    const t = this._draft.solar_strings ?? [];
    if (!t.length)
      return y`<div class="live">
        ${this._calcNote(
        this._computed.includes("solar") ? "PV-Leistung wird aus der Energiebilanz berechnet." : "Ohne PV-Sensor: wird berechnet, wenn Netz und Hausverbrauch gemessen werden."
      )}
      </div>`;
    const e = t.reduce((s, n) => s + (q(this._s(n)) ?? 0), 0);
    return y`<div class="live">
      ${t.map((s) => this._powerLine(this._name(s), s))}
      <div class="row total"><span>Summe</span><span>${P(e, this._loc)}</span></div>
      ${this._draft.solar_today ? $ : this._calcNote("PV-Ertrag heute zählt die Integration selbst.")}
    </div>`;
  }
  _calcNote(t) {
    return y`<div class="calc">≈ ${t}</div>`;
  }
  _batteryLive(t, e) {
    const s = t.mode === "split", n = s ? !!(t.charge_power || t.discharge_power) : !!t.power, o = E(this._s(t.soc));
    let i = $;
    if (s && n) {
      const r = q(this._s(t.charge_power)), a = q(this._s(t.discharge_power)), h = r === null && a === null ? null : Math.abs(r ?? 0) - Math.abs(a ?? 0);
      i = y`${this._powerLine("Laden", t.charge_power)}${this._powerLine("Entladen", t.discharge_power)}
        <div class="row total"><span>Ergebnis</span>
          <span>${P(h === null ? null : Math.abs(h), this._loc)} → <b>${je(h, !1)}</b></span>
        </div>`;
    } else n && (i = this._powerLine("Leistung", t.power, je(q(this._s(t.power)), !!t.invert)));
    const c = this._computed.includes(`battery_${e + 1}`);
    return !n && !t.soc && !(t.backup_loads ?? []).length ? $ : y`<div class="live">
      ${i}
      ${n ? $ : this._calcNote(
      c ? "Leistung wird aus der Energiebilanz berechnet." : "Ohne Leistungssensor: wird nur berechnet, wenn der Hausverbrauch gemessen wird und dies die einzige Batterie ohne Sensor ist."
    )}
      ${t.soc ? y`<div class="row"><span>Ladestand</span><span>${o === null ? "–" : `${Math.round(o)} %`}</span></div>` : $}
      ${(t.backup_loads ?? []).length ? y`<div class="row">
            <span>Notstrom-Abgang: ${t.backup_loads.length} Geräte</span>
            <span>${P(t.backup_loads.reduce((r, a) => r + (q(this._s(a)) ?? 0), 0), this._loc)}</span>
          </div>` : $}
    </div>`;
  }
  _gridLive() {
    const t = this._draft, e = t.grid_mode === "split", s = e ? !!(t.grid_import_power || t.grid_export_power) : !!t.grid_power;
    let n = $;
    if (e && s) {
      const c = q(this._s(t.grid_import_power)), r = q(this._s(t.grid_export_power)), a = c === null && r === null ? null : Math.abs(c ?? 0) - Math.abs(r ?? 0);
      n = y`${this._powerLine("Bezug", t.grid_import_power)}${this._powerLine("Einspeisung", t.grid_export_power)}
        <div class="row total"><span>Ergebnis</span>
          <span>${P(a === null ? null : Math.abs(a), this._loc)} → <b>${De(a, !1)}</b></span>
        </div>`;
    } else s && (n = this._powerLine("Netz", t.grid_power, De(q(this._s(t.grid_power)), !!t.grid_invert)));
    let o = $;
    s || (o = this._calcNote(
      t.home_power ? "Netzleistung wird aus der Energiebilanz berechnet (gemessener Hausverbrauch)." : "Ohne Netzsensor fehlt ein Wert der Bilanz – bitte Netzsensor wählen oder Hausverbrauch messen."
    ));
    const i = !t.grid_import_today || !t.grid_export_today ? this._calcNote("Fehlende Tageswerte für Bezug/Einspeisung zählt die Integration selbst.") : $;
    return y`<div class="live">
      ${n}${o}
      ${t.grid_price ? y`<div class="row">
            <span>Preis Bezug</span><span>${Ae(de(this._s(t.grid_price)), this._loc) || "–"}</span>
          </div>` : $}
      ${i}
    </div>`;
  }
  _wallboxLive() {
    const t = this._draft;
    if (!t.wallbox_power) return $;
    const e = E(this._s(t.wallbox_soc));
    return y`<div class="live">
      ${this._powerLine("Wallbox", t.wallbox_power, t.wallbox_flexible ?? !0 ? "Zusatzverbraucher" : "Grundlast")}
      ${t.wallbox_soc ? y`<div class="row"><span>Auto</span><span>${e === null ? "–" : `${Math.round(e)} %`}</span></div>` : $}
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
    const t = this._linkableLoads(), e = Object.entries(this._draft.load_parents ?? {}), s = (i, c, r) => {
      const a = [...e];
      a[i] = [c, r], this._setParents(a);
    }, n = () => {
      const i = new Set(e.flatMap(([a, h]) => [a, h])), c = t.find((a) => !i.has(a)) ?? t[0], r = t.find((a) => a !== c && !e.some(([h]) => h === a)) ?? "";
      c && r && this._setParents([...e, [c, r]]);
    }, o = (i, c) => y`<option value=${i} ?selected=${i === c}>${this._name(i)}</option>`;
    return y`<div class="pairs">
      <h3>Enthaltene Verbraucher</h3>
      <p class="hint">
        Ist ein Gerät schon im Wert eines anderen enthalten (z. B. Wasserkocher im Unterzähler „Neubau“), wird es
        nur einmal gezählt und auf der Karte eingerückt darunter angezeigt.
      </p>
      ${e.map(
      ([i, c], r) => y`<div class="pair">
          <select @change=${(a) => s(r, a.target.value, c)}>
            ${t.map((a) => o(a, i))}
          </select>
          <span>ist enthalten in</span>
          <select @change=${(a) => s(r, i, a.target.value)}>
            ${t.filter((a) => a !== i).map((a) => o(a, c))}
          </select>
          <button class="link" @click=${() => this._setParents(e.filter((a, h) => h !== r))}>Entfernen</button>
        </div>
        ${i === c || e.some(([a]) => a === c) ? y`<div class="warn">⚠ Ungültig: ein Gerät kann nicht in sich selbst oder in einem enthaltenen Gerät stecken.</div>` : $}`
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
    return y`<div class="live">
      ${t.map(([n, o]) => {
      const i = this._draft.load_parents ?? {}, c = o.filter((a) => !(a in i)).reduce((a, h) => a + (q(this._s(h)) ?? 0), 0), r = o.map((a) => [a, Ue(this._s(a))]).filter(([, a]) => a);
      return y`<div class="row"><span>${n}: ${o.length} Geräte</span><span>${P(c, this._loc)}</span></div>
          ${r.map(([a, h]) => y`<div class="warn">⚠ ${this._name(a)}: ${h}</div>`)}`;
    })}
      ${s.length ? y`<div class="warn">⚠ In mehreren Gruppen: ${s.map((n) => this._name(n)).join(", ")}</div>` : $}
    </div>`;
  }
  _suggestRow(t, e, s, n, o, i = "Übernehmen") {
    return y`<div class="sg-row">
      <div class="sg-text"><b>${t}</b><span>${e}</span><small>${s}</small></div>
      ${n ? y`<span class="sg-done">✓ gesetzt</span>` : y`<button @click=${o}>${i}</button>`}
    </div>`;
  }
  /** Detected sensors that belong to one section, each with "Übernehmen". */
  _topicSuggestions(t) {
    if (!this._detectIn.has(t)) return $;
    const e = this._suggestions;
    if (!e) return y`<p class="hint">Suche …</p>`;
    const s = this._draft, n = (r) => r.map((a) => this._name(a)).join(", "), o = [], i = (r, a) => {
      const h = e[r];
      h && o.push(
        this._suggestRow(
          a,
          this._name(h.value),
          h.source,
          s[r] === h.value,
          () => this._apply({ [r]: h.value })
        )
      );
    };
    if (t === "solar") {
      if (e.solar_strings) {
        const r = e.solar_strings.value, a = r.every((h) => (s.solar_strings ?? []).includes(h));
        o.push(this._suggestRow("PV-Leistung", n(r), e.solar_strings.source, a, () => this._apply({ solar_strings: r })));
      }
      i("solar_today", "PV-Ertrag heute"), i("solar_forecast_remaining", "PV-Prognose Rest heute");
    }
    if (t === "grid") {
      if (e.grid) {
        const r = e.grid.value, a = [r.grid_power, r.grid_import_power, r.grid_export_power].filter((g) => !!g), h = a.every((g) => [s.grid_power, s.grid_import_power, s.grid_export_power].includes(g)), d = r.grid_mode === "split" ? `Bezug: ${this._name(r.grid_import_power)} · Einspeisung: ${this._name(r.grid_export_power)}` : n(a);
        o.push(this._suggestRow("Netz", d, e.grid.source, h, () => this._apply(r)));
      }
      i("grid_import_today", "Bezug heute"), i("grid_export_today", "Einspeisung heute");
    }
    if (t === "tariff" && i("grid_price", "Strompreis"), t === "wallbox" && (i("wallbox_power", "Ladeleistung"), i("wallbox_soc", "Ladestand Auto")), t === "battery")
      for (const r of e.batteries ?? []) {
        const a = r.value, h = a.mode === "split" ? "Laden + Entladen" : "Leistung", d = r.duplicate ? " – vermutlich dieselbe Batterie wie eine andere" : "";
        o.push(
          this._suggestRow(
            a.name ?? "Batterie",
            `${h}${a.soc ? " + Ladestand" : ""}${d}`,
            r.source,
            this._hasBattery(a),
            () => this._applyBattery(a),
            "Hinzufügen"
          )
        );
      }
    let c = $;
    if (t === "loads") {
      i("home_power", "Hausverbrauch gemessen");
      const r = /* @__PURE__ */ new Set([
        ...s.fixed_loads ?? [],
        ...s.flexible_loads ?? [],
        ...s.wallbox_power ? [s.wallbox_power] : [],
        ...(s.batteries ?? []).flatMap((h) => h.backup_loads ?? [])
      ]), a = (e.loads ?? []).filter((h) => !r.has(h.entity));
      c = a.length ? y`<h3>Mögliche Verbraucher</h3>
            ${a.map(
        (h) => y`<div class="sg-row">
                <div class="sg-text"><span>${h.name}</span><small>${h.source}</small></div>
                <div class="sg-btns">
                  <button @click=${() => this._applyLoad(h.entity, "fixed_loads")}>Grundlast</button>
                  <button @click=${() => this._applyLoad(h.entity, "flexible_loads")}>Zusatzverbraucher</button>
                </div>
              </div>`
      )}` : $;
    }
    return y`<div class="suggest">
      <div class="sg-head">
        <h3>Gefunden</h3>
        <button @click=${() => this._detectIn = new Set([...this._detectIn].filter((r) => r !== t))}>
          Schließen
        </button>
      </div>
      ${o.length || c !== $ ? o : y`<p class="hint">Hier nichts Passendes gefunden – bitte unten selbst wählen.</p>`}
      ${c}
      <p class="hint">Übernommenes landet im Entwurf – erst „Speichern“ übernimmt es.</p>
    </div>`;
  }
  // -- render ---------------------------------------------------------------------------
  _form(t, e, s, n = {}, o = {}) {
    return y`<ha-form
      .hass=${this.hass}
      .data=${e}
      .schema=${t}
      .computeLabel=${(i) => n[i.name] ?? $n[i.name] ?? i.name}
      .computeHelper=${(i) => o[i.name] ?? mn[i.name]}
      @value-changed=${s}
    ></ha-form>`;
  }
  _section(t, e, s, n, o, i = !0) {
    const c = Ge.includes(t), r = this._isOn(t), a = r && this._open.has(t), d = y`<div class="section">
      <div class="head">
        <button class="fold" ?disabled=${!r} @click=${() => this._toggleOpen(t)} aria-expanded=${a}>
          <span class="chev ${a ? "open" : ""}">›</span>
          <span class="htitle">${e}</span>
          ${(this._draft.checked ?? []).includes(t) ? y`<span class="tick" title="geprüft und gespeichert">✓</span>` : $}
        </button>
        ${c ? y`<div class="yesno" role="group" aria-label=${o ?? e}>
              <button class=${r ? "on" : ""} ?disabled=${!1} @click=${() => this._answer(t, !0)}>Ja</button>
              <button class=${r ? "" : "on"} @click=${() => this._answer(t, !1)}>Nein</button>
            </div>` : $}
      </div>
      ${c && !a ? y`<p class="hint q">${o}</p>` : $}
      ${a ? y`${n ? y`<p class="hint">${n}</p>` : $}
            ${i ? y`<button class="secondary detect" ?disabled=${this._detecting} @click=${() => this._detect(t)}>
                  ${this._detecting ? "Suche …" : "Sensoren erkennen"}
                </button>` : $}
            ${this._topicSuggestions(t)} ${s()}
            <div class="secsave">
              <button class="primary" ?disabled=${this._saving} @click=${() => this._saveSection(t)}>
                ${this._saving ? "Speichert …" : "Speichern"}
              </button>
            </div>` : $}
    </div>`;
    return this.compact ? y`<div class="plain">${d}</div>` : y`<ha-card>${d}</ha-card>`;
  }
  render() {
    if (!this._ready || !this._loadedFor) return y`<div class="hint">Lade …</div>`;
    const t = this._draft, e = t.batteries ?? [], s = this._saving, n = this._message ? y`<span class="msg ${this._message.kind}">${this._message.text}</span>` : y`<span class="msg">${this.dirty ? "Noch nicht gespeichert – im Abschnitt auf „Speichern“." : ""}</span>`;
    return y`
      <div class="actions">
        ${n}
        <button class="secondary" ?disabled=${!this.dirty || s} @click=${this.discard}>Verwerfen</button>
      </div>
      ${this._section(
      "general",
      "Allgemein",
      () => y`${this._form(
        ln,
        { title: this._title, energy_period: t.energy_period ?? "midnight" },
        (o) => this._onForm(o, ["title", "energy_period"])
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
      () => y`${this._form(
        dn(t),
        { grid_mode: "combined", ...t },
        (o) => this._onForm(o, pn)
      )}${this._gridLive()}`,
      "Ein Sensor mit + und − (positiv = Bezug) oder getrennt, z. B. Tibber Pulse: „Leistung“ und „Leistung Produktion“."
    )}
      ${this._section(
      "battery",
      "Batteriespeicher",
      () => y`${e.map((o, i) => {
        const c = { mode: "combined", ...o };
        return y`<div class="sub">
            <div class="subhead">
              <h3>Batterie ${i + 1}${o.name ? ` – ${o.name}` : ""}</h3>
              <button class="link" @click=${() => this._removeBattery(i)}>Entfernen</button>
            </div>
            ${this._form(hn(o, !1), c, (r) => this._onBattery(i, r))}
            ${this._batteryLive(o, i)}
            ${this._backupPart(o, i)}
          </div>`;
      })}
        ${e.length < Ot ? y`<button class="add" @click=${this._addBattery}>+ Batterie hinzufügen</button>` : $}`,
      `Ein Sensor mit + und − (positiv = lädt, sonst Schalter setzen) oder zwei getrennte Sensoren für Laden und Entladen. Bis zu ${Ot} Batterien.`,
      "Hast du einen oder mehrere Batteriespeicher?"
    )}
      ${this._section(
      "solar",
      "Photovoltaik",
      () => y`${this._form(
        cn,
        t,
        (o) => this._onForm(o, ["solar_strings", "solar_today", "solar_forecast_remaining"])
      )}${this._solarLive()}`,
      "Ein Sensor je Strang (z. B. Dachseite), höchstens 4 – jeder wird ein Feld auf dem Solarmodul.",
      "Hast du Solarpanele?"
    )}
      ${this._section(
      "tariff",
      "Dynamischer Stromtarif",
      () => this._form(un, t, (o) => this._onForm(o, ["grid_price"])),
      "Preis-Sensor in €/kWh, z. B. von Tibber.",
      "Hast du einen dynamischen Stromtarif (z. B. Tibber)?"
    )}
      ${this._section(
      "wallbox",
      "E-Auto / Wallbox",
      () => y`${this._form(
        gn,
        { wallbox_flexible: !0, ...t },
        (o) => this._onForm(o, ["wallbox_name", "wallbox_power", "wallbox_soc", "wallbox_flexible"])
      )}${this._wallboxLive()}`,
      "Hängt am Wechselrichter und zählt zum Hausverbrauch; standardmäßig als Zusatzverbraucher.",
      "Hast du ein E-Auto oder eine Wallbox?"
    )}
      ${this._section(
      "loads",
      "Verbraucher",
      () => y`${this._form(
        fn,
        t,
        (o) => this._onForm(o, ["fixed_loads", "flexible_loads", "home_power"])
      )}${this._loadsLive()}${this._parentsEditor()}`,
      "Alle Verbraucher zählen zum Haus. Grundlast läuft sowieso, Zusatzverbraucher lassen sich zeitlich verschieben."
    )}
    `;
  }
};
Se.styles = Qt`
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
let B = Se;
N([
  mt({ attribute: !1 })
], B.prototype, "hass");
N([
  mt({ attribute: !1 })
], B.prototype, "entryId");
N([
  mt({ type: Boolean })
], B.prototype, "compact");
N([
  H()
], B.prototype, "_ready");
N([
  H()
], B.prototype, "_loadedFor");
N([
  H()
], B.prototype, "_title");
N([
  H()
], B.prototype, "_draft");
N([
  H()
], B.prototype, "_saved");
N([
  H()
], B.prototype, "_saving");
N([
  H()
], B.prototype, "_message");
N([
  H()
], B.prototype, "_computed");
N([
  H()
], B.prototype, "_suggestions");
N([
  H()
], B.prototype, "_detecting");
N([
  H()
], B.prototype, "_look");
N([
  H()
], B.prototype, "_open");
N([
  H()
], B.prototype, "_choice");
N([
  H()
], B.prototype, "_detectIn");
N([
  H()
], B.prototype, "_backupYes");
customElements.get("energiefluss-editor") || customElements.define("energiefluss-editor", B);
var bn = Object.defineProperty, se = (l, t, e, s) => {
  for (var n = void 0, o = l.length - 1, i; o >= 0; o--)
    (i = l[o]) && (n = i(t, e, n) || n);
  return n && bn(t, e, n), n;
};
const wn = {
  entry_id: "Anlage",
  title: "Titel der Karte (optional)",
  flow_style: "Animation",
  max_power: "Leistung für größte bzw. schnellste Punkte"
}, xn = {
  max_power: "Ab dieser Leistung sind die Punkte am größten bzw. schnellsten. Standard 5000 W."
}, Le = class Le extends lt {
  constructor() {
    super(...arguments), this._instances = [], this._ready = !1;
  }
  setConfig(t) {
    this._config = t;
  }
  async firstUpdated() {
    await ms(), this.hass && (this._instances = await this.hass.callWS({ type: "energiefluss/instances" })), this._ready = !0;
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
    return !this._ready || !this._config ? y`<div class="hint">Lade …</div>` : this._instances.length ? y`
      <h2>Karte</h2>
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._schema()}
        .computeLabel=${(t) => wn[t.name] ?? t.name}
        .computeHelper=${(t) => xn[t.name]}
        @value-changed=${this._cardChanged}
      ></ha-form>
      <h2 class="spaced">Anlage</h2>
      <p class="hint">
        Gilt für alle Karten dieser Anlage. Änderungen hier mit <b>„Anlage speichern“</b> übernehmen – das
        Speichern unten im Dialog speichert nur die Karten-Einstellungen oben.
      </p>
      ${this._entryId ? y`<energiefluss-editor compact .hass=${this.hass} .entryId=${this._entryId}></energiefluss-editor>` : $}
    ` : y`<div class="hint">
        Noch keine Anlage angelegt: Einstellungen → Geräte &amp; Dienste → Integration hinzufügen → „Wattrio“.
      </div>`;
  }
};
Le.styles = Qt`
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
let dt = Le;
se([
  mt({ attribute: !1 })
], dt.prototype, "hass");
se([
  H()
], dt.prototype, "_config");
se([
  H()
], dt.prototype, "_instances");
se([
  H()
], dt.prototype, "_ready");
customElements.get("energiefluss-card-editor") || customElements.define("energiefluss-card-editor", dt);
var vn = Object.defineProperty, Pt = (l, t, e, s) => {
  for (var n = void 0, o = l.length - 1, i; o >= 0; o--)
    (i = l[o]) && (n = i(t, e, n) || n);
  return n && vn(t, e, n), n;
};
const kn = (l) => l.reduce((t, e) => t + 1 + (e.children?.length ?? 0), 0), Mn = {
  solar: "#ff9800",
  battery: "#ff69b4",
  grid: "#5490c2",
  home: "#5fb6ad",
  flexible: "#9575cd",
  backup: "#ef5350",
  inverter: "#959595"
}, An = 554, Sn = 148, Xe = 400, qe = 240, Gt = 22, R = 396, rt = R - 20, nt = 504, Q = 40, K = 550, et = 42, Ln = 22, Ze = 358, En = 37, Ke = 364, Je = 370, O = 5, Qe = 40, zn = 14, Hn = 0.8, Cn = "M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z", Pn = "M8.28,5.45L6.5,4.55L7.76,2H16.24L17.5,4.55L15.72,5.45L15,4H9L8.28,5.45M18.62,8H14.09L13.3,5H10.7L9.91,8H5.38L4.1,10.55L5.89,11.44L6.62,10H17.38L18.1,11.44L19.89,10.55L18.62,8M17.77,22H15.7L15.46,21.1L12,15.9L8.53,21.1L8.3,22H6.23L9.12,11H11.19L10.83,12.35L12,14.1L13.16,12.35L12.81,11H14.88L17.77,22M11.4,15L10.5,13.65L9.32,18.13L11.4,15M14.68,18.12L13.5,13.64L12.6,15L14.68,18.12Z", Bn = "M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z", Tn = "M4,2H20A2,2 0 0,1 22,4V14A2,2 0 0,1 20,16H15V20H18V22H13V16H11V22H6V20H9V16H4A2,2 0 0,1 2,14V4A2,2 0 0,1 4,2M4,4V8H11V4H4M4,14H11V10H4V14M20,14V10H13V14H20M20,4H13V8H20V4Z", Ee = class Ee extends lt {
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
    super.connectedCallback(), window.addEventListener(Zt, this._onUpdated);
  }
  disconnectedCallback() {
    window.removeEventListener(Zt, this._onUpdated), super.disconnectedCallback();
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
    return q(this._s(t));
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
    return { ...Mn, ...this._config?.colours ?? {} };
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
    return qe;
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
    return Ln;
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
    return Sn;
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
      <path d=${t} fill="none" stroke=${e} stroke-width=${Ks(s, this._max)} stroke-opacity="0.85" />
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
    if (s === null || Math.abs(s) < O) return _``;
    const c = this._bySize, r = i?.radius ?? (c ? Math.max(1.7, nn(s, this._max) * (o / 3.2)) : o);
    if (i) {
      const h = (i.travel / i.period).toFixed(4), d = { dur: `${i.period.toFixed(2)}s`, begin: `${i.begin.toFixed(2)}s` };
      return this._orb(
        r,
        e,
        _`<animateMotion dur=${d.dur} begin=${d.begin} repeatCount="indefinite" calcMode="linear" rotate="auto"
            keyPoints="0;1;1" keyTimes=${`0;${h};1`} path=${t} />
          <animate attributeName="opacity" dur=${d.dur} begin=${d.begin} repeatCount="indefinite"
            calcMode="discrete" values="1;0" keyTimes=${`0;${h}`} />`,
        !0
      );
    }
    const a = this._dotDuration(t, s);
    return this._orb(
      r,
      e,
      _`<animateMotion dur=${`${a.toFixed(2)}s`} repeatCount="indefinite" calcMode="linear"
        rotate=${n ? "auto" : "auto-reverse"}
        keyPoints=${n ? "0;1" : "1;0"} keyTimes="0;1" path=${t} />`
    );
  }
  /** Seconds a (non-train) dot needs for path `d`; looks use it to sync their own effects. */
  _dotDuration(t, e) {
    return this._bySize ? Math.max(0.6, ue(t) / Qe) : Zs(e, this._max);
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
  _box(t, e, s, n, o, i, c = 12) {
    return _`
      ${this._panel(t, e, s, n, o)}
      <text x=${t + s / 2} y=${e + n / 2 + c * 0.35} text-anchor="middle" class="val" font-size=${this._fs(c)}>${i}</text>
    `;
  }
  _icon(t, e, s, n, o) {
    return _`<path d=${t} fill=${o} transform=${`translate(${e} ${s}) scale(${n / 24})`} />`;
  }
  // -- sections ---------------------------------------------------------------
  _solar() {
    const t = this._layout, e = this._c.solar, s = this._own("solar_power"), n = t.solar.strings.slice(0, 4), o = this._stringPos, i = this._pvBoxY, [c, r] = this._pvBox, a = c + r + 6, h = Bt(this._s(t.solar.today)), d = Bt(this._s(t.solar.forecast_remaining)), g = n.map((f, v) => this._stringRoute(o[v][0], o[v][1])), p = n.length > 0 && g.every((f) => f !== null), m = `M ${this._solarX} ${i + 26} V ${this._solarY} H ${this._invX}`;
    return _`
      ${this._solarBack()}
      ${p ? (
      // the line first, the strings' dots on it, tiles and box on top (dots pass below the glass)
      _`${this._flow(m, e, s, !0, !1)}
            ${this._trainDots("pv", e, n.map((f, v) => ({ route: g[v], w: this._w(f.entity), forward: !0 })))}`
    ) : $}
      ${n.map((f, v) => {
      const [x, w] = o[v];
      return this._tap(f.entity, this._stringTile(x, w, f.entity, e));
    })}
      ${this._solarIcon(e)}
      ${this._tap(t.entities.solar_power, this._box(c, i, r, 26, e, P(s, this._loc), 13))}
      <text x=${a} y=${i + 9} class="lbl">PV gesamt</text>
      ${h !== null ? _`<text x=${a} y=${i + 22} class="small" fill=${e}>${W(h, this._loc)} heute</text>` : $}
      ${d !== null ? _`<text x=${a} y=${i + 34} class="small">Rest ${W(d, this._loc)}</text>` : $}
      ${p ? $ : this._flow(m, e, s, !0)}
    `;
  }
  /** Drawn first in the PV section, below the string tiles (nothing in the classic look). */
  _solarBack() {
    return _``;
  }
  /** Symbol next to the PV strings. */
  _solarIcon(t) {
    return this._icon(Tn, 152, 34, 26, t);
  }
  /** One PV string: value box with its name below (tile at x, y; 60 x 38 available). */
  _stringTile(t, e, s, n) {
    return _`${this._box(t, e, 60, 24, n, P(this._w(s), this._loc), 11)}
      <text x=${t} y=${e + 35} class="lbl">${St(this._name(s), 14)}</text>`;
  }
  /** Batteries in display order: those with a backup output go to the right. */
  _displayBatteries() {
    const t = this._layout?.batteries ?? [], e = t.filter((r) => !(r.backup ?? []).length), s = t.filter((r) => (r.backup ?? []).length), n = [...e, ...s], o = en(n.length), i = this._batteryShift(n.length), c = this._storeY - qe;
    return n.map((r, a) => ({ ...r, ...o[a], cx: o[a].cx + i, top: o[a].top + c, index: a }));
  }
  _batteries() {
    const t = this._layout, e = this._c.battery;
    if (!t.batteries.length) return _``;
    const s = this._own("battery_soc"), n = this._own("battery_energy"), o = this._displayBatteries();
    o.length;
    const i = o.map((w) => this._lineFlow(w.name, E(this._s(w.power)))), r = o.some((w) => w.backup_only || (w.backup ?? []).length) ? i.reduce((w, k) => k === null ? w : (w ?? 0) + k, null) : this._own("battery_power"), a = Math.min(...o.map((w) => w.cx - w.w / 2)), h = Math.max(...o.map((w) => w.cx + w.w / 2)) - a, [d, g] = this._invBottom, p = this._storeY, m = Math.min(Math.max(d, a + 10), a + h - 10), f = m === d ? `M ${d} ${g} V ${p}` : `M ${d} ${g} V ${p - 5} H ${m} V ${p}`, v = o.map((w) => this._batteryRoute(w.cx, w.top)), x = v.every((w) => w !== null);
    return _`
      ${o.map((w, k) => {
      const { cx: C, top: S, w: z } = w, I = E(this._s(w.power)), G = E(this._s(w.soc)), V = `M ${C} ${p + Gt} V ${S}`, j = I === null ? "" : I > O ? "lädt" : I < -O ? "entlädt" : "ruht", u = i[k];
      return _`
          ${this._flow(V, e, u, (u ?? 0) > 0, !x)}
          ${this._tap(w.power, this._batteryWidget(w.name, C, S, z, I, G, j, e, w.capacity_kwh))}
        `;
    })}
      ${this._flow(f, e, r, (r ?? 0) > 0, !x)}
      ${x ? this._trainDots(
      "battery",
      e,
      o.map((w, k) => ({ route: v[k], w: i[k], forward: (i[k] ?? 0) > 0 }))
    ) : $}
      ${this._tap(t.entities.battery_soc, this._box(
      a,
      p,
      h,
      Gt,
      e,
      `${h >= 120 ? "Speicher " : ""}${At(s, this._loc)}${n !== null && h >= 80 ? ` · ${W(n, this._loc)}` : ""}`,
      h >= 150 ? 11 : 10
    ))}
    `;
  }
  /** One battery below the storage box: widget spans top .. top + 104 around cx. */
  _batteryWidget(t, e, s, n, o, i, c, r, a = null) {
    const h = n < 54, d = Math.max(0, Math.min(100, i ?? 0));
    return _`
      ${this._box(e - n / 2, s, n, 22, r, P(o === null ? null : Math.abs(o), this._loc), h ? 10 : 11)}
      <text x=${e} y=${s + 32} text-anchor="middle" class="tiny">${c}</text>
      <rect x=${e - 9} y=${s + 42} width="18" height="32" rx="3" fill="none" stroke=${r} />
      <rect x=${e - 4} y=${s + 39} width="8" height="3" fill=${r} />
      <rect x=${e - 7} y=${s + 72 - 28 * d / 100} width="14" height=${28 * d / 100} rx="1" fill=${r} fill-opacity="0.7" />
      <text x=${e} y=${s + 91} text-anchor="middle" class="soc">${At(i, this._loc)}</text>
      <text x=${e} y=${s + 104} text-anchor="middle" class="tiny">${St(t, h ? 10 : 14)}</text>
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
    let c = this._groupsTop;
    const r = (f, v, x, w, k, C, S, z) => {
      if (!x.length) return;
      const I = this._listLimit(f), G = I !== null && x.length > I, V = this._expanded.has(f);
      let j = x;
      if (G) {
        const Z = (T) => E(this._s(T.today)) ?? 0, it = new Set([...x].sort((T, tt) => Z(tt) - Z(T)).slice(0, I)), bt = x.filter((T) => !it.has(T)), ne = bt.reduce((T, tt) => {
          const pt = E(this._s(tt.today));
          return pt === null ? T : (T ?? 0) + pt;
        }, null), X = {
          entity: "",
          today: null,
          label: V ? "− weniger" : `+ ${bt.length} weitere`,
          more: { group: f, power: V ? null : this._sumW(bt), today: V ? null : ne }
        };
        j = [...V ? x : x.filter((T) => it.has(T)), X];
      }
      const u = kn(j), b = Math.max(c + 6, S ? S.pref - 10 : 0), M = S ? Math.min(Math.max(b + i, S.lo), S.hi) : b + i, A = k(b + i, M), D = z?.(M), yt = D ? `${D} ${A.replace(/^M\s+\S+\s+\S+\s*/, "")}` : void 0;
      n.push({
        title: f,
        colour: v,
        power: w,
        titleY: b - 6,
        y0: b,
        trunk: A,
        loads: j.map((Z) => ({ ...Z, trunk: A, route: yt, source: C })),
        all: x,
        rows: u,
        more: G ? { hidden: x.length - j.length, expanded: V } : void 0
      }), c = b + u * o + this._groupGap;
    }, a = [...t.loads.fixed], h = t.entities.unmeasured_power;
    this._unmeasuredInList && h && a.push({
      entity: h,
      today: t.unmeasured_today ?? null,
      label: "Nicht erfasst",
      tip: "Nicht erfasst · Hausverbrauch ohne die gemessenen Verbraucher"
    });
    const d = this._laneFinder(), g = this._houseY;
    r(
      "Grundlast",
      e.home,
      a,
      this._sumW(a),
      (f) => `M 285 ${g + 9} H ${d(300, g + 9, f)} V ${f} H ${s}`,
      void 0,
      void 0,
      () => this._houseLead(g + 9)
    ), r(
      "Zusätzlich",
      e.flexible,
      t.loads.flexible,
      this._sumW(t.loads.flexible),
      (f) => `M 285 ${g + 19} H ${d(306, g + 19, f)} V ${f} H ${s}`,
      void 0,
      void 0,
      () => this._houseLead(g + 19)
    );
    const p = t.wallbox;
    if (p && this._wallboxInList) {
      const f = E(this._s(p.soc ?? void 0)), v = f !== null ? `${p.name} Auto ${At(f, this._loc)}` : p.name;
      r(
        "Wallbox",
        p.flexible ? e.flexible : e.home,
        [{ entity: p.power, today: p.today, label: v, tip: `${p.name} · ${p.flexible ? "Zusatzverbraucher" : "Grundlast"}` }],
        this._w(p.power),
        (x, w) => `M ${this._invX + 60} ${w} H ${Ze} V ${x} H ${s}`,
        void 0,
        { pref: this._invY + En, lo: this._invY + 6, hi: this._invY + 56 }
        // anywhere on the inverter's right edge
      );
    }
    return this._displayBatteries().filter((f) => (f.backup ?? []).length).reverse().forEach((f, v) => {
      const x = v === 0 ? Ke : Je, w = v === 0 ? { pref: f.top + 57, lo: f.top + 46, hi: f.top + 70 } : { pref: f.top + 68, lo: f.top + 64, hi: f.top + 72 };
      r(
        St(f.name, 12),
        // red colour + feed line from the battery mark it as backup
        e.backup,
        f.backup ?? [],
        this._sumW(f.backup ?? []),
        (k, C) => `M ${this._batteryOutX(f.cx, f.w)} ${C} H ${x} V ${k} H ${s}`,
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
    return R - 3;
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
      const i = Math.min(...t.map((r) => r.cx - r.w / 2)) - 3, c = Math.max(...t.map((r) => r.cx + r.w / 2)) + 3;
      e.push({ x0: i, x1: c, y0: this._storeY - 3, y1: this._storeY + Gt + 3 });
    }
    const s = [Ke, Je, ...this._layout?.wallbox && this._wallboxInList ? [Ze] : []], n = [], o = (i, c, r) => {
      const [a, h] = c < r ? [c, r] : [r, c];
      return !e.some((d) => i >= d.x0 && i <= d.x1 && h >= d.y0 && a <= d.y1) && !s.some((d) => Math.abs(d - i) < 4) && !n.some((d) => Math.abs(d - i) < 5);
    };
    return (i, c, r) => {
      let a = i;
      for (; !o(a, c, r) && a < rt - 8; ) a += 3;
      return a >= rt - 8 && (a = i), n.push(a), a;
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
    const n = this._rowH, o = n / 2 - 1, i = (u) => u.w !== null && Math.abs(u.w) >= O, c = (u) => E(this._s(u.today)) ?? 0, r = (u, b) => this._idleByEnergy ? Number(i(b)) - Number(i(u)) || (i(u) ? b.w - u.w : c(b) - c(u)) || u.name.localeCompare(b.name) : (b.w ?? -1 / 0) - (u.w ?? -1 / 0) || u.name.localeCompare(b.name), a = t.map((u) => ({ ...u, w: u.more ? u.more.power : this._w(u.entity), name: u.label ?? this._name(u.entity) })).sort((u, b) => +!!u.more - +!!b.more || r(u, b)), h = [];
    for (const u of a) {
      const b = h.length;
      h.push({ ...u, child: !1 });
      const M = (u.children ?? []).map((A) => ({ ...u, ...A, children: void 0, label: void 0, w: this._w(A.entity), name: this._name(A.entity) })).sort(r);
      for (const A of M) h.push({ ...A, child: !0, parentRow: b });
    }
    const d = this._rowEntryX, g = (u, b) => `${u.route ?? u.trunk} V ${e + b * n + o} H ${d}`, p = (u, b) => `${g(u, u.parentRow ?? 0)} H ${R + 4} V ${e + b * n + o} H ${R + 10}`, m = (u) => {
      const b = h[u].w;
      if (b === null) return null;
      const M = h.filter((A) => A.child && A.parentRow === u).reduce((A, D) => A + Math.max(D.w ?? 0, 0), 0);
      return Math.max(b - M, 0);
    }, f = (u, b) => u.child ? u.w : m(b), v = h.map((u, b) => ({ l: u, i: b, w: f(u, b) })).filter(({ w: u }) => u !== null && Math.abs(u) >= O), x = this._wagonSpeed, w = v.flatMap(
      ({ l: u, i: b, w: M }) => (this._wagonBalls(M, s, u.source) ?? [void 0]).map((A) => ({ l: u, i: b, radius: A?.r, tint: A?.colour }))
    );
    w.some((u) => u.radius !== void 0) && w.sort((u, b) => (b.radius ?? 0) - (u.radius ?? 0));
    let k = 0;
    const C = w.map(({ l: u, i: b, radius: M, tint: A }, D) => (D && (k += M === void 0 ? zn : (w[D - 1].radius ?? 0) + M + 2.5), { i: b, radius: M, tint: A, begin: k / x, travel: ue(u.child ? p(u, b) : g(u, b)) / x })), S = Math.max(1, ...C.map((u) => u.begin + u.travel)) + Hn, z = /* @__PURE__ */ new Map();
    for (const u of C)
      z.set(u.i, [...z.get(u.i) ?? [], { period: S, begin: u.begin, travel: u.travel, radius: u.radius, tint: u.tint }]);
    const I = (u, b, M) => (z.get(M) ?? []).map((A) => this._dot(u, A.tint ?? s, b, !0, 2.4, A)), G = h.reduce((u, b, M) => b.child ? u : M, 0), V = this._pipeTrunk ? t[0]?.trunk : void 0, j = [
      ...V ? [V] : [],
      `M ${rt} ${V ? e + o : e + 4} V ${e + G * n + o}`,
      ...h.flatMap((u, b) => u.child ? [] : [`M ${rt} ${e + b * n + o} H ${d}`])
    ].join(" ");
    return _`
      ${this._branch(j, s, "row")}
      ${h.map((u, b) => {
      const M = e + b * n, A = u.w === null || Math.abs(u.w) < O;
      if (u.child) {
        const Z = e + (u.parentRow ?? 0) * n + n - 3, it = `${u.name} · enthalten in ${h[u.parentRow ?? 0].name}`;
        return _`
            ${this._branch(`M ${R + 4} ${Z} V ${M + o} H ${R + 10}`, s, "child")}
            ${this._bySize ? I(p(u, b), u.w, b) : $}
            <g opacity=${A ? 0.45 : 0.85} class="tap" data-entity=${u.entity}>
              ${this._nameBox(u.name, M, s, it, 12)}
              ${this._valueCell(nt - Q, M + 1, Q, n - 4, s, P(u.w, this._loc), 9, "power")}
            </g>
            ${this._tap(u.today, this._valueCell(K - et, M + 1, et, n - 4, s, W(E(this._s(u.today)), this._loc), 8.5, "energy"))}`;
      }
      const D = this._bySize ? I(g(u, b), m(b), b) : this._dot(g(u, b), s, u.w, !0, 2.4);
      if (u.more) {
        const Z = u.more.group;
        return _`
            ${D}
            <g class="more" opacity=${u.more.power !== null && A ? 0.55 : 1} @click=${() => this._toggleList(Z)}>
              <rect x=${R - 8} y=${M} width=${K - R + 8} height=${n} fill="transparent" />
              <text x=${R + 2} y=${M + n * 0.62} class="small" fill=${s}>${u.name}</text>
              ${u.more.power !== null ? this._valueCell(nt - Q, M + 1, Q, n - 4, s, P(u.w, this._loc), 9, "power") : $}
              ${u.more.today !== null ? this._valueCell(K - et, M + 1, et, n - 4, s, W(u.more.today, this._loc), 8.5, "energy") : $}
            </g>`;
      }
      const yt = u.tip ?? (u.source ? `${u.name} · gespeist von ${u.source}` : u.name);
      return _`
          ${D}
          <g opacity=${A ? 0.45 : 1} class="tap" data-entity=${u.entity}>
            ${this._nameBox(u.name, M, s, yt)}
            ${this._valueCell(nt - Q, M + 1, Q, n - 4, s, P(u.w, this._loc), 9, "power")}
          </g>
          ${this._tap(u.today, this._valueCell(K - et, M + 1, et, n - 4, s, W(E(this._s(u.today)), this._loc), 8.5, "energy"))}`;
    })}
    `;
  }
  /** Power or energy of one list row. */
  _valueCell(t, e, s, n, o, i, c, r) {
    return this._box(t, e, s, n, o, i, c);
  }
  /** Name of a load in a rounded box; long names wrap to two smaller lines. */
  _nameBox(t, e, s, n = t, o = 0) {
    const i = R - 2 + o, c = nt - Q - 4 - i, { lines: r, small: a } = o ? pe(t, 9, 12) : pe(t, 11, 15);
    return _`<g>
      <title>${n}</title>
      <rect x=${i} y=${e + 1} width=${c} height="18" rx="4" fill="none" stroke=${s} stroke-width="1" />
      ${a ? _`<text x=${i + 4} y=${e + 9} class="name" font-size=${this._fs(7.5)}>${r[0]}</text>
              <text x=${i + 4} y=${e + 17} class="name" font-size=${this._fs(7.5)}>${r[1] ?? ""}</text>` : _`<text x=${i + 4} y=${e + 13.5} class="name" font-size=${this._fs(10)}>${r[0]}</text>`}
    </g>`;
  }
  _groupTitle(t, e, s, n, o) {
    const i = o.reduce((c, r) => {
      const a = E(this._s(r.today));
      return a === null ? c : (c ?? 0) + a;
    }, null);
    return _`
      <text x=${rt} y=${t} class="small grp" fill=${e}>${s}</text>
      <text x=${nt - Q / 2} y=${t} text-anchor="middle" class="small grp" fill=${e}>${P(n, this._loc)}</text>
      <text x=${K - et / 2} y=${t} text-anchor="middle" class="small grp" fill=${e}>${W(i, this._loc)}</text>`;
  }
  /** Total svg height needed for the load lists and the batteries. */
  get _viewH() {
    if (!this._layout) return Xe;
    const t = this._groups(), e = t[t.length - 1], s = e ? e.y0 + e.rows * this._rowH + 8 : 0, n = this._displayBatteries(), o = n.length ? Math.max(...n.map((i) => i.top)) + this._batteryTail : 0;
    return Math.max(this._minViewH, s, o);
  }
  /** House symbol above the house value (area 226..274 x 16..64). */
  _houseIcon(t) {
    return this._icon(Cn, 226, 16, 48, t);
  }
  /** Background behind a load group (none in the classic look). */
  _groupPanel(t) {
    return _``;
  }
  /** Small symbol next to a group title. */
  _groupIcon(t) {
    return t.title === "Wallbox" ? this._icon(Bn, rt + 46, t.titleY - 11, 14, t.colour) : _``;
  }
  _home() {
    const t = this._layout, e = this._c.home, s = this._own("home_power"), n = this._own("unmeasured_power"), o = this._groups(), i = `M ${this._invTop[0]} ${this._invTop[1]} V ${Math.min(152, this._invTop[1] - 8)} H 250 V ${this._houseY + 26}`, c = s === null ? null : Math.max(s - this._offGridLoads, 0);
    return _`
      ${this._houseIcon(e)}
      ${n !== null && !this._unmeasuredInList ? _`<text x="256" y=${this._houseY + 42} class="tiny">nicht erfasst</text>
              <text x="256" y=${this._houseY + 52} class="tiny val">${P(n, this._loc)}</text>` : $}
      ${this._flow(i, e, c, !0, !1)}
      ${this._houseDots(this._houseIn() ?? i, e, c)}
      ${this._houseJunction(c)}
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
      ${this._tap(t.entities.home_power, this._box(215, this._houseY, 70, 26, e, P(c, this._loc), 13))}
      <text x="211" y=${this._houseY + 13} text-anchor="end" class="lbl">Haus</text>
      <text x="211" y=${this._houseY + 25} text-anchor="end" class="tiny val">${W(this._houseNetToday, this._loc)}</text>
    `;
  }
  /** Current grid values: power, direction, price and today's import / export. */
  _gridData() {
    const t = this._layout, e = this._own("grid_power"), s = (e ?? 0) < -O, n = s ? t.grid.export_price ? de(this._s(t.grid.export_price)) : t.grid.export_price_fixed ?? null : de(this._s(t.grid.price));
    return {
      grid: e,
      exporting: s,
      cents: n,
      label: e === null ? "" : e > O ? "Bezug" : s ? "Einspeisung" : "",
      power: P(e === null ? null : Math.abs(e), this._loc),
      imp: Bt(this._s(t.grid.import_today)),
      exp: Bt(this._s(t.grid.export_today))
    };
  }
  _grid() {
    const t = this._c.grid, { grid: e, exporting: s, cents: n, label: o, power: i, imp: c, exp: r } = this._gridData();
    return _`
      ${this._flow(`M ${this._invX} ${this._invY + 42} H 84`, t, e, s)}
      ${this._tap(this._layout.entities.grid_power, _`${this._panel(10, 192, 74, 40, t)}
        <text x="47" y=${n === null ? 217 : 209} text-anchor="middle" class="val" font-size=${this._fs(13)}>${i}</text>`)}
      ${n !== null ? _`<text x="47" y="225" text-anchor="middle" class="tiny" fill=${t}>${Ae(n, this._loc)}</text>` : $}
      <text x="90" y="207" class="tiny">${o}</text>
      ${this._icon(Pn, 27, 240, 40, t)}
      ${c !== null ? _`<text x="10" y="292" class="small" fill=${t}>↓ ${W(c, this._loc)}<tspan class="tiny"> Bezug</tspan></text>` : $}
      ${r !== null ? _`<text x="10" y="305" class="small">↑ ${W(r, this._loc)}<tspan class="tiny"> Einspeisung</tspan></text>` : $}
    `;
  }
  // -- render -----------------------------------------------------------------
  render() {
    if (this._error)
      return y`<ha-card><div class="msg">${this._error}</div></ha-card>`;
    if (!this._layout || !this.hass)
      return y`<ha-card><div class="msg">Lade Wattrio …</div></ha-card>`;
    const t = this._config?.title;
    return y`
      <ha-card .header=${t ?? $}>
        <svg viewBox=${`0 0 ${An} ${this._viewH}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Wattrio – Energiefluss"
          @click=${this._onTap}>
          ${this._defs()} ${this._solar()} ${this._batteries()} ${this._inverter()} ${this._home()} ${this._grid()}
          ${this._overlay()}
        </svg>
      </ha-card>
    `;
  }
};
Ee.styles = Qt`
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
Pt([
  mt({ attribute: !1 })
], J.prototype, "hass");
Pt([
  H()
], J.prototype, "_config");
Pt([
  H()
], J.prototype, "_layout");
Pt([
  H()
], J.prototype, "_error");
Pt([
  H()
], J.prototype, "_expanded");
customElements.get("energiefluss-card") || customElements.define("energiefluss-card", J);
window.customCards = window.customCards ?? [];
window.customCards.some((l) => l.type === "energiefluss-card") || window.customCards.push({
  type: "energiefluss-card",
  name: "Wattrio Energiefluss Klassik",
  description: "Wattrio: animierter Energiefluss im klassischen, flachen Look – eingerichtet über die Wattrio-Integration.",
  preview: !0
});
const On = `<svg
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-battery-2"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M6 7h11a2 2 0 0 1 2 2v.5a.5 .5 0 0 0 .5 .5a.5 .5 0 0 1 .5 .5v3a.5 .5 0 0 1 -.5 .5a.5 .5 0 0 0 -.5 .5v.5a2 2 0 0 1 -2 2h-11a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2" />
  <path d="M7 10l0 4" />
  <path d="M10 10l0 4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-bulb"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7" />
  <path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3" />
  <path d="M9.7 17l4.6 0" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-car"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-charging-pile"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M18 7l-1 1" />
  <path d="M14 11h1a2 2 0 0 1 2 2v3a1.5 1.5 0 0 0 3 0v-7l-3 -3" />
  <path d="M4 20v-14a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v14" />
  <path d="M9 11.5l-1.5 2.5h3l-1.5 2.5" />
  <path d="M3 20l12 0" />
  <path d="M4 8l10 0" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-coffee"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 14c.83 .642 2.077 1.017 3.5 1c1.423 .017 2.67 -.358 3.5 -1c.83 -.642 2.077 -1.017 3.5 -1c1.423 -.017 2.67 .358 3.5 1" />
  <path d="M8 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
  <path d="M12 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
  <path d="M3 10h14v5a6 6 0 0 1 -6 6h-2a6 6 0 0 1 -6 -6v-5" />
  <path d="M16.746 16.726a3 3 0 1 0 .252 -5.555" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-cooker"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 7h.01" />
  <path d="M15 7h.01" />
  <path d="M9 7h.01" />
  <path d="M5 5a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -14" />
  <path d="M9 15h6" />
  <path d="M5 11h14" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-device-desktop"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 5a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10" />
  <path d="M7 20h10" />
  <path d="M9 16v4" />
  <path d="M15 16v4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-droplet"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M7.502 19.423c2.602 2.105 6.395 2.105 8.996 0c2.602 -2.105 3.262 -5.708 1.566 -8.546l-4.89 -7.26c-.42 -.625 -1.287 -.803 -1.936 -.397a1.376 1.376 0 0 0 -.41 .397l-4.893 7.26c-1.695 2.838 -1.035 6.441 1.567 8.546" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-flame"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 10.941c2.333 -3.308 .167 -7.823 -1 -8.941c0 3.395 -2.235 5.299 -3.667 6.706c-1.43 1.408 -2.333 3.294 -2.333 5.588c0 3.704 3.134 6.706 7 6.706c3.866 0 7 -3.002 7 -6.706c0 -1.712 -1.232 -4.403 -2.333 -5.588c-2.084 3.353 -3.257 3.353 -4.667 2.235" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-fridge"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 5a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -14" />
  <path d="M5 10h14" />
  <path d="M9 13v3" />
  <path d="M9 6v1" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-home"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
  <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
  <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-lamp"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M9 20h6" />
  <path d="M12 20v-8" />
  <path d="M5 12h14l-4 -8h-6l-4 8" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-plug"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M9.785 6l8.215 8.215l-2.054 2.054a5.81 5.81 0 1 1 -8.215 -8.215l2.054 -2.054" />
  <path d="M4 20l3.5 -3.5" />
  <path d="M15 4l-3.5 3.5" />
  <path d="M20 9l-3.5 3.5" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-pool"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M2 20a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1" />
  <path d="M2 16a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1" />
  <path d="M15 12v-7.5a1.5 1.5 0 0 1 3 0" />
  <path d="M9 12v-7.5a1.5 1.5 0 0 0 -3 0" />
  <path d="M15 5l-6 0" />
  <path d="M9 10l6 0" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-router"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 15a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -4" />
  <path d="M17 17l0 .01" />
  <path d="M13 17l0 .01" />
  <path d="M15 13l0 -2" />
  <path d="M11.75 8.75a4 4 0 0 1 6.5 0" />
  <path d="M8.5 6.5a8 8 0 0 1 13 0" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-server"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 7a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-2" />
  <path d="M3 15a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -2" />
  <path d="M7 8l0 .01" />
  <path d="M7 16l0 .01" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-solar-panel"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M4.28 14h15.44a1 1 0 0 0 .97 -1.243l-1.5 -6a1 1 0 0 0 -.97 -.757h-12.44a1 1 0 0 0 -.97 .757l-1.5 6a1 1 0 0 0 .97 1.243" />
  <path d="M4 10h16" />
  <path d="M10 6l-1 8" />
  <path d="M14 6l1 8" />
  <path d="M12 14v4" />
  <path d="M7 18h10" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-building-broadcast-tower"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  <path d="M16.616 13.924a5 5 0 1 0 -9.23 0" />
  <path d="M20.307 15.469a9 9 0 1 0 -16.615 0" />
  <path d="M9 21l3 -9l3 9" />
  <path d="M10 19h4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-device-tv"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 9a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -9" />
  <path d="M16 3l-4 4l-4 -4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-vacuum-cleaner"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M21 12a9 9 0 1 1 -18 0a9 9 0 0 1 18 0" />
  <path d="M14 9a2 2 0 1 1 -4 0a2 2 0 0 1 4 0" />
  <path d="M12 16h.01" />
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
function L(l) {
  return [...l.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((t) => t[1]).filter((t) => t !== "M0 0h24v24H0z");
}
const oi = {
  airConditioning: L(On),
  battery: L(Nn),
  bulb: L(In),
  car: L(Rn),
  chargingPile: L(Fn),
  coffee: L(Vn),
  cooker: L(Wn),
  desktop: L(Un),
  droplet: L(jn),
  flame: L(Dn),
  fridge: L(Yn),
  home: L(Gn),
  lamp: L(Xn),
  microwave: L(qn),
  plug: L(Zn),
  pool: L(Kn),
  router: L(Jn),
  server: L(Qn),
  solarPanel: L(ti),
  tower: L(ei),
  tv: L(si),
  vacuum: L(ni),
  washMachine: L(ii)
}, ri = [
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
function ai(l) {
  const t = l.toLowerCase();
  return ri.find(([e]) => e.test(t))?.[1] ?? "plug";
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
}, li = {
  solar: "#ffd43b",
  // yellow, clearly apart from the other sources
  battery: "#3ee08f",
  grid: "#4db2ff",
  home: "#2fd4b4",
  flexible: "#6f9dff",
  backup: "#ff6a3d",
  inverter: "#a8d4ff"
}, U = "#cfeaff", ci = [
  [0, -2.2, 2.2, 0],
  [1.6, 2.4, -1.8, -1.2],
  [-1.2, -1, 2, 1.4],
  [0.8, 2.2, -2.4, 0.4]
], Nt = 26, hi = 2.5, di = 0.7, It = 72, pi = 0.6, ui = 0.7, ys = 5.2, _i = 2.7, fi = 1.6, ts = { big: ys, medium: _i, small: fi }, bs = 6, ws = 0, xs = 130, _e = xs / ft.width, gi = import.meta.url.replace(/[^/]*$/, "") + ft.file, es = 0, Rt = 3.5, re = 44, ae = 18, vs = ft.face.map(([l, t]) => [bs + l * _e, ws + t * _e]), xt = (l, t) => {
  const [e, s, n, o] = vs, i = [e[0] + (s[0] - e[0]) * l, e[1] + (s[1] - e[1]) * l], c = [o[0] + (n[0] - o[0]) * l, o[1] + (n[1] - o[1]) * l];
  return [i[0] + (c[0] - i[0]) * t, i[1] + (c[1] - i[1]) * t];
}, ss = (() => {
  const [l, t, , e] = vs, s = Math.hypot(t[0] - l[0], t[1] - l[1]), n = Math.hypot(e[0] - l[0], e[1] - l[1]), o = (es + Rt) / s, i = (es + Rt) / n, c = Rt / s, r = Rt / n, a = [
    [o, 0.5 - c / 2],
    [0.5 + c / 2, 1 - o]
  ], h = [
    [i, 0.5 - r / 2],
    [0.5 + r / 2, 1 - i]
  ];
  return [0, 1, 2, 3].map((d) => {
    const [g, p] = a[d % 2], [m, f] = h[Math.floor(d / 2)];
    return {
      corners: [xt(g, m), xt(p, m), xt(p, f), xt(g, f)],
      middle: xt((g + p) / 2, (m + f) / 2),
      size: [(p - g) * s, (f - m) * n]
    };
  });
})(), fe = 82, vt = [104, fe + 26], ge = 58, Ft = [250, ge + 26], $e = 196, Vt = $e, ns = "0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1", le = (l, t = 0, e = 0) => l.map(([s, n, o, i]) => `M ${s + t} ${n + e} L ${o + t} ${i + e}`).join(" "), is = [
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
], $i = [
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
], mi = [
  [8, 86, 15, 82],
  [48, 86, 55, 82],
  [22, 40, 29, 36],
  [34, 40, 41, 36],
  [28, 2, 35, -2]
], ce = [
  [12, 12],
  [44, 12],
  [6, 24],
  [50, 24],
  [2, 36],
  [54, 36]
], rs = 10, as = 122, he = 0.7, ut = 8, Wt = 48, ls = 1.25, kt = 15, cs = 196, Kt = 0.24, Jt = [250, 116], yi = import.meta.url.replace(/[^/]*$/, "") + ct.file, me = ([l, t]) => [
  Jt[0] + (l - ct.top[0]) * Kt,
  Jt[1] + (t - ct.top[1]) * Kt
], Ut = ct.left.map(me), jt = 6, Dt = 132, bi = import.meta.url.replace(/[^/]*$/, "") + Y.file, wi = [
  [0, 0, 0, 0],
  [4, -1.5, -4, 1.5],
  [-1.5, 3, 1.5, -3],
  [-4, 1.5, 4, -1.5]
], xi = [
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
    return { ...li, ...this._config?.colours ?? {} };
  }
  // inverter centred under the house; wallbox sits on the left below the pylon
  get _invX() {
    return Ut[0][0];
  }
  get _solarX() {
    return 104;
  }
  get _houseY() {
    return ge;
  }
  get _invY() {
    return Jt[1];
  }
  get _invTop() {
    return Jt;
  }
  get _invBottom() {
    return me(ct.bottom);
  }
  get _solarY() {
    return Ut[0][1];
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
    return It + 12;
  }
  // batteries closer together in height than in the classic look, and never
  // running into the glass car on the left (5 batteries get a bit narrower)
  _displayBatteries() {
    const t = $e + 50, e = super._displayBatteries().map((c) => ({ ...c, top: t + (c.top - t) * pi }));
    if (!this._layout?.wallbox || !e.length) return e;
    const s = jt + Dt + 4;
    if (Math.min(...e.map((c) => c.cx - c.w / 2)) >= s) return e;
    const n = Math.max(...e.map((c) => c.cx + c.w / 2)), o = 4, i = Math.min(e[0].w, (n - s - o * (e.length - 1)) / e.length);
    return e.map((c, r) => ({ ...c, w: i, cx: s + i / 2 + r * (i + o) }));
  }
  // denser lists: rows of 15 instead of 22
  // the string labels sit on the middles of the panel's quarters
  get _stringPos() {
    return ss.map(({ middle: [t, e] }) => [t - re / 2, e - ae / 2]);
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
    return +(t * ui).toFixed(2);
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
    return R - 1;
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
    for (const [o, { colour: i, b: c }] of this._lastSeen) {
      if (this._seen.has(o) || s < c.begin) continue;
      const r = (s - c.begin) % c.period;
      if (r >= c.travel) continue;
      const a = c.travel - r;
      this._ghosts.push({ colour: i, route: c.route, forward: c.forward, r: c.r, from: r / c.travel, dur: a, start: s, until: performance.now() + a * 1e3 }), setTimeout(() => this.requestUpdate(), a * 1e3 + 50), n = !0;
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
    const i = s !== null && Math.abs(s) >= O;
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
    const s = Tt(e).map((r) => ts[r]), n = [];
    let o = 0;
    s.forEach((r, a) => {
      a && (o += s[a - 1] + r + hi), n.push(o / Nt);
    });
    const i = ue(t) / Nt, c = i + (n[n.length - 1] ?? 0) + di;
    return { radii: s, begins: n, travel: i, period: c };
  }
  /**
   * Lines without their own train logic (everything except the load lists)
   * get a train of balls instead of one ball whose speed or size shows the power.
   */
  _dot(t, e, s, n = !0, o = 3.2, i) {
    if (i)
      return s === null || Math.abs(s) < O ? _`` : this._ball(e, { route: t, forward: n, r: i.radius ?? o, begin: i.begin, travel: i.travel, period: i.period });
    if (s === null || Math.abs(s) < O) return _``;
    const { radii: c, travel: r, period: a, begins: h } = this._trainOf(t, s);
    return _`${h.map(
      (d, g) => this._ball(e, { route: t, forward: n, r: c[g], begin: d, travel: r, period: a })
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
    const n = (p) => t === "battery" && !p ? this._c.battery : e, o = (p, m, f) => t === "battery" && f ? this._mixedTrain(p, m) : this._dot(p, n(f), m, f), i = s.map((p) => o(p.route, p.w, p.forward));
    if (t === "pv") {
      const p = `M ${vt[0]} ${vt[1]} V ${this._solarY} H ${this._invX}`, m = this._own("solar_power"), f = s.flatMap((v) => this._arrivals(v.route, v.w));
      return _`${i}${this._dot(p, e, m, !0)}${this._blob(vt, e, m, f)}`;
    }
    const c = s.reduce((p, m) => m.w === null ? p : (p ?? 0) + m.w, null), [r, a] = this._invBottom, h = `M ${r.toFixed(1)} ${a.toFixed(1)} V ${Vt}`, d = (c ?? 0) > 0, g = [
      ...d ? this._arrivals(h, c) : [],
      ...s.filter((p) => !p.forward).flatMap((p) => this._arrivals(p.route, p.w))
    ];
    return _`${i}${o(h, c, d)}${this._blob([r, Vt], n(d), Math.abs(c ?? 0), g)}`;
  }
  /** When the balls of a train on `route` finish their way (at its end, or at its
   *  start for a train running backwards). */
  _arrivals(t, e) {
    if (e === null || Math.abs(e) < O) return [];
    const { radii: s, begins: n, travel: o, period: i } = this._trainOf(t, e);
    return n.map((c, r) => ({ at: c + o, period: i, big: s[r] === ys }));
  }
  /**
   * A drop of mercury where trains meet: its size shows the power that flows
   * through, it wobbles all the time and swells for a moment whenever a ball
   * runs into it (additive animations, one per arriving ball).
   */
  _blob([t, e], s, n, o) {
    if (n === null || Math.abs(n) < O) return _``;
    const i = 2.2 + 1.6 * Math.sqrt(Math.min(Math.abs(n), 8e3) / 1e3), c = Object.entries(this._c).find(([, h]) => h === s)?.[0], r = (h, d) => {
      const g = (h.big ? 1.4 : 0.6) * (d === "rx" ? 1.15 : 0.85), p = Math.min(0.2, 0.12 / h.period), m = Math.min(0.6, 0.55 / h.period);
      return _`<animate attributeName=${d} additive="sum" dur=${`${h.period.toFixed(2)}s`}
        begin=${`${h.at.toFixed(2)}s`} repeatCount="indefinite" values=${`0;${g};0;0`}
        keyTimes=${`0;${p.toFixed(4)};${m.toFixed(4)};1`} />`;
    }, a = (h, d, g) => {
      const p = h === "rx" ? [1, 1.1, 0.94, 1] : [1, 0.92, 1.07, 1];
      return _`<animate attributeName=${h} dur=${`${d}s`} begin=${`${g}s`} repeatCount="indefinite"
        calcMode="spline" keyTimes="0;0.33;0.66;1" keySplines=${"0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1"}
        values=${p.map((m) => (i * m).toFixed(2)).join(";")} />`;
    };
    return _`<g>
      <circle cx=${t} cy=${e} r=${i * 2.6} fill=${c ? `url(#ef-halo-${c})` : s} fill-opacity=${c ? $ : 0.2} />
      <ellipse cx=${t} cy=${e} rx=${i} ry=${i} fill=${s}>
        ${a("rx", 1.7, 0)}${a("ry", 1.7, 0)}
        ${o.map((h) => _`${r(h, "rx")}${r(h, "ry")}`)}
      </ellipse>
      <ellipse cx=${t} cy=${e} rx=${i} ry=${i} fill="url(#ef-ball)">
        ${a("rx", 1.7, 0)}${a("ry", 1.7, 0)}
        ${o.map((h) => _`${r(h, "rx")}${r(h, "ry")}`)}
      </ellipse>
      <ellipse cx=${t - i * 0.32} cy=${e - i * 0.38} rx=${i * 0.4} ry=${i * 0.24} fill="#ffffff" fill-opacity="0.85" />
    </g>`;
  }
  // the house power runs into a blob in the house box; the load trains leave it
  _houseJunction(t) {
    return this._blob(Ft, this._c.home, t, this._arrivals(this._houseIn(), t));
  }
  /** Glowing glass ball: soft halo, coloured body, white core and a sheen. */
  _orb(t, e, s, n = !1) {
    const o = t, i = Object.entries(this._c).find(([, c]) => c === e)?.[0];
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
      stroke-linecap="round" stroke-linejoin="round">${oi[t].map((i) => _`<path d=${i} />`)}</g>`;
  }
  // -- sections ------------------------------------------------------------------
  _solarIcon() {
    return _``;
  }
  /** The glass solar panel picture below the string labels. */
  _solarBack() {
    return _`<image href=${gi} x=${bs} y=${ws} width=${xs}
      height=${(ft.height * _e).toFixed(1)} />`;
  }
  /** One PV string: a glass label filling its quarter of the panel, lying in the
   *  panel's plane, with the same gap to the frame and to its neighbours. */
  _stringTile(t, e, s, n) {
    const o = t + re / 2, i = e + ae / 2, c = ss.reduce(
      (m, f) => Math.hypot(f.middle[0] - o, f.middle[1] - i) < Math.hypot(m.middle[0] - o, m.middle[1] - i) ? f : m
    ), r = c.corners.map(([m, f]) => `${m.toFixed(1)},${f.toFixed(1)}`).join(" "), [a, h] = ft.across, [d, g] = ft.down, [, p] = c.size;
    return _`
      <polygon points=${r} fill="#020a14" fill-opacity="0.35" transform="translate(0.8 1.6)" />
      <polygon points=${r} fill=${n} fill-opacity="0.12" />
      <polygon points=${r} fill="url(#ef-slab)" stroke=${n} stroke-opacity="0.6" stroke-width="0.8"
        stroke-linejoin="round" />
      <g transform=${`matrix(${a} ${h} ${d} ${g} ${o.toFixed(1)} ${i.toFixed(1)})`}>
        <text x="0" y=${-p / 2 + p * 0.52} text-anchor="middle" class="val" font-size=${this._fs(12)} font-weight="600"
          >${P(this._w(s), this._loc)}</text>
        <text x="0" y=${-p / 2 + p * 0.84} text-anchor="middle" class="tiny" style=${`font-size:${this._fs(7.5)}px`}
          >${St(this._name(s), 16)}</text>
      </g>`;
  }
  /** The glass inverter picture, placed by its connectors. */
  _inverter() {
    const [t, e] = me([0, 0]);
    return _`<image href=${yi} x=${t.toFixed(1)} y=${e.toFixed(1)}
      width=${(ct.width * Kt).toFixed(1)} height=${(ct.height * Kt).toFixed(1)} />`;
  }
  /** Glass cylinder with a moving liquid level; name, SoC, kWh, power, status inside. */
  _batteryWidget(t, e, s, n, o, i, c, r, a = null) {
    const h = e - n / 2 + 2, d = e + n / 2 - 2, g = (d - h) / 2, p = 3.5, m = s + 8, f = s + It, v = Math.max(0, Math.min(100, i ?? 0)), x = f + p - (f + p - m) * (v / 100), w = `ef-bat-${Math.round(e)}-${Math.round(s)}`, k = `M ${h} ${m} V ${f} A ${g} ${p} 0 0 0 ${d} ${f} V ${m} A ${g} ${p} 0 0 0 ${h} ${m} Z`, C = o !== null && Math.abs(o) >= O, S = this._lineFlow(t, o), z = S !== null && S > O, I = C ? 3.4 : 5.5, G = S !== null && S < -O, V = n < 54, j = a && i !== null ? W(a * i / 100, this._loc) : "";
    return _`<g>
      <ellipse cx=${e} cy=${f + 4} rx=${g + 8} ry="6" fill="url(#ef-shadow)" />
      <clipPath id=${w}><path d=${k} /></clipPath>
      <path d=${k} fill=${r} fill-opacity="0.07" />
      ${v > 0 ? _`<g clip-path=${`url(#${w})`}>
            ${this._liquid(h, d, x, f + p + 2, r, I)}
          </g>` : $}
      ${z ? _`<g clip-path=${`url(#${w})`}>${this._splash(e, m, x, g, r, S, s)}</g>` : $}
      <path d=${k} fill="url(#ef-tube)" stroke=${U} stroke-opacity="0.55" stroke-width="0.9" />
      ${G ? this._riseIntoLine(e, f, s, this._c.battery, S) : $}
      <ellipse cx=${e} cy=${m} rx=${g} ry=${p} fill=${r} fill-opacity="0.12" stroke="#e6f6ff" stroke-opacity="0.7"
        stroke-width="0.8" />
      <rect x=${e - 6} y=${s + 3} width="12" height=${m - s - 3} fill=${r} fill-opacity="0.28" stroke=${U}
        stroke-opacity="0.6" stroke-width="0.7" />
      <ellipse cx=${e} cy=${s + 3} rx="6" ry="1.8" fill="#e6f6ff" fill-opacity="0.45" />
      <text x=${e} y=${s + 20} text-anchor="middle" class="bt" font-size=${this._fs(7.5)}>${St(t, V ? 9 : 11)}</text>
      <text x=${e} y=${s + 33} text-anchor="middle" class="bt" font-size=${this._fs(13)} font-weight="600">${At(i, this._loc)}</text>
      <text x=${e} y=${s + 43} text-anchor="middle" class="bt" font-size=${this._fs(8)}>${j}</text>
      <text x=${e} y=${s + 53} text-anchor="middle" class="bt" font-size=${this._fs(8.5)}>${P(o === null ? null : Math.abs(o), this._loc)}</text>
      <text x=${e} y=${s + 62} text-anchor="middle" class="bt" font-size=${this._fs(7.5)}>${c}</text>
    </g>`;
  }
  /**
   * Liquid like a phone's charging animation: one soft surface that slowly
   * sloshes between a few shapes (no repeating waves), a lighter layer behind
   * it and a bright rim. Every shape has the same commands so SMIL can morph
   * between them. Fills x0..x1 from `lvl` down to `bottom`; clip it outside.
   */
  _liquid(t, e, s, n, o, i) {
    const c = e - t, r = ([d, g, p, m], f) => `M ${t - 1} ${(f + d).toFixed(2)} C ${(t + c * 0.35).toFixed(2)} ${(f + g).toFixed(2)} ${(e - c * 0.35).toFixed(2)} ${(f + p).toFixed(2)} ${e + 1} ${(f + m).toFixed(2)}`, a = (d, g, p) => r(ci[d], g) + (p ? ` V ${n} H ${t - 1} Z` : ""), h = (d, g, p, m) => _`<path d=${a(p[0], d, g)}>
        <animate attributeName="d" dur=${`${m.toFixed(1)}s`} repeatCount="indefinite" calcMode="spline"
          keyTimes="0;0.25;0.5;0.75;1" keySplines=${ns}
          values=${[...p, p[0]].map((f) => a(f, d, g)).join(";")} />
      </path>`;
    return _`
      <g fill=${o} fill-opacity="0.35">${h(s - 1, !0, [2, 3, 0, 1], i * 1.3)}</g>
      <g fill="url(#ef-liquid)">${h(s, !0, [0, 1, 2, 3], i)}</g>
      <g fill="none" stroke="#e9fff3" stroke-opacity="0.55" stroke-width="0.8">${h(s, !1, [0, 1, 2, 3], i)}</g>`;
  }
  // load list trains count the power in balls as well, big ones in front
  _wagonBalls(t, e, s) {
    const n = Tt(t), o = e === this._c.backup ? this._tints(n, this._backupShares(s)) : this._tints(n);
    return n.map((i, c) => ({ r: ts[i], colour: o[c] }));
  }
  /**
   * Where a battery's backup loads get their power: from the battery (green);
   * a backup-only battery passes power from the house through as well, that
   * part has the house's colours (input up to its output, the rest from the cells).
   */
  _backupShares(t) {
    const e = this._layout?.batteries.find((c) => c.name === t);
    if (!e?.backup_only) return [0, 1, 0];
    const s = Math.max(this._w(e.charge) ?? 0, 0), n = Math.max(this._w(e.discharge) ?? 0, 0), o = n > 0 ? Math.min(s, n) / n : 0, i = this._houseShares();
    return [i[0] * o, i[1] * o + (1 - o), i[2] * o];
  }
  /** Shares of PV, batteries and grid in what the house net gets right now. */
  _houseShares() {
    const t = (this._layout?.batteries ?? []).filter((e) => !e.backup_only).reduce((e, s) => e + Math.max(0, -(E(this._s(s.power)) ?? 0)), 0);
    return on(this._own("solar_power"), t, this._own("grid_power"));
  }
  /** Colours for a train's balls by source shares (PV, battery, grid); default: the house's mix. */
  _tints(t, e = this._houseShares()) {
    const s = [this._c.solar, this._c.battery, this._c.grid];
    return rn(t, e).map((n) => s[n]);
  }
  /** A train whose balls show where the power comes from (PV, battery, grid). */
  _mixedTrain(t, e, s = !0) {
    if (e === null || Math.abs(e) < O) return _``;
    const { radii: n, begins: o, travel: i, period: c } = this._trainOf(t, e), r = this._tints(Tt(e));
    return _`${o.map((a, h) => this._ball(r[h], { route: t, forward: s, r: n[h], begin: a, travel: i, period: c }))}`;
  }
  _houseDots(t, e, s) {
    return this._mixedTrain(t, s);
  }
  get _wagonSpeed() {
    return Nt;
  }
  /** A battery's own line: from the blob in the storage box to the battery's cap. */
  _route(t, e) {
    return `M ${this._invBottom[0].toFixed(1)} ${Vt} V ${Vt + Gt / 2} H ${t} V ${e}`;
  }
  _batteryRoute(t, e) {
    return this._route(t, e);
  }
  // Trains run into the glass boxes and new ones leave them: each PV string
  // into the middle of "PV gesamt", the house power from the inverter into
  // the middle of the house box, the load trains from there; backup trains
  // start at the bottom of their battery and leave through its shell.
  _stringRoute(t, e) {
    return `M ${t + re / 2} ${e + ae / 2} V ${fe + 13} H ${vt[0]} V ${vt[1]}`;
  }
  _houseIn() {
    const [t, e] = this._invTop;
    return `M ${t} ${e} V ${Ft[1]}`;
  }
  _houseLead(t) {
    return `M ${Ft[0]} ${Ft[1]} H 281 V ${t} H 285`;
  }
  _batteryLead(t, e, s, n) {
    return `M ${t} ${e + It - 2} V ${n} H ${this._batteryOutX(t, s)}`;
  }
  /**
   * Bubbles of a discharging battery: each rises from the bottom to the cap
   * and arrives just when a ball of the outgoing train starts there, so it
   * looks as if the bubble drives on into the line.
   */
  _riseIntoLine(t, e, s, n, o) {
    const i = s + 3, { radii: c, begins: r, period: a } = this._trainOf(this._route(t, s), o);
    return _`${r.map((h, d) => {
      const g = c[d], p = Math.min(a * 0.8, (e - i) / Nt), m = (p / a).toFixed(4), f = `${a.toFixed(2)}s`, v = `${(h - p).toFixed(2)}s`;
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
  _splash(t, e, s, n, o, i, c) {
    const { travel: r, period: a, begins: h } = this._trainOf(this._route(t, c), i), d = this._tints(Tt(i));
    return _`${h.map((g, p) => this._splashOnce(t, e, s, n, d[p] ?? o, a, g + r))}`;
  }
  /** One drop with ripple, repeating every `period` s from `start` s on. */
  _splashOnce(t, e, s, n, o, i, c) {
    const a = Math.min(0.45, i * 0.35) / i, h = Math.min(0.97, a + 0.6 / i), d = a + (h - a) * 0.4, g = a + 1e-3, p = (x) => x.toFixed(3), m = `${i.toFixed(2)}s`, f = `${c.toFixed(2)}s`, v = (x, w, k, C = !1) => _`<animate attributeName=${x}
      dur=${m} begin=${f} repeatCount="indefinite" values=${w} keyTimes=${k}
      calcMode=${C ? "spline" : "linear"} keySplines=${C ? "0.55 0 1 0.6;0 0 1 1" : $} />`;
    return _`
      <ellipse cx=${t} cy=${e} rx="1.5" ry="2.1" fill=${o} stroke="#ffffff" stroke-opacity="0.7" stroke-width="0.4" opacity="0">
        ${v("cy", `${e + 1};${s - 1};${s - 1}`, `0;${p(a)};1`, !0)}
        ${v("opacity", "1;1;0;0", `0;${p(a)};${p(g)};1`)}
      </ellipse>
      <ellipse cx=${t} cy=${s} rx="1" ry="0.5" fill="none" stroke="#e9fff3" stroke-width="0.8" opacity="0">
        ${v("rx", `1;1;${p(n * 0.75)};${p(n * 0.75)}`, `0;${p(a)};${p(h)};1`)}
        ${v("ry", "0.5;0.5;2;2", `0;${p(a)};${p(h)};1`)}
        ${v("opacity", "0;0;0.9;0;0", `0;${p(a)};${p(g)};${p(h)};1`)}
      </ellipse>
      ${[-1, 1].map(
      (x) => _`<circle cx=${t + x * 3} cy=${s} r="0.9" fill=${o} stroke="#ffffff" stroke-opacity="0.6" stroke-width="0.3"
          opacity="0">
          ${v("cy", `${s};${s};${s - 6};${s};${s}`, `0;${p(a)};${p(d)};${p(h)};1`)}
          ${v("cx", `${t};${t};${t + x * 3};${t + x * 5};${t + x * 5}`, `0;${p(a)};${p(d)};${p(h)};1`)}
          ${v("opacity", "0;0;1;0;0", `0;${p(a)};${p(g)};${p(h)};1`)}
        </circle>`
    )}`;
  }
  /** 2.5D glass house: gable front, side wall, roof, chimney and warm windows. */
  _houseIcon(t) {
    const e = this._c.solar;
    return _`<g transform=${`translate(225 ${ge - 51}) scale(0.9)`}>
      <ellipse cx="28" cy="50" rx="30" ry="5" fill="url(#ef-shadow)" />
      <polygon points="4,28 14,18 42,6 32,16" fill=${t} fill-opacity="0.08" stroke=${U} stroke-opacity="0.3" stroke-width="0.7" />
      <polygon points="24,52 52,40 52,24 24,36" fill=${t} fill-opacity="0.12" stroke=${U} stroke-opacity="0.6" stroke-width="0.8" />
      <polygon points="24,52 52,40 52,24 24,36" fill="url(#ef-slab)" />
      <polygon points="4,44 24,52 24,36 14,18 4,28" fill=${t} fill-opacity="0.2" stroke=${U} stroke-opacity="0.75" stroke-width="0.9" />
      <polygon points="4,44 24,52 24,36 14,18 4,28" fill="url(#ef-slab)" />
      <polygon points="24,36 52,24 42,6 14,18" fill=${t} fill-opacity="0.28" stroke=${U} stroke-opacity="0.75" stroke-width="0.9" />
      <polygon points="24,36 52,24 42,6 14,18" fill="url(#ef-sheen)" />
      <polygon points="36.6,15 39.4,13.8 39.4,5.8 36.6,7" fill=${t} fill-opacity="0.35" stroke=${U} stroke-opacity="0.7" stroke-width="0.7" />
      <polygon points="28.2,43.2 35.2,40.2 35.2,32.2 28.2,35.2" fill=${e} fill-opacity="0.5" stroke=${e} stroke-opacity="0.8" stroke-width="0.6" />
      <polygon points="40.8,37.8 47.8,34.8 47.8,26.8 40.8,29.8" fill=${e} fill-opacity="0.5" stroke=${e} stroke-opacity="0.8" stroke-width="0.6" />
      <polygon points="12,47.2 17,49.2 17,37.2 12,35.2" fill=${t} fill-opacity="0.4" stroke=${U} stroke-opacity="0.7" stroke-width="0.6" />
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
    const t = this._c.grid, e = this._invX, { grid: s, exporting: n, cents: o, label: i, power: c, imp: r, exp: a } = this._gridData(), [h, d] = ce[ce.length - 1], g = rs + h * he, p = as + (d + 6) * he, m = Ut[1][1], f = Math.max(p, m) + 12, v = `M ${g.toFixed(1)} ${p.toFixed(1)} Q ${((g + e) / 2).toFixed(1)} ${f.toFixed(1)} ${e} ${m}`, x = o !== null ? Ae(o, this._loc) : "", w = [
      { arrow: "↓", kwh: r, name: "Bez.", active: i === "Bezug" },
      { arrow: "↑", kwh: a, name: "Einsp.", active: i === "Einspeisung" }
    ].filter((z) => z.kwh !== null), k = cs, C = k + (o !== null ? 23 : 15), S = C - k + (w.length ? w.length * 8.5 + 3 : 0);
    return _`
      ${this._pylon(t)}
      ${this._flow(v, t, s, !n)}
      ${this._tap(this._layout.entities.grid_power, this._panel(ut, k, Wt, S, t))}
      <text x=${ut + Wt / 2} y=${k + 11} text-anchor="middle" class="val" font-size=${this._fs(11.5)} font-weight="600"
        >${c}</text>
      ${o !== null ? _`<text x=${ut + Wt / 2} y=${k + 19.5} text-anchor="middle" class="dim" style=${`font-size:${this._fs(8.5)}px`}>${x}</text>` : $}
      ${w.length ? _`<line x1=${ut + 3} x2=${ut + Wt - 3} y1=${C} y2=${C} class="sep" stroke=${t} />` : $}
      ${w.map(
      (z, I) => _`<text x=${ut + 3} y=${C + 8 + I * 8.5} class=${z.active ? "val" : "dim"} style=${`font-size:${this._fs(7.8)}px`}
          ><tspan fill=${z.active ? t : $}>${z.arrow}</tspan> ${W(z.kwh, this._loc)}<tspan
          class=${z.active ? "" : "tiny"} style=${`font-size:${this._fs(7.5)}px`} fill=${z.active ? t : $}> ${z.name}</tspan></text>`
    )}
      ${this._wallbox(this._carTop(k + S + 8))}
    `;
  }
  /** Top of the car picture: its plate ends flush with the lowest battery, but
   *  never higher than `min` (just below the grid tile). */
  _carTop(t) {
    const e = this._displayBatteries();
    if (!e.length) return t;
    const s = Math.max(...e.map((n) => n.top)) + It + 3.5;
    return Math.max(t, s - Y.height * (Dt / Y.width));
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
    const s = e.flexible ? this._c.flexible : this._c.home, n = this._w(e.power), o = E(this._s(e.soc ?? void 0)), i = E(this._s(e.today ?? void 0)), c = n === null || Math.abs(n) < O, r = !c && (n ?? 0) > 0, a = Dt / Y.width, h = ([X, T]) => [jt + X * a, t + T * a], d = o === null ? null : Math.max(0, Math.min(100, o)) / 100, g = (d ?? 0) * Y.liquidHeight, [p, m, f, v] = Y.floorQuad, x = ([X, T], tt) => `${X.toFixed(1)},${(T - tt).toFixed(1)}`, w = (X) => {
      const [T, tt, pt, He] = X.map((ks) => Math.max(0, g + ks));
      return {
        body: [x(p, 0), x(m, 0), x(f, 0), x(f, pt), x(v, He), x(p, T)].join(" "),
        surface: [x(p, T), x(m, tt), x(f, pt), x(v, He)].join(" "),
        edge: [x(p, T), x(m, tt), x(f, pt)].join(" ")
      };
    }, k = wi.map((X) => w(X)), C = r ? 3.4 : 5.5, S = (X) => _`<animate attributeName="points" dur=${`${C}s`}
      repeatCount="indefinite" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" keySplines=${ns}
      values=${[...k, k[0]].map((T) => T[X]).join(";")} />`, z = `ef-car-${Math.round(t)}`, I = `translate(${jt} ${t}) scale(${a.toFixed(5)})`, G = this._invX, V = Ut[2][1], [j, u] = h(Y.wallboxTop), b = cs - 12, M = `M ${G} ${V} H ${G - 10} V ${b} H ${j.toFixed(1)} V ${u.toFixed(1)}`, [A, D] = h(Y.powerText), [yt, Z] = h(Y.energyText), it = Y.edgeAngle, [bt, ne] = h([(m[0] + f[0]) / 2, (m[1] + f[1]) / 2 - Math.max(g / 2, 14)]);
    return _`
      ${this._flow(M, s, n, !0, !1)}
      ${this._mixedTrain(M, n)}
      <g class="tap" data-entity=${e.power}>
        <title>${e.name} · ${e.flexible ? "Zusatzverbraucher" : "Grundlast"}</title>
        <image href=${bi} x=${jt} y=${t} width=${Dt} height=${(Y.height * a).toFixed(1)} />
        ${d ? _`<g transform=${I}>
              <clipPath id=${z}><polygon points=${Y.tank} /></clipPath>
              <g clip-path=${`url(#${z})`} opacity="0.7">
                <polygon points=${k[0].body} fill="url(#ef-liquid)">${S("body")}</polygon>
                <polygon points=${k[0].surface} fill="#c8ffe0" fill-opacity="0.45">${S("surface")}</polygon>
                <polyline points=${k[0].edge} fill="none" stroke="#e9fff3" stroke-opacity="0.85" stroke-width="2.4"
                  stroke-linejoin="round">${S("edge")}</polyline>
              </g>
            </g>` : $}
        ${o !== null ? _`<text x=${bt.toFixed(1)} y=${ne.toFixed(1)} text-anchor="middle" class="bt" font-size=${this._fs(9)}
              font-weight="600">${At(o, this._loc)}</text>` : $}
        <text transform=${`translate(${A.toFixed(1)} ${D.toFixed(1)}) rotate(${it})`} class=${c ? "dim" : "val"}
          style=${`font-size:${this._fs(11)}px`} font-weight="600">${P(n, this._loc)}</text>
        <text transform=${`translate(${yt.toFixed(1)} ${Z.toFixed(1)}) rotate(${-it})`} class="dim"
          style=${`font-size:${this._fs(11)}px`}>${W(i, this._loc)}</text>
      </g>`;
  }
  /** Free-standing pylon of glass rods on a hexagonal glass plate. */
  _pylon(t) {
    const e = le([...is, ...os, ...$i]), s = le([...is, ...os], 7, -4), n = le(mi), o = "65.5,84 48.5,92.7 14.5,92.7 -2.5,84 14.5,75.3 48.5,75.3";
    return _`<g transform=${`translate(${rs} ${as}) scale(${he})`}>
      <ellipse cx="31.5" cy="97" rx="40" ry="7" fill="url(#ef-shadow)" />
      <polygon points=${"65.5,84 65.5,87 48.5,95.7 14.5,95.7 -2.5,87 -2.5,84 14.5,92.7 48.5,92.7"} fill=${t} fill-opacity="0.3" stroke=${U} stroke-opacity="0.4" stroke-width="0.6" />
      <polygon points=${o} fill=${t} fill-opacity="0.14" stroke=${U} stroke-opacity="0.65" stroke-width="0.8" />
      <polygon points=${o} fill="url(#ef-slab)" />
      <path d=${s} fill="none" stroke=${t} stroke-opacity="0.22" stroke-width="2.6" stroke-linecap="round" />
      <path d=${s} fill="none" stroke=${U} stroke-opacity="0.4" stroke-width="0.7" stroke-linecap="round" />
      <path d=${n} fill="none" stroke=${U} stroke-opacity="0.35" stroke-width="1.4" stroke-linecap="round" />
      <path d=${e} fill="none" stroke=${t} stroke-opacity="0.35" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" />
      <path d=${e} fill="none" stroke="#e6f6ff" stroke-opacity="0.9" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
      ${ce.map(
      ([c, r]) => _`
          <path d=${`M ${c} ${r} V ${r + 6}`} stroke=${U} stroke-opacity="0.8" stroke-width="0.8" />
          <circle cx=${c} cy=${r + 2.5} r="1.4" fill=${t} /><circle cx=${c} cy=${r + 5} r="1.4" fill=${t} />
          <circle cx=${c} cy=${r + 3.7} r="0.6" fill="#ffffff" />`
    )}
      ${xi.map(([c, r]) => _`<circle cx=${c} cy=${r} r="1.3" fill="#ffffff" fill-opacity="0.85" />`)}
    </g>`;
  }
  // -- load groups -------------------------------------------------------------
  /** Each group sits on its own tinted glass slab. */
  // a small "Gesamt" box above all load groups: every consumer incl. backup loads
  get _groupsTop() {
    return 22 + kt + ls;
  }
  _listsHeader(t) {
    const e = R - 12, s = 4, n = this._c.home, o = E(this._s(this._layout?.home_today));
    return this._tap(this._layout?.entities.home_power, _`
      ${this._panel(e, s, K + 3 - e, kt, n)}
      <text x=${R - 6} y=${s + kt * 0.68} class="small grp" fill=${n}>Gesamt</text>
      <text x=${nt - 1} y=${s + kt * 0.68} text-anchor="end" class="val" style=${`font-size:${this._fs(10)}px`}
        font-weight="600">${P(t, this._loc)}</text>
      <text x=${K - 1} y=${s + kt * 0.68} text-anchor="end" class="dim" style=${`font-size:${this._fs(9)}px`}
        >${W(o, this._loc)}</text>`);
  }
  _groupPanel(t) {
    const e = R - 12, s = t.titleY - 13, n = t.y0 + t.rows * this._rowH + 3;
    return this._panel(e, s, K + 3 - e, n - s, t.colour);
  }
  _groupIcon() {
    return _``;
  }
  _groupTitle(t, e, s, n, o) {
    const i = o.reduce((c, r) => {
      const a = E(this._s(r.today));
      return a === null ? c : (c ?? 0) + a;
    }, null);
    return _`
      <text x=${R - 6} y=${t} class="small grp" fill=${e}>${s}</text>
      <text x=${nt - 1} y=${t} text-anchor="end" class="small" style=${`font-size:${this._fs(8)}px`} fill=${e}>${P(n, this._loc)}</text>
      <text x=${K - 1} y=${t} text-anchor="end" class="small" style=${`font-size:${this._fs(8)}px`} fill=${e}>${W(i, this._loc)}</text>`;
  }
  /** Line icon chosen from the name, then the name (wrapped if long). */
  _nameBox(t, e, s, n = t, o = 0) {
    const i = this._rowH, c = 9, r = R + o, a = r + c + 3, h = nt - Q - 2 - a, { lines: d, small: g } = pe(t, Math.floor(h / 5.2), Math.floor(h / 4.2));
    return _`<g>
      <title>${n}</title>
      ${this._line(ai(t), r, e + (i - c) / 2, c, s)}
      ${g ? _`<text x=${a} y=${e + i / 2 - 1.5} class="name" font-size=${this._fs(7.5)}>${d[0]}</text>
              <text x=${a} y=${e + i / 2 + 5.5} class="name" font-size=${this._fs(7.5)}>${d[1] ?? ""}</text>` : _`<text x=${a} y=${e + i / 2 + 3} class="name" font-size=${this._fs(9.5)}>${d[0]}</text>`}
    </g>`;
  }
  /** Plain right-aligned numbers: the group slab is the glass. */
  _valueCell(t, e, s, n, o, i, c, r) {
    return _`<text x=${t + s - 1} y=${e + n / 2 + c * 0.36} text-anchor="end" class=${r === "power" ? "val" : "dim"}
      font-size=${this._fs(c + 0.5)}>${i}</text>`;
  }
};
ze.styles = [
  J.styles,
  Qt`
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
  Zt as U,
  Qt as a,
  y as b,
  Mi as g,
  lt as i,
  mt as n,
  H as r
};
