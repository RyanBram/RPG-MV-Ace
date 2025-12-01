/*!
 * @pixi/picture - v4.1.1
 * Compiled Wed, 04 Jun 2025 15:23:12 UTC
 *
 * @pixi/picture is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 *
 * Copyright 2025, Ivan Popelyshev, All Rights Reserved
 */ ((this.PIXI = this.PIXI || {}),
  (this.PIXI.picture = (function (u, i, re, ne, I) {
    "use strict";
    class w extends i.Filter {
      constructor() {
        (super(...arguments),
          (this.backdropUniformName = null),
          (this.trivial = !1),
          (this._backdropActive = !1),
          (this.clearColor = null));
      }
    }
    const ie = `
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
    class N extends w {
      constructor(e) {
        let r = ie;
        ((r = r.replace("%UNIFORM_CODE%", e.uniformCode || "")),
          (r = r.replace("%BLEND_CODE%", e.blendCode || "")),
          super(void 0, r, e.uniforms),
          (this.backdropUniformName = "uBackdrop"));
      }
    }
    const le = `
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
    class U extends i.Filter {
      constructor(e, r) {
        const a = r || {};
        (a.flipY || (a.flipY = new Float32Array([0, 1])), super(le, e, a));
      }
    }
    var H = ((t) => (
      (t[(t.RED = 0)] = "RED"),
      (t[(t.GREEN = 1)] = "GREEN"),
      (t[(t.BLUE = 2)] = "BLUE"),
      (t[(t.ALPHA = 3)] = "ALPHA"),
      t
    ))(H || {});
    class V {
      constructor(e = !1, r = 3) {
        ((this.maskBefore = e),
          (this.uniformCode = "uniform vec4 uChannel;"),
          (this.uniforms = { uChannel: new Float32Array([0, 0, 0, 0]) }),
          (this.blendCode = "b_res = dot(b_src, uChannel) * b_dest;"),
          (this.safeFlipY = !1),
          (this.uniforms.uChannel[r] = 1));
      }
    }
    const ae = new Float32Array([0, 1]),
      T = class extends N {
        constructor(t, e = new V()) {
          (super(e),
            (this.baseFilter = t),
            (this.config = e),
            (this.padding = t.padding),
            (this.safeFlipY = e.safeFlipY));
        }
        apply(t, e, r, a) {
          const s = t.getFilterTexture(e);
          if (this.config.maskBefore) {
            const { blendMode: o } = this.state;
            ((this.state.blendMode = i.BLEND_MODES.NONE),
              t.applyFilter(this, e, s, i.CLEAR_MODES.YES),
              (this.baseFilter.blendMode = o),
              this.baseFilter.apply(t, s, r, a),
              (this.state.blendMode = o));
          } else {
            const { uBackdrop: o, uBackdrop_flipY: b } = this.uniforms;
            if (b[1] > 0 || this.safeFlipY)
              this.baseFilter.apply(t, o, s, i.CLEAR_MODES.YES);
            else {
              const _ = t.getFilterTexture(e);
              (T._flipYFilter || (T._flipYFilter = new U()),
                (T._flipYFilter.uniforms.flipY[0] = b[0]),
                (T._flipYFilter.uniforms.flipY[1] = b[1]),
                T._flipYFilter.apply(t, o, _, i.CLEAR_MODES.YES),
                this.baseFilter.apply(t, _, s, i.CLEAR_MODES.YES),
                t.returnFilterTexture(_),
                (this.uniforms.uBackdrop_flipY = ae));
            }
            ((this.uniforms.uBackdrop = s),
              t.applyFilter(this, e, r, a),
              (this.uniforms.uBackdrop = o),
              (this.uniforms.uBackdrop_flipY = b));
          }
          t.returnFilterTexture(s);
        }
      };
    let G = T;
    G._flipYFilter = null;
    const g = `if (b_src.a == 0.0) {
  gl_FragColor = vec4(0, 0, 0, 0);
  return;
}
if (b_dest.a == 0.0) {
  gl_FragColor = b_src;
  return;
}
vec3 base = b_dest.rgb / b_dest.a;
vec3 blend = b_src.rgb / b_src.a;
%NPM_BLEND%
// SWAP SRC WITH NPM BLEND
vec3 new_src = (1.0 - b_dest.a) * blend + b_dest.a * B;
// PORTER DUFF PMA COMPOSITION MODE
b_res.a = b_src.a + b_dest.a * (1.0-b_src.a);
b_res.rgb = b_src.a * new_src + (1.0 - b_src.a) * b_dest.rgb;
`,
      j = { blendCode: g, npmBlendCode: "vec3 B = blend * base;" },
      X = {
        blendCode: g,
        npmBlendCode: "vec3 B = blendOverlay(base, blend);",
        uniformCode: `
float finalBlendOverlay(float base, float blend) 
{
    return mix((1.0-2.0*(1.0-base)*(1.0-blend)), (2.0*base*blend), step(base, 0.5));
}

vec3 blendOverlay(vec3 base, vec3 blend) 
{
    return vec3(
        finalBlendOverlay(base.r,blend.r),
        finalBlendOverlay(base.g,blend.g),
        finalBlendOverlay(base.b,blend.b)
    );
}
`,
      },
      W = {
        blendCode: g,
        npmBlendCode: "vec3 B = blendHardLightVec3(base, blend);",
        uniformCode: `
float blendHardLight(float base, float blend)
{
    return mix((1.0-2.0*(1.0-base)*(1.0-blend)), 2.0*base*blend, 1.0 - step(blend, 0.5));
}

vec3 blendHardLightVec3(vec3 base, vec3 blend) 
{
    return vec3(blendHardLight(base.r,blend.r),blendHardLight(base.g,blend.g),blendHardLight(base.b,blend.b));
}`,
      },
      z = {
        blendCode: g,
        npmBlendCode: "vec3 B = blendSoftLightVec3(blend, base);",
        uniformCode: `
float blendSoftLight(float base, float blend)
{
    if(blend < 0.5)
    {
        return 2.0*base*blend+base*base*(1.0-2.0*blend);
    }
    else
    {
        return sqrt(base)*(2.0*blend-1.0)+2.0*base*(1.0-blend);
    }
}

vec3 blendSoftLightVec3(vec3 base, vec3 blend)
{
    return vec3(blendSoftLight(base.r,blend.r),blendSoftLight(base.g,blend.g),blendSoftLight(base.b,blend.b));
}
`,
      },
      K = {
        blendCode: g,
        npmBlendCode: "vec3 B = blendDarkenVec3(blend, base);",
        uniformCode: `
float blendDarken(float base, float blend)
{
    return min(blend,base);
}

vec3 blendDarkenVec3(vec3 base, vec3 blend)
{
    return vec3(blendDarken(base.r,blend.r),blendDarken(base.g,blend.g),blendDarken(base.b,blend.b));
}
`,
      },
      $ = {
        blendCode: g,
        npmBlendCode: "vec3 B = blendLightenVec3(blend, base);",
        uniformCode: `
float blendLighten(float base, float blend)
{
    return max(blend,base);
}

vec3 blendLightenVec3(vec3 base, vec3 blend)
{
    return vec3(blendLighten(base.r,blend.r),blendLighten(base.g,blend.g),blendLighten(base.b,blend.b));
}
`,
      },
      q = {
        blendCode: g,
        npmBlendCode: "vec3 B = blendColorDodge(blend, base);",
        uniformCode: `
float blendColorDodge(float base, float blend) {
    return (blend==1.0)?blend:min(base/(1.0-blend),1.0);
}

vec3 blendColorDodge(vec3 base, vec3 blend) {
    return vec3(blendColorDodge(base.r,blend.r),blendColorDodge(base.g,blend.g),blendColorDodge(base.b,blend.b));
}
`,
      },
      J = {
        blendCode: g,
        npmBlendCode: "vec3 B = blendColorBurn(blend, base);",
        uniformCode: `
float colorBurn(float base, float blend)
{
    return max((1.0-((1.0-base)/blend)),0.0);
}

vec3 blendColorBurn(vec3 base, vec3 blend)
{
    return vec3(colorBurn(base.r,blend.r),colorBurn(base.g,blend.g),colorBurn(base.b,blend.b));
}
`,
      },
      f = [];
    ((f[i.BLEND_MODES.MULTIPLY] = j),
      (f[i.BLEND_MODES.OVERLAY] = X),
      (f[i.BLEND_MODES.HARD_LIGHT] = W),
      (f[i.BLEND_MODES.SOFT_LIGHT] = z),
      (f[i.BLEND_MODES.DARKEN] = K),
      (f[i.BLEND_MODES.LIGHTEN] = $),
      (f[i.BLEND_MODES.COLOR_DODGE] = q),
      (f[i.BLEND_MODES.COLOR_BURN] = J));
    for (const t in f) {
      const e = f[t];
      e.npmBlendCode &&
        (e.blendCode = e.blendCode.replace("%NPM_BLEND%", e.npmBlendCode));
    }
    const C = [],
      R = [],
      p = new Array(32);
    ((p[i.BLEND_MODES.NORMAL] = !0),
      (p[i.BLEND_MODES.ADD] = !0),
      (p[i.BLEND_MODES.SCREEN] = !0),
      (p[i.BLEND_MODES.DST_OUT] = !0),
      (p[i.BLEND_MODES.DST_IN] = !0),
      (p[i.BLEND_MODES.DST_OVER] = !0),
      (p[i.BLEND_MODES.DST_ATOP] = !0),
      (p[i.BLEND_MODES.SRC_OUT] = !0),
      (p[i.BLEND_MODES.SRC_IN] = !0),
      (p[i.BLEND_MODES.SRC_OVER] = !0),
      (p[i.BLEND_MODES.SRC_ATOP] = !0),
      (p[i.BLEND_MODES.SRC_OUT] = !0),
      (p[i.BLEND_MODES.SRC_IN] = !0),
      (p[i.BLEND_MODES.SRC_OVER] = !0),
      (p[i.BLEND_MODES.XOR] = !0),
      (p[i.BLEND_MODES.SUBTRACT] = !0));
    function Q(t) {
      const e = p[t];
      return !e && !f[t]
        ? null
        : (C[t] ||
            (e
              ? ((C[t] = new i.Filter()),
                (C[t].blendMode = t),
                (C[t].trivial = !0))
              : (C[t] = new N(f[t]))),
          C[t]);
    }
    function y(t) {
      return f[t] ? (R[t] || (R[t] = [Q(t)]), R[t]) : null;
    }
    class se extends re.Sprite {
      _render(e) {
        const r = this._texture;
        if (!r || !r.valid) return;
        const a = y(this.blendMode),
          s = this.blendMode;
        if (a) {
          if ((e.batch.flush(), !e.filter.pushWithCheck(this, a))) return;
          this.blendMode = i.BLEND_MODES.NORMAL;
        }
        (this.calculateVertices(),
          e.batch.setObjectRenderer(e.plugins[this.pluginName]),
          e.plugins[this.pluginName].render(this),
          a && (e.batch.flush(), e.filter.pop(), (this.blendMode = s)));
      }
    }
    class oe extends ne.TilingSprite {
      _render(e) {
        const r = this._texture;
        if (!r || !r.valid) return;
        const a = y(this.blendMode);
        (a && (e.batch.flush(), !e.filter.pushWithCheck(this, a))) ||
          (this.tileTransform.updateLocalTransform(),
          this.uvMatrix.update(),
          e.batch.setObjectRenderer(e.plugins[this.pluginName]),
          e.plugins[this.pluginName].render(this),
          a && (e.batch.flush(), e.filter.pop()));
      }
    }
    function de(t, e) {
      const r = e.x + e.width,
        a = e.y + e.height,
        s = t.x + t.width,
        o = t.y + t.height;
      return (
        e.x >= t.x &&
        e.x <= s &&
        e.y >= t.y &&
        e.y <= o &&
        r >= t.x &&
        r <= s &&
        a >= t.y &&
        a <= o
      );
    }
    function ue(t, e = 0) {
      const { gl: r } = this;
      (this.currentLocation !== e &&
        ((this.currentLocation = e), r.activeTexture(r.TEXTURE0 + e)),
        this.bind(t, e));
    }
    const be = new I.Matrix();
    function ce(t, e, r = !0) {
      var a, s, o, b, _;
      const d = this.renderer,
        E = this.defaultFilterStack,
        n = this.statePool.pop() || new i.FilterState(),
        l = d.renderTexture;
      let c, h;
      if (l.current) {
        const m = l.current;
        ((c = m.resolution), (h = m.multisample));
      } else ((c = d.resolution), (h = d.multisample));
      let D = e[0].resolution || c,
        A = (a = e[0].multisample) != null ? a : h,
        S = e[0].padding,
        P = e[0].autoFit,
        k = (s = e[0].legacy) != null ? s : !0;
      for (let m = 1; m < e.length; m++) {
        const F = e[m];
        ((D = Math.min(D, F.resolution || c)),
          (A = Math.min(A, (o = F.multisample) != null ? o : h)),
          (S = this.useMaxPadding ? Math.max(S, F.padding) : S + F.padding),
          (P = P && F.autoFit),
          (k = k || ((b = F.legacy) != null ? b : !0)));
      }
      (E.length === 1 && (this.defaultFilterStack[0].renderTexture = l.current),
        E.push(n),
        (n.resolution = D),
        (n.legacy = k),
        (n.target = t),
        n.sourceFrame.copyFrom(t.filterArea || t.getBounds(!0)),
        n.sourceFrame.pad(S));
      let te = !0;
      const Y = this.tempRect.copyFrom(l.sourceFrame);
      if (
        (d.projection.transform &&
          ((_ = this.transformAABB) == null ||
            _.call(this, be.copyFrom(d.projection.transform).invert(), Y)),
        P
          ? (n.sourceFrame.fit(Y),
            (n.sourceFrame.width <= 0 || n.sourceFrame.height <= 0) &&
              ((n.sourceFrame.width = 0), (n.sourceFrame.height = 0)))
          : ((te = de(this.renderer.renderTexture.sourceFrame, n.sourceFrame)),
            n.sourceFrame.intersects(Y) ||
              ((n.sourceFrame.width = 0), (n.sourceFrame.height = 0))),
        this.roundFrame(
          n.sourceFrame,
          l.current ? l.current.resolution : d.resolution,
          l.sourceFrame,
          l.destinationFrame,
          d.projection.transform,
        ),
        r && n.sourceFrame.width <= 1 && n.sourceFrame.height <= 1)
      )
        return (E.pop(), n.clear(), this.statePool.push(n), !1);
      if (te) {
        let m = null,
          F = null;
        for (let v = 0; v < e.length; v++) {
          const O = e[v].backdropUniformName;
          if (O) {
            const { uniforms: M } = e[v];
            M[`${O}_flipY`] || (M[`${O}_flipY`] = new Float32Array([0, 1]));
            const x = M[`${O}_flipY`];
            (m === null
              ? ((m = this.prepareBackdrop(n.sourceFrame, x)), (F = x))
              : ((x[0] = F[0]), (x[1] = F[1])),
              (M[O] = m),
              m && (e[v]._backdropActive = !0));
          }
        }
        m && (D = n.resolution = m.resolution);
      }
      ((n.renderTexture = this.getOptimalFilterTexture(
        n.sourceFrame.width,
        n.sourceFrame.height,
        D,
        A,
      )),
        (n.filters = e),
        (n.destinationFrame.width = n.renderTexture.width),
        (n.destinationFrame.height = n.renderTexture.height));
      const B = this.tempRect;
      ((B.x = 0),
        (B.y = 0),
        (B.width = n.sourceFrame.width),
        (B.height = n.sourceFrame.height),
        (n.renderTexture.filterFrame = n.sourceFrame),
        n.bindingSourceFrame.copyFrom(l.sourceFrame),
        n.bindingDestinationFrame.copyFrom(l.destinationFrame),
        (n.transform = d.projection.transform),
        (d.projection.transform = null),
        l.bind(n.renderTexture, n.sourceFrame, B));
      const L = e[e.length - 1].clearColor;
      return (
        L
          ? d.framebuffer.clear(L[0], L[1], L[2], L[3])
          : d.framebuffer.clear(0, 0, 0, 0),
        !0
      );
    }
    function he(t, e) {
      return this.pushWithCheck(t, e, !1);
    }
    function pe() {
      const t = this.defaultFilterStack,
        e = t.pop(),
        r = e.filters;
      this.activeState = e;
      const a = this.globalUniforms.uniforms;
      ((a.outputFrame = e.sourceFrame), (a.resolution = e.resolution));
      const s = a.inputSize,
        o = a.inputPixel,
        b = a.inputClamp;
      if (
        ((s[0] = e.destinationFrame.width),
        (s[1] = e.destinationFrame.height),
        (s[2] = 1 / s[0]),
        (s[3] = 1 / s[1]),
        (o[0] = Math.round(s[0] * e.resolution)),
        (o[1] = Math.round(s[1] * e.resolution)),
        (o[2] = 1 / o[0]),
        (o[3] = 1 / o[1]),
        (b[0] = 0.5 * o[2]),
        (b[1] = 0.5 * o[3]),
        (b[2] = e.sourceFrame.width * s[2] - 0.5 * o[2]),
        (b[3] = e.sourceFrame.height * s[3] - 0.5 * o[3]),
        e.legacy)
      ) {
        const l = a.filterArea;
        ((l[0] = e.destinationFrame.width),
          (l[1] = e.destinationFrame.height),
          (l[2] = e.sourceFrame.x),
          (l[3] = e.sourceFrame.y),
          (a.filterClamp = a.inputClamp));
      }
      this.globalUniforms.update();
      const _ = t[t.length - 1];
      e.renderTexture.framebuffer.multisample > 1 &&
        this.renderer.framebuffer.blit();
      let d = r.length,
        E = null;
      if (
        (d >= 2 &&
          r[d - 1].trivial &&
          ((E = r[d - 2].state), (r[d - 2].state = r[d - 1].state), d--),
        d === 1)
      )
        (r[0].apply(
          this,
          e.renderTexture,
          _.renderTexture,
          i.CLEAR_MODES.BLEND,
          e,
        ),
          this.returnFilterTexture(e.renderTexture));
      else {
        let l = e.renderTexture,
          c = this.getOptimalFilterTexture(l.width, l.height, e.resolution);
        c.filterFrame = l.filterFrame;
        let h = 0;
        for (h = 0; h < d - 1; ++h) {
          (h === 1 &&
            e.multisample > 1 &&
            ((c = this.getOptimalFilterTexture(
              l.width,
              l.height,
              e.resolution,
            )),
            (c.filterFrame = l.filterFrame)),
            r[h].apply(this, l, c, i.CLEAR_MODES.CLEAR, e));
          const D = l;
          ((l = c), (c = D));
        }
        (r[h].apply(this, l, _.renderTexture, i.CLEAR_MODES.BLEND, e),
          h > 1 &&
            e.multisample > 1 &&
            this.returnFilterTexture(e.renderTexture),
          this.returnFilterTexture(l),
          this.returnFilterTexture(c));
      }
      E && (r[d - 1].state = E);
      let n = !1;
      for (let l = 0; l < r.length; l++)
        if (r[l]._backdropActive) {
          const c = r[l].backdropUniformName;
          (n || (this.returnFilterTexture(r[l].uniforms[c]), (n = !0)),
            (r[l].uniforms[c] = null),
            (r[l]._backdropActive = !1));
        }
      (e.clear(), this.statePool.push(e));
    }
    let Z = !1;
    function fe(t, e) {
      const r = this.renderer,
        a = r.renderTexture.current,
        s = this.renderer.renderTexture.sourceFrame,
        o = r.projection.transform || I.Matrix.IDENTITY;
      let b = 1;
      if (a) ((b = a.baseTexture.resolution), (e[1] = 1));
      else {
        if (this.renderer.background.alpha >= 1)
          return (
            Z ||
              ((Z = !0),
              console.warn(
                "pixi-picture: you are trying to use Blend Filter on main framebuffer!",
              ),
              console.warn(
                "pixi-picture: please set backgroundAlpha=0 in renderer creation params",
              )),
            null
          );
        ((b = r.resolution), (e[1] = -1));
      }
      const _ = Math.round((t.x - s.x + o.tx) * b),
        d = t.y - s.y + o.ty,
        E = Math.round((e[1] < 0 ? s.height - (d + t.height) : d) * b),
        n = Math.round(t.width * b),
        l = Math.round(t.height * b),
        c = r.gl,
        h = this.getOptimalFilterTexture(n, l, 1);
      return (
        e[1] < 0 ? (e[0] = l / h.height) : (e[0] = 0),
        (h.filterFrame = s),
        h.setResolution(b),
        r.texture.bindForceLocation(h.baseTexture, 0),
        c.copyTexSubImage2D(c.TEXTURE_2D, 0, 0, 0, _, E, n, l),
        h
      );
    }
    function ee() {
      ((i.TextureSystem.prototype.bindForceLocation = ue),
        (i.FilterSystem.prototype.push = he),
        (i.FilterSystem.prototype.pushWithCheck = ce),
        (i.FilterSystem.prototype.pop = pe),
        (i.FilterSystem.prototype.prepareBackdrop = fe));
    }
    return (
      ee(),
      (u.BLEND_OPACITY = g),
      (u.BackdropFilter = w),
      (u.BlendFilter = N),
      (u.COLOR_BURN_PART = J),
      (u.COLOR_DODGE_PART = q),
      (u.DARKEN_PART = K),
      (u.FlipYFilter = U),
      (u.HARDLIGHT_PART = W),
      (u.LIGHTEN_PART = $),
      (u.MASK_CHANNEL = H),
      (u.MULTIPLY_PART = j),
      (u.MaskConfig = V),
      (u.MaskFilter = G),
      (u.OVERLAY_PART = X),
      (u.SOFTLIGHT_PART = z),
      (u.Sprite = se),
      (u.TilingSprite = oe),
      (u.applyMixins = ee),
      (u.blendPartsArray = f),
      (u.getBlendFilter = Q),
      (u.getBlendFilterArray = y),
      u
    );
  })({}, PIXI, PIXI, PIXI, PIXI)));
//# sourceMappingURL=pixi-picture.js.map
