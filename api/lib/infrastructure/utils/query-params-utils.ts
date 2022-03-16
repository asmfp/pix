// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = { extractParameters };

// query example : 'filter[organizationId]=4&page[size]=30$page[number]=3&sort=-createdAt,name&include=user'
function extractParameters(query: any) {
  return {
    filter: _extractFilter(query),
    page: _extractPage(query),
    sort: _extractArrayParameter(query, 'sort'),
    include: _extractArrayParameter(query, 'include'),
  };
}

function _extractFilter(query: any) {
  const regex = /filter\[([a-zA-Z]*)\]/;
  return _extractObjectParameter(query, regex);
}

function _extractPage(query: any) {
  const regex = /page\[([a-zA-Z]*)\]/;
  const params = _extractObjectParameter(query, regex);

  return _convertObjectValueToInt(params);
}

function _extractObjectParameter(query: any, regex: any) {
  return _.reduce(
    query,
    (result: any, queryFilterValue: any, queryFilterKey: any) => {
      const parameter = queryFilterKey.match(regex);
      if (parameter && parameter[1]) {
        result[parameter[1]] = queryFilterValue;
      }
      return result;
    },
    {}
  );
}

function _extractArrayParameter(query: any, parameterName: any) {
  return _.has(query, parameterName) ? query[parameterName].split(',') : [];
}

function _convertObjectValueToInt(params: any) {
  return _.mapValues(params, _.toInteger);
}
