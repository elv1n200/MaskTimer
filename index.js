import Config from "./config";
import { initMaskTimer, openHudEditor } from "./features/masktimer";
import { initPadTimers } from "./features/pads";
import { initPotionBagM7 } from "./features/potionbag";

// init features (registrations happen on import, but keep explicit)
initMaskTimer();
initPadTimers();
initPotionBagM7();

register("command", () => {
  Config.openGUI();
}).setName("masktimerconfig");

register("command", () => {
  openHudEditor();
}).setName("masktimerhud");
