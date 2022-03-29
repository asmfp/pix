const COMPLEMENTARY_CERTIFICATION_TABLE_NAME = 'complementary-certifications';
const COMPLEMENTARY_CERTIFICATION_COURSE_RESULTS_TABLE = 'complementary-certification-course-results';
const COMPLEMENTARY_CERTIFICATION_COURSE_ID_COLUMN = 'complementaryCertificationCourseId';
const COMPLEMENTARY_CERTIFICATION_COURSES_TABLE_NAME = 'complementary-certification-courses';
const CERTIFICATION_COURSE_ID = 'certificationCourseId';
const logger = require('../../lib/infrastructure/logger');
const bluebird = require('bluebird');
const {
  PIX_EMPLOI_CLEA,
  PIX_EMPLOI_CLEA_V2,
  PIX_DROIT_MAITRE_CERTIF,
  PIX_DROIT_EXPERT_CERTIF,
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
} = require('../../lib/domain/models/Badge').keys;

const PIX_PLUS_EDU = 'Pix+ Édu';
const PIX_PLUS_DROIT = 'Pix+ Droit';
const CLEA = 'CléA Numérique';

exports.up = async function (knex) {
  const complementaryCertifications = await knex(COMPLEMENTARY_CERTIFICATION_TABLE_NAME).select('*');

  await knex.schema.table(COMPLEMENTARY_CERTIFICATION_COURSE_RESULTS_TABLE, async (table) => {
    table.increments().primary();
    table
      .bigInteger(COMPLEMENTARY_CERTIFICATION_COURSE_ID_COLUMN)
      .nullable()
      .references('complementary-certification-courses.id');
  });

  const complementaryCertifCourseResults = await _getComplementaryCertifCourseResultsWithoutComplementaryCertifCourse(
    knex
  );

  const missingComplementaryCertifCourses = _buildMissingComplementaryCertificationCourses({
    complementaryCertifCourseResults,
    complementaryCertifications,
  });

  // Ajoute une ligne dans complementary-certification-courses pour chaque partner-certification qui n'en avait pas
  const complementaryCertificationCoursesInserted = await _addMissingComplementaryCertifCourses({
    knex,
    missingComplementaryCertifCourses,
  });

  // Met à jour les complementaryCertificationCourseResults avec l'id du complementaryCertificationCourse associé
  await _updateComplementaryCertifCourseResultsForeignKeys({ complementaryCertificationCoursesInserted, knex });

  await knex.schema.table(COMPLEMENTARY_CERTIFICATION_COURSE_RESULTS_TABLE, async (table) => {
    table.dropColumn(CERTIFICATION_COURSE_ID);
  });
};

function _updateComplementaryCertifCourseResultsForeignKeys({ complementaryCertificationCoursesInserted, knex }) {
  return bluebird.mapSeries(complementaryCertificationCoursesInserted, async ({ id, certificationCourseId }) => {
    await knex(COMPLEMENTARY_CERTIFICATION_COURSE_RESULTS_TABLE)
      .update(COMPLEMENTARY_CERTIFICATION_COURSE_ID_COLUMN, id)
      .where({ certificationCourseId });
  });
}

function _addMissingComplementaryCertifCourses({ missingComplementaryCertifCourses, knex }) {
  return knex
    .batchInsert(COMPLEMENTARY_CERTIFICATION_COURSES_TABLE_NAME, missingComplementaryCertifCourses)
    .returning(['id', CERTIFICATION_COURSE_ID]);
}

function _buildMissingComplementaryCertificationCourses({
  complementaryCertifCourseResults,
  complementaryCertifications,
}) {
  return complementaryCertifCourseResults
    .map(({ certificationCourseId, partnerKey }) => ({
      certificationCourseId,
      complementaryCertificationId: _getComplementaryCertificationId(
        partnerKey,
        certificationCourseId,
        complementaryCertifications
      ),
    }))
    .filter(({ complementaryCertificationId }) => Boolean(complementaryCertificationId));
}

function _getComplementaryCertifCourseResultsWithoutComplementaryCertifCourse(knex) {
  return (
    knex
      .select(CERTIFICATION_COURSE_ID, 'partnerKey')
      .from(COMPLEMENTARY_CERTIFICATION_COURSE_RESULTS_TABLE)
      // eslint-disable-next-line knex/avoid-injections
      .whereRaw(
        `"${CERTIFICATION_COURSE_ID}" not in (select "${CERTIFICATION_COURSE_ID}" from "complementary-certification-courses")`
      )
  );
}

function _getComplementaryCertificationId({ partnerKey, certificationCourseId, complementaryCertifications }) {
  const getIdFromName = (searchName) => complementaryCertifications.find(({ name }) => name === searchName).id;
  switch (partnerKey) {
    case PIX_EMPLOI_CLEA:
      return getIdFromName(CLEA);
    case PIX_EMPLOI_CLEA_V2:
      return getIdFromName(CLEA);
    case PIX_DROIT_EXPERT_CERTIF:
      return getIdFromName(PIX_PLUS_DROIT);
    case PIX_DROIT_MAITRE_CERTIF:
      return getIdFromName(PIX_PLUS_DROIT);
    case PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE:
      return getIdFromName(PIX_PLUS_EDU);
    case PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME:
      return getIdFromName(PIX_PLUS_EDU);
    case PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT:
      return getIdFromName(PIX_PLUS_EDU);
    case PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME:
      return getIdFromName(PIX_PLUS_EDU);
    case PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE:
      return getIdFromName(PIX_PLUS_EDU);
  }

  logger.warn('PartnerCertification with missing badge (certificationId:' + certificationCourseId + ')');
}

exports.down = async function (knex) {
  await knex.schema.table(COMPLEMENTARY_CERTIFICATION_COURSE_RESULTS_TABLE, async (table) => {
    table
      .dropColumn(COMPLEMENTARY_CERTIFICATION_COURSE_ID_COLUMN)
      .nullable()
      .references('complementary-certification-courses.id');
  });
};
