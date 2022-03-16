// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi').extend(require('@joi/date'));
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validateEn... Remove this comment to see the full error message
const { validateEntity } = require('../validators/entity-validator');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validation... Remove this comment to see the full error message
const validationSchema = Joi.object({
  participantFirstName: Joi.string().required().allow(''),
  participantLastName: Joi.string().required().allow(''),
  participantExternalId: Joi.string().optional().allow(null),
  studentNumber: Joi.string().optional().allow(null),
  userId: Joi.number().integer().required(),
  campaignParticipationId: Joi.number().integer().required(),
  isCompleted: Joi.boolean().required(),
  createdAt: Joi.date().required(),
  sharedAt: Joi.date().required().allow(null),
  division: Joi.string().allow(null).optional(),
  group: Joi.string().allow(null).optional(),
  masteryRate: Joi.number().required().allow(null),
});

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
class CampaignParticipationInfo {
  campaignParticipationId: any;
  createdAt: any;
  division: any;
  group: any;
  isCompleted: any;
  masteryRate: any;
  participantExternalId: any;
  participantFirstName: any;
  participantLastName: any;
  sharedAt: any;
  studentNumber: any;
  userId: any;
  constructor({
    participantFirstName,
    participantLastName,
    participantExternalId = null,
    studentNumber = null,
    userId,
    campaignParticipationId,
    isCompleted,
    createdAt,
    sharedAt,
    division,
    group,
    masteryRate
  }: any = {}) {
    this.participantFirstName = participantFirstName;
    this.participantLastName = participantLastName;
    this.participantExternalId = participantExternalId;
    this.studentNumber = studentNumber;
    this.userId = userId;
    this.campaignParticipationId = campaignParticipationId;
    this.isCompleted = isCompleted;
    this.createdAt = createdAt;
    this.sharedAt = sharedAt;
    this.division = division;
    this.group = group;
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Number'.
    this.masteryRate = !_.isNil(masteryRate) ? Number(masteryRate) : null;
    validateEntity(validationSchema, this);
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isShared() {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(this.sharedAt);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignParticipationInfo;
