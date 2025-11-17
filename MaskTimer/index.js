import Config from "./config";
import { data, save } from "./data";

let bonzotimeText = new Text("").setShadow(true).setColor(Renderer.BLUE);
let spirittimeText = new Text("").setShadow(true).setColor(Renderer.WHITE);
let phoenixtimeText = new Text("").setShadow(true).setColor(Renderer.RED);
let proctimeText = new Text("").setShadow(true).setColor(Renderer.WHITE);

let bonzotime = 0;
let spirittime = 0;
let phoenixtime = 0;
let proctext = " ";

// HUD-Editor
let hudEditing = false;
const hudGui = new Gui();

// welches Element wird gerade gezogen? "mask" oder "proc"
let dragTarget = "";

// Maxor-Gate für OnlyOnMaxor
let maxorActive = false;

////////////////////////////////////////////////////////////////
// HUD EDITOR
////////////////////////////////////////////////////////////////
hudGui.registerDraw((mouseX, mouseY) => {
    const w = Renderer.screen.getWidth();
    const h = Renderer.screen.getHeight();
    const centerX = w / 2;
    const centerY = h / 2;

    Renderer.drawRect(0x80000000, 0, 0, w, h);

    Renderer.drawStringWithShadow("§6§lMaskTimer HUD-Editor", centerX - 80, centerY - 70);
    Renderer.drawStringWithShadow("§7Zieh Timer-Block oder Proc-Text mit der Maus.", centerX - 120, centerY - 55);
    Renderer.drawStringWithShadow("§7Mausrad über Element: Scale ändern. ESC / Rechtsklick: Fertig.", centerX - 160, centerY - 45);

    // === Timer-HUD ===
    const maskX = w * data.maskTimerHud.x;
    const maskY = h * data.maskTimerHud.y;
    const maskScale = data.maskTimerHud.scale || 2.0;

    const maskBoxWidth = 100 * maskScale;
    const maskBoxHeight = 45 * maskScale;
    Renderer.drawRect(0x4000FF00, maskX - 5, maskY - 5, maskBoxWidth, maskBoxHeight);

    let y = maskY;
    let bonzotext = (bonzotime <= 0) ? "§9Bonzo: §aREADY" : `§9Bonzo: §6${(bonzotime / 10).toFixed(1)}`;
    bonzotimeText.setString(bonzotext).setScale(maskScale).setX(maskX).setY(y).draw();
    y += 9 * maskScale + 4;

    let spirittext = (spirittime <= 0) ? "§fSpirit: §aREADY" : `§fSpirit: §6${(spirittime / 10).toFixed(1)}`;
    spirittimeText.setString(spirittext).setScale(maskScale).setX(maskX).setY(y).draw();
    y += 9 * maskScale + 4;

    let phoenixtext = (phoenixtime <= 0) ? "§cPhoenix: §aREADY" : `§cPhoenix: §6${(phoenixtime / 10).toFixed(1)}`;
    phoenixtimeText.setString(phoenixtext).setScale(maskScale).setX(maskX).setY(y).draw();

    // === Proc-HUD (eigenes Element) ===
    const procX = w * data.procHud.x;
    const procY = h * data.procHud.y;
    const procScale = data.procHud.scale || 2.5;

    // im Editor immer einen sinnvollen Text anzeigen
    const previewProcText = (proctext === " " ? "§9Bonzo Mask Procced" : proctext);

    proctimeText.setString(previewProcText).setScale(procScale);
    const procBoxWidth = proctimeText.getWidth();
    const procBoxHeight = proctimeText.getHeight();

    // Box um Proc-Text
    Renderer.drawRect(0x40FFAAAA, procX - 5, procY - 5, procBoxWidth + 10, procBoxHeight + 10);
    proctimeText.setX(procX).setY(procY).draw();
});

// Nur Rechtsklick schließt; Linksklick wählen wir für Drag-Target
hudGui.registerClicked((mx, my, button) => {
    const w = Renderer.screen.getWidth();
    const h = Renderer.screen.getHeight();

    const maskX = w * data.maskTimerHud.x;
    const maskY = h * data.maskTimerHud.y;
    const maskScale = data.maskTimerHud.scale || 2.0;
    const maskBoxWidth = 100 * maskScale;
    const maskBoxHeight = 45 * maskScale;

    const procX = w * data.procHud.x;
    const procY = h * data.procHud.y;
    const procScale = data.procHud.scale || 2.5;
    // grobe Box für Klick-Auswahl (wir nehmen da auch 200x50 als Hitbox)
    const procBoxWidth = 200 * procScale * 0.4;
    const procBoxHeight = 50 * procScale * 0.4;

    if (button === 1) { // right-click = schließen
        hudEditing = false;
        dragTarget = "";
        Client.currentGui.close();
        ChatLib.chat("§a[MaskTimer] HUD-Editor geschlossen.");
        return;
    }

    if (button === 0) { // left-click = auswählen, was gezogen wird
        if (mx >= maskX - 5 && mx <= maskX - 5 + maskBoxWidth &&
            my >= maskY - 5 && my <= maskY - 5 + maskBoxHeight) {
            dragTarget = "mask";
        } else if (mx >= procX - 5 && mx <= procX - 5 + procBoxWidth &&
                   my >= procY - 5 && my <= procY - 5 + procBoxHeight) {
            dragTarget = "proc";
        } else {
            dragTarget = "";
        }
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
        data.maskTimerHud.x = Math.max(0, Math.min(1, data.maskTimerHud.x + dx / w));
        data.maskTimerHud.y = Math.max(0, Math.min(1, data.maskTimerHud.y + dy / h));
    } else if (dragTarget === "proc") {
        data.procHud.x = Math.max(0, Math.min(1, data.procHud.x + dx / w));
        data.procHud.y = Math.max(0, Math.min(1, data.procHud.y + dy / h));
    }
    save();
});

