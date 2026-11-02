const shell = require('shelljs');
const build = require('./build.js');
const fs = require('fs');

class initCode {
  getCode(data) {
    shell.cd('mods');

    fs.existsSync('github/') || shell.mkdir('github');
    shell.cd('github');
    let url = '';
    if (data.site == 'github') {
      url = `git@github.com:${data.user}/${data.pname}.git`;
    }
    fs.existsSync(data.user + '/') || shell.mkdir(data.user);
    shell.cd(data.user);
    fs.existsSync(data.pname + '/') || shell.exec('git clone ' + url);
    data.branch = data.branch?data.branch:'master';
    shell.cd(data.pname);
    let str = shell.exec('git branch');
    const branches = str.stdout.split(/\r?\n/).map(line => line.trim());
    const currentBranch = branches.find(line => line.indexOf('* ') === 0);
    const branchNames = branches.map(line => line.replace(/^[*+]\s+/, ''));
    if (branchNames.indexOf(data.branch) !== -1) {
      if (currentBranch !== '* ' + data.branch) {
        shell.exec(`git checkout ${data.branch}`);
      }
      shell.exec(`git pull origin ${data.branch}`);
    }else{
      shell.exec(`git branch remotes/origin/${data.branch}`);
      shell.exec(`git checkout -b ${data.branch}`);
    }
    shell.cd('../../../../');
  }
}

module.exports = initCode;
