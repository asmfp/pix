// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError, ForbiddenAccess, AlreadyExistingCampaignParticipationError } = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipation = require('./CampaignParticipation');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const Assessment = require('./Assessment');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SchoolingR... Remove this comment to see the full error message
const SchoolingRegistration = require('./SchoolingRegistration');
const couldNotJoinCampaignErrorMessage = "Vous n'êtes pas autorisé à rejoindre la campagne";
const couldNotImproveCampaignErrorMessage = 'Vous ne pouvez pas repasser la campagne';

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
class CampaignParticipant {
  assessment: any;
  campaignParticipation: any;
  campaignToStartParticipation: any;
  previousCampaignParticipation: any;
  schoolingRegistration: any;
  schoolingRegistrationId: any;
  userIdentity: any;
  constructor({
    campaignToStartParticipation,
    schoolingRegistrationId,
    userIdentity,
    previousCampaignParticipation
  }: any) {
    this.campaignToStartParticipation = campaignToStartParticipation;
    this.schoolingRegistrationId = schoolingRegistrationId;
    this.userIdentity = userIdentity;
    this.previousCampaignParticipation = previousCampaignParticipation;
    this.schoolingRegistration = null;
  }

  start({
    participantExternalId
  }: any) {
    this._checkCanParticipateToCampaign(participantExternalId);

    const participantExternalIdToUse =
      this.previousCampaignParticipation?.participantExternalId || participantExternalId;
    let startAgainCampaign = false;
    if (this.previousCampaignParticipation) {
      startAgainCampaign = true;
      this.previousCampaignParticipation.isImproved = true;
    }

    if (this._shouldBecomeTrainee()) {
      this.schoolingRegistration = new SchoolingRegistration({
        userId: this.userIdentity.id,
        organizationId: this.campaignToStartParticipation.organizationId,
        firstName: this.userIdentity.firstName,
        lastName: this.userIdentity.lastName,
      });
    }

    if (this.campaignToStartParticipation.isAssessment) {
      this.assessment = Assessment.createForCampaign({
        userId: this.userIdentity.id,
        isImproving: startAgainCampaign,
        method: this.campaignToStartParticipation.assessmentMethod,
      });
    }

    this.campaignParticipation = CampaignParticipation.start({
      campaign: this.campaignToStartParticipation,
      campaignId: this.campaignToStartParticipation.id,
      userId: this.userIdentity.id,
      schoolingRegistrationId: this.schoolingRegistrationId,
      participantExternalId: participantExternalIdToUse,
    });
  }

  _shouldBecomeTrainee() {
    return !this.campaignToStartParticipation.isRestricted && !this.schoolingRegistrationId;
  }

  _checkCanParticipateToCampaign(participantExternalId: any) {
    if (this.campaignToStartParticipation.isArchived) {
      throw new ForbiddenAccess(couldNotJoinCampaignErrorMessage);
    }

    if (this.campaignToStartParticipation.isRestricted && !this.schoolingRegistrationId) {
      throw new ForbiddenAccess(couldNotJoinCampaignErrorMessage);
    }

    if (this.previousCampaignParticipation && !this.campaignToStartParticipation.multipleSendings) {
      throw new AlreadyExistingCampaignParticipationError(
        `User ${this.userIdentity.id} has already a campaign participation with campaign ${this.campaignToStartParticipation.id}`
      );
    }

    if (this.previousCampaignParticipation?.isDeleted) {
      throw new ForbiddenAccess(couldNotImproveCampaignErrorMessage);
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'includes' does not exist on type '{}'.
    if (['STARTED', 'TO_SHARE'].includes(this.previousCampaignParticipation?.status)) {
      throw new ForbiddenAccess(couldNotImproveCampaignErrorMessage);
    }
    if (this._canImproveResults()) {
      throw new ForbiddenAccess(couldNotImproveCampaignErrorMessage);
    }

    if (this._isMissingParticipantExternalId(participantExternalId)) {
      throw new EntityValidationError({
        invalidAttributes: [
          {
            attribute: 'participantExternalId',
            message: 'Un identifiant externe est requis pour accèder à la campagne.',
          },
        ],
      });
    }
  }

  _canImproveResults() {
    return (
      this.campaignToStartParticipation.isAssessment &&
      this.previousCampaignParticipation &&
      this.previousCampaignParticipation.validatedSkillsCount >= this.campaignToStartParticipation.skillCount
    );
  }

  _isMissingParticipantExternalId(participantExternalId: any) {
    return (
      this.campaignToStartParticipation.idPixLabel && !participantExternalId && !this.previousCampaignParticipation
    );
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignParticipant;
