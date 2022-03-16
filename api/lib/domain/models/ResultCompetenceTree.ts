// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Area'.
const Area = require('./Area');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ResultComp... Remove this comment to see the full error message
const ResultCompetence = require('./ResultCompetence');

const NOT_PASSED_LEVEL = -1;
const NOT_PASSED_SCORE = 0;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ResultComp... Remove this comment to see the full error message
class ResultCompetenceTree {
  areas: any;
  id: any;
  constructor({
    id,
    areas = []
  }: any = {}) {
    this.id = id;
    this.areas = areas;
  }

  static generateTreeFromCompetenceMarks({
    competenceTree,
    competenceMarks,
    certificationId,
    assessmentResultId
  }: any) {
    const areasWithResultCompetences = competenceTree.areas.map((area: any) => {
      const areaWithResultCompetences = new Area(area);

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'resultCompetences' does not exist on typ... Remove this comment to see the full error message
      areaWithResultCompetences.resultCompetences = area.competences.map((competence: any) => {
        const noLevelCompetenceMarkData = { level: NOT_PASSED_LEVEL, score: NOT_PASSED_SCORE };

        const associatedCompetenceMark =
          competenceMarks.find((competenceMark: any) => competenceMark.competence_code === competence.index) ||
          noLevelCompetenceMarkData;

        return new ResultCompetence({
          id: competence.id,
          index: competence.index,
          level: associatedCompetenceMark.level,
          name: competence.name,
          score: associatedCompetenceMark.score,
        });
      });

      delete areaWithResultCompetences.competences; // XXX Competences duplicate info from resultCompetences

      return areaWithResultCompetences;
    });

    return new ResultCompetenceTree({
      id: `${certificationId}-${assessmentResultId}`,
      areas: areasWithResultCompetences,
    });
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ResultCompetenceTree;
