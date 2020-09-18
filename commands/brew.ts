import 'colors';
import * as fs from 'fs';
import * as glob from 'glob';
import * as inquirer from 'inquirer';
import { snakeCase } from 'lodash';
import * as path from 'path';
import * as semver from 'semver';
import * as shell from 'shelljs';
import * as licenses from 'spdx-license-list/full';

export default function brew($prog, $dirs) {
  $prog
    .command('brew', 'Brew a new application')
    .argument('<app_name>', 'Application Name')
    // .option('--flavor <flavor>', 'Which <flavor> do you like (ts-node, webpack)', ['ts-node', 'webpack'])
    .action(async (args, options, logger) => {
      const pot = fs.readFileSync(path.resolve($dirs.$root, '../pot.txt'));
      const cup = fs.readFileSync(path.resolve($dirs.$root, '../cup.txt'));

      console.log(pot.toString().white);
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
      const $template = path.join($dirs.$template, '../../templates/' + (options.flavor || 'ts-node'));
      console.log($template);
      // console.log($dirs, $target, answers, licenses[answers.license]);
      // console.log(semver.valid(answers.appVersion));

      // Create Folder and copy template.
      if (answers.overrideFolder) {
        shell.rm('-rf', $target);
      }

      shell.cp('-Rf', $template, $target);


      const files = glob.sync('**/*', {
        dot: true,
        nodir: true,
        realpath: true
      });

      //console.log(files);
      files.forEach(file => {
        shell.sed('-i', '%%APP_NAME%%', answers.appName, file);
        shell.sed('-i', '%%APP_DESCRIPTION%%', answers.appDescription, file);
        shell.sed('-i', '%%APP_VERSION%%', answers.appVersion, file);
        shell.sed('-i', '%%APP_LICENSE%%', answers.license, file);
      });

      shell.cd($target);
      shell.exec('npm install');

      console.log(cup.toString().green.bold);

    });
}
