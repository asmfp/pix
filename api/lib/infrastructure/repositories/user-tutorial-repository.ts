// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Tutorial'.
const Tutorial = require('../../domain/models/Tutorial');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserSavedT... Remove this comment to see the full error message
const UserSavedTutorial = require('../../domain/models/UserSavedTutorial');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserSavedT... Remove this comment to see the full error message
const UserSavedTutorialWithTutorial = require('../../domain/models/UserSavedTutorialWithTutorial');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'tutorialDa... Remove this comment to see the full error message
const tutorialDatasource = require('../datasources/learning-content/tutorial-datasource');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fetchPage'... Remove this comment to see the full error message
const { fetchPage } = require('../utils/knex-utils');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TABLE_NAME... Remove this comment to see the full error message
const TABLE_NAME = 'user-saved-tutorials';

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async addTutorial({
    userId,
    tutorialId,
    skillId
  }: any) {
    const userSavedTutorials = await knex(TABLE_NAME).where({ userId, tutorialId });
    if (userSavedTutorials.length) {
      return _toDomain(userSavedTutorials[0]);
    }
    const savedUserSavedTutorials = await knex(TABLE_NAME).insert({ userId, tutorialId, skillId }).returning('*');
    return _toDomain(savedUserSavedTutorials[0]);
  },

  async find({
    userId
  }: any) {
    const userSavedTutorials = await knex(TABLE_NAME).where({ userId });
    return userSavedTutorials.map(_toDomain);
  },

  async findPaginated({
    userId,
    page
  }: any) {
    const query = knex(TABLE_NAME).where({ userId });
    const { results, pagination } = await fetchPage(query, page);
    const userSavedTutorials = results.map(_toDomain);
    return { models: userSavedTutorials, meta: pagination };
  },

  // TODO delete when tutorial V2 becomes main version
  async findWithTutorial({
    userId
  }: any) {
    const userSavedTutorials = await knex(TABLE_NAME).where({ userId });
    const tutorials = await tutorialDatasource.findByRecordIds(userSavedTutorials.map(({
      tutorialId
    }: any) => tutorialId));
    return tutorials.map((tutorial: any) => {
      const userSavedTutorial = userSavedTutorials.find(({
        tutorialId
      }: any) => tutorialId === tutorial.id);
      return new UserSavedTutorialWithTutorial({
        ...userSavedTutorial,
        tutorial: new Tutorial(tutorial),
      });
    });
  },

  async removeFromUser(userSavedTutorial: any) {
    return knex(TABLE_NAME).where(userSavedTutorial).delete();
  },
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(userSavedTutorial: any) {
  return new UserSavedTutorial({
    id: userSavedTutorial.id,
    tutorialId: userSavedTutorial.tutorialId,
    userId: userSavedTutorial.userId,
    skillId: userSavedTutorial.skillId,
  });
}
