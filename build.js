import { $ } from "bun";

// 1. Запускаем PHP скрипт и ждем его завершения
// Если скрипт упадет с ошибкой, Bun автоматически выбросит исключение и остановит выполнение
await $`php ./cli-tools/puck-zip.php`;
await $`php ./cli-tools/convert-zip-to-base64.php`;

// 2. Затем выполняем сборку
await Bun.build({
    entrypoints: ["./src/entry.ts"],
    outdir: "./public",
    target: "browser",
    minify: true,
    env: "inline",
    format: "iife",
    define: {
        DEFINE_BUILD_UNIX_MS: String(Date.now()), // число (ms) как JSON-литерал
    },
});
