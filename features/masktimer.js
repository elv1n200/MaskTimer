import Config from "../config";
import { data, save } from "../data/data";

// Texts
let bonzotimeText = new Text("").setShadow(true).setColor(Renderer.BLUE);
let spirittimeText = new Text("").setShadow(true).setColor(Renderer.WHITE);
let phoenixtimeText = new Text("").setShadow(true).setColor(Renderer.RED);
let proctimeText = new Text("").setShadow(true).setColor(Renderer.WHITE);

// Timers
let bonzotime = 0;
let spirittime = 0;
let phoenixtime = 0;
let proctext = " ";

// Only-on-Maxor gate
let maxorActive = false;

// HUD editor
let hudEditing = false;
let dragTarget = ""; // "mask" | "proc" | ""
const hudGui = new Gui();

function drawHudBlockPreview() {
  const w = Renderer.screen.getWidth();
  const h = Renderer.screen.getHeight();
  const centerX = w / 2;

  Renderer.drawRect(0x80000000, 0, 0, w, h);
  Renderer.drawStringWithShadow("§6§lMaskTimer HUD-Editor", centerX - 80, 20);
  Renderer.drawStringWithShadow("§7Linksklick auf Element → ziehen | Mausrad → Scale | Rechtsklick/ESC → fertig", centerX - 205, 35);

  // Timer block
  const maskX = w * ((data.maskTimerHud && data.maskTimerHud.x !== undefined ? data.maskTimerHud.x : 0.05));
  const maskY = h * ((data.maskTimerHud && data.maskTimerHud.y !== undefined ? data.maskTimerHud.y : 0.50));
  const maskScale = (data.maskTimerHud && data.maskTimerHud.scale !== undefined ? data.maskTimerHud.scale : 2.0);

  const maskBoxWidth = 100 * maskScale;
  const maskBoxHeight = 45 * maskScale;
  Renderer.drawRect(0x4000FF00, maskX - 5, maskY - 5, maskBoxWidth, maskBoxHeight);

  let y = maskY;
  bonzotimeText.setString((bonzotime <= 0) ? "§9Bonzo: §aREADY" : `§9Bonzo: §6${(bonzotime / 10).toFixed(1)}`)
    .setScale(maskScale).setX(maskX).setY(y).draw();
  y += 9 * maskScale + 4;

  spirittimeText.setString((spirittime <= 0) ? "§fSpirit: §aREADY" : `§fSpirit: §6${(spirittime / 10).toFixed(1)}`)
    .setScale(maskScale).setX(maskX).setY(y).draw();
  y += 9 * maskScale + 4;

  phoenixtimeText.setString((phoenixtime <= 0) ? "§cPhoenix: §aREADY" : `§cPhoenix: §6${(phoenixtime / 10).toFixed(1)}`)
    .setScale(maskScale).setX(maskX).setY(y).draw();

  // Proc text element (preview)
  const procX = w * ((data.procHud && data.procHud.x !== undefined ? data.procHud.x : 0.5));
  const procY = h * ((data.procHud && data.procHud.y !== undefined ? data.procHud.y : 0.35));
  const procScale = (data.procHud && data.procHud.scale !== undefined ? data.procHud.scale : 2.5);

  const previewProcText = (proctext === " " ? "§9Bonzo Mask Procced" : proctext);
  proctimeText.setString(previewProcText).setScale(procScale);

  const pw = proctimeText.getWidth();
  const ph = proctimeText.getHeight();
  Renderer.drawRect(0x40FFAAAA, procX - 5, procY - 5, pw + 10, ph + 10);
  proctimeText.setX(procX).setY(procY).draw();
}

hudGui.registerDraw(() => drawHudBlockPreview());

