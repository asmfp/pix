// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async save(complementaryCertification: any) {
    const columnsToSave = {
      complementaryCertificationId: complementaryCertification.complementaryCertificationId,
      certificationCenterId: complementaryCertification.certificationCenterId,
    };
    return await knex('complementary-certification-habilitations').insert(columnsToSave).returning('id');
  },

  async deleteByCertificationCenterId(certificationCenterId: any) {
    return await knex('complementary-certification-habilitations')
      .delete()
      .where({ certificationCenterId })
      .returning('id');
  },
};
