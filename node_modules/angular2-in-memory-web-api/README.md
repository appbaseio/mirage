# angular2 in-memory-web-api
An in-memory web api for Angular 2 demos and tests.

See usage in the Angular.io
[Server Communication](https://angular.io/docs/ts/latest/guide/server-communication.html) chapter.

# To Do
* add  documentation
* add tests (shameful omission!)

# Build Instructions

Mostly gulp driven.

The following describes steps for updating from one Angular version to the next

>This is essential even when there are no changes of real consequence.
Neglecting to synchronize Angular 2 versions
triggers typescript definition duplication error messages when
compiling your application project.

- `gulp bump` - up the package version number

- update `CHANGELOG.MD` to record the change

- update the dependent version(s) in `package.json`

- `npm install` the new package(s) (make sure they really do install!)<br>
   `npm list --depth=0`

- consider updating typings, install individually/several:
  `npm run typings -- install packagename --ambient --save`

   **NB: Do not add to `npm postinstall` as that screws up consumers!**

- `npm run tsc` to confirm the project compiles w/o error (sanity check)

 -- NO TESTS YET ... BAD --

- `gulp build`
- commit and push

- `npm publish`

- Fix and validate angular.io docs samples

- Add two tags to the release commit with for npmcdn
  - the version number
  - 'latest'
