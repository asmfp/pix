// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assessment... Remove this comment to see the full error message
const assessmentResultRepository = require('../../infrastructure/repositories/assessment-result-repository');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const competenceMarkRepository = require('../../infrastructure/repositories/competence-mark-repository');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const CompetenceMark = require('../models/CompetenceMark');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');

// @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
async function _validatedDataForAllCompetenceMark(competenceMarks: any) {
  for (const competenceMark of competenceMarks) {
    competenceMark.validate();
  }
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
async function save(assessmentResult: any, competenceMarks: any) {
  await _validatedDataForAllCompetenceMark(competenceMarks);
  const { id } = await assessmentResultRepository.save(assessmentResult);
  return bluebird.mapSeries(competenceMarks, (competenceMark: any) => competenceMarkRepository.save(new CompetenceMark({ ...competenceMark, assessmentResultId: id }))
  );
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  save,
};
