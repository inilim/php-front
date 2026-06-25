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
    php = new PhpWebClass();
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

function loadZipAsBase64(url: string) {
    return fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Ошибка загрузки');
            return response.arrayBuffer();
        })
        .then(arrayBuffer => {
            const uint8Array = new Uint8Array(arrayBuffer);
            let binaryString = '';
            for (let i = 0; i < uint8Array.length; i++) {
                binaryString += String.fromCharCode(uint8Array[i]);
            }
            return btoa(binaryString);
        });
}

export function appInit() {
    const php = getObjPhp();

    // ------------------------------------------------------------------
    //
    // ------------------------------------------------------------------

    // return;
    // php.exec(`(new \\App\\Init)->__invoke()`)
    loadZipAsBase64('https://raw.githubusercontent.com/inilim/php-front/refs/heads/master/src/php/php.zip')
        .then(base64 => php.run(`<?php

            $source = '${base64}';
            $source = \\base64_decode($source, true);
            $zipFile = './source.zip';
            \\file_put_contents($zipFile, $source);
            unset($source);
            $zip = new \\ZipArchive;

            if (false === $zip->open($zipFile)) {
                echo 'err zip';
            }

            if (false === \\mkdir('./src')) {
                echo 'err create dir';
            }

            $zip->extractTo('./src');

            $zip->close();

            \\unlink($zipFile);

            print_r(\\scandir(__DIR__));
            print_r(\\scandir(__DIR__ . '/src'));`))
        .then((value) => {
            console.log("[php-app] done");

            return;
            if (getObjWindowPhpApp().data_bridge.get("php-init") !== true) {
                return;
            }

            console.log("[php-app] \\App\\Init->__invoke() done");
            setFrontHandlers();
        })
        .catch(err => console.error('[php-app]', err));
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
