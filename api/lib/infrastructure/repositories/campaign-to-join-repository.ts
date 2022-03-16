// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignTo... Remove this comment to see the full error message
const CampaignToJoin = require('../../domain/read-models/CampaignToJoin');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../DomainTransaction');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(id: any, domainTransaction = DomainTransaction.emptyTransaction()) {
    const knexConn = domainTransaction.knexTransaction || knex;
    const result = await knexConn('campaigns')
      .select('campaigns.*')
      .select({
        organizationId: 'organizations.id',
        organizationName: 'organizations.name',
        organizationType: 'organizations.type',
        organizationLogoUrl: 'organizations.logoUrl',
        organizationIsManagingStudents: 'organizations.isManagingStudents',
        organizationShowNPS: 'organizations.showNPS',
        organizationFormNPSUrl: 'organizations.formNPSUrl',
        targetProfileName: 'target-profiles.name',
        targetProfileImageUrl: 'target-profiles.imageUrl',
      })
      .join('organizations', 'organizations.id', 'campaigns.organizationId')
      .leftJoin('target-profiles', 'target-profiles.id', 'campaigns.targetProfileId')
      .where('campaigns.id', id)
      .first();

    if (!result) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new NotFoundError(`La campagne d'id ${id} n'existe pas ou son accès est restreint`);
    }

    return new CampaignToJoin(result);
  },

  async getByCode(code: any) {
    const result = await knex('campaigns')
      .select('campaigns.*')
      .select({
        organizationId: 'organizations.id',
        organizationName: 'organizations.name',
        organizationType: 'organizations.type',
        organizationLogoUrl: 'organizations.logoUrl',
        organizationIsManagingStudents: 'organizations.isManagingStudents',
        organizationShowNPS: 'organizations.showNPS',
        organizationFormNPSUrl: 'organizations.formNPSUrl',
        targetProfileName: 'target-profiles.name',
        targetProfileImageUrl: 'target-profiles.imageUrl',
        targetProfileIsSimplifiedAccess: 'target-profiles.isSimplifiedAccess',
      })
      .select(
        knex.raw(`EXISTS(SELECT true FROM "organization-tags"
        JOIN tags ON "organization-tags"."tagId" = "tags".id
        WHERE "tags"."name" = 'POLE EMPLOI' AND "organization-tags"."organizationId" = "organizations".id) as "organizationIsPoleEmploi"`)
      )
      .join('organizations', 'organizations.id', 'campaigns.organizationId')
      .leftJoin('target-profiles', 'target-profiles.id', 'campaigns.targetProfileId')
      .leftJoin('organization-tags', 'organization-tags.organizationId', 'organizations.id')
      .leftJoin('tags', 'tags.id', 'organization-tags.tagId')
      .where('campaigns.code', code)
      .first();

    if (!result) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new NotFoundError(`La campagne au code ${code} n'existe pas ou son accès est restreint`);
    }

    return new CampaignToJoin(result);
  },
};
