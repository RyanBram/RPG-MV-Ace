//-----------------------------------------------------------------------------
// Window_Selectable
//
// The window class with cursor movement and scroll functions.

function Window_Selectable() {
  this.initialize.apply(this, arguments);
}

Window_Selectable.prototype = Object.create(Window_Base.prototype);
Window_Selectable.prototype.constructor = Window_Selectable;

Window_Selectable.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._index = -1;
    this._cursorFixed = false;
    this._cursorAll = false;
    this._stayCount = 0;
    this._helpWindow = null;
    this._handlers = {};
    this._touching = false;
    this._scrollX = 0;
    this._scrollY = 0;
    this.deactivate();
    this._originYSpeed = [];
};

Window_Selectable.prototype.index = function () {
  return this._index;
};

Window_Selectable.prototype.cursorFixed = function () {
  return this._cursorFixed;
};

Window_Selectable.prototype.setCursorFixed = function (cursorFixed) {
  this._cursorFixed = cursorFixed;
};

Window_Selectable.prototype.cursorAll = function () {
  return this._cursorAll;
};

Window_Selectable.prototype.setCursorAll = function (cursorAll) {
  this._cursorAll = cursorAll;
};

Window_Selectable.prototype.maxCols = function () {
  return 1;
};

Window_Selectable.prototype.maxItems = function () {
  return 0;
};

Window_Selectable.prototype.spacing = function () {
  return 12;
};

Window_Selectable.prototype.itemWidth = function () {
  return Math.floor(
    (this.width - this.padding * 2 + this.spacing()) / this.maxCols() -
      this.spacing(),
  );
};

Window_Selectable.prototype.itemHeight = function () {
  return this.lineHeight();
};

Window_Selectable.prototype.maxRows = function () {
  return Math.max(Math.ceil(this.maxItems() / this.maxCols()), 1);
};

Window_Selectable.prototype.activate = function () {
  Window_Base.prototype.activate.call(this);
  this.reselect();
};

Window_Selectable.prototype.deactivate = function () {
  Window_Base.prototype.deactivate.call(this);
  this.reselect();
};

Window_Selectable.prototype.select = function (index) {
  this._index = index;
  this._stayCount = 0;
  this.ensureCursorVisible();
  this.updateCursor();
  this.callUpdateHelp();
};

Window_Selectable.prototype.deselect = function () {
  this.select(-1);
};

Window_Selectable.prototype.reselect = function () {
  this.select(this._index);
};

Window_Selectable.prototype.row = function () {
  return Math.floor(this.index() / this.maxCols());
};

Window_Selectable.prototype.topRow = function () {
  return Math.floor(this._scrollY / this.itemHeight());
};

Window_Selectable.prototype.maxTopRow = function () {
  return Math.max(0, this.maxRows() - this.maxPageRows());
};

Window_Selectable.prototype.setTopRow = function(row) {
    var scrollY = row.clamp(0, this.maxTopRow()) * this.itemHeight();
    if (this._scrollY !== scrollY) {
        this._scrollY = scrollY;
        this.refresh();
        this.updateCursor();
    }
    this.resetOy();
};

Window_Selectable.prototype.resetScroll = function() {
    this.setTopRow(0);
    this.resetOy();
};

Window_Selectable.prototype.maxPageRows = function () {
  var pageHeight = this.height - this.padding * 2;
  return Math.floor(pageHeight / this.itemHeight());
};

Window_Selectable.prototype.maxPageItems = function () {
  return this.maxPageRows() * this.maxCols();
};

Window_Selectable.prototype.isHorizontal = function () {
  return this.maxPageRows() === 1;
};

Window_Selectable.prototype.bottomRow = function () {
  return Math.max(0, this.topRow() + this.maxPageRows() - 1);
};

Window_Selectable.prototype.setBottomRow = function(row) {
    var oy = (row + 1) * this.itemHeight() - this.height + this.padding * 2;
    this.setOy(oy - this._scrollY);
};

