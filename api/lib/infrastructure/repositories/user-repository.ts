// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'omit'.
const omit = require('lodash/omit');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'BookshelfU... Remove this comment to see the full error message
const BookshelfUser = require('../orm-models/User');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isUniqCons... Remove this comment to see the full error message
const { isUniqConstraintViolated } = require('../utils/knex-utils');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');

const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
  AlreadyExistingEntityError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
  AlreadyRegisteredEmailError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
  AlreadyRegisteredUsernameError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotFou... Remove this comment to see the full error message
  UserNotFoundError,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../domain/errors');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'User'.
const User = require('../../domain/models/User');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserDetail... Remove this comment to see the full error message
const UserDetailsForAdmin = require('../../domain/models/UserDetailsForAdmin');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PixRole'.
const PixRole = require('../../domain/models/PixRole');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../domain/models/Membership');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCenter = require('../../domain/models/CertificationCenter');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationCenterMembership = require('../../domain/models/CertificationCenterMembership');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const Organization = require('../../domain/models/Organization');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SchoolingR... Remove this comment to see the full error message
const SchoolingRegistrationForAdmin = require('../../domain/read-models/SchoolingRegistrationForAdmin');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../domain/models/AuthenticationMethod');

const PIX_MASTER_ROLE_ID = 1;

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  getByEmail(email: any) {
    return BookshelfUser.query((qb: any) => {
      qb.whereRaw('LOWER("email") = ?', email.toLowerCase());
    })
      .fetch()
      .then((bookshelfUser: any) => {
        return _toDomain(bookshelfUser);
      })
      .catch((err: any) => {
        if (err instanceof BookshelfUser.NotFoundError) {
          throw new UserNotFoundError(`User not found for email ${email}`);
        }
        throw err;
      });
  },

  getByUsernameOrEmailWithRolesAndPassword(username: any) {
    return BookshelfUser.query((qb: any) => qb.where({ email: username.toLowerCase() }).orWhere({ username: username }))
      .fetch({
        require: false,
        withRelated: [
          { memberships: (qb: any) => qb.where({ disabledAt: null }) },
          { certificationCenterMemberships: (qb: any) => qb.where({ disabledAt: null }) },
          'memberships.organization',
          'pixRoles',
          'certificationCenterMemberships.certificationCenter',
          { authenticationMethods: (qb: any) => qb.where({ identityProvider: 'PIX' }) },
        ],
      })
      .then((foundUser: any) => {
        if (foundUser === null) {
          // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
          return Promise.reject(new UserNotFoundError());
        }
        return _toDomain(foundUser);
      });
  },

  get(userId: any) {
    return BookshelfUser.where({ id: userId })
      .fetch()
      .then((user: any) => bookshelfToDomainConverter.buildDomainObject(BookshelfUser, user))
      .catch((err: any) => {
        if (err instanceof BookshelfUser.NotFoundError) {
          throw new UserNotFoundError(`User not found for ID ${userId}`);
        }
        throw err;
      });
  },

  getForObfuscation(userId: any) {
    return BookshelfUser.where({ id: userId })
      .fetch({ columns: ['id', 'email', 'username'] })
      .then((userAuthenticationMethods: any) => _toUserAuthenticationMethods(userAuthenticationMethods))
      .catch((err: any) => {
        if (err instanceof BookshelfUser.NotFoundError) {
          throw new UserNotFoundError(`User not found for ID ${userId}`);
        }
        throw err;
      });
  },

  getUserDetailsForAdmin(userId: any) {
    return BookshelfUser.where({ id: userId })
      .fetch({
        columns: [
          'id',
          'firstName',
          'lastName',
          'email',
          'username',
          'cgu',
          'pixOrgaTermsOfServiceAccepted',
          'pixCertifTermsOfServiceAccepted',
        ],
        withRelated: [
          {
            schoolingRegistrations: (query: any) => {
              query
                .leftJoin('organizations', 'schooling-registrations.organizationId', 'organizations.id')
                .orderBy('id');
            },
          },
          'schoolingRegistrations.organization',
          'authenticationMethods',
        ],
      })
      .then((userDetailsForAdmin: any) => _toUserDetailsForAdminDomain(userDetailsForAdmin))
      .catch((err: any) => {
        if (err instanceof BookshelfUser.NotFoundError) {
          throw new UserNotFoundError(`User not found for ID ${userId}`);
        }
        throw err;
      });
  },

  findPaginatedFiltered({
    filter,
    page
  }: any) {
    return BookshelfUser.query((qb: any) => _setSearchFiltersForQueryBuilder(filter, qb))
      .fetchPage({
        page: page.number,
        pageSize: page.size,
      })
      .then(({
      models,
      pagination
    }: any) => {
        const users = bookshelfToDomainConverter.buildDomainObjects(BookshelfUser, models);
        return { models: users, pagination };
      });
  },

  getWithMemberships(userId: any) {
    return BookshelfUser.where({ id: userId })
      .fetch({
        require: false,
        withRelated: [{ memberships: (qb: any) => qb.where({ disabledAt: null }) }, 'memberships.organization'],
      })
      .then((foundUser: any) => {
        if (foundUser === null) {
          // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
          return Promise.reject(new UserNotFoundError(`User not found for ID ${userId}`));
        }
        return _toDomain(foundUser);
      });
  },

  getWithCertificationCenterMemberships(userId: any) {
    return BookshelfUser.where({ id: userId })
      .fetch({
        withRelated: [
          { certificationCenterMemberships: (qb: any) => qb.where({ disabledAt: null }) },
          'certificationCenterMemberships.certificationCenter',
        ],
      })
      .then(_toDomain)
      .catch((err: any) => {
        if (err instanceof BookshelfUser.NotFoundError) {
          throw new UserNotFoundError(`User not found for ID ${userId}`);
        }
        throw err;
      });
  },

  async getBySamlId(samlId: any) {
    const bookshelfUser = await BookshelfUser.query((qb: any) => {
      qb.innerJoin('authentication-methods', function () {
        this.on('users.id', 'authentication-methods.userId')
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
          .andOnVal('authentication-methods.identityProvider', AuthenticationMethod.identityProviders.GAR)
          .andOnVal('authentication-methods.externalIdentifier', samlId);
      });
    }).fetch({ require: false, withRelated: 'authenticationMethods' });
    return bookshelfUser ? _toDomain(bookshelfUser) : null;
  },

  create({
    user,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: any) {
    const userToCreate = _adaptModelToDb(user);
    return new BookshelfUser(userToCreate)
      .save(null, { transacting: domainTransaction.knexTransaction })
      .then((bookshelfUser: any) => _toDomain(bookshelfUser));
  },

  updateWithEmailConfirmed({
    id,
    userAttributes,
    domainTransaction: { knexTransaction } = DomainTransaction.emptyTransaction()
  }: any) {
    const query = knex('users').where({ id }).update(userAttributes);
    if (knexTransaction) query.transacting(knexTransaction);
    return query;
  },

  checkIfEmailIsAvailable(email: any) {
    return BookshelfUser.query((qb: any) => qb.whereRaw('LOWER("email") = ?', email.toLowerCase()))
      .fetch({ require: false })
      .then((user: any) => {
        if (user) {
          // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
          return Promise.reject(new AlreadyRegisteredEmailError());
        }

        // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
        return Promise.resolve(email);
      });
  },

  isUserExistingByEmail(email: any) {
    return BookshelfUser.where({ email: email.toLowerCase() })
      .fetch()
      .then(() => true)
      .catch(() => {
        throw new UserNotFoundError();
      });
  },

  updatePassword(id: any, hashedPassword: any) {
    return BookshelfUser.where({ id })
      .save({ password: hashedPassword }, { patch: true, method: 'update' })
      .then((bookshelfUser: any) => _toDomain(bookshelfUser))
      .catch((err: any) => {
        if (err instanceof BookshelfUser.NoRowsUpdatedError) {
          throw new UserNotFoundError(`User not found for ID ${id}`);
        }
        throw err;
      });
  },

  updateEmail({
    id,
    email
  }: any) {
    return BookshelfUser.where({ id })
      .save({ email }, { patch: true, method: 'update' })
      .then((bookshelfUser: any) => _toDomain(bookshelfUser))
      .catch((err: any) => {
        if (err instanceof BookshelfUser.NoRowsUpdatedError) {
          throw new UserNotFoundError(`User not found for ID ${id}`);
        }
        throw err;
      });
  },

  async updateUserDetailsForAdministration(id: any, userAttributes: any) {
    try {
      const updatedUser = await BookshelfUser.where({ id }).save(userAttributes, { patch: true, method: 'update' });
      await updatedUser.related('authenticationMethods').fetch({ require: false });
      return _toUserDetailsForAdminDomain(updatedUser);
    } catch (err) {
      if (err instanceof BookshelfUser.NoRowsUpdatedError) {
        throw new UserNotFoundError(`User not found for ID ${id}`);
      }
      if (isUniqConstraintViolated(err)) {
        throw new AlreadyExistingEntityError('Cette adresse e-mail ou cet identifiant est déjà utilisé(e).');
      }
      throw err;
    }
  },

  async isPixMaster(id: any) {
    const user = await BookshelfUser.where({ 'users.id': id, 'users_pix_roles.user_id': id })
      .query((qb: any) => {
        qb.innerJoin('users_pix_roles', 'users_pix_roles.user_id', 'users.id');
        qb.where({ 'users_pix_roles.pix_role_id': PIX_MASTER_ROLE_ID });
      })
      .fetch({ require: false, columns: 'users.id' });
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(user);
  },

  async updateHasSeenAssessmentInstructionsToTrue(id: any) {
    const user = await BookshelfUser.where({ id }).fetch({ require: false });
    await user.save({ hasSeenAssessmentInstructions: true }, { patch: true, method: 'update' });
    return bookshelfToDomainConverter.buildDomainObject(BookshelfUser, user);
  },

  async updateHasSeenNewDashboardInfoToTrue(id: any) {
    const user = await BookshelfUser.where({ id }).fetch({ require: false });
    await user.save({ hasSeenNewDashboardInfo: true }, { patch: true, method: 'update' });
    return bookshelfToDomainConverter.buildDomainObject(BookshelfUser, user);
  },

  async updateHasSeenChallengeTooltip({
    userId,
    challengeType
  }: any) {
    const user = await BookshelfUser.where({ id: userId }).fetch({ require: false });
    if (challengeType === 'focused') {
      await user.save({ hasSeenFocusedChallengeTooltip: true }, { patch: true, method: 'update' });
    }
    if (challengeType === 'other') {
      await user.save({ hasSeenOtherChallengesTooltip: true }, { patch: true, method: 'update' });
    }
    return bookshelfToDomainConverter.buildDomainObject(BookshelfUser, user);
  },

  async acceptPixLastTermsOfService(id: any) {
    const user = await BookshelfUser.where({ id }).fetch({ require: false });
    await user.save(
      {
        lastTermsOfServiceValidatedAt: moment().toDate(),
        mustValidateTermsOfService: false,
      },
      { patch: true, method: 'update' }
    );
    return bookshelfToDomainConverter.buildDomainObject(BookshelfUser, user);
  },

  async updatePixOrgaTermsOfServiceAcceptedToTrue(id: any) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
    const now = new Date();

    const [user] = await knex('users')
      .where({ id })
      .update({ pixOrgaTermsOfServiceAccepted: true, lastPixOrgaTermsOfServiceValidatedAt: now, updatedAt: now })
      .returning('*');

    return new User(user);
  },

  async updatePixCertifTermsOfServiceAcceptedToTrue(id: any) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
    const now = new Date();

    const [user] = await knex('users')
      .where({ id })
      .update({ pixCertifTermsOfServiceAccepted: true, lastPixCertifTermsOfServiceValidatedAt: now, updatedAt: now })
      .returning('*');

    return new User(user);
  },

  async isUsernameAvailable(username: any) {
    const foundUser = await BookshelfUser.where({ username }).fetch({ require: false });
    if (foundUser) {
      throw new AlreadyRegisteredUsernameError();
    }
    return username;
  },

  updateUsername({
    id,
    username,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: any) {
    return BookshelfUser.where({ id })
      .save(
        { username },
        {
          transacting: domainTransaction.knexTransaction,
          patch: true,
          method: 'update',
        }
      )
      .then((bookshelfUser: any) => _toDomain(bookshelfUser))
      .catch((err: any) => {
        if (err instanceof BookshelfUser.NoRowsUpdatedError) {
          throw new UserNotFoundError(`User not found for ID ${id}`);
        }
        throw err;
      });
  },

  addUsername(id: any, username: any) {
    return BookshelfUser.where({ id })
      .save({ username }, { patch: true, method: 'update' })
      .then((bookshelfUser: any) => _toDomain(bookshelfUser))
      .catch((err: any) => {
        if (err instanceof BookshelfUser.NoRowsUpdatedError) {
          throw new UserNotFoundError(`User not found for ID ${id}`);
        }
        throw err;
      });
  },

  async updateUserAttributes(id: any, userAttributes: any) {
    try {
      const bookshelfUser = await BookshelfUser.where({ id }).save(userAttributes, { patch: true, method: 'update' });
      return _toDomain(bookshelfUser);
    } catch (err) {
      if (err instanceof BookshelfUser.NoRowsUpdatedError) {
        throw new UserNotFoundError(`User not found for ID ${id}`);
      }
      throw err;
    }
  },

  async findByPoleEmploiExternalIdentifier(externalIdentityId: any) {
    const bookshelfUser = await BookshelfUser.query((qb: any) => {
      qb.innerJoin('authentication-methods', function () {
        this.on('users.id', 'authentication-methods.userId')
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
          .andOnVal('authentication-methods.identityProvider', AuthenticationMethod.identityProviders.POLE_EMPLOI)
          .andOnVal('authentication-methods.externalIdentifier', externalIdentityId);
      });
    }).fetch({ require: false, withRelated: 'authenticationMethods' });
    return bookshelfUser ? _toDomain(bookshelfUser) : null;
  },

  async findAnotherUserByEmail(userId: any, email: any) {
    return BookshelfUser.where('id', '!=', userId)
      .where({ email: email.toLowerCase() })
      .fetchAll()
      .then((users: any) => bookshelfToDomainConverter.buildDomainObjects(BookshelfUser, users));
  },

  async findAnotherUserByUsername(userId: any, username: any) {
    return BookshelfUser.where('id', '!=', userId)
      .where({ username })
      .fetchAll()
      .then((users: any) => bookshelfToDomainConverter.buildDomainObjects(BookshelfUser, users));
  },

  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  async updateLastLoggedAt({
    userId
  }: any) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
    const now = new Date();

    await knex('users').where({ id: userId }).update({ lastLoggedAt: now });
  },
};

