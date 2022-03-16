// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Hint'.
class Hint {
  skillName: any;
  value: any;
  constructor({
    skillName,
    value
  }: any = {}) {
    this.skillName = skillName;
    this.value = value;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Hint;
