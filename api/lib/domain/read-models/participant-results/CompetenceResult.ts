// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
class CompetenceResult {
  areaColor: any;
  areaName: any;
  id: any;
  index: any;
  masteryPercentage: any;
  name: any;
  testedSkillsCount: any;
  totalSkillsCount: any;
  validatedSkillsCount: any;
  constructor(competence: any, knowledgeElements: any) {
    const totalSkillsCount = competence.skillIds.length;
    const validatedSkillsCount = knowledgeElements.filter(({
      isValidated
    }: any) => isValidated).length;

    this.id = competence.id;
    this.name = competence.name;
    this.index = competence.index;
    this.areaName = competence.areaName;
    this.areaColor = competence.areaColor;
    this.totalSkillsCount = totalSkillsCount;
    this.testedSkillsCount = knowledgeElements.length;
    this.validatedSkillsCount = validatedSkillsCount;
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Math'.
    this.masteryPercentage = Math.round((validatedSkillsCount / totalSkillsCount) * 100);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CompetenceResult;
