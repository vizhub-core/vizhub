// A semaphore to limit the number of concurrent screenshots
export class Semaphore {
  max: number;
  counter: number;
  queue: Array<() => void>;
  constructor(max: number) {
    this.max = max;
    this.counter = max;
    this.queue = [];
  }

  async acquire() {
    if (this.counter > 0) {
      this.counter--;
      return Promise.resolve();
    }

    // If counter is 0, wait until a resource is free
    return new Promise<void>((resolve: () => void) => {
      this.queue.push(resolve);
    });
  }

  release() {
    if (this.queue.length > 0) {
      // Release the next task in the queue
      const nextResolve = this.queue.shift();
      nextResolve();
    } else {
      // Increment the counter if no tasks are waiting
      this.counter++;
    }
  }
}
