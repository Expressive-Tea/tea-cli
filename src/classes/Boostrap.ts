import * as $prog from 'caporal';
import * as path from 'path';
import MetaData from '../classes/MetaData';
import { COMMANDS_KEY } from '../constants/constants';

export default class Bootstrap {
  static getInstance() {
    return Bootstrap.instance ? Bootstrap.instance : new Bootstrap();
  }

  private static instance: Bootstrap;
  private $pkg = require(path.resolve(__dirname, '../../../package.json'));

  constructor() {
    if (Bootstrap.instance) {
      return Bootstrap.instance;
    }

    const commands = MetaData.get(COMMANDS_KEY, this);
    $prog.version(this.$pkg.version);

    commands.forEach(c => c($prog));
    return this;
  }

  async run() {
    $prog.parse(process.argv);
  }
}
