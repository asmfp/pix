// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Tag'.
const Tag = require('./Tag');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'types'.
const types = {
  SCO: 'SCO',
  SUP: 'SUP',
  PRO: 'PRO',
};

const defaultValues = {
  credit: 0,
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
class Organization {
  archivedAt: any;
  createdBy: any;
  credit: any;
  documentationUrl: any;
  email: any;
  externalId: any;
  formNPSUrl: any;
  id: any;
  isManagingStudents: any;
  logoUrl: any;
  name: any;
  organizationInvitations: any;
  provinceCode: any;
  showNPS: any;
  showSkills: any;
  students: any;
  tags: any;
  targetProfileShares: any;
  type: any;
  constructor({
    id,
    name,
    type,
    logoUrl,
    externalId,
    provinceCode,
    isManagingStudents,
    credit = defaultValues.credit,
    email,
    targetProfileShares = [],
    students = [],
    organizationInvitations = [],
    tags = [],
    documentationUrl,
    createdBy,
    showNPS,
    formNPSUrl,
    showSkills,
    archivedAt
  }: any = {}) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.logoUrl = logoUrl;
    this.externalId = externalId;
    this.provinceCode = provinceCode;
    this.isManagingStudents = isManagingStudents;
    this.credit = credit;
    this.email = email;
    this.targetProfileShares = targetProfileShares;
    this.students = students;
    this.organizationInvitations = organizationInvitations;
    this.tags = tags;
    this.documentationUrl = documentationUrl;
    this.createdBy = createdBy;
    this.showNPS = showNPS;
    this.formNPSUrl = formNPSUrl;
    this.showSkills = showSkills;
    this.archivedAt = archivedAt;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isSup() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'SUP' does not exist on type '{ CERTIFICA... Remove this comment to see the full error message
    return this.type === types.SUP;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isSco() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'SCO' does not exist on type '{ CERTIFICA... Remove this comment to see the full error message
    return this.type === types.SCO;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isPro() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'PRO' does not exist on type '{ CERTIFICA... Remove this comment to see the full error message
    return this.type === types.PRO;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isAgriculture() {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(this.tags.find((tag: any) => this.isSco && tag.name === Tag.AGRICULTURE));
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isPoleEmploi() {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(this.tags.find((tag: any) => tag.name === Tag.POLE_EMPLOI));
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isScoAndManagingStudents() {
    return this.isSco && this.isManagingStudents;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get isScoAndHasExternalId() {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return this.isSco && Boolean(this.externalId);
  }
}

Organization.types = types;
Organization.defaultValues = defaultValues;
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Organization;
