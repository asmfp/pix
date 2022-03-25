const _ = require('lodash');

class UserToCreate {
  constructor({
    firstName = '',
    lastName = '',
    email = null,
    cgu = false,
    hasSeenAssessmentInstructions = false,
    username = null,
    mustValidateTermsOfService = false,
    lastTermsOfServiceValidatedAt = null,
    lang = 'fr',
    hasSeenNewDashboardInfo = false,
    isAnonymous = false,
    hasSeenFocusedChallengeTooltip = false,
    hasSeenOtherChallengesTooltip = false,
    createdAt,
    updatedAt,
  } = {}) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.cgu = cgu;
    this.hasSeenAssessmentInstructions = hasSeenAssessmentInstructions;
    this.username = username;
    this.mustValidateTermsOfService = mustValidateTermsOfService;
    this.lastTermsOfServiceValidatedAt = lastTermsOfServiceValidatedAt;
    this.lang = lang;
    this.hasSeenNewDashboardInfo = hasSeenNewDashboardInfo;
    this.isAnonymous = isAnonymous;
    this.hasSeenFocusedChallengeTooltip = hasSeenFocusedChallengeTooltip;
    this.hasSeenOtherChallengesTooltip = hasSeenOtherChallengesTooltip;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  create({ now = new Date() } = {}) {
    this.createdAt = now;
    this.updatedAt = now;
    this.email = this.email ? _(this.email).toLower().trim() : null;
  }

  createFromPoleEmploi({ now = new Date() } = {}) {
    this.createdAt = now;
    this.updatedAt = now;
    this.cgu = true;
    this.lastTermsOfServiceValidatedAt = now;
  }

  createAnonymous({ now = new Date() } = {}) {
    this.isAnonymous = true;
    this.createdAt = now;
    this.updatedAt = now;
  }
}

module.exports = UserToCreate;
