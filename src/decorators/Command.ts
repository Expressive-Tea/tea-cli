import MetaData from '../classes/MetaData';
import { COMMANDS_KEY } from '../constants/constants';

export function Command(name: string) {
  return target => {
    try {
      const commands = MetaData.get(COMMANDS_KEY, target) || [];
      const command = require(`../commands/${name}`);
      commands.unshift(command);
      MetaData.set(COMMANDS_KEY, commands, target);
    } catch (e) {
      console.error(`Command ${name} is not valid`);
    }
  };
}
