// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SchoolingR... Remove this comment to see the full error message
const { SchoolingRegistrationsCouldNotBeSavedError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'BookshelfS... Remove this comment to see the full error message
const BookshelfSchoolingRegistration = require('../orm-models/SchoolingRegistration');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bookshelfT... Remove this comment to see the full error message
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');

const ATTRIBUTES_TO_SAVE = [
  'firstName',
  'middleName',
  'thirdName',
  'lastName',
  'preferredLastName',
  'studentNumber',
  'email',
  'diploma',
  'department',
  'educationalTeam',
  'group',
  'status',
  'birthdate',
  'organizationId',
];

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  async updateStudentNumber(studentId: any, studentNumber: any) {
    await BookshelfSchoolingRegistration.where('id', studentId).save(
      { studentNumber },
      {
        patch: true,
      }
    );
  },

  async findOneByStudentNumberAndBirthdate({
    organizationId,
    studentNumber,
    birthdate
  }: any) {
    const schoolingRegistration = await BookshelfSchoolingRegistration.query((qb: any) => {
      qb.where('organizationId', organizationId);
      qb.where('birthdate', birthdate);
      qb.where('isDisabled', false);
      qb.whereRaw('LOWER(?)=LOWER(??)', [studentNumber, 'studentNumber']);
    }).fetch({ require: false });

    return bookshelfToDomainConverter.buildDomainObject(BookshelfSchoolingRegistration, schoolingRegistration);
  },

  async findOneByStudentNumber({
    organizationId,
    studentNumber
  }: any) {
    const schoolingRegistration = await BookshelfSchoolingRegistration.query((qb: any) => {
      qb.where('organizationId', organizationId);
      qb.whereRaw('LOWER(?)=LOWER(??)', [studentNumber, 'studentNumber']);
    }).fetch({ require: false });

    return bookshelfToDomainConverter.buildDomainObject(BookshelfSchoolingRegistration, schoolingRegistration);
  },

  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  async addStudents(higherSchoolingRegistrations: any) {
    await _upsertStudents(knex, higherSchoolingRegistrations);
  },

  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  async replaceStudents(organizationId: any, higherSchoolingRegistrations: any) {
    // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
    await knex.transaction(async (transaction: any) => {
      await _disableAllRegistrations(transaction, organizationId);
      await _upsertStudents(transaction, higherSchoolingRegistrations);
    });
  },
};

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
async function _disableAllRegistrations(queryBuilder: any, organizationId: any) {
  await queryBuilder('schooling-registrations')
    .update({ isDisabled: true, updatedAt: knex.raw('CURRENT_TIMESTAMP') })
    .where({ organizationId, isDisabled: false });
}

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
async function _upsertStudents(queryBuilder: any, higherSchoolingRegistrations: any) {
  const registrationsToInsert = higherSchoolingRegistrations.map((registration: any) => ({
    ..._.pick(registration, ATTRIBUTES_TO_SAVE),
    status: registration.studyScheme,
    isDisabled: false,
    updatedAt: knex.raw('CURRENT_TIMESTAMP')
  }));

  try {
    await queryBuilder('schooling-registrations')
      .insert(registrationsToInsert)
      .onConflict(['organizationId', 'studentNumber'])
      .merge();
  } catch (error) {
    throw new SchoolingRegistrationsCouldNotBeSavedError();
  }
}