register("scrolled", (x, y, d) => {
    if (!hudEditing) return;

    const w = Renderer.screen.getWidth();
    const h = Renderer.screen.getHeight();

    const maskX = w * data.maskTimerHud.x;
    const maskY = h * data.maskTimerHud.y;
    const maskScale = data.maskTimerHud.scale || 2.0;
    const maskBoxWidth = 100 * maskScale;
    const maskBoxHeight = 45 * maskScale;

    const procX = w * data.procHud.x;
    const procY = h * data.procHud.y;
    const procScale = data.procHud.scale || 2.5;
    const procBoxWidth = 200 * procScale * 0.4;
    const procBoxHeight = 50 * procScale * 0.4;

    let changed = false;

    if (x >= maskX - 5 && x <= maskX - 5 + maskBoxWidth &&
        y >= maskY - 5 && y <= maskY - 5 + maskBoxHeight) {
        let newScale = maskScale + (d === 1 ? 0.1 : -0.1);
        newScale = Math.max(0.5, Math.min(4.0, newScale));
        data.maskTimerHud.scale = newScale;
        changed = true;
    } else if (x >= procX - 5 && x <= procX - 5 + procBoxWidth &&
               y >= procY - 5 && y <= procY - 5 + procBoxHeight) {
        let newScale = procScale + (d === 1 ? 0.1 : -0.1);
        newScale = Math.max(0.5, Math.min(6.0, newScale));
        data.procHud.scale = newScale;
        changed = true;
    }

    if (changed) save();
});

register("command", () => {
    hudEditing = true;
    dragTarget = "";
    hudGui.open();
}).setName("masktimerhud");

register("command", () => {
    Config.openGUI();
}).setName("masktimerconfig");

////////////////////////////////////////////////////////////////
// TIMER / TRIGGER
////////////////////////////////////////////////////////////////

register("step", () => {
    bonzotime--;
    spirittime--;
    phoenixtime--;
}).setFps(10);

const bonzotrigger1 = register("chat", () => {
    bonzotime = parseInt(1800);
    proctext = "§9Bonzo Mask Procced";
    setTimeout(() => {
        if (proctext === "§9Bonzo Mask Procced") proctext = " ";
    }, 1500);
}).setCriteria(/Your (⚚)? Bonzo's Mask saved your life!/);

const bonzotrigger2 = register("chat", () => {
    bonzotime = parseInt(1800);
    proctext = "§9Bonzo Mask Procced";
    setTimeout(() => {
        if (proctext === "§9Bonzo Mask Procced") proctext = " ";
    }, 1500);
}).setCriteria(/Your (⚚)? Bonzo's Mask saved your teammate's life!/);

const spiritTrigger = register("chat", () => {
    spirittime = parseInt(300);
    proctext = "§fSpirit Mask Procced";
    setTimeout(() => {
        if (proctext === "§fSpirit Mask Procced") proctext = " ";
    }, 1500);
}).setCriteria("Second Wind Activated! Your Spirit Mask saved your life!");

const phoenixTrigger = register("chat", () => {
    phoenixtime = parseInt(600);
    proctext = "§cPhoenix Procced";
    setTimeout(() => {
        if (proctext === "§cPhoenix Procced") proctext = " ";
    }, 1500);
}).setCriteria("Your Phoenix Pet saved you from certain death!");

// Maxor-Gate
const maxorTrigger = register("chat", () => {
    maxorActive = true;
}).setCriteria("[BOSS] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!");

register("worldUnload", () => {
    maxorActive = false;
});

////////////////////////////////////////////////////////////////
// RENDER
////////////////////////////////////////////////////////////////
register("renderOverlay", () => {
    // globaler Schalter
    if (!Config.maskTimer) return;

    // optional nur bei Maxor
    if (Config.onlyOnMaxor && !maxorActive) return;

    const w = Renderer.screen.getWidth();
    const h = Renderer.screen.getHeight();

    // === Timer-HUD ===
    const baseX = w * data.maskTimerHud.x;
    const baseY = h * data.maskTimerHud.y;
    const scale = data.maskTimerHud.scale || 2.0;

    let y = baseY;

    let bonzotext = (bonzotime <= 0) ? "§9Bonzo: §aREADY" : `§9Bonzo: §6${(bonzotime / 10).toFixed(1)}`;
    bonzotimeText.setString(bonzotext).setScale(scale).setX(baseX).setY(y).draw();
    y += 9 * scale + 4;

    let spirittext = (spirittime <= 0) ? "§fSpirit: §aREADY" : `§fSpirit: §6${(spirittime / 10).toFixed(1)}`;
    spirittimeText.setString(spirittext).setScale(scale).setX(baseX).setY(y).draw();
    y += 9 * scale + 4;

    let phoenixtext = (phoenixtime <= 0) ? "§cPhoenix: §aREADY" : `§cPhoenix: §6${(phoenixtime / 10).toFixed(1)}`;
    phoenixtimeText.setString(phoenixtext).setScale(scale).setX(baseX).setY(y).draw();

    // === Proc-HUD separat, unabhängig vom Timer ===
    const procX = w * data.procHud.x;
    const procY = h * data.procHud.y;
    const procScale = data.procHud.scale || 2.5;

    proctimeText
        .setScale(procScale)
        .setX(procX)
        .setY(procY)
        .setString(proctext)
        .draw();
});