function _toUserDetailsForAdminDomain(bookshelfUser: any) {
  const rawUserDetailsForAdmin = bookshelfUser.toJSON();
  return new UserDetailsForAdmin({
    id: rawUserDetailsForAdmin.id,
    firstName: rawUserDetailsForAdmin.firstName,
    lastName: rawUserDetailsForAdmin.lastName,
    birthdate: rawUserDetailsForAdmin.birthdate,
    organizationId: rawUserDetailsForAdmin.organizationId,
    username: rawUserDetailsForAdmin.username,
    email: rawUserDetailsForAdmin.email,
    cgu: rawUserDetailsForAdmin.cgu,
    pixOrgaTermsOfServiceAccepted: rawUserDetailsForAdmin.pixOrgaTermsOfServiceAccepted,
    pixCertifTermsOfServiceAccepted: rawUserDetailsForAdmin.pixCertifTermsOfServiceAccepted,
    schoolingRegistrations: _toSchoolingRegistrationsForAdmin(rawUserDetailsForAdmin.schoolingRegistrations),
    authenticationMethods: rawUserDetailsForAdmin.authenticationMethods,
  });
}

function _toSchoolingRegistrationsForAdmin(schoolingRegistrations: any) {
  if (!schoolingRegistrations) {
    return [];
  }
  return schoolingRegistrations.map((schoolingRegistration: any) => {
    return new SchoolingRegistrationForAdmin({
      id: schoolingRegistration.id,
      firstName: schoolingRegistration.firstName,
      lastName: schoolingRegistration.lastName,
      birthdate: schoolingRegistration.birthdate,
      division: schoolingRegistration.division,
      group: schoolingRegistration.group,
      organizationId: schoolingRegistration.organization.id,
      organizationName: schoolingRegistration.organization.name,
      createdAt: schoolingRegistration.createdAt,
      updatedAt: schoolingRegistration.updatedAt,
      isDisabled: schoolingRegistration.isDisabled,
      organizationIsManagingStudents: schoolingRegistration.organization.isManagingStudents,
    });
  });
}

