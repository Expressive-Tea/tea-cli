import { Program } from '@caporal/core';
import * as shell from 'async-shelljs';
import * as spinners from 'cli-spinners';
import 'colors';
import * as fs from 'fs';
import * as glob from 'glob';
import * as inquirer from 'inquirer';
import { snakeCase } from 'lodash';
import * as ora from 'ora';
import * as path from 'path';
import * as semver from 'semver';
import * as licenses from 'spdx-license-list/full';

export default function brew($prog: Program, $dirs) {
  $prog
    .command('brew', 'Brew a new application')
    .argument('<app_name>', 'Application Name')
    // .option('--flavor <flavor>', 'Which <flavor> do you like (ts-node, webpack)', ['ts-node', 'webpack'])
    .action(async ({args}) => {

      try {
        const spinner = ora();
        const pot = fs.readFileSync(path.resolve($dirs.$root, '../pot.txt'));
        const cup = fs.readFileSync(path.resolve($dirs.$root, '../cup.txt'));

        console.log(pot.toString().white);
        console.log('Welcome to Tea, please give us the instruction to brew you a nice application.'.white.bold);
        console.log('This utility will walk you through creating a Expressive Tea project and It' +
          'only covers the most common settings.');
        console.log('');
        console.log('');
        console.log('WARNING!:'.red.bold, 'If you trying to create a new project and folder is already created',
          ' this tool it will ask to override the folder and you will lose if you selected overwrite option.');
        console.log('');
        console.log('Press CTRL + C to cancel anytime.'.white);
        console.log('');
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
            name: 'appDescription',
            message: 'What is the application description',
            default: 'describe your app here',
          },
          {
            type: 'input',
            name: 'appVersion',
            message: 'What is the application version',
            default: '1.0.0',
            validate: opt => !!semver.valid(opt) ? true : `${opt} is not valid format for Semver standard.`
          },
          {
            type: 'input',
            name: 'license',
            message: 'What is License do you prefer',
            default: 'MIT',
            validate: opt => !!licenses[opt] ? true : `License ${opt} is not a valid SPDX licenses`
          },
          {
            type: 'confirm',
            when: opt => {
              return fs.existsSync(path.resolve($dirs.$current, opt.appName));
            },
            name: 'overrideFolder',
            default: true,
            message: 'do you want to override the target folder?'
          },
          {
            type: 'confirm',
            name: 'installDependencies',
            default: true,
            message: 'do you want to install npm dependencies?'
          },
          {
            type: 'list',
            when: !args.flavor,
            name: 'flavor',
            message: 'Please Select the flavor that you like it:',
            choices: ['ts-node']
          }
        ]);

        console.log('');
        console.log('');
        spinner.start('Creating Expressive Tea Project...');

        const $target = path.resolve($dirs.$current, answers.appName);
        const templateFilename = `${answers.flavor}.zip`;
        const $template = path.join($dirs.$template, `../../templates/${templateFilename}`);

        console.log($target, $template);

        if (answers.overrideFolder) {
          spinner.text = 'Overwrite current project...';
          await shell.asyncExec(`rm -rf ${$target}`, {silent: true});
        }

        await shell.asyncExec(`mkdir ${$target}`, { silent: true });
        await shell.asyncExec(`cd ${$target} && unzip ${$template}`, {silent: true});

        spinner.text = 'Applying template variables...';
        const files = glob.sync('**\/*', {
          dot: true,
          nodir: true,
          realpath: true
        });

        files.forEach(file => {
          shell.sed('-i', '%%APP_NAME%%', answers.appName, file);
          shell.sed('-i', '%%APP_DESCRIPTION%%', answers.appDescription, file);
          shell.sed('-i', '%%APP_VERSION%%', answers.appVersion, file);
          shell.sed('-i', '%%APP_LICENSE%%', answers.license, file);
        });

        if (answers.installDependencies) {
          spinner.text = 'Install dependencies...';
          await shell.asyncExec( `cd ${$target} && npm install`, { silent: true});
        }

        spinner.stop();

        const installMessage = answers.installDependencies ?
          'npm start' : 'npm install && npm start';

        console.log(cup.toString().green.bold);
        console.log('');
        console.log(`${answers.appName.cyan.bold} is now complete please go inside of the created folder and use`,
          installMessage.white.bold,
          'if you need to run your application.',
          `Also as alternative you can run`,
          'tea serve'.white.bold,
          'to start your application.');
        console.log('');

      } catch (e) {
        console.error(e.message);
        process.exit(1);
      }
    });
}
