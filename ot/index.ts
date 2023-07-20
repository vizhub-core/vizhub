// Operational Transformation (OT) utilities.
// This file is the central point where the OT types are imported.
// Localized to one file so it's easy to change it in future.
import OTJSON1Presence from 'sharedb-client-browser/dist/ot-json1-presence-umd.cjs';
import jsondiff from 'json0-ot-diff';
import diffMatchPatch from 'diff-match-patch';
import { Op } from 'entities';

const { json1Presence, textUnicode } = OTJSON1Presence;

// The OT type used throughout the codebase.
export const otType = json1Presence.type;

// Applies an OT op to an object.
export const apply: (any, Op) => any = otType.apply;

// Computes a diff between two objects, expressed as an OT op.
export const diff = (a: any, b: any): Op =>
  // TODO consider using makeInvertible from https://github.com/ottypes/json1/blob/master/spec.md
  // so that we can traverse the commit graph in both directions.
  jsondiff(a, b, diffMatchPatch, json1Presence, textUnicode);

// A valid op that makes no change.
//export const noop: Op = diff({}, {});
