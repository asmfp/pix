// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationPointOfContact = require('../../domain/read-models/CertificationPointOfContact');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AllowedCer... Remove this comment to see the full error message
const AllowedCertificationCenterAccess = require('../../domain/read-models/AllowedCertificationCenterAccess');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(userId: any) {
    const certificationPointOfContactDTO = await knex
      .select({
        id: 'users.id',
        firstName: 'users.firstName',
        lastName: 'users.lastName',
        email: 'users.email',
        pixCertifTermsOfServiceAccepted: 'users.pixCertifTermsOfServiceAccepted',
        certificationCenterIds: knex.raw('array_agg(?? order by ?? asc)', [
          'certificationCenterId',
          'certificationCenterId',
        ]),
      })
      .from('users')
      .leftJoin('certification-center-memberships', 'certification-center-memberships.userId', 'users.id')
      .where('users.id', userId)
      .groupByRaw('1, 2, 3, 4, 5')
      .first();

    if (!certificationPointOfContactDTO) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new NotFoundError(`Le référent de certification ${userId} n'existe pas.`);
    }

    const authorizedCertificationCenterIds = await _removeDisabledCertificationCenterAccesses({
      certificationPointOfContactDTO,
    });
    const allowedCertificationCenterAccesses = await _findAllowedCertificationCenterAccesses(
      authorizedCertificationCenterIds
    );

    return new CertificationPointOfContact({
      ...certificationPointOfContactDTO,
      allowedCertificationCenterAccesses,
    });
  },
};

async function _removeDisabledCertificationCenterAccesses({
  certificationPointOfContactDTO
}: any) {
  const certificationCenters = await knex
    .select('certificationCenterId')
    .from('certification-center-memberships')
    .where('certification-center-memberships.userId', certificationPointOfContactDTO.id)
    .whereIn(
      'certification-center-memberships.certificationCenterId',
      certificationPointOfContactDTO.certificationCenterIds
    )
    .where('certification-center-memberships.disabledAt', null);

  const certificationCenterIds = _.chain(certificationCenters)
    .map((certificationCenter: any) => certificationCenter.certificationCenterId)
    .compact()
    .value();
  return certificationCenterIds;
}

async function _findAllowedCertificationCenterAccesses(certificationCenterIds: any) {
  const allowedCertificationCenterAccessDTOs = await knex
    .select({
      id: 'certification-centers.id',
      name: 'certification-centers.name',
      externalId: 'certification-centers.externalId',
      type: 'certification-centers.type',
      isRelatedToManagingStudentsOrganization: 'organizations.isManagingStudents',
      isSupervisorAccessEnabled: 'certification-centers.isSupervisorAccessEnabled',
      tags: knex.raw('array_agg(?? order by ??)', ['tags.name', 'tags.name']),
      habilitations: knex.raw(
        `array_agg(json_build_object('id', "complementary-certifications".id, 'name', "complementary-certifications".name) order by "complementary-certifications".id)`
      ),
    })
    .from('certification-centers')
    .leftJoin('organizations', 'organizations.externalId', 'certification-centers.externalId')
    .leftJoin('organization-tags', 'organization-tags.organizationId', 'organizations.id')
    .leftJoin('tags', 'tags.id', 'organization-tags.tagId')
    .leftJoin(
      'complementary-certification-habilitations',
      'complementary-certification-habilitations.certificationCenterId',
      'certification-centers.id'
    )
    .leftJoin(
      'complementary-certifications',
      'complementary-certifications.id',
      'complementary-certification-habilitations.complementaryCertificationId'
    )
    .whereIn('certification-centers.id', certificationCenterIds)
    .orderBy('certification-centers.id')
    .groupByRaw('1, 2, 3, 4, 5');

  return _.map(allowedCertificationCenterAccessDTOs, (allowedCertificationCenterAccessDTO: any) => {
    return new AllowedCertificationCenterAccess({
      ...allowedCertificationCenterAccessDTO,
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
      isRelatedToManagingStudentsOrganization: Boolean(
        allowedCertificationCenterAccessDTO.isRelatedToManagingStudentsOrganization
      ),
      relatedOrganizationTags: _cleanEmptyTags(allowedCertificationCenterAccessDTO),
      habilitations: _cleanEmptyHabilitations(allowedCertificationCenterAccessDTO),
    });
  });

  function _cleanEmptyTags(allowedCertificationCenterAccessDTO: any) {
    return _.compact(allowedCertificationCenterAccessDTO.tags);
  }

  function _cleanEmptyHabilitations(allowedCertificationCenterAccessDTO: any) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return allowedCertificationCenterAccessDTO.habilitations.filter((habilitation: any) => Boolean(habilitation.id));
  }
}
