#!/usr/bin/env node

import {program } from '@caporal/core';
import { resolve } from 'path';
import { pwd } from 'shelljs';
import brewCommand from './commands/brew';
import serveCommand from './commands/serve';
import teapodSecret from './commands/teapod-secret';

const $root = resolve(__dirname, '../');
const $template = resolve($root, 'templates');
const $current = resolve(pwd().toString());

// tslint:disable-next-line:no-var-requires
const project = require(resolve($root, 'package.json'));


const $directories = { $root, $template, $current };
program
  .name(project.name)
  .description(project.description)
  .version(project.version);

brewCommand(program, $directories);
serveCommand(program, $directories);
teapodSecret(program, $directories);

program.run();
