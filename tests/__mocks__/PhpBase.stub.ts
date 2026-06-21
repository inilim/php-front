// tests/__mocks__/PhpBase.stub.ts

// Класс-заглушка для EventBuffer, чтобы код не падал при обращении к buffers.stdout
class MockEventBuffer {
    constructor(private parent: any, private type: string, private fd: number) {}
    push(byte: any) { 
        // Имитируем запись: если нужно, можно сохранять в this.parent.mockOutput
    }
    flush() {}
}

export class PhpBase extends EventTarget {
    // Публичные свойства, к которым может обращаться внешний код
    onerror: Function = () => {};
    onoutput: Function = () => {};
    onready: Function = () => {};
    
    // Имитация внутренних буферов
    buffers: any;
    
    // Имитация промиса с бинарником (в оригинале это промис с WASM-модулем)
    binary: Promise<any>;
    
    // Энкодер, как в оригинале
    encoder = new TextEncoder();

    constructor(PhpBinary: any, args: any = {}) {
        super();

        // Настраиваем буферы, чтобы код типа this.buffers.stdin.push() не падал
        this.buffers = {
            stdin: [],
            stdout: new MockEventBuffer(this, 'output', -1),
            stderr: new MockEventBuffer(this, 'error', -1),
        };

        // Сразу резолвим бинарник "фейковым" объектом php
        // Этот объект должен иметь методы ccall, FS и т.д., если они вызываются напрямую
        const mockPhpInstance = {
            ccall: (funcName: string, returnType: any, argTypes: any[], args: any[], opts: any) => {
                // Если код ждет возврата чего-то конкретного, можно добавить логику здесь
                // Но для стаба обычно достаточно вернуть 0 или null
                return 0;
            },
            FS: {
                syncfs: (populate: boolean, cb: Function) => cb(null)
            },
            onRefresh: [] // для метода refresh
        };

        this.binary = Promise.resolve(mockPhpInstance);

        // Имитируем асинхронный вызов onready, как в оригинале (postRun)
        setTimeout(() => {
             const event = new Event('ready');
             this.onready(event);
             this.dispatchEvent(event);
        }, 0);
    }

    inputString(byteString: string) {
        this.input(this.encoder.encode(byteString));
    }

    input(items: Uint8Array | number[]) {
        this.buffers.stdin.push(...items);
    }

    flush() {
        this.buffers.stdout.flush();
        this.buffers.stderr.flush();
    }

    run(phpCode: string) {
        // Возвращаем промис, имитирующий успешное выполнение
        return this.binary.then(() => {
            // Можно эмитить события вывода, если тесты это проверяют
            // this.onoutput(new CustomEvent('output', { detail: ["some output"] }));
            return 0; // exit code
        });
    }

    exec(phpCode: string) {
        return this.binary.then(() => {
            return "mock-exec-result";
        });
    }

    tokenize(phpCode: string) {
        return this.binary.then(() => {
             return "mock-tokens-json"; 
        });
    }

    refresh() {
        return this.binary.then(() => {
            return 0;
        });
    }
}
