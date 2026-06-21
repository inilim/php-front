import { getObjPhp } from "./initPhp";

export class PhpDebug {
    ['tabsToConsoleAction']() {
        // App\DebugAction\TabsToConsoleAction
        getObjPhp().exec(
            `(new \\App\\DebugAction\\TabsToConsoleAction)->__invoke()`,
        );
    }

    ['ShowAllAction']() {
        // App\DebugAction\ShowAllAction
        getObjPhp().exec(`(new \\App\\DebugAction\\ShowAllAction)->__invoke()`);
    }
}
