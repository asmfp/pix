// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Course'.
class Course {
  challenges: any;
  competences: any;
  description: any;
  id: any;
  imageUrl: any;
  name: any;
  constructor({
    id,
    description,
    imageUrl,
    name,
    challenges = [],
    competences = []
  }: any = {}) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.imageUrl = imageUrl;
    this.challenges = challenges; // Array of Record IDs
    this.competences = competences; // Array of Record IDs
  }

  // @ts-expect-error ts-migrate(1056) FIXME: Accessors are only available when targeting ECMASc... Remove this comment to see the full error message
  get nbChallenges() {
    return this.challenges.length;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Course;
