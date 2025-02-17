const { expect, databaseBuilder, catchErr } = require('../../../test-helper');
const campaignToJoinRepository = require('../../../../lib/infrastructure/repositories/campaign-to-join-repository');
const CampaignToJoin = require('../../../../lib/domain/read-models/CampaignToJoin');
const { NotFoundError } = require('../../../../lib/domain/errors');
const DomainTransaction = require('../../../../lib/infrastructure/DomainTransaction');

describe('Integration | Repository | CampaignToJoin', function () {
  describe('#get', function () {
    it('should return the CampaignToJoin', async function () {
      // given
      const targetProfile = databaseBuilder.factory.buildTargetProfile();
      const organization = databaseBuilder.factory.buildOrganization();
      const expectedCampaign = databaseBuilder.factory.buildCampaign({
        organizationId: organization.id,
        targetProfileId: targetProfile.id,
      });
      databaseBuilder.factory.buildCampaign();
      await databaseBuilder.commit();

      // when
      const actualCampaign = await DomainTransaction.execute(async (domainTransaction) => {
        return campaignToJoinRepository.get(expectedCampaign.id, domainTransaction);
      });

      // then
      expect(actualCampaign).to.be.instanceOf(CampaignToJoin);
      expect(actualCampaign.id).to.equal(expectedCampaign.id);
      expect(actualCampaign.code).to.equal(expectedCampaign.code);
      expect(actualCampaign.title).to.equal(expectedCampaign.title);
      expect(actualCampaign.idPixLabel).to.equal(expectedCampaign.idPixLabel);
      expect(actualCampaign.customLandingPageText).to.equal(expectedCampaign.customLandingPageText);
      expect(actualCampaign.externalIdHelpImageUrl).to.equal(expectedCampaign.externalIdHelpImageUrl);
      expect(actualCampaign.alternativeTextToExternalIdHelpImage).to.equal(
        expectedCampaign.alternativeTextToExternalIdHelpImage
      );
      expect(actualCampaign.archivedAt).to.equal(expectedCampaign.archivedAt);
      expect(actualCampaign.type).to.equal(expectedCampaign.type);
      expect(actualCampaign.organizationId).to.equal(organization.id);
      expect(actualCampaign.organizationName).to.equal(organization.name);
      expect(actualCampaign.organizationType).to.equal(organization.type);
      expect(actualCampaign.organizationLogoUrl).to.equal(organization.logoUrl);
      expect(actualCampaign.organizationShowNPS).to.equal(organization.showNPS);
      expect(actualCampaign.organizationFormNPSUrl).to.equal(organization.formNPSUrl);
      expect(actualCampaign.isRestricted).to.equal(organization.isManagingStudents);
      expect(actualCampaign.targetProfileName).to.equal(targetProfile.name);
      expect(actualCampaign.targetProfileImageUrl).to.equal(targetProfile.imageUrl);
    });

    it('should throw a NotFoundError when no campaign exists with given id', async function () {
      // given
      let error;
      const existingId = databaseBuilder.factory.buildCampaign().id;
      await databaseBuilder.commit();

      // when

      await DomainTransaction.execute(async (domainTransaction) => {
        error = await catchErr(campaignToJoinRepository.get)(existingId + 1000, domainTransaction);
      });

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });

  describe('#getByCode', function () {
    it('should return the CampaignToJoin by its code', async function () {
      // given
      const code = 'LAURA123';
      const targetProfile = databaseBuilder.factory.buildTargetProfile();
      const organization = databaseBuilder.factory.buildOrganization();
      const expectedCampaign = databaseBuilder.factory.buildCampaign({
        code,
        organizationId: organization.id,
        targetProfileId: targetProfile.id,
      });
      databaseBuilder.factory.buildCampaign();
      await databaseBuilder.commit();

      // when
      const actualCampaign = await campaignToJoinRepository.getByCode(code);

      // then
      expect(actualCampaign).to.be.instanceOf(CampaignToJoin);
      expect(actualCampaign.id).to.equal(expectedCampaign.id);
      expect(actualCampaign.code).to.equal(expectedCampaign.code);
      expect(actualCampaign.title).to.equal(expectedCampaign.title);
      expect(actualCampaign.idPixLabel).to.equal(expectedCampaign.idPixLabel);
      expect(actualCampaign.customLandingPageText).to.equal(expectedCampaign.customLandingPageText);
      expect(actualCampaign.externalIdHelpImageUrl).to.equal(expectedCampaign.externalIdHelpImageUrl);
      expect(actualCampaign.alternativeTextToExternalIdHelpImage).to.equal(
        expectedCampaign.alternativeTextToExternalIdHelpImage
      );
      expect(actualCampaign.archivedAt).to.equal(expectedCampaign.archivedAt);
      expect(actualCampaign.type).to.equal(expectedCampaign.type);
      expect(actualCampaign.organizationId).to.equal(organization.id);
      expect(actualCampaign.organizationName).to.equal(organization.name);
      expect(actualCampaign.organizationType).to.equal(organization.type);
      expect(actualCampaign.organizationLogoUrl).to.equal(organization.logoUrl);
      expect(actualCampaign.organizationShowNPS).to.equal(organization.showNPS);
      expect(actualCampaign.organizationFormNPSUrl).to.equal(organization.formNPSUrl);
      expect(actualCampaign.isRestricted).to.equal(organization.isManagingStudents);
      expect(actualCampaign.targetProfileName).to.equal(targetProfile.name);
      expect(actualCampaign.targetProfileImageUrl).to.equal(targetProfile.imageUrl);
      expect(actualCampaign.isSimplifiedAccess).to.equal(targetProfile.isSimplifiedAccess);
    });

    context('when the organization of the campaign has the POLE EMPLOI tag', function () {
      it('should return true for organizationIsPoleEmploi', async function () {
        // given
        const code = 'LAURA456';
        const organization = databaseBuilder.factory.buildOrganization();
        databaseBuilder.factory.buildCampaign({ code, organizationId: organization.id });
        databaseBuilder.factory.buildOrganizationTag({
          organizationId: organization.id,
          tagId: databaseBuilder.factory.buildTag({ name: 'POLE EMPLOI' }).id,
        });
        await databaseBuilder.commit();

        // when
        const actualCampaign = await campaignToJoinRepository.getByCode(code);

        // then
        expect(actualCampaign).to.be.instanceOf(CampaignToJoin);
        expect(actualCampaign.organizationIsPoleEmploi).to.be.true;
      });
    });

    context('when the organization of the campaign does not have the POLE EMPLOI tag', function () {
      it('should return false for organizationIsPoleEmploi', async function () {
        // given
        const code = 'LAURA456';
        const organization = databaseBuilder.factory.buildOrganization();
        databaseBuilder.factory.buildCampaign({ code, organizationId: organization.id });
        await databaseBuilder.commit();

        // when
        const actualCampaign = await campaignToJoinRepository.getByCode(code);

        // then
        expect(actualCampaign).to.be.instanceOf(CampaignToJoin);
        expect(actualCampaign.organizationIsPoleEmploi).to.be.false;
      });
    });

    it('should throw a NotFoundError when no campaign exists with given code', async function () {
      // given
      const code = 'LAURA123';
      databaseBuilder.factory.buildCampaign({ code });
      await databaseBuilder.commit();

      // when
      const error = await catchErr(campaignToJoinRepository.getByCode)('LAURA456');

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });
});
