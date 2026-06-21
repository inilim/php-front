import { Glob } from "bun";
import { join, sep } from "path";

/**
 * Макрос выполняется во время сборки.
 * Собирает все php в один массив
 */
export async function loadPhpSources(): Promise<Array<string>> {
    // Находим все .php файлы рекурсивно
    const glob = new Glob("**/*.php");
    const sources: Array<string> = [];

    // Указываем путь к папке php относительно корня проекта
    const phpDir = join(process.cwd(), "src/php");
    //   console.log(phpDir);

    for await (const file of glob.scan(phpDir)) {
        // Формируем паттерн для текущей ОС
        // На Windows это будет 'vendor\' и '\vendor\'
        // На Linux/macOS это будет 'vendor/' и '/vendor/'
        const isVendorStart = file.startsWith(`vendor${sep}`);
        const isVendorIncluded = file.includes(`${sep}vendor${sep}`);

        if (isVendorStart || isVendorIncluded) {
            continue;
        }

        // console.log(file);
        const content = await Bun.file(join(phpDir, file)).text();
        sources.push(content);
    }

    console.log("php files:", sources.length);
    return sources;
}
