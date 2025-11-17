import {
    @Vigilant,
    @SwitchProperty,
    @ButtonProperty
} from "Vigilance";

@Vigilant("MaskTimer", "MaskTimer Settings", {
    getCategoryComparator: () => (a, b) => {
        const order = ["General", "HUD"];
        return order.indexOf(a.name) - order.indexOf(b.name);
    }
})
class Config {

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


    @ButtonProperty({
        name: "HUD bearbeiten",
        description: "Öffnet den HUD-Editor, um Position & Scale des Timers anzupassen.",
        placeholder: "Open HUD Editor",
        category: "HUD",
        subcategory: "MaskTimer HUD"
    })
    openHudEditor() {
        ChatLib.command("masktimerhud", true);
    }

    constructor() {
        this.initialize(this);

        this.setCategoryDescription("General", "Basic settings for the MaskTimer module.");
        this.setCategoryDescription("HUD", "Customize position and scale of the MaskTimer HUD.");
    }
}

export default new Config();
