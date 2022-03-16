// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPr... Remove this comment to see the full error message
class CampaignProfileCompetence {
  areaColor: any;
  estimatedLevel: any;
  id: any;
  index: any;
  name: any;
  pixScore: any;
  constructor({
    id,
    index,
    name,
    pixScore,
    estimatedLevel,
    area
  }: any = {}) {
    this.id = id;
    this.index = index;
    this.name = name;
    this.pixScore = pixScore;
    this.estimatedLevel = estimatedLevel;
    this.areaColor = area && area.color;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignProfileCompetence;
