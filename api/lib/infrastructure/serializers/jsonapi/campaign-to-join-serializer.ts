// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(campaignsToJoin: any) {
    return new Serializer('campaign', {
      attributes: [
        'code',
        'title',
        'type',
        'idPixLabel',
        'customLandingPageText',
        'externalIdHelpImageUrl',
        'alternativeTextToExternalIdHelpImage',
        'isArchived',
        'isForAbsoluteNovice',
        'isRestricted',
        'isSimplifiedAccess',
        'organizationName',
        'organizationType',
        'organizationLogoUrl',
        'organizationIsPoleEmploi',
        'organizationShowNPS',
        'organizationFormNPSUrl',
        'targetProfileName',
        'targetProfileImageUrl',
        'customResultPageText',
        'customResultPageButtonText',
        'customResultPageButtonUrl',
        'multipleSendings',
        'isFlash',
      ],
    }).serialize(campaignsToJoin);
  },
};
