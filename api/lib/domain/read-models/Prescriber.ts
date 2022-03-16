// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Prescriber... Remove this comment to see the full error message
class Prescriber {
  areNewYearSchoolingRegistrationsImported: any;
  firstName: any;
  id: any;
  lang: any;
  lastName: any;
  memberships: any;
  pixOrgaTermsOfServiceAccepted: any;
  userOrgaSettings: any;
  constructor({
    id,
    firstName,
    lastName,
    pixOrgaTermsOfServiceAccepted,
    lang,
    areNewYearSchoolingRegistrationsImported,
    memberships = [],
    userOrgaSettings
  }: any = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.pixOrgaTermsOfServiceAccepted = pixOrgaTermsOfServiceAccepted;
    this.lang = lang;
    this.areNewYearSchoolingRegistrationsImported = areNewYearSchoolingRegistrationsImported;
    this.memberships = memberships;
    this.userOrgaSettings = userOrgaSettings;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Prescriber;
