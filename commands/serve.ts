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

export default function serve($prog, $dirs) {
  $prog
    .command('serve', 'Start an Expressive Tea Application')
    .option('-s, --silent', 'Silent application terminal outputs.', $prog.bool, false)
    .action(async ({ options }) => {
      const pot = fs.readFileSync(path.resolve($dirs.$root, '../pot.txt'));

      console.log(pot.toString().white);
      console.log('Warming up the application be patient.'.white.bold);
      console.log('');
      console.log('Press CTRL + C to cancel anytime.'.white);
      console.log('');
      console.log('');

      await shell.asyncExec(`npm start`, {silent: options.silent});
    });
}
