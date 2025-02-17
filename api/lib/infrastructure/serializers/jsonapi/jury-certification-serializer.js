const { Serializer } = require('jsonapi-serializer');

module.exports = {
  serialize(juryCertification) {
    return new Serializer('certifications', {
      transform(juryCertification) {
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
