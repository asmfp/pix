// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const feedbackController = require('./feedback-controller');

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.register = async (server: any) => {
  server.route([
    {
      method: 'POST',
      path: '/api/feedbacks',
      config: {
        auth: false,
        handler: feedbackController.save,
        tags: ['api'],
      },
    },
  ]);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.name = 'feedbacks-api';
