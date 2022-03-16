// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../config');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = { getCampaignUrl };

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getCampaig... Remove this comment to see the full error message
function getCampaignUrl(locale: any, campaignCode: any) {
  if (!campaignCode) {
    return null;
  }
  if (locale === 'fr') {
    return `${settings.domain.pixApp + settings.domain.tldOrg}/campagnes/${campaignCode}/?lang=fr`;
  }
  if (locale === 'en') {
    return `${settings.domain.pixApp + settings.domain.tldOrg}/campagnes/${campaignCode}/?lang=en`;
  }
  return `${settings.domain.pixApp + settings.domain.tldFr}/campagnes/${campaignCode}`;
}
