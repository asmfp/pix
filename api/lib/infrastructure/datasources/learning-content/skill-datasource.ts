// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'datasource... Remove this comment to see the full error message
const datasource = require('./datasource');

const ACTIVE_STATUS = 'actif';
const OPERATIVE_STATUSES = ['actif', 'archivé'];

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = datasource.extend({
  modelName: 'skills',

  async findActive() {
    const skills = await this.list();
    return _.filter(skills, { status: ACTIVE_STATUS });
  },

  async findOperative() {
    const skills = await this.list();
    return _.filter(skills, (skill: any) => _.includes(OPERATIVE_STATUSES, skill.status));
  },

  async findByRecordIds(skillIds: any) {
    const skills = await this.list();
    return skills.filter((skillData: any) => _.includes(skillIds, skillData.id));
  },

  async findOperativeByRecordIds(skillIds: any) {
    const skills = await this.list();
    return skills.filter(
      (skillData: any) => _.includes(OPERATIVE_STATUSES, skillData.status) && _.includes(skillIds, skillData.id)
    );
  },

  async findActiveByTubeId(tubeId: any) {
    const skills = await this.list();
    return _.filter(skills, { status: ACTIVE_STATUS, tubeId });
  },

  async findActiveByCompetenceId(competenceId: any) {
    const skills = await this.list();
    return _.filter(skills, { status: ACTIVE_STATUS, competenceId });
  },

  async findOperativeByCompetenceId(competenceId: any) {
    const skills = await this.list();
    return _.filter(
      skills,
      (skill: any) => skill.competenceId === competenceId && _.includes(OPERATIVE_STATUSES, skill.status)
    );
  },
});
