// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(juryCertification: any) {
    return new Serializer('certifications', {
      transform(juryCertification: any) {
        return {
          id: juryCertification.certificationCourseId,
          ...juryCertification,
          competencesWithMark: juryCertification.competenceMarks,
          cleaCertificationStatus: juryCertification.getCleaCertificationStatus(),
          pixPlusDroitMaitreCertificationStatus: juryCertification.getPixPlusDroitMaitreCertificationStatus(),
          pixPlusDroitExpertCertificationStatus: juryCertification.getPixPlusDroitExpertCertificationStatus(),
          pixPlusEduInitieCertificationStatus: juryCertification.getPixPlusEduInitieCertificationStatus(),
          pixPlusEduConfirmeCertificationStatus: juryCertification.getPixPlusEduConfirmeCertificationStatus(),
          pixPlusEduAvanceCertificationStatus: juryCertification.getPixPlusEduAvanceCertificationStatus(),
          pixPlusEduExpertCertificationStatus: juryCertification.getPixPlusEduExpertCertificationStatus(),
        };
      },
      attributes: [
        'sessionId',
        'assessmentId',
        'userId',
        'firstName',
        'lastName',
        'birthdate',
        'sex',
        'birthplace',
        'birthCountry',
        'birthINSEECode',
        'birthPostalCode',
        'createdAt',
        'completedAt',
        'status',
        'isPublished',
        'juryId',
        'pixScore',
        'competencesWithMark',
        'commentForCandidate',
        'commentForOrganization',
        'commentForJury',
        'cleaCertificationStatus',
        'pixPlusDroitMaitreCertificationStatus',
        'pixPlusDroitExpertCertificationStatus',
        'pixPlusEduInitieCertificationStatus',
        'pixPlusEduConfirmeCertificationStatus',
        'pixPlusEduAvanceCertificationStatus',
        'pixPlusEduExpertCertificationStatus',
        'certificationIssueReports',
      ],
      certificationIssueReports: {
        ref: 'id',
        attributes: [
          'category',
          'description',
          'subcategory',
          'questionNumber',
          'isImpactful',
          'resolvedAt',
          'resolution',
        ],
      },
    }).serialize(juryCertification);
  },
};
