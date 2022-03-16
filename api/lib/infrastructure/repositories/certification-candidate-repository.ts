// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'normalize'... Remove this comment to see the full error message
const { normalize } = require('../utils/string-utils');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const CertificationCandidateBookshelf = require('../orm-models/CertificationCandidate');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../../infrastructure/utils/bookshelf-to-domain-converter');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PGSQL_UNIQ... Remove this comment to see the full error message
const { PGSQL_UNIQUE_CONSTRAINT_VIOLATION_ERROR } = require('../../../db/pgsql-errors');
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
  NotFoundError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationCandidateCreationOrUpdateError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
  CertificationCandidateMultipleUserLinksWithinSessionError,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCandidate = require('../../domain/models/CertificationCandidate');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertification = require('../../domain/models/ComplementaryCertification');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  async linkToUser({
    id,
    userId
  }: any) {
    try {
      const certificationCandidateBookshelf = new CertificationCandidateBookshelf({ id });
      await certificationCandidateBookshelf.save({ userId }, { patch: true, method: 'update' });
    } catch (bookshelfError) {
      if (bookshelfError.code === PGSQL_UNIQUE_CONSTRAINT_VIOLATION_ERROR) {
        throw new CertificationCandidateMultipleUserLinksWithinSessionError(
          'A user cannot be linked to several certification candidates within the same session'
        );
      }
      throw new CertificationCandidateCreationOrUpdateError(
        'An error occurred while linking the certification candidate to a user'
      );
    }
  },

  async saveInSession({
    certificationCandidate,
    sessionId,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: any) {
    const certificationCandidateDataToSave = _adaptModelToDb(certificationCandidate);

    try {
      const insertCertificationCandidateQuery = knex('certification-candidates')
        .insert({ ...certificationCandidateDataToSave, sessionId })
        .returning('*');

      if (domainTransaction.knexTransaction) {
        insertCertificationCandidateQuery.transacting(domainTransaction.knexTransaction);
      }

      const [addedCertificationCandidate] = await insertCertificationCandidateQuery;

      if (!_.isEmpty(certificationCandidate.complementaryCertifications)) {
        const complementaryCertificationSubscriptionsToSave = certificationCandidate.complementaryCertifications.map(
          (complementaryCertification: any) => {
            return {
              complementaryCertificationId: complementaryCertification.id,
              certificationCandidateId: addedCertificationCandidate.id,
            };
          }
        );

        const insertComplementaryCertificationSubscriptionQuery = knex(
          'complementary-certification-subscriptions'
        ).insert(complementaryCertificationSubscriptionsToSave);

        if (domainTransaction.knexTransaction) {
          insertComplementaryCertificationSubscriptionQuery.transacting(domainTransaction.knexTransaction);
        }

        await insertComplementaryCertificationSubscriptionQuery;
      }

      return new CertificationCandidate(addedCertificationCandidate);
    } catch (error) {
      throw new CertificationCandidateCreationOrUpdateError(
        'An error occurred while saving the certification candidate in a session'
      );
    }
  },

  async delete(certificationCandidateId: any) {
    await knex.transaction(async (trx: any) => {
      await trx('complementary-certification-subscriptions').where({ certificationCandidateId }).del();
      return trx('certification-candidates').where({ id: certificationCandidateId }).del();
    });

    return true;
  },

  async isNotLinked(certificationCandidateId: any) {
    const notLinkedCandidate = await CertificationCandidateBookshelf.where({
      id: certificationCandidateId,
      userId: null,
    }).fetch({ require: false, columns: ['id'] });

    return !!notLinkedCandidate;
  },

  async getBySessionIdAndUserId({
    sessionId,
    userId
  }: any) {
    const certificationCandidate = await knex
      .select('certification-candidates.*')
      .select({ complementaryCertifications: knex.raw(`json_agg("complementary-certifications".*)`) })
      .from('certification-candidates')
      .leftJoin(
        'complementary-certification-subscriptions',
        'certification-candidates.id',
        'complementary-certification-subscriptions.certificationCandidateId'
      )
      .leftJoin(
        'complementary-certifications',
        'complementary-certification-subscriptions.complementaryCertificationId',
        'complementary-certifications.id'
      )
      .where({ sessionId, userId })
      .groupBy('certification-candidates.id')
      .first();
    return certificationCandidate ? _toDomain(certificationCandidate) : undefined;
  },

  async findBySessionId(sessionId: any) {
    const results = await knex
      .select('certification-candidates.*')
      .select({ complementaryCertifications: knex.raw(`json_agg("complementary-certifications".*)`) })
      .from('certification-candidates')
      .where({ 'certification-candidates.sessionId': sessionId })
      .leftJoin(
        'complementary-certification-subscriptions',
        'certification-candidates.id',
        'complementary-certification-subscriptions.certificationCandidateId'
      )
      .leftJoin(
        'complementary-certifications',
        'complementary-certification-subscriptions.complementaryCertificationId',
        'complementary-certifications.id'
      )
      .groupBy('certification-candidates.id')
      .orderByRaw('LOWER("certification-candidates"."lastName") asc')
      .orderByRaw('LOWER("certification-candidates"."firstName") asc');
    return results.map(_toDomain);
  },

  async findBySessionIdAndPersonalInfo({
    sessionId,
    firstName,
    lastName,
    birthdate
  }: any) {
    const results = await CertificationCandidateBookshelf.where({ sessionId, birthdate }).fetchAll();
    const certificationCandidates = bookshelfToDomainConverter.buildDomainObjects(
      CertificationCandidateBookshelf,
      results
    );
    const normalizedInputNames = {
      lastName: normalize(lastName),
      firstName: normalize(firstName),
    };
    return _.filter(certificationCandidates, (certificationCandidate: any) => {
      const certificationCandidateNormalizedNames = {
        lastName: normalize(certificationCandidate.lastName),
        firstName: normalize(certificationCandidate.firstName),
      };
      return _.isEqual(normalizedInputNames, certificationCandidateNormalizedNames);
    });
  },

  findOneBySessionIdAndUserId({
    sessionId,
    userId
  }: any) {
    return CertificationCandidateBookshelf.where({ sessionId, userId })
      .fetchAll()
      .then((results: any) => bookshelfToDomainConverter.buildDomainObjects(CertificationCandidateBookshelf, results)[0]);
  },

  async doesLinkedCertificationCandidateInSessionExist({
    sessionId
  }: any) {
    const anyLinkedCandidateInSession = await CertificationCandidateBookshelf.query({
      where: { sessionId },
      whereNotNull: 'userId',
    }).fetch({ require: false, columns: 'id' });

    return anyLinkedCandidateInSession !== null;
  },

  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  async update(certificationCandidate: any) {
    const result = await knex('certification-candidates')
      .where({ id: certificationCandidate.id })
      .update({ authorizedToStart: certificationCandidate.authorizedToStart });

    if (result === 0) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new NotFoundError('Aucun candidat trouvé');
    }
  },

  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  async deleteBySessionId({
    sessionId
  }: any) {
    await knex('complementary-certification-subscriptions')
      .whereIn('certificationCandidateId', knex.select('id').from('certification-candidates').where({ sessionId }))
      .del();

    await knex('certification-candidates').where({ sessionId }).del();
  },

  async getWithComplementaryCertifications(id: any) {
    const candidateData = await knex('certification-candidates')
      .select('certification-candidates.*')
      .select({ complementaryCertifications: knex.raw('json_agg("complementary-certifications".*)') })
      .leftJoin(
        'complementary-certification-subscriptions',
        'complementary-certification-subscriptions.certificationCandidateId',
        'certification-candidates.id'
      )
      .leftJoin(
        'complementary-certifications',
        'complementary-certifications.id',
        'complementary-certification-subscriptions.complementaryCertificationId'
      )
      .where('certification-candidates.id', id)
      .groupBy('certification-candidates.id')
      .first();
    return _toDomain(candidateData);
  },
};

function _adaptModelToDb(certificationCandidateToSave: any) {
  return _.omit(certificationCandidateToSave, [
    'createdAt',
    'certificationCourse',
    'complementaryCertifications',
    'userId',
  ]);
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(candidateData: any) {
  const complementaryCertifications = candidateData.complementaryCertifications
    .filter((certificationData: any) => certificationData !== null)
    .map((certification: any) => new ComplementaryCertification(certification));

  return new CertificationCandidate({ ...candidateData, complementaryCertifications });
}
