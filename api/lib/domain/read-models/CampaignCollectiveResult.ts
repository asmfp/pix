// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignCo... Remove this comment to see the full error message
class CampaignCollectiveResult {
  campaignCompetenceCollectiveResults: any;
  id: any;
  constructor({
    id,
    targetProfile
  }: any = {}) {
    this.id = id;
    const targetedCompetences = _.sortBy(targetProfile.competences, 'index');

    this.campaignCompetenceCollectiveResults = _.map(targetedCompetences, (targetedCompetence: any) => {
      const targetedArea = targetProfile.getAreaOfCompetence(targetedCompetence.id);
      return new CampaignCompetenceCollectiveResult({
        campaignId: id,
        targetedCompetence,
        targetedArea,
      });
    });
  }

  addValidatedSkillCountToCompetences(participantsKECountByCompetenceId: any) {
    _.each(this.campaignCompetenceCollectiveResults, (campaignCompetenceCollectiveResult: any) => {
      const competenceId = campaignCompetenceCollectiveResult.competenceId;
      if (competenceId in participantsKECountByCompetenceId) {
        campaignCompetenceCollectiveResult.addValidatedSkillCount(participantsKECountByCompetenceId[competenceId]);
      }
    });
  }

  finalize(participantCount: any) {
    _.each(this.campaignCompetenceCollectiveResults, (campaignCompetenceCollectiveResult: any) => {
      campaignCompetenceCollectiveResult.finalize(participantCount);
    });
  }
}

class CampaignCompetenceCollectiveResult {
  areaCode: any;
  areaColor: any;
  averageValidatedSkills: any;
  competenceId: any;
  competenceName: any;
  id: any;
  targetedSkillsCount: any;
  validatedSkillCount: any;
  constructor({
    campaignId,
    targetedArea,
    targetedCompetence
  }: any = {}) {
    this.areaCode = targetedCompetence.index.split('.')[0];
    this.competenceId = targetedCompetence.id;
    this.id = `${campaignId}_${this.competenceId}`;
    this.competenceName = targetedCompetence.name;
    this.areaColor = targetedArea.color;
    this.targetedSkillsCount = targetedCompetence.skillCount;
    this.validatedSkillCount = 0;
    this.averageValidatedSkills = 0;
  }

  addValidatedSkillCount(validatedSkillCount: any) {
    this.validatedSkillCount += validatedSkillCount;
  }

  finalize(participantCount: any) {
    if (participantCount) {
      this.averageValidatedSkills = this.validatedSkillCount / participantCount;
    }
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignCollectiveResult;
