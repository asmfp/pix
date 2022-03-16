// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const countryController = require('./country-controller');

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.register = async function (server: any) {
  server.route([
    {
      method: 'GET',
      path: '/api/countries',
      config: {
        handler: countryController.findCountries,
        tags: ['api'],
        notes: [
          'Cette route est utilisée par Pix Certif',
          "Elle renvoie la liste des noms de pays issus du référentiel INSEE dans le cas de l'inscription d'un candidat en certification",
        ],
      },
    },
  ]);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'exports'.
exports.name = 'certification-cpf-countries';
