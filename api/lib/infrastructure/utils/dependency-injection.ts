// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'injectDefa... Remove this comment to see the full error message
function injectDefaults(defaults: any, targetFn: any) {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
  return (args: any) => targetFn(Object.assign(Object.create(defaults), args));
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'injectDepe... Remove this comment to see the full error message
function injectDependencies(toBeInjected: any, dependencies: any) {
  return _.mapValues(toBeInjected, _.partial(injectDefaults, dependencies));
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = { injectDependencies, injectDefaults };
