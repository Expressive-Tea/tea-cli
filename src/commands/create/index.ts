import 'colors';
import * as inquirer from 'inquirer';
import { snakeCase } from 'lodash';
import * as shell from 'shelljs';
import * as licenses from 'spdx-license-list';
import * as fs from 'fs';
import * as path from 'path';

module.exports = ($prog, settings) => {
  $prog
    .command('brew', 'Brew a new application')
    .argument('<app_name>', 'Application Name')
    .option('--flavor <flavor>', 'Which <flavor> do you like (ts-node, webpack)', ['ts-node', 'webpack'])
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
        },
        {
          type: 'list',
          when: !options.flavor,
          name: 'flavor',
          message: 'Please Select the flavor that you like it:',
          choices: ['ts-node', 'webpack']
        }
      ]);

      const $target = path.resolve(shell.pwd().toString(), answers.appName);
      const $local = settings.root;
      const $templatePath = `${$local}/templates/${options.flavor || answers.flavor}/`;

      if (fs.existsSync($templatePath)) {
        shell.mkdir('-p', $target);
        logger.info('Copying files…');
        shell.cp('-R', `${$templatePath}/*`, $target);
        logger.info(' The files have been copied!');
      } else {
        logger.error(`The requested template for ${args.appName} wasn't found.`);
        process.exit(1);
      }
      console.log({ args, options, settings, $target, $local, answers });
    });
};
