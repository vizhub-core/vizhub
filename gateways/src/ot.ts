// Operational Transformation (OT) utilities.
import * as json1 from 'ot-json1';
import * as textUnicode from 'ot-text-unicode';
import jsondiff from 'json0-ot-diff';
import diffMatchPatch from 'diff-match-patch';
import { Op } from 'entities';

// The OT type used throughout the codebase.
export const otType = json1.type;

// Applies an OT op to an object.
export const apply: (any, Op) => any = json1.type.apply;

// Computes a diff between two objects, expressed as an OT op.
export const diff = (a: any, b: any): Op =>
  jsondiff(a, b, diffMatchPatch, json1, textUnicode);

// A valid op that makes no change.
//export const noop: Op = diff({}, {});
