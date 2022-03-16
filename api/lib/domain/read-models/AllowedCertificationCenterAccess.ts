// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'features'.
const { features } = require('../../config');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AllowedCer... Remove this comment to see the full error message
class AllowedCertificationCenterAccess {
  externalId: any;
  habilitations: any;
  id: any;
  isRelatedToManagingStudentsOrganization: any;
  isSupervisorAccessEnabled: any;
  name: any;
  relatedOrganizationTags: any;
  type: any;
  constructor({
    id,
    name,
    externalId,
    type,
    isRelatedToManagingStudentsOrganization,
    relatedOrganizationTags,
    habilitations,
    isSupervisorAccessEnabled
  }: any) {
    this.id = id;
    this.name = name;
    this.externalId = externalId;
    this.type = type;
    this.isRelatedToManagingStudentsOrganization = isRelatedToManagingStudentsOrganization;
    this.relatedOrganizationTags = relatedOrganizationTags;
    this.habilitations = habilitations;
    this.isSupervisorAccessEnabled = isSupervisorAccessEnabled;
  }

  isAccessBlockedCollege() {
    return (
      this.isCollege() &&
      !this.isLycee() &&
      !this.isInWhitelist() &&
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
      new Date() < new Date(features.pixCertifScoBlockedAccessDateCollege)
    );
  }

  isAccessBlockedLycee() {
    return (
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
      this.isLycee() && !this.isInWhitelist() && new Date() < new Date(features.pixCertifScoBlockedAccessDateLycee)
    );
  }

  isAccessBlockedAEFE() {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
    return this.isAEFE() && !this.isInWhitelist() && new Date() < new Date(features.pixCertifScoBlockedAccessDateLycee);
  }

  isAccessBlockedAgri() {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Date'.
    return this.isAgri() && !this.isInWhitelist() && new Date() < new Date(features.pixCertifScoBlockedAccessDateLycee);
  }

  hasTag(tagName: any) {
    return this.relatedOrganizationTags.includes(tagName);
  }

  isCollege() {
    return this.isScoManagingStudents() && this.hasTag('COLLEGE');
  }

  isLycee() {
    return this.isScoManagingStudents() && (this.hasTag('LYCEE') || this.hasTag('LYCEE PRO'));
  }

  isAEFE() {
    return this.hasTag('AEFE');
  }

  isAgri() {
    return this.isScoManagingStudents() && this.hasTag('AGRICULTURE');
  }

  isScoManagingStudents() {
    return this.type === 'SCO' && this.isRelatedToManagingStudentsOrganization;
  }

  isInWhitelist() {
    return features.pixCertifScoBlockedAccessWhitelist.includes(this.externalId.toUpperCase());
  }

  isEndTestScreenRemovalEnabled() {
    return this.isSupervisorAccessEnabled;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = AllowedCertificationCenterAccess;
