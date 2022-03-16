// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Correction... Remove this comment to see the full error message
class Correction {
  hint: any;
  id: any;
  learningMoreTutorials: any;
  solution: any;
  solutionToDisplay: any;
  tutorials: any;
  constructor({
    id,
    solution,
    solutionToDisplay,
    hint,
    tutorials = [],
    learningMoreTutorials = []
  }: any = {}) {
    this.id = id;
    this.solution = solution;
    this.solutionToDisplay = solutionToDisplay;
    this.hint = hint;
    this.tutorials = tutorials;
    this.learningMoreTutorials = learningMoreTutorials;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Correction;
