// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
class TargetProfileWithLearningContent {
  areas: any;
  badges: any;
  category: any;
  comment: any;
  competences: any;
  createdAt: any;
  description: any;
  id: any;
  imageUrl: any;
  isPublic: any;
  isSimplifiedAccess: any;
  name: any;
  outdated: any;
  ownerOrganizationId: any;
  skills: any;
  stages: any;
  tubes: any;
  constructor({
    id,
    name,
    outdated,
    isPublic,
    createdAt,
    ownerOrganizationId,
    description,
    comment,
    skills = [],
    tubes = [],
    competences = [],
    areas = [],
    badges = [],
    stages = [],
    imageUrl,
    category,
    isSimplifiedAccess
  }: any = {}) {
    this.id = id;
    this.name = name;
    this.outdated = outdated;
    this.isPublic = isPublic;
    this.createdAt = createdAt;
    this.ownerOrganizationId = ownerOrganizationId;
    this.description = description;
    this.comment = comment;
    this.skills = skills;
    this.tubes = tubes;
    this.competences = competences;
    this.areas = areas;
    this.badges = badges;
    this.stages = _.sortBy(stages, 'threshold');
    this.imageUrl = imageUrl;
    this.category = category;
    this.isSimplifiedAccess = isSimplifiedAccess;
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get skillNames() {
    return this.skills.map((skill: any) => skill.name);
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get skillIds() {
    return this.skills.map((skill: any) => skill.id);
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get tubeIds() {
    return this.tubes.map((tube: any) => tube.id);
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get competenceIds() {
    return this.competences.map((competence: any) => competence.id);
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get reachableStages() {
    return _(this.stages)
      .filter(({
      threshold
    }: any) => threshold > 0)
      .value();
  }

  hasSkill(skillId: any) {
    return this.skills.some((skill: any) => skill.id === skillId);
  }

  hasBadges() {
    return this.badges.length > 0;
  }

  hasReachableStages() {
    return this.reachableStages.length > 0;
  }

  getTubeIdOfSkill(skillId: any) {
    const skillTube = this.tubes.find((tube: any) => tube.hasSkill(skillId));

    return skillTube ? skillTube.id : null;
  }

  getCompetenceIdOfSkill(skillId: any) {
    const skillTube = this.tubes.find((tube: any) => tube.hasSkill(skillId));

    return skillTube ? skillTube.competenceId : null;
  }

  findSkill(skillId: any) {
    const foundSkill = _.find(this.skills, (skill: any) => skill.id === skillId);
    return foundSkill || null;
  }

  findTube(tubeId: any) {
    const foundTube = _.find(this.tubes, (tube: any) => tube.id === tubeId);
    return foundTube || null;
  }

  getCompetence(competenceId: any) {
    const foundCompetence = _.find(this.competences, (competence: any) => competence.id === competenceId);
    return foundCompetence || null;
  }

  getArea(areaId: any) {
    const foundArea = _.find(this.areas, (area: any) => area.id === areaId);
    return foundArea || null;
  }

  getAreaOfCompetence(competenceId: any) {
    const area = this.areas.find((area: any) => area.hasCompetence(competenceId));

    return area || null;
  }

  getKnowledgeElementsGroupedByCompetence(knowledgeElements: any) {
    return this._filterTargetedKnowledgeElementAndGroupByCompetence(knowledgeElements);
  }

  getValidatedKnowledgeElementsGroupedByTube(knowledgeElements: any) {
    return this._filterTargetedKnowledgeElementAndGroupByTube(
      knowledgeElements,
      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '(knowledgeElement: any) => any' ... Remove this comment to see the full error message
      (knowledgeElement: any) => knowledgeElement.isValidated
    );
  }

  _filterTargetedKnowledgeElementAndGroupByCompetence(knowledgeElements: any, knowledgeElementFilter = () => true) {
    const knowledgeElementsGroupedByCompetence = {};
    for (const competenceId of this.competenceIds) {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      knowledgeElementsGroupedByCompetence[competenceId] = [];
    }
    for (const knowledgeElement of knowledgeElements) {
      const competenceId = this.getCompetenceIdOfSkill(knowledgeElement.skillId);
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
      if (competenceId && knowledgeElementFilter(knowledgeElement)) {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        knowledgeElementsGroupedByCompetence[competenceId].push(knowledgeElement);
      }
    }

    return knowledgeElementsGroupedByCompetence;
  }

  _filterTargetedKnowledgeElementAndGroupByTube(knowledgeElements: any, knowledgeElementFilter = () => true) {
    const knowledgeElementsGroupedByTube = {};
    for (const tubeId of this.tubeIds) {
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      knowledgeElementsGroupedByTube[tubeId] = [];
    }
    for (const knowledgeElement of knowledgeElements) {
      const tubeId = this.getTubeIdOfSkill(knowledgeElement.skillId);
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
      if (tubeId && knowledgeElementFilter(knowledgeElement)) {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        knowledgeElementsGroupedByTube[tubeId].push(knowledgeElement);
      }
    }

    return knowledgeElementsGroupedByTube;
  }

  countValidatedTargetedKnowledgeElementsByCompetence(knowledgeElements: any) {
    const validatedGroupedByCompetence = this._filterTargetedKnowledgeElementAndGroupByCompetence(
      knowledgeElements,
      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '(knowledgeElement: any) => any' ... Remove this comment to see the full error message
      (knowledgeElement: any) => knowledgeElement.isValidated
    );
    return _.mapValues(validatedGroupedByCompetence, 'length');
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get maxSkillDifficulty() {
    const skillMaxDifficulty = _.maxBy(this.skills, 'difficulty');
    return skillMaxDifficulty ? skillMaxDifficulty.difficulty : null;
  }

  getStageThresholdBoundaries() {
    const boundaries: any = [];
    let lastTo: any = null;

    this.stages.forEach((currentStage: any, index: any) => {
      let to, from;

      if (lastTo === null) {
        from = currentStage.threshold;
      } else {
        from = lastTo + 1;
      }

      if (index + 1 >= this.stages.length) {
        to = 100;
      } else {
        const nextThreshold = this.stages[index + 1].threshold;
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Math'.
        to = Math.max(from, nextThreshold - 1);
      }

      lastTo = to;
      boundaries.push({ id: currentStage.id, from, to });
    });

    return boundaries;
  }

  getThresholdBoundariesFromStages(stageIds: any) {
    if (!stageIds || stageIds.length === 0) return null;
    return this.getStageThresholdBoundaries().filter((boundary: any) => stageIds.includes(boundary.id));
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = TargetProfileWithLearningContent;
