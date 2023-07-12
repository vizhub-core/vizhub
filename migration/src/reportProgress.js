import v8 from 'v8';
let previousHeapSizeUsed;
export const reportProgress = async ({ i, n }) => {
  if (i % 100 === 99) {
    console.log(
      '*******************************************************************',
    );
    console.log(
      '*******************************************************************',
    );
    console.log(
      '*****                     Status Report                       *****',
    );
    console.log(
      '*******************************************************************',
    );
    console.log(
      `*******************************************************************`,
    );
    console.log(`*****  ${Math.round((i / n) * 100)} % done (${i}/${n})`);
    //    console.log(
    //      `*****  Success rate of forkedFrom guessing: ${
    //        guessesCorrect / (guessesCorrect + guessesIncorrect)
    //      }`
    //    );
    const heap = v8.getHeapStatistics();
    console.log(`*****  Heap size used currently:  ${heap.used_heap_size}`);
    if (previousHeapSizeUsed) {
      console.log(`*****  Heap size used previously: ${previousHeapSizeUsed}`);
      console.log(
        `*****                 difference: ${
          previousHeapSizeUsed - heap.used_heap_size
        }`,
      );
    }
    previousHeapSizeUsed = heap.used_heap_size;
    console.log();
    console.log();
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
};
