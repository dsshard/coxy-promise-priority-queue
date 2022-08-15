export declare function promisePriorityQueue(concurrency?: number, defaultPriority?: number): {
    add: <T>(fn: any, priority?: number) => Promise<T>;
    readonly active: number;
    readonly pending: number;
    clear: () => void;
    pause: () => void;
    resume: () => void;
};
