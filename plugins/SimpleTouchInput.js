(function (exports) {
    "use strict";

    // Hardcoded parameters

    const Method = {};

    //=============================================================================
    // Main
    //=============================================================================

    //-----------------------------------------------------------------------------
    // Window

    //6718
    Window.prototype._refreshCursor = function () {
        var w = this._cursorRect.width;
        var h = this._cursorRect.height;
        var m = 4;
        var bitmap = new Bitmap(w, h);

        this._windowCursorSprite.bitmap = bitmap;

        if (w > 0 && h > 0 && this._windowskin) {
            var skin = this._windowskin;
            var p = 96;
            var q = 48;
            bitmap.blt(skin, p + m, p + m, q - m * 2, q - m * 2, m, m, w - m * 2, h - m * 2);
            bitmap.blt(skin, p + m, p + 0, q - m * 2, m, m, 0, w - m * 2, m);
            bitmap.blt(skin, p + m, p + q - m, q - m * 2, m, m, h - m, w - m * 2, m);
            bitmap.blt(skin, p + 0, p + m, m, q - m * 2, 0, m, m, h - m * 2);
            bitmap.blt(skin, p + q - m, p + m, m, q - m * 2, w - m, m, m, h - m * 2);
            bitmap.blt(skin, p + 0, p + 0, m, m, 0, 0, m, m);
            bitmap.blt(skin, p + q - m, p + 0, m, m, w - m, 0, m, m);
            bitmap.blt(skin, p + 0, p + q - m, m, m, 0, h - m, m, m);
            bitmap.blt(skin, p + q - m, p + q - m, m, m, w - m, h - m, m, m);
        }
        this._updateCursorPos();
    };

    //6804
    var _Window_updateCursor = Window.prototype._updateCursor;
    Window.prototype._updateCursor = function () {
        _Window_updateCursor.call(this);
        this._updateCursorPos();
    };

    Window.prototype._updateCursorPos = function () {
        var pad = this._padding;
        var x = this._cursorRect.x + pad - this.origin.x;
        var y = this._cursorRect.y + pad - this.origin.y;
        var w = this._cursorRect.width;
        var h = this._cursorRect.height;
        var x2 = Math.max(x, pad);
        var y2 = Math.max(y, pad);
        var ox = x2 - x;
        var oy = y2 - y;
        var w2 = Math.min(w, this._width - pad - x2);
        var h2 = Math.min(h, this._height - pad - y2);

        this._windowCursorSprite.setFrame(ox, oy, w2, h2);
        this._windowCursorSprite.move(x2, y2);
    };

    //-----------------------------------------------------------------------------
    // TouchInput

    //3487
    var _TouchInput_clear = TouchInput.clear;
    TouchInput.clear = function () {
        _TouchInput_clear.call(this);
        this._startX = 0;
        this._startY = 0;
        this._leftSwipe = false;
        this._rightSwipe = false;
        this._ok = false;
        this._doubleTap = false;
        this._interval = -1;
    };

    //3515
    var _TouchInput_update = TouchInput.update;
    TouchInput.update = function () {
        var oldDate = this.date;
        _TouchInput_update.call(this);
        if (this.isReleased()) {
            if (this._pressedTime >= 6) {
                var sx = (this._x - this._startX) / this._pressedTime;
                this._leftSwipe = sx < -6;
                this._rightSwipe = sx > 6;
            } else {
                this._leftSwipe = false;
                this._rightSwipe = false;
            }
            /*
        if (!this._leftSwipe && !this._rightSwipe &&
                this._pressedTime <= paramLongPressTime) {
*/
            this._ok = true;
            this._interval = 0;
            /*
        } else {
            this._ok = false;
            this._doubleTap = false;
            this._interval = -1;
        }
*/
        } else {
            this._leftSwipe = false;
            this._rightSwipe = false;
            this._ok = false;
            this._doubleTap = false;
            if (this._interval >= 0) this._interval++;
        }
        if (this.date !== oldDate) {
            Graphics.setHiddenPointer(true);
        }
    };
    TouchInput.isLeftSwipe = function () {
        return this._leftSwipe;
    };

    TouchInput.isRightSwipe = function () {
        return this._rightSwipe;
    };

    TouchInput.isOk = function () {
        return this._ok;
    };

    TouchInput.isDoubleTap = function () {
        return this._doubleTap;
    };

    //3763
    var _TouchInput_onMouseMove = TouchInput._onMouseMove;
    TouchInput._onMouseMove = function (event) {
        var x = Graphics.pageToCanvasX(event.pageX);
        var y = Graphics.pageToCanvasY(event.pageY);
        if (Graphics.isInsideCanvas(x, y)) {
            this._onMove(x, y);
            this._date = Date.now();
        }
        Graphics.setHiddenPointer(false);
    }; //3891
    var _TouchInput_onTrigger = TouchInput._onTrigger;
    TouchInput._onTrigger = function (x, y) {
        _TouchInput_onTrigger.apply(this, arguments);
        this._startX = x;
        this._startY = y;
    };

    TouchInput.clearInterval = function () {
        this._interval = -1;
    };

    //-----------------------------------------------------------------------------
    // Window_Selectable

    //13
    var _Window_Selectable_initialize = Window_Selectable.prototype.initialize;
    Window_Selectable.prototype.initialize = function (x, y, width, height) {
        _Window_Selectable_initialize.apply(this, arguments);
        this._originYSpeed = [];
    };

    //
    if (Window_Selectable.prototype.hasOwnProperty("contentsHeight")) {
        var _Window_Selectable_contentsHeight = Window_Selectable.prototype.contentsHeight;
    }
    Window_Selectable.prototype.contentsHeight = function () {
        if (_Window_Selectable_contentsHeight) {
            return _Window_Selectable_contentsHeight.call(this) + this.itemHeight();
        } else {
            return Window_Base.prototype.contentsHeight.call(this) + this.itemHeight();
        }
    };

    //110
    var _Window_Selectable_setTopRow = Window_Selectable.prototype.setTopRow;
    Window_Selectable.prototype.setTopRow = function (row) {
        _Window_Selectable_setTopRow.apply(this, arguments);
        this.resetOy();
    };

    Window_Selectable.prototype.isTouchFollowing = function () {
        return TouchInput.date > Input.date;
    };

    //119
    var _Window_Selectable_resetScroll = Window_Selectable.prototype.resetScroll;
    Window_Selectable.prototype.resetScroll = function () {
        _Window_Selectable_resetScroll.call(this);
        this.resetOy();
    };

    //140
    Window_Selectable.prototype.setBottomRow = function (row) {
        var oy = (row + 1) * this.itemHeight() - this.height + this.padding * 2;
        this.setOy(oy - this._scrollY);
    };

    Window_Selectable.prototype.resetOy = function () {
        this.origin.y = 0;
        this._originYSpeed = [];
        this._scrollOyDuration = 0;
    };

    Window_Selectable.prototype.setOy = function (oy) {
        var sr = Math.floor(oy / this.itemHeight());
        var topRow = this.topRow();
        if (sr !== 0) _Window_Selectable_setTopRow.call(this, topRow + sr);
        if ((topRow <= 0 && oy < 0) || (this.topRow() >= this.maxTopRow() && oy > 0)) {
            this.resetOy();
        } else {
            this.origin.y = oy.mod(this.itemHeight());
        }
    };

    Window_Selectable.prototype.gainOy = function (amount) {
        this.setOy(Math.floor(this.origin.y + amount));
    };

    //258
    var _Window_Selectable_scrollDown = Window_Selectable.prototype.scrollDown;
    Window_Selectable.prototype.scrollDown = function () {
        _Window_Selectable_scrollDown.call(this);
        this.resetOy();
    };

    //264
    var _Window_Selectable_scrollUp = Window_Selectable.prototype.scrollUp;
    Window_Selectable.prototype.scrollUp = function () {
        if (this.origin.y > 0) {
            this.resetOy();
        } else {
            _Window_Selectable_scrollUp.call(this);
            this.resetOy();
        }
    };

    //270
    var _Window_Selectable_update = Window_Selectable.prototype.update;
    Window_Selectable.prototype.update = function () {
        _Window_Selectable_update.call(this);
    };

    //280
    var _Window_Selectable_updateArrows = Window_Selectable.prototype.updateArrows;
    Window_Selectable.prototype.updateArrows = function () {
        _Window_Selectable_updateArrows.call(this);
        var bottomY = this.maxRows() * this.itemHeight();
        var realY = this._scrollY + this.origin.y + this.height - this.padding * 2;
        this.downArrowVisible = this.downArrowVisible && bottomY > realY;
        this.upArrowVisible = this.upArrowVisible || this.origin.y > 0;
    };

    //340
    Window_Selectable.prototype.processTouch = function () {
        if (this.isOpenAndActive()) {
            if (TouchInput.isTriggered()) {
                this._touching = true;
                this._selecting = true;
                this._touchLastY = TouchInput.y;
                this._touchInsided = this.isTouchedInsideFrame();
                this._originYSpeed = [];
            } else if (TouchInput.isCancelled()) {
                if (this.isCancelEnabled()) {
                    this.processCancel();
                }
            }
            if (this._touching) {
                if (TouchInput.isTriggered()) {
                    this.onTouch(false);
                } else if (TouchInput.isPressed()) {
                    if (this.touchScroll()) {
                        this._selecting = false;
                    }
                } else {
                    this.touchSwipe();
                    if (this._selecting && TouchInput.isOk()) {
                        this.onTouch(true);
                    } else {
                        TouchInput.clearInterval();
                    }
                    this._touching = false;
                    this._selecting = false;
                }
            }
            if (!this._touching) {
                if (this._originYSpeed.length > 0) {
                    this.addOriginYSpeed(this._originYSpeed[0] * 0.9);
                    if (Math.abs(this.originYSpeed()) < 2) this._originYSpeed = [];
                } else if (this.isTouchFollowing() && TouchInput.isMoved()) {
                    this.onTouch(false);
                }
            }
            this.updateTouchScroll();
        } else {
            this._touching = false;
            this._selecting = false;
            this._touchInside = false;
        }
    };

    Window_Selectable.prototype.addOriginYSpeed = function (speed) {
        this._originYSpeed.push(speed);
        if (this._originYSpeed.length > 3) {
            this._originYSpeed.shift();
        }
    };

    Window_Selectable.prototype.originYSpeed = function () {
        if (this._touching) {
            return this._originYSpeed[this._originYSpeed.length - 1] || 0;
        }
        var speed = 0;
        for (var i = 0; i < this._originYSpeed.length; i++) {
            speed += this._originYSpeed[i];
        }
        return speed / (this._originYSpeed.length || 1);
    };

    Window_Selectable.prototype.touchScroll = function () {
        if (this._touchInsided) {
            this.addOriginYSpeed(this._touchLastY - TouchInput.y);
            this._touchLastY = TouchInput.y;
            return Math.abs(TouchInput.y - TouchInput._startY) > 12;
        }
        return false;
    };

    Window_Selectable.prototype.touchSwipe = function () {
        if (TouchInput.isLeftSwipe()) {
            if (this.isHandled("pageup")) this.processPageup();
        } else if (TouchInput.isRightSwipe()) {
            if (this.isHandled("pagedown")) this.processPagedown();
        }
    };

    Window_Selectable.prototype.updateTouchScroll = function () {
        if (this._touchInsided && this._originYSpeed.length > 0) {
            this.gainOy(this.originYSpeed());
        }
    };

    //368
    var _Window_Selectable_onTouch = Window_Selectable.prototype.onTouch;
    Window_Selectable.prototype.onTouch = function (triggered) {
        if (triggered) {
            if (false && $gameParty.inBattle() && !this._touchInsided && !this.isTouchedInsideFrame()) {
                if (this.isCancelEnabled()) {
                    this.processCancel();
                }
            } else {
                TouchInput.clearInterval();
                this._stayCount = 0;
                // --------------------------------------------------------
                var lastIndex = this.index();
                var x = this.canvasToLocalX(TouchInput.x);
                var y = this.canvasToLocalY(TouchInput.y);
                var hitIndex = this.hitTest(x, y);
                if (hitIndex >= 0) {
                    if (hitIndex === this.index()) {
                        if (triggered && this.isTouchOkEnabled()) {
                            this.processOk();
                        }
                    } else if (this.isCursorMovable()) {
                        this.select(hitIndex);
                    }
                } else if (this._stayCount >= 10) {
                    if (y < this.padding) {
                        this.cursorUp();
                    } else if (y >= this.height - this.padding) {
                        this.cursorDown();
                    }
                }
                // --------------------------------------------------------
            }
        } else {
            this._stayCount = 0;
            // --------------------------------------------------------
            var lastIndex = this.index();
            var x = this.canvasToLocalX(TouchInput.x);
            var y = this.canvasToLocalY(TouchInput.y);
            var hitIndex = this.hitTest(x, y);
            if (hitIndex >= 0) {
                if (hitIndex === this.index()) {
                    if (triggered && this.isTouchOkEnabled()) {
                        this.processOk();
                    }
                } else if (this.isCursorMovable()) {
                    this.select(hitIndex);
                }
            } else if (this._stayCount >= 10) {
                if (y < this.padding) {
                    this.cursorUp();
                } else if (y >= this.height - this.padding) {
                    this.cursorDown();
                }
            }
            // --------------------------------------------------------
            if (this.index() !== lastIndex) {
                TouchInput.clearInterval();
            }
        }
    };

    //393
    Window_Selectable.prototype.hitTest = function (x, y) {
        if (this.isContentsArea(x, y)) {
            var cx = x - this.padding;
            var cy = y - this.padding + this.origin.y;
            var topIndex = this.topIndex();
            var maxPageItems = this.maxPageItems() + this.maxCols();
            for (var i = 0; i < maxPageItems; i++) {
                var index = topIndex + i;
                if (index < this.maxItems()) {
                    var rect = this.itemRect(index);
                    var right = rect.x + rect.width;
                    var bottom = rect.y + rect.height;
                    if (cx >= rect.x && cy >= rect.y && cx < right && cy < bottom) {
                        return index;
                    }
                }
            }
        }

        return -1;
    };

    //494
    var _Window_Selectable_updateCursor = Window_Selectable.prototype.updateCursor;
    Window_Selectable.prototype.updateCursor = function () {
        _Window_Selectable_updateCursor.call(this);
        if (!this._cursorAll) {
            var rect = this.itemRect(this.index());
            this._targetCursorX = rect.x + this._scrollX;
            this._targetCursorY = rect.y + this._scrollY;
            this._cursorX = this._targetCursorX;
            this._cursorY = this._targetCursorY;
        } else {
            this.resetOy();
        }
    };

    //507
    Window_Selectable.prototype.isCursorVisible = function () {
        var row = this.row();
        return row >= this.topRow() && row <= this.bottomRow() + 1;
    };

    Window_Selectable.prototype.isItemPartiallyVisible = function (index) {
        var rect = this.itemRect(index);
        var cy = rect.y - this.origin.y;
        var pageHeight = this.height - this.padding * 2;
        return cy + rect.height >= 0 && cy < pageHeight + rect.height;
    };

    //512
    var _Window_Selectable_ensureCursorVisible = Window_Selectable.prototype.ensureCursorVisible;
    Window_Selectable.prototype.ensureCursorVisible = function () {
        if (this.isTouchFollowing() && this.isItemPartiallyVisible(this.index())) {
            // Do not scroll if last input was mouse/touch and item is partially visible
        } else {
            _Window_Selectable_ensureCursorVisible.call(this);
            if (this.row() === this.topRow()) {
                this.setTopRow(this.targetTopRow());
            }
        }
    };

    //541
    var _Window_Selectable_drawAllItems = Window_Selectable.prototype.drawAllItems;
    Window_Selectable.prototype.drawAllItems = function () {
        _Window_Selectable_drawAllItems.call(this);
        var topIndex = this.topIndex() + this.maxPageItems();
        for (var i = 0; i < this.maxCols(); i++) {
            var index = topIndex + i;
            if (index < this.maxItems()) {
                this.drawItem(index);
            }
        }
    };

    //-----------------------------------------------------------------------------
    // Window_ChoiceList

    //99
    var _Window_ChoiceList_contentsHeight = Window_ChoiceList.prototype.contentsHeight;
    Window_ChoiceList.prototype.contentsHeight = function () {
        return _Window_ChoiceList_contentsHeight.call(this) + this.itemHeight();
    };

    //-----------------------------------------------------------------------------
    // Window_Status

    Window_Status.prototype.isTouchedInsideFrame = function () {
        return false;
    };

    //-----------------------------------------------------------------------------
    // Window_ShopStatus

    //48
    var _Window_ShopStatus_changePage = Window_ShopStatus.prototype.changePage;
    Window_ShopStatus.prototype.changePage = function () {
        _Window_ShopStatus_changePage.call(this);
        Input.update();
        TouchInput.update();
    };

    //-----------------------------------------------------------------------------
    // Scene_Base

    //96
    var _Scene_Base_start = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function () {
        _Scene_Base_start.apply(this, arguments);
        Graphics.updateMousePointer();
    };

    //=============================================================================
    // Graphics
    //  Set cursor to custom if exists, else default
    //=============================================================================
    Graphics._PointerType = "auto";
    Graphics._hiddenPointer = false;

    Graphics.setHiddenPointer = function (value) {
        this._hiddenPointer = !!value;
        this.updateMousePointer();
    };

    Graphics.setPointerType = function (type) {
        this._PointerType = type;
        this.updateMousePointer();
    };

    Graphics.updateMousePointer = function () {
        if (!document.getElementById("MousePointer")) {
            let canvas = document.getElementById("GameCanvas");
            var span = document.createElement("span");
            span.id = "MousePointer";
            span.style.position = "absolute";
            span.style.left = "0px";
            span.style.top = "0px";
            span.style.right = "0px";
            span.style.bottom = "0px";
            span.style.width = Number(canvas.style.width.replace("px", "")) - 16 + "px";
            span.style.height = Number(canvas.style.height.replace("px", "")) - 16 + "px";
            span.style.margin = "auto";
            span.style.zIndex = 999;
            span.oncontextmenu = function () {
                return false;
            };
            document.body.appendChild(span);
        }
        document.getElementById("MousePointer").style.cursor = this._hiddenPointer ? "none" : this._PointerType;
    };

    //=============================================================================
    // Input
    //  Hide pointer on keyboard input
    //=============================================================================
    var _Input_update = Input.update;
    Input.update = function () {
        var oldDate = this.date;
        _Input_update.apply(this, arguments);
        if (this.date !== oldDate) {
            Graphics.setHiddenPointer(true);
        }
    };

    // Initialize cursor
    var img = new Image();
    img.onload = function () {
        Graphics.setPointerType("url(img/system/cursor.png), auto");
    };
    img.onerror = function () {
        Graphics.setPointerType("auto");
    };
    img.src = "img/system/cursor.png";

    // added by nekoma start.
    var windowResizeTimeoutId = null;
    window.addEventListener("resize", (event) => {
        let span = document.getElementById("MousePointer");
        if (span) {
            clearTimeout(windowResizeTimeoutId);
            windowResizeTimeoutId = setTimeout(() => {
                let canvas = document.getElementById("GameCanvas");
                span.style.width = Number(canvas.style.width.replace("px", "")) - 16 + "px";
                span.style.height = Number(canvas.style.height.replace("px", "")) - 16 + "px";
            }, 200);
        }
    });
    // added by nekoma end.
})(this);
