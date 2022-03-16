// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const PartnerCertificationBookshelf = require('../orm-models/PartnerCertification');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CleaCertif... Remove this comment to see the full error message
const CleaCertificationScoring = require('../../domain/models/CleaCertificationScoring');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceMark = require('../../domain/models/CompetenceMark');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Badge'.
const Badge = require('../../domain/models/Badge');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async buildCleaCertificationScoring({
    certificationCourseId,
    userId,
    reproducibilityRate,
    domainTransaction = DomainTransaction.emptyTransaction(),
    skillRepository
  }: any) {
    const cleaBadgeKey = await _getAcquiredCleaBadgeKey(userId, certificationCourseId, domainTransaction);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    const hasAcquiredBadge = Boolean(cleaBadgeKey);
    if (!hasAcquiredBadge) {
      return CleaCertificationScoring.buildNotEligible({ certificationCourseId });
    }
    const cleaSkills = await _getCleaSkills(cleaBadgeKey, skillRepository);
    const expectedPixByCompetenceForClea = _getexpectedPixByCompetenceForClea(cleaSkills);
    const cleaCompetenceMarks = await _getCleaCompetenceMarks({
      certificationCourseId,
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
      cleaCompetenceIds: Object.keys(expectedPixByCompetenceForClea),
      domainTransaction,
    });

    return new CleaCertificationScoring({
      certificationCourseId,
      hasAcquiredBadge,
      cleaCompetenceMarks,
      expectedPixByCompetenceForClea,
      reproducibilityRate,
      cleaBadgeKey,
    });
  },

  async save({
    partnerCertificationScoring,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: any) {
    const partnerCertificationToSave = new PartnerCertificationBookshelf(
      _adaptModelToDB({
        ...partnerCertificationScoring,
        acquired: partnerCertificationScoring.isAcquired(),
      })
    );

    const exists = await knex
      .select('*')
      .from('partner-certifications')
      .where({
        certificationCourseId: partnerCertificationScoring.certificationCourseId,
        partnerKey: partnerCertificationScoring.partnerKey,
      })
      .orWhere({
        certificationCourseId: partnerCertificationScoring.certificationCourseId,
        temporaryPartnerKey: partnerCertificationScoring.temporaryPartnerKey,
      })
      .first();

    if (exists) {
      return partnerCertificationToSave
        .query(function (qb: any) {
          qb.where({
            certificationCourseId: partnerCertificationScoring.certificationCourseId,
            partnerKey: partnerCertificationScoring.partnerKey,
          }).orWhere({
            certificationCourseId: partnerCertificationScoring.certificationCourseId,
            temporaryPartnerKey: partnerCertificationScoring.temporaryPartnerKey,
          });
        })
        .save(null, { transacting: domainTransaction.knexTransaction, method: 'update' });
    }

    return partnerCertificationToSave.save(null, { transacting: domainTransaction.knexTransaction, method: 'insert' });
  },
};

function _adaptModelToDB({
  certificationCourseId,
  partnerKey,
  temporaryPartnerKey,
  acquired
}: any) {
  return { certificationCourseId, partnerKey, temporaryPartnerKey, acquired };
}

async function _getAcquiredCleaBadgeKey(userId: any, certificationCourseId: any, domainTransaction: any) {
  const badgeAcquisitionQuery = knex('badge-acquisitions')
    .pluck('badges.key')
    .innerJoin('badges', 'badges.id', 'badgeId')
    .innerJoin('certification-courses', 'certification-courses.userId', 'badge-acquisitions.userId')
    .where('badge-acquisitions.userId', userId)
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'keys' does not exist on type 'typeof Bad... Remove this comment to see the full error message
    .whereIn('badges.key', [Badge.keys.PIX_EMPLOI_CLEA, Badge.keys.PIX_EMPLOI_CLEA_V2])
    .where('certification-courses.id', certificationCourseId)
    .where('badge-acquisitions.createdAt', '<', knex.ref('certification-courses.createdAt'))
    .orderBy('badge-acquisitions.createdAt', 'DESC');
  if (domainTransaction.knexTransaction) {
    badgeAcquisitionQuery.transacting(domainTransaction.knexTransaction);
  }
  const [acquiredBadgeKey] = await badgeAcquisitionQuery;
  return acquiredBadgeKey;
}

async function _getCleaCompetenceMarks({
  certificationCourseId,
  cleaCompetenceIds,
  domainTransaction
}: any) {
  const competenceMarksQuery = knex
    .with('rankedAssessmentResults', (qb: any) => {
      _getLatestAssessmentResultIdByCertificationCourseIdQuery(qb, certificationCourseId);
    })
    .from('competence-marks')
    .select('competence-marks.*')
    .join('rankedAssessmentResults', 'rankedAssessmentResults.id', 'competence-marks.assessmentResultId')
    .whereIn('competenceId', cleaCompetenceIds);
  if (domainTransaction.knexTransaction) {
    competenceMarksQuery.transacting(domainTransaction.knexTransaction);
  }
  const competenceMarksRows = await competenceMarksQuery;
  return _.map(competenceMarksRows, (competenceMarksRow: any) => {
    return new CompetenceMark(competenceMarksRow);
  });
}

async function _getLatestAssessmentResultIdByCertificationCourseIdQuery(queryBuilder: any, certificationCourseId: any) {
  return queryBuilder
    .select('assessment-results.id')
    .from('assessments')
    .join('assessment-results', 'assessment-results.assessmentId', 'assessments.id')
    .where('assessments.certificationCourseId', '=', certificationCourseId)
    .orderBy('assessment-results.createdAt', 'DESC')
    .limit(1);
}

async function _getCleaSkills(cleaBadgeKey: any, skillRepository: any) {
  const skillIdPacks = await knex('skill-sets')
    .select('skillIds')
    .join('badges', 'badges.id', 'skill-sets.badgeId')
    .where('badges.key', '=', cleaBadgeKey);

  const cleaSkillIds = _.flatMap(skillIdPacks, 'skillIds');
  return skillRepository.findOperativeByIds(cleaSkillIds);
}

function _getexpectedPixByCompetenceForClea(cleaSkills: any) {
  return _(cleaSkills)
    .groupBy('competenceId')
    .mapValues((skills: any) => _.sumBy(skills, 'pixValue'))
    .value();
}
