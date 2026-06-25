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

let php: PhpWebStub | null = null;





function output(event: CustomEvent) {
    console.log('[php-app] output event.detail', event.detail);
}

function error(event: CustomEvent) {
    console.log('[php-app] error event.detail', event.detail);
}

function ready(event: CustomEvent) {
    console.log("[php-app] import php done");
    appInit();
}

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

// Так мы сразу внедряем файлы php внутрь бандла
import zipBase64 from './../php/php.base64' with { type: "text" };

export function appInit() {
    const php = getObjPhp();

    // php.exec(`(new \\App\\Init)->__invoke()`)
    // loadZipAsBase64('https://raw.githubusercontent.com/inilim/php-front/refs/heads/master/src/php/php.zip')

    // console.log(zipBase64);
    // console.log(zipBin);

    window.___tmp_php_zip_source = zipBase64;

    php.run(`<?php

        function window(): \\Vrzno
        {
            static $obj = null;
            return $obj ??= new \\Vrzno;
        }

        $status = false;
        (static function (bool &$status) {
            $source = window()->___tmp_php_zip_source ?? '';
            if ($source === '') {
                window()->console->error('err zip');
                return;
            }

            $source = base64_decode($source, true);
            $zipFile = './source.zip';
            file_put_contents($zipFile, $source);
            $source = null;
            $zip = new \\ZipArchive;

            if (false === $zip->open($zipFile)) {
                window()->console->error('err zip');
                return;
            }

            if (false === mkdir('./src')) {
                window()->console->error('err create dir');
                return;
            }

            $zip->extractTo('./src');
            $zip->close();
            $zip = null;
            unlink($zipFile);

            $status = true;
        })($status);

        if ($status) {
            require_once __DIR__ . '/src/vendor/autoload.php';
            (new \\App\\Init)->__invoke();
        }

        unset($status);
    `)
        .then((value) => {

            window.___tmp_php_zip_source = undefined;
            delete window.___tmp_php_zip_source;
            // console.log("[php-app] done");

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
