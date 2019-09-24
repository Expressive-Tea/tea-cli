#!/usr/bin/env node

import * as prog from 'caporal';
import brewCommand from './commands/brew';

prog
.version('1.0.0-beta');

brewCommand(prog);

prog.parse(process.argv);
