//-----------------------------------------------------------------------------
/**
 * The layer which contains game windows.
 *
 * @class WindowLayer
 * @constructor
 */
function WindowLayer() {
    this.initialize.apply(this, arguments);
}

WindowLayer.prototype = Object.create(PIXI.Container.prototype);
WindowLayer.prototype.constructor = WindowLayer;

WindowLayer.prototype.initialize = function() {
    PIXI.Container.call(this);
    this._width = 0;
    this._height = 0;

    this._windowMask = new PIXI.Graphics();
    this._windowMask.beginFill(0xffffff, 1);
    this._windowMask.drawRect(0, 0, 0, 0);
    this._windowMask.endFill();
    this._windowRect = this._windowMask.geometry.graphicsData[0].shape;
    this._windowMaskShift = new PIXI.Point();

    this.filterArea = new PIXI.Rectangle();
    this.filters = [WindowLayer.voidFilter];

    //temporary fix for memory leak bug
    this.on('removed', this.onRemoveAsAChild);
};

WindowLayer.prototype.onRemoveAsAChild = function() {
    this.removeChildren();
}

WindowLayer.voidFilter = new PIXI.filters.AlphaFilter();

/**
 * The width of the window layer in pixels.
 *
 * @property width
 * @type Number
 */
Object.defineProperty(WindowLayer.prototype, 'width', {
    get: function() {
        return this._width;
    },
    set: function(value) {
        this._width = value;
    },
    configurable: true
});

/**
 * The height of the window layer in pixels.
 *
 * @property height
 * @type Number
 */
Object.defineProperty(WindowLayer.prototype, 'height', {
    get: function() {
        return this._height;
    },
    set: function(value) {
        this._height = value;
    },
    configurable: true
});

/**
 * Sets the x, y, width, and height all at once.
 *
 * @method move
 * @param {Number} x The x coordinate of the window layer
 * @param {Number} y The y coordinate of the window layer
 * @param {Number} width The width of the window layer
 * @param {Number} height The height of the window layer
 */
WindowLayer.prototype.move = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
};

/**
 * Updates the window layer for each frame.
 *
 * @method update
 */
WindowLayer.prototype.update = function() {
    this.children.forEach(function(child) {
        if (child.update) {
            child.update();
        }
    });
};

/**
 * @method render
 * @param {Object} renderSession
 * @private
 */
WindowLayer.prototype.render = function(renderer) {
    if (!this.visible || !this.renderable) return;
    if (this.children.length === 0) return;

    // var sourceFrame = renderer.renderTexture.sourceFrame;
    // var projectionMatrix = renderer.projection.projectionMatrix;
    // this._windowMaskShift.x = Math.round((projectionMatrix.tx + 1) / 2 * sourceFrame.width);
    // this._windowMaskShift.y = Math.round((projectionMatrix.ty - 1) / 2 * sourceFrame.height);
    renderer.batch.flush();

    const gl = renderer.gl;
    gl.enable(gl.STENCIL_TEST);

    for (var i = this.children.length - 1; i >= 0; --i) {
        var child = this.children[i];
        if (child._isWindow && child.visible && child.openness > 0) {
            gl.stencilFunc(gl.EQUAL, 0, 0xff);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
            child.render(renderer);
            renderer.batch.flush();

            this._maskWindow(child, this._windowMaskShift);

            gl.stencilFunc(gl.ALWAYS, 1, 0xff);
            gl.stencilOp(gl.KEEP, gl.REPLACE, gl.REPLACE);
            gl.colorMask(false, false, false, false);
            gl.depthMask(false);
            this._windowMask.render(renderer);
            renderer.batch.flush();
            gl.colorMask(true, true, true, true);
            gl.depthMask(true);
        }
    }

    gl.clearStencil(0);
    gl.clear(gl.STENCIL_BUFFER_BIT);
    gl.disable(gl.STENCIL_TEST);

    renderer.batch.flush();

    for (var j = 0; j < this.children.length; j++) {
        if (!this.children[j]._isWindow) {
            this.children[j].render(renderer);
        }
    }

    renderer.batch.flush();
};

/**
 * @method _maskWindow
 * @param {Window} window
 * @private
 */
WindowLayer.prototype._maskWindow = function(window, shift) {
    this._windowMask.clear();
    this._windowMask.beginFill(0xffffff);
    this._windowMask.drawRect(
        this.x + shift.x + window.x,
        this.y + shift.y + window.y + window.height / 2 * (1 - window._openness / 255),
        window.width,
        window.height * window._openness / 255
    );
    this._windowMask.endFill();
};

// The important members from Pixi.js

/**
 * The x coordinate of the window layer.
 *
 * @property x
 * @type Number
 */

/**
 * The y coordinate of the window layer.
 *
 * @property y
 * @type Number
 */

/**
 * [read-only] The array of children of the window layer.
 *
 * @property children
 * @type Array
 */

/**
 * [read-only] The object that contains the window layer.
 *
 * @property parent
 * @type Object
 */

/**
 * Adds a child to the container.
 *
 * @method addChild
 * @param {Object} child The child to add
 * @return {Object} The child that was added
 */

/**
 * Adds a child to the container at a specified index.
 *
 * @method addChildAt
 * @param {Object} child The child to add
 * @param {Number} index The index to place the child in
 * @return {Object} The child that was added
 */

/**
 * Removes a child from the container.
 *
 * @method removeChild
 * @param {Object} child The child to remove
 * @return {Object} The child that was removed
 */

/**
 * Removes a child from the specified index position.
 *
 * @method removeChildAt
 * @param {Number} index The index to get the child from
 * @return {Object} The child that was removed
 */
