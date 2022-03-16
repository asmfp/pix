// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DEFAULT_PA... Remove this comment to see the full error message
const DEFAULT_PAGINATION = {
  PAGE: 1,
  PAGE_SIZE: 10,
};

function paginate(data: any, { number = DEFAULT_PAGINATION.PAGE, size = DEFAULT_PAGINATION.PAGE_SIZE } = {}) {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Math'.
  const pageCount = Math.ceil(data.length / size);
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Math'.
  const page = Math.min(Math.max(number, 1), Math.max(pageCount, 1));
  return {
    results: data.slice((page - 1) * size, page * size),
    pagination: {
      page,
      pageSize: size,
      rowCount: data.length,
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Math'.
      pageCount: Math.ceil(data.length / size),
    },
  };
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = { paginate };
