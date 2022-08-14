export declare function promisePriorityQueue(concurrency?: number): {
    add: (fn: any, priority?: number) => Promise<unknown>;
    readonly active: number;
    readonly pending: number;
    clear: () => void;
    pause: () => void;
    resume: () => void;
};
