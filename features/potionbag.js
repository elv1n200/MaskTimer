import Config from "../config";
import Dungeon from "../../BloomCore/dungeons/Dungeon";

let openedThisRun = false;

function isEnabledForCurrentFloor() {
  const num = Dungeon.floorNumber;
  if (!num) return false;

  const isMaster = Dungeon.dungeonType === "Master Mode";
  const key = (isMaster ? "M" : "F") + num;

  // New per-floor toggles (preferred)
  const prop = "autoOpenPotionBag" + key;
  if (Config[prop] !== undefined) return !!Config[prop];

  return false;
}

Dungeon.registerWhenInDungeon(
  register("chat", () => {
    // Per-floor gate
    if (!isEnabledForCurrentFloor()) return;

    if (openedThisRun) return;
    openedThisRun = true;

    // wait ~1s after run start
    Client.scheduleTask(20, () => {
      ChatLib.command("potionbag");
    });
  }).setCriteria(Player.getName() + " is now ready!")
);

register("worldUnload", () => {
  openedThisRun = false;
});

export function initPotionBagM7() {
  // side effects on import
}
