import {loadChunk} from '../app/scripts/load.mjs';
import './blockly.loader.mjs';

export const {
  JavascriptGenerator,
  Order,
  javascriptGenerator,
} = await loadChunk(
  'blockly/src/generators/javascript.js',
  'dist/javascript_compressed.js',
  'javascript',
);
