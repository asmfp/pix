// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(framework: any) {
    framework.thematics.forEach((thematic: any) => {
      thematic.tubes = framework.tubes.filter(({
        id
      }: any) => {
        return thematic.tubeIds.includes(id);
      });
    });
    return new Serializer('area', {
      ref: 'id',
      attributes: ['code', 'title', 'color', 'competences'],

      competences: {
        include: true,
        ref: 'id',
        attributes: ['name', 'index', 'thematics'],

        thematics: {
          include: true,
          ref: 'id',
          attributes: ['name', 'index', 'tubes'],

          tubes: {
            include: true,
            ref: 'id',
            attributes: ['practicalTitle', 'practicalDescription', 'mobile', 'tablet'],
          },
        },
      },

      transform(area: any) {
        area.competences.forEach((competence: any) => {
          competence.thematics = framework.thematics.filter((thematic: any) => {
            return competence.thematicIds.includes(thematic.id) && thematic.tubes.length > 0;
          });
        });
        return area;
      },
    }).serialize(framework.areas);
  },
};
