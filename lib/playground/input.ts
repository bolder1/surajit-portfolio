/*
  Input — keyboard + touch controls for the playground car.

  Keyboard: WASD / arrow keys drive, Space brakes, R resets the car.
  Touch: the on-screen joystick calls setTouchAxis() with a normalized
  vector instead; both fold into one analog InputState once per frame.
*/

export type InputState = {
  /** -1..1 — forward positive */
  throttle: number;
  /** -1..1 — left positive */
  steer: number;
  brake: boolean;
};

const TRACKED = new Set([
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Space",
]);

export class InputManager {
  readonly state: InputState = { throttle: 0, steer: 0, brake: false };

  private keys = new Set<string>();
  private touchAxis: { x: number; y: number } | null = null;
  private resetRequested = false;

  private onKeyDown = (e: KeyboardEvent) => {
    // Don't hijack keys while the user is typing somewhere (future-proof).
    const target = e.target as HTMLElement | null;
    if (target && /^(input|textarea|select)$/i.test(target.tagName)) return;
    if (TRACKED.has(e.code)) e.preventDefault();
    this.keys.add(e.code);
    if (e.code === "KeyR") this.resetRequested = true;
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.code);
  };

  private onBlur = () => {
    // Losing focus mid-drive would otherwise leave a key stuck down.
    this.keys.clear();
    this.touchAxis = null;
  };

  attach() {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("blur", this.onBlur);
  }

  detach() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("blur", this.onBlur);
    this.keys.clear();
    this.touchAxis = null;
  }

  /** Joystick vector in [-1, 1]; +x = right, +y = down (screen space). */
  setTouchAxis(x: number, y: number) {
    this.touchAxis = { x, y };
  }

  clearTouchAxis() {
    this.touchAxis = null;
  }

  requestReset() {
    this.resetRequested = true;
  }

  /** True once per R-press / reset-button tap. */
  consumeReset(): boolean {
    const r = this.resetRequested;
    this.resetRequested = false;
    return r;
  }

  /** Fold raw key / touch state into the analog InputState. Call once per frame. */
  update() {
    const k = this.keys;
    let throttle =
      (k.has("KeyW") || k.has("ArrowUp") ? 1 : 0) -
      (k.has("KeyS") || k.has("ArrowDown") ? 1 : 0);
    let steer =
      (k.has("KeyA") || k.has("ArrowLeft") ? 1 : 0) -
      (k.has("KeyD") || k.has("ArrowRight") ? 1 : 0);

    if (this.touchAxis) {
      // Screen-space joystick: up = forward, left = steer left.
      throttle = clamp(-this.touchAxis.y, -1, 1);
      steer = clamp(-this.touchAxis.x, -1, 1);
    }

    this.state.throttle = throttle;
    this.state.steer = steer;
    this.state.brake = k.has("Space");
  }
}

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
