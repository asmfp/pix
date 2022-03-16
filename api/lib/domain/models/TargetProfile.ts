// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'categories... Remove this comment to see the full error message
const categories = {
  OTHER: 'OTHER',
  COMPETENCES: 'COMPETENCES',
  SUBJECT: 'SUBJECT',
  DISCIPLINE: 'DISCIPLINE',
  CUSTOM: 'CUSTOM',
  PREDEFINED: 'PREDEFINED',
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
class TargetProfile {
  badges: any;
  description: any;
  id: any;
  imageUrl: any;
  isPublic: any;
  isSimplifiedAccess: any;
  name: any;
  organizationsAttached: any;
  outdated: any;
  ownerOrganizationId: any;
  skills: any;
  stages: any;
  constructor({
    id,
    name,
    imageUrl,
    isPublic,
    isSimplifiedAccess,
    outdated,
    skills = [],
    stages,
    badges,
    ownerOrganizationId,
    description
  }: any = {}) {
    this.id = id;
    this.name = name;
    this.imageUrl = imageUrl;
    this.isPublic = isPublic;
    this.isSimplifiedAccess = isSimplifiedAccess;
    this.outdated = outdated;
    this.skills = skills;
    this.stages = stages;
    this.badges = badges;
    this.ownerOrganizationId = ownerOrganizationId;
    this.description = description;
    this.organizationsAttached = [];
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get hasBadges() {
    return !!this.badges && this.badges.length > 0;
  }

  hasSkill(skillId: any) {
    return this.skills.some((skill: any) => skill.id === skillId);
  }

  getCompetenceIds() {
    const competenceIdsOfSkills = this.skills.map((skill: any) => skill.competenceId);
    // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'Set'. Did you mean 'set'?
    const uniqCompetenceIds = new Set(competenceIdsOfSkills);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Array'.
    return Array.from(uniqCompetenceIds);
  }

  getTargetedCompetences(competences: any) {
    const targetedCompetenceIds = this.getCompetenceIds();
    return competences.filter((competence: any) => targetedCompetenceIds.includes(competence.id));
  }

  getSkillIds() {
    return this.skills.map((skill: any) => skill.id);
  }

  getSkillCountForCompetence(competenceId: any) {
    return this.skills.filter((skill: any) => skill.competenceId === competenceId).length;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get organizations() {
    return this.organizationsAttached;
  }
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'categories' does not exist on type 'type... Remove this comment to see the full error message
TargetProfile.categories = categories;

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = TargetProfile;
