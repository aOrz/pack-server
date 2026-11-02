const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const path = require('path');
function check(branches, expectedCheckout, branch = 'dev') {
  const commands = [];
  const moduleObject = { exports: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../model/site.js'), 'utf8'), {
    module: moduleObject,
    require: name => {
      if (name === './build.js') return {};
      if (name === 'fs') return { existsSync: () => true };
      if (name === 'shelljs') return {
        cd: () => {}, mkdir: () => {},
        exec: command => { commands.push(command); return { stdout: branches }; }
      };
      throw new Error(name);
    }
  });
  new moduleObject.exports().getCode({ site: 'github', user: 'example', pname: 'demo', branch });
  assert.deepStrictEqual(commands, expectedCheckout ? ['git branch', 'git checkout ' + branch, 'git pull origin ' + branch] : ['git branch', 'git pull origin ' + branch]);
}
check('* master\n  dev\n', true);
check('  master\n* dev\n', false);
check('* main-old\n  main\n', true, 'main');
check('* release/1x0\n  release/1.0\n', true, 'release/1.0');
check('* release/1.0\r\n  main\r\n', false, 'release/1.0');
console.log('existing branch checkout regression tests passed');
