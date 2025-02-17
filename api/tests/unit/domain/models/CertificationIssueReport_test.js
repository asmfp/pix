const { expect, domainBuilder } = require('../../../test-helper');
const CertificationIssueReport = require('../../../../lib/domain/models/CertificationIssueReport');
const {
  CertificationIssueReportCategories,
  CertificationIssueReportSubcategories,
} = require('../../../../lib/domain/models/CertificationIssueReportCategory');
const {
  InvalidCertificationIssueReportForSaving,
  DeprecatedCertificationIssueReportSubcategoryError,
  DeprecatedCertificationIssueReportCategoryError,
} = require('../../../../lib/domain/errors');

const MISSING_VALUE = null;
const EMPTY_VALUE = '';
const WHITESPACES_VALUE = '  ';
const UNDEFINED_VALUE = undefined;

describe('Unit | Domain | Models | CertificationIssueReport', function () {
  describe('#create', function () {
    context('CATEGORY: OTHER', function () {
      let certificationIssueReportDTO;

      beforeEach(function () {
        certificationIssueReportDTO = {
          certificationCourseId: 123,
          category: CertificationIssueReportCategories.OTHER,
          description: 'Une description obligatoire',
        };
      });

      it('should create an OTHER CertificationIssueReport', function () {
        expect(CertificationIssueReport.create(certificationIssueReportDTO)).to.be.an.instanceOf(
          CertificationIssueReport
        );
      });

      // eslint-disable-next-line mocha/no-setup-in-describe
      [MISSING_VALUE, EMPTY_VALUE, UNDEFINED_VALUE, WHITESPACES_VALUE].forEach((emptyValue) => {
        it(`should throw an InvalidCertificationIssueReportForSaving when description is of value ${emptyValue}`, function () {
          // when
          expect(() =>
            CertificationIssueReport.create({ ...certificationIssueReportDTO, description: emptyValue })
          ).to.throw(InvalidCertificationIssueReportForSaving);
        });
      });

      // eslint-disable-next-line mocha/no-setup-in-describe
      [MISSING_VALUE, EMPTY_VALUE, UNDEFINED_VALUE].forEach((emptyValue) => {
        it(`should create an OTHER CertificationIssueReport when subcategory is empty with value ${emptyValue}`, function () {
          // when
          expect(
            CertificationIssueReport.create({ ...certificationIssueReportDTO, subcategory: emptyValue })
          ).to.be.an.instanceOf(CertificationIssueReport);
        });
      });
    });
    context('CATEGORY: NON_BLOCKING_TECHNICAL_ISSUE', function () {
      let certificationIssueReportDTO;

      beforeEach(function () {
        certificationIssueReportDTO = {
          certificationCourseId: 123,
          category: CertificationIssueReportCategories.NON_BLOCKING_TECHNICAL_ISSUE,
          description: 'Une description obligatoire',
        };
      });

      it('should create a NON_BLOCKING_TECHNICAL_ISSUE CertificationIssueReport', function () {
        expect(CertificationIssueReport.create(certificationIssueReportDTO)).to.be.an.instanceOf(
          CertificationIssueReport
        );
      });

      // eslint-disable-next-line mocha/no-setup-in-describe
      [MISSING_VALUE, EMPTY_VALUE, UNDEFINED_VALUE, WHITESPACES_VALUE].forEach((emptyValue) => {
        it(`should throw an InvalidCertificationIssueReportForSaving when description is of value ${emptyValue}`, function () {
          // when
          expect(() =>
            CertificationIssueReport.create({ ...certificationIssueReportDTO, description: emptyValue })
          ).to.throw(InvalidCertificationIssueReportForSaving);
        });
      });

      // eslint-disable-next-line mocha/no-setup-in-describe
      [MISSING_VALUE, EMPTY_VALUE, UNDEFINED_VALUE].forEach((emptyValue) => {
        it(`should create a NON_BLOCKING_TECHNICAL_ISSUE CertificationIssueReport when subcategory is empty with value ${emptyValue}`, function () {
          // when
          expect(
            CertificationIssueReport.create({ ...certificationIssueReportDTO, subcategory: emptyValue })
          ).to.be.an.instanceOf(CertificationIssueReport);
        });
      });
    });

    context('CATEGORY: NON_BLOCKING_CANDIDATE_ISSUE', function () {
      let certificationIssueReportDTO;

      beforeEach(function () {
        certificationIssueReportDTO = {
          certificationCourseId: 123,
          category: CertificationIssueReportCategories.NON_BLOCKING_CANDIDATE_ISSUE,
          description: 'Une description obligatoire',
        };
      });

      it('should create a NON_BLOCKING_CANDIDATE_ISSUE CertificationIssueReport', function () {
        expect(CertificationIssueReport.create(certificationIssueReportDTO)).to.be.an.instanceOf(
          CertificationIssueReport
        );
      });

      // eslint-disable-next-line mocha/no-setup-in-describe
      [MISSING_VALUE, EMPTY_VALUE, UNDEFINED_VALUE, WHITESPACES_VALUE].forEach((emptyValue) => {
        it(`should throw an InvalidCertificationIssueReportForSaving when description is of value "${emptyValue}"`, function () {
          // when
          expect(() =>
            CertificationIssueReport.create({ ...certificationIssueReportDTO, description: emptyValue })
          ).to.throw(InvalidCertificationIssueReportForSaving);
        });
      });

      // eslint-disable-next-line mocha/no-setup-in-describe
      [MISSING_VALUE, EMPTY_VALUE, UNDEFINED_VALUE].forEach((emptyValue) => {
        it(`should create a NON_BLOCKING_CANDIDATE_ISSUE CertificationIssueReport when subcategory is empty with value "${emptyValue}"`, function () {
          // when
          expect(
            CertificationIssueReport.create({ ...certificationIssueReportDTO, subcategory: emptyValue })
          ).to.be.an.instanceOf(CertificationIssueReport);
        });
      });
    });

    context('CATEGORY: LATE_OR_LEAVING', function () {
      let certificationIssueReportDTO;

      beforeEach(function () {
        certificationIssueReportDTO = {
          certificationCourseId: 123,
          category: CertificationIssueReportCategories.LATE_OR_LEAVING,
          description: 'Une description obligatoire',
          subcategory: CertificationIssueReportSubcategories.LEFT_EXAM_ROOM,
        };
      });

      it('should create a LATE_OR_LEAVING CertificationIssueReport of category', function () {
        expect(CertificationIssueReport.create(certificationIssueReportDTO)).to.be.an.instanceOf(
          CertificationIssueReport
        );
      });

      // eslint-disable-next-line mocha/no-setup-in-describe
      [MISSING_VALUE, EMPTY_VALUE, UNDEFINED_VALUE, WHITESPACES_VALUE].forEach((emptyValue) => {
        it(`should throw an InvalidCertificationIssueReportForSaving when description is of value ${emptyValue}`, function () {
          // when
          expect(() =>
            CertificationIssueReport.create({ ...certificationIssueReportDTO, description: emptyValue })
          ).to.throw(InvalidCertificationIssueReportForSaving);
        });
      });

      // Test dynamically all subcategories
      // eslint-disable-next-line mocha/no-setup-in-describe
      [...Object.values(CertificationIssueReportSubcategories)].forEach((subcategory) => {
        if (
          [
            CertificationIssueReportSubcategories.LEFT_EXAM_ROOM,
            CertificationIssueReportSubcategories.SIGNATURE_ISSUE,
          ].includes(subcategory)
        ) {
          it(`should create a LATE_OR_LEAVING CertificationIssueReport when subcategory is of value ${subcategory}`, function () {
            // when
            expect(
              CertificationIssueReport.create({ ...certificationIssueReportDTO, subcategory })
            ).to.be.an.instanceOf(CertificationIssueReport);
          });
        } else {
          it(`should throw an InvalidCertificationIssueReportForSaving when subcategory is ${subcategory}`, function () {
            // when
            expect(() => CertificationIssueReport.create({ ...certificationIssueReportDTO, subcategory })).to.throw(
              InvalidCertificationIssueReportForSaving
            );
          });
        }
      });
    });

    context('CATEGORY: CANDIDATE_INFORMATIONS_CHANGES', function () {
      let certificationIssueReportDTO;

      beforeEach(function () {
        certificationIssueReportDTO = {
          certificationCourseId: 123,
          category: CertificationIssueReportCategories.CANDIDATE_INFORMATIONS_CHANGES,
          description: 'Une description obligatoire',
          subcategory: CertificationIssueReportSubcategories.NAME_OR_BIRTHDATE,
        };
      });

      it('should create a CANDIDATE_INFORMATIONS_CHANGES CertificationIssueReport', function () {
        expect(CertificationIssueReport.create(certificationIssueReportDTO)).to.be.an.instanceOf(
          CertificationIssueReport
        );
      });

      // eslint-disable-next-line mocha/no-setup-in-describe
      [MISSING_VALUE, EMPTY_VALUE, UNDEFINED_VALUE, WHITESPACES_VALUE].forEach((emptyValue) => {
        it(`should throw an InvalidCertificationIssueReportForSaving when description is of value ${emptyValue}`, function () {
          // when
          expect(() =>
            CertificationIssueReport.create({ ...certificationIssueReportDTO, description: emptyValue })
          ).to.throw(InvalidCertificationIssueReportForSaving);
        });
      });

      // Test dynamically all subcategories
      // eslint-disable-next-line mocha/no-setup-in-describe
      [...Object.values(CertificationIssueReportSubcategories)].forEach((subcategory) => {
        if (
          [
            CertificationIssueReportSubcategories.NAME_OR_BIRTHDATE,
            CertificationIssueReportSubcategories.EXTRA_TIME_PERCENTAGE,
          ].includes(subcategory)
        ) {
          it(`should create a CANDIDATE_INFORMATIONS_CHANGES CertificationIssueReport when subcategory is of value ${subcategory}`, function () {
            // when
            expect(
              CertificationIssueReport.create({ ...certificationIssueReportDTO, subcategory })
            ).to.be.an.instanceOf(CertificationIssueReport);
          });
        } else {
          it(`should throw an InvalidCertificationIssueReportForSaving when subcategory is ${subcategory}`, function () {
            // when
            expect(() => CertificationIssueReport.create({ ...certificationIssueReportDTO, subcategory })).to.throw(
              InvalidCertificationIssueReportForSaving
            );
          });
        }
      });
    });

    context('CATEGORY: IN_CHALLENGE', function () {
      let certificationIssueReportDTO;

      beforeEach(function () {
        certificationIssueReportDTO = {
          certificationCourseId: 123,
          category: CertificationIssueReportCategories.IN_CHALLENGE,
          subcategory: CertificationIssueReportSubcategories.IMAGE_NOT_DISPLAYING,
          questionNumber: 5,
        };
      });

      it('should create an IN_CHALLENGE CertificationIssueReport', function () {
        expect(CertificationIssueReport.create(certificationIssueReportDTO)).to.be.an.instanceOf(
          CertificationIssueReport
        );
      });

      // Test dynamically all subcategories
      // eslint-disable-next-line mocha/no-setup-in-describe
      [...Object.values(CertificationIssueReportSubcategories)].forEach((subcategory) => {
        if (
          [
            CertificationIssueReportSubcategories.IMAGE_NOT_DISPLAYING,
            CertificationIssueReportSubcategories.EMBED_NOT_WORKING,
            CertificationIssueReportSubcategories.FILE_NOT_OPENING,
            CertificationIssueReportSubcategories.WEBSITE_UNAVAILABLE,
            CertificationIssueReportSubcategories.WEBSITE_BLOCKED,
            CertificationIssueReportSubcategories.EXTRA_TIME_EXCEEDED,
            CertificationIssueReportSubcategories.SOFTWARE_NOT_WORKING,
            CertificationIssueReportSubcategories.UNINTENTIONAL_FOCUS_OUT,
          ].includes(subcategory)
        ) {
          it(`should create an IN_CHALLENGE CertificationIssueReport when subcategory is of value ${subcategory}`, function () {
            // when
            expect(
              CertificationIssueReport.create({
                ...certificationIssueReportDTO,
                subcategory,
                description: subcategory === CertificationIssueReportSubcategories.OTHER ? 'salut' : null,
              })
            ).to.be.an.instanceOf(CertificationIssueReport);
          });
        } else if (
          [
            CertificationIssueReportSubcategories.LINK_NOT_WORKING,
            CertificationIssueReportSubcategories.OTHER,
          ].includes(subcategory)
        ) {
          it(`should throw a deprecated error when using subcategory ${subcategory}`, function () {
            // when
            const createIssueReport = () =>
              CertificationIssueReport.create({
                ...certificationIssueReportDTO,
                category: CertificationIssueReportCategories.IN_CHALLENGE,
                subcategory: CertificationIssueReportSubcategories.LINK_NOT_WORKING,
              });

            // then
            expect(createIssueReport).to.throw(DeprecatedCertificationIssueReportSubcategoryError);
          });
        } else {
          it(`should throw an InvalidCertificationIssueReportForSaving when subcategory is ${subcategory}`, function () {
            // when
            expect(() => CertificationIssueReport.create({ ...certificationIssueReportDTO, subcategory })).to.throw(
              InvalidCertificationIssueReportForSaving
            );
          });
        }
      });

      // eslint-disable-next-line mocha/no-setup-in-describe
      [MISSING_VALUE, EMPTY_VALUE, UNDEFINED_VALUE].forEach((emptyValue) => {
        it(`should throw an InvalidCertificationIssueReportForSaving when questionNumber is empty with value ${emptyValue}`, function () {
          // when
          expect(() =>
            CertificationIssueReport.create({ ...certificationIssueReportDTO, questionNumber: emptyValue })
          ).to.throw(InvalidCertificationIssueReportForSaving);
        });
      });

      it('should throw an InvalidCertificationIssueReportForSaving when questionNumber is over 500', function () {
        // when
        expect(() => CertificationIssueReport.create({ ...certificationIssueReportDTO, questionNumber: 501 })).to.throw(
          InvalidCertificationIssueReportForSaving
        );
      });

      it('should throw an InvalidCertificationIssueReportForSaving when questionNumber is under 1', function () {
        // when
        expect(() => CertificationIssueReport.create({ ...certificationIssueReportDTO, questionNumber: 0 })).to.throw(
          InvalidCertificationIssueReportForSaving
        );
      });
    });

    context('CATEGORY: FRAUD', function () {
      it('should be valid', function () {
        const certificationIssueReportDTO = {
          certificationCourseId: 123,
          category: CertificationIssueReportCategories.FRAUD,
        };

        expect(() => CertificationIssueReport.create(certificationIssueReportDTO)).not.to.throw();
      });
    });

    context('CATEGORY: TECHNICAL_PROBLEM', function () {
      let certificationIssueReportDTO;

      beforeEach(function () {
        certificationIssueReportDTO = {
          certificationCourseId: 123,
          category: CertificationIssueReportCategories.TECHNICAL_PROBLEM,
          description: 'Une description obligatoire',
        };
      });

      it('should throw DeprecatedCertificationIssueReportCategoryError error', function () {
        expect(() => CertificationIssueReport.create(certificationIssueReportDTO)).to.throw(
          DeprecatedCertificationIssueReportCategoryError
        );
      });

      // eslint-disable-next-line mocha/no-setup-in-describe
      [MISSING_VALUE, EMPTY_VALUE, UNDEFINED_VALUE, WHITESPACES_VALUE].forEach((emptyValue) => {
        it(`should throw an InvalidCertificationIssueReportForSaving when description is of value ${emptyValue}`, function () {
          // when
          expect(() =>
            CertificationIssueReport.create({ ...certificationIssueReportDTO, description: emptyValue })
          ).to.throw(InvalidCertificationIssueReportForSaving);
        });
      });
    });

    context(
      'Adds isImpactful boolean to certif issue report when the category or subcategory is impactful',
      function () {
        // eslint-disable-next-line mocha/no-setup-in-describe
        [
          { certificationCourseId: 42, category: 'OTHER', subcategory: undefined, description: 'toto' },
          {
            certificationCourseId: 42,
            category: 'CANDIDATE_INFORMATIONS_CHANGES',
            subcategory: 'NAME_OR_BIRTHDATE',
            description: 'toto',
          },
          {
            certificationCourseId: 42,
            category: 'LATE_OR_LEAVING',
            subcategory: 'LEFT_EXAM_ROOM',
            description: 'toto',
          },
          { certificationCourseId: 42, category: 'FRAUD' },
          { certificationCourseId: 42, category: 'IN_CHALLENGE', subcategory: 'WEBSITE_BLOCKED', questionNumber: 42 },
          {
            certificationCourseId: 42,
            category: 'IN_CHALLENGE',
            subcategory: 'WEBSITE_UNAVAILABLE',
            questionNumber: 42,
          },
          { certificationCourseId: 42, category: 'IN_CHALLENGE', subcategory: 'FILE_NOT_OPENING', questionNumber: 42 },
          { certificationCourseId: 42, category: 'IN_CHALLENGE', subcategory: 'LINK_NOT_WORKING', questionNumber: 42 },
          {
            certificationCourseId: 42,
            category: 'IN_CHALLENGE',
            subcategory: 'IMAGE_NOT_DISPLAYING',
            questionNumber: 42,
          },
          { certificationCourseId: 42, category: 'IN_CHALLENGE', subcategory: 'EMBED_NOT_WORKING', questionNumber: 42 },
          {
            certificationCourseId: 42,
            category: 'IN_CHALLENGE',
            subcategory: 'EXTRA_TIME_EXCEEDED',
            questionNumber: 42,
          },
          {
            certificationCourseId: 42,
            category: 'IN_CHALLENGE',
            subcategory: 'SOFTWARE_NOT_WORKING',
            questionNumber: 42,
          },
          { certificationCourseId: 42, category: 'TECHNICAL_PROBLEM', description: 'toto' },
        ].forEach((certificationIssueReportDTO) => {
          it(`for ${certificationIssueReportDTO.category} ${
            certificationIssueReportDTO.subcategory ? certificationIssueReportDTO.subcategory : ''
          } should tag certificationIssueReport with isImpactful to true`, function () {
            expect(new CertificationIssueReport({ ...certificationIssueReportDTO }).isImpactful).to.be.true;
          });
        });

        // eslint-disable-next-line mocha/no-setup-in-describe
        [
          {
            certificationCourseId: 42,
            category: 'CANDIDATE_INFORMATIONS_CHANGES',
            subcategory: 'EXTRA_TIME_PERCENTAGE',
            description: 'toto',
          },
          { certificationCourseId: 42, category: 'LATE_OR_LEAVING', subcategory: 'SIGNATURE_ISSUE' },
          { certificationCourseId: 42, category: 'CONNECTION_OR_END_SCREEN' },
        ].forEach((certificationIssueReportDTO) => {
          it(`for ${certificationIssueReportDTO.category} ${
            certificationIssueReportDTO.subcategory ? certificationIssueReportDTO.subcategory : ''
          } should tag certificationIssueReport with isImpactful to false`, function () {
            expect(new CertificationIssueReport({ ...certificationIssueReportDTO }).isImpactful).to.be.false;
          });
        });
      }
    );
  });

  describe('#isResolved', function () {
    it('returns false when the certification issue report is not resolved', function () {
      // given
      const certificationIssueReport = domainBuilder.buildCertificationIssueReport({
        resolvedAt: null,
      });

      // when
      const isResolved = certificationIssueReport.isResolved();

      // then
      expect(isResolved).to.be.false;
    });

    it('returns true when the certification issue report is resolved', function () {
      // given
      const certificationIssueReport = domainBuilder.buildCertificationIssueReport({
        resolvedAt: new Date(),
      });

      // when
      const isResolved = certificationIssueReport.isResolved();

      // then
      expect(isResolved).to.be.true;
    });
  });
  describe('#resolve', function () {
    it('Sets the issue report as resolved', function () {
      // given
      const certificationIssueReport = domainBuilder.buildCertificationIssueReport({
        resolvedAt: null,
      });

      // when
      certificationIssueReport.resolve('RESOLVED');

      // then
      expect(certificationIssueReport.resolvedAt).not.to.be.null;
      expect(certificationIssueReport.resolution).to.equal('RESOLVED');
    });
  });
});
