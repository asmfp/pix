const SkillSetResult = require('./SkillSetResult');

class BadgeResult {
  constructor(badge, participationResults) {
    const { acquiredBadgeIds, knowledgeElements } = participationResults;
    this.id = badge.id;
    this.title = badge.title;
    this.message = badge.message;
    this.altMessage = badge.altMessage;
    this.key = badge.key;
    this.imageUrl = badge.imageUrl;
    this.isAcquired = acquiredBadgeIds.includes(badge.id);
    this.isAlwaysVisible = badge.isAlwaysVisible;

    this.skillSetResults = badge.badgeCompetences.map((competence) =>
      _buildCompetenceResults(competence, knowledgeElements)
    );
  }
}

function _buildCompetenceResults(badgeCompetence, knowledgeElements) {
  const skillIds = badgeCompetence.skillIds;
  const competenceKnowledgeElements = knowledgeElements.filter(({ skillId }) => skillIds.includes(skillId));

  return new SkillSetResult(badgeCompetence, competenceKnowledgeElements);
}

module.exports = BadgeResult;
