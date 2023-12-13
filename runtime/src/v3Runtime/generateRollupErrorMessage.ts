// Inspired by
//  * https://github.com/rollup/rollup/blob/c5337ef28a71c796e768a9f0edb3d7259a93f1aa/cli/logging.ts#L4
//  * https://github.com/vizhub-core/vizhub-legacy/blob/main/vizhub-v2/packages/neoFrontend/src/pages/VizPage/VizRunnerContext/generateRunErrorMessage.js#L2
import { RollupError } from 'rollup';
import { ResolvedVizFileId } from './types';
import { parseId } from './parseId';

// Clean up the file id for human consumption.
export default function relativeId(
  id: ResolvedVizFileId,
): string {
  // TODO consider exposing vizId or slug in the UI if the
  // error originates from a viz that is imported from.
  const { fileName } = parseId(id);
  return fileName;
}

export const generateRollupErrorMessage = (
  error: RollupError,
) => {
  const name = error.name || (error.cause as Error)?.name;
  const nameSection = name ? `${name}: ` : '';

  const message = `${nameSection}${error.message}`;

  const outputLines = [`[!] ${message.toString()}`];

  if (error.url) {
    outputLines.push(error.url);
  }

  if (error.loc) {
    outputLines.push(
      `${relativeId((error.loc.file || error.id)!)} (${
        error.loc.line
      }:${error.loc.column})`,
    );
  } else if (error.id) {
    outputLines.push(relativeId(error.id));
  }

  if (error.frame) {
    outputLines.push(error.frame);
  }

  if (error.stack) {
    outputLines.push(
      error.stack?.replace(
        `${nameSection}${error.message}\n`,
        '',
      ),
    );
  }

  outputLines.push('', '');

  return outputLines.join('\n');

  //   const lines = [];
  //   let message = error.message;
  //   if (error.name) {
  //     message = `${error.name}: ${message}`;
  //   }
  //   lines.push(message);
  //   if (error.url) {
  //     lines.push(error.url);
  //   }
  //   if (error.loc) {
  //     lines.push(
  //       `${error.loc.file || error.id} (line ${
  //         error.loc.line
  //       })`,
  //     );
  //   } else if (error.id) {
  //     lines.push(error.id);
  //   }
  //   if (error.frame) {
  //     lines.push(error.frame);
  //   }
  //   // if (error.stack) {
  //   //   lines.push(error.stack);
  //   // }
  //   return lines.join('\n');
};
