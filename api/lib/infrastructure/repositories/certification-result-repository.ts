// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationResult = require('../../domain/models/CertificationResult');
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

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findBySessionId({
    sessionId
  }: any) {
    const certificationResultDTOs = await _selectCertificationResults()
      .where('certification-courses.sessionId', sessionId)
      .orderBy('certification-courses.lastName', 'ASC')
      .orderBy('certification-courses.firstName', 'ASC');

    return certificationResultDTOs.map(_toDomain);
  },

  async findByCertificationCandidateIds({
    certificationCandidateIds
  }: any) {
    const certificationResultDTOs = await _selectCertificationResults()
      .join('certification-candidates', function () {
        this.on({ 'certification-candidates.sessionId': 'certification-courses.sessionId' }).andOn({
          'certification-candidates.userId': 'certification-courses.userId',
        });
      })
      .whereIn('certification-candidates.id', certificationCandidateIds)
      .orderBy('certification-courses.lastName', 'ASC')
      .orderBy('certification-courses.firstName', 'ASC');

    return certificationResultDTOs.map(_toDomain);
  },
};

function _selectCertificationResults() {
  return knex
    .select({
      id: 'certification-courses.id',
      firstName: 'certification-courses.firstName',
      lastName: 'certification-courses.lastName',
      birthdate: 'certification-courses.birthdate',
      birthplace: 'certification-courses.birthplace',
      isCancelled: 'certification-courses.isCancelled',
      externalId: 'certification-courses.externalId',
      createdAt: 'certification-courses.createdAt',
      sessionId: 'certification-courses.sessionId',
      pixScore: 'assessment-results.pixScore',
      assessmentResultStatus: 'assessment-results.status',
      commentForOrganization: 'assessment-results.commentForOrganization',
    })
    .select(
      knex.raw(`
        json_agg("competence-marks".* ORDER BY "competence-marks"."competence_code" asc)  as "competenceMarks"`)
    )
    .select(
      knex.raw(`
        json_agg("partner-certifications".*) as "partnerCertifications"`)
    )
    .from('certification-courses')
    .join('assessments', 'assessments.certificationCourseId', 'certification-courses.id')
    .leftJoin('assessment-results', 'assessment-results.assessmentId', 'assessments.id')
    .modify(_filterMostRecentAssessmentResult)
    .leftJoin('competence-marks', 'competence-marks.assessmentResultId', 'assessment-results.id')
    .leftJoin('partner-certifications', function () {
      this.on('partner-certifications.certificationCourseId', '=', 'certification-courses.id').onIn(
        'partner-certifications.partnerKey',
        [
          PIX_EMPLOI_CLEA,
          PIX_EMPLOI_CLEA_V2,
          PIX_DROIT_MAITRE_CERTIF,
          PIX_DROIT_EXPERT_CERTIF,
          PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
          PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
          PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
          PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
          PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
        ]
      );
    })
    .groupBy('certification-courses.id', 'assessments.id', 'assessment-results.id')
    .where('certification-courses.isPublished', true);
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
function _filterMostRecentAssessmentResult(qb: any) {
  return qb.whereNotExists(
    knex
      .select(1)
      .from({ 'last-assessment-results': 'assessment-results' })
      .whereRaw('"last-assessment-results"."assessmentId" = assessments.id')
      .whereRaw('"assessment-results"."createdAt" < "last-assessment-results"."createdAt"')
  );
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(certificationResultDTO: any) {
  return CertificationResult.from({
    certificationResultDTO,
  });
}
