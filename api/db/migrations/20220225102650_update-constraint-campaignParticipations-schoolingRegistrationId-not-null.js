const CAMPAIGNPARTICIPATIONS_TABLE = 'campaign-participations';
const ISIMPROVED_COLUMN = 'isImproved';
const SCHOOLINGREGISTRATIONID_COLUMN = 'schoolingRegistrationId';
const CAMPAIGNID_COLUMN = 'campaignId';
const USERID_COLUMN = 'userId';
const OLD_CONSTRAINT_NAME = 'campaign_participations_campaignid_userid_isimproved';
const NEW_CONSTRAINT_NAME = 'campaign_participations_campaignid_schoolingregistrationid_isimproved';

exports.up = async (knex) => {
  // eslint-disable-next-line knex/avoid-injections
  await knex.raw(`DROP INDEX ${OLD_CONSTRAINT_NAME};`);

  // eslint-disable-next-line knex/avoid-injections
  return knex.raw(
    `CREATE UNIQUE INDEX ${NEW_CONSTRAINT_NAME} ON "${CAMPAIGNPARTICIPATIONS_TABLE}" ("${CAMPAIGNID_COLUMN}", "${SCHOOLINGREGISTRATIONID_COLUMN}" ) WHERE "${ISIMPROVED_COLUMN}" IS FALSE;`
  );
};

exports.down = async (knex) => {
  // eslint-disable-next-line knex/avoid-injections
  await knex.raw(`DROP INDEX ${NEW_CONSTRAINT_NAME};`);
  await `CREATE UNIQUE INDEX ${OLD_CONSTRAINT_NAME} ON "${CAMPAIGNPARTICIPATIONS_TABLE}" ("${CAMPAIGNID_COLUMN}", "${USERID_COLUMN}" ) WHERE "${ISIMPROVED_COLUMN}" IS FALSE;`;
};