function _toUserAuthenticationMethods(bookshelfUser: any) {
  const rawUser = bookshelfUser.toJSON();
  return new User({
    id: rawUser.id,
    email: rawUser.email,
    username: rawUser.username,
  });
}

function _toCertificationCenterMembershipsDomain(certificationCenterMembershipBookshelf: any) {
  return certificationCenterMembershipBookshelf.map((bookshelf: any) => {
    return new CertificationCenterMembership({
      id: bookshelf.get('id'),
      certificationCenter: new CertificationCenter({
        id: bookshelf.related('certificationCenter').get('id'),
        name: bookshelf.related('certificationCenter').get('name'),
      }),
    });
  });
}

function _toMembershipsDomain(membershipsBookshelf: any) {
  return membershipsBookshelf.map((membershipBookshelf: any) => {
    return new Membership({
      id: membershipBookshelf.get('id'),
      organizationRole: membershipBookshelf.get('organizationRole'),
      organization: new Organization({
        id: membershipBookshelf.related('organization').get('id'),
        code: membershipBookshelf.related('organization').get('code'),
        name: membershipBookshelf.related('organization').get('name'),
        type: membershipBookshelf.related('organization').get('type'),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
        isManagingStudents: Boolean(membershipBookshelf.related('organization').get('isManagingStudents')),
        externalId: membershipBookshelf.related('organization').get('externalId'),
      }),
    });
  });
}

