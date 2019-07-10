module.exports = $prog => {
  $prog
    .command('create', 'Create a new Application')
    .argument('<app_name>', 'Application Name')
    .option('--flavor <flavor>', 'Which <flavor> do you like (ts-node, webpack)')
    .action((args, options, logger) => {
      console.log({
        args: args,
        options: options
      });
    });
};
