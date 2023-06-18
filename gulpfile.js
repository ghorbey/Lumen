import { watch as __watch, src, series } from 'gulp';
import {
  existsSync,
  readJSONSync,
  copy,
  remove,
  symlink,
  ensureDir,
  createWriteStream,
  writeJSONSync,
  writeFileSync
} from 'fs-extra';
import { resolve, join, relative, basename } from 'path';
import { blueBright, yellow, green, red } from 'chalk';
import archiver from 'archiver';
import stringify from 'json-stringify-pretty-compact';
import { spawn } from 'child_process';

import { add, commit, tag } from 'gulp-git';

import { argv } from 'yargs';

function getConfig() {
  const configPath = resolve(process.cwd(), 'foundryconfig.json');
  let config;

  if (existsSync(configPath)) {
    config = readJSONSync(configPath);
    return config;
  } else {
    return;
  }
}

function getManifest() {
  for (let name of ['system.json', 'module.json']) {
    for (let root of ['public', 'src', 'dist']) {
      const p = join(root, name);
      if (existsSync(p)) {
        return { file: readJSONSync(p), root, name };
      }
    }
  }

  throw Error('Could not find manifest file');
}

/********************/
/*		BUILDING  		*/
/********************/

function build() {
  return spawn('npx', ['vite', 'build'], { stdio: 'inherit', shell: true });
}

function _distWatcher() {
  const publicDirPath = resolve(process.cwd(), 'public');
  const watcher = __watch(['public/**/*.hbs'], { ignoreInitial: false });
  watcher.on('change', async function (file, _stats) {
    console.log(`File ${file} was changed`);
    const partial_file = relative(publicDirPath, file);
    await copy(join('public', partial_file), join('dist', partial_file));
  });
}

function watch() {
  _distWatcher();
  return spawn('npx', ['vite', 'build', '-w'], { stdio: 'inherit', shell: true });
}

function serve() {
  _distWatcher();
  // forward arguments on serves
  const serveArg = process.argv[2];
  let commands = ['vite', 'serve'];
  if (serveArg == 'serve' && process.argv.length > 3) {
    commands = commands.concat(process.argv.slice(3));
  }
  return spawn('npx', commands, { stdio: 'inherit', shell: true });
}

/********************/
/*		LINK		*/
/********************/

/**
 * Link build to User Data folder
 */
async function linkUserData() {
  const _name = basename(resolve('.'));
  const config = readJSONSync('foundryconfig.json');

  let destDir;
  try {
    if (existsSync(resolve('.', 'dist', 'module.json')) || existsSync(resolve('.', 'src', 'module.json'))) {
      destDir = 'modules';
    } else if (existsSync(resolve('.', 'dist', 'system.json')) || existsSync(resolve('.', 'src', 'system.json'))) {
      destDir = 'systems';
    } else {
      throw Error(`Could not find ${blueBright('module.json')} or ${blueBright('system.json')}`);
    }

    let linkDir;
    if (config.dataPath) {
      if (!existsSync(join(config.dataPath, 'Data'))) throw Error('User Data path invalid, no Data directory found');

      linkDir = join(config.dataPath, 'Data', destDir, config.systemName);
    } else {
      throw Error('No User Data path defined in foundryconfig.json');
    }

    if (argv.clean || argv.c) {
      console.log(yellow(`Removing build in ${blueBright(linkDir)}`));

      await remove(linkDir);
    } else if (!existsSync(linkDir)) {
      console.log(green(`Copying build to ${blueBright(linkDir)}`));
      await symlink(resolve('./dist'), linkDir, 'junction');
    }
    return Promise.resolve();
  } catch (err) {
    Promise.reject(err);
  }
}

/*********************/
/*		PACKAGE		 */
/*********************/

/**
 * Package build
 */
