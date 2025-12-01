/*!
 * @pixi/tilemap - v5.0.2
 * Compiled Sat, 22 Nov 2025 16:08:13 UTC
 *
 * @pixi/tilemap is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 *
 * Copyright 2025, Ivan Popelyshev, All Rights Reserved
 */
this.PIXI = this.PIXI || {};
this.PIXI.tilemap = (function (exports, pixi_js) {
  "use strict";

  const settings = {
    /** The default number of textures per tilemap in a tilemap composite. */
    TEXTURES_PER_TILEMAP: 16,
    /** The scaling mode of the combined texture tiling. */
    TEXTILE_SCALE_MODE: "linear",
    /** This will enable 32-bit index buffers. It's useful when you have more than 16K tiles. */
    use32bitIndex: false,
  };
  const Constant = settings;

  var __defProp$6 = Object.defineProperty;
  var __defNormalProp$6 = (obj, key, value) =>
    key in obj
      ? __defProp$6(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value,
        })
      : (obj[key] = value);
  var __publicField$6 = (obj, key, value) => {
    __defNormalProp$6(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  const _TilemapGeometry = class _TilemapGeometry extends pixi_js.Geometry {
    constructor(indexBuffer) {
      const buf = new pixi_js.Buffer({
        data: new Float32Array(2),
        label: "tilemap-buffer",
        usage: pixi_js.BufferUsage.VERTEX | pixi_js.BufferUsage.COPY_DST,
        shrinkToFit: false,
      });
      const stride = _TilemapGeometry.stride;
      super({
        indexBuffer,
        attributes: {
          aVertexPosition: {
            buffer: buf,
            format: "float32x2",
            stride,
            offset: 0,
            // location: 6,
          },
          aTextureCoord: {
            buffer: buf,
            format: "float32x2",
            stride,
            offset: 2 * 4,
            // location: 4,
          },
          aFrame: {
            buffer: buf,
            format: "float32x4",
            stride,
            offset: 4 * 4,
            // location: 3,
          },
          aAnim: {
            buffer: buf,
            format: "float32x2",
            stride,
            offset: 8 * 4,
            // location: 1,
          },
          aTextureId: {
            buffer: buf,
            format: "sint32",
            stride,
            offset: 10 * 4,
            // location: 5
          },
          aAnimDivisor: {
            buffer: buf,
            format: "float32",
            stride,
            offset: 11 * 4,
            // location: 2
          },
          aAlpha: {
            buffer: buf,
            format: "float32",
            stride,
            offset: 12 * 4,
            // location: 0
          },
        },
      });
      __publicField$6(this, "lastTimeAccess", 0);
      __publicField$6(this, "vertSize", _TilemapGeometry.vertSize);
      __publicField$6(this, "vertPerQuad", _TilemapGeometry.vertPerQuad);
      __publicField$6(this, "stride", _TilemapGeometry.stride);
      __publicField$6(this, "buf");
      this.buf = buf;
    }
  };
  __publicField$6(_TilemapGeometry, "vertSize", 13);
  __publicField$6(_TilemapGeometry, "vertPerQuad", 4);
  __publicField$6(_TilemapGeometry, "stride", _TilemapGeometry.vertSize * 4);
  let TilemapGeometry = _TilemapGeometry;

  var __defProp$5 = Object.defineProperty;
  var __defNormalProp$5 = (obj, key, value) =>
    key in obj
      ? __defProp$5(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value,
        })
      : (obj[key] = value);
  var __publicField$5 = (obj, key, value) => {
    __defNormalProp$5(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  class TilemapAdaptor {
    constructor() {
      __publicField$5(
        this,
        "pipe_uniforms",
        new pixi_js.UniformGroup({
          u_proj_trans: { value: new pixi_js.Matrix(), type: "mat3x3<f32>" },
          u_anim_frame: { value: new Float32Array(2), type: "vec2<f32>" },
        }),
      );
    }
  }
  class TilemapPipe {
    constructor(renderer, adaptor) {
      /** The managing renderer */
      __publicField$5(this, "renderer");
      /** The tile animation frame */
      __publicField$5(this, "tileAnim", [0, 0]);
      __publicField$5(this, "ibLen", 0);
      // index buffer length
      /** The index buffer for the tilemaps to share. */
      __publicField$5(this, "indexBuffer", null);
      /** The shader used to render tilemaps. */
      __publicField$5(this, "shader");
      __publicField$5(this, "adaptor");
      this.renderer = renderer;
      this.adaptor = adaptor;
      this.adaptor.init();
      this.indexBuffer = new pixi_js.Buffer({
        data: new Uint16Array([0, 1, 2, 0, 2, 3]),
        label: "index-tilemap-buffer",
        usage: pixi_js.BufferUsage.INDEX | pixi_js.BufferUsage.COPY_DST,
      });
      this.indexBuffer.destroy = pixi_js.NOOP;
      this.checkIndexBuffer(2e3);
    }
    start() {}
    /**
     * @internal
     * @ignore
     */
    createVb() {
      const geom = new TilemapGeometry(this.indexBuffer);
      geom.lastTimeAccess = Date.now();
      return geom;
    }
    /** @return The {@link TilemapGeometry} shader that this rendering pipeline is using. */
    getShader() {
      return this.shader;
    }
    destroy() {
      this.shader = null;
    }
    // eslint-disable-next-line no-unused-vars
    checkIndexBuffer(size) {
      const totalIndices = size * 6;
      if (totalIndices <= this.ibLen) {
        return;
      }
      let len = totalIndices;
      while (len < totalIndices) {
        len <<= 1;
      }
      this.ibLen = totalIndices;
      this.indexBuffer.data = createIndicesForQuads(
        size,
        settings.use32bitIndex
          ? new Uint32Array(totalIndices)
          : new Uint16Array(totalIndices),
      );
    }
    destroyRenderable(_renderable) {
      _renderable.vb.destroy(true);
      _renderable.vb = null;
    }
    addRenderable(tilemap, instructionSet) {
      const batcher = this.renderer.renderPipes.batch;
      tilemap.updateBuffer(this);
      tilemap.checkValid();
      tilemap.getTileset().update();
      if (tilemap.is_valid) {
        batcher.break(instructionSet);
        instructionSet.add(tilemap._instruction);
      }
    }
    updateRenderable(tilemap, _instructionSet) {
      tilemap.updateBuffer(this);
      tilemap.getTileset().update();
    }
    validateRenderable(renderable) {
      return renderable.checkValid();
    }
    execute({ tilemap }) {
      if (!tilemap.isRenderable) return;
      tilemap.state.blendMode = tilemap.groupBlendMode;
      const { pipe_uniforms } = this.adaptor;
      const u_proj_trans = pipe_uniforms.uniforms.u_proj_trans;
      const u_global =
        this.renderer.globalUniforms._activeUniforms.at(-1).uniforms;
      let anim_frame = this.tileAnim;
      const { u_anim_frame } = pipe_uniforms.uniforms;
      u_global.uProjectionMatrix
        .copyTo(u_proj_trans)
        .append(u_global.uWorldTransformMatrix)
        .append(tilemap.worldTransform);
      if (tilemap.compositeParent) {
        anim_frame = tilemap.parent.tileAnim || anim_frame;
      }
      u_anim_frame[0] = anim_frame[0];
      u_anim_frame[1] = anim_frame[1];
      pipe_uniforms.update();
      this.adaptor.execute(this, tilemap);
    }
  }
  __publicField$5(TilemapPipe, "extension", {
    type: [pixi_js.ExtensionType.WebGLPipes, pixi_js.ExtensionType.WebGPUPipes],
    name: "tilemap",
  });
  function createIndicesForQuads(size, outBuffer) {
    const totalIndices = size * 6;
    if (outBuffer.length !== totalIndices) {
      throw new Error(
        `Out buffer length is incorrect, got ${outBuffer.length} and expected ${totalIndices}`,
      );
    }
    for (let i = 0, j = 0; i < totalIndices; i += 6, j += 4) {
      outBuffer[i + 0] = j + 0;
      outBuffer[i + 1] = j + 1;
      outBuffer[i + 2] = j + 2;
      outBuffer[i + 3] = j + 0;
      outBuffer[i + 4] = j + 2;
      outBuffer[i + 5] = j + 3;
    }
    return outBuffer;
  }

  var __defProp$4 = Object.defineProperty;
  var __defNormalProp$4 = (obj, key, value) =>
    key in obj
      ? __defProp$4(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value,
        })
      : (obj[key] = value);
  var __publicField$4 = (obj, key, value) => {
    __defNormalProp$4(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  class TileTextureArray {
    constructor(max_textures) {
      __publicField$4(this, "max_textures");
      __publicField$4(this, "arr", []);
      __publicField$4(this, "count", 0);
      __publicField$4(this, "dirty", false);
      __publicField$4(this, "dirty_gpu", false);
      __publicField$4(this, "bind_group", null);
      __publicField$4(this, "bind_group_resources", {});
      __publicField$4(this, "tex_sizes", null);
      __publicField$4(this, "null_color", new Float32Array([0, 0, 0, 0.5]));
      __publicField$4(this, "tex_buf", null);
      this.max_textures = max_textures;
      this.tex_sizes = new Float32Array(this.max_textures * 4 + 4);
      this.tex_buf = new pixi_js.Buffer({
        usage: pixi_js.BufferUsage.UNIFORM | pixi_js.BufferUsage.COPY_DST,
      });
    }
    get length() {
      return this.count;
    }
    push(tex) {
      this.arr[this.count++] = tex;
      this.dirty = true;
    }
    at(ind) {
      return this.arr[ind];
    }
    update() {
      if (!this.dirty) {
        return;
      }
      this.dirty = false;
      this.dirty_gpu = true;
      const { tex_sizes, arr, count, max_textures, null_color } = this;
      for (let i = 0; i < count; i++) {
        const tex = arr[i];
        if (tex) {
          tex_sizes[i * 4] = tex.pixelWidth;
          tex_sizes[i * 4 + 1] = tex.pixelHeight;
          tex_sizes[i * 4 + 2] = 1 / tex.pixelWidth;
          tex_sizes[i * 4 + 3] = 1 / tex.pixelHeight;
        }
      }
      tex_sizes[max_textures * 4] = null_color[0];
      tex_sizes[max_textures * 4 + 1] = null_color[1];
      tex_sizes[max_textures * 4 + 2] = null_color[2];
      tex_sizes[max_textures * 4 + 3] = null_color[3];
    }
    markDirty() {
      this.dirty = true;
    }
    getBindGroup() {
      this.update();
      if (!this.dirty_gpu) {
        return this.bind_group;
      }
      const { bind_group_resources, max_textures, arr, count } = this;
      let bindIndex = 0;
      bind_group_resources[bindIndex++] = new pixi_js.UniformGroup({
        u_texture_size: {
          value: this.tex_sizes,
          type: "vec4<f32>",
          size: max_textures,
        },
        u_null_color: {
          value: this.null_color,
          type: "vec4<f32>",
        },
      });
      for (let i = 0; i < max_textures; i++) {
        const texture =
          (i < count ? arr[i] : null) || pixi_js.Texture.EMPTY.source;
        bind_group_resources[bindIndex++] = texture.source;
        bind_group_resources[bindIndex++] = texture.style;
      }
      if (!this.bind_group) {
        this.bind_group = new pixi_js.BindGroup(bind_group_resources);
      }
      return this.bind_group;
    }
    static generate_gpu_textures(max_textures) {
      const src = [];
      src.push(`struct TextureArrayFields {`);
      src.push(`    u_texture_size: array<vec4f, ${max_textures}>,`);
      src.push(`    u_null_color: vec4f`);
      src.push(`}`);
      src.push(`@group(1) @binding(0) var<uniform> taf: TextureArrayFields;`);
      for (let i = 0; i < max_textures; i++) {
        src.push(
          `@group(1) @binding(${i * 2 + 1}) var u_texture_${i}: texture_2d<f32>;`,
        );
        src.push(
          `@group(1) @binding(${i * 2 + 2}) var u_sampler_${i}: sampler;`,
        );
      }
      src.push(
        "fn sampleMultiTexture(texture_id: i32, uv: vec2f, dx: vec2f, dy: vec2f) -> vec4f {",
      );
      src.push(`switch texture_id {`);
      for (let i = 0; i < max_textures; i++) {
        src.push(
          `  case ${i}: { return textureSampleGrad(u_texture_${i}, u_sampler_${i}, uv, dx, dy); }`,
        );
      }
      src.push(`  default: { return taf.u_null_color; }`);
      src.push("} }");
      return src.join("\n");
    }
    static generate_gl_textures(max_textures) {
      const src = [];
      src.push(`uniform vec4 u_texture_size[${max_textures + 1}];`);
      src.push(`uniform sampler2D u_textures[${max_textures}];`);
      src.push(`uniform vec4 u_null_color;`);
      src.push("vec4 sampleMultiTexture(float texture_id, vec2 uv) {");
      src.push(`if(texture_id < -0.5) return u_texture_size[${max_textures}];`);
      for (let i = 0; i < max_textures; i++) {
        src.push(
          `if(texture_id < ${i}.5) return texture(u_textures[${i}], uv * u_texture_size[${i}].zw);`,
        );
      }
      src.push(`return u_texture_size[${max_textures}];`);
      src.push("}");
      return src.join("\n");
    }
    static gl_gen_resources(max_textures) {
      const sampleValues = [];
      for (let i = 0; i < max_textures; i++) {
        sampleValues[i] = i;
      }
      const samplerSize = [];
      for (let i = 0; i < max_textures; i++) {
        samplerSize.push(2048);
        samplerSize.push(2048);
        samplerSize.push(1 / 2048);
        samplerSize.push(1 / 2048);
      }
      return {
        u_textures: {
          value: sampleValues,
          type: "i32",
          size: max_textures,
        },
        u_texture_size: {
          value: samplerSize,
          type: "vec4<f32>",
          size: max_textures,
        },
      };
    }
  }

  var __defProp$3 = Object.defineProperty;
  var __defNormalProp$3 = (obj, key, value) =>
    key in obj
      ? __defProp$3(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value,
        })
      : (obj[key] = value);
  var __publicField$3 = (obj, key, value) => {
    __defNormalProp$3(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  const gl_tilemap_vertex = `
in vec2 aVertexPosition;
in vec2 aTextureCoord;
in vec4 aFrame;
in vec2 aAnim;
in float aAnimDivisor;
in float aTextureId;
in float aAlpha;

uniform mat3 u_proj_trans;
uniform vec2 u_anim_frame;

out vec2 vTextureCoord;
out float vTextureId;
out vec4 vFrame;
out float vAlpha;

void main(void)
{
  gl_Position = vec4((u_proj_trans * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
  vec2 animCount = floor((aAnim + 0.5) / 2048.0);
  vec2 animFrameOffset = aAnim - animCount * 2048.0;
  vec2 currentFrame = floor(u_anim_frame / aAnimDivisor);
  vec2 loop_num = floor((currentFrame + 0.5) / animCount);
  vec2 animOffset = animFrameOffset * floor(currentFrame - loop_num * animCount);

  vTextureCoord = aTextureCoord + animOffset;
  vFrame = aFrame + vec4(animOffset, animOffset);
  vTextureId = aTextureId;
  vAlpha = aAlpha;
}
`;
  const gl_tilemap_fragment = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
in vec2 vTextureCoord;
in vec4 vFrame;
in float vTextureId;
in float vAlpha;

//include_textures

void main(void)
{
  float textureId = floor(vTextureId + 0.5);
  vec2 textureCoord = clamp(vTextureCoord, vFrame.xy, vFrame.zw);
  vec4 color = sampleMultiTexture(textureId, textureCoord);
  finalColor = color * vAlpha;
}
`;
  class GlTilemapAdaptor extends TilemapAdaptor {
    constructor() {
      super(...arguments);
      __publicField$3(this, "_shader", null);
      __publicField$3(this, "max_textures", settings.TEXTURES_PER_TILEMAP);
    }
    destroy() {
      this._shader.destroy(true);
      this._shader = null;
    }
    execute(pipe, tilemap) {
      const renderer = pipe.renderer;
      const shader = this._shader;
      const tileset = tilemap.getTileset();
      const tu = shader.resources.texture_uniforms;
      if (tu.uniforms.u_texture_size !== tileset.tex_sizes) {
        tu.uniforms.u_texture_size = tileset.tex_sizes;
        tu.update();
      }
      for (let i = 0; i < tileset.length; i++) {
        renderer.texture.bind(tileset.arr[i], i);
      }
      renderer.encoder.draw({
        geometry: tilemap.vb,
        shader,
        state: tilemap.state,
        size: tilemap.rects_count * 6,
      });
    }
    init() {
      this._shader = new pixi_js.Shader({
        glProgram: pixi_js.GlProgram.from({
          vertex: gl_tilemap_vertex,
          fragment: gl_tilemap_fragment.replace(
            "//include_textures",
            TileTextureArray.generate_gl_textures(this.max_textures),
          ),
        }),
        resources: {
          texture_uniforms: new pixi_js.UniformGroup(
            TileTextureArray.gl_gen_resources(this.max_textures),
            { isStatic: true },
          ),
          pipe_uniforms: this.pipe_uniforms.uniformStructures,
        },
      });
    }
  }
  __publicField$3(GlTilemapAdaptor, "extension", {
    type: [pixi_js.ExtensionType.WebGLPipesAdaptor],
    name: "tilemap",
  });

  var __defProp$2 = Object.defineProperty;
  var __defNormalProp$2 = (obj, key, value) =>
    key in obj
      ? __defProp$2(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value,
        })
      : (obj[key] = value);
  var __publicField$2 = (obj, key, value) => {
    __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  const gpu_tilemap_vertex = `
struct GlobalUniforms {
  uProjectionMatrix:mat3x3f,
  uWorldTransformMatrix:mat3x3f,
  uWorldColorAlpha: vec4f,
  uResolution: vec2f,
}

struct TilemapUniforms {
  u_proj_trans:mat3x3f,
  u_anim_frame:vec2f
}

@group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;
@group(2) @binding(0) var<uniform> loc: TilemapUniforms;

struct VSOutput {
  @builtin(position) vPosition: vec4f,
  @location(0) @interpolate(flat) vTextureId : i32,
  @location(1) vTextureCoord : vec2f,
  @location(2) @interpolate(flat) vFrame : vec4f,
  @location(3) vAlpha : f32
};

@vertex
fn mainVert(
   @location(6) aVertexPosition: vec2f,
   @location(4) aTextureCoord: vec2f,
   @location(3) aFrame: vec4f,
   @location(1) aAnim: vec2f,
   @location(2) aAnimDivisor: f32,
   @location(5) aTextureId: i32,
   @location(0) aAlpha: f32,
 ) -> VSOutput {

  var vPosition = vec4((loc.u_proj_trans * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
  var animCount = floor((aAnim + 0.5) / 2048.0);
  var animFrameOffset = aAnim - animCount * 2048.0;
  var currentFrame = floor(loc.u_anim_frame / aAnimDivisor);
  var loop_num = floor((currentFrame + 0.5) / animCount);
  var animOffset = animFrameOffset * floor(currentFrame - loop_num * animCount);
  var vTextureCoord = aTextureCoord + animOffset;
  var vFrame = aFrame + vec4(animOffset, animOffset);

  return VSOutput(vPosition, aTextureId, vTextureCoord, vFrame, aAlpha);
};
`;
  const gpu_tilemap_fragment = `
//include_textures

@fragment
fn mainFrag(
  @location(0) @interpolate(flat) vTextureId : i32,
  @location(1) vTextureCoord : vec2f,
  @location(2) @interpolate(flat) vFrame : vec4f,
  @location(3) vAlpha : f32,
  ) -> @location(0) vec4f {
  var textureCoord = clamp(vTextureCoord, vFrame.xy, vFrame.zw);
  var uv = textureCoord * taf.u_texture_size[vTextureId].zw;
  var dx = dpdx(uv);
  var dy = dpdy(uv);
  var color = sampleMultiTexture(vTextureId, uv, dx, dy);
  return color * vAlpha;
};
`;
  class GpuTilemapAdaptor extends TilemapAdaptor {
    constructor() {
      super(...arguments);
      __publicField$2(this, "_shader", null);
      __publicField$2(this, "max_textures", settings.TEXTURES_PER_TILEMAP);
      __publicField$2(this, "bind_group", null);
    }
    destroy() {
      this._shader.destroy(true);
      this._shader = null;
    }
    execute(pipe, tilemap) {
      const renderer = pipe.renderer;
      const shader = this._shader;
      shader.groups[0] = renderer.globalUniforms.bindGroup;
      shader.groups[1] = tilemap.getTileset().getBindGroup();
      shader.groups[2] = this.bind_group;
      renderer.encoder.draw({
        geometry: tilemap.vb,
        shader,
        state: tilemap.state,
        size: tilemap.rects_count * 6,
      });
    }
    init() {
      this._shader = new pixi_js.Shader({
        gpuProgram: pixi_js.GpuProgram.from({
          vertex: { source: gpu_tilemap_vertex, entryPoint: "mainVert" },
          fragment: {
            source: gpu_tilemap_fragment.replace(
              "//include_textures",
              TileTextureArray.generate_gpu_textures(this.max_textures),
            ),
          },
        }),
      });
      this.bind_group = new pixi_js.BindGroup({
        ut: this.pipe_uniforms,
      });
    }
  }
  __publicField$2(GpuTilemapAdaptor, "extension", {
    type: [pixi_js.ExtensionType.WebGPUPipesAdaptor],
    name: "tilemap",
  });

  var __defProp$1 = Object.defineProperty;
  var __defNormalProp$1 = (obj, key, value) =>
    key in obj
      ? __defProp$1(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value,
        })
      : (obj[key] = value);
  var __publicField$1 = (obj, key, value) => {
    __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  var POINT_STRUCT = /* @__PURE__ */ ((POINT_STRUCT2) => {
    POINT_STRUCT2[(POINT_STRUCT2["U"] = 0)] = "U";
    POINT_STRUCT2[(POINT_STRUCT2["V"] = 1)] = "V";
    POINT_STRUCT2[(POINT_STRUCT2["X"] = 2)] = "X";
    POINT_STRUCT2[(POINT_STRUCT2["Y"] = 3)] = "Y";
    POINT_STRUCT2[(POINT_STRUCT2["TILE_WIDTH"] = 4)] = "TILE_WIDTH";
    POINT_STRUCT2[(POINT_STRUCT2["TILE_HEIGHT"] = 5)] = "TILE_HEIGHT";
    POINT_STRUCT2[(POINT_STRUCT2["ROTATE"] = 6)] = "ROTATE";
    POINT_STRUCT2[(POINT_STRUCT2["ANIM_X"] = 7)] = "ANIM_X";
    POINT_STRUCT2[(POINT_STRUCT2["ANIM_Y"] = 8)] = "ANIM_Y";
    POINT_STRUCT2[(POINT_STRUCT2["TEXTURE_INDEX"] = 9)] = "TEXTURE_INDEX";
    POINT_STRUCT2[(POINT_STRUCT2["ANIM_COUNT_X"] = 10)] = "ANIM_COUNT_X";
    POINT_STRUCT2[(POINT_STRUCT2["ANIM_COUNT_Y"] = 11)] = "ANIM_COUNT_Y";
    POINT_STRUCT2[(POINT_STRUCT2["ANIM_DIVISOR"] = 12)] = "ANIM_DIVISOR";
    POINT_STRUCT2[(POINT_STRUCT2["ALPHA"] = 13)] = "ALPHA";
    return POINT_STRUCT2;
  })(POINT_STRUCT || {});
  const POINT_STRUCT_SIZE = Object.keys(POINT_STRUCT).length / 2;
  class Tilemap extends pixi_js.ViewContainer {
    /**
     * @param tileset - The tileset to use for the tilemap. This can be reset later with {@link Tilemap.setTileset}. The
     *      base-textures in this array must not be duplicated.
     */
    constructor(tileset) {
      super({});
      // TODO: make default color work
      /**
       * Currently doesnt work.
       */
      __publicField$1(this, "shadowColor", new Float32Array([0, 0, 0, 0.5]));
      __publicField$1(this, "state", pixi_js.State.for2d());
      __publicField$1(this, "is_valid", false);
      __publicField$1(this, "renderPipeId", "tilemap");
      __publicField$1(this, "canBundle", true);
      __publicField$1(this, "_instruction", {
        renderPipeId: "tilemap",
        tilemap: this,
      });
      /**
       * The tile animation frame.
       *
       * @see CompositeTilemap.tileAnim
       */
      __publicField$1(this, "tileAnim", null);
      /**
       * This is the last uploaded size of the tilemap geometry.
       * @ignore
       */
      __publicField$1(this, "rects_count", 0);
      /** @ignore */
      __publicField$1(this, "compositeParent", false);
      /**
       * The list of base-textures being used in the tilemap.
       *
       * This should not be shuffled after tiles have been added into this tilemap. Usually, only tile textures
       * should be added after tiles have been added into the map.
       */
      __publicField$1(
        this,
        "tileset",
        new TileTextureArray(settings.TEXTURES_PER_TILEMAP),
      );
      /**
       * The local bounds of the tilemap itself. This does not include DisplayObject children.
       */
      __publicField$1(this, "tilemapBounds", new pixi_js.Bounds());
      /** Flags whether any animated tile was added. */
      __publicField$1(this, "hasAnimatedTile", false);
      /** The interleaved geometry of the tilemap. */
      __publicField$1(this, "pointsBuf", []);
      __publicField$1(this, "batched");
      __publicField$1(this, "vbId", 0);
      __publicField$1(this, "vb", null);
      __publicField$1(this, "vbBuffer", null);
      __publicField$1(this, "vbArray", null);
      __publicField$1(this, "vbInts", null);
      this.setTileset(tileset);
    }
    /**
     * @internal
     * @ignore
     */
    checkValid() {
      const v = this.tileset.count > 0 && this.pointsBuf.length > 0;
      const res = this.is_valid !== v;
      this.is_valid = v;
      return res !== v;
    }
    updateBounds() {
      const bounds = this.tilemapBounds;
      this._bounds.minX = bounds.minX;
      this._bounds.maxX = bounds.maxX;
      this._bounds.minY = bounds.minY;
      this._bounds.maxY = bounds.maxY;
    }
    /**
     * @returns The tileset of this tilemap.
     */
    getTileset() {
      return this.tileset;
    }
    /**
     * Define the tileset used by the tilemap.
     *
     * @param textureOrArray - The list of textures to use in the tilemap. If a base-texture (not array) is passed, it will
     *  be wrapped into an array. This should not contain any duplicates.
     */
    setTileset(textureOrArray = []) {
      var _a, _b;
      let ts = this.tileset;
      if (textureOrArray instanceof TileTextureArray) {
        this.tileset = textureOrArray;
        this.didViewUpdate = true;
      } else if (textureOrArray instanceof pixi_js.TextureSource) {
        if (ts.count === 1 && ts.arr[0] === textureOrArray) {
          return this;
        }
        ts = this.tileset = new TileTextureArray(settings.TEXTURES_PER_TILEMAP);
        ts.push(textureOrArray);
        this.didViewUpdate = true;
      } else {
        if (textureOrArray.length === ts.count) {
          let flag = true;
          for (let i = 0; i < textureOrArray.length; i++) {
            if (
              ((_a = textureOrArray[i]) == null ? void 0 : _a.source) !==
              ts.arr[i]
            ) {
              flag = false;
              break;
            }
          }
          if (flag) {
            return this;
          }
        }
        ts = this.tileset = new TileTextureArray(settings.TEXTURES_PER_TILEMAP);
        for (let i = 0; i < textureOrArray.length; i++) {
          ts.push((_b = textureOrArray[i]) == null ? void 0 : _b.source);
        }
        this.didViewUpdate = true;
      }
      return this;
    }
    /**  Clears all the tiles added into this tilemap. */
    clear() {
      this.pointsBuf.length = 0;
      this.rects_count = 0;
      this.tilemapBounds.clear();
      this.hasAnimatedTile = false;
      return this;
    }
    /**
     * Adds a tile that paints the given texture at (x, y).
     *
     * @param tileTexture - The tiling texture to render.
     * @param x - The local x-coordinate of the tile's position.
     * @param y - The local y-coordinate of the tile's position.
     * @param options - Additional tile options.
     * @param [options.u=texture.frame.x] - The x-coordinate of the texture in its base-texture's space.
     * @param [options.v=texture.frame.y] - The y-coordinate of the texture in its base-texture's space.
     * @param [options.tileWidth=texture.orig.width] - The local width of the tile.
     * @param [options.tileHeight=texture.orig.height] - The local height of the tile.
     * @param [options.animX=0] - For animated tiles, this is the "offset" along the x-axis for adjacent
     *      animation frame textures in the base-texture.
     * @param [options.animY=0] - For animated tiles, this is the "offset" along the y-axis for adjacent
     *      animation frames textures in the base-texture.
     * @param [options.rotate=0]
     * @param [options.animCountX=1024] - For animated tiles, this is the number of animation frame textures
     *      per row.
     * @param [options.animCountY=1024] - For animated tiles, this is the number of animation frame textures
     *      per column.
     * @param [options.animDivisor=1] - For animated tiles, this is the animation duration of each frame
     * @param [options.alpha=1] - Tile alpha
     * @return This tilemap, good for chaining.
     */
    tile(tileTexture, x, y, options = {}) {
      var _a, _b, _c, _d;
      this.didViewUpdate = true;
      let baseTexture;
      let textureIndex = -1;
      let was_num = false;
      if (typeof tileTexture === "number") {
        textureIndex = tileTexture;
        was_num = true;
        baseTexture = this.tileset.arr[textureIndex];
      } else {
        let texture;
        if (typeof tileTexture === "string") {
          texture = pixi_js.Texture.from(tileTexture);
        } else {
          texture = tileTexture;
        }
        const textureList = this.tileset;
        for (let i = 0; i < textureList.count; i++) {
          if (textureList.arr[i] === texture.source) {
            textureIndex = i;
            break;
          }
        }
        if ("frame" in texture) {
          options.u = (_a = options.u) != null ? _a : texture.frame.x;
          options.v = (_b = options.v) != null ? _b : texture.frame.y;
          options.tileWidth =
            (_c = options.tileWidth) != null ? _c : texture.orig.width;
          options.tileHeight =
            (_d = options.tileHeight) != null ? _d : texture.orig.height;
        }
        baseTexture = texture.source;
      }
      if (!was_num && !baseTexture) {
        console.error("The tile texture was not found in the tilemap tileset.");
        return this;
      }
      const {
        u = 0,
        v = 0,
        tileWidth = baseTexture.width,
        tileHeight = baseTexture.height,
        animX = 0,
        animY = 0,
        rotate = 0,
        animCountX = 1024,
        animCountY = 1024,
        animDivisor = 1,
        alpha = 1,
      } = options;
      const pb = this.pointsBuf;
      this.hasAnimatedTile = this.hasAnimatedTile || animX > 0 || animY > 0;
      pb.push(u);
      pb.push(v);
      pb.push(x);
      pb.push(y);
      pb.push(tileWidth);
      pb.push(tileHeight);
      pb.push(rotate);
      pb.push(animX | 0);
      pb.push(animY | 0);
      pb.push(textureIndex);
      pb.push(animCountX);
      pb.push(animCountY);
      pb.push(animDivisor);
      pb.push(alpha);
      this.tilemapBounds.addFrame(x, y, x + tileWidth, y + tileHeight);
      return this;
    }
    /** Changes the rotation of the last tile. */
    tileRotate(rotate) {
      const pb = this.pointsBuf;
      pb[pb.length - (POINT_STRUCT_SIZE - 9) /* TEXTURE_INDEX */] = rotate;
    }
    /** Changes the `animX`, `animCountX` of the last tile. */
    tileAnimX(offset, count) {
      const pb = this.pointsBuf;
      pb[pb.length - (POINT_STRUCT_SIZE - 7) /* ANIM_X */] = offset;
      pb[pb.length - (POINT_STRUCT_SIZE - 10) /* ANIM_COUNT_X */] = count;
    }
    /** Changes the `animY`, `animCountY` of the last tile. */
    tileAnimY(offset, count) {
      const pb = this.pointsBuf;
      pb[pb.length - (POINT_STRUCT_SIZE - 8) /* ANIM_Y */] = offset;
      pb[pb.length - (POINT_STRUCT_SIZE - 11) /* ANIM_COUNT_Y */] = count;
    }
    /** Changes the `animDivisor` value of the last tile. */
    tileAnimDivisor(divisor) {
      const pb = this.pointsBuf;
      pb[pb.length - (POINT_STRUCT_SIZE - 12) /* ANIM_DIVISOR */] = divisor;
    }
    tileAlpha(alpha) {
      const pb = this.pointsBuf;
      pb[pb.length - (POINT_STRUCT_SIZE - 13) /* ALPHA */] = alpha;
    }
    destroyVb() {
      if (this.vb) {
        this.vb.destroy();
        this.vb = null;
      }
    }
    updateBuffer(plugin) {
      const points = this.pointsBuf;
      const rects_count = points.length / POINT_STRUCT_SIZE;
      let vb = this.vb;
      if (
        this.tileset.count === 0 ||
        rects_count === 0 ||
        (this.rects_count === rects_count && vb)
      ) {
        return;
      }
      this.rects_count = rects_count;
      if (!vb) {
        vb = plugin.createVb();
        this.vb = vb;
        this.vbId = vb.id;
        this.vbBuffer = null;
      }
      const vertices = rects_count * vb.vertPerQuad;
      plugin.checkIndexBuffer(rects_count);
      const vertexBuf = vb.getBuffer("aVertexPosition");
      const vs = vb.stride * vertices;
      if (!this.vbBuffer || this.vbBuffer.byteLength < vs) {
        let bk = vb.stride;
        while (bk < vs) {
          bk *= 2;
        }
        this.vbBuffer = new ArrayBuffer(bk);
        this.vbArray = new Float32Array(this.vbBuffer);
        this.vbInts = new Uint32Array(this.vbBuffer);
      }
      const arr = this.vbArray;
      const ints = this.vbInts;
      let sz = 0;
      let textureId = 0;
      for (let i = 0; i < points.length; i += POINT_STRUCT_SIZE) {
        const eps = 0.5;
        if (this.compositeParent) {
          textureId = points[i + 9 /* TEXTURE_INDEX */];
        }
        const x = points[i + 2 /* X */];
        const y = points[i + 3 /* Y */];
        const w = points[i + 4 /* TILE_WIDTH */];
        const h = points[i + 5 /* TILE_HEIGHT */];
        const u = points[i + 0 /* U */];
        const v = points[i + 1 /* V */];
        let rotate = points[i + 6 /* ROTATE */];
        const animX = points[i + 7 /* ANIM_X */];
        const animY = points[i + 8 /* ANIM_Y */];
        const animWidth = points[i + 10 /* ANIM_COUNT_X */] || 1024;
        const animHeight = points[i + 11 /* ANIM_COUNT_Y */] || 1024;
        const animXEncoded = animX + animWidth * 2048;
        const animYEncoded = animY + animHeight * 2048;
        const animDivisor = points[i + 12 /* ANIM_DIVISOR */];
        const alpha = points[i + 13 /* ALPHA */];
        let u0;
        let v0;
        let u1;
        let v1;
        let u2;
        let v2;
        let u3;
        let v3;
        if (rotate === 0) {
          u0 = u;
          v0 = v;
          u1 = u + w;
          v1 = v;
          u2 = u + w;
          v2 = v + h;
          u3 = u;
          v3 = v + h;
        } else {
          let w2 = w / 2;
          let h2 = h / 2;
          if (rotate % 4 !== 0) {
            w2 = h / 2;
            h2 = w / 2;
          }
          const cX = u + w2;
          const cY = v + h2;
          rotate = pixi_js.groupD8.add(rotate, pixi_js.groupD8.NW);
          u0 = cX + w2 * pixi_js.groupD8.uX(rotate);
          v0 = cY + h2 * pixi_js.groupD8.uY(rotate);
          rotate = pixi_js.groupD8.add(rotate, 2);
          u1 = cX + w2 * pixi_js.groupD8.uX(rotate);
          v1 = cY + h2 * pixi_js.groupD8.uY(rotate);
          rotate = pixi_js.groupD8.add(rotate, 2);
          u2 = cX + w2 * pixi_js.groupD8.uX(rotate);
          v2 = cY + h2 * pixi_js.groupD8.uY(rotate);
          rotate = pixi_js.groupD8.add(rotate, 2);
          u3 = cX + w2 * pixi_js.groupD8.uX(rotate);
          v3 = cY + h2 * pixi_js.groupD8.uY(rotate);
        }
        arr[sz++] = x;
        arr[sz++] = y;
        arr[sz++] = u0;
        arr[sz++] = v0;
        arr[sz++] = u + eps;
        arr[sz++] = v + eps;
        arr[sz++] = u + w - eps;
        arr[sz++] = v + h - eps;
        arr[sz++] = animXEncoded;
        arr[sz++] = animYEncoded;
        ints[sz++] = textureId;
        arr[sz++] = animDivisor;
        arr[sz++] = alpha;
        arr[sz++] = x + w;
        arr[sz++] = y;
        arr[sz++] = u1;
        arr[sz++] = v1;
        arr[sz++] = u + eps;
        arr[sz++] = v + eps;
        arr[sz++] = u + w - eps;
        arr[sz++] = v + h - eps;
        arr[sz++] = animXEncoded;
        arr[sz++] = animYEncoded;
        ints[sz++] = textureId;
        arr[sz++] = animDivisor;
        arr[sz++] = alpha;
        arr[sz++] = x + w;
        arr[sz++] = y + h;
        arr[sz++] = u2;
        arr[sz++] = v2;
        arr[sz++] = u + eps;
        arr[sz++] = v + eps;
        arr[sz++] = u + w - eps;
        arr[sz++] = v + h - eps;
        arr[sz++] = animXEncoded;
        arr[sz++] = animYEncoded;
        ints[sz++] = textureId;
        arr[sz++] = animDivisor;
        arr[sz++] = alpha;
        arr[sz++] = x;
        arr[sz++] = y + h;
        arr[sz++] = u3;
        arr[sz++] = v3;
        arr[sz++] = u + eps;
        arr[sz++] = v + eps;
        arr[sz++] = u + w - eps;
        arr[sz++] = v + h - eps;
        arr[sz++] = animXEncoded;
        arr[sz++] = animYEncoded;
        ints[sz++] = textureId;
        arr[sz++] = animDivisor;
        arr[sz++] = alpha;
      }
      vertexBuf.data = arr;
    }
    /**
     * @internal
     * @ignore
     */
    isModified(anim) {
      if (
        this.rects_count * POINT_STRUCT_SIZE !== this.pointsBuf.length ||
        (anim && this.hasAnimatedTile)
      ) {
        return true;
      }
      return false;
    }
    /**
     * This will pull forward the modification marker.
     *
     * @internal
     * @ignore
     */
    clearModify() {
      this.rects_count = this.pointsBuf.length / POINT_STRUCT_SIZE;
    }
    addBounds(bounds) {
      const _bounds = this.tilemapBounds;
      bounds.addFrame(_bounds.minX, _bounds.minY, _bounds.maxX, _bounds.maxY);
    }
    get bounds() {
      return this.tilemapBounds;
    }
    /** @override */
    destroy(options) {
      super.destroy(options);
      this.destroyVb();
    }
    /**
     * Deprecated signature for {@link Tilemap.tile tile}.
     *
     * @deprecated Since @pixi/tilemap 3.
     */
    addFrame(texture, x, y, animX, animY) {
      this.tile(texture, x, y, {
        animX,
        animY,
      });
      return true;
    }
    /**
     * Deprecated signature for {@link Tilemap.tile tile}.
     *
     * @deprecated Since @pixi/tilemap 3.
     */
    // eslint-disable-next-line max-params
    addRect(
      textureIndex,
      u,
      v,
      x,
      y,
      tileWidth,
      tileHeight,
      animX = 0,
      animY = 0,
      rotate = 0,
      animCountX = 1024,
      animCountY = 1024,
      animDivisor = 1,
      alpha = 1,
    ) {
      return this.tile(textureIndex, x, y, {
        u,
        v,
        tileWidth,
        tileHeight,
        animX,
        animY,
        rotate,
        animCountX,
        animCountY,
        animDivisor,
        alpha,
      });
    }
  }

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) =>
    key in obj
      ? __defProp(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value,
        })
      : (obj[key] = value);
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  class CompositeTilemap extends pixi_js.Container {
    // private shadowColor = new Float32Array([0.0, 0.0, 0.0, 0.5]);
    /**
     * @param tileset - A list of tile base-textures that will be used to eagerly initialized the layered
     *  tilemaps. This is only an performance optimization, and using {@link CompositeTilemap.tile tile}
     *  will work equivalently.
     */
    constructor(tileset) {
      super();
      /** The hard limit on the number of tile textures used in each tilemap. */
      __publicField(this, "texturesPerTilemap");
      /**
       * The animation frame vector.
       *
       * Animated tiles have four parameters - `animX`, `animY`, `animCountX`, `animCountY`. The textures
       * of adjacent animation frames are at offset `animX` or `animY` of each other, with `animCountX` per
       * row and `animCountY` per column.
       *
       * The animation frame vector specifies which animation frame texture to use. If the x/y coordinate is
       * larger than the `animCountX` or `animCountY` for a specific tile, the modulus is taken.
       */
      __publicField(this, "tileAnim", null);
      /** The last modified tilemap. */
      __publicField(this, "lastModifiedTilemap", null);
      __publicField(this, "modificationMarker", 0);
      /**
       * Alias for {@link CompositeTilemap.tileset tileset}.
       *
       * @deprecated Since @pixi/tilemap 3.
       */
      __publicField(this, "setBitmaps", this.tileset);
      this.texturesPerTilemap = settings.TEXTURES_PER_TILEMAP;
      this.tileset(tileset);
    }
    /**
     * This will preinitialize the tilesets of the layered tilemaps.
     *
     * If used after a tilemap has been created (or a tile added), this will overwrite the tile textures of the
     * existing tilemaps. Passing the tileset to the constructor instead is the best practice.
     *
     * @param tileTextures - The list of tile textures that make up the tileset.
     */
    tileset(tileTextures) {
      if (!tileTextures) {
        tileTextures = [];
      }
      const texPerChild = this.texturesPerTilemap;
      const len1 = this.children.length;
      const len2 = Math.ceil(tileTextures.length / texPerChild);
      for (let i = 0; i < Math.min(len1, len2); i++) {
        this.children[i].setTileset(
          tileTextures.slice(i * texPerChild, (i + 1) * texPerChild),
        );
      }
      for (let i = len1; i < len2; i++) {
        const tilemap = new Tilemap(
          tileTextures.slice(i * texPerChild, (i + 1) * texPerChild),
        );
        tilemap.compositeParent = true;
        this.addChild(tilemap);
      }
      return this;
    }
    /** Clears the tilemap composite. */
    clear() {
      for (let i = 0; i < this.children.length; i++) {
        this.children[i].clear();
      }
      this.modificationMarker = 0;
      return this;
    }
    /** Changes the rotation of the last added tile. */
    tileRotate(rotate) {
      if (this.lastModifiedTilemap) {
        this.lastModifiedTilemap.tileRotate(rotate);
      }
      return this;
    }
    /** Changes `animX`, `animCountX` of the last added tile. */
    tileAnimX(offset, count) {
      if (this.lastModifiedTilemap) {
        this.lastModifiedTilemap.tileAnimX(offset, count);
      }
      return this;
    }
    /** Changes `animY`, `animCountY` of the last added tile. */
    tileAnimY(offset, count) {
      if (this.lastModifiedTilemap) {
        this.lastModifiedTilemap.tileAnimY(offset, count);
      }
      return this;
    }
    /** Changes `tileAnimDivisor` value of the last added tile. */
    tileAnimDivisor(divisor) {
      if (this.lastModifiedTilemap) {
        this.lastModifiedTilemap.tileAnimDivisor(divisor);
      }
      return this;
    }
    /**
     * Adds a tile that paints the given tile texture at (x, y).
     *
     * @param tileTexture - The tile texture. You can pass an index into the composite tilemap as well.
     * @param x - The local x-coordinate of the tile's location.
     * @param y - The local y-coordinate of the tile's location.
     * @param options - Additional options to pass to {@link Tilemap.tile}.
     * @param [options.u=texture.frame.x] - The x-coordinate of the texture in its base-texture's space.
     * @param [options.v=texture.frame.y] - The y-coordinate of the texture in its base-texture's space.
     * @param [options.tileWidth=texture.orig.width] - The local width of the tile.
     * @param [options.tileHeight=texture.orig.height] - The local height of the tile.
     * @param [options.animX=0] - For animated tiles, this is the "offset" along the x-axis for adjacent
     *      animation frame textures in the base-texture.
     * @param [options.animY=0] - For animated tiles, this is the "offset" along the y-axis for adjacent
     *      animation frames textures in the base-texture.
     * @param [options.rotate=0]
     * @param [options.animCountX=1024] - For animated tiles, this is the number of animation frame textures
     *      per row.
     * @param [options.animCountY=1024] - For animated tiles, this is the number of animation frame textures
     *      per column.
     * @param [options.animDivisor=1] - For animated tiles, this is the animation duration each frame
     * @param [options.alpha=1] - Tile alpha
     * @return This tilemap, good for chaining.
     */
    tile(tileTexture, x, y, options = {}) {
      let tilemap = null;
      const children = this.children;
      this.lastModifiedTilemap = null;
      if (typeof tileTexture === "number") {
        const childIndex = (tileTexture / this.texturesPerTilemap) >> 0;
        let tileIndex = 0;
        tilemap = children[childIndex];
        if (!tilemap) {
          tilemap = children[0];
          if (!tilemap) return this;
          tileIndex = 0;
        } else {
          tileIndex = tileTexture % this.texturesPerTilemap;
        }
        tilemap.tile(tileIndex, x, y, options);
      } else {
        if (typeof tileTexture === "string") {
          tileTexture = pixi_js.Texture.from(tileTexture);
        }
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          const tex = child.getTileset().arr;
          for (let j = 0; j < tex.length; j++) {
            if (tex[j] === tileTexture.source) {
              tilemap = child;
              break;
            }
          }
          if (tilemap) {
            break;
          }
        }
        if (!tilemap) {
          for (let i = children.length - 1; i >= 0; i--) {
            const child = children[i];
            if (child.getTileset().count < this.texturesPerTilemap) {
              tilemap = child;
              child.getTileset().push(tileTexture.source);
              break;
            }
          }
          if (!tilemap) {
            tilemap = new Tilemap(tileTexture.source);
            tilemap.compositeParent = true;
            this.addChild(tilemap);
          }
        }
        tilemap.tile(tileTexture, x, y, options);
      }
      this.lastModifiedTilemap = tilemap;
      return this;
    }
    /**
     * @internal
     * @ignore
     */
    isModified(anim) {
      const layers = this.children;
      if (this.modificationMarker !== layers.length) {
        return true;
      }
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].isModified(anim)) {
          return true;
        }
      }
      return false;
    }
    /**
     * @internal
     * @ignore
     */
    clearModify() {
      const layers = this.children;
      this.modificationMarker = layers.length;
      for (let i = 0; i < layers.length; i++) {
        layers[i].clearModify();
      }
    }
    /**
     * @deprecated Since @pixi/tilemap 3.
     * @see CompositeTilemap.tile
     */
    addFrame(
      texture,
      x,
      y,
      animX,
      animY,
      animWidth,
      animHeight,
      animDivisor,
      alpha,
    ) {
      return this.tile(texture, x, y, {
        animX,
        animY,
        animCountX: animWidth,
        animCountY: animHeight,
        animDivisor,
        alpha,
      });
    }
    /**
     * @deprecated @pixi/tilemap 3
     * @see CompositeTilemap.tile
     */
    // eslint-disable-next-line max-params
    addRect(
      textureIndex,
      u,
      v,
      x,
      y,
      tileWidth,
      tileHeight,
      animX,
      animY,
      rotate,
      animWidth,
      animHeight,
    ) {
      const childIndex = (textureIndex / this.texturesPerTilemap) >> 0;
      const textureId = textureIndex % this.texturesPerTilemap;
      if (
        this.children[childIndex] &&
        this.children[childIndex].getTileset().count > 0
      ) {
        this.lastModifiedTilemap = this.children[childIndex];
        this.lastModifiedTilemap.addRect(
          textureId,
          u,
          v,
          x,
          y,
          tileWidth,
          tileHeight,
          animX,
          animY,
          rotate,
          animWidth,
          animHeight,
        );
      } else {
        this.lastModifiedTilemap = null;
      }
      return this;
    }
    /**
     * @deprecated Since @pixi/tilemap 3.
     * @readonly
     * @see CompositeTilemap.texturesPerTilemap
     */
    get texPerChild() {
      return this.texturesPerTilemap;
    }
  }

  pixi_js.extensions.add(TilemapPipe);
  pixi_js.extensions.add(GlTilemapAdaptor);
  pixi_js.extensions.add(GpuTilemapAdaptor);

  exports.CompositeTilemap = CompositeTilemap;
  exports.Constant = Constant;
  exports.POINT_STRUCT_SIZE = POINT_STRUCT_SIZE;
  exports.Tilemap = Tilemap;
  exports.TilemapAdaptor = TilemapAdaptor;
  exports.TilemapGeometry = TilemapGeometry;
  exports.TilemapPipe = TilemapPipe;
  exports.settings = settings;

  return exports;
})({}, PIXI);
//# sourceMappingURL=pixi-tilemap.js.map
