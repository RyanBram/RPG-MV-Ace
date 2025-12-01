/*!
 * @pixi/picture - v4.0.0
 * Compiled Tue, 25 Apr 2023 17:44:32 UTC
 *
 * @pixi/picture is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 *
 * Copyright 2023, Ivan Popelyshev, All Rights Reserved
 */ ((this.PIXI = this.PIXI || {}),
  (this.PIXI.picture = (function (u, a) {
    "use strict";
    class M extends a.Filter {
      constructor() {
        (super(...arguments),
          (this.backdropUniformName = null),
          (this._backdropActive = !1),
          (this.clearColor = null));
      }
    }
    const z = `
varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uBackdrop;
uniform vec2 uBackdrop_flipY;

%UNIFORM_CODE%

void main(void)
{
   vec2 backdropCoord = vec2(vTextureCoord.x, uBackdrop_flipY.x + uBackdrop_flipY.y * vTextureCoord.y);
   vec4 b_src = texture2D(uSampler, vTextureCoord);
   vec4 b_dest = texture2D(uBackdrop, backdropCoord);
   vec4 b_res = b_dest;
   
   %BLEND_CODE%

   gl_FragColor = b_res;
}`;
    class E extends M {
      constructor(e) {
        let i = z;
        ((i = i.replace("%UNIFORM_CODE%", e.uniformCode || "")),
          (i = i.replace("%BLEND_CODE%", e.blendCode || "")),
          super(void 0, i, e.uniforms),
          (this.backdropUniformName = "uBackdrop"));
      }
    }
    const W = `
attribute vec2 aVertexPosition;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

uniform vec4 inputSize;
uniform vec4 outputFrame;
uniform vec2 flipY;

vec4 filterVertexPosition( void )
{
    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
    return aVertexPosition * (outputFrame.zw * inputSize.zw);
}

void main(void)
{
    gl_Position = filterVertexPosition();
    vTextureCoord = filterTextureCoord();
    vTextureCoord.y = flipY.x + flipY.y * vTextureCoord.y;
}

`;
    class A extends a.Filter {
      constructor(e, i) {
        const s = i || {};
        (s.flipY || (s.flipY = new Float32Array([0, 1])), super(W, e, s));
      }
    }
    var S = ((r) => (
      (r[(r.RED = 0)] = "RED"),
      (r[(r.GREEN = 1)] = "GREEN"),
      (r[(r.BLUE = 2)] = "BLUE"),
      (r[(r.ALPHA = 3)] = "ALPHA"),
      r
    ))(S || {});
    class N {
      constructor(e = !1, i = 3) {
        ((this.maskBefore = e),
          (this.uniformCode = "uniform vec4 uChannel;"),
          (this.uniforms = { uChannel: new Float32Array([0, 0, 0, 0]) }),
          (this.blendCode = "b_res = dot(b_src, uChannel) * b_dest;"),
          (this.safeFlipY = !1),
          (this.uniforms.uChannel[i] = 1));
      }
    }
    const X = new Float32Array([0, 1]),
      g = class extends E {
        constructor(e, i = new N()) {
          (super(i),
            (this.baseFilter = e),
            (this.config = i),
            (this.padding = e.padding),
            (this.safeFlipY = i.safeFlipY));
        }
        apply(e, i, s, n) {
          const t = e.getFilterTexture(i);
          if (this.config.maskBefore) {
            const { blendMode: o } = this.state;
            ((this.state.blendMode = a.BLEND_MODES.NONE),
              e.applyFilter(this, i, t, a.CLEAR_MODES.YES),
              (this.baseFilter.blendMode = o),
              this.baseFilter.apply(e, t, s, n),
              (this.state.blendMode = o));
          } else {
            const { uBackdrop: o, uBackdrop_flipY: h } = this.uniforms;
            if (h[1] > 0 || this.safeFlipY)
              this.baseFilter.apply(e, o, t, a.CLEAR_MODES.YES);
            else {
              const f = e.getFilterTexture(i);
              (g._flipYFilter || (g._flipYFilter = new A()),
                (g._flipYFilter.uniforms.flipY[0] = h[0]),
                (g._flipYFilter.uniforms.flipY[1] = h[1]),
                g._flipYFilter.apply(e, o, f, a.CLEAR_MODES.YES),
                this.baseFilter.apply(e, f, t, a.CLEAR_MODES.YES),
                e.returnFilterTexture(f),
                (this.uniforms.uBackdrop_flipY = X));
            }
            ((this.uniforms.uBackdrop = t),
              e.applyFilter(this, i, s, n),
              (this.uniforms.uBackdrop = o),
              (this.uniforms.uBackdrop_flipY = h));
          }
          e.returnFilterTexture(t);
        }
      };
    let x = g;
    x._flipYFilter = null;
    const C = `if (b_src.a == 0.0) {
  gl_FragColor = vec4(0, 0, 0, 0);
  return;
}
if (b_dest.a == 0.0) {
  gl_FragColor = b_src;
  return;
}
vec3 Cb = b_dest.rgb / b_dest.a;
vec3 Cs = b_src.rgb / b_src.a;
%NPM_BLEND%
// SWAP SRC WITH NPM BLEND
vec3 new_src = (1.0 - b_dest.a) * Cs + b_dest.a * B;
// PORTER DUFF PMA COMPOSITION MODE
b_res.a = b_src.a + b_dest.a * (1.0-b_src.a);
b_res.rgb = b_src.a * new_src + (1.0 - b_src.a) * b_dest.rgb;
`,
      R = `vec3 multiply = Cb * Cs * 2.0;
vec3 Cb2 = Cb * 2.0 - 1.0;
vec3 screen = Cb2 + Cs - Cb2 * Cs;
vec3 B;
if (Cb.r <= 0.5) {
  B.r = multiply.r;
} else {
  B.r = screen.r;
}
if (Cb.g <= 0.5) {
  B.g = multiply.g;
} else {
  B.g = screen.g;
}
if (Cb.b <= 0.5) {
  B.b = multiply.b;
} else {
  B.b = screen.b;
}
`,
      P = `vec3 multiply = Cb * Cs * 2.0;
vec3 Cs2 = Cs * 2.0 - 1.0;
vec3 screen = Cb + Cs2 - Cb * Cs2;
vec3 B;
if (Cs.r <= 0.5) {
  B.r = multiply.r;
} else {
  B.r = screen.r;
}
if (Cs.g <= 0.5) {
  B.g = multiply.g;
} else {
  B.g = screen.g;
}
if (Cs.b <= 0.5) {
  B.b = multiply.b;
} else {
  B.b = screen.b;
}
`,
      Y = `vec3 first = Cb - (1.0 - 2.0 * Cs) * Cb * (1.0 - Cb);
vec3 B;
vec3 D;
if (Cs.r <= 0.5)
{
  B.r = first.r;
}
else
{
  if (Cb.r <= 0.25)
  {
    D.r = ((16.0 * Cb.r - 12.0) * Cb.r + 4.0) * Cb.r;    
  }
  else
  {
    D.r = sqrt(Cb.r);
  }
  B.r = Cb.r + (2.0 * Cs.r - 1.0) * (D.r - Cb.r);
}
if (Cs.g <= 0.5)
{
  B.g = first.g;
}
else
{
  if (Cb.g <= 0.25)
  {
    D.g = ((16.0 * Cb.g - 12.0) * Cb.g + 4.0) * Cb.g;    
  }
  else
  {
    D.g = sqrt(Cb.g);
  }
  B.g = Cb.g + (2.0 * Cs.g - 1.0) * (D.g - Cb.g);
}
if (Cs.b <= 0.5)
{
  B.b = first.b;
}
else
{
  if (Cb.b <= 0.25)
  {
    D.b = ((16.0 * Cb.b - 12.0) * Cb.b + 4.0) * Cb.b;    
  }
  else
  {
    D.b = sqrt(Cb.b);
  }
  B.b = Cb.b + (2.0 * Cs.b - 1.0) * (D.b - Cb.b);
}
`,
      O = `vec3 B = Cs * Cb;
`,
      k = C.replace("%NPM_BLEND%", R),
      w = C.replace("%NPM_BLEND%", P),
      I = C.replace("%NPM_BLEND%", Y),
      U = C.replace("%NPM_BLEND%", O),
      F = [];
    ((F[a.BLEND_MODES.MULTIPLY] = U),
      (F[a.BLEND_MODES.OVERLAY] = k),
      (F[a.BLEND_MODES.HARD_LIGHT] = w),
      (F[a.BLEND_MODES.SOFT_LIGHT] = I));
    const B = [],
      v = [];
    function H(r) {
      return F[r] ? (B[r] || (B[r] = new E({ blendCode: F[r] })), B[r]) : null;
    }
    function D(r) {
      return F[r] ? (v[r] || (v[r] = [H(r)]), v[r]) : null;
    }
    class $ extends a.Sprite {
      _render(e) {
        const i = this._texture;
        if (!i || !i.valid) return;
        const s = D(this.blendMode),
          n = this.blendMode;
        if (s) {
          if ((e.batch.flush(), !e.filter.pushWithCheck(this, s))) return;
          this.blendMode = a.BLEND_MODES.NORMAL;
        }
        (this.calculateVertices(),
          e.batch.setObjectRenderer(e.plugins[this.pluginName]),
          e.plugins[this.pluginName].render(this),
          s && (e.batch.flush(), e.filter.pop(), (this.blendMode = n)));
      }
    }
    class q extends a.TilingSprite {
      _render(e) {
        const i = this._texture;
        if (!i || !i.valid) return;
        const s = D(this.blendMode);
        (s && (e.batch.flush(), !e.filter.pushWithCheck(this, s))) ||
          (this.tileTransform.updateLocalTransform(),
          this.uvMatrix.update(),
          e.batch.setObjectRenderer(e.plugins[this.pluginName]),
          e.plugins[this.pluginName].render(this),
          s && (e.batch.flush(), e.filter.pop()));
      }
    }
    class K {
      constructor() {
        ((this.renderTexture = null),
          (this.target = null),
          (this.legacy = !1),
          (this.resolution = 1),
          (this.sourceFrame = new a.Rectangle()),
          (this.destinationFrame = new a.Rectangle()),
          (this.filters = []));
      }
      clear() {
        ((this.target = null),
          (this.filters = null),
          (this.renderTexture = null));
      }
    }
    function J(r, e) {
      const i = e.x + e.width,
        s = e.y + e.height,
        n = r.x + r.width,
        t = r.y + r.height;
      return (
        e.x >= r.x &&
        e.x <= n &&
        e.y >= r.y &&
        e.y <= t &&
        i >= r.x &&
        i <= n &&
        s >= r.y &&
        s <= t
      );
    }
    function Q(r, e = 0) {
      const i = this,
        { gl: s } = i;
      (this.currentLocation !== e &&
        ((i.currentLocation = e), s.activeTexture(s.TEXTURE0 + e)),
        this.bind(r, e));
    }
    function Z(r, e, i = !0) {
      const s = this.renderer,
        n = this.defaultFilterStack,
        t = this.statePool.pop() || new K();
      let o = e[0].resolution,
        h = e[0].padding,
        f = e[0].autoFit,
        l = e[0].legacy;
      for (let c = 1; c < e.length; c++) {
        const m = e[c];
        ((o = Math.min(o, m.resolution)),
          (h = this.useMaxPadding ? Math.max(h, m.padding) : h + m.padding),
          (f = f && m.autoFit),
          (l = l || m.legacy));
      }
      (n.length === 1 &&
        (this.defaultFilterStack[0].renderTexture = s.renderTexture.current),
        n.push(t),
        (t.resolution = o),
        (t.legacy = l),
        (t.target = r),
        t.sourceFrame.copyFrom(r.filterArea || r.getBounds(!0)),
        t.sourceFrame.pad(h));
      let d = !0;
      if (
        (f
          ? t.sourceFrame.fit(this.renderer.renderTexture.sourceFrame)
          : (d = J(this.renderer.renderTexture.sourceFrame, t.sourceFrame)),
        i && t.sourceFrame.width <= 1 && t.sourceFrame.height <= 1)
      )
        return (n.pop(), t.clear(), this.statePool.push(t), !1);
      if ((t.sourceFrame.ceil(o), d)) {
        let c = null,
          m = null;
        for (let T = 0; T < e.length; T++) {
          const L = e[T].backdropUniformName;
          if (L) {
            const { uniforms: _ } = e[T];
            _[`${L}_flipY`] || (_[`${L}_flipY`] = new Float32Array([0, 1]));
            const y = _[`${L}_flipY`];
            (c === null
              ? ((c = this.prepareBackdrop(t.sourceFrame, y)), (m = y))
              : ((y[0] = m[0]), (y[1] = m[1])),
              (_[L] = c),
              c && (e[T]._backdropActive = !0));
          }
        }
        c && (o = t.resolution = c.resolution);
      }
      ((t.renderTexture = this.getOptimalFilterTexture(
        t.sourceFrame.width,
        t.sourceFrame.height,
        o,
      )),
        (t.filters = e),
        (t.destinationFrame.width = t.renderTexture.width),
        (t.destinationFrame.height = t.renderTexture.height));
      const p = this.tempRect;
      ((p.width = t.sourceFrame.width),
        (p.height = t.sourceFrame.height),
        (t.renderTexture.filterFrame = t.sourceFrame),
        s.renderTexture.bind(t.renderTexture, t.sourceFrame, p),
        s.renderTexture.clear());
      const b = e[e.length - 1].clearColor;
      return (
        b
          ? s.framebuffer.clear(b[0], b[1], b[2], b[3])
          : s.framebuffer.clear(0, 0, 0, 0),
        !0
      );
    }
    function j(r, e) {
      return this.pushWithCheck(r, e, !1);
    }
    function ee() {
      const r = this.defaultFilterStack,
        e = r.pop(),
        i = e.filters;
      this.activeState = e;
      const s = this.globalUniforms.uniforms;
      ((s.outputFrame = e.sourceFrame), (s.resolution = e.resolution));
      const n = s.inputSize,
        t = s.inputPixel,
        o = s.inputClamp;
      if (
        ((n[0] = e.destinationFrame.width),
        (n[1] = e.destinationFrame.height),
        (n[2] = 1 / n[0]),
        (n[3] = 1 / n[1]),
        (t[0] = n[0] * e.resolution),
        (t[1] = n[1] * e.resolution),
        (t[2] = 1 / t[0]),
        (t[3] = 1 / t[1]),
        (o[0] = 0.5 * t[2]),
        (o[1] = 0.5 * t[3]),
        (o[2] = e.sourceFrame.width * n[2] - 0.5 * t[2]),
        (o[3] = e.sourceFrame.height * n[3] - 0.5 * t[3]),
        e.legacy)
      ) {
        const l = s.filterArea;
        ((l[0] = e.destinationFrame.width),
          (l[1] = e.destinationFrame.height),
          (l[2] = e.sourceFrame.x),
          (l[3] = e.sourceFrame.y),
          (s.filterClamp = s.inputClamp));
      }
      this.globalUniforms.update();
      const h = r[r.length - 1];
      if (
        (e.renderTexture.framebuffer.multisample > 1 &&
          this.renderer.framebuffer.blit(),
        i.length === 1)
      )
        (i[0].apply(
          this,
          e.renderTexture,
          h.renderTexture,
          a.CLEAR_MODES.BLEND,
          e,
        ),
          this.returnFilterTexture(e.renderTexture));
      else {
        let l = e.renderTexture,
          d = this.getOptimalFilterTexture(l.width, l.height, e.resolution);
        d.filterFrame = l.filterFrame;
        let p = 0;
        for (p = 0; p < i.length - 1; ++p) {
          i[p].apply(this, l, d, a.CLEAR_MODES.CLEAR, e);
          const b = l;
          ((l = d), (d = b));
        }
        (i[p].apply(this, l, h.renderTexture, a.CLEAR_MODES.BLEND, e),
          this.returnFilterTexture(l),
          this.returnFilterTexture(d));
      }
      let f = !1;
      for (let l = 0; l < i.length; l++)
        if (i[l]._backdropActive) {
          const d = i[l].backdropUniformName;
          (f || (this.returnFilterTexture(i[l].uniforms[d]), (f = !0)),
            (i[l].uniforms[d] = null),
            (i[l]._backdropActive = !1));
        }
      (e.clear(), this.statePool.push(e));
    }
    let G = !1;
    function re(r, e) {
      const i = this.renderer,
        s = i.renderTexture.current,
        n = this.renderer.renderTexture.sourceFrame,
        t = i.projection.transform || a.Matrix.IDENTITY;
      let o = 1;
      if (s) ((o = s.baseTexture.resolution), (e[1] = 1));
      else {
        if (!this.renderer.transparent)
          return (
            G ||
              ((G = !0),
              console.warn(
                "pixi-picture: you are trying to use Blend Filter on main framebuffer!",
              ),
              console.warn(
                "pixi-picture: please set transparent=true in renderer creation params",
              )),
            null
          );
        ((o = i.resolution), (e[1] = -1));
      }
      const h = Math.round((r.x - n.x + t.tx) * o),
        f = r.y - n.y + t.ty,
        l = Math.round((e[1] < 0 ? n.height - (f + r.height) : f) * o),
        d = Math.round(r.width * o),
        p = Math.round(r.height * o),
        b = i.gl,
        c = this.getOptimalFilterTexture(d, p, 1);
      return (
        e[1] < 0 && (e[0] = p / c.height),
        (c.filterFrame = n),
        c.setResolution(o),
        i.texture.bindForceLocation(c.baseTexture, 0),
        b.copyTexSubImage2D(b.TEXTURE_2D, 0, 0, 0, h, l, d, p),
        c
      );
    }
    function V() {
      ((a.systems.TextureSystem.prototype.bindForceLocation = Q),
        (a.systems.FilterSystem.prototype.push = j),
        (a.systems.FilterSystem.prototype.pushWithCheck = Z),
        (a.systems.FilterSystem.prototype.pop = ee),
        (a.systems.FilterSystem.prototype.prepareBackdrop = re));
    }
    return (
      V(),
      (u.BackdropFilter = M),
      (u.BlendFilter = E),
      (u.FlipYFilter = A),
      (u.HARDLIGHT_FULL = w),
      (u.HARDLIGHT_PART = P),
      (u.MASK_CHANNEL = S),
      (u.MULTIPLY_FULL = U),
      (u.MULTIPLY_PART = O),
      (u.MaskConfig = N),
      (u.MaskFilter = x),
      (u.NPM_BLEND = C),
      (u.OVERLAY_FULL = k),
      (u.OVERLAY_PART = R),
      (u.SOFTLIGHT_FULL = I),
      (u.SOFTLIGHT_PART = Y),
      (u.Sprite = $),
      (u.TilingSprite = q),
      (u.applyMixins = V),
      (u.blendFullArray = F),
      (u.getBlendFilter = H),
      (u.getBlendFilterArray = D),
      u
    );
  })({}, PIXI)));
//# sourceMappingURL=pixi-picture.js.map
