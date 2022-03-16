// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CertifiedP... Remove this comment to see the full error message
  CertifiedProfile,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CertifiedA... Remove this comment to see the full error message
  CertifiedArea,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CertifiedC... Remove this comment to see the full error message
  CertifiedCompetence,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CertifiedT... Remove this comment to see the full error message
  CertifiedTube,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CertifiedS... Remove this comment to see the full error message
  CertifiedSkill,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../domain/read-models/CertifiedProfile');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'skillDatas... Remove this comment to see the full error message
const skillDatasource = require('../datasources/learning-content/skill-datasource');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'tubeDataso... Remove this comment to see the full error message
const tubeDatasource = require('../datasources/learning-content/tube-datasource');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceDatasource = require('../datasources/learning-content/competence-datasource');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'areaDataso... Remove this comment to see the full error message
const areaDatasource = require('../datasources/learning-content/area-datasource');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('./knowledge-element-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceRepository = require('./competence-repository');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(certificationCourseId: any) {
    const certificationDatas = await knex
      .select({
        userId: 'certification-courses.userId',
        createdAt: 'certification-courses.createdAt',
        skillId: 'certification-challenges.associatedSkillId',
      })
      .from('certification-courses')
      .join('certification-challenges', 'certification-challenges.courseId', 'certification-courses.id')
      .where('certification-courses.id', certificationCourseId);

    if (certificationDatas.length === 0) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new NotFoundError(`Test de certification ${certificationCourseId} n'existe pas`);
    }
    const userId = certificationDatas[0].userId;
    const createdAt = certificationDatas[0].createdAt;
    const askedSkillIds = certificationDatas.map((data: any) => data.skillId);

    const knowledgeElements = await knowledgeElementRepository.findUniqByUserId({
      userId,
      limitDate: createdAt,
    });

    const pixCompetences = await competenceRepository.listPixCompetencesOnly();
    const pixCompetenceIds = pixCompetences.map((pixCompetence: any) => pixCompetence.id);
    const isKnowledgeElementValidated = (knowledgeElement: any) => knowledgeElement.status === 'validated';
    const isKnowledgeElementFromPixCompetences = (knowledgeElement: any) => pixCompetenceIds.includes(knowledgeElement.competenceId);
    const skillIds = knowledgeElements
      .filter(
        (knowledgeElement: any) => isKnowledgeElementValidated(knowledgeElement) && isKnowledgeElementFromPixCompetences(knowledgeElement)
      )
      .map((pixKnowledgeElement: any) => pixKnowledgeElement.skillId);

    const certifiedSkills = await _createCertifiedSkills(skillIds, askedSkillIds);
    const certifiedTubes = await _createCertifiedTubes(certifiedSkills);
    const certifiedCompetences = await _createCertifiedCompetences(certifiedTubes);
    const certifiedAreas = await _createCertifiedAreas(certifiedCompetences);

    return new CertifiedProfile({
      id: certificationCourseId,
      userId,
      certifiedAreas,
      certifiedCompetences,
      certifiedTubes,
      certifiedSkills,
    });
  },
};

async function _createCertifiedSkills(skillIds: any, askedSkillIds: any) {
  const learningContentSkills = await skillDatasource.findByRecordIds(skillIds);
  return learningContentSkills.map((learningContentSkill: any) => {
    return new CertifiedSkill({
      id: learningContentSkill.id,
      name: learningContentSkill.name,
      hasBeenAskedInCertif: askedSkillIds.includes(learningContentSkill.id),
      tubeId: learningContentSkill.tubeId,
    });
  });
}

async function _createCertifiedTubes(certifiedSkills: any) {
  const certifiedSkillsByTube = _.groupBy(certifiedSkills, 'tubeId');
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
  const learningContentTubes = await tubeDatasource.findByRecordIds(Object.keys(certifiedSkillsByTube));
  return learningContentTubes.map((learningContentTube: any) => {
    const name = learningContentTube.practicalTitleFrFr;
    return new CertifiedTube({
      id: learningContentTube.id,
      name,
      competenceId: learningContentTube.competenceId,
    });
  });
}

async function _createCertifiedCompetences(certifiedTubes: any) {
  const certifiedTubesByCompetence = _.groupBy(certifiedTubes, 'competenceId');
  const learningContentCompetences = await competenceDatasource.findByRecordIds(
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
    Object.keys(certifiedTubesByCompetence)
  );
  return learningContentCompetences.map((learningContentCompetence: any) => {
    const name = learningContentCompetence.nameFrFr;
    return new CertifiedCompetence({
      id: learningContentCompetence.id,
      name,
      areaId: learningContentCompetence.areaId,
    });
  });
}

async function _createCertifiedAreas(certifiedCompetences: any) {
  const certifiedCompetencesByArea = _.groupBy(certifiedCompetences, 'areaId');
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
  const learningContentAreas = await areaDatasource.findByRecordIds(Object.keys(certifiedCompetencesByArea));
  return learningContentAreas.map((learningContentArea: any) => {
    const name = learningContentArea.titleFrFr;
    return new CertifiedArea({
      id: learningContentArea.id,
      name,
      color: learningContentArea.color,
    });
  });
}