Window_Selectable.prototype.topIndex = function () {
  return this.topRow() * this.maxCols();
};

Window_Selectable.prototype.itemRect = function (index) {
  var rect = new Rectangle();
  var maxCols = this.maxCols();
  rect.width = this.itemWidth();
  rect.height = this.itemHeight();
  rect.x = (index % maxCols) * (rect.width + this.spacing()) - this._scrollX;
  rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
  return rect;
};

Window_Selectable.prototype.itemRectForText = function (index) {
  var rect = this.itemRect(index);
  rect.x += this.textPadding();
  rect.width -= this.textPadding() * 2;
  return rect;
};

Window_Selectable.prototype.setHelpWindow = function (helpWindow) {
  this._helpWindow = helpWindow;
  this.callUpdateHelp();
};

Window_Selectable.prototype.showHelpWindow = function () {
  if (this._helpWindow) {
    this._helpWindow.show();
  }
};

Window_Selectable.prototype.hideHelpWindow = function () {
  if (this._helpWindow) {
    this._helpWindow.hide();
  }
};

Window_Selectable.prototype.setHandler = function (symbol, method) {
  this._handlers[symbol] = method;
};

Window_Selectable.prototype.isHandled = function (symbol) {
  return !!this._handlers[symbol];
};

Window_Selectable.prototype.callHandler = function (symbol) {
  if (this.isHandled(symbol)) {
    this._handlers[symbol]();
  }
};

Window_Selectable.prototype.isOpenAndActive = function () {
  return this.isOpen() && this.active;
};

Window_Selectable.prototype.isCursorMovable = function () {
  return (
    this.isOpenAndActive() &&
    !this._cursorFixed &&
    !this._cursorAll &&
    this.maxItems() > 0
  );
};

Window_Selectable.prototype.cursorDown = function (wrap) {
  var index = this.index();
  var maxItems = this.maxItems();
  var maxCols = this.maxCols();
  if (index < maxItems - maxCols || (wrap && maxCols === 1)) {
    this.select((index + maxCols) % maxItems);
  }
};

Window_Selectable.prototype.cursorUp = function (wrap) {
  var index = this.index();
  var maxItems = this.maxItems();
  var maxCols = this.maxCols();
  if (index >= maxCols || (wrap && maxCols === 1)) {
    this.select((index - maxCols + maxItems) % maxItems);
  }
};

Window_Selectable.prototype.cursorRight = function (wrap) {
  var index = this.index();
  var maxItems = this.maxItems();
  var maxCols = this.maxCols();
  if (maxCols >= 2 && (index < maxItems - 1 || (wrap && this.isHorizontal()))) {
    this.select((index + 1) % maxItems);
  }
};

Window_Selectable.prototype.cursorLeft = function (wrap) {
  var index = this.index();
  var maxItems = this.maxItems();
  var maxCols = this.maxCols();
  if (maxCols >= 2 && (index > 0 || (wrap && this.isHorizontal()))) {
    this.select((index - 1 + maxItems) % maxItems);
  }
};

Window_Selectable.prototype.cursorPagedown = function () {
  var index = this.index();
  var maxItems = this.maxItems();
  if (this.topRow() + this.maxPageRows() < this.maxRows()) {
    this.setTopRow(this.topRow() + this.maxPageRows());
    this.select(Math.min(index + this.maxPageItems(), maxItems - 1));
  }
};

Window_Selectable.prototype.cursorPageup = function () {
  var index = this.index();
  if (this.topRow() > 0) {
    this.setTopRow(this.topRow() - this.maxPageRows());
    this.select(Math.max(index - this.maxPageItems(), 0));
  }
};

Window_Selectable.prototype.scrollDown = function() {
    var index = this.index();
    var maxItems = this.maxItems();
    var maxCols = this.maxCols();
    if (index < maxItems - maxCols || (maxCols === 1 && index < maxItems - 1)) {
        this.select((index + maxCols) % maxItems);
    }
    this.resetOy();
};

