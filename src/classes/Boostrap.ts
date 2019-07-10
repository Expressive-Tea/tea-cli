import * as $prog from 'caporal';
import * as path from 'path';
import MetaData from '../classes/MetaData';
import { COMMANDS_KEY } from '../constants/constants';

interface BootstrapOptions {
  root: string;
}

const DEFAULT = {
  root: path.resolve(__dirname, '../../../')
};

export default class Bootstrap {
  static getInstance() {
    return Bootstrap.instance ? Bootstrap.instance : new Bootstrap(DEFAULT);
  }

  private static instance: Bootstrap;
  private $pkg = require(path.resolve(__dirname, '../../../package.json'));
  private options: BootstrapOptions;

  constructor(options: BootstrapOptions = DEFAULT) {
    if (Bootstrap.instance) {
      return Bootstrap.instance;
    }

    const commands = MetaData.get(COMMANDS_KEY, this);

    this.options = options;
    $prog.version(this.$pkg.version);

    commands.forEach(c => c($prog, options));
    return this;
  }

  async run() {
    $prog.parse(process.argv);
  }
}
