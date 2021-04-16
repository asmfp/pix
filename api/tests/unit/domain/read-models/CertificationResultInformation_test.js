const { expect } = require('../../../test-helper');
const CertificationResultInformation = require('../../../../lib/domain/read-models/CertificationResultInformation');
const GeneralCertificationInformation = require('../../../../lib/domain/read-models/GeneralCertificationInformation');
const AssessmentResult = require('../../../../lib/domain/models/AssessmentResult');
const cleaCertificationStatusRepository = require('../../../../lib/infrastructure/repositories/clea-certification-status-repository');

describe('Unit | Domain | Read-Models | CertificationResultInformation', () => {

  describe('#from', () => {

    it('should return an instance of CertificationResultInformation', () => {
      // given
      const generalCertificationInformation = new GeneralCertificationInformation({
        certificationCourseId: 123,
        sessionId: 1000,
        createdAt: new Date('2020-01-30T12:00:00Z'),
        completedAt: new Date('2020-01-30T13:30:00Z'),
        isPublished: false,
        isV2Certification: true,
        firstName: 'Lili',
        lastName: 'Delamarche',
        birthdate: new Date('1999-01-01T10:00:00Z'),
        birthplace: 'Paris',
        certificationIssueReports: [],
      });
      const assessmentResult = new AssessmentResult({
        id: 11,
        assessmentId: 124,
        status: 'validated',
        commentForCandidate: null,
        commentForOrganization: null,
        commentForJury: null,
        createdAt: new Date('2020-01-01T10:00:00Z'),
        emitter: 'PIX_ALGO',
        juryId: 1,
        pixScore: 555,
        competenceMarks: [],
      });
      const cleaCertificationStatus = cleaCertificationStatusRepository.statuses.NOT_PASSED;

      // when
      const certificationResultInformation = CertificationResultInformation.from({
        generalCertificationInformation,
        assessmentResult,
        cleaCertificationStatus,
      });

      // then
      const expectedCertificationResultInformation = {
        ...generalCertificationInformation,
        status: assessmentResult.status,
        assessmentId: assessmentResult.assessmentId,
        commentForCandidate: assessmentResult.commentForCandidate,
        commentForOrganization: assessmentResult.commentForOrganization,
        commentForJury: assessmentResult.commentForJury,
        juryId: assessmentResult.juryId,
        pixScore: assessmentResult.pixScore,
        competenceMarks: assessmentResult.competenceMarks,
        cleaCertificationStatus,
      };
      expect(certificationResultInformation).to.be.instanceOf(CertificationResultInformation);
      expect(certificationResultInformation).to.deep.equal(expectedCertificationResultInformation);
    });
  });
});