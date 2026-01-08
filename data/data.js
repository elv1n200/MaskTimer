const DATA_FILE = "Data.json";

const defaultData = {
  // Timer block
  maskTimerHud: { x: 0.05, y: 0.50, scale: 2.0 },
  // Proc text (separate)
  procHud: { x: 0.5, y: 0.35, scale: 2.5 }
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function loadData() {
  try {
    const raw = FileLib.read("MaskTimer", DATA_FILE);
    if (!raw) return deepClone(defaultData);
    const parsed = JSON.parse(raw);
    // Merge: keep existing values, add new defaults if missing
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
export function save() { saveData(data); }
