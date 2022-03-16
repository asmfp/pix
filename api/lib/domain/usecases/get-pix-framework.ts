// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getPixFramework({
  locale,
  challengeRepository,
  skillRepository,
  tubeRepository,
  thematicRepository,
  areaRepository
}: any) {
  const tubes = await tubeRepository.findActivesFromPixFramework(locale);
  const thematics = await thematicRepository.list();
  const areas = await areaRepository.listWithPixCompetencesOnly();
  const tubesWithResponsiveStatus = await bluebird.mapSeries(tubes, async (tube: any) => {
    const skills = skillRepository.findActiveByTubeId(tube.id);
    let validatedChallenges = await bluebird.mapSeries(skills, ({
      id
    }: any) => {
      return challengeRepository.findValidatedPrototypeBySkillId(id);
    });
    validatedChallenges = validatedChallenges.flat();

    tube.mobile = _isResponsiveForMobile(validatedChallenges);
    tube.tablet = _isResponsiveForTablet(validatedChallenges);
    return tube;
  });
  return { tubes: tubesWithResponsiveStatus, thematics, areas };
};

function _isResponsiveForMobile(challenges: any) {
  return challenges.length > 0 &&
  _.every(challenges, (challenge: any) => {
    return challenge.responsive?.includes('Smartphone');
  });
}

function _isResponsiveForTablet(challenges: any) {
  return challenges.length > 0 &&
  _.every(challenges, (challenge: any) => {
    return challenge.responsive?.includes('Tablette');
  });
}
