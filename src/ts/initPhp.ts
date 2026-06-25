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

    // php.exec(`(new \\App\\Init)->__invoke()`)
    loadZipAsBase64('https://raw.githubusercontent.com/inilim/php-front/refs/heads/master/src/php/php.zip')
        .then(base64 => {
            window.___tmp_php_zip_source = base64;
            // INFO у методо run ограниченное вставка кода, но можно через js (window) пробросить ресурсы.
            return php.run(`<?php

                date_default_timezone_set('UTC');
                error_reporting(E_ALL);
                ini_set('memory_limit', '5m');

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
                }
                var_dump(is_file(__DIR__ . '/src/vendor/autoload.php'));

                unset($status);

                (new \\App\\Init)->__invoke();
            `)
        })
        .then((value) => {

            window.___tmp_php_zip_source = undefined;
            delete window.___tmp_php_zip_source;
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
