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

let hudEditing = false;
const hudGui = new Gui();

// Maxor-Gate
let maxorActive = false;

hudGui.registerDraw((mouseX, mouseY) => {
    const w = Renderer.screen.getWidth();
    const h = Renderer.screen.getHeight();
    const centerX = w / 2;
    const centerY = h / 2;

    Renderer.drawRect(0x80000000, 0, 0, w, h);

    Renderer.drawStringWithShadow("§6§lMaskTimer HUD-Editor", centerX - 80, centerY - 70);
    Renderer.drawStringWithShadow("§7Zieh den Timer-Block mit der Maus an die gewünschte Position.", centerX - 140, centerY - 55);
    Renderer.drawStringWithShadow("§7Mausrad über dem Block: Scale ändern. ESC oder Rechtsklick: Fertig.", centerX - 170, centerY - 45);

    const baseX = w * data.maskTimerHud.x;
    const baseY = h * data.maskTimerHud.y;
    const scale = data.maskTimerHud.scale || 2.0;

    // kleinere Box
    const boxWidth = 100 * scale;
    const boxHeight = 45 * scale;
    Renderer.drawRect(0x40FFFFFF, baseX - 5, baseY - 5, boxWidth, boxHeight);

    let y = baseY;
    let bonzotext = (bonzotime <= 0) ? "§9Bonzo: §aREADY" : `§9Bonzo: §6${(bonzotime / 10).toFixed(1)}`;
    bonzotimeText.setString(bonzotext).setScale(scale).setX(baseX).setY(y).draw();
    y += 9 * scale + 4;

    let spirittext = (spirittime <= 0) ? "§fSpirit: §aREADY" : `§fSpirit: §6${(spirittime / 10).toFixed(1)}`;
    spirittimeText.setString(spirittext).setScale(scale).setX(baseX).setY(y).draw();
    y += 9 * scale + 4;

    let phoenixtext = (phoenixtime <= 0) ? "§cPhoenix: §aREADY" : `§cPhoenix: §6${(phoenixtime / 10).toFixed(1)}`;
    phoenixtimeText.setString(phoenixtext).setScale(scale).setX(baseX).setY(y).draw();

    proctimeText.setString(proctext).setScale(scale * 2).setX(baseX + 180 * scale).setY(baseY + 40 * scale).draw();
});

// ONLY right-click closes the editor; left-click is used for dragging
hudGui.registerClicked((mx, my, button) => {
    if (button === 1) { // right-click
        hudEditing = false;
        Client.currentGui.close();
        ChatLib.chat("§a[MaskTimer] HUD-Editor geschlossen.");
    }
});

hudGui.registerClosed(() => {
    hudEditing = false;
});

register("dragged", (dx, dy) => {
    if (!hudEditing) return;

    const w = Renderer.screen.getWidth();
    const h = Renderer.screen.getHeight();

    data.maskTimerHud.x = Math.max(0, Math.min(1, data.maskTimerHud.x + dx / w));
    data.maskTimerHud.y = Math.max(0, Math.min(1, data.maskTimerHud.y + dy / h));
    save();
});

register("scrolled", (x, y, d) => {
    if (!hudEditing) return;

    const w = Renderer.screen.getWidth();
    const h = Renderer.screen.getHeight();
    const baseX = w * data.maskTimerHud.x;
    const baseY = h * data.maskTimerHud.y;
    const scale = data.maskTimerHud.scale || 2.0;

    // Hitbox passend zur kleineren Box
    const boxWidth = 100 * scale;
    const boxHeight = 45 * scale;

    if (x >= baseX - 5 && x <= baseX - 5 + boxWidth &&
        y >= baseY - 5 && y <= baseY - 5 + boxHeight) {
        let newScale = scale + (d === 1 ? 0.1 : -0.1);
        newScale = Math.max(0.5, Math.min(4.0, newScale));
        data.maskTimerHud.scale = newScale;
        save();
    }
});

register("command", () => {
    hudEditing = true;
    hudGui.open();
}).setName("masktimerhud");

register("command", () => {
    Config.openGUI();
}).setName("masktimerconfig");

register("step", () => {
    bonzotime--;
    spirittime--;
    phoenixtime--;
}).setFps(10);

// === Mask/Phx Trigger ===
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

// === Maxor-Trigger ===
const maxorTrigger = register("chat", () => {
    maxorActive = true;
}).setCriteria("[BOSS] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!");

register("worldUnload", () => {
    maxorActive = false;
});

// === Render ===
register("renderOverlay", () => {
    // globaler Schalter
    if (!Config.maskTimer) return;

    // optionaler Maxor-Gate
    if (Config.onlyOnMaxor && !maxorActive) return;

    const w = Renderer.screen.getWidth();
    const h = Renderer.screen.getHeight();
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

    proctimeText
        .setScale(scale * 2)
        .setX(baseX + 180 * scale)
        .setY(baseY + 40 * scale)
        .setString(proctext)
        .draw();
});
