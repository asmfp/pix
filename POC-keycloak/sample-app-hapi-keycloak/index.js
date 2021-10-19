'use strict';

const Hapi = require('@hapi/hapi');

const init = async () => {

  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });

  await server.register({
    plugin: require('yar'),
    options: {
      storeBlank: false,
      name: 'kc_session',
      maxCookieSize: 0,
      cookieOptions: {
        password: 'the-password-must-be-at-least-32-characters-long',
        isSecure: false // use true for production (https).
      }
    }
  });

  await server.register({
    plugin: require('keycloak-hapi'),
    options: {
      serverUrl: 'http://localhost:8080/auth',
      realm: 'pix',
      clientId: 'hapiPix',
      clientSecret: 'f9033011-6a16-439f-af97-c0c924bb9910',
      bearerOnly: false // set it to true if you're writing a resource server (REST API).
    }
  });

  server.auth.strategy('keycloak', 'keycloak');
  server.auth.default('keycloak');

  server.route([
    {
      method: 'GET',
      path: '/',
      config: {
        description: 'protected endpoint',
        auth: {
          strategies: ['keycloak'],
        },
        handler() {
          return 'vous êtes à la racine.';
        },
      },
    },
  ]);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init();
