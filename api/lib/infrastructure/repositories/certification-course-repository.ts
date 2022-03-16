// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const { _ } = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCourseBookshelf = require('../orm-models/CertificationCourse');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const AssessmentBookshelf = require('../orm-models/Assessment');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCourse = require('../../domain/models/CertificationCourse');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationChallengeRepository = require('./certification-challenge-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationIssueReport = require('../../domain/models/CertificationIssueReport');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationCourse = require('../../domain/models/ComplementaryCertificationCourse');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../bookshelf');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async save({
    certificationCourse,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: any) {
    const knexConn = domainTransaction.knexTransaction || Bookshelf.knex;
    const certificationCourseToSaveDTO = _adaptModelToDb(certificationCourse);
    const options = { transacting: domainTransaction.knexTransaction };
    const savedCertificationCourseDTO = await new CertificationCourseBookshelf(certificationCourseToSaveDTO).save(
      null,
      options
    );

    const complementaryCertificationCourses = certificationCourse
      .toDTO()
      .complementaryCertificationCourses.map(({
      complementaryCertificationId
    }: any) => ({
        complementaryCertificationId,
        certificationCourseId: savedCertificationCourseDTO.id,
      }));

    if (!_.isEmpty(complementaryCertificationCourses)) {
      await knexConn('complementary-certification-courses').insert(complementaryCertificationCourses);
    }

    const savedChallenges = await bluebird.mapSeries(
      certificationCourse.toDTO().challenges,
      (certificationChallenge: any) => {
        const certificationChallengeWithCourseId = {
          ...certificationChallenge,
          courseId: savedCertificationCourseDTO.id,
        };
        return certificationChallengeRepository.save({
          certificationChallenge: certificationChallengeWithCourseId,
          domainTransaction,
        });
      }
    );

    const savedCertificationCourse = toDomain(savedCertificationCourseDTO);
    savedCertificationCourse._challenges = savedChallenges;
    return savedCertificationCourse;
  },

  async changeCompletionDate(
    certificationCourseId: any,
    // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'completedAt' implicitly has an 'any' ty... Remove this comment to see the full error message
    completedAt = null,
    domainTransaction = DomainTransaction.emptyTransaction()
  ) {
    const certificationCourseBookshelf = new CertificationCourseBookshelf({ id: certificationCourseId, completedAt });
    const savedCertificationCourse = await certificationCourseBookshelf.save(null, {
      transacting: domainTransaction.knexTransaction,
    });
    return toDomain(savedCertificationCourse);
  },

  async get(id: any) {
    try {
      const certificationCourseBookshelf = await CertificationCourseBookshelf.where({ id }).fetch({
        withRelated: ['assessment', 'challenges', 'certificationIssueReports', 'complementaryCertificationCourses'],
      });
      return toDomain(certificationCourseBookshelf);
    } catch (bookshelfError) {
      if (bookshelfError instanceof CertificationCourseBookshelf.NotFoundError) {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        throw new NotFoundError(`Certification course of id ${id} does not exist.`);
      }
      throw bookshelfError;
    }
  },

  async getCreationDate(id: any) {
    const row = await knex('certification-courses').select('createdAt').where({ id }).first();
    if (!row) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new NotFoundError(`Certification course of id ${id} does not exist.`);
    }

    return row.createdAt;
  },

  async findOneCertificationCourseByUserIdAndSessionId({
    userId,
    sessionId,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: any) {
    const certificationCourse = await CertificationCourseBookshelf.where({ userId, sessionId })
      .orderBy('createdAt', 'desc')
      .fetch({
        require: false,
        withRelated: ['assessment', 'challenges'],
        transacting: domainTransaction.knexTransaction,
      });
    return toDomain(certificationCourse);
  },

  async update(certificationCourse: any) {
    const certificationCourseData = _pickUpdatableProperties(certificationCourse);
    const certificationCourseBookshelf = new CertificationCourseBookshelf(certificationCourseData);
    try {
      const certificationCourse = await certificationCourseBookshelf.save();
      return toDomain(certificationCourse);
    } catch (err) {
      if (err instanceof CertificationCourseBookshelf.NoRowsUpdatedError) {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        throw new NotFoundError(`No rows updated for certification course of id ${certificationCourse.getId()}.`);
      }
      throw err;
    }
  },

  async isVerificationCodeAvailable(verificationCode: any) {
    const exist = await knex('certification-courses')
      .select('id')
      .whereRaw('UPPER(??)=?', ['verificationCode', verificationCode.toUpperCase()])
      .first();

    return !exist;
  },

  async findCertificationCoursesBySessionId({
    sessionId
  }: any) {
    const bookshelfCertificationCourses = await CertificationCourseBookshelf.where({ sessionId }).fetchAll();
    return bookshelfCertificationCourses.map(toDomain);
  },

  toDomain,
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'toDomain'.
function toDomain(bookshelfCertificationCourse: any) {
  if (!bookshelfCertificationCourse) {
    return null;
  }

  const assessment = bookshelfToDomainConverter.buildDomainObject(
    AssessmentBookshelf,
    bookshelfCertificationCourse.related('assessment')
  );
  const dbCertificationCourse = bookshelfCertificationCourse.toJSON();
  return new CertificationCourse({
    assessment,
    challenges: bookshelfCertificationCourse.related('challenges').toJSON(),
    certificationIssueReports: bookshelfCertificationCourse
      .related('certificationIssueReports')
      .toJSON()
      .map((json: any) => new CertificationIssueReport(json)),
    complementaryCertificationCourses: bookshelfCertificationCourse
      .related('complementaryCertificationCourses')
      .toJSON()
      .map((json: any) => new ComplementaryCertificationCourse(json)),
    ..._.pick(dbCertificationCourse, [
      'id',
      'userId',
      'createdAt',
      'completedAt',
      'firstName',
      'lastName',
      'birthplace',
      'birthdate',
      'sex',
      'birthPostalCode',
      'birthINSEECode',
      'birthCountry',
      'sessionId',
      'externalId',
      'isPublished',
      'isV2Certification',
      'hasSeenEndTestScreen',
      'isCancelled',
      'maxReachableLevelOnCertificationDate',
      'verificationCode',
      'abortReason',
    ]),
  });
}

function _adaptModelToDb(certificationCourse: any) {
  return _.omit(certificationCourse.toDTO(), [
    'complementaryCertificationCourses',
    'certificationIssueReports',
    'assessment',
    'challenges',
    'createdAt',
  ]);
}

function _pickUpdatableProperties(certificationCourse: any) {
  return _.pick(certificationCourse.toDTO(), [
    'id',
    'isCancelled',
    'birthdate',
    'birthplace',
    'firstName',
    'lastName',
    'sex',
    'birthCountry',
    'birthINSEECode',
    'birthPostalCode',
    'abortReason',
    'completedAt',
  ]);
}
