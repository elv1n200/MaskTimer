const DATA_FILE = "Data.json";

const defaultData = {
    // HUD für den eigentlichen Timer-Block (Bonzo/Spirit/Phoenix)
    maskTimerHud: {
        x: 0.05,
        y: 0.50,
        scale: 2.0
    },

    // HUD für den Proc-Text ("Bonzo Mask Procced", "Spirit Mask Procced", ...)
    procHud: {
        x: 0.5,    // mittig
        y: 0.35,   // leicht oberhalb der Mitte
        scale: 2.5 // etwas größer
    }
};

function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function loadData() {
    try {
        const raw = FileLib.read("MaskTimer", DATA_FILE);
        if (!raw) return deepClone(defaultData);
        const parsed = JSON.parse(raw);

        // merge, damit neue Felder (wie procHud) auch bei alten Dateien dazukommen
        return Object.assign(deepClone(defaultData), parsed);
    } catch (e) {
        return deepClone(defaultData);
    }
}

function saveData(obj) {
    try {
        FileLib.write("MaskTimer", DATA_FILE, JSON.stringify(obj, null, 2));
    } catch (e) {}
}

export const data = loadData();

export function save() {
    saveData(data);
}
