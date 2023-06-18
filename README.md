Compatible with FoundryVTT 10+.

# Description

# Installation

**System Manifest:** [Lumen system manifest](https://github.com/ghorbey/lumen/releases/latest/download/system.json)

# Usage

# Overriding Sheet Config in a Module

# Contributing

This project is accepting issue reports and code merge requests! See the [CONTRIBUTING.MD](https://github.com/ghorbey/lumen/CONTRIBUTING.md) page for details.

## Translations

If you would like to contribute translations directly to the system, they're written using JSON and are under `public/lang`.

## Running builds

This repo includes a `src` directory with all of its actual code, and it compiles that to a `dist` directory that's ignored by the repo's gitignore.

To build the project, you'll need the current LTS version of [Node.js](https://nodejs.org/en/) (or the current release, if preferred) installed. From there, you can build with the following commands in the root of the repo:

```
npm ci
npm run build
```

There are several additional run commands defined in the scripts section of `package.json`, but the build command will run all relevant Vite tasks. If you would prefer to run the compiler constantly and proxy Foundry, you can instead use `npm run serve` to do the same thing and watch for new changes.

Once the repo has been built, you should symlink the contents of the `dist` directory to your Foundry installation's systems directory using the name `lumen` for the linked directory.

# Licensing

All HTML, CSS, and JS is licensed under the [MIT license](https://github.com/ghorbey/lumen/LICENSE.txt).
