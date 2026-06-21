// import { PhpWeb } from "php-wasm/PhpWeb.mjs";
import { output, error, ready } from "./handlers";
import { PhpWebStub } from '../../tests/__mocks__/PhpWeb.stub';
import { getObjWindowPhpApp } from './WindowPhpApp';
import { uuidV4BatchManager } from "./Service/UuidV4BatchManager";
// 
import { PhpWeb as PhpWebClass } from "../../files/php-wasm@0.0.8/PhpWeb.mjs";
// 
import {
    clickTabCommonHandle, // пример обработчика
} from "./handleFromFrontToPhp";
// import app_php_source from "./../php/app.php" with { type: "text" };

// 

let php: PhpWebStub | null = null;

export async function importPhp() {

    // TODO wasm берем из CDN !!!!
    // const { PhpWeb as PhpWebClass } = await import('https://cdn.jsdelivr.net/npm/php-wasm@0.0.8/PhpWeb.mjs');
    // const { PhpWeb as PhpWebClass } = await import('https://cdn.jsdelivr.net/npm/php-wasm@0.0.9-alpha-32/PhpWeb.mjs');
    php = new PhpWebClass({
        files: [
            {
                name: 'php-source.zip',
                parent: '/preload/',
                url: 'https://raw.githubusercontent.com/inilim/php-front/refs/heads/master/src/php/php.zip'
            }
        ]
    });
    if (php) {
        php.addEventListener('output', output);
        php.addEventListener('error', error);
        php.addEventListener('ready', ready);
    }
};

export function getObjPhp(): PhpWebStub {
    return php as PhpWebStub;
}

/**
 * Вызываем коллбек с передачей аргумента в контекст php
 */
export function phpExecWithArg(callback: ((keyMap: string) => void), arg: any) {
    // TODO можно передавать много аргументов по принцыпу callback registry
    uuidV4BatchManager.getNextId(keyMap => {
        getObjWindowPhpApp().data_bridge.set(keyMap, arg);
        callback(keyMap);
    });
}

export function appInit() {
    const php = getObjPhp();

    // ------------------------------------------------------------------
    //
    // ------------------------------------------------------------------

    php.exec(`(new \\App\\Init)->__invoke()`)
        .then((value) => {
            if (getObjWindowPhpApp().data_bridge.get("php-init") !== true) {
                return;
            }

            console.log("[php-app] \\App\\Init->__invoke() done");
            setFrontHandlers();
        });
}

function setFrontHandlers(): void {
    // Клилки по табам
    // const tabConteiner = document.querySelector('[data-id="tabs-container"]')!;
    // tabConteiner.addEventListener("click", clickTabCommonHandle);

    // Клики по кнопкам
    // const bntConteiner = document.querySelector('[data-id="btns-container"]')!;
    // bntConteiner.addEventListener("click", clickBtnCommonHandle);

    // Помечаем, что хандлеры на фронте были инициализированы
    getObjWindowPhpApp().data_bridge.set("js-init-handlers", true);
    console.log("[php-app] init front handlers");
}
