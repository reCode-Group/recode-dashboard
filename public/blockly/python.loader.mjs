import {loadChunk} from '../app/scripts/load.mjs';
import './blockly.loader.mjs';

export const {
  Order,
  PythonGenerator,
  pythonGenerator,
} = await loadChunk(
  'blockly/src/generators/python.js',
  'dist/python_compressed.js',
  'python',
);
