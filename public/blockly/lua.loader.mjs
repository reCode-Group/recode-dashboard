import {loadChunk} from '../app/scripts/load.mjs';
import './blockly.loader.mjs';

export const {
  LuaGenerator,
  Order,
  luaGenerator,
} = await loadChunk(
  'blockly/src/generators/lua.js',
  'dist/lua_compressed.js',
  'lua',
);
