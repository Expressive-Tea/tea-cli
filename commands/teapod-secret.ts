import * as shell from 'async-shelljs';
import * as chalk from 'chalk';
import 'colors';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export default async function teapodSecret($prog, $dirs) {
  $prog
    .command('teapod-secret', 'Generate Private and Public Keys for Teapod Implementation')
    .option('-p, --passphrase <phrase>', 'Silent application terminal outputs.', { default: '' })
    .option('-s, --size <size>', 'Key Size', { validation: $prog.NUMBER, default: 21 })
    .action(async ({ options }) => {
      const pot = fs.readFileSync(path.resolve($dirs.$root, 'pot.txt'));

      console.log(pot.toString().white);

      const salt: string = crypto.randomBytes(options.size).toString('hex');
      const passphrase: string = options.passphrase || crypto.randomBytes(16).toString('base64');
      const privKey: Buffer = crypto.pbkdf2Sync(passphrase, salt, 1000, options.size, 'sha512');
      const pubKey: Buffer = crypto.pbkdf2Sync(privKey, salt, 1500, options.size, 'sha512');

      console.log('Generating Teapod and Teacup Key.'.white.bold);
      console.log('');
      console.log(chalk`{cyan.bold Server Key :} ${privKey.toString('base64')}`);
      console.log(chalk`{green.bold Clients Key:} ${pubKey.toString('base64')}`);
      console.log(chalk`{magenta.bold Salt:} ${salt}`);

      console.log(chalk`
{red.bold CAUTION:}
All keys generated here are unique, please store them in a secure place and avoid to make it public..`)
    });
}
