import 'colors';
import * as inquirer from 'inquirer';
import { snakeCase } from 'lodash';
import * as path from 'path';
import * as shell from 'shelljs';
import * as licenses from 'spdx-license-list';

export default function brew($prog, $dirs) {
  $prog
    .command('brew', 'Brew a new application')
    .argument('<app_name>', 'Application Name')
    // .option('--flavor <flavor>', 'Which <flavor> do you like (ts-node, webpack)', ['ts-node', 'webpack'])
    .action(async (args, options, logger) => {
      console.log('');
      console.log('Welcome to Tea, please give us the instruction to brew you a nice application.'.white.bold);
      console.log('');

      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'appName',
          message: 'What is the application name',
          default: args.appName,
          transformer: snakeCase
        },
        {
          type: 'input',
          name: 'license',
          message: 'What is License do you prefer',
          default: 'MIT',
          validate: opt => !!licenses[opt]
        }
        /*
        {
          type: 'list',
          when: !options.flavor,
          name: 'flavor',
          message: 'Please Select the flavor that you like it:',
          choices: ['ts-node', 'webpack']
        }
         */
      ]);

      const $target = path.resolve($dirs.$current, answers.appName);
      console.log($dirs, $target, answers);

    });
}
