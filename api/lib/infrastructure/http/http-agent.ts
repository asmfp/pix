// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
// eslint-disable-next-line no-restricted-modules
const axios = require('axios');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'performanc... Remove this comment to see the full error message
const { performance } = require('perf_hooks');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'logInfoWit... Remove this comment to see the full error message
const { logInfoWithCorrelationIds, logErrorWithCorrelationIds } = require('../monitoring-tools');

class HttpResponse {
  code: any;
  data: any;
  isSuccessful: any;
  constructor({
    code,
    data,
    isSuccessful
  }: any) {
    this.code = code;
    this.data = data;
    this.isSuccessful = isSuccessful;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async post({
    url,
    payload,
    headers
  }: any) {
    const startTime = performance.now();
    let duration = null;
    try {
      const httpResponse = await axios.post(url, payload, {
        headers,
      });
      duration = performance.now() - startTime;
      logInfoWithCorrelationIds({
        metrics: { duration },
        message: `End POST request to ${url} success: ${httpResponse.status}`,
      });

      return new HttpResponse({
        code: httpResponse.status,
        data: httpResponse.data,
        isSuccessful: true,
      });
    } catch (httpErr) {
      duration = performance.now() - startTime;
      let code = null;
      let data;

      if (httpErr.response) {
        code = httpErr.response.status;
        data = httpErr.response.data;
      } else {
        data = httpErr.message;
      }

      logErrorWithCorrelationIds({
        metrics: { duration },
        message: `End POST request to ${url} error: ${code || ''} ${data.toString()}`,
      });

      return new HttpResponse({
        code,
        data,
        isSuccessful: false,
      });
    }
  },
  async get({
    url,
    payload,
    headers
  }: any) {
    const startTime = performance.now();
    let duration = null;
    try {
      const config = { data: payload, headers };
      const httpResponse = await axios.get(url, config);
      duration = performance.now() - startTime;
      logInfoWithCorrelationIds({
        metrics: { duration },
        message: `End GET request to ${url} success: ${httpResponse.status}`,
      });

      return new HttpResponse({
        code: httpResponse.status,
        data: httpResponse.data,
        isSuccessful: true,
      });
    } catch (httpErr) {
      duration = performance.now() - startTime;
      const isSuccessful = false;

      let code;
      let data;

      if (httpErr.response) {
        code = httpErr.response.status;
        data = httpErr.response.data;
      } else {
        code = '500';
        data = null;
      }

      logErrorWithCorrelationIds({
        metrics: { duration },
        message: `End GET request to ${url} error: ${code}`,
      });

      return new HttpResponse({
        code,
        data,
        isSuccessful,
      });
    }
  },
};
