import Config from "../config";

let serverTicks = 0;
const S32PacketConfirmTransaction = Java.type("net.minecraft.network.play.server.S32PacketConfirmTransaction");

register("chat", () => {
  if (!Config.padTimersEnabled) return;
  serverTicks = 196;
  padTick.register();
}).setCriteria(/\[BOSS\] Storm: (ENERGY HEED MY CALL|THUNDER LET ME BE YOUR CATALYST)!/);

const padTick = register("packetReceived", (packet) => {
  if (!Config.padTimersEnabled) return;
  if (!Config.padPurple && !Config.padGreen) return;

  if (packet.func_148890_d() <= 0) serverTicks--;

  if (serverTicks % 5 !== 0) return;

  if (Config.padPurple) {
    if (serverTicks === 150) ChatLib.chat("Pad &dpurple&r in&b 2.5s");
    if (serverTicks === 140) ChatLib.chat("Pad &dpurple&r in&b 2.0s");
    if (serverTicks === 130) ChatLib.chat("Pad &dpurple&r in&b 1.5s");
    if (serverTicks === 120) ChatLib.chat("Pad &dpurple&r in&b 1.0s");
    if (serverTicks === 110) ChatLib.chat("Pad &dpurple&r in&b 0.5s!");
    if (serverTicks === 100) ChatLib.chat("Pad &dpurple&r &eNOW!");
  }

  if (Config.padGreen) {
    if (serverTicks === 95) ChatLib.chat("Pad &agreen&r in&b 2.5s");
    if (serverTicks === 85) ChatLib.chat("Pad &agreen&r in&b 2.0s");
    if (serverTicks === 75) ChatLib.chat("Pad &agreen&r in&b 1.5s");
    if (serverTicks === 65) ChatLib.chat("Pad &agreen&r in&b 1.0s");
    if (serverTicks === 55) ChatLib.chat("Pad &agreen &rin&b 0.5s!");
    if (serverTicks === 45) ChatLib.chat("Pad &agreen &eNOW!");
  }

  if (serverTicks < 45) padTick.unregister();
}).setFilteredClass(S32PacketConfirmTransaction).unregister();

register("worldUnload", () => {
  serverTicks = 0;
  try { padTick.unregister(); } catch (e) {}
});

register("command", (color) => {
  if (color !== "purple" && color !== "green") {
    ChatLib.chat("&cUsage: /padtimer [purple|green]");
    return;
  }
  if (color === "purple") Config.padPurple = !Config.padPurple;
  if (color === "green") Config.padGreen = !Config.padGreen;

  ChatLib.chat(`[&3Pad Timers&f] &dPurple&f: ${Config.padPurple ? "&aEnabled" : "&cDisabled"} &f| &aGreen&f: ${Config.padGreen ? "&aEnabled" : "&cDisabled"}`);
}).setName("padtimer");

export function initPadTimers() {
  // side effects on import
}
