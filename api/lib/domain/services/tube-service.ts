// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Tube'.
const Tube = require('../models/Tube');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'computeTub... Remove this comment to see the full error message
function computeTubesFromSkills(skills: any) {
  const tubes: any = [];

  skills.forEach((skill: any) => {
    const tubeNameOfSkill = skill.tubeNameWithoutPrefix;
    const existingTube = tubes.find((tube: any) => tube.name === tubeNameOfSkill);
    if (existingTube) {
      existingTube.addSkill(skill);
    } else {
      tubes.push(new Tube({ skills: [skill], name: tubeNameOfSkill }));
    }
  });
  tubes.forEach((tube: any) => {
    tube.skills = _.sortBy(tube.skills, ['difficulty']);
  });

  return tubes;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  computeTubesFromSkills,
};
