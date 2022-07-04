import init from 'oca.js';

import { OcaJs } from './OcaJs';
import { createOCA } from './use_cases/createOCA';
import { createStructure } from './use_cases/createStructure';
import { resolveFromZip } from './use_cases/resolveFromZip';

export default init;
export { OcaJs, createOCA, createStructure, resolveFromZip };
