// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { MINIMUM_CERTIFIABLE_COMPETENCES_FOR_CERTIFIABILITY } = require('../constants');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PlacementP... Remove this comment to see the full error message
class PlacementProfile {
  profileDate: any;
  userCompetences: any;
  userId: any;
  constructor({
    profileDate,
    userId,
    userCompetences
  }: any = {}) {
    this.profileDate = profileDate;
    this.userId = userId;
    this.userCompetences = userCompetences;
  }

  isCertifiable() {
    return this.getCertifiableCompetencesCount() >= MINIMUM_CERTIFIABLE_COMPETENCES_FOR_CERTIFIABILITY;
  }

  getCertifiableCompetencesCount() {
    return _(this.userCompetences)
      .filter((userCompetence: any) => userCompetence.isCertifiable())
      .size();
  }

  getCompetencesCount() {
    return this.userCompetences.length;
  }

  getPixScore() {
    return _.sumBy(this.userCompetences, 'pixScore');
  }

  getUserCompetence(competenceId: any) {
    return _.find(this.userCompetences, { id: competenceId }) || null;
  }

  getCertifiableUserCompetences() {
    return this.userCompetences.filter((uc: any) => uc.isCertifiable());
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = PlacementProfile;
