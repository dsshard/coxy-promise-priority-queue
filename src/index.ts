import { PriorityQueue } from '@coxy/queue'

export function promisePriorityQueue (concurrency = 1) {
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
    add: (fn, priority = 0) => new Promise((resolve) => {
      enqueue(fn, priority, resolve)
    }),
    get active () {
      return activeCount
    },
    get pending () {
      return queue.size
    },
    clear: () => {
      queue.clear()
    },
    pause: () => {
      pause = true
    },
    resume: () => {
      pause = false
      next()
    }
  }
}

