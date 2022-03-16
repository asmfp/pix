// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'settings'.
const settings = require('../config');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'get'.
const { get, set, update } = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'logger'.
const logger = require('../infrastructure/logger');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const requestUtils = require('../infrastructure/utils/request-response-utils');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { AsyncLocalStorage } = require('async_hooks');
const asyncLocalStorage = new AsyncLocalStorage();

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'logInfoWit... Remove this comment to see the full error message
function logInfoWithCorrelationIds(data: any) {
  if (settings.hapi.enableRequestMonitoring) {
    const context = asyncLocalStorage.getStore();
    const request = get(context, 'request');
    logger.info(
      {
        user_id: extractUserIdFromRequest(request),
        request_id: `${get(request, 'info.id', '-')}`,
        ...get(data, 'metrics', {}),
      },
      get(data, 'message', '-')
    );
  } else {
    logger.info(
      {
        ...get(data, 'metrics', {}),
      },
      get(data, 'message', '-')
    );
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'logErrorWi... Remove this comment to see the full error message
function logErrorWithCorrelationIds(data: any) {
  if (settings.hapi.enableRequestMonitoring) {
    const context = asyncLocalStorage.getStore();
    const request = get(context, 'request');
    logger.error(
      {
        user_id: extractUserIdFromRequest(request),
        request_id: `${get(request, 'info.id', '-')}`,
        ...get(data, 'metrics', {}),
      },
      get(data, 'message', '-')
    );
  } else {
    logger.error(get(data, 'message', '-'));
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'extractUse... Remove this comment to see the full error message
function extractUserIdFromRequest(request: any) {
  let userId = get(request, 'auth.credentials.userId');
  if (!userId && get(request, 'headers.authorization')) userId = requestUtils.extractUserIdFromRequest(request);
  return userId || '-';
}

function getInContext(path: any, value: any) {
  const store = asyncLocalStorage.getStore();
  if (!store) return;
  return get(store, path, value);
}

function setInContext(path: any, value: any) {
  const store = asyncLocalStorage.getStore();
  if (!store) return;
  set(store, path, value);
}

function incrementInContext(path: any) {
  const store = asyncLocalStorage.getStore();
  if (!store) return;
  update(store, path, (v: any) => (v ?? 0) + 1);
}

function getContext() {
  return asyncLocalStorage.getStore();
}

function pushInContext(path: any, value: any) {
  const store = asyncLocalStorage.getStore();
  if (!store) return;
  let array = get(store, path);
  if (!array) {
    array = [value];
    set(store, path, array);
  } else {
    array.push(value);
  }
}

function installHapiHook() {
  if (!settings.hapi.enableRequestMonitoring) return;

  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  if (require('@hapi/hapi/package.json').version !== '20.2.1') {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Error'.
    throw new Error('Hapi version changed, please check if patch still works');
  }

  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  const Request = require('@hapi/hapi/lib/request');

  const originalMethod = Request.prototype._execute;

  if (!originalMethod) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Error'.
    throw new Error('Hapi method Request.prototype._execute not found while patch');
  }

  Request.prototype._execute = function (...args: any[]) {
    const request = this;
    const context = { request };
    return asyncLocalStorage.run(context, () => originalMethod.call(request, args));
  };
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  extractUserIdFromRequest,
  getContext,
  getInContext,
  incrementInContext,
  installHapiHook,
  logErrorWithCorrelationIds,
  logInfoWithCorrelationIds,
  pushInContext,
  setInContext,
};
