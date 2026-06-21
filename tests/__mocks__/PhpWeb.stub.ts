import { PhpBase } from "./PhpBase.stub";
// PhpWeb.stub.ts

export class PhpWebStub extends PhpBase {
    // Сохраняем совместимость с конструктором
    constructor(args: any = {}) {
        // Ничего не делаем, или логируем вызов
    }

    // Заглушка для run
    run(phpCode: string): Promise<any> {
        return Promise.resolve({
            // Возвращаем ожидаемую структуру результата, если нужно
            stdout: "",
            stderr: "",
            exitCode: 0,
        });
    }

    // Заглушка для exec
    exec(phpCode: string): Promise<any> {
        return Promise.resolve({
            // Аналогично для exec
            result: null,
        });
    }

    // Если flush вызывается извне, добавляем и его
    flush(): void {
        // no-op
    }
}
