import { WindowPhpActionService } from "./WindowPhpActionService";
import { DataBridge } from "./DataBridge";
import { WindowPhpHelper } from "./WindowPhpHelper";

export class WindowPhpApp {
    // helper: WindowPhpHelper;
    // data_bridge: DataBridge;
    // action: WindowPhpActionService;

    declare helper: WindowPhpHelper; // declare только для типов TS
    declare data_bridge: DataBridge;
    declare action: WindowPhpActionService;

    constructor() {
        // this["act"+"ion"] <-- build minify переименовывает свойства, поэтому делаем конкатенацию для сохранения
        this["act" + "ion"] = new WindowPhpActionService();
        this["data_" + "bridge"] = new DataBridge();
        this["hel" + "per"] = new WindowPhpHelper();
    }
}

const obj: WindowPhpApp = new WindowPhpApp();

// убрать getObjWindowPhpApp()
export function getObjWindowPhpApp(): WindowPhpApp {
    return obj;
}
