// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Skill'.
const Skill = require('../../domain/models/Skill');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'skillDatas... Remove this comment to see the full error message
const skillDatasource = require('../datasources/learning-content/skill-datasource');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(skillData: any) {
  return new Skill({
    id: skillData.id,
    name: skillData.name,
    pixValue: skillData.pixValue,
    competenceId: skillData.competenceId,
    tutorialIds: skillData.tutorialIds,
    tubeId: skillData.tubeId,
    version: skillData.version,
  });
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(id: any) {
    try {
      return _toDomain(await skillDatasource.get(id));
    } catch (e) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new NotFoundError('Erreur, compétence introuvable');
    }
  },

  async list() {
    const skillDatas = await skillDatasource.list();
    return skillDatas.map(_toDomain);
  },

  async findActiveByTubeId(tubeId: any) {
    const skillDatas = await skillDatasource.findActiveByTubeId(tubeId);
    return skillDatas.map(_toDomain);
  },

  async findActiveByCompetenceId(competenceId: any) {
    const skillDatas = await skillDatasource.findActiveByCompetenceId(competenceId);
    return skillDatas.map(_toDomain);
  },

  async findOperativeByCompetenceId(competenceId: any) {
    const skillDatas = await skillDatasource.findOperativeByCompetenceId(competenceId);
    return skillDatas.map(_toDomain);
  },

  async findOperativeByIds(skillIds: any) {
    const skillDatas = await skillDatasource.findOperativeByRecordIds(skillIds);
    return skillDatas.map(_toDomain);
  },
};
