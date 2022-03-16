// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
class CompetenceResult {
  areaColor: any;
  areaName: any;
  id: any;
  index: any;
  name: any;
  testedSkillsCount: any;
  totalSkillsCount: any;
  validatedSkillsCount: any;
  constructor({
    id,
    name,
    index,
    areaColor,
    areaName,
    totalSkillsCount,
    testedSkillsCount,
    validatedSkillsCount
  }: any = {}) {
    this.id = id;
    this.name = name;
    this.index = index;
    this.areaColor = areaColor;
    this.areaName = areaName;
    this.totalSkillsCount = totalSkillsCount;
    this.testedSkillsCount = testedSkillsCount;
    this.validatedSkillsCount = validatedSkillsCount;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get masteryPercentage() {
    if (this.totalSkillsCount !== 0) {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Math'.
      return Math.round((this.validatedSkillsCount * 100) / this.totalSkillsCount);
    } else {
      return 0;
    }
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CompetenceResult;
