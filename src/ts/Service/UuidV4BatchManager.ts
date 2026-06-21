import { getObjPhp } from "../initPhp";

type callback = (id: string) => void;

// TODO от этого нужно отказаться

/**
 * Менеджер для получения ID пачками\
 * не знаю какой это дает профит
 */
class UuidV4BatchManager {
    private idQueue: string[] = [];
    private isLoading: boolean = false;
    private pendingCallbacks: Array<callback> = [];
    private batchSize: number = 10;
    private lowWaterMark: number = 3;

    constructor(batchSize: number = 10, lowWaterMark?: number) {
        this.batchSize = batchSize;
        this.lowWaterMark = lowWaterMark ?? Math.floor(batchSize / 3);
    }

    /**
     * Получаем ID через колбек
     */
    getNextId(callback: callback): void {
        // Если есть ID в очереди - отдаём сразу
        // console.log('idQueue', this.idQueue);
        if (this.idQueue.length > 0) {
            const id = this.idQueue.shift()!;
            callback(id);

            // Проверяем низкий уровень
            if (this.idQueue.length <= this.lowWaterMark && !this.isLoading) {
                this.fetchBatch();
            }
            return;
        }

        // Если очередь пустая - добавляем в ожидание и загружаем
        this.pendingCallbacks.push(callback);
        if (!this.isLoading) {
            this.fetchBatch();
        }
    }

    /**
     * Загружаем пачку ID из PHP
     */
    private fetchBatch(): void {
        if (this.isLoading) return;

        this.isLoading = true;
        const php = getObjPhp();

        php.exec(`\\App\\Tool\\ID::uuidv4BatchAsJson(${this.batchSize})`).then(idsJson => {
            const ids: string[] = JSON.parse(idsJson);
            this.idQueue.push(...ids);
            this.isLoading = false;

            // Обрабатываем ожидающие колбеки
            while (this.pendingCallbacks.length > 0 && this.idQueue.length > 0) {
                const callback = this.pendingCallbacks.shift()!;
                const id = this.idQueue.shift()!;
                callback(id);
            }

            // Проверяем низкий уровень после выдачи ID
            if (this.idQueue.length <= this.lowWaterMark && !this.isLoading) {
                this.fetchBatch();
            }
        }).catch(error => {
            console.error('Failed to fetch ID batch:', error);
            this.isLoading = false;
        });
    }
}

// Создаём глобальный менеджер
export const uuidV4BatchManager = new UuidV4BatchManager(25, 5);