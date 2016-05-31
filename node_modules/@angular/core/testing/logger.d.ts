export declare class Log {
    logItems: any[];
    constructor();
    add(value: any): void;
    fn(value: any): (a1?: any, a2?: any, a3?: any, a4?: any, a5?: any) => void;
    clear(): void;
    result(): string;
}
