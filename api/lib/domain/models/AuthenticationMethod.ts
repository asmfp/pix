// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi').extend(require('@joi/date'));
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validateEn... Remove this comment to see the full error message
const { validateEntity } = require('../validators/entity-validator');

const identityProviders = {
  PIX: 'PIX',
  GAR: 'GAR',
  POLE_EMPLOI: 'POLE_EMPLOI',
};

class PixAuthenticationComplement {
  password: any;
  shouldChangePassword: any;
  constructor({
    password,
    shouldChangePassword
  }: any = {}) {
    this.password = password;
    this.shouldChangePassword = shouldChangePassword;

    validateEntity(
      Joi.object({
        password: Joi.string().required(),
        shouldChangePassword: Joi.boolean().required(),
      }),
      this
    );
  }
}

class PoleEmploiAuthenticationComplement {
  accessToken: any;
  expiredDate: any;
  refreshToken: any;
  constructor({
    accessToken,
    refreshToken,
    expiredDate
  }: any = {}) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiredDate = expiredDate;

    validateEntity(
      Joi.object({
        accessToken: Joi.string().required(),
        refreshToken: Joi.string().optional(),
        expiredDate: Joi.date().required(),
      }),
      this
    );
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validation... Remove this comment to see the full error message
const validationSchema = Joi.object({
  id: Joi.number().optional(),
  identityProvider: Joi.string()
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Object'.
    .valid(...Object.values(identityProviders))
    .required(),
  authenticationComplement: Joi.when('identityProvider', [
    { is: identityProviders.PIX, then: Joi.object().instance(PixAuthenticationComplement).required() },
    { is: identityProviders.POLE_EMPLOI, then: Joi.object().instance(PoleEmploiAuthenticationComplement).required() },
    { is: identityProviders.GAR, then: Joi.any().empty() },
  ]),
  externalIdentifier: Joi.when('identityProvider', [
    { is: identityProviders.GAR, then: Joi.string().required() },
    { is: identityProviders.POLE_EMPLOI, then: Joi.string().required() },
    { is: identityProviders.PIX, then: Joi.any().forbidden() },
  ]),
  userId: Joi.number().integer().required(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
});

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
class AuthenticationMethod {
  authenticationComplement: any;
  createdAt: any;
  externalIdentifier: any;
  id: any;
  identityProvider: any;
  updatedAt: any;
  userId: any;
  constructor({
    id,
    identityProvider,
    authenticationComplement,
    externalIdentifier,
    createdAt,
    updatedAt,
    userId
  }: any = {}) {
    this.id = id;
    this.identityProvider = identityProvider;
    this.authenticationComplement = authenticationComplement;
    this.externalIdentifier = externalIdentifier;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.userId = userId;

    validateEntity(validationSchema, this);
  }

  static buildPixAuthenticationMethod({
    id,
    password,
    shouldChangePassword = false,
    createdAt,
    updatedAt,
    userId
  }: any) {
    const authenticationComplement = new PixAuthenticationComplement({ password, shouldChangePassword });
    return new AuthenticationMethod({
      id,
      identityProvider: identityProviders.PIX,
      authenticationComplement,
      externalIdentifier: undefined,
      createdAt,
      updatedAt,
      userId,
    });
  }
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
AuthenticationMethod.identityProviders = identityProviders;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'PixAuthenticationComplement' does not ex... Remove this comment to see the full error message
AuthenticationMethod.PixAuthenticationComplement = PixAuthenticationComplement;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'PoleEmploiAuthenticationComplement' does... Remove this comment to see the full error message
AuthenticationMethod.PoleEmploiAuthenticationComplement = PoleEmploiAuthenticationComplement;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = AuthenticationMethod;
