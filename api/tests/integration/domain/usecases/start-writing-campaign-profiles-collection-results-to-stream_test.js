const { PassThrough } = require('stream');
const { expect, mockLearningContent, databaseBuilder, streamToPromise } = require('../../../test-helper');

const startWritingCampaignProfilesCollectionResultsToStream = require('../../../../lib/domain/usecases/start-writing-campaign-profiles-collection-results-to-stream');

const campaignRepository = require('../../../../lib/infrastructure/repositories/campaign-repository');
const campaignParticipationRepository = require('../../../../lib/infrastructure/repositories/campaign-participation-repository');
const competenceRepository = require('../../../../lib/infrastructure/repositories/competence-repository');
const organizationRepository = require('../../../../lib/infrastructure/repositories/organization-repository');
const userRepository = require('../../../../lib/infrastructure/repositories/user-repository');
const placementProfileService = require('../../../../lib/domain/services/placement-profile-service');
const { getI18n } = require('../../../tooling/i18n/i18n');

describe('Integration | Domain | Use Cases | start-writing-profiles-collection-campaign-results-to-stream', function () {
  describe('#startWritingCampaignProfilesCollectionResultsToStream', function () {
    let organization;
    let user;
    let participant;
    let schoolingRegistration;
    let campaign;
    let campaignParticipation;
    let writableStream;
    let csvPromise;
    let i18n;

    const createdAt = new Date('2019-02-25T10:00:00Z');

    beforeEach(async function () {
      i18n = getI18n();
      user = databaseBuilder.factory.buildUser();
      organization = databaseBuilder.factory.buildOrganization();
      const skillWeb1 = { id: 'recSkillWeb1', name: '@web1', competenceIds: ['recCompetence1'] };
      const skillWeb2 = { id: 'recSkillWeb2', name: '@web2', competenceIds: ['recCompetence1'] };
      const skillWeb3 = { id: 'recSkillWeb3', name: '@web3', competenceIds: ['recCompetence1'] };
      const skillUrl1 = { id: 'recSkillUrl1', name: '@url1', competenceIds: ['recCompetence2'] };
      const skillUrl8 = { id: 'recSkillUrl8', name: '@url8', competenceIds: ['recCompetence2'] };
      const skills = [skillWeb1, skillWeb2, skillWeb3, skillUrl1, skillUrl8];

      participant = databaseBuilder.factory.buildUser();

      databaseBuilder.factory.buildKnowledgeElement({
        status: 'validated',
        pixScore: 2,
        skillId: skillWeb1.id,
        earnedPix: 6,
        competenceId: 'recCompetence1',
        userId: participant.id,
        createdAt,
      });
      databaseBuilder.factory.buildKnowledgeElement({
        status: 'validated',
        pixScore: 2,
        skillId: skillWeb2.id,
        earnedPix: 6,
        competenceId: 'recCompetence1',
        userId: participant.id,
        createdAt,
      });
      databaseBuilder.factory.buildKnowledgeElement({
        status: 'invalidated',
        pixScore: 2,
        skillId: skillWeb3.id,
        earnedPix: 0,
        competenceId: 'recCompetence1',
        userId: participant.id,
        createdAt,
      });
      databaseBuilder.factory.buildKnowledgeElement({
        status: 'validated',
        pixScore: 2,
        skillId: skillWeb3.id,
        earnedPix: 6,
        competenceId: 'recCompetence1',
        userId: participant.id,
        createdAt: new Date('2019-03-25T10:00:00Z'),
      });
      databaseBuilder.factory.buildKnowledgeElement({
        status: 'validated',
        skillId: skillUrl1.id,
        earnedPix: 2,
        competenceId: 'recCompetence2',
        userId: participant.id,
        createdAt,
      });
      databaseBuilder.factory.buildKnowledgeElement({
        status: 'validated',
        skillId: skillUrl8.id,
        earnedPix: 64,
        competenceId: 'recCompetence2',
        userId: participant.id,
        createdAt,
      });

      await databaseBuilder.commit();

      const learningContent = {
        areas: [{ id: 'recArea1' }, { id: 'recArea2' }],
        competences: [
          {
            id: 'recCompetence1',
            areaId: 'recArea1',
            skillIds: [skillWeb1.id, skillWeb2.id, skillWeb3.id],
            origin: 'Pix',
          },
          {
            id: 'recCompetence2',
            areaId: 'recArea2',
            skillIds: [skillUrl1.id, skillUrl8.id],
            origin: 'Pix',
          },
        ],
        skills,
      };
      mockLearningContent(learningContent);

      writableStream = new PassThrough();
      csvPromise = streamToPromise(writableStream);
    });

    context('When the organization is PRO', function () {
      beforeEach(async function () {
        organization = databaseBuilder.factory.buildOrganization({ type: 'PRO' });
        databaseBuilder.factory.buildMembership({ userId: user.id, organizationId: organization.id });

        campaign = databaseBuilder.factory.buildCampaign({
          name: '@Campagne de Test N°2',
          code: 'QWERTY456',
          organizationId: organization.id,
          idPixLabel: 'Mail Perso',
          targetProfileId: null,
          type: 'PROFILES_COLLECTION',
          title: null,
        });

        schoolingRegistration = { firstName: '@Jean', lastName: '=Bono' };
        campaignParticipation = databaseBuilder.factory.buildCampaignParticipationWithOrganizationLearner(
          schoolingRegistration,
          {
            createdAt,
            sharedAt: new Date('2019-03-01T23:04:05Z'),
            participantExternalId: '+Mon mail pro',
            campaignId: campaign.id,
            userId: participant.id,
            pixScore: 52,
          }
        );

        await databaseBuilder.commit();
      });

      it('should return the complete line', async function () {
        // given
        const expectedCsvFirstCell = '\uFEFF"Nom de l\'organisation"';
        const expectedCsvSecondLine =
          `"${organization.name}";` +
          `${campaign.id};` +
          `"'${campaign.name}";` +
          `"'${schoolingRegistration.lastName}";` +
          `"'${schoolingRegistration.firstName}";` +
          `"'${campaignParticipation.participantExternalId}";` +
          '"Oui";' +
          '2019-03-01;' +
          '52;' +
          '"Non";' +
          '2;' +
          '1;' +
          '12;' +
          '5;' +
          '40';

        // when
        startWritingCampaignProfilesCollectionResultsToStream({
          userId: user.id,
          campaignId: campaign.id,
          writableStream,
          i18n,
          campaignRepository,
          userRepository,
          competenceRepository,
          organizationRepository,
          campaignParticipationRepository,
          placementProfileService,
        });

        const csv = await csvPromise;
        const csvLines = csv.split('\n');
        const csvFirstLineCells = csvLines[0].split(';');

        // then
        expect(csvFirstLineCells[0]).to.equal(expectedCsvFirstCell);
        expect(csvLines[1]).to.equal(expectedCsvSecondLine);
      });
    });

    context('When the organization is SCO and managing student', function () {
      beforeEach(async function () {
        organization = databaseBuilder.factory.buildOrganization({ type: 'SCO', isManagingStudents: true });
        databaseBuilder.factory.buildMembership({ userId: user.id, organizationId: organization.id });

        schoolingRegistration = databaseBuilder.factory.buildSchoolingRegistration({
          userId: participant.id,
          firstName: '@Jean',
          lastName: '=Bono',
          division: '3emeG',
          organizationId: organization.id,
        });

        campaign = databaseBuilder.factory.buildCampaign({
          name: '@Campagne de Test N°2',
          code: 'QWERTY456',
          organizationId: organization.id,
          idPixLabel: 'Mail Perso',
          targetProfileId: null,
          type: 'PROFILES_COLLECTION',
          title: null,
        });

        campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
          createdAt,
          sharedAt: new Date('2019-03-01T23:04:05Z'),
          participantExternalId: '+Mon mail pro',
          campaignId: campaign.id,
          userId: participant.id,
          schoolingRegistrationId: schoolingRegistration.id,
          pixScore: 52,
        });

        await databaseBuilder.commit();
      });

      it('should return the complete line', async function () {
        // given
        const expectedCsvFirstCell = '\uFEFF"Nom de l\'organisation"';
        const expectedCsvSecondLine =
          `"${organization.name}";` +
          `${campaign.id};` +
          `"'${campaign.name}";` +
          `"'${schoolingRegistration.lastName}";` +
          `"'${schoolingRegistration.firstName}";` +
          `"${schoolingRegistration.division}";` +
          `"'${campaignParticipation.participantExternalId}";` +
          '"Oui";' +
          '2019-03-01;' +
          '52;' +
          '"Non";' +
          '2;' +
          '1;' +
          '12;' +
          '5;' +
          '40';

        // when
        startWritingCampaignProfilesCollectionResultsToStream({
          userId: user.id,
          campaignId: campaign.id,
          writableStream,
          i18n,
          campaignRepository,
          userRepository,
          competenceRepository,
          organizationRepository,
          campaignParticipationRepository,
          placementProfileService,
        });

        const csv = await csvPromise;
        const csvLines = csv.split('\n');
        const csvFirstLineCells = csvLines[0].split(';');

        // then
        expect(csvFirstLineCells[0]).to.equal(expectedCsvFirstCell);
        expect(csvLines[1]).to.equal(expectedCsvSecondLine);
      });
    });

    context('When the organization is SUP and isManagingStudent', function () {
      beforeEach(async function () {
        organization = databaseBuilder.factory.buildOrganization({ type: 'SUP', isManagingStudents: true });
        databaseBuilder.factory.buildMembership({ userId: user.id, organizationId: organization.id });

        schoolingRegistration = databaseBuilder.factory.buildSchoolingRegistration({
          userId: participant.id,
          studentNumber: '12345A',
          firstName: '@Jean',
          lastName: '=Bono',
          group: '=AB1',
          organizationId: organization.id,
        });

        campaign = databaseBuilder.factory.buildCampaign({
          name: '@Campagne de Test N°2',
          code: 'QWERTY456',
          organizationId: organization.id,
          idPixLabel: 'Mail Perso',
          targetProfileId: null,
          type: 'PROFILES_COLLECTION',
          title: null,
        });

        campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
          createdAt,
          sharedAt: new Date('2019-03-01T23:04:05Z'),
          participantExternalId: '+Mon mail pro',
          campaignId: campaign.id,
          userId: participant.id,
          schoolingRegistrationId: schoolingRegistration.id,
          pixScore: 52,
        });

        await databaseBuilder.commit();
      });

      it('should return the complete line for a SUP organisation that manages students', async function () {
        // given
        const expectedCsvFirstCell = '\uFEFF"Nom de l\'organisation"';
        const expectedCsvSecondLine =
          `"${organization.name}";` +
          `${campaign.id};` +
          `"'${campaign.name}";` +
          `"'${schoolingRegistration.lastName}";` +
          `"'${schoolingRegistration.firstName}";` +
          `"'${schoolingRegistration.group}";` +
          `"${schoolingRegistration.studentNumber}";` +
          `"'${campaignParticipation.participantExternalId}";` +
          '"Oui";' +
          '2019-03-01;' +
          '52;' +
          '"Non";' +
          '2;' +
          '1;' +
          '12;' +
          '5;' +
          '40';

        // when
        startWritingCampaignProfilesCollectionResultsToStream({
          userId: user.id,
          campaignId: campaign.id,
          writableStream,
          i18n,
          campaignRepository,
          userRepository,
          competenceRepository,
          organizationRepository,
          campaignParticipationRepository,
          placementProfileService,
        });

        const csv = await csvPromise;
        const csvLines = csv.split('\n');
        const csvFirstLineCells = csvLines[0].split(';');

        // then
        expect(csvFirstLineCells[0]).to.equal(expectedCsvFirstCell);
        expect(csvLines[1]).to.equal(expectedCsvSecondLine);
      });
    });
  });
});