Window_Selectable.prototype.scrollUp = function() {
    var index = this.index();
    var maxItems = this.maxItems();
    var maxCols = this.maxCols();
    if (index >= maxCols || (maxCols === 1 && index > 0)) {
        this.select((index - maxCols + maxItems) % maxItems);
    }
    if (this.origin.y > 0) {
        this.resetOy();
    } else {
        var index = this.index();
        var maxItems = this.maxItems();
        var maxCols = this.maxCols();
        if (index >= maxCols || (maxCols === 1 && index > 0)) {
            this.select((index - maxCols + maxItems) % maxItems);
        }
        this.resetOy();
    }
};

Window_Selectable.prototype.update = function () {
  Window_Base.prototype.update.call(this);
  this.updateArrows();
  this.processCursorMove();
  this.processHandling();
  this.processWheel();
  this.processTouch();
  this._stayCount++;
};

Window_Selectable.prototype.updateArrows = function() {
    var topRow = this.topRow();
    var maxTopRow = this.maxTopRow();
    this.downArrowVisible = maxTopRow > 0 && topRow < maxTopRow;
    this.upArrowVisible = topRow > 0;
    var bottomY = this.maxRows() * this.itemHeight();
    var realY = this._scrollY + this.origin.y + this.height - this.padding * 2;
    this.downArrowVisible = this.downArrowVisible && bottomY > realY;
    this.upArrowVisible = (this.upArrowVisible || this.origin.y > 0);
};

Window_Selectable.prototype.processCursorMove = function () {
  if (this.isCursorMovable()) {
    var lastIndex = this.index();
    if (Input.isRepeated("down")) {
      this.cursorDown(Input.isTriggered("down"));
    }
    if (Input.isRepeated("up")) {
      this.cursorUp(Input.isTriggered("up"));
    }
    if (Input.isRepeated("right")) {
      this.cursorRight(Input.isTriggered("right"));
    }
    if (Input.isRepeated("left")) {
      this.cursorLeft(Input.isTriggered("left"));
    }
    if (!this.isHandled("pagedown") && Input.isTriggered("pagedown")) {
      this.cursorPagedown();
    }
    if (!this.isHandled("pageup") && Input.isTriggered("pageup")) {
      this.cursorPageup();
    }
    if (this.index() !== lastIndex) {
      SoundManager.playCursor();
    }
  }
};

Window_Selectable.prototype.processHandling = function () {
  if (this.isOpenAndActive()) {
    if (this.isOkEnabled() && this.isOkTriggered()) {
      this.processOk();
    } else if (this.isCancelEnabled() && this.isCancelTriggered()) {
      this.processCancel();
    } else if (this.isHandled("pagedown") && Input.isTriggered("pagedown")) {
      this.processPagedown();
    } else if (this.isHandled("pageup") && Input.isTriggered("pageup")) {
      this.processPageup();
    }
  }
};

Window_Selectable.prototype.processWheel = function () {
  if (this.isOpenAndActive()) {
    var threshold = 20;
    if (TouchInput.wheelY >= threshold) {
      this.scrollDown();
    }
    if (TouchInput.wheelY <= -threshold) {
      this.scrollUp();
    }
  }
};

Window_Selectable.prototype.processTouch = function() {
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

Window_Selectable.prototype.isTouchedInsideFrame = function () {
  var x = this.canvasToLocalX(TouchInput.x);
  var y = this.canvasToLocalY(TouchInput.y);
  return x >= 0 && y >= 0 && x < this.width && y < this.height;
};

Window_Selectable.prototype.onTouch = function(triggered) {
    if (triggered) {
        TouchInput.clearInterval();
        this._stayCount = 0;
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
    } else {
        this._stayCount = 0;
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
                this._touchHovering = true;
                this.select(hitIndex);
                this._touchHovering = false;
            }
        } else if (this._stayCount >= 10) {
            if (y < this.padding) {
                this.cursorUp();
            } else if (y >= this.height - this.padding) {
                this.cursorDown();
            }
        }
        if (this.index() !== lastIndex) {
            TouchInput.clearInterval();
        }
    }
};

