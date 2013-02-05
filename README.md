NPM releaser
============

Helps you with releasing and keeping track of versions of your NPM packages. Built after [zest.releaser](http://pypi.python.org/pypi/zest.releaser).


Installation
------------
sudo npm -g install npm-releaser


Prerequisites
------------
Your version numbers are bound to the [Semantic Versioning](http://semver.org/) scheme. Given that you probably use NPM, this is already the case.


How to use
----------
npm-releaser <command>

Avaiable commands:

- prerelease: picks a new version number, updates package.json, and commits
- release: makes a tag, and does npm publish
- postrelease: picks a new version number, pushes changes
- fullreleaser: prerelease + release + postrelease


Shortcomings
-------------
The current shortcomings are:
- Only understands GIT
- Only understands NPM (are there any others?)
- Bound to [Semantic Versioning](http://semver.org/)
- Several more?
