// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  checkEventTypes(receivedEvent: any, acceptedEventTypes: any) {
    if (
      !_.some(acceptedEventTypes, (acceptedEventType: any) => {
        return receivedEvent instanceof acceptedEventType;
      })
    ) {
      const acceptedEventNames = acceptedEventTypes.map((acceptedEventType: any) => acceptedEventType.name);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Error'.
      throw new Error(`event must be one of types ${acceptedEventNames.join(', ')}`);
    }
  },
};
