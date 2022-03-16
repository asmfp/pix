// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('./KnowledgeElement');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'calculateP... Remove this comment to see the full error message
const { calculatePixScore } = require('../services/scoring/scoring-service');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MAX_REACHA... Remove this comment to see the full error message
const { MAX_REACHABLE_PIX_BY_COMPETENCE } = require('../constants');
const MAX_PIX_SCORE = MAX_REACHABLE_PIX_BY_COMPETENCE * 16;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Participan... Remove this comment to see the full error message
class ParticipantResultsShared {
  id: any;
  masteryRate: any;
  pixScore: any;
  validatedSkillsCount: any;
  constructor({
    campaignParticipationId,
    knowledgeElements,
    targetedSkillIds
  }: any) {
    const validatedKnowledgeElements = _getValidatedKnowledgeElements(knowledgeElements, targetedSkillIds);

    this.id = campaignParticipationId;
    this.validatedSkillsCount = validatedKnowledgeElements.length;
    this.pixScore = calculatePixScore(validatedKnowledgeElements);
    if (targetedSkillIds.length > 0) {
      this.masteryRate = this.validatedSkillsCount / targetedSkillIds.length;
    } else {
      this.masteryRate = this.pixScore / MAX_PIX_SCORE;
    }
  }
}

function _getValidatedKnowledgeElements(knowledgeElements: any, targetedSkillIds: any) {
  let filteredKnowledgeElements = knowledgeElements.filter((ke: any) => ke.status === KnowledgeElement.StatusType.VALIDATED);
  if (targetedSkillIds.length > 0) {
    filteredKnowledgeElements = filteredKnowledgeElements.filter((ke: any) => targetedSkillIds.includes(ke.skillId));
  }

  return filteredKnowledgeElements;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ParticipantResultsShared;
