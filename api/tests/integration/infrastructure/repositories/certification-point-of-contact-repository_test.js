const { databaseBuilder, expect, domainBuilder, catchErr } = require('../../../test-helper');
const CertificationCenter = require('../../../../lib/domain/models/CertificationCenter');
const certificationPointOfContactRepository = require('../../../../lib/infrastructure/repositories/certification-point-of-contact-repository');
const { NotFoundError } = require('../../../../lib/domain/errors');

describe('Integration | Repository | CertificationPointOfContact', function () {
  describe('#get', function () {
    it('should throw NotFoundError when point of contact does not exist', async function () {
      // when
      const error = await catchErr(certificationPointOfContactRepository.get)(123);

      // then
      expect(error).to.be.instanceOf(NotFoundError);
      expect(error.message).to.equal("Le référent de certification 123 n'existe pas.");
    });

    it('should return a CertificationPointOfContact', async function () {
      // given
      databaseBuilder.factory.buildUser({
        id: 456,
        firstName: 'Jean',
        lastName: 'Acajou',
        email: 'jean.acajou@example.net',
        pixCertifTermsOfServiceAccepted: true,
      });
      databaseBuilder.factory.buildUser();
      await databaseBuilder.commit();

      // when
      const certificationPointOfContact = await certificationPointOfContactRepository.get(456);

      // then
      const expectedCertificationPointOfContact = domainBuilder.buildCertificationPointOfContact({
        id: 456,
        firstName: 'Jean',
        lastName: 'Acajou',
        email: 'jean.acajou@example.net',
        pixCertifTermsOfServiceAccepted: true,
        allowedCertificationCenterAccesses: [],
      });
      expect(expectedCertificationPointOfContact).to.deepEqualInstance(certificationPointOfContact);
    });

    it('should return CertificationPointOfContact with isRelatedOrganizationManagingStudents as true when the certification center is related to an organization that manages students', async function () {
      // given
      databaseBuilder.factory.buildCertificationCenter({
        id: 123,
        name: 'Centre des papys gâteux',
        type: CertificationCenter.types.PRO,
        externalId: 'ABC123',
      });
      databaseBuilder.factory.buildOrganization({
        id: 753,
        externalId: 'ABC123',
        isManagingStudents: true,
      });
      databaseBuilder.factory.buildUser({
        id: 456,
        firstName: 'Jean',
        lastName: 'Acajou',
        email: 'jean.acajou@example.net',
        pixCertifTermsOfServiceAccepted: true,
      });
      databaseBuilder.factory.buildCertificationCenterMembership({
        certificationCenterId: 123,
        userId: 456,
      });
      await databaseBuilder.commit();

      // when
      const certificationPointOfContact = await certificationPointOfContactRepository.get(456);

      // then
      const expectedAllowedCertificationCenterAccess = domainBuilder.buildAllowedCertificationCenterAccess({
        id: 123,
        name: 'Centre des papys gâteux',
        externalId: 'ABC123',
        type: CertificationCenter.types.PRO,
        isRelatedToManagingStudentsOrganization: true,
        relatedOrganizationTags: [],
        habilitations: [],
      });
      const expectedCertificationPointOfContact = domainBuilder.buildCertificationPointOfContact({
        id: 456,
        firstName: 'Jean',
        lastName: 'Acajou',
        email: 'jean.acajou@example.net',
        pixCertifTermsOfServiceAccepted: true,
        allowedCertificationCenterAccesses: [expectedAllowedCertificationCenterAccess],
      });
      expect(expectedCertificationPointOfContact).to.deepEqualInstance(certificationPointOfContact);
    });

    describe('when user is linked to many certification centers', function () {
      it('should return actives and allowed certification center accesses of the CertificationPointOfContact', async function () {
        // given
        const now = new Date();
        databaseBuilder.factory.buildCertificationCenter({
          id: 1,
          name: 'Centre de certif sans orga reliée',
          type: CertificationCenter.types.PRO,
          externalId: 'Centre1',
        });
        databaseBuilder.factory.buildCertificationCenter({
          id: 2,
          name: 'Centre de certif reliée à une orga sans tags',
          type: CertificationCenter.types.PRO,
          externalId: 'Centre2',
        });
        databaseBuilder.factory.buildOrganization({
          externalId: 'Centre2',
          isManagingStudents: true,
        });
        databaseBuilder.factory.buildCertificationCenter({
          id: 3,
          name: 'Centre de certif reliée à une orga avec 1 tag',
          type: CertificationCenter.types.SUP,
          externalId: 'Centre3',
        });
        databaseBuilder.factory.buildOrganization({
          id: 3,
          externalId: 'Centre3',
          isManagingStudents: false,
        });
        databaseBuilder.factory.buildTag({ id: 3, name: 'premier tag' });
        databaseBuilder.factory.buildOrganizationTag({ organizationId: 3, tagId: 3 });
        databaseBuilder.factory.buildCertificationCenter({
          id: 4,
          name: 'Centre de certif reliée à une orga avec 2 tags',
          type: CertificationCenter.types.SCO,
          externalId: 'Centre4',
        });
        databaseBuilder.factory.buildOrganization({
          id: 4,
          externalId: 'Centre4',
          isManagingStudents: false,
        });
        databaseBuilder.factory.buildTag({ id: 4, name: 'deuxieme tag' });
        databaseBuilder.factory.buildTag({ id: 5, name: 'troisieme tag' });
        databaseBuilder.factory.buildOrganizationTag({ organizationId: 4, tagId: 4 });
        databaseBuilder.factory.buildOrganizationTag({ organizationId: 4, tagId: 5 });
        databaseBuilder.factory.buildUser({
          id: 123,
          firstName: 'Jean',
          lastName: 'Acajou',
          email: 'jean.acajou@example.net',
          pixCertifTermsOfServiceAccepted: true,
        });
        databaseBuilder.factory.buildCertificationCenterMembership({
          certificationCenterId: 1,
          userId: 123,
        });
        databaseBuilder.factory.buildCertificationCenterMembership({
          certificationCenterId: 2,
          userId: 123,
        });
        databaseBuilder.factory.buildCertificationCenterMembership({
          certificationCenterId: 3,
          userId: 123,
        });
        databaseBuilder.factory.buildCertificationCenterMembership({
          certificationCenterId: 4,
          userId: 123,
          disabledAt: now,
        });
        await databaseBuilder.commit();

        // when
        const certificationPointOfContact = await certificationPointOfContactRepository.get(123);

        // then
        const expectedFirstAllowedCertificationCenterAccess = domainBuilder.buildAllowedCertificationCenterAccess({
          id: 1,
          name: 'Centre de certif sans orga reliée',
          externalId: 'Centre1',
          type: CertificationCenter.types.PRO,
          isRelatedToManagingStudentsOrganization: false,
          relatedOrganizationTags: [],
          habilitations: [],
        });
        const expectedSecondAllowedCertificationCenterAccess = domainBuilder.buildAllowedCertificationCenterAccess({
          id: 2,
          name: 'Centre de certif reliée à une orga sans tags',
          externalId: 'Centre2',
          type: CertificationCenter.types.PRO,
          isRelatedToManagingStudentsOrganization: true,
          relatedOrganizationTags: [],
          habilitations: [],
        });
        const expectedThirdAllowedCertificationCenterAccess = domainBuilder.buildAllowedCertificationCenterAccess({
          id: 3,
          name: 'Centre de certif reliée à une orga avec 1 tag',
          externalId: 'Centre3',
          type: CertificationCenter.types.SUP,
          isRelatedToManagingStudentsOrganization: false,
          relatedOrganizationTags: ['premier tag'],
          habilitations: [],
        });
        const expectedCertificationPointOfContact = domainBuilder.buildCertificationPointOfContact({
          id: 123,
          firstName: 'Jean',
          lastName: 'Acajou',
          email: 'jean.acajou@example.net',
          pixCertifTermsOfServiceAccepted: true,
          allowedCertificationCenterAccesses: [
            expectedFirstAllowedCertificationCenterAccess,
            expectedSecondAllowedCertificationCenterAccess,
            expectedThirdAllowedCertificationCenterAccess,
          ],
        });
        expect(expectedCertificationPointOfContact).to.deepEqualInstance(certificationPointOfContact);
      });
    });

    it('should return all the certification center habilitations', async function () {
      // given
      databaseBuilder.factory.buildComplementaryCertification({ id: 1, name: 'Certif comp 1' });
      databaseBuilder.factory.buildComplementaryCertification({ id: 2, name: 'Certif comp 2' });
      databaseBuilder.factory.buildComplementaryCertification({ id: 3, name: 'Certif comp 3' });
      databaseBuilder.factory.buildCertificationCenter({
        id: 1,
        name: 'Centre de certif sans orga reliée',
        type: CertificationCenter.types.PRO,
        externalId: 'Centre1',
      });
      databaseBuilder.factory.buildComplementaryCertificationHabilitation({
        certificationCenterId: 1,
        complementaryCertificationId: 1,
      });
      databaseBuilder.factory.buildComplementaryCertificationHabilitation({
        certificationCenterId: 1,
        complementaryCertificationId: 2,
      });
      databaseBuilder.factory.buildCertificationCenter({
        id: 2,
        name: 'Centre de certif reliée à une orga sans tags',
        type: CertificationCenter.types.PRO,
        externalId: 'Centre2',
      });
      databaseBuilder.factory.buildComplementaryCertificationHabilitation({
        certificationCenterId: 2,
        complementaryCertificationId: 3,
      });
      databaseBuilder.factory.buildUser({
        id: 123,
        firstName: 'Jean',
        lastName: 'Acajou',
        email: 'jean.acajou@example.net',
        pixCertifTermsOfServiceAccepted: true,
      });
      databaseBuilder.factory.buildCertificationCenterMembership({
        certificationCenterId: 1,
        userId: 123,
      });
      databaseBuilder.factory.buildCertificationCenterMembership({
        certificationCenterId: 2,
        userId: 123,
      });
      await databaseBuilder.commit();

      // when
      const certificationPointOfContact = await certificationPointOfContactRepository.get(123);

      // then
      const expectedFirstAllowedCertificationCenterAccess = domainBuilder.buildAllowedCertificationCenterAccess({
        id: 1,
        name: 'Centre de certif sans orga reliée',
        externalId: 'Centre1',
        type: CertificationCenter.types.PRO,
        isRelatedToManagingStudentsOrganization: false,
        relatedOrganizationTags: [],
        habilitations: [
          { id: 1, name: 'Certif comp 1' },
          { id: 2, name: 'Certif comp 2' },
        ],
      });
      const expectedSecondAllowedCertificationCenterAccess = domainBuilder.buildAllowedCertificationCenterAccess({
        id: 2,
        name: 'Centre de certif reliée à une orga sans tags',
        externalId: 'Centre2',
        type: CertificationCenter.types.PRO,
        isRelatedToManagingStudentsOrganization: false,
        relatedOrganizationTags: [],
        habilitations: [{ id: 3, name: 'Certif comp 3' }],
      });
      const expectedCertificationPointOfContact = domainBuilder.buildCertificationPointOfContact({
        id: 123,
        firstName: 'Jean',
        lastName: 'Acajou',
        email: 'jean.acajou@example.net',
        pixCertifTermsOfServiceAccepted: true,
        allowedCertificationCenterAccesses: [
          expectedFirstAllowedCertificationCenterAccess,
          expectedSecondAllowedCertificationCenterAccess,
        ],
      });
      expect(certificationPointOfContact).to.deepEqualInstance(expectedCertificationPointOfContact);
    });
  });
});
