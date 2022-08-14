# Promise priority queue

**Install**

```shell
npm install @coxy/promise-priority-queue
```

**Create**

```javascript
import { promisePriorityQueue } from '@coxy/promise-priority-queue';
```

... or using CommonJS syntax:

```javascript
const { promisePriorityQueue } = require('@coxy/promise-priority-queue');
```

```typescript
const timer = (time: number) => new Promise((resolve) => setTimeout(resolve, time))

const limit = promisePriorityQueue(2)

void limit.add(async () => {
  await timer(3000)
  console.log('timer 3000')
}, 10)

void limit.add(async () => {
  await timer(1000)
  console.log('timer 1000 - 1')
}, 2)

void limit.add(async () => {
  await timer(1000)
  console.log('timer 1000 - 2')
}, 0)

setTimeout(limit.pause, 500)
setTimeout(limit.resume, 5000)


```

`promisePriorityQueue(concurrency: number)`

Create limiter object. concurrency default is 1

`instance.add(fn, priority?: number)`

Add task to priority queue. Default priority - 0, the fewer themes, the higher the priority

`instance.active`

The number of promises that are currently running.

`instance.pending`

The number of promises that are waiting to run (i.e. their internal fn was not called yet).

`instance.clear()`

Discard pending promises that are waiting to run.

`instance.pause()`

Pause queue

`instance.resume()`

Resume queue

