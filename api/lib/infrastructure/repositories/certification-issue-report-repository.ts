// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const CertificationIssueReportBookshelf = require('../orm-models/CertificationIssueReport');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'omit'.
const omit = require('lodash/omit');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async save(certificationIssueReport: any) {
    const newCertificationIssueReport = await new CertificationIssueReportBookshelf(
      omit(certificationIssueReport, ['isImpactful'])
    ).save();
    return bookshelfToDomainConverter.buildDomainObject(CertificationIssueReportBookshelf, newCertificationIssueReport);
  },

  async get(id: any) {
    try {
      const certificationIssueReport = await CertificationIssueReportBookshelf.where({ id }).fetch();
      return bookshelfToDomainConverter.buildDomainObject(CertificationIssueReportBookshelf, certificationIssueReport);
    } catch (err) {
      if (err instanceof CertificationIssueReportBookshelf.NotFoundError) {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        throw new NotFoundError("Le signalement n'existe pas");
      }
      throw err;
    }
  },

  async findByCertificationCourseId(certificationCourseId: any) {
    const certificationIssueReports = await CertificationIssueReportBookshelf.where({
      certificationCourseId,
    }).fetchAll();
    return bookshelfToDomainConverter.buildDomainObjects(CertificationIssueReportBookshelf, certificationIssueReports);
  },

  async delete(id: any) {
    try {
      await CertificationIssueReportBookshelf.where({ id }).destroy({ require: true });
      return true;
    } catch (err) {
      if (err instanceof CertificationIssueReportBookshelf.NoRowsDeletedError) {
        return false;
      }
    }
  },
};
