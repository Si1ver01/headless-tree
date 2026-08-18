# Delivery

The release gate is `npm ci`, `npm run verify`, `npm pack`, and a clean consumer smoke test. Publish only after the
package name, repository metadata, tag, dependency audit, tarball contents, and GitHub Release are checked.
