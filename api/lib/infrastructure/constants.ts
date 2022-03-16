// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'settings'.
const settings = require('../config');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  CONCURRENCY_HEAVY_OPERATIONS: settings.infra.concurrencyForHeavyOperations,
  CHUNK_SIZE_CAMPAIGN_RESULT_PROCESSING: settings.infra.chunkSizeForCampaignResultProcessing,
  SCHOOLING_REGISTRATION_CHUNK_SIZE: settings.infra.chunkSizeForSchoolingRegistrationDataProcessing,
};
