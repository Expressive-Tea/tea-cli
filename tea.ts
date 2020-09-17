#!/usr/bin/env node

import * as prog from 'caporal';
import { resolve } from 'path';
import { pwd } from 'shelljs';
import brewCommand from './commands/brew';

const $root = resolve(__dirname);
const $template = resolve($root, 'templates');
const $current = resolve(pwd().toString());
prog
  .version('1.0.0-beta');

brewCommand(prog, { $root, $template, $current });

prog.parse(process.argv);
