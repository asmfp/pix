// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
  NotFoundError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SchoolingR... Remove this comment to see the full error message
  SchoolingRegistrationNotFound,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SchoolingR... Remove this comment to see the full error message
  SchoolingRegistrationsCouldNotBeSavedError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserCouldN... Remove this comment to see the full error message
  UserCouldNotBeReconciledError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotFou... Remove this comment to see the full error message
  UserNotFoundError,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../domain/errors');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserWithSc... Remove this comment to see the full error message
const UserWithSchoolingRegistration = require('../../domain/models/UserWithSchoolingRegistration');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../domain/models/AuthenticationMethod');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SchoolingR... Remove this comment to see the full error message
const SchoolingRegistration = require('../../domain/models/SchoolingRegistration');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SchoolingR... Remove this comment to see the full error message
const SchoolingRegistrationForAdmin = require('../../domain/read-models/SchoolingRegistrationForAdmin');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const studentRepository = require('./student-repository');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Bookshelf'... Remove this comment to see the full error message
const Bookshelf = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'BookshelfS... Remove this comment to see the full error message
const BookshelfSchoolingRegistration = require('../orm-models/SchoolingRegistration');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');

function _toUserWithSchoolingRegistrationDTO(BookshelfSchoolingRegistration: any) {
  const rawUserWithSchoolingRegistration = BookshelfSchoolingRegistration.toJSON();

  return new UserWithSchoolingRegistration({
    ...rawUserWithSchoolingRegistration,
    isAuthenticatedFromGAR: !!rawUserWithSchoolingRegistration.samlId,
  });
}

function _setSchoolingRegistrationFilters(
  qb: any,
  {
    lastName,
    firstName,
    studentNumber,
    divisions,
    groups,
    connexionType
  }: any = {}
) {
  if (lastName) {
    qb.whereRaw('LOWER("schooling-registrations"."lastName") LIKE ?', `%${lastName.toLowerCase()}%`);
  }
  if (firstName) {
    qb.whereRaw('LOWER("schooling-registrations"."firstName") LIKE ?', `%${firstName.toLowerCase()}%`);
  }
  if (studentNumber) {
    qb.whereRaw('LOWER("schooling-registrations"."studentNumber") LIKE ?', `%${studentNumber.toLowerCase()}%`);
  }
  if (!_.isEmpty(divisions)) {
    qb.whereIn('division', divisions);
  }
  if (groups) {
    qb.whereIn(
      knex.raw('LOWER("schooling-registrations"."group")'),
      groups.map((group: any) => group.toLowerCase())
    );
  }
  if (connexionType === 'none') {
    qb.whereRaw('"users"."username" IS NULL');
    qb.whereRaw('"users"."email" IS NULL');
    // we only retrieve GAR authentication method in join clause
    qb.whereRaw('"authentication-methods"."externalIdentifier" IS NULL');
  } else if (connexionType === 'identifiant') {
    qb.whereRaw('"users"."username" IS NOT NULL');
  } else if (connexionType === 'email') {
    qb.whereRaw('"users"."email" IS NOT NULL');
  } else if (connexionType === 'mediacentre') {
    // we only retrieve GAR authentication method in join clause
    qb.whereRaw('"authentication-methods"."externalIdentifier" IS NOT NULL');
  }
}