hudGui.registerClicked((mx, my, button) => {
  if (button === 1) { // right click closes
    hudEditing = false;
    dragTarget = "";
    Client.currentGui.close();
    ChatLib.chat("§a[MaskTimer] HUD-Editor geschlossen.");
    return;
  }
  if (button !== 0) return;

  const w = Renderer.screen.getWidth();
  const h = Renderer.screen.getHeight();

  // Timer hitbox
  const maskX = w * ((data.maskTimerHud && data.maskTimerHud.x !== undefined ? data.maskTimerHud.x : 0.05));
  const maskY = h * ((data.maskTimerHud && data.maskTimerHud.y !== undefined ? data.maskTimerHud.y : 0.50));
  const maskScale = (data.maskTimerHud && data.maskTimerHud.scale !== undefined ? data.maskTimerHud.scale : 2.0);
  const maskBoxWidth = 100 * maskScale;
  const maskBoxHeight = 45 * maskScale;

  if (mx >= maskX - 5 && mx <= maskX - 5 + maskBoxWidth && my >= maskY - 5 && my <= maskY - 5 + maskBoxHeight) {
    dragTarget = "mask";
    return;
  }

  // Proc hitbox (use actual text size)
  const procX = w * ((data.procHud && data.procHud.x !== undefined ? data.procHud.x : 0.5));
  const procY = h * ((data.procHud && data.procHud.y !== undefined ? data.procHud.y : 0.35));
  const procScale = (data.procHud && data.procHud.scale !== undefined ? data.procHud.scale : 2.5);
  const previewProcText = (proctext === " " ? "§9Bonzo Mask Procced" : proctext);
  proctimeText.setString(previewProcText).setScale(procScale);
  const pw = proctimeText.getWidth();
  const ph = proctimeText.getHeight();

  if (mx >= procX - 5 && mx <= procX - 5 + pw + 10 && my >= procY - 5 && my <= procY - 5 + ph + 10) {
    dragTarget = "proc";
  } else {
    dragTarget = "";
  }
});

hudGui.registerClosed(() => {
  hudEditing = false;
  dragTarget = "";
});

register("dragged", (dx, dy) => {
  if (!hudEditing || dragTarget === "") return;

  const w = Renderer.screen.getWidth();
  const h = Renderer.screen.getHeight();

  if (dragTarget === "mask") {
    data.maskTimerHud.x = Math.max(0, Math.min(1, ((data.maskTimerHud && data.maskTimerHud.x !== undefined) ? data.maskTimerHud.x : 0) + dx / w));
    data.maskTimerHud.y = Math.max(0, Math.min(1, ((data.maskTimerHud && data.maskTimerHud.y !== undefined) ? data.maskTimerHud.y : 0) + dy / h));
  } else if (dragTarget === "proc") {
    data.procHud.x = Math.max(0, Math.min(1, ((data.procHud && data.procHud.x !== undefined) ? data.procHud.x : 0) + dx / w));
    data.procHud.y = Math.max(0, Math.min(1, ((data.procHud && data.procHud.y !== undefined) ? data.procHud.y : 0) + dy / h));
  }
  save();
});

register("scrolled", (x, y, d) => {
  if (!hudEditing) return;

  const w = Renderer.screen.getWidth();
  const h = Renderer.screen.getHeight();

  // Timer hitbox
  const maskX = w * ((data.maskTimerHud && data.maskTimerHud.x !== undefined ? data.maskTimerHud.x : 0.05));
  const maskY = h * ((data.maskTimerHud && data.maskTimerHud.y !== undefined ? data.maskTimerHud.y : 0.50));
  const maskScale = (data.maskTimerHud && data.maskTimerHud.scale !== undefined ? data.maskTimerHud.scale : 2.0);
  const maskBoxWidth = 100 * maskScale;
  const maskBoxHeight = 45 * maskScale;

  if (x >= maskX - 5 && x <= maskX - 5 + maskBoxWidth && y >= maskY - 5 && y <= maskY - 5 + maskBoxHeight) {
    let ns = maskScale + (d === 1 ? 0.1 : -0.1);
    ns = Math.max(0.5, Math.min(4.0, ns));
    data.maskTimerHud.scale = ns;
    save();
    return;
  }

  // Proc hitbox (actual size)
  const procX = w * ((data.procHud && data.procHud.x !== undefined ? data.procHud.x : 0.5));
  const procY = h * ((data.procHud && data.procHud.y !== undefined ? data.procHud.y : 0.35));
  const procScale = (data.procHud && data.procHud.scale !== undefined ? data.procHud.scale : 2.5);
  const previewProcText = (proctext === " " ? "§9Bonzo Mask Procced" : proctext);
  proctimeText.setString(previewProcText).setScale(procScale);
  const pw = proctimeText.getWidth();
  const ph = proctimeText.getHeight();

  if (x >= procX - 5 && x <= procX - 5 + pw + 10 && y >= procY - 5 && y <= procY - 5 + ph + 10) {
    let ns = procScale + (d === 1 ? 0.1 : -0.1);
    ns = Math.max(0.5, Math.min(6.0, ns));
    data.procHud.scale = ns;
    save();
  }
});