Window_Selectable.prototype.hitTest = function(x, y) {
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

Window_Selectable.prototype.isContentsArea = function (x, y) {
  var left = this.padding;
  var top = this.padding;
  var right = this.width - this.padding;
  var bottom = this.height - this.padding;
  return x >= left && y >= top && x < right && y < bottom;
};

Window_Selectable.prototype.isTouchOkEnabled = function () {
  return this.isOkEnabled();
};

Window_Selectable.prototype.isOkEnabled = function () {
  return this.isHandled("ok");
};

Window_Selectable.prototype.isCancelEnabled = function () {
  return this.isHandled("cancel");
};

Window_Selectable.prototype.isOkTriggered = function () {
  return Input.isRepeated("ok");
};

Window_Selectable.prototype.isCancelTriggered = function () {
  return Input.isRepeated("cancel");
};

Window_Selectable.prototype.processOk = function () {
  if (this.isCurrentItemEnabled()) {
    this.playOkSound();
    this.updateInputData();
    this.deactivate();
    this.callOkHandler();
  } else {
    this.playBuzzerSound();
  }
};

Window_Selectable.prototype.playOkSound = function () {
  SoundManager.playOk();
};

Window_Selectable.prototype.playBuzzerSound = function () {
  SoundManager.playBuzzer();
};

Window_Selectable.prototype.callOkHandler = function () {
  this.callHandler("ok");
};

Window_Selectable.prototype.processCancel = function () {
  SoundManager.playCancel();
  this.updateInputData();
  this.deactivate();
  this.callCancelHandler();
};

Window_Selectable.prototype.callCancelHandler = function () {
  this.callHandler("cancel");
};

Window_Selectable.prototype.processPageup = function () {
  SoundManager.playCursor();
  this.updateInputData();
  this.deactivate();
  this.callHandler("pageup");
};

Window_Selectable.prototype.processPagedown = function () {
  SoundManager.playCursor();
  this.updateInputData();
  this.deactivate();
  this.callHandler("pagedown");
};

Window_Selectable.prototype.updateInputData = function () {
  Input.update();
  TouchInput.update();
};

Window_Selectable.prototype.updateCursor = function() {
    if (this._cursorAll) {
        var allRowsHeight = this.maxRows() * this.itemHeight();
        this.setCursorRect(0, 0, this.contents.width, allRowsHeight);
        this.setTopRow(0);
        this.resetOy();
    } else if (this.isCursorVisible()) {
        var rect = this.itemRect(this.index());
        this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
    } else {
        this.setCursorRect(0, 0, 0, 0);
    }
};

Window_Selectable.prototype.isCursorVisible = function() {
    var row = this.row();
    return row >= this.topRow() && row <= this.bottomRow() + 1;
};

Window_Selectable.prototype.ensureCursorVisible = function() {
    if (this._touchHovering) return;
    var row = this.row();
    if (row < this.topRow()) {
        this.setTopRow(row);
    } else if (row > this.bottomRow()) {
        this.setBottomRow(row);
    }
    if (this.row() === this.topRow()) {
        this.setTopRow(this.targetTopRow());
    }
};

Window_Selectable.prototype.callUpdateHelp = function () {
  if (this.active && this._helpWindow) {
    this.updateHelp();
  }
};

Window_Selectable.prototype.updateHelp = function () {
  this._helpWindow.clear();
};

Window_Selectable.prototype.setHelpWindowItem = function (item) {
  if (this._helpWindow) {
    this._helpWindow.setItem(item);
  }
};

Window_Selectable.prototype.isCurrentItemEnabled = function () {
  return true;
};

Window_Selectable.prototype.drawAllItems = function() {
    var topIndex = this.topIndex();
    for (var i = 0; i < this.maxPageItems(); i++) {
        var index = topIndex + i;
        if (index < this.maxItems()) {
            this.drawItem(index);
        }
    }
    var topIndex = this.topIndex() + this.maxPageItems();
    for (var i = 0; i < this.maxCols(); i++) {
        var index = topIndex + i;
        if (index < this.maxItems()) {
            this.drawItem(index);
        }
    }
};

Window_Selectable.prototype.drawItem = function (index) {};

Window_Selectable.prototype.clearItem = function (index) {
  var rect = this.itemRect(index);
  this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
};

Window_Selectable.prototype.redrawItem = function (index) {
  if (index >= 0) {
    this.clearItem(index);
    this.drawItem(index);
  }
};

Window_Selectable.prototype.redrawCurrentItem = function () {
  this.redrawItem(this.index());
};

Window_Selectable.prototype.refresh = function () {
  if (this.contents) {
    this.contents.clear();
    this.drawAllItems();
  }
};

Window_Selectable.prototype.contentsHeight = function() {
    return Window_Base.prototype.contentsHeight.call(this) + this.itemHeight();
};

Window_Selectable.prototype.isSmoothScroll = function() {
    return false;
};

Window_Selectable.prototype.isTouchFollowing = function() {
    return (TouchInput.date > Input.date);
};

Window_Selectable.prototype.skipSmoothScroll = function() {
    // No-op
};

Window_Selectable.prototype.startScrollOy = function(oy) {
    // No-op
};

Window_Selectable.prototype.resetOy = function() {
    this.origin.y = 0;
    this._originYSpeed = [];
};

Window_Selectable.prototype.setOy = function(oy) {
    var sr = Math.floor(oy / this.itemHeight());
    var topRow = this.topRow();
    if (sr !== 0) {
        var scrollY = topRow.clamp(0, this.maxTopRow()) * this.itemHeight();
        scrollY = (topRow + sr).clamp(0, this.maxTopRow()) * this.itemHeight();
        if (this._scrollY !== scrollY) {
            this._scrollY = scrollY;
            this.refresh();
            this.updateCursor();
        }
    }
    if ((topRow <= 0 && oy < 0) || 
            (this.topRow() >= this.maxTopRow() && oy > 0)) {
        this.resetOy();
    } else {
        this.origin.y = oy.mod(this.itemHeight());
    }
};

Window_Selectable.prototype.gainOy = function(amount) {
    this.setOy(Math.floor(this.origin.y + amount));
};

Window_Selectable.prototype.targetTopRow = function() {
    return this.topRow();
};

Window_Selectable.prototype.addOriginYSpeed = function(speed) {
    this._originYSpeed.push(speed);
    if (this._originYSpeed.length > 3) {
        this._originYSpeed.shift();
    }
};

Window_Selectable.prototype.originYSpeed = function() {
    if (this._touching) {
        return this._originYSpeed[this._originYSpeed.length - 1] || 0;
    }
    var speed = 0;
    for (var i = 0; i < this._originYSpeed.length; i++) {
        speed += this._originYSpeed[i];
    }
    return speed / (this._originYSpeed.length || 1);
};

Window_Selectable.prototype.touchScroll = function() {
    if (this._touchInsided) {
        this.addOriginYSpeed(this._touchLastY - TouchInput.y);
        this._touchLastY = TouchInput.y;
        return (Math.abs(TouchInput.y - TouchInput._startY) > 12);
    }
    return false;
};

Window_Selectable.prototype.touchSwipe = function() {
    if (TouchInput.isLeftSwipe()) {
        if (this.isHandled('pageup')) this.processPageup();
    } else if (TouchInput.isRightSwipe()) {
        if (this.isHandled('pagedown')) this.processPagedown();
    }
};

Window_Selectable.prototype.updateTouchScroll = function() {
    if (this._touchInsided && this._originYSpeed.length > 0) {
        this.gainOy(this.originYSpeed());
    }
};
