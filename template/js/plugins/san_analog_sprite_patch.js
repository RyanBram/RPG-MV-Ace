/*:
 * @plugindesc SAN_AnalogMove + CharacterMoveMotionEx Compatibility v1.0.0
 * @author Compatibility Patch
 * @target MV MZ
 *
 * @help
 * ============================================================================
 * Patch Kompatibilitas SAN_AnalogMove dengan CharacterMoveMotionEx
 * ============================================================================
 *
 * Plugin ini menambahkan dukungan sprite 8 arah (diagonal) dan dash motion
 * untuk SAN_AnalogMove.js dengan true analog movement.
 *
 * URUTAN INSTALASI PLUGIN:
 * 1. SAN_AnalogMove.js
 * 2. CharacterMoveMotionEx.js (rpg_spriteEX.js)
 * 3. SAN_AnalogMove_MotionEx_Patch.js (file ini) ← HARUS PALING BAWAH
 *
 * FITUR:
 * - True analog movement dengan sprite 8 arah
 * - Smooth transition antar direction
 * - Dash/Walk motion support
 * - Diagonal walking dengan analog stick/mouse
 * - Compatible dengan VirtualStick.js
 *
 * ============================================================================
 * Lisensi: MIT
 * ============================================================================
 */

(function () {
  "use strict";

  //=============================================================================
  // Validasi Plugin Dependencies
  //=============================================================================

  if (!Imported.SAN_AnalogMove) {
    throw new Error(
      "SAN_AnalogMove.js tidak ditemukan! Pastikan plugin sudah terinstall.",
    );
  }

  if (typeof CharacterMoveMotionEx === "undefined") {
    throw new Error(
      "CharacterMoveMotionEx.js tidak ditemukan! Pastikan plugin sudah terinstall.",
    );
  }

  //=============================================================================
  // Utility: Konversi Radian ke Direction 8
  //=============================================================================

  const RadianToDirection = {
    // Konversi radian ke 8-direction dengan smooth threshold
    toDir8: function (radian) {
      // Normalisasi radian ke 0-2π
      let rad = radian;
      while (rad < 0) rad += Math.PI * 2;
      while (rad >= Math.PI * 2) rad -= Math.PI * 2;

      // Konversi ke degree untuk perhitungan lebih mudah
      const deg = (rad * 180) / Math.PI;

      // 8-direction dengan threshold 22.5° per segmen
      // 0° = kanan (6), 90° = bawah (2), 180° = kiri (4), 270° = atas (8)
      if (deg >= 337.5 || deg < 22.5) {
        return 6; // →
      } else if (deg >= 22.5 && deg < 67.5) {
        return 3; // ↘
      } else if (deg >= 67.5 && deg < 112.5) {
        return 2; // ↓
      } else if (deg >= 112.5 && deg < 157.5) {
        return 1; // ↙
      } else if (deg >= 157.5 && deg < 202.5) {
        return 4; // ←
      } else if (deg >= 202.5 && deg < 247.5) {
        return 7; // ↖
      } else if (deg >= 247.5 && deg < 292.5) {
        return 8; // ↑
      } else if (deg >= 292.5 && deg < 337.5) {
        return 9; // ↗
      }

      return 2; // Default: down
    },

    // Konversi radian ke 4-direction (fallback)
    toDir4: function (radian) {
      const dir8 = this.toDir8(radian);
      // Konversi diagonal ke cardinal direction
      if (dir8 === 9 || dir8 === 3) return 6; // Right
      if (dir8 === 7 || dir8 === 1) return 4; // Left
      return dir8;
    },
  };

  //=============================================================================
  // CharacterMover Enhancement
  //=============================================================================

  // Hook ke updateCharacter untuk mendeteksi pergerakan
  const _CharacterMover_updateCharacter =
    CharacterMover.prototype.updateCharacter;
  CharacterMover.prototype.updateCharacter = function () {
    const character = this.character();

    // Simpan state sebelumnya
    const wasMoving = this._velVec && this._velVec.len() > 0.01;
    const prevDirection = this._velVec ? this._velVec.dir() : 0;

    // Jalankan update original
    _CharacterMover_updateCharacter.call(this);

    // Deteksi perubahan movement
    const isMoving = this._velVec && this._velVec.len() > 0.01;
    const currentDirection = this._velVec ? this._velVec.dir() : 0;

    // Threshold untuk mendeteksi perubahan arah (5 derajat)
    const directionChangeThreshold = (5 * Math.PI) / 180;
    const directionChanged =
      Math.abs(currentDirection - prevDirection) > directionChangeThreshold;

    // Update motion jika karakter bergerak atau arah berubah
    if (isMoving && (directionChanged || !wasMoving)) {
      const dir8 = RadianToDirection.toDir8(currentDirection);

      if (character.moveMotionChangeProcess) {
        character.moveMotionChangeProcess(dir8);
      }
    }

    // Jika berhenti bergerak, trigger wait motion
    if (wasMoving && !isMoving) {
      if (character.updateMotion) {
        character.updateMotion();
      }
    }
  };

  //=============================================================================
  // PlayerMover Enhancement
  //=============================================================================

  const _PlayerMover_updateCharacter = PlayerMover.prototype.updateCharacter;
  PlayerMover.prototype.updateCharacter = function () {
    const player = this.character();
    const wasMoving = this._velVec && this._velVec.len() > 0.01;
    const prevDirection = this._velVec ? this._velVec.dir() : 0;

    _PlayerMover_updateCharacter.call(this);

    const isMoving = this._velVec && this._velVec.len() > 0.01;
    const currentDirection = this._velVec ? this._velVec.dir() : 0;

    if (isMoving) {
      const dir8 = RadianToDirection.toDir8(currentDirection);

      if (player.moveMotionChangeProcess) {
        player.moveMotionChangeProcess(dir8);
      }
    }

    // Update dash state
    if (player.updateMotion) {
      player.updateMotion();
    }
  };

  //=============================================================================
  // FollowerMover Enhancement
  //=============================================================================

  const _FollowerMover_updateCharacter =
    FollowerMover.prototype.updateCharacter;
  FollowerMover.prototype.updateCharacter = function () {
    const follower = this.character();
    const precedingCharacter = follower.precedingCharacter();
    const relPosVec = precedingCharacter.posVec().sub2(this._posVec);

    _FollowerMover_updateCharacter.call(this);

    // Follower mengikuti direction dari karakter di depannya
    if (relPosVec.len() > 0.1) {
      const dir8 = RadianToDirection.toDir8(relPosVec.dir());

      if (follower.moveMotionChangeProcess) {
        follower.moveMotionChangeProcess(dir8);
      }
    }
  };

  //=============================================================================
  // Game_CharacterBase Enhancement
  //=============================================================================

  // Pastikan updateMotion dipanggil setiap frame
  const _Game_CharacterBase_update = Game_CharacterBase.prototype.update;
  Game_CharacterBase.prototype.update = function () {
    _Game_CharacterBase_update.call(this);

    // Update motion animation
    if (this.updateMotion && this.mover && typeof this.mover === "function") {
      this.updateMotion();
    }
  };

  //=============================================================================
  // Game_Player Enhancement untuk Dash Detection
  //=============================================================================

  const _Game_Player_update = Game_Player.prototype.update;
  Game_Player.prototype.update = function (sceneActive) {
    // Simpan dash state
    const wasDashing = this.isDashing();

    _Game_Player_update.call(this, sceneActive);

    // Deteksi perubahan dash state
    const isDashing = this.isDashing();

    if (wasDashing !== isDashing && this.updateMotion) {
      // Trigger motion update saat dash state berubah
      this.updateMotion();
    }
  };

  //=============================================================================
  // VirtualStick Compatibility (jika ada)
  //=============================================================================

  if (typeof $virtualStickController !== "undefined") {
    console.log("VirtualStick detected - analog motion support enabled");

    // VirtualStick sudah native support analog di SAN_AnalogMove
    // Tidak perlu modifikasi tambahan
  }

  //=============================================================================
  // Debug Mode (optional)
  //=============================================================================

  const DEBUG_MOTION = false;

  if (DEBUG_MOTION) {
    const _original_moveMotionChangeProcess =
      Game_CharacterBase.prototype.moveMotionChangeProcess;

    if (_original_moveMotionChangeProcess) {
      Game_CharacterBase.prototype.moveMotionChangeProcess = function (
        direction,
      ) {
        console.log(
          `[Motion] Direction: ${direction}, IsMoving: ${this.isMoving()}, IsDashing: ${this.isDashing ? this.isDashing() : false}`,
        );
        _original_moveMotionChangeProcess.call(this, direction);
      };
    }
  }

  //=============================================================================
  // Fix: Direction Priority - Maintain Last Cardinal Direction
  //=============================================================================

  // Override setDirVec untuk mempertahankan cardinal direction terakhir saat diagonal
  if (Game_CharacterBase.prototype.setDirVec) {
    const _Game_CharacterBase_setDirVec =
      Game_CharacterBase.prototype.setDirVec;

    Game_CharacterBase.prototype.setDirVec = function (dirVec) {
      if (!dirVec || dirVec.len() === 0) {
        _Game_CharacterBase_setDirVec.call(this, dirVec);
        return;
      }

      const dir8 = RadianToDirection.toDir8(dirVec.dir());
      const oldDirection = this._direction;

      // Tentukan apakah ini diagonal (1, 3, 7, 9)
      const isDiagonal = [1, 3, 7, 9].includes(dir8);

      if (isDiagonal) {
        // Saat diagonal, PERTAHANKAN cardinal direction terakhir
        // Jangan gunakan radToDir4 yang inconsistent

        // Mapping diagonal ke component cardinal-nya
        const diagonalToCardinals = {
          1: [4, 2], // Kiri Bawah = Kiri atau Bawah
          3: [6, 2], // Kanan Bawah = Kanan atau Bawah
          7: [4, 8], // Kiri Atas = Kiri atau Atas
          9: [6, 8], // Kanan Atas = Kanan atau Atas
        };

        const cardinals = diagonalToCardinals[dir8];

        // Pertahankan direction cardinal terakhir jika masih valid
        if (cardinals && cardinals.includes(oldDirection)) {
          // Direction terakhir masih valid untuk diagonal ini, pertahankan
          this._direction = oldDirection;
        } else {
          // Direction terakhir tidak valid, pilih prioritas horizontal (lebih natural)
          // Horizontal: 4 (kiri) atau 6 (kanan)
          // Vertikal: 2 (bawah) atau 8 (atas)
          const horizontalDir = cardinals.find((d) => d === 4 || d === 6);
          this._direction = horizontalDir || cardinals[0];
        }
      } else {
        // Cardinal direction (2, 4, 6, 8), set langsung
        this._direction = dir8;
      }

      // Trigger motion update jika arah berubah
      if (oldDirection !== this._direction && this.isMoving()) {
        if (this.moveMotionChangeProcess) {
          this.moveMotionChangeProcess(dir8);
        }
      }
    };
  }

  //=============================================================================
  // Patch Complete
  //=============================================================================

  console.log(
    "%c[SAN_AnalogMove + CharacterMoveMotionEx] Patch loaded successfully!",
    "color: #00ff00; font-weight: bold;",
  );
  console.log("- True analog movement: ✓");
  console.log("- 8-direction sprite support: ✓");
  console.log("- Dash/Walk motion: ✓");
})();
