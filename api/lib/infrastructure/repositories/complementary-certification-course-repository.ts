// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async hasComplementaryCertification({
    certificationCourseId,
    complementaryCertificationName
  }: any) {
    const result = await knex
      .from('complementary-certification-courses')
      .select(1)
      .innerJoin(
        'complementary-certifications',
        'complementary-certifications.id',
        'complementary-certification-courses.complementaryCertificationId'
      )
      .where({ certificationCourseId, name: complementaryCertificationName })
      .first();

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(result);
  },
};
