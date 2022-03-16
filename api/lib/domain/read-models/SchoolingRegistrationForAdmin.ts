// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi').extend(require('@joi/date'));
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validateEn... Remove this comment to see the full error message
const { validateEntity } = require('../validators/entity-validator');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validation... Remove this comment to see the full error message
const validationSchema = Joi.object({
  id: Joi.number().integer().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  birthdate: Joi.date().required().allow(null),
  division: Joi.string().required().allow(null),
  group: Joi.string().required().allow(null),
  organizationId: Joi.number().integer().required(),
  organizationName: Joi.string().required(),
  createdAt: Joi.date().required(),
  updatedAt: Joi.date().required(),
  isDisabled: Joi.boolean().required(),
  canBeDissociated: Joi.boolean().required(),
});

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SchoolingR... Remove this comment to see the full error message
class SchoolingRegistrationForAdmin {
  birthdate: any;
  canBeDissociated: any;
  createdAt: any;
  division: any;
  firstName: any;
  group: any;
  id: any;
  isDisabled: any;
  lastName: any;
  organizationId: any;
  organizationName: any;
  updatedAt: any;
  constructor({
    id,
    firstName,
    lastName,
    birthdate,
    division,
    group,
    organizationId,
    organizationName,
    createdAt,
    updatedAt,
    isDisabled,
    organizationIsManagingStudents
  }: any) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.division = division;
    this.group = group;
    this.organizationId = organizationId;
    this.organizationName = organizationName;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isDisabled = isDisabled;
    this.canBeDissociated = organizationIsManagingStudents;

    validateEntity(validationSchema, this);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = SchoolingRegistrationForAdmin;
