import {
  @Vigilant,
  @SwitchProperty,
  @ButtonProperty
} from "Vigilance";

@Vigilant("MaskTimer", "MaskTimer", {
  getCategoryComparator: () => (a, b) => {
    const order = ["General", "HUD", "Storm Pads"];
    return order.indexOf(a.name) - order.indexOf(b.name);
  }
})
class Config {
  // ===== MaskTimer =====
  @SwitchProperty({
    name: "MaskTimer aktiv",
    description: "Schaltet den Masken-/Phoenix-Timer HUD ein.",
    category: "General",
    subcategory: "MaskTimer"
  })
  maskTimer = true;

  @SwitchProperty({
    name: "Nur bei Maxor-Start aktivieren",
    description: "Zeigt den MaskTimer nur an, nachdem die Maxor-Bossnachricht erschienen ist.",
    category: "General",
    subcategory: "MaskTimer"
  })
  onlyOnMaxor = false;

  // ===== QoL =====
  @SwitchProperty({
    name: "Potion Bag öffnen in M7",
    description: "Öffnet automatisch die Potion Bag beim Start von Master Mode Floor 7.",
    category: "General",
    subcategory: "Potion Bag (Master Mode)"
  })
  autoOpenPotionBagM7 = false;

// ===== Potion Bag per Floor (optional) =====
  // Falls du pro Floor togglen willst, nutze die Settings unten.
  // Legacy-Setting "Potion Bag in M7 öffnen" bleibt als Fallback für M7 erhalten.

  // ---- Normal Floors (F1–F7) ----
  @SwitchProperty({ name: "Potion Bag öffnen in F1", description: "Öffnet automatisch die Potion Bag beim Start von Floor 1.", category: "General", subcategory: "Potion Bag (Normal Floors)" })
  autoOpenPotionBagF1 = false;

  @SwitchProperty({ name: "Potion Bag öffnen in F2", description: "Öffnet automatisch die Potion Bag beim Start von Floor 2.", category: "General", subcategory: "Potion Bag (Normal Floors)" })
  autoOpenPotionBagF2 = false;

  @SwitchProperty({ name: "Potion Bag öffnen in F3", description: "Öffnet automatisch die Potion Bag beim Start von Floor 3.", category: "General", subcategory: "Potion Bag (Normal Floors)" })
  autoOpenPotionBagF3 = false;

  @SwitchProperty({ name: "Potion Bag öffnen in F4", description: "Öffnet automatisch die Potion Bag beim Start von Floor 4.", category: "General", subcategory: "Potion Bag (Normal Floors)" })
  autoOpenPotionBagF4 = false;

  @SwitchProperty({ name: "Potion Bag öffnen in F5", description: "Öffnet automatisch die Potion Bag beim Start von Floor 5.", category: "General", subcategory: "Potion Bag (Normal Floors)" })
  autoOpenPotionBagF5 = false;

  @SwitchProperty({ name: "Potion Bag öffnen in F6", description: "Öffnet automatisch die Potion Bag beim Start von Floor 6.", category: "General", subcategory: "Potion Bag (Normal Floors)" })
  autoOpenPotionBagF6 = false;

  @SwitchProperty({ name: "Potion Bag öffnen in F7", description: "Öffnet automatisch die Potion Bag beim Start von Floor 7.", category: "General", subcategory: "Potion Bag (Normal Floors)" })
  autoOpenPotionBagF7 = false;

  // ---- Master Floors (M1–M7) ----
  @SwitchProperty({ name: "Potion Bag öffnen in M1", description: "Öffnet automatisch die Potion Bag beim Start von Master Mode Floor 1.", category: "General", subcategory: "Potion Bag (Master Mode)" })
  autoOpenPotionBagM1 = false;

  @SwitchProperty({ name: "Potion Bag öffnen in M2", description: "Öffnet automatisch die Potion Bag beim Start von Master Mode Floor 2.", category: "General", subcategory: "Potion Bag (Master Mode)" })
  autoOpenPotionBagM2 = false;

  @SwitchProperty({ name: "Potion Bag öffnen in M3", description: "Öffnet automatisch die Potion Bag beim Start von Master Mode Floor 3.", category: "General", subcategory: "Potion Bag (Master Mode)" })
  autoOpenPotionBagM3 = false;

  @SwitchProperty({ name: "Potion Bag öffnen in M4", description: "Öffnet automatisch die Potion Bag beim Start von Master Mode Floor 4.", category: "General", subcategory: "Potion Bag (Master Mode)" })
  autoOpenPotionBagM4 = false;

  @SwitchProperty({ name: "Potion Bag öffnen in M5", description: "Öffnet automatisch die Potion Bag beim Start von Master Mode Floor 5.", category: "General", subcategory: "Potion Bag (Master Mode)" })
  autoOpenPotionBagM5 = false;

  @SwitchProperty({ name: "Potion Bag öffnen in M6", description: "Öffnet automatisch die Potion Bag beim Start von Master Mode Floor 6.", category: "General", subcategory: "Potion Bag (Master Mode)" })
  autoOpenPotionBagM6 = false;

  // ===== Storm Pads =====
  @SwitchProperty({
    name: "Pad Timers aktiv",
    description: "Aktiviert die Storm Pad Chat-Timer (Purple/Green).",
    category: "Storm Pads",
    subcategory: "General"
  })
  padTimersEnabled = true;

  @SwitchProperty({
    name: "Purple Pad Timer",
    description: "Chat-Countdown für Purple Pad.",
    category: "Storm Pads",
    subcategory: "Pads"
  })
  padPurple = true;

  @SwitchProperty({
    name: "Green Pad Timer",
    description: "Chat-Countdown für Green Pad.",
    category: "Storm Pads",
    subcategory: "Pads"
  })
  padGreen = true;

  // ===== HUD =====
  @ButtonProperty({
    name: "HUD bearbeiten",
    description: "Öffnet den HUD-Editor (Timer-Block + Proc-Text).",
    placeholder: "Open HUD Editor",
    category: "HUD",
    subcategory: "MaskTimer HUD"
  })
  openHudEditor() {
    ChatLib.command("masktimerhud", true);
  }

  constructor() {
    this.initialize(this);
    this.setCategoryDescription("General", "MaskTimer + QoL settings.");
    this.setCategoryDescription("HUD", "Customize HUD position/scale.");
    this.setCategoryDescription("Storm Pads", "Storm pad chat timers (Purple/Green).");
  }
}

export default new Config();
