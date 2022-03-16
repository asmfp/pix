// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('./AuthenticationMethod');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'User'.
class User {
  authenticationMethods: any;
  campaignParticipations: any;
  certificationCenterMemberships: any;
  cgu: any;
  email: any;
  emailConfirmedAt: any;
  firstName: any;
  hasSeenAssessmentInstructions: any;
  hasSeenFocusedChallengeTooltip: any;
  hasSeenNewDashboardInfo: any;
  hasSeenOtherChallengesTooltip: any;
  id: any;
  isAnonymous: any;
  knowledgeElements: any;
  lang: any;
  lastName: any;
  lastPixCertifTermsOfServiceValidatedAt: any;
  lastPixOrgaTermsOfServiceValidatedAt: any;
  lastTermsOfServiceValidatedAt: any;
  memberships: any;
  mustValidateTermsOfService: any;
  pixCertifTermsOfServiceAccepted: any;
  pixOrgaTermsOfServiceAccepted: any;
  pixRoles: any;
  pixScore: any;
  scorecards: any;
  username: any;
  constructor({
    id,
    cgu,
    pixOrgaTermsOfServiceAccepted,
    pixCertifTermsOfServiceAccepted,
    email,
    emailConfirmedAt,
    username,
    firstName,
    knowledgeElements,
    lastName,
    lastTermsOfServiceValidatedAt,
    lastPixOrgaTermsOfServiceValidatedAt,
    lastPixCertifTermsOfServiceValidatedAt,
    hasSeenAssessmentInstructions,
    hasSeenNewDashboardInfo,
    hasSeenFocusedChallengeTooltip,
    hasSeenOtherChallengesTooltip,
    mustValidateTermsOfService,
    lang,
    isAnonymous,
    memberships = [],
    certificationCenterMemberships = [],
    pixRoles = [],
    pixScore,
    scorecards = [],
    campaignParticipations = [],
    authenticationMethods = []
  }: any = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email ? _.toLower(email) : undefined;
    this.emailConfirmedAt = emailConfirmedAt;
    this.cgu = cgu;
    this.lastTermsOfServiceValidatedAt = lastTermsOfServiceValidatedAt;
    this.lastPixOrgaTermsOfServiceValidatedAt = lastPixOrgaTermsOfServiceValidatedAt;
    this.lastPixCertifTermsOfServiceValidatedAt = lastPixCertifTermsOfServiceValidatedAt;
    this.mustValidateTermsOfService = mustValidateTermsOfService;
    this.pixOrgaTermsOfServiceAccepted = pixOrgaTermsOfServiceAccepted;
    this.pixCertifTermsOfServiceAccepted = pixCertifTermsOfServiceAccepted;
    this.hasSeenAssessmentInstructions = hasSeenAssessmentInstructions;
    this.hasSeenOtherChallengesTooltip = hasSeenOtherChallengesTooltip;
    this.hasSeenNewDashboardInfo = hasSeenNewDashboardInfo;
    this.hasSeenFocusedChallengeTooltip = hasSeenFocusedChallengeTooltip;
    this.knowledgeElements = knowledgeElements;
    this.lang = lang;
    this.isAnonymous = isAnonymous;
    this.pixRoles = pixRoles;
    this.pixScore = pixScore;
    this.memberships = memberships;
    this.certificationCenterMemberships = certificationCenterMemberships;
    this.scorecards = scorecards;
    this.campaignParticipations = campaignParticipations;
    this.authenticationMethods = authenticationMethods;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get hasRolePixMaster() {
    return !!this.pixRoles.find((pixRole: any) => pixRole.name === 'PIX_MASTER');
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get shouldChangePassword() {
    const pixAuthenticationMethod = this.authenticationMethods.find(
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'identityProviders' does not exist on typ... Remove this comment to see the full error message
      (authenticationMethod: any) => authenticationMethod.identityProvider === AuthenticationMethod.identityProviders.PIX
    );

    return pixAuthenticationMethod ? pixAuthenticationMethod.authenticationComplement.shouldChangePassword : null;
  }

  isLinkedToOrganizations() {
    return this.memberships.length > 0;
  }

  isLinkedToCertificationCenters() {
    return this.certificationCenterMemberships.length > 0;
  }

  hasAccessToOrganization(organizationId: any) {
    return this.memberships.some((membership: any) => membership.organization.id === organizationId);
  }

  hasAccessToCertificationCenter(certificationCenterId: any) {
    return this.certificationCenterMemberships.some(
      (certificationCenterMembership: any) => certificationCenterMembership.certificationCenter.id === certificationCenterId &&
      _.isNil(certificationCenterMembership.disabledAt)
    );
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = User;
