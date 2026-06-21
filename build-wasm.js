import * as esbuild from "esbuild";
import fs from "node:fs";
import path from "node:path";

// 1. Плагин-заглушка для node (без изменений)
const nodeModulesStubPlugin = {
    name: "node-modules-stub",
    setup(build) {
        build.onResolve({ filter: /^fs$/ }, () => ({
            path: "fs-stub",
            namespace: "fs-stub-ns",
        }));
        build.onLoad({ filter: /.*/, namespace: "fs-stub-ns" }, () => ({
            contents: "export default {}",
            loader: "js",
        }));
    },
};

// 2. Плагин для копирования WASM (вместо инлайна)
const copyWasmPlugin = {
    name: "copy-wasm-fix",
    setup(build) {
        build.onLoad({ filter: /\.mjs$/ }, async (args) => {
            let contents = await fs.promises.readFile(args.path, "utf8");

            // А. Фикс import.meta.url
            // Для бандла iife/browser часто надежнее использовать document.currentScript или хак с location,
            // но если ваш вариант работал, оставим его.
            // contents = contents.replace(
            //     /\bimport\.meta\.url\b/g,
            //     "self.location.href",
            // );
            contents = contents.replace(
                /\bimport\.meta\.url\b/g,
                "(document.currentScript ? document.currentScript.src : self.location.href)",
            );

            // Б. Обработка WASM файла
            const wasmFileName = "php-web.mjs.wasm";

            if (contents.includes(wasmFileName)) {
                const sourceWasmPath = path.join(
                    path.dirname(args.path),
                    wasmFileName,
                );

                // Определяем, куда копировать (в папку outdir)
                // build.initialOptions.outfile = "./public/test.js"
                // Значит wasm кладем в "./public/"
                const outDir = path.dirname(build.initialOptions.outfile);
                const targetWasmPath = path.join(outDir, wasmFileName);

                try {
                    // 1. Копируем файл физически в папку назначения
                    await fs.promises.copyFile(sourceWasmPath, targetWasmPath);

                    console.log(`Copied WASM file to: ${targetWasmPath}`);

                    // 2. Убеждаемся, что в коде путь остается относительным именем файла.
                    // Обычно эмскриптен генерирует что-то вроде new URL('file.wasm', import.meta.url).
                    // Поскольку мы заменяем import.meta.url на self.location.href,
                    // код будет искать wasm рядом с index.html (или текущим URL).

                    // Если нужно явно заменить путь (иногда бывает нужно для вложенных путей):
                    /* 
                    contents = contents.replaceAll(
                        `"${wasmFileName}"`,
                        `"./${wasmFileName}"` // Явный относительный путь
                    );
                    */
                } catch (e) {
                    console.warn(
                        `Could not copy WASM file: ${sourceWasmPath}`,
                        e,
                    );
                }
            }

            return { contents, loader: "js" };
        });
    },
};

await esbuild.build({
    entryPoints: ["./src/entry.ts"],
    outfile: "./public/bundle.js", // JS файл лежит здесь
    bundle: true,
    format: "iife",
    platform: "browser",
    target: ["es2020"],

    // ВАЖНО: разрешаем использование .wasm как внешнего файла, если он встретится в import
    loader: {
        ".wasm": "file",
    },

    plugins: [nodeModulesStubPlugin, copyWasmPlugin],

    define: {
        DEFINE_BUILD_UNIX_MS: String(Date.now()),
    },
});