function _toPixRolesDomain(pixRolesBookshelf: any) {
  return pixRolesBookshelf.map((pixRoleBookshelf: any) => {
    return new PixRole({
      id: pixRoleBookshelf.get('id'),
      name: pixRoleBookshelf.get('name'),
    });
  });
}

function _getAuthenticationComplementAndExternalIdentifier(authenticationMethodBookshelf: any) {
  const identityProvider = authenticationMethodBookshelf.get('identityProvider');

  let authenticationComplement = authenticationMethodBookshelf.get('authenticationComplement');
  let externalIdentifier = authenticationMethodBookshelf.get('externalIdentifier');

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
  if (identityProvider === AuthenticationMethod.identityProviders.PIX) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'PixAuthenticationComplement' does not ex... Remove this comment to see the full error message
    authenticationComplement = new AuthenticationMethod.PixAuthenticationComplement({
      password: authenticationComplement.password,
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
      shouldChangePassword: Boolean(authenticationComplement.shouldChangePassword),
    });
    externalIdentifier = undefined;
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
  } else if (identityProvider === AuthenticationMethod.identityProviders.POLE_EMPLOI) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'PoleEmploiAuthenticationComplement' does... Remove this comment to see the full error message
    authenticationComplement = new AuthenticationMethod.PoleEmploiAuthenticationComplement({
      accessToken: authenticationComplement.accessToken,
      refreshToken: authenticationComplement.refreshToken,
      expiredDate: authenticationComplement.expiredDate,
    });
  }

  return { authenticationComplement, externalIdentifier };
}

