// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const Certificate = require('../../domain/read-models/livret-scolaire/Certificate');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getCertificatesByOrganizationUAI(uai: any) {
    const result = await knex
      .select({
        id: 'certification-courses.id',
        firstName: 'schooling-registrations.firstName',
        middleName: 'schooling-registrations.middleName',
        thirdName: 'schooling-registrations.thirdName',
        lastName: 'schooling-registrations.lastName',
        birthdate: 'schooling-registrations.birthdate',
        nationalStudentId: 'schooling-registrations.nationalStudentId',
        date: 'certification-courses.createdAt',
        verificationCode: 'certification-courses.verificationCode',
        deliveredAt: 'sessions.publishedAt',
        certificationCenter: 'sessions.certificationCenter',
        isPublished: 'certification-courses.isPublished',
        status: 'assessment-results.status',
        pixScore: 'assessment-results.pixScore',
        competenceResults: knex.raw(`
        json_agg(
          json_build_object('level', "competence-marks".level, 'competenceId', "competence-marks"."competence_code")
          ORDER BY "competence-marks"."competence_code" asc
        )`),
      })
      .from('certification-courses')
      .innerJoin('schooling-registrations', 'schooling-registrations.userId', 'certification-courses.userId')
      .innerJoin('assessments', 'assessments.certificationCourseId', 'certification-courses.id')
      .innerJoin('assessment-results', 'assessment-results.assessmentId', 'assessments.id')
      .innerJoin('sessions', 'sessions.id', 'certification-courses.sessionId')
      .innerJoin('competence-marks', 'competence-marks.assessmentResultId', 'assessment-results.id')
      .whereNotExists(
        knex
          .select(1)
          .from({ 'last-certification-courses': 'certification-courses' })
          .whereRaw('"last-certification-courses"."userId" = "certification-courses"."userId"')
          .whereRaw('"last-certification-courses"."isCancelled"= false')
          .whereRaw('"certification-courses"."createdAt" < "last-certification-courses"."createdAt"')
      )
      .whereNotExists(
        knex
          .select(1)
          .from({ 'last-assessment-results': 'assessment-results' })
          .whereRaw('"last-assessment-results"."assessmentId" = assessments.id')
          .whereRaw('"assessment-results"."createdAt" < "last-assessment-results"."createdAt"')
      )

      .where({ 'certification-courses.isCancelled': false })
      .where({ 'schooling-registrations.isDisabled': false })
      .where(
        'schooling-registrations.organizationId',
        '=',
        knex.select('id').from('organizations').whereRaw('LOWER("externalId") = LOWER(?)', uai)
      )

      .groupBy(
        'schooling-registrations.id',
        'certification-courses.id',
        'sessions.id',
        'assessments.id',
        'assessment-results.id'
      )

      .orderBy('lastName', 'ASC')
      .orderBy('firstName', 'ASC')
      .orderBy('id', 'ASC');

    return result.map(Certificate.from);
  },
};
