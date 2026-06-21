type TypeValue = any;
type TypeRecord = Record<string, TypeValue>;

// Data Bridge
export class DataBridge {
    private storage: TypeRecord = {};

    ['getAll'](): TypeRecord {
        return this.storage;
    }

    ['get'](key: string): TypeValue {
        return this.storage[key] ?? null;
    }

    /**
     * значения undefined не передаются в php, но хранится на стороне js
     */
    ['set'](key: string, value: TypeValue): void {
        if(value === undefined){
            value = null;
        }
        this.storage[key] = value;
    }

    ['pull'](key: string): TypeValue {
        const value = this.storage[key] ?? null;
        delete this.storage[key];
        return value;
    }

    ['clear']() {
        this.storage = {};
    }
}
