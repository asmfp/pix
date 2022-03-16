// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const HapiSwagger = require('hapi-swagger');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const applicationPackage = require('../package.json');

const swaggerOptionsAuthorizationServer = {
  routeTag: 'authorization-server',
  info: {
    title: 'Welcome to the Pix Authorization server',
    version: applicationPackage.version,
  },
  jsonPath: '/swagger.json',
};

const swaggerOptionsLivretScolaire = {
  routeTag: 'livret-scolaire',
  info: {
    title: 'Welcome to the Pix LSU/LSL open api',
    version: applicationPackage.version,
  },
  jsonPath: '/swagger.json',
};

const swaggerOptionsPoleEmploi = {
  routeTag: 'pole-emploi',
  info: {
    title: 'Pix Pôle emploi open api',
    version: applicationPackage.version,
  },
  jsonPath: '/swagger.json',
};

const swaggerOptionsIn = {
  basePath: '/api',
  grouping: 'tags',
  routeTag: 'api',
  info: {
    title: 'Welcome to the Pix api catalog',
    version: applicationPackage.version,
  },
  documentationPath: '/documentation',
  jsonPath: '/swagger.json',
};

function _buildSwaggerArgs(swaggerOptions: any) {
  return [
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
    {
      routes: { prefix: '/' + swaggerOptions.routeTag },
    },
  ];
}

const swaggers = [
  swaggerOptionsAuthorizationServer,
  swaggerOptionsLivretScolaire,
  swaggerOptionsPoleEmploi,
  swaggerOptionsIn,
// @ts-expect-error ts-migrate(2339) FIXME: Property 'map' does not exist on type '{}'.
].map(_buildSwaggerArgs);

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = swaggers;
