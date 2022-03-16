// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'omit'.
const omit = require('lodash/omit');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'get'.
const get = require('lodash/get');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(juryCertificationSummary: any) {
    return new Serializer('jury-certification-summary', {
      transform(juryCertificationSummary: any) {
        const result = omit(juryCertificationSummary, 'certificationIssueReports');
        result.examinerComment = get(juryCertificationSummary, 'certificationIssueReports[0].description');
        result.numberOfCertificationIssueReports = juryCertificationSummary.certificationIssueReports.length;
        result.numberOfCertificationIssueReportsWithRequiredAction =
          juryCertificationSummary.certificationIssueReports.filter(
            (issueReport: any) => issueReport.isImpactful && issueReport.resolvedAt === null
          ).length;
        result.cleaCertificationStatus = juryCertificationSummary.getCleaCertificationStatus();
        result.pixPlusDroitMaitreCertificationStatus =
          juryCertificationSummary.getPixPlusDroitMaitreCertificationStatus();
        result.pixPlusDroitExpertCertificationStatus =
          juryCertificationSummary.getPixPlusDroitExpertCertificationStatus();
        result.pixPlusEduInitieCertificationStatus = juryCertificationSummary.getPixPlusEduInitieCertificationStatus();
        result.pixPlusEduConfirmeCertificationStatus =
          juryCertificationSummary.getPixPlusEduConfirmeCertificationStatus();
        result.pixPlusEduAvanceCertificationStatus = juryCertificationSummary.getPixPlusEduAvanceCertificationStatus();
        result.pixPlusEduExpertCertificationStatus = juryCertificationSummary.getPixPlusEduExpertCertificationStatus();
        return result;
      },
      attributes: [
        'firstName',
        'lastName',
        'status',
        'pixScore',
        'createdAt',
        'completedAt',
        'isPublished',
        'examinerComment',
        'numberOfCertificationIssueReports',
        'numberOfCertificationIssueReportsWithRequiredAction',
        'hasSeenEndTestScreen',
        'isFlaggedAborted',
        'cleaCertificationStatus',
        'pixPlusDroitMaitreCertificationStatus',
        'pixPlusDroitExpertCertificationStatus',
        'pixPlusEduInitieCertificationStatus',
        'pixPlusEduConfirmeCertificationStatus',
        'pixPlusEduAvanceCertificationStatus',
        'pixPlusEduExpertCertificationStatus',
      ],
    }).serialize(juryCertificationSummary);
  },
};
