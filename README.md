# Promise Priority Queue

A lightweight, concurrency-controlled, **priority-based** task queue for Promises.

---

## ✨ Install

```bash
npm install @coxy/promise-priority-queue
```

---

## 📦 Import

ESM:

```typescript
import { promisePriorityQueue } from '@coxy/promise-priority-queue';
```

CommonJS:

```javascript
const { promisePriorityQueue } = require('@coxy/promise-priority-queue');
```

---

## 🚀 Usage

```typescript
const timer = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

const queue = promisePriorityQueue(2); // concurrency limit = 2

void queue.add(async () => {
  await timer(3000);
  console.log('timer 3000');
}, 10); // priority 10

void queue.add(async () => {
  await timer(1000);
  console.log('timer 1000 - 1');
}, 2); // priority 2

void queue.add(async () => {
  await timer(1000);
  console.log('timer 1000 - 2');
}, 0); // priority 0

// Control queue
setTimeout(queue.pause, 500);   // pause queue after 0.5 seconds
setTimeout(queue.resume, 5000); // resume queue after 5 seconds
```

## 🔗 Example Output

```text
timer 1000 - 2
timer 1000 - 1
timer 3000
```
---

## 📖 API

### `promisePriorityQueue(concurrency?: number): QueueInstance`
Creates a new priority queue.

- `concurrency` — (optional) maximum number of concurrently running promises. Defaults to `1`.

### QueueInstance methods:

| Method               | Description                                                                                                                                                                     |
|----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `add(fn, priority?)` | Add an async task to the queue.<br/> - `fn`: an async function returning a Promise.<br/> - `priority`: optional number, default is `0`. Lower numbers mean **higher priority**. |
| `pause()`            | Pauses the execution of new tasks. Running tasks continue.                                                                                                                      |
| `resume()`           | Resumes the queue if it was paused.                                                                                                                                             |
| `clear()`            | Discards all **pending** (waiting) tasks. Running tasks are unaffected.                                                                                                         |
| `active: number`     | Number of currently running tasks.                                                                                                                                              |
| `pending: number`    | Number of queued (waiting) tasks.                                                                                                                                               |

---

## 🛠 Priority System

- Tasks are sorted by priority:  
  **lower numbers** → **higher priority**.
- Tasks with the same priority are handled in **FIFO** (first-in, first-out) order.
- The queue respects the concurrency limit at all times.

---

_(depending on timing and pauses)_

---

## 🔗 Notes

- `pause()` prevents new tasks from starting but does not interrupt currently running tasks.
- `clear()` affects only pending tasks.
- All methods are safe to call multiple times.

---

## 🖊️ License

MIT License.

---

> 🔹 **Fun Fact**: The first real-world use of a "priority queue" concept dates back to early air traffic control systems, where urgent landing requests needed to "jump the queue"!

