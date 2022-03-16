// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SkillSetRe... Remove this comment to see the full error message
const SkillSetResult = require('./SkillSetResult');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'BadgeResul... Remove this comment to see the full error message
class BadgeResult {
  altMessage: any;
  id: any;
  imageUrl: any;
  isAcquired: any;
  isAlwaysVisible: any;
  key: any;
  message: any;
  skillSetResults: any;
  title: any;
  constructor(badge: any, participationResults: any) {
    const { acquiredBadgeIds, knowledgeElements } = participationResults;
    this.id = badge.id;
    this.title = badge.title;
    this.message = badge.message;
    this.altMessage = badge.altMessage;
    this.key = badge.key;
    this.imageUrl = badge.imageUrl;
    this.isAcquired = acquiredBadgeIds.includes(badge.id);
    this.isAlwaysVisible = badge.isAlwaysVisible;

    this.skillSetResults = badge.badgeCompetences.map((competence: any) => _buildCompetenceResults(competence, knowledgeElements)
    );
  }
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function _buildCompetenceResults(badgeCompetence: any, knowledgeElements: any) {
  const skillIds = badgeCompetence.skillIds;
  const competenceKnowledgeElements = knowledgeElements.filter(({
    skillId
  }: any) => skillIds.includes(skillId));

  return new SkillSetResult(badgeCompetence, competenceKnowledgeElements);
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = BadgeResult;
