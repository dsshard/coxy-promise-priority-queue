"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promisePriorityQueue = void 0;
const queue_1 = require("@coxy/queue");
function promisePriorityQueue(concurrency = 1, defaultPriority = 0) {
    if (Number(concurrency) <= 0) {
        throw new TypeError('Expected `concurrency` to be a number from 1 and up');
    }
    const queue = new queue_1.PriorityQueue();
    let activeCount = 0;
    let pause = false;
    const next = () => {
        if (pause) {
            return;
        }
        activeCount--;
        if (queue.size > 0) {
            queue.dequeue()();
        }
    };
    const run = async (fn, resolve) => {
        activeCount++;
        const result = (async () => fn())();
        resolve(result);
        try {
            await result;
        }
        catch (_a) {
        }
        next();
    };
    const enqueue = (fn, priority, resolve) => {
        queue.enqueue(run.bind(undefined, fn, resolve), priority);
        (async () => {
            await Promise.resolve();
            if (activeCount < concurrency && queue.size > 0) {
                queue.dequeue()();
            }
        })();
    };
    return {
        add: (fn, priority) => new Promise((resolve) => {
            enqueue(fn, priority || defaultPriority, resolve);
        }),
        get active() {
            return activeCount;
        },
        get pending() {
            return queue.size;
        },
        clear: () => {
            queue.clear();
        },
        pause: () => {
            pause = true;
        },
        resume: () => {
            pause = false;
            next();
        }
    };
}
exports.promisePriorityQueue = promisePriorityQueue;
