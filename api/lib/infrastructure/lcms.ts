// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'httpAgent'... Remove this comment to see the full error message
const httpAgent = require('./http/http-agent');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'lcms'.
const { lcms } = require('../config');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getLatestRelease() {
    const response = await httpAgent.get({
      url: lcms.url + '/releases/latest',
      headers: { Authorization: `Bearer ${lcms.apiKey}` },
    });
    return response.data.content;
  },

  async createRelease() {
    const response = await httpAgent.post({
      url: lcms.url + '/releases',
      headers: { Authorization: `Bearer ${lcms.apiKey}` },
    });
    return response.data.content;
  },
};
