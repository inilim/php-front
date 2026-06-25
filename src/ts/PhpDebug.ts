import { getObjPhp } from "./initPhp";

export class PhpDebug {
    ['ShowAllAction']() {
        // App\DebugAction\ShowAllAction
        getObjPhp().exec(`(new \\App\\DebugAction\\ShowAllAction)->__invoke()`);
    }
}