function _toAuthenticationMethodsDomain(authenticationMethodsBookshelf: any) {
  return authenticationMethodsBookshelf.map((authenticationMethodBookshelf: any) => {
    const { authenticationComplement, externalIdentifier } =
      _getAuthenticationComplementAndExternalIdentifier(authenticationMethodBookshelf);

    return new AuthenticationMethod({
      id: authenticationMethodBookshelf.get('id'),
      userId: authenticationMethodBookshelf.get('userId'),
      identityProvider: authenticationMethodBookshelf.get('identityProvider'),
      externalIdentifier,
      authenticationComplement,
    });
  });
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(userBookshelf: any) {
  return new User({
    id: userBookshelf.get('id'),
    firstName: userBookshelf.get('firstName'),
    lastName: userBookshelf.get('lastName'),
    email: userBookshelf.get('email'),
    emailConfirmedAt: userBookshelf.get('emailConfirmedAt'),
    username: userBookshelf.get('username'),
    password: userBookshelf.get('password'),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    shouldChangePassword: Boolean(userBookshelf.get('shouldChangePassword')),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    cgu: Boolean(userBookshelf.get('cgu')),
    lang: userBookshelf.get('lang'),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    isAnonymous: Boolean(userBookshelf.get('isAnonymous')),
    lastTermsOfServiceValidatedAt: userBookshelf.get('lastTermsOfServiceValidatedAt'),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    hasSeenNewDashboardInfo: Boolean(userBookshelf.get('hasSeenNewDashboardInfo')),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    mustValidateTermsOfService: Boolean(userBookshelf.get('mustValidateTermsOfService')),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    pixOrgaTermsOfServiceAccepted: Boolean(userBookshelf.get('pixOrgaTermsOfServiceAccepted')),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    pixCertifTermsOfServiceAccepted: Boolean(userBookshelf.get('pixCertifTermsOfServiceAccepted')),
    memberships: _toMembershipsDomain(userBookshelf.related('memberships')),
    certificationCenterMemberships: _toCertificationCenterMembershipsDomain(
      userBookshelf.related('certificationCenterMemberships')
    ),
    pixRoles: _toPixRolesDomain(userBookshelf.related('pixRoles')),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    hasSeenAssessmentInstructions: Boolean(userBookshelf.get('hasSeenAssessmentInstructions')),
    authenticationMethods: _toAuthenticationMethodsDomain(userBookshelf.related('authenticationMethods')),
  });
}

function _setSearchFiltersForQueryBuilder(filter: any, qb: any) {
  const { firstName, lastName, email } = filter;

  if (firstName) {
    qb.whereRaw('LOWER("firstName") LIKE ?', `%${firstName.toLowerCase()}%`);
  }
  if (lastName) {
    qb.whereRaw('LOWER("lastName") LIKE ?', `%${lastName.toLowerCase()}%`);
  }
  if (email) {
    qb.whereRaw('email LIKE ?', `%${email.toLowerCase()}%`);
  }
}

function _adaptModelToDb(user: any) {
  const userToBeSaved = omit(user, [
    'id',
    'campaignParticipations',
    'pixRoles',
    'memberships',
    'certificationCenterMemberships',
    'pixScore',
    'knowledgeElements',
    'scorecards',
    'userOrgaSettings',
    'authenticationMethods',
  ]);

  return userToBeSaved;
}