// Timers ticking
register("step", () => {
  bonzotime--;
  spirittime--;
  phoenixtime--;
}).setFps(10);

// Proc triggers
register("chat", () => {
  bonzotime = 1800;
  proctext = "§9Bonzo Mask Procced";
  setTimeout(() => { if (proctext === "§9Bonzo Mask Procced") proctext = " "; }, 1500);
}).setCriteria(/Your (⚚)? Bonzo's Mask saved your life!/);

register("chat", () => {
  bonzotime = 1800;
  proctext = "§9Bonzo Mask Procced";
  setTimeout(() => { if (proctext === "§9Bonzo Mask Procced") proctext = " "; }, 1500);
}).setCriteria(/Your (⚚)? Bonzo's Mask saved your teammate's life!/);

register("chat", () => {
  spirittime = 300;
  proctext = "§fSpirit Mask Procced";
  setTimeout(() => { if (proctext === "§fSpirit Mask Procced") proctext = " "; }, 1500);
}).setCriteria("Second Wind Activated! Your Spirit Mask saved your life!");

register("chat", () => {
  phoenixtime = 600;
  proctext = "§cPhoenix Procced";
  setTimeout(() => { if (proctext === "§cPhoenix Procced") proctext = " "; }, 1500);
}).setCriteria("Your Phoenix Pet saved you from certain death!");

// Maxor gate trigger
register("chat", () => { maxorActive = true; })
  .setCriteria("[BOSS] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!");

register("worldUnload", () => {
  maxorActive = false;
});

// Render
register("renderOverlay", () => {
  if (!Config.maskTimer) return;
  if (Config.onlyOnMaxor && !maxorActive) return;

  const w = Renderer.screen.getWidth();
  const h = Renderer.screen.getHeight();

  const baseX = w * ((data.maskTimerHud && data.maskTimerHud.x !== undefined ? data.maskTimerHud.x : 0.05));
  const baseY = h * ((data.maskTimerHud && data.maskTimerHud.y !== undefined ? data.maskTimerHud.y : 0.50));
  const scale = (data.maskTimerHud && data.maskTimerHud.scale !== undefined ? data.maskTimerHud.scale : 2.0);

  let y = baseY;

  bonzotimeText.setString((bonzotime <= 0) ? "§9Bonzo: §aREADY" : `§9Bonzo: §6${(bonzotime / 10).toFixed(1)}`)
    .setScale(scale).setX(baseX).setY(y).draw();
  y += 9 * scale + 4;

  spirittimeText.setString((spirittime <= 0) ? "§fSpirit: §aREADY" : `§fSpirit: §6${(spirittime / 10).toFixed(1)}`)
    .setScale(scale).setX(baseX).setY(y).draw();
  y += 9 * scale + 4;

  phoenixtimeText.setString((phoenixtime <= 0) ? "§cPhoenix: §aREADY" : `§cPhoenix: §6${(phoenixtime / 10).toFixed(1)}`)
    .setScale(scale).setX(baseX).setY(y).draw();

  // Proc text separate (do not scale with timer)
  const procX = w * ((data.procHud && data.procHud.x !== undefined ? data.procHud.x : 0.5));
  const procY = h * ((data.procHud && data.procHud.y !== undefined ? data.procHud.y : 0.35));
  const procScale = (data.procHud && data.procHud.scale !== undefined ? data.procHud.scale : 2.5);

  proctimeText.setScale(procScale).setX(procX).setY(procY).setString(proctext).draw();
});

export function openHudEditor() {
  hudEditing = true;
  dragTarget = "";
  hudGui.open();
}

export function initMaskTimer() {
  // No-op: side-effect registrations happen on import in CT
}
