// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCourseBookshelf = require('../orm-models/CertificationCourse');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const { CertificationCourseNotPublishableError } = require('../../../lib/domain/errors');

async function getAssessmentResultsStatusesBySessionId(id: any) {
  const collection = await CertificationCourseBookshelf.query((qb: any) => {
    qb.innerJoin('assessments', 'assessments.certificationCourseId', 'certification-courses.id');
    qb.innerJoin(
      Bookshelf.knex.raw(
        `"assessment-results" ar ON ar."assessmentId" = "assessments".id
                    and ar."createdAt" = (select max(sar."createdAt") from "assessment-results" sar where sar."assessmentId" = "assessments".id)`
      )
    );
    qb.where({ 'certification-courses.sessionId': id });
  }).fetchAll({ columns: ['status'] });

  return collection.map((obj: any) => obj.attributes.status);
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  async publishCertificationCoursesBySessionId(sessionId: any) {
    const statuses = await getAssessmentResultsStatusesBySessionId(sessionId);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'includes' does not exist on type 'unknow... Remove this comment to see the full error message
    if (statuses.includes('error') || statuses.includes('started')) {
      throw new CertificationCourseNotPublishableError();
    }
    await CertificationCourseBookshelf.where({ sessionId }).save(
      { isPublished: true },
      { method: 'update', require: false }
    );
  },

  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  async unpublishCertificationCoursesBySessionId(sessionId: any) {
    await CertificationCourseBookshelf.where({ sessionId }).save({ isPublished: false }, { method: 'update' });
  },
};
