// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { Type } = require('./Challenge');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationChallengeWithType {
  associatedSkillName: any;
  certifiableBadgeKey: any;
  challengeId: any;
  competenceId: any;
  hasBeenSkippedAutomatically: any;
  id: any;
  isNeutralized: any;
  type: any;
  constructor({
    id,
    associatedSkillName,
    challengeId,
    type,
    competenceId,
    isNeutralized,
    hasBeenSkippedAutomatically,
    certifiableBadgeKey
  }: any = {}) {
    this.id = id;
    this.associatedSkillName = associatedSkillName;
    this.challengeId = challengeId;
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Object'. Did you mean 'isObject'... Remove this comment to see the full error message
    const possibleTypeValues = Object.values(Type);
    this.type = possibleTypeValues.includes(type) ? type : 'EmptyType';
    this.competenceId = competenceId;
    this.isNeutralized = isNeutralized;
    this.hasBeenSkippedAutomatically = hasBeenSkippedAutomatically;
    this.certifiableBadgeKey = certifiableBadgeKey;
  }

  neutralize() {
    this.isNeutralized = true;
  }

  deneutralize() {
    this.isNeutralized = false;
  }

  isPixPlus() {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(this.certifiableBadgeKey);
  }

  skipAutomatically() {
    this.hasBeenSkippedAutomatically = true;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationChallengeWithType;
