// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(targetProfiles: any, meta: any) {
    return new Serializer('target-profile', {
      attributes: [
        'name',
        'outdated',
        'isPublic',
        'createdAt',
        'ownerOrganizationId',
        'description',
        'comment',
        'badges',
        'stages',
        'skills',
        'tubes',
        'competences',
        'areas',
        'imageUrl',
        'category',
        'isSimplifiedAccess',
      ],
      skills: {
        ref: 'id',
        included: true,
        attributes: ['name', 'tubeId', 'difficulty'],
      },
      tubes: {
        ref: 'id',
        included: true,
        attributes: ['practicalTitle', 'competenceId'],
      },
      competences: {
        ref: 'id',
        included: true,
        attributes: ['name', 'areaId', 'index'],
      },
      areas: {
        ref: 'id',
        included: true,
        attributes: ['title', 'color'],
      },
      badges: {
        ref: 'id',
        ignoreRelationshipData: true,
        nullIfMissing: true,
        relationshipLinks: {
          related(record: any, current: any, parent: any) {
            return `/api/admin/target-profiles/${parent.id}/badges`;
          },
        },
      },
      stages: {
        ref: 'id',
        ignoreRelationshipData: true,
        nullIfMissing: true,
        relationshipLinks: {
          related(record: any, current: any, parent: any) {
            return `/api/admin/target-profiles/${parent.id}/stages`;
          },
        },
      },
      meta,
    }).serialize(targetProfiles);
  },
};
