// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationReport = require('../../domain/models/CertificationReport');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCourseBookshelf = require('../orm-models/CertificationCourse');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const { CertificationCourseUpdateError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'toDomain'.
const { toDomain } = require('./certification-course-repository');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findBySessionId(sessionId: any) {
    const results = await CertificationCourseBookshelf.where({ sessionId })
      .query((qb: any) => {
        qb.orderByRaw('LOWER("lastName") asc');
        qb.orderByRaw('LOWER("firstName") asc');
      })
      .fetchAll({
        withRelated: ['certificationIssueReports', 'assessment'],
      });

    const certificationCourses = results.map(toDomain);
    return _.map(certificationCourses, CertificationReport.fromCertificationCourse);
  },

  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  async finalizeAll(certificationReports: any) {
    try {
      await Bookshelf.transaction((trx: any) => {
        const finalizeReport = (certificationReport: any) => _finalize({ certificationReport, transaction: trx });
        return bluebird.mapSeries(certificationReports, finalizeReport);
      });
    } catch (err) {
      throw new CertificationCourseUpdateError('An error occurred while finalizing the session');
    }
  },
};

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
async function _finalize({
  certificationReport,
  transaction = undefined
}: any) {
  const saveOptions = { patch: true, method: 'update' };
  if (transaction) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'transacting' does not exist on type '{ p... Remove this comment to see the full error message
    saveOptions.transacting = transaction;
  }

  await new CertificationCourseBookshelf({ id: certificationReport.certificationCourseId }).save(
    { hasSeenEndTestScreen: certificationReport.hasSeenEndTestScreen },
    saveOptions
  );
}
