#!/usr/bin/env node
import Bootstrap from './src/classes/Boostrap';
import { Command } from './src/decorators/Command';

@Command('create')
class Tea extends Bootstrap {}

new Tea().run();
