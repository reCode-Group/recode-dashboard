import {loadChunk} from '../app/scripts/load.mjs';
import './blockly.loader.mjs';

export const {
  blocks,
  lists,
  logic,
  loops,
  math,
  procedures,
  texts,
  variables,
  variablesDynamic,
} = await loadChunk(
  'blockly/src/blocks/blocks.js',
  'dist/blocks_compressed.js',
  'Blockly.libraryBlocks',
);
