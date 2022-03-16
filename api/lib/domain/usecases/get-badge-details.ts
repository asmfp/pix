// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'BadgeWithL... Remove this comment to see the full error message
const BadgeWithLearningContent = require('../../domain/models/BadgeWithLearningContent');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'FRENCH_FRA... Remove this comment to see the full error message
const { FRENCH_FRANCE } = require('../../domain/constants').LOCALE;

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getBadgeDetails({
  badgeId,
  badgeRepository,
  skillRepository,
  tubeRepository
}: any) {
  const badge = await badgeRepository.get(badgeId);
  const skillIds = badge.skillSets.flatMap(({
    skillIds
  }: any) => skillIds);

  const skills = await skillRepository.findOperativeByIds(skillIds);

  const tubeNames = skills.map((skill: any) => skill.tubeName);
  const tubes = await tubeRepository.findByNames({ tubeNames, locale: FRENCH_FRANCE });

  return new BadgeWithLearningContent({ badge, skills, tubes });
};
