import { spawnSync } from 'node:child_process';

function run(command, args, capture = false) {
  const result = spawnSync(command, args, {
    stdio: capture ? 'pipe' : 'inherit',
    encoding: 'utf8',
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(capture ? result.stderr.trim() || `${command} 执行失败` : `${command} 执行失败`);
  }
  return capture ? result.stdout.trim() : '';
}

let versionCreated = false;
try {
  const args = process.argv.slice(2);
  const bump = args[0] ?? 'patch';
  if (args.length > 1 || !['patch', 'minor', 'major'].includes(bump)) {
    throw new Error('用法：npm run release [-- patch|minor|major]');
  }
  if (run('git', ['branch', '--show-current'], true) !== 'main') {
    throw new Error('请切换到 main 分支后发布。');
  }
  if (run('git', ['status', '--porcelain'], true)) {
    throw new Error('请先提交工作区修改，再运行 npm run release。');
  }
  run('git', ['remote', 'get-url', 'origin'], true);
  if (!process.env.npm_execpath) {
    throw new Error('请通过 npm run release 执行发布。');
  }

  run(process.execPath, [process.env.npm_execpath, 'version', bump]);
  versionCreated = true;
  run('git', ['push', 'origin', 'main', '--follow-tags']);
  console.log('发布完成，油猴会在下次检查更新时发现新版本。');
} catch (error) {
  console.error(error.message);
  if (versionCreated) {
    console.error('版本提交和标签已生成。请重试 git push origin main --follow-tags，避免再次运行 release 导致重复升版本。');
  }
  process.exitCode = 1;
}
