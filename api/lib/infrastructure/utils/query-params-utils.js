const _ = require('lodash');

function extractFilters(request) {
  return _.reduce(request.query, (result, queryFilterValue, queryFilterKey) => {
    const filter = queryFilterKey.match(/filter\[([a-zA-Z]*)]/);
    if (filter) {
      const field = filter[1];
      if (field) {
        result[field] = queryFilterValue;
      }
    }
    return result;
  }, {});
}

module.exports = {
  extractFilters
};
