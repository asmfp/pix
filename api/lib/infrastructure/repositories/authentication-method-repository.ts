// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bookshelfU... Remove this comment to see the full error message
const bookshelfUtils = require('../utils/knex-utils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
const { AlreadyExistingEntityError, AuthenticationMethodNotFoundError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../domain/models/AuthenticationMethod');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(authenticationMethodDTO: any) {
  const externalIdentifier =
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
    authenticationMethodDTO.identityProvider === AuthenticationMethod.identityProviders.GAR ||
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
    authenticationMethodDTO.identityProvider === AuthenticationMethod.identityProviders.POLE_EMPLOI
      ? authenticationMethodDTO.externalIdentifier
      : undefined;
  const authenticationComplement = _toAuthenticationComplement(
    authenticationMethodDTO.identityProvider,
    authenticationMethodDTO.authenticationComplement
  );
  return new AuthenticationMethod({
    ...authenticationMethodDTO,
    externalIdentifier,
    authenticationComplement,
  });
}

function _toAuthenticationComplement(identityProvider: any, bookshelfAuthenticationComplement: any) {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
  if (identityProvider === AuthenticationMethod.identityProviders.PIX) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'PixAuthenticationComplement' does not ex... Remove this comment to see the full error message
    return new AuthenticationMethod.PixAuthenticationComplement(bookshelfAuthenticationComplement);
  }

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
  if (identityProvider === AuthenticationMethod.identityProviders.POLE_EMPLOI) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'PoleEmploiAuthenticationComplement' does... Remove this comment to see the full error message
    return new AuthenticationMethod.PoleEmploiAuthenticationComplement(bookshelfAuthenticationComplement);
  }

  return undefined;
}

