// import { PhpWeb } from "php-wasm/PhpWeb.mjs";
import { importPhp } from "./ts/initPhp";
import { PhpDebug as PhpDebugClass } from "./ts/PhpDebug";
import { WindowPhpApp as WindowPhpAppClass, getObjWindowPhpApp } from "./ts/WindowPhpApp";

// ------------------------------------------------------------------
// window обьект для передачи данных из js в php и наоборот
// ------------------------------------------------------------------

// 'export {}' делает этот файл модулем, что необходимо для declare global
export { };

declare global {
    interface Window {
        __php_app: WindowPhpAppClass;
        __php_debug: PhpDebugClass;
    }
}

if (typeof window !== "undefined") {
    window['__php_app'] = getObjWindowPhpApp();
    window['__php_debug'] = new PhpDebugClass();
}

// ------------------------------------------------------------------
// Временно
// ------------------------------------------------------------------

// Сохраняем ссылку на оригинальную функцию
const originalLog = console.log;
// Переопределяем console.log
console.log = function (...args) {
    // Проверяем, является ли первый аргумент строкой и содержит ли он ненужный текст
    if (
        typeof args[0] === "string" &&
        args[0].startsWith("Garbage collecting!")
    ) {
        return; // Игнорируем сообщение (не выводим в консоль)
    }
    // Для всех остальных сообщений вызываем оригинальный логгер
    originalLog.apply(console, args);
};

// ------------------------------------------------------------------
// Start
// ------------------------------------------------------------------

if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            () => {
                importPhp();
            },
            { once: true },
        );
    } else {
        importPhp();
    }
}
