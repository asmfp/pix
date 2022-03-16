// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'datasource... Remove this comment to see the full error message
const datasource = require('./datasource');

const VALIDATED_CHALLENGE = 'validé';
const OPERATIVE_CHALLENGES = [VALIDATED_CHALLENGE, 'archivé'];
const PROTOTYPE_CHALLENGE = 'Prototype 1';

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = datasource.extend({
  modelName: 'challenges',

  async findOperativeBySkillIds(skillIds: any) {
    const foundInSkillIds = (skillId: any) => _.includes(skillIds, skillId);
    const challenges = await this.findOperative();
    return challenges.filter((challengeData: any) => foundInSkillIds(challengeData.skillId));
  },

  async findValidatedByCompetenceId(competenceId: any) {
    const challenges = await this.findValidated();
    return challenges.filter(
      (challengeData: any) => !_.isEmpty(challengeData.skillId) && _.includes(challengeData.competenceId, competenceId)
    );
  },

  async findOperative() {
    const challenges = await this.list();
    return challenges.filter((challengeData: any) => _.includes(OPERATIVE_CHALLENGES, challengeData.status));
  },

  async findOperativeHavingLocale(locale: any) {
    const operativeChallenges = await this.findOperative();
    return operativeChallenges.filter((challenge: any) => _.includes(challenge.locales, locale));
  },

  async findValidated() {
    const challenges = await this.list();
    return challenges.filter((challengeData: any) => challengeData.status === VALIDATED_CHALLENGE);
  },

  async findValidatedBySkillId(id: any) {
    const validatedChallenges = await this.findValidated();
    return validatedChallenges.filter((challenge: any) => challenge.skillId === id);
  },

  async findValidatedPrototypeBySkillId(id: any) {
    const validatedChallenges = await this.findValidated();
    return validatedChallenges.filter(
      (challenge: any) => challenge.skillId === id && challenge.genealogy === PROTOTYPE_CHALLENGE
    );
  },

  async findFlashCompatible(locale: any) {
    const challenges = await this.list();
    return challenges.filter(
      (challengeData: any) => challengeData.status === VALIDATED_CHALLENGE &&
      challengeData.skillId &&
      _.includes(challengeData.locales, locale) &&
      challengeData.alpha != null &&
      challengeData.delta != null
    );
  },
});
