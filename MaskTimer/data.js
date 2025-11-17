const DATA_FILE = "Data.json";

const defaultData = {
    maskTimerHud: {
        x: 0.05,
        y: 0.50,
        scale: 2.0
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
