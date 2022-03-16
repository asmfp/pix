// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CertifiedS... Remove this comment to see the full error message
class CertifiedSkill {
  difficulty: any;
  hasBeenAskedInCertif: any;
  id: any;
  name: any;
  tubeId: any;
  constructor({
    id,
    name,
    hasBeenAskedInCertif,
    tubeId
  }: any) {
    this.id = id;
    this.name = name;
    this.hasBeenAskedInCertif = hasBeenAskedInCertif;
    this.tubeId = tubeId;
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
    this.difficulty = parseInt(name.slice(-1));
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CertifiedT... Remove this comment to see the full error message
class CertifiedTube {
  competenceId: any;
  id: any;
  name: any;
  constructor({
    id,
    name,
    competenceId
  }: any) {
    this.id = id;
    this.name = name;
    this.competenceId = competenceId;
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CertifiedC... Remove this comment to see the full error message
class CertifiedCompetence {
  areaId: any;
  id: any;
  name: any;
  constructor({
    id,
    name,
    areaId
  }: any) {
    this.id = id;
    this.name = name;
    this.areaId = areaId;
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CertifiedA... Remove this comment to see the full error message
class CertifiedArea {
  color: any;
  id: any;
  name: any;
  constructor({
    id,
    name,
    color
  }: any) {
    this.id = id;
    this.name = name;
    this.color = color;
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CertifiedP... Remove this comment to see the full error message
class CertifiedProfile {
  certifiedAreas: any;
  certifiedCompetences: any;
  certifiedSkills: any;
  certifiedTubes: any;
  id: any;
  userId: any;
  constructor({
    id,
    userId,
    certifiedSkills,
    certifiedTubes,
    certifiedCompetences,
    certifiedAreas
  }: any) {
    this.id = id;
    this.userId = userId;
    this.certifiedSkills = certifiedSkills;
    this.certifiedTubes = certifiedTubes;
    this.certifiedCompetences = certifiedCompetences;
    this.certifiedAreas = certifiedAreas;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  CertifiedProfile,
  CertifiedArea,
  CertifiedCompetence,
  CertifiedTube,
  CertifiedSkill,
};
