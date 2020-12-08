const _ = require('lodash');
const { catchErr, expect, sinon, domainBuilder } = require('../../../test-helper');
const CampaignParticipationResultsShared = require('../../../../lib/domain/events/CampaignParticipationResultsShared');
const PoleEmploiSending = require('../../../../lib/domain/models/PoleEmploiSending');
const { handlePoleEmploiParticipationShared } = require('../../../../lib/domain/events')._forTestOnly.handlers;

describe('Unit | Domain | Events | handle-pole-emploi-participation-shared', () => {
  let event;

  const campaignRepository = { get: _.noop() };
  const campaignParticipationRepository = { get: _.noop() };
  const campaignParticipationResultRepository = { getByParticipationId: _.noop() };
  const organizationRepository = { get: _.noop() };
  const targetProfileRepository = { get: _.noop() };
  const userRepository = { get: _.noop() };
  const poleEmploiNotifier = { notify: _.noop() };

  const dependencies = {
    campaignRepository,
    campaignParticipationRepository,
    campaignParticipationResultRepository,
    organizationRepository,
    targetProfileRepository,
    userRepository,
    poleEmploiNotifier,
  };

  const expectedResults = JSON.stringify({
    campagne: {
      nom: 'Campagne Pôle Emploi',
      dateDebut: '2020-01-01T00:00:00.000Z',
      dateFin: '2020-02-01T00:00:00.000Z',
      type: 'EVALUATION',
      codeCampagne: 'CODEPE123',
      urlCampagne: 'https://app.pix.fr/campagnes/CODEPE123',
      nomOrganisme: 'Pix',
      typeOrganisme: 'externe',
    },
    individu: {
      nom: 'Bonneau',
      prenom: 'Jean',
    },
    test: {
      etat: 4,
      progression: 100,
      typeTest: 'DI',
      referenceExterne: 55667788,
      dateDebut: '2020-01-02T00:00:00.000Z',
      dateProgression: '2020-01-03T00:00:00.000Z',
      dateValidation: '2020-01-03T00:00:00.000Z',
      evaluation: 70,
      uniteEvaluation: 'A',
      elementsEvalues: [
        {
          libelle: 'Gérer des données',
          categorie: 'competence',
          type: 'competence Pix',
          domaineRattachement: 'Information et données',
          nbSousElements: 4,
          evaluation: {
            scoreObtenu: 50,
            uniteScore: 'A',
            nbSousElementValide: 2,
          },
        },
        {
          libelle: 'Gérer des données 2',
          categorie: 'competence',
          type: 'competence Pix',
          domaineRattachement: 'Information et données',
          nbSousElements: 3,
          evaluation: {
            scoreObtenu: 100,
            uniteScore: 'A',
            nbSousElementValide: 3,
          },
        },
      ],
    },
  });

  beforeEach(() => {
    campaignRepository.get = sinon.stub();
    campaignParticipationRepository.get = sinon.stub();
    campaignParticipationResultRepository.getByParticipationId = sinon.stub();
    organizationRepository.get = sinon.stub();
    targetProfileRepository.get = sinon.stub();
    userRepository.get = sinon.stub();
    poleEmploiNotifier.notify = sinon.stub();
  });

  it('fails when event is not of correct type', async () => {
    // given
    const event = 'not an event of the correct type';
    // when / then
    const error = await catchErr(handlePoleEmploiParticipationShared)({ event, ...dependencies });

    // then
    expect(error).not.to.be.null;
  });

  context('#handlePoleEmploiParticipationShared', () => {
    const campaignParticipationId = 55667788;
    const campaignId = 11223344;
    const userId = 987654321;
    const organizationId = Symbol('organizationId');

    context('when campaign is of type ASSESSMENT and organization is Pole Emploi', () => {
      beforeEach(() => {
        event = new CampaignParticipationResultsShared({ campaignParticipationId });

        organizationRepository.get.withArgs(organizationId).resolves({ isPoleEmploi: true });
        userRepository.get.withArgs(userId).resolves(domainBuilder.buildUser({ id: userId, firstName: 'Jean', lastName: 'Bonneau' }));
        campaignRepository.get.withArgs(campaignId).resolves(
          domainBuilder.buildCampaign({
            id: 11223344,
            name: 'Campagne Pôle Emploi',
            code: 'CODEPE123',
            createdAt: new Date('2020-01-01'),
            archivedAt: new Date('2020-02-01'),
            type: 'ASSESSMENT',
            targetProfileId: 'targetProfileId1',
            organizationId,
          }),
        );
        targetProfileRepository.get.withArgs('targetProfileId1').resolves({ name: 'Diagnostic initial' });
        campaignParticipationRepository.get.withArgs(campaignParticipationId).resolves(
          domainBuilder.buildCampaignParticipation({
            id: 55667788,
            campaignId,
            userId,
            sharedAt: new Date('2020-01-03'),
            createdAt: new Date('2020-01-02'),
          }),
        );
        campaignParticipationResultRepository.getByParticipationId.withArgs(campaignParticipationId).resolves(
          domainBuilder.buildCampaignParticipationResult({
            totalSkillsCount: 10,
            validatedSkillsCount: 7,
            competenceResults: [
              domainBuilder.buildCompetenceResult({
                name: 'Gérer des données',
                areaName: 'Information et données',
                totalSkillsCount: 4,
                testedSkillsCount: 2,
                validatedSkillsCount: 2,
              }),
              domainBuilder.buildCompetenceResult({
                name: 'Gérer des données 2',
                areaName: 'Information et données',
                totalSkillsCount: 3,
                testedSkillsCount: 3,
                validatedSkillsCount: 3,
              }),
            ],
          }),
        );
      });

      it('should notify pole emploi', async () => {
        // when
        await handlePoleEmploiParticipationShared({
          event,
          ...dependencies,
        });

        // then
        expect(poleEmploiNotifier.notify).to.have.been.calledWith(userId, expectedResults, sinon.match.instanceOf(PoleEmploiSending));
      });

      it('should notify with type CAMPAIGN_PARTICIPATION_SHARING', async () => {
        // when
        await handlePoleEmploiParticipationShared({
          event,
          ...dependencies,
        });

        // then
        const poleEmploiSending = poleEmploiNotifier.notify.firstCall.args[2];
        expect(poleEmploiSending.type).to.equal(PoleEmploiSending.TYPES.CAMPAIGN_PARTICIPATION_SHARING);
      });
    });

    context('when campaign is of type ASSESSMENT but organization is not Pole Emploi', () => {
      beforeEach(() => {
        event = new CampaignParticipationResultsShared({ campaignParticipationId });
        campaignParticipationRepository.get.withArgs(campaignParticipationId).resolves(
          domainBuilder.buildCampaignParticipation({
            id: 55667788,
            campaignId,
            userId,
            sharedAt: new Date('2020-01-03'),
            createdAt: new Date('2020-01-02'),
          }),
        );
        campaignRepository.get.withArgs(campaignId).resolves(domainBuilder.buildCampaign({ type: 'ASSESSMENT', organizationId }));
        organizationRepository.get.withArgs(organizationId).resolves({ isPoleEmploi: false });
      });

      it('it should not notify to Pole Emploi', async () => {
        // when
        await handlePoleEmploiParticipationShared({
          event,
          ...dependencies,
        });

        // then
        sinon.assert.notCalled(poleEmploiNotifier.notify);
      });
    });

    context('when organization is Pole Emploi but campaign is of type PROFILES_COLLECTION', () => {
      beforeEach(() => {
        event = new CampaignParticipationResultsShared({ campaignParticipationId });

        campaignParticipationRepository.get.withArgs(campaignParticipationId).resolves(
          domainBuilder.buildCampaignParticipation({
            id: 55667788,
            campaignId,
            userId,
            sharedAt: new Date('2020-01-03'),
            createdAt: new Date('2020-01-02'),
          }),
        );
        campaignRepository.get
          .withArgs(campaignId)
          .resolves(domainBuilder.buildCampaign({ type: 'PROFILES_COLLECTION' }));
        organizationRepository.get.withArgs(organizationId).resolves({ isPoleEmploi: true, organizationId });
      });

      it('it should not notify to Pole Emploi', async () => {
        // when
        await handlePoleEmploiParticipationShared({
          event,
          ...dependencies,
        });

        // then
        sinon.assert.notCalled(poleEmploiNotifier.notify);
      });
    });
  });
});