// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('./KnowledgeElement');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certifiabl... Remove this comment to see the full error message
class CertifiableProfileForLearningContent {
  resultsByArea: any;
  resultsByCompetence: any;
  skillResults: any;
  constructor({
    targetProfileWithLearningContent,
    knowledgeElements,
    answerAndChallengeIdsByAnswerId
  }: any) {
    this.skillResults = [];
    for (const knowledgeElement of knowledgeElements) {
      const targetedSkill = targetProfileWithLearningContent.findSkill(knowledgeElement.skillId);
      if (targetedSkill) {
        this.skillResults.push(
          new SkillResult({
            skillId: targetedSkill.id,
            tubeId: targetedSkill.tubeId,
            difficulty: targetedSkill.difficulty,
            createdAt: knowledgeElement.createdAt,
            source: knowledgeElement.source,
            status: knowledgeElement.status,
            earnedPix: knowledgeElement.earnedPix,
            answerId: knowledgeElement.answerId,
            assessmentId: knowledgeElement.assessmentId,
            challengeId: answerAndChallengeIdsByAnswerId[knowledgeElement.answerId].challengeId,
          })
        );
      }
    }

    const skillResultsByCompetenceId = {};
    const skillResultsGroupedByTubeId = _.groupBy(this.skillResults, 'tubeId');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
    for (const [tubeId, skillResults] of Object.entries(skillResultsGroupedByTubeId)) {
      const targetedTube = targetProfileWithLearningContent.findTube(tubeId);
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      if (!skillResultsByCompetenceId[targetedTube.competenceId])
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        skillResultsByCompetenceId[targetedTube.competenceId] = [];
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      skillResultsByCompetenceId[targetedTube.competenceId] = [
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        ...skillResultsByCompetenceId[targetedTube.competenceId],
        ...skillResults,
      ];
    }

    this.resultsByCompetence = [];
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
    for (const [competenceId, skillResults] of Object.entries(skillResultsByCompetenceId)) {
      const targetedCompetence = targetProfileWithLearningContent.getCompetence(competenceId);
      this.resultsByCompetence.push(
        new ResultByCompetence({
          competenceId: targetedCompetence.id,
          areaId: targetedCompetence.areaId,
          origin: targetedCompetence.origin,
          skillResults,
        })
      );
    }

    this.resultsByArea = [];
    const resultsByCompetenceGroupedByAreaId = _.groupBy(this.resultsByCompetence, 'areaId');
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
    for (const [areaId, resultsByCompetence] of Object.entries(resultsByCompetenceGroupedByAreaId)) {
      const targetedArea = targetProfileWithLearningContent.getArea(areaId);
      this.resultsByArea.push(
        new ResultByArea({
          areaId: targetedArea.id,
          resultsByCompetence,
        })
      );
    }
  }

  getOrderedCertifiableSkillsByAreaId(excludedOrigins = []) {
    const skillIdsByAreaId = {};
    for (const resultByArea of this.resultsByArea) {
      const certifiableSkillsForArea = this._getCertifiableSkillsForArea(resultByArea, excludedOrigins);
      const certifiableOrderedSkillsInArea = this._orderSkillsByDecreasingDifficulty(certifiableSkillsForArea);
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      skillIdsByAreaId[resultByArea.areaId] = _.map(certifiableOrderedSkillsInArea, 'skillId');
    }

    return skillIdsByAreaId;
  }

  _getCertifiableSkillsForArea(resultByArea: any, excludedOrigins: any) {
    return _.flatMap(resultByArea.resultsByCompetence, (resultByCompetence: any) => {
      if (resultByCompetence.isNotInOrigins(excludedOrigins)) {
        return resultByCompetence.getDirectlyValidatedSkills();
      }
      return [];
    });
  }

  _orderSkillsByDecreasingDifficulty(skills: any) {
    return _(skills).sortBy('difficulty').reverse().value();
  }

  getAlreadyAnsweredChallengeIds() {
    return _(this.skillResults).filter('isDirectlyValidated').map('challengeId').uniq().value();
  }
}

class SkillResult {
  answerId: any;
  assessmentId: any;
  challengeId: any;
  createdAt: any;
  difficulty: any;
  earnedPix: any;
  skillId: any;
  source: any;
  status: any;
  tubeId: any;
  constructor({
    skillId,
    tubeId,
    difficulty,
    createdAt,
    source,
    status,
    earnedPix,
    answerId,
    assessmentId,
    challengeId
  }: any) {
    this.skillId = skillId;
    this.tubeId = tubeId;
    this.difficulty = difficulty;
    this.createdAt = createdAt;
    this.source = source;
    this.status = status;
    this.earnedPix = earnedPix;
    this.answerId = answerId;
    this.assessmentId = assessmentId;
    this.challengeId = challengeId;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isDirectlyValidated() {
    return this.source === KnowledgeElement.SourceType.DIRECT && this.status === KnowledgeElement.StatusType.VALIDATED;
  }
}

class ResultByCompetence {
  areaId: any;
  competenceId: any;
  origin: any;
  skillResults: any;
  constructor({
    competenceId,
    areaId,
    origin,
    skillResults = []
  }: any) {
    this.competenceId = competenceId;
    this.areaId = areaId;
    this.origin = origin;
    this.skillResults = skillResults;
  }

  isNotInOrigins(origins = []) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'includes' does not exist on type '{}'.
    return !origins.includes(this.origin);
  }

  getDirectlyValidatedSkills() {
    return _.filter(this.skillResults, 'isDirectlyValidated');
  }
}

class ResultByArea {
  areaId: any;
  resultsByCompetence: any;
  constructor({
    areaId,
    resultsByCompetence = []
  }: any) {
    this.areaId = areaId;
    this.resultsByCompetence = resultsByCompetence;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertifiableProfileForLearningContent;
