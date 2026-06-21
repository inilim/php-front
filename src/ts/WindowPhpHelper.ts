import pako from "pako";
import { getObjPhp } from "./initPhp";
import { getObjWindowPhpApp } from "./WindowPhpApp";

export class WindowPhpHelper {
    ["jsonToJsValue"](json: string) {
        let value: any;
        try {
            value = JSON.parse(json);
        } catch (e: unknown) {
            // TODO это обьект в php?
            return null;
        }
        return value;
    }

    ["createPhpInvoker"](callbackId: number): Function {
        return (...args: any[]) => {
            // 1. Превращаем массив в объект со строковыми ключами
            // Было: [event, 'text']
            // Стало: { "0": event, "1": 'text', "length": 2 }
            const payload: any = { length: args.length };

            for (let i = 0; i < args.length; i++) {
                // Принудительно делаем ключ строкой
                payload["" + i] = args[i];
            }

            // 2. Кладем этот объект в мост
            getObjWindowPhpApp().data_bridge.set("args_" + callbackId, payload);

            // 3. Вызываем PHP и возвращаем его результат (Promise)
            // \App\Action\InvokeCallbackRegistryAction
            return getObjPhp().exec(
                `\\App\\Action\\InvokeCallbackRegistryAction::invoke(${callbackId});`,
            );
        };
    }

    ["querySelector"](selector: string): Element | null {
        return document.querySelector(selector);
    }

    ["querySelectorAll"](selector: string): NodeListOf<Element> {
        return document.querySelectorAll(selector);
    }

    ["compress"](value: string): string | null {
        if (!value || value.length === 0) {
            return "";
        }

        try {
            // Конвертируем строку в Uint8Array
            const uint8Array = new TextEncoder().encode(value);

            // Сжимаем используя deflate
            const compressed = pako.deflate(uint8Array);

            // Конвертируем в base64 для хранения в localStorage более эффективным способом
            let binary = "";
            const len = compressed.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(compressed[i]);
            }

            return btoa(binary);
        } catch (error: unknown) {
            console.error(error);
        }
        return null;
    }

    ["decompress"](value: string): string | null {
        if (!value || value.length === 0) {
            return "";
        }

        try {
            // Декодируем из base64
            const binaryString = atob(value);
            const uint8Array = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                uint8Array[i] = binaryString.charCodeAt(i);
            }
            // Распаковываем используя inflate
            return pako.inflate(uint8Array, { to: "string" });
        } catch (error: unknown) {
            console.error(error);
        }

        return null;
    }

    ["typeof"](value: any): string {
        return typeof value;
    }

    ["getNameClass"](value: any): string | null {
        const type = typeof value;
        if (type === "object" || type === "function") {
            return value.constructor.name ?? null;
        }
        return null;
    }

    ["isElement"](value: any): boolean {
        return value instanceof Element;
    }

    ["inspectValueToJson"](value: any) {
        return JSON.stringify(this.inspectValue(value));
    }

    /**
     * Сразу получаем много информации об значении, чтобы не гонять контекст php<->js туда сюда
     */
    ["inspectValue"](value: any) {
        // 1. Получаем точный строковый тег типа (например, "Array", "Date", "Null")
        const rawTag = Object.prototype.toString.call(value);
        const rawType = rawTag.slice(8, -1);

        const info: Record<string, any> = {
            type: typeof value, // Базовый JS тип
            rawType: rawType, // Точный тип (Array, Map, Date...)
            nameClass: value?.constructor?.name ?? null,
        };

        // 2. Специфика объектов (исключая null)
        if (typeof value === "object" && value !== null) {
            // Состояние объекта
            info.isElement = value instanceof Element;
            info.isFrozen = Object.isFrozen(value);
            info.isSealed = Object.isSealed(value);
            info.isExtensible = Object.isExtensible(value);

            // Количество собственных свойств (включая Symbols)
            try {
                info.ownKeysCount = Reflect.ownKeys(value).length;
            } catch (e) {
                info.ownKeysCount = "access_denied"; // Например, для некоторых Proxy
            }

            // Наследование
            const proto = Object.getPrototypeOf(value);
            info.parentNameClass =
                proto?.constructor?.name ??
                (proto === null ? "null" : "unknown");
        }

        // 3. Метрики размера (Length / Size)
        // Проверяем наличие свойств безопасно с помощью оператора in
        if (
            value &&
            (typeof value === "object" ||
                typeof value === "string" ||
                typeof value === "function")
        ) {
            if ("length" in value) info.length = value.length; // Массивы, строки, функции (arity)
            if ("size" in value) info.size = value.size; // Map, Set
            if ("byteLength" in value) info.byteLength = value.byteLength; // Buffers
        }

        // 4. Детали функций
        if (typeof value === "function") {
            info.isAsync = rawType === "AsyncFunction";
            info.isGenerator = rawType === "GeneratorFunction";
            // info.sourceSnippet = value.toString().slice(0, 50) + '...'; // Если нужен код
        }

        // 5. Детали чисел
        if (typeof value === "number") {
            info.isInteger = Number.isInteger(value);
            info.isSafeInteger = Number.isSafeInteger(value);
            info.isNaN = Number.isNaN(value);
            info.isFinite = Number.isFinite(value);
        }

        // 6. Специальные проверки
        if (rawType === "Date") {
            info.isoString =
                value instanceof Date && !isNaN(value.getTime())
                    ? value.toISOString()
                    : "Invalid Date";
        }

        if (rawType === "Error") {
            info.message = value.message;
            info.stackTracePreview = value.stack?.split("\n")[0];
        }

        return info;
    }

    // extractTitleFromHtml(html: string): string | null {
    //     const parser = new DOMParser();
    //     const doc = parser.parseFromString(html, "text/html");

    //     const titleElement = doc.querySelector("title");
    //     const titleText = titleElement?.textContent?.trim();

    //     return titleText || null;
    // }
}