function _canReconcile(existingSchoolingRegistrations: any, student: any) {
  const existingRegistrationForUserId = existingSchoolingRegistrations.find((currentSchoolingRegistration: any) => {
    return currentSchoolingRegistration.userId === student.account.userId;
  });
  return (
    existingRegistrationForUserId == null ||
    existingRegistrationForUserId.nationalStudentId === student.nationalStudentId
  );
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  findByIds({
    ids
  }: any) {
    const schoolingRegistrations = BookshelfSchoolingRegistration.where('id', 'in', ids).fetchAll();

    return bookshelfToDomainConverter.buildDomainObjects(BookshelfSchoolingRegistration, schoolingRegistrations);
  },

  findByOrganizationId({
    organizationId
  }: any, transaction = DomainTransaction.emptyTransaction()) {
    const knexConn = transaction.knexTransaction || knex;
    return knexConn('schooling-registrations')
      .where({ organizationId })
      .orderByRaw('LOWER("lastName") ASC, LOWER("firstName") ASC')
      .then((schoolingRegistrations: any) => schoolingRegistrations.map((schoolingRegistration: any) => new SchoolingRegistration(schoolingRegistration))
      );
  },

  async findByOrganizationIdAndUpdatedAtOrderByDivision({
    organizationId,
    page,
    filter
  }: any) {
    const BEGINNING_OF_THE_2020_SCHOOL_YEAR = '2020-08-15';
    const query = BookshelfSchoolingRegistration.where((qb: any) => {
      qb.where({ organizationId });
      qb.where('updatedAt', '>', BEGINNING_OF_THE_2020_SCHOOL_YEAR);
      qb.where('isDisabled', false);
    })
      .query((qb: any) => {
        qb.orderByRaw('LOWER("division") ASC, LOWER("lastName") ASC, LOWER("firstName") ASC');
        if (filter.divisions) {
          qb.whereIn('division', filter.divisions);
        }
      })
      .fetchPage({
        page: page.number,
        pageSize: page.size,
      });

    const { models, pagination } = await query;

    return {
      data: bookshelfToDomainConverter.buildDomainObjects(BookshelfSchoolingRegistration, models),
      pagination,
    };
  },

  async findByUserId({
    userId
  }: any) {
    const schoolingRegistrations = await BookshelfSchoolingRegistration.where({ userId }).orderBy('id').fetchAll();

    return bookshelfToDomainConverter.buildDomainObjects(BookshelfSchoolingRegistration, schoolingRegistrations);
  },

  async isSchoolingRegistrationIdLinkedToUserAndSCOOrganization({
    userId,
    schoolingRegistrationId
  }: any) {
    const exist = await Bookshelf.knex('schooling-registrations')
      .select('schooling-registrations.id')
      .join('organizations', 'schooling-registrations.organizationId', 'organizations.id')
      .where({ userId, type: 'SCO', 'schooling-registrations.id': schoolingRegistrationId })
      .first();

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(exist);
  },

  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  async disableAllSchoolingRegistrationsInOrganization({
    domainTransaction,
    organizationId
  }: any) {
    const knexConn = domainTransaction.knexTransaction;
    await knexConn('schooling-registrations')
      .where({ organizationId, isDisabled: false })
      .update({ isDisabled: true, updatedAt: knexConn.raw('CURRENT_TIMESTAMP') });
  },

  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  async addOrUpdateOrganizationSchoolingRegistrations(schoolingRegistrationDatas: any, organizationId: any, domainTransaction: any) {
    const knexConn = domainTransaction.knexTransaction;
    const schoolingRegistrationsFromFile = schoolingRegistrationDatas.map(
      (schoolingRegistrationData: any) => new SchoolingRegistration({
        ...schoolingRegistrationData,
        organizationId,
      })
    );
    const existingSchoolingRegistrations = await this.findByOrganizationId({ organizationId }, domainTransaction);

    const reconciledSchoolingRegistrationsToImport = await this._reconcileSchoolingRegistrations(
      schoolingRegistrationsFromFile,
      existingSchoolingRegistrations,
      domainTransaction
    );

    try {
      const schoolingRegistrationsToSave = reconciledSchoolingRegistrationsToImport.map((schoolingRegistration: any) => ({
        ..._.omit(schoolingRegistration, ['id', 'createdAt']),
        updatedAt: knexConn.raw('CURRENT_TIMESTAMP'),
        isDisabled: false
      }));

      await knexConn('schooling-registrations')
        .insert(schoolingRegistrationsToSave)
        .onConflict(['organizationId', 'nationalStudentId'])
        .merge();
    } catch (err) {
      throw new SchoolingRegistrationsCouldNotBeSavedError();
    }
  },

  async _reconcileSchoolingRegistrations(
    schoolingRegistrationsToImport: any,
    existingSchoolingRegistrations: any,
    domainTransaction: any
  ) {
    const nationalStudentIdsFromFile = schoolingRegistrationsToImport.map(
      (schoolingRegistrationData: any) => schoolingRegistrationData.nationalStudentId
    );
    const students = await studentRepository.findReconciledStudentsByNationalStudentId(
      _.compact(nationalStudentIdsFromFile),
      domainTransaction
    );

    _.each(students, (student: any) => {
      const alreadyReconciledSchoolingRegistration = _.find(schoolingRegistrationsToImport, {
        userId: student.account.userId,
      });

      if (alreadyReconciledSchoolingRegistration) {
        alreadyReconciledSchoolingRegistration.userId = null;
      } else if (_canReconcile(existingSchoolingRegistrations, student)) {
        const schoolingRegistration = _.find(schoolingRegistrationsToImport, {
          nationalStudentId: student.nationalStudentId,
        });
        schoolingRegistration.userId = student.account.userId;
      }
    });
    return schoolingRegistrationsToImport;
  },

  async findByOrganizationIdAndBirthdate({
    organizationId,
    birthdate
  }: any) {
    const schoolingRegistrations = await BookshelfSchoolingRegistration.query((qb: any) => {
      qb.where('organizationId', organizationId);
      qb.where('birthdate', birthdate);
      qb.where('isDisabled', false);
    }).fetchAll();

    return bookshelfToDomainConverter.buildDomainObjects(BookshelfSchoolingRegistration, schoolingRegistrations);
  },

  async reconcileUserToSchoolingRegistration({
    userId,
    schoolingRegistrationId
  }: any) {
    try {
      const schoolingRegistration = await BookshelfSchoolingRegistration.where({ id: schoolingRegistrationId })
        .where('isDisabled', false)
        .save(
          { userId },
          {
            patch: true,
          }
        );
      return bookshelfToDomainConverter.buildDomainObject(BookshelfSchoolingRegistration, schoolingRegistration);
    } catch (error) {
      throw new UserCouldNotBeReconciledError();
    }
  },

  async reconcileUserByNationalStudentIdAndOrganizationId({
    nationalStudentId,
    userId,
    organizationId
  }: any) {
    try {
      const schoolingRegistration = await BookshelfSchoolingRegistration.where({
        organizationId,
        nationalStudentId,
        isDisabled: false,
      }).save({ userId }, { patch: true });
      return bookshelfToDomainConverter.buildDomainObject(BookshelfSchoolingRegistration, schoolingRegistration);
    } catch (error) {
      throw new UserCouldNotBeReconciledError();
    }
  },

  async getSchoolingRegistrationForAdmin(schoolingRegistrationId: any) {
    const schoolingRegistration = await knex('schooling-registrations')
      .select(
        'schooling-registrations.id as id',
        'firstName',
        'lastName',
        'birthdate',
        'division',
        'group',
        'organizationId',
        'organizations.name as organizationName',
        'schooling-registrations.createdAt as createdAt',
        'schooling-registrations.updatedAt as updatedAt',
        'isDisabled',
        'organizations.isManagingStudents as organizationIsManagingStudents'
      )
      .innerJoin('organizations', 'organizations.id', 'schooling-registrations.organizationId')
      .where({ 'schooling-registrations.id': schoolingRegistrationId })
      .first();

    if (!schoolingRegistration) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new NotFoundError(`Schooling registration not found for ID ${schoolingRegistrationId}`);
    }
    return new SchoolingRegistrationForAdmin(schoolingRegistration);
  },

  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  async dissociateUserFromSchoolingRegistration(schoolingRegistrationId: any) {
    await BookshelfSchoolingRegistration.where({ id: schoolingRegistrationId }).save(
      { userId: null },
      {
        patch: true,
      }
    );
  },

  async findOneByUserIdAndOrganizationId({
    userId,
    organizationId,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: any) {
    const schoolingRegistration = await knex('schooling-registrations')
      .transacting(domainTransaction)
      .first('*')
      .where({ userId, organizationId });
    if (!schoolingRegistration) return null;
    return new SchoolingRegistration(schoolingRegistration);
  },

  get(schoolingRegistrationId: any) {
    return BookshelfSchoolingRegistration.where({ id: schoolingRegistrationId })
      .fetch()
      .then((schoolingRegistration: any) => bookshelfToDomainConverter.buildDomainObject(BookshelfSchoolingRegistration, schoolingRegistration)
      )
      .catch((err: any) => {
        if (err instanceof BookshelfSchoolingRegistration.NotFoundError) {
          // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
          throw new NotFoundError(`Student not found for ID ${schoolingRegistrationId}`);
        }
        throw err;
      });
  },

  async getLatestSchoolingRegistration({
    nationalStudentId,
    birthdate
  }: any) {
    const schoolingRegistration = await knex
      .where({ nationalStudentId, birthdate })
      .whereNotNull('userId')
      .select()
      .from('schooling-registrations')
      .orderBy('updatedAt', 'desc')
      .first();

    if (!schoolingRegistration) {
      throw new UserNotFoundError();
    }

    return schoolingRegistration;
  },

  async findPaginatedFilteredSchoolingRegistrations({
    organizationId,
    filter,
    page = {}
  }: any) {
    const { models, pagination } = await BookshelfSchoolingRegistration.where({ organizationId })
      .query((qb: any) => {
        qb.select(
          'schooling-registrations.id',
          'schooling-registrations.firstName',
          'schooling-registrations.lastName',
          'schooling-registrations.birthdate',
          'schooling-registrations.division',
          'schooling-registrations.group',
          'schooling-registrations.studentNumber',
          'schooling-registrations.userId',
          'schooling-registrations.organizationId',
          'users.username',
          'users.email',
          'authentication-methods.externalIdentifier as samlId'
        );
        qb.orderByRaw(
          'LOWER("schooling-registrations"."lastName") ASC, LOWER("schooling-registrations"."firstName") ASC'
        );
        qb.leftJoin('users', 'schooling-registrations.userId', 'users.id');
        qb.leftJoin('authentication-methods', function () {
          this.on('users.id', 'authentication-methods.userId').andOnVal(
            'authentication-methods.identityProvider',
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
            AuthenticationMethod.identityProviders.GAR
          );
        });
        qb.where('schooling-registrations.isDisabled', false);
        qb.modify(_setSchoolingRegistrationFilters, filter);
      })
      .fetchPage({
        page: page.number,
        pageSize: page.size,
        withRelated: ['user'],
      });

    return {
      data: models.map(_toUserWithSchoolingRegistrationDTO),
      pagination,
    };
  },

  updateUserIdWhereNull({
    schoolingRegistrationId,
    userId,
    domainTransaction = DomainTransaction.emptyTransaction()
  }: any) {
    return BookshelfSchoolingRegistration.where({ id: schoolingRegistrationId, userId: null })
      .save(
        { userId },
        {
          transacting: domainTransaction.knexTransaction,
          patch: true,
          method: 'update',
        }
      )
      .then((schoolingRegistration: any) => bookshelfToDomainConverter.buildDomainObject(BookshelfSchoolingRegistration, schoolingRegistration)
      )
      .catch((err: any) => {
        if (err instanceof BookshelfSchoolingRegistration.NoRowsUpdatedError) {
          throw new SchoolingRegistrationNotFound(
            `SchoolingRegistration not found for ID ${schoolingRegistrationId} and user ID null.`
          );
        }
        throw err;
      });
  },

  async isActive({
    userId,
    campaignId
  }: any) {
    const registration = await knex('schooling-registrations')
      .select('schooling-registrations.isDisabled')
      .join('organizations', 'organizations.id', 'schooling-registrations.organizationId')
      .join('campaigns', 'campaigns.organizationId', 'organizations.id')
      .where({ 'campaigns.id': campaignId })
      .andWhere({ 'schooling-registrations.userId': userId })
      .first();
    return !registration?.isDisabled;
  },
};
