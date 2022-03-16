// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const poleEmploiService = require('../services/pole-emploi-service');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getPoleEmploiSendings({
  cursor,
  poleEmploiSendingRepository,
  filters
}: any) {
  const cursorData = await poleEmploiService.decodeCursor(cursor);
  const sendings = await poleEmploiSendingRepository.find(cursorData, filters);
  const link = _generateLink(sendings, filters);
  return { sendings, link };
};

function _generateLink(sendings: any, filters: any) {
  if (!sendings.length) return null;

  const lastSending = sendings[sendings.length - 1];
  const link = poleEmploiService.generateLink(lastSending, filters);
  return link;
}
