// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationAttestation = require('../../domain/models/CertificationAttestation');
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_EMPLOI... Remove this comment to see the full error message
  PIX_EMPLOI_CLEA_V2,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
  PIX_DROIT_MAITRE_CERTIF,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_DROIT_... Remove this comment to see the full error message
  PIX_DROIT_EXPERT_CERTIF,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PIX_EDU_FO... Remove this comment to see the full error message
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../domain/models/Badge').keys;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentResult = require('../../domain/models/AssessmentResult');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../lib/domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'competence... Remove this comment to see the full error message
const competenceTreeRepository = require('./competence-tree-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ResultComp... Remove this comment to see the full error message
const ResultCompetenceTree = require('../../domain/models/ResultCompetenceTree');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceMark = require('../../domain/models/CompetenceMark');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(id: any) {
    const certificationCourseDTO = await _selectCertificationAttestations()
      .where('certification-courses.id', '=', id)
      .groupBy('certification-courses.id', 'sessions.id', 'assessments.id', 'assessment-results.id')
      .first();

    if (!certificationCourseDTO) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new NotFoundError(`There is no certification course with id "${id}"`);
    }

    const competenceTree = await competenceTreeRepository.get();
    const acquiredPartnerCertifications = await _getAcquiredPartnerCertification(certificationCourseDTO.id);

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 3.
    return _toDomain(certificationCourseDTO, competenceTree, acquiredPartnerCertifications);
  },

  async findByDivisionForScoIsManagingStudentsOrganization({
    organizationId,
    division
  }: any) {
    const certificationCourseDTOs = await _selectCertificationAttestations()
      .select({ schoolingRegistrationId: 'schooling-registrations.id' })
      .innerJoin('certification-candidates', function () {
        this.on({ 'certification-candidates.sessionId': 'certification-courses.sessionId' }).andOn({
          'certification-candidates.userId': 'certification-courses.userId',
        });
      })
      .innerJoin(
        'schooling-registrations',
        'schooling-registrations.id',
        'certification-candidates.schoolingRegistrationId'
      )
      .innerJoin('organizations', 'organizations.id', 'schooling-registrations.organizationId')
      .where({
        'schooling-registrations.organizationId': organizationId,
        'schooling-registrations.isDisabled': false,
      })
      .whereRaw('LOWER("schooling-registrations"."division") = ?', division.toLowerCase())
      .whereRaw('"certification-candidates"."userId" = "certification-courses"."userId"')
      .whereRaw('"certification-candidates"."sessionId" = "certification-courses"."sessionId"')
      .modify(_checkOrganizationIsScoIsManagingStudents)
      .groupBy(
        'schooling-registrations.id',
        'certification-courses.id',
        'sessions.id',
        'assessments.id',
        'assessment-results.id'
      )
      .orderBy('certification-courses.createdAt', 'DESC');

    const competenceTree = await competenceTreeRepository.get();

    const mostRecentCertificationsPerSchoolingRegistration =
      _filterMostRecentCertificationCoursePerSchoolingRegistration(certificationCourseDTOs);
    return _(mostRecentCertificationsPerSchoolingRegistration)
      .orderBy(['lastName', 'firstName'], ['asc', 'asc'])
      .map((certificationCourseDTO: any) => {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 3.
        return _toDomain(certificationCourseDTO, competenceTree, []);
      })
      .value();
  },
};

function _selectCertificationAttestations() {
  return knex
    .select({
      id: 'certification-courses.id',
      firstName: 'certification-courses.firstName',
      lastName: 'certification-courses.lastName',
      birthdate: 'certification-courses.birthdate',
      birthplace: 'certification-courses.birthplace',
      isPublished: 'certification-courses.isPublished',
      userId: 'certification-courses.userId',
      date: 'certification-courses.createdAt',
      deliveredAt: 'sessions.publishedAt',
      verificationCode: 'certification-courses.verificationCode',
      certificationCenter: 'sessions.certificationCenter',
      maxReachableLevelOnCertificationDate: 'certification-courses.maxReachableLevelOnCertificationDate',
      pixScore: 'assessment-results.pixScore',
      assessmentResultId: 'assessment-results.id',
      competenceMarks: knex.raw(`
        json_agg(
          json_build_object('score', "competence-marks".score, 'level', "competence-marks".level, 'competence_code', "competence-marks"."competence_code")
          ORDER BY "competence-marks"."competence_code" asc
        )`),
    })
    .from('certification-courses')
    .join('assessments', 'assessments.certificationCourseId', 'certification-courses.id')
    .join('assessment-results', 'assessment-results.assessmentId', 'assessments.id')
    .join('competence-marks', 'competence-marks.assessmentResultId', 'assessment-results.id')
    .join('sessions', 'sessions.id', 'certification-courses.sessionId')
    .modify(_filterMostRecentValidatedAssessmentResult)
    .where('certification-courses.isPublished', true)
    .where('certification-courses.isCancelled', false);
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function _filterMostRecentValidatedAssessmentResult(qb: any) {
  return qb
    .whereNotExists(
      knex
        .select(1)
        .from({ 'last-assessment-results': 'assessment-results' })
        .where('last-assessment-results.status', AssessmentResult.status.VALIDATED)
        .whereRaw('"last-assessment-results"."assessmentId" = assessments.id')
        .whereRaw('"assessment-results"."createdAt" < "last-assessment-results"."createdAt"')
    )
    .where('assessment-results.status', AssessmentResult.status.VALIDATED);
}

function _checkOrganizationIsScoIsManagingStudents(qb: any) {
  return qb.where('organizations.type', 'SCO').where('organizations.isManagingStudents', true);
}

function _filterMostRecentCertificationCoursePerSchoolingRegistration(DTOs: any) {
  const groupedBySchoolingRegistration = _.groupBy(DTOs, 'schoolingRegistrationId');

  const mostRecent = [];
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
  for (const certificationsForOneSchoolingRegistration of Object.values(groupedBySchoolingRegistration)) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'push' does not exist on type '{}'.
    mostRecent.push(certificationsForOneSchoolingRegistration[0]);
  }
  return mostRecent;
}

async function _getAcquiredPartnerCertification(certificationCourseId: any) {
  const handledBadgeKeys = [
    PIX_EMPLOI_CLEA,
    PIX_EMPLOI_CLEA_V2,
    PIX_DROIT_EXPERT_CERTIF,
    PIX_DROIT_MAITRE_CERTIF,
    PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
    PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
    PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
    PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
    PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
  ];
  const partnerCertifications = await knex
    .select('partnerKey', 'temporaryPartnerKey')
    .from('partner-certifications')
    .where({ certificationCourseId, acquired: true })
    .where(function () {
      this.whereIn('partnerKey', handledBadgeKeys).orWhereIn('temporaryPartnerKey', handledBadgeKeys);
    });

  return partnerCertifications;
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(certificationCourseDTO: any, competenceTree: any, acquiredPartnerCertifications: any) {
  const competenceMarks = _.compact(certificationCourseDTO.competenceMarks).map(
    (competenceMark: any) => new CompetenceMark({ ...competenceMark })
  );

  const resultCompetenceTree = ResultCompetenceTree.generateTreeFromCompetenceMarks({
    competenceTree,
    competenceMarks,
    certificationId: certificationCourseDTO.id,
    assessmentResultId: certificationCourseDTO.assessmentResultId,
  });

  return new CertificationAttestation({
    ...certificationCourseDTO,
    resultCompetenceTree,
    acquiredPartnerCertifications,
  });
}
