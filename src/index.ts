import { PriorityQueue } from '@coxy/queue'

export function promisePriorityQueue (concurrency = 1, defaultPriority = 0) {
  if (Number(concurrency) <= 0) {
    throw new TypeError('Expected `concurrency` to be a number from 1 and up')
  }

  const queue = new PriorityQueue()
  let activeCount = 0
  let pause = false

  const next = () => {
    if (pause) {
      return
    }
    activeCount--
    if (queue.size > 0) {
      queue.dequeue()()
    }
  }

  const run = async (fn, resolve) => {
    activeCount++
    const result = (async () => fn())()
    resolve(result)

    try {
      await result
    } catch {
    }

    next()
  }

  const enqueue = (fn, priority: number, resolve) => {
    queue.enqueue(run.bind(undefined, fn, resolve), priority);

    (async () => {
      await Promise.resolve()

      if (activeCount < concurrency && queue.size > 0) {
        queue.dequeue()()
      }
    })()
  }

  return {
    add: <T>(fn, priority?: number): Promise<T> => new Promise((resolve) => {
      enqueue(fn, priority || defaultPriority, resolve)
    }),
    get active (): number {
      return activeCount
    },
    get pending (): number {
      return queue.size
    },
    clear: (): void => {
      queue.clear()
    },
    pause: (): void => {
      pause = true
    },
    resume: (): void => {
      pause = false
      next()
    }
  }
}

