// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

function progress(campaignParticipationCompleted: any, numberOfKnowledgeElements: any, numberOfSkillsInTargetProfile: any) {
  if (campaignParticipationCompleted) {
    return 1;
  }
  return _.round(numberOfKnowledgeElements / numberOfSkillsInTargetProfile, 3);
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  progress,
};
