// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ForbiddenA... Remove this comment to see the full error message
const { ForbiddenAccess, ChallengeNotAskedError, CertificationEndedBySupervisorError } = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Examiner'.
const Examiner = require('../models/Examiner');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'KnowledgeE... Remove this comment to see the full error message
const KnowledgeElement = require('../models/KnowledgeElement');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../infrastructure/logger');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const dateUtils = require('../../infrastructure/utils/date-utils');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function correctAnswerThenUpdateAssessment({
  answer,
  userId,
  locale,
  answerRepository,
  assessmentRepository,
  challengeRepository,
  scorecardService,
  competenceRepository,
  competenceEvaluationRepository,
  skillRepository,
  targetProfileRepository,
  knowledgeElementRepository,
  flashAssessmentResultRepository,
  flashAlgorithmService,
  algorithmDataFetcherService
}: any = {}) {
  const assessment = await assessmentRepository.get(answer.assessmentId);
  if (assessment.userId !== userId) {
    throw new ForbiddenAccess('User is not allowed to add an answer for this assessment.');
  }
  if (assessment.isEndedBySupervisor()) {
    throw new CertificationEndedBySupervisorError();
  }
  if (assessment.lastChallengeId && assessment.lastChallengeId != answer.challengeId) {
    throw new ChallengeNotAskedError();
  }

  const challenge = await challengeRepository.get(answer.challengeId);
  const correctedAnswer = _evaluateAnswer({ challenge, answer, assessment });
  const now = dateUtils.getNowDate();
  const lastQuestionDate = assessment.lastQuestionDate || now;
  correctedAnswer.setTimeSpentFrom({ now, lastQuestionDate });

  let scorecardBeforeAnswer = null;
  if (correctedAnswer.result.isOK() && assessment.hasKnowledgeElements()) {
    scorecardBeforeAnswer = await scorecardService.computeScorecard({
      userId,
      competenceId: challenge.competenceId,
      competenceRepository,
      competenceEvaluationRepository,
      knowledgeElementRepository,
      locale,
    });
  }

  const knowledgeElementsFromAnswer = await _getKnowledgeElements({
    assessment,
    answer: correctedAnswer,
    challenge,
    skillRepository,
    targetProfileRepository,
    knowledgeElementRepository,
  });

  let answerSaved = await answerRepository.saveWithKnowledgeElements(correctedAnswer, knowledgeElementsFromAnswer);

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'length' does not exist on type 'unknown'... Remove this comment to see the full error message
  if (assessment.hasKnowledgeElements() && knowledgeElementsFromAnswer.length === 0) {
    const context = {
      assessmentId: assessment.id,
      assessmentType: assessment.type,
      answerId: answerSaved.id,
      assessmentImproving: assessment.isImproving,
      challengeId: challenge.id,
      userId,
    };
    logger.warn(context, 'Answer saved without knowledge element');
  }

  answerSaved = await _addLevelUpInformation({
    answerSaved,
    scorecardService,
    userId,
    competenceId: challenge.competenceId,
    competenceRepository,
    competenceEvaluationRepository,
    knowledgeElementRepository,
    scorecardBeforeAnswer,
    locale,
  });

  if (assessment.isFlash()) {
    const flashData = await algorithmDataFetcherService.fetchForFlashLevelEstimation({
      assessment,
      answerRepository,
      challengeRepository,
    });

    const { estimatedLevel, errorRate } = flashAlgorithmService.getEstimatedLevelAndErrorRate(flashData);

    await flashAssessmentResultRepository.save({
      answerId: answerSaved.id,
      estimatedLevel,
      errorRate,
    });
  }
  return answerSaved;
};

function _evaluateAnswer({
  challenge,
  answer,
  assessment
}: any) {
  const examiner = new Examiner({ validator: challenge.validator });
  return examiner.evaluate({
    answer,
    challengeFormat: challenge.format,
    isCertificationEvaluation: assessment.isCertification(),
  });
}

async function _getKnowledgeElements({
  assessment,
  answer,
  challenge,
  skillRepository,
  targetProfileRepository,
  knowledgeElementRepository
}: any) {
  if (!assessment.hasKnowledgeElements()) {
    return [];
  }

  const knowledgeElements = await knowledgeElementRepository.findUniqByUserIdAndAssessmentId({
    userId: assessment.userId,
    assessmentId: assessment.id,
  });
  let targetSkills;
  if (assessment.isCompetenceEvaluation()) {
    targetSkills = await skillRepository.findActiveByCompetenceId(assessment.competenceId);
  }
  if (assessment.isForCampaign()) {
    const targetProfile = await targetProfileRepository.getByCampaignParticipationId(
      assessment.campaignParticipationId
    );
    targetSkills = targetProfile.skills;
  }
  return KnowledgeElement.createKnowledgeElementsForAnswer({
    answer,
    challenge,
    previouslyFailedSkills: _getSkillsFilteredByStatus(
      knowledgeElements,
      targetSkills,
      KnowledgeElement.StatusType.INVALIDATED
    ),
    previouslyValidatedSkills: _getSkillsFilteredByStatus(
      knowledgeElements,
      targetSkills,
      KnowledgeElement.StatusType.VALIDATED
    ),
    targetSkills,
    userId: assessment.userId,
  });
}

function _getSkillsFilteredByStatus(knowledgeElements: any, targetSkills: any, status: any) {
  return knowledgeElements
    .filter((knowledgeElement: any) => knowledgeElement.status === status)
    .map((knowledgeElement: any) => knowledgeElement.skillId)
    .map((skillId: any) => targetSkills.find((skill: any) => skill.id === skillId));
}

async function _addLevelUpInformation({
  answerSaved,
  scorecardService,
  userId,
  competenceId,
  competenceRepository,
  competenceEvaluationRepository,
  knowledgeElementRepository,
  scorecardBeforeAnswer,
  locale
}: any) {
  answerSaved.levelup = {};

  if (!scorecardBeforeAnswer) {
    return answerSaved;
  }

  const scorecardAfterAnswer = await scorecardService.computeScorecard({
    userId,
    competenceId,
    competenceRepository,
    competenceEvaluationRepository,
    knowledgeElementRepository,
    locale,
  });

  if (scorecardBeforeAnswer.level < scorecardAfterAnswer.level) {
    answerSaved.levelup = {
      id: answerSaved.id,
      competenceName: scorecardAfterAnswer.name,
      level: scorecardAfterAnswer.level,
    };
  }
  return answerSaved;
}
