// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'jsonwebtok... Remove this comment to see the full error message
const jsonwebtoken = require('jsonwebtoken');
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'InvalidTem... Remove this comment to see the full error message
  InvalidTemporaryKeyError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'InvalidExt... Remove this comment to see the full error message
  InvalidExternalUserTokenError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'InvalidRes... Remove this comment to see the full error message
  InvalidResultRecipientTokenError,
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'InvalidSes... Remove this comment to see the full error message
  InvalidSessionResultError,
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../domain/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../config');

function _createAccessToken({
  userId,
  source,
  expirationDelaySeconds
}: any) {
  return jsonwebtoken.sign({ user_id: userId, source }, settings.authentication.secret, {
    expiresIn: expirationDelaySeconds,
  });
}

function createAccessTokenFromUser(userId: any, source: any) {
  const expirationDelaySeconds = settings.authentication.accessTokenLifespanMs / 1000;
  const accessToken = _createAccessToken({ userId, source, expirationDelaySeconds });
  return { accessToken, expirationDelaySeconds };
}

function createAccessTokenForPoleEmploi(userId: any) {
  const expirationDelaySeconds = settings.poleEmploi.accessTokenLifespanMs / 1000;
  return _createAccessToken({ userId, source: 'pole_emploi_connect', expirationDelaySeconds });
}

function createAccessTokenForSaml(userId: any) {
  const expirationDelaySeconds = settings.saml.accessTokenLifespanMs / 1000;
  return _createAccessToken({ userId, source: 'external', expirationDelaySeconds });
}

function createAccessTokenFromApplication(
  clientId: any,
  source: any,
  scope: any,
  secret = settings.authentication.secret,
  expiresIn = settings.authentication.accessTokenLifespanMs
) {
  return jsonwebtoken.sign(
    {
      client_id: clientId,
      source,
      scope,
    },
    secret,
    { expiresIn }
  );
}

function createTokenForCampaignResults(userId: any) {
  return jsonwebtoken.sign(
    {
      access_id: userId,
    },
    settings.authentication.secret,
    { expiresIn: settings.authentication.tokenForCampaignResultLifespan }
  );
}

function createIdTokenForUserReconciliation(externalUser: any) {
  return jsonwebtoken.sign(
    {
      first_name: externalUser.firstName,
      last_name: externalUser.lastName,
      saml_id: externalUser.samlId,
    },
    settings.authentication.secret,
    { expiresIn: settings.authentication.tokenForStudentReconciliationLifespan }
  );
}

function createCertificationResultsByRecipientEmailLinkToken({
  sessionId,
  resultRecipientEmail,
  daysBeforeExpiration
}: any) {
  return jsonwebtoken.sign(
    {
      session_id: sessionId,
      result_recipient_email: resultRecipientEmail,
    },
    settings.authentication.secret,
    {
      expiresIn: `${daysBeforeExpiration}d`,
    }
  );
}

function createCertificationResultsLinkToken({
  sessionId,
  daysBeforeExpiration
}: any) {
  return jsonwebtoken.sign(
    {
      session_id: sessionId,
    },
    settings.authentication.secret,
    {
      expiresIn: `${daysBeforeExpiration}d`,
    }
  );
}

function extractTokenFromAuthChain(authChain: any) {
  if (!authChain) {
    return authChain;
  }
  const bearerIndex = authChain.indexOf('Bearer ');
  if (bearerIndex < 0) {
    return false;
  }
  return authChain.replace(/Bearer /g, '');
}

function decodeIfValid(token: any) {
  // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
  return new Promise((resolve: any, reject: any) => {
    const decoded = getDecodedToken(token);
    return !decoded ? reject(new InvalidTemporaryKeyError()) : resolve(decoded);
  });
}

function getDecodedToken(token: any, secret = settings.authentication.secret) {
  try {
    return jsonwebtoken.verify(token, secret);
  } catch (err) {
    return false;
  }
}

function extractSamlId(token: any) {
  const decoded = getDecodedToken(token);
  return decoded.saml_id || null;
}

function extractResultRecipientEmailAndSessionId(token: any) {
  const decoded = getDecodedToken(token);
  if (!decoded.session_id || !decoded.result_recipient_email) {
    throw new InvalidResultRecipientTokenError();
  }

  return {
    resultRecipientEmail: decoded.result_recipient_email,
    sessionId: decoded.session_id,
  };
}

function extractSessionId(token: any) {
  const decoded = getDecodedToken(token);
  if (!decoded.session_id) {
    throw new InvalidSessionResultError();
  }

  return {
    sessionId: decoded.session_id,
  };
}

function extractUserId(token: any) {
  const decoded = getDecodedToken(token);
  return decoded.user_id || null;
}

function extractClientId(token: any, secret = settings.authentication.secret) {
  const decoded = getDecodedToken(token, secret);
  return decoded.client_id || null;
}

function extractUserIdForCampaignResults(token: any) {
  const decoded = getDecodedToken(token);
  return decoded.access_id || null;
}

async function extractExternalUserFromIdToken(token: any) {
  const externalUser = await getDecodedToken(token);

  if (!externalUser) {
    throw new InvalidExternalUserTokenError(
      'Une erreur est survenue. Veuillez réessayer de vous connecter depuis le médiacentre.'
    );
  }

  return {
    firstName: externalUser['first_name'],
    lastName: externalUser['last_name'],
    samlId: externalUser['saml_id'],
  };
}

async function extractPayloadFromPoleEmploiIdToken(idToken: any) {
  const { given_name, family_name, nonce, idIdentiteExterne } = await jsonwebtoken.decode(idToken);
  return { given_name, family_name, nonce, idIdentiteExterne };
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  createAccessTokenFromUser,
  createAccessTokenForPoleEmploi,
  createAccessTokenForSaml,
  createAccessTokenFromApplication,
  createTokenForCampaignResults,
  createIdTokenForUserReconciliation,
  createCertificationResultsByRecipientEmailLinkToken,
  createCertificationResultsLinkToken,
  decodeIfValid,
  getDecodedToken,
  extractExternalUserFromIdToken,
  extractPayloadFromPoleEmploiIdToken,
  extractResultRecipientEmailAndSessionId,
  extractSamlId,
  extractSessionId,
  extractTokenFromAuthChain,
  extractUserId,
  extractClientId,
  extractUserIdForCampaignResults,
};
