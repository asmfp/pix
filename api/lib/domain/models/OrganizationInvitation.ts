// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi').extend(require('@joi/date'));
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validateEn... Remove this comment to see the full error message
const { validateEntity } = require('../validators/entity-validator');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'statuses'.
const statuses = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  CANCELLED: 'cancelled',
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'roles'.
const roles = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
  // @ts-expect-error ts-migrate(7018) FIXME: Object literal's property 'AUTO' implicitly has an... Remove this comment to see the full error message
  AUTO: null,
};

const validationScheme = Joi.object({
  id: Joi.number().optional(),
  email: Joi.string().optional(),
  status: Joi.string().optional(),
  code: Joi.string().optional(),
  organizationName: Joi.string().allow(null).optional(),
  role: Joi.string()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
    .valid(...Object.values(roles))
    .optional(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
  organizationId: Joi.number().optional(),
});

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
class OrganizationInvitation {
  code: any;
  createdAt: any;
  email: any;
  id: any;
  organizationId: any;
  organizationName: any;
  role: any;
  status: any;
  updatedAt: any;
  constructor({
    id,
    email,
    status,
    code,
    organizationName,
    role,
    createdAt,
    updatedAt,

    //references
    organizationId
  }: any = {}) {
    this.id = id;
    this.email = email;
    this.status = status;
    this.code = code;
    this.organizationName = organizationName;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    //references
    this.organizationId = organizationId;

    validateEntity(validationScheme, this);
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isPending() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'PENDING' does not exist on type '{ DOWNG... Remove this comment to see the full error message
    return this.status === statuses.PENDING;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isAccepted() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'ACCEPTED' does not exist on type '{ DOWN... Remove this comment to see the full error message
    return this.status === statuses.ACCEPTED;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isCancelled() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'CANCELLED' does not exist on type '{ DOW... Remove this comment to see the full error message
    return this.status === statuses.CANCELLED;
  }
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'StatusType' does not exist on type 'type... Remove this comment to see the full error message
OrganizationInvitation.StatusType = statuses;

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = OrganizationInvitation;