async function packageBuild() {
  const manifest = getManifest();

  try {
    // Remove the package dir without doing anything else
    if (argv.clean || argv.c) {
      console.log(yellow('Removing all packaged files'));
      await remove('package');
      return;
    }

    // Ensure there is a directory to hold all the packaged versions
    await ensureDir('package');

    // Initialize the zip file
    const zipName = `${manifest.file.id}-v${manifest.file.version}.zip`;
    const zipFile = createWriteStream(join('package', zipName));
    const zip = archiver('zip', { zlib: { level: 9 } });

    zipFile.on('close', () => {
      console.log(green(zip.pointer() + ' total bytes'));
      console.log(green(`Zip file ${zipName} has been written`));
      return Promise.resolve();
    });

    zip.on('error', err => {
      throw err;
    });

    zip.pipe(zipFile);

    // Add the directory with the final code
    zip.directory('dist/', manifest.file.id);

    zip.finalize();
  } catch (err) {
    Promise.reject(err);
  }
}

/*********************/
/*		PACKAGE		 */
/*********************/

/**
 * Update version and URLs in the manifest JSON
 */
function updateManifest(cb) {
  const packageJson = readJSONSync('package.json');
  const config = getConfig(),
    manifest = getManifest(),
    rawURL = config.rawURL,
    downloadURL = config.downloadURL,
    repoURL = config.repository,
    _manifestRoot = manifest.root;

  if (!config) cb(Error(red('foundryconfig.json not found')));
  if (!manifest) cb(Error(red('Manifest JSON not found')));
  if (!rawURL || !repoURL || !downloadURL) cb(Error(red('Repository URLs not configured in foundryconfig.json')));

  try {
    const version = argv.update || argv.u;

    /* Update version */

    const versionMatch = /^(\d{1,}).(\d{1,}).(\d{1,})$/;
    const currentVersion = manifest.file.version;
    let targetVersion = '';

    if (!version) {
      cb(Error('Missing version number'));
    }

    if (versionMatch.test(version)) {
      targetVersion = version;
    } else {
      targetVersion = currentVersion.replace(versionMatch, (substring, major, minor, _patch) => {
        if (version === 'major') {
          return `${Number(major) + 1}.0.0`;
        } else if (version === 'minor') {
          return `${major}.${Number(minor) + 1}.0`;
        } else if (version === 'patch') {
          return `${major}.${minor}.${Number(minor) + 1}`;
        } else {
          return '';
        }
      });
    }

    if (targetVersion === '') {
      return cb(Error(red('Error: Incorrect version arguments.')));
    }

    if (targetVersion === currentVersion) {
      return cb(Error(red('Error: Target version is identical to current version.')));
    }
    console.log(`Updating version number to '${targetVersion}'`);

    packageJson.version = targetVersion;
    manifest.file.version = targetVersion;

    /* Update URLs */
    const download = `${downloadURL}/v${manifest.file.version}/${manifest.file.id}-v${manifest.file.version}.zip`;
    manifest.file.url = repoURL;
    manifest.file.manifest = `${rawURL}/${manifest.name}`;
    manifest.file.download = download;

    const prettyProjectJson = stringify(manifest.file, { maxLength: 35 });

    writeJSONSync('package.json', packageJson, { spaces: 2 });
    writeFileSync(join(manifest.root, manifest.name), prettyProjectJson, 'utf8');

    return cb();
  } catch (err) {
    cb(err);
  }
}

function gitAdd() {
  return src('package').pipe(add({ args: '--no-all' }));
}

function gitCommit() {
  return src('./*').pipe(
    commit(`v${getManifest().file.version}`, {
      args: '-a',
      disableAppendPaths: true
    })
  );
}

function gitTag() {
  const manifest = getManifest();
  return tag(`v${manifest.file.version}`, `Updated to ${manifest.file.version}`, err => {
    if (err) throw err;
  });
}

const execGit = series(gitAdd, gitCommit, gitTag);

const _build = build;
export { _build as build };
const _watch = watch;
export { _watch as watch };
const _serve = serve;
export { _serve as serve };
export const link = linkUserData;
const _package = packageBuild;
export { _package as package };
export const manifest = updateManifest;
const _git = execGit;
export { _git as git };
export const publish = series(updateManifest, build, packageBuild, execGit);