const AUTHENTICATION_METHODS_TABLE = 'authentication-methods';
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'COLUMNS'.
const COLUMNS = Object.freeze([
  'id',
  'identityProvider',
  'authenticationComplement',
  'externalIdentifier',
  'userId',
  'createdAt',
  'updatedAt',
]);

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async create({
    authenticationMethod,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: any) {
    try {
      const knexConn = domainTransaction.knexTransaction ?? knex;
      const authenticationMethodForDB = _.pick(authenticationMethod, [
        'identityProvider',
        'authenticationComplement',
        'externalIdentifier',
        'userId',
      ]);
      const [authenticationMethodDTO] = await knexConn(AUTHENTICATION_METHODS_TABLE)
        .insert(authenticationMethodForDB)
        .returning(COLUMNS);
      return _toDomain(authenticationMethodDTO);
    } catch (err) {
      if (bookshelfUtils.isUniqConstraintViolated(err)) {
        throw new AlreadyExistingEntityError(
          `An authentication method already exists for the user ID ${authenticationMethod.userId} and the externalIdentifier ${authenticationMethod.externalIdentifier}.`
        );
      }
    }
  },

  async createPasswordThatShouldBeChanged({
    userId,
    hashedPassword,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: any) {
    try {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'PixAuthenticationComplement' does not ex... Remove this comment to see the full error message
      const authenticationComplement = new AuthenticationMethod.PixAuthenticationComplement({
        password: hashedPassword,
        shouldChangePassword: true,
      });
      const authenticationMethod = new AuthenticationMethod({
        authenticationComplement,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
        identityProvider: AuthenticationMethod.identityProviders.PIX,
        userId,
      });
      const authenticationMethodForDB = _.pick(authenticationMethod, [
        'identityProvider',
        'authenticationComplement',
        'externalIdentifier',
        'userId',
      ]);
      const knexConn = domainTransaction.knexTransaction ?? knex;
      const [authenticationMethodDTO] = await knexConn(AUTHENTICATION_METHODS_TABLE)
        .insert(authenticationMethodForDB)
        .returning(COLUMNS);
      return _toDomain(authenticationMethodDTO);
    } catch (err) {
      if (bookshelfUtils.isUniqConstraintViolated(err)) {
        throw new AlreadyExistingEntityError(`Authentication method PIX already exists for the user ID ${userId}.`);
      }
    }
  },

  async findOneByUserIdAndIdentityProvider({
    userId,
    identityProvider
  }: any) {
    const authenticationMethodDTO = await knex
      .select(COLUMNS)
      .from(AUTHENTICATION_METHODS_TABLE)
      .where({ userId, identityProvider })
      .first();

    return authenticationMethodDTO ? _toDomain(authenticationMethodDTO) : null;
  },

  async findOneByExternalIdentifierAndIdentityProvider({
    externalIdentifier,
    identityProvider
  }: any) {
    const authenticationMethodDTO = await knex
      .select(COLUMNS)
      .from(AUTHENTICATION_METHODS_TABLE)
      .where({ externalIdentifier, identityProvider })
      .first();

    return authenticationMethodDTO ? _toDomain(authenticationMethodDTO) : null;
  },

  async findByUserId({
    userId
  }: any) {
    const authenticationMethodDTOs = await knex
      .select(COLUMNS)
      .from(AUTHENTICATION_METHODS_TABLE)
      .where({ userId })
      .orderBy('id', 'ASC');

    return authenticationMethodDTOs.map(_toDomain);
  },

  async getByIdAndUserId({
    id,
    userId
  }: any) {
    const authenticationMethod = await knex.from(AUTHENTICATION_METHODS_TABLE).where({ id, userId }).first();
    if (!authenticationMethod) {
      throw new AuthenticationMethodNotFoundError(`Authentication method of id ${id} and user id ${userId} not found.`);
    }
    return _toDomain(authenticationMethod);
  },

  async hasIdentityProviderPIX({
    userId
  }: any) {
    const authenticationMethodDTO = await knex
      .select(COLUMNS)
      .from(AUTHENTICATION_METHODS_TABLE)
      .where({
        userId,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
        identityProvider: AuthenticationMethod.identityProviders.PIX,
      })
      .first();

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(authenticationMethodDTO);
  },

  async removeByUserIdAndIdentityProvider({
    userId,
    identityProvider
  }: any) {
    return knex(AUTHENTICATION_METHODS_TABLE).where({ userId, identityProvider }).del();
  },

  async removeAllAuthenticationMethodsByUserId({
    userId
  }: any) {
    return knex(AUTHENTICATION_METHODS_TABLE).where({ userId }).del();
  },

  async updateChangedPassword({
    userId,
    hashedPassword
  }: any, domainTransaction = DomainTransaction.emptyTransaction()) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'PixAuthenticationComplement' does not ex... Remove this comment to see the full error message
    const authenticationComplement = new AuthenticationMethod.PixAuthenticationComplement({
      password: hashedPassword,
      shouldChangePassword: false,
    });

    const knexConn = domainTransaction.knexTransaction ?? knex;
    const [authenticationMethodDTO] = await knexConn(AUTHENTICATION_METHODS_TABLE)
      .where({
        userId,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
        identityProvider: AuthenticationMethod.identityProviders.PIX,
      })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
      .update({ authenticationComplement, updatedAt: new Date() })
      .returning(COLUMNS);

    if (!authenticationMethodDTO) {
      throw new AuthenticationMethodNotFoundError(`Authentication method PIX for User ID ${userId} not found.`);
    }
    return _toDomain(authenticationMethodDTO);
  },

  async updatePasswordThatShouldBeChanged({
    userId,
    hashedPassword,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'PixAuthenticationComplement' does not ex... Remove this comment to see the full error message
    const authenticationComplement = new AuthenticationMethod.PixAuthenticationComplement({
      password: hashedPassword,
      shouldChangePassword: true,
    });

    const knexConn = domainTransaction.knexTransaction ?? knex;
    const [authenticationMethodDTO] = await knexConn(AUTHENTICATION_METHODS_TABLE)
      .where({
        userId,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
        identityProvider: AuthenticationMethod.identityProviders.PIX,
      })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
      .update({ authenticationComplement, updatedAt: new Date() })
      .returning(COLUMNS);

    if (!authenticationMethodDTO) {
      throw new AuthenticationMethodNotFoundError(`Authentication method PIX for User ID ${userId} not found.`);
    }
    return _toDomain(authenticationMethodDTO);
  },

  async updateExpiredPassword({
    userId,
    hashedPassword
  }: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'PixAuthenticationComplement' does not ex... Remove this comment to see the full error message
    const authenticationComplement = new AuthenticationMethod.PixAuthenticationComplement({
      password: hashedPassword,
      shouldChangePassword: false,
    });

    const [authenticationMethodDTO] = await knex(AUTHENTICATION_METHODS_TABLE)
      .where({
        userId,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
        identityProvider: AuthenticationMethod.identityProviders.PIX,
      })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
      .update({ authenticationComplement, updatedAt: new Date() })
      .returning(COLUMNS);

    if (!authenticationMethodDTO) {
      throw new AuthenticationMethodNotFoundError(`Authentication method PIX for User ID ${userId} not found.`);
    }
    return _toDomain(authenticationMethodDTO);
  },

  async updateExternalIdentifierByUserIdAndIdentityProvider({
    externalIdentifier,
    userId,
    identityProvider
  }: any) {
    const [authenticationMethodDTO] = await knex(AUTHENTICATION_METHODS_TABLE)
      .where({ userId, identityProvider })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
      .update({ externalIdentifier, updatedAt: new Date() })
      .returning(COLUMNS);

    if (!authenticationMethodDTO) {
      throw new AuthenticationMethodNotFoundError(
        `No rows updated for authentication method of type ${identityProvider} for user ${userId}.`
      );
    }
    return _toDomain(authenticationMethodDTO);
  },

  async updatePoleEmploiAuthenticationComplementByUserId({
    authenticationComplement,
    userId
  }: any) {
    const [authenticationMethodDTO] = await knex(AUTHENTICATION_METHODS_TABLE)
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
      .where({ userId, identityProvider: AuthenticationMethod.identityProviders.POLE_EMPLOI })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
      .update({ authenticationComplement, updatedAt: new Date() })
      .returning(COLUMNS);

    if (!authenticationMethodDTO) {
      throw new AuthenticationMethodNotFoundError(
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
        `No rows updated for authentication method of type ${AuthenticationMethod.identityProviders.POLE_EMPLOI} for user ${userId}.`
      );
    }
    return _toDomain(authenticationMethodDTO);
  },

  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  async updateAuthenticationMethodUserId({
    originUserId,
    identityProvider,
    targetUserId
  }: any) {
    await knex(AUTHENTICATION_METHODS_TABLE)
      .where({ userId: originUserId, identityProvider })
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
      .update({ userId: targetUserId, updatedAt: new Date() });
  },
};
