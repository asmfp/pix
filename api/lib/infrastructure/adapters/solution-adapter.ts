// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Solution'.
const Solution = require('../../domain/models/Solution');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('../../../lib/infrastructure/utils/lodash-utils');

function statusToBoolean(value: any) {
  if (typeof value === 'boolean') {
    return value;
  }
  return value !== 'Désactivé';
}

function _getAllBlocks(proposals: any) {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Array'.
  return proposals ? Array.from(proposals.matchAll(/\$\{(.*?)\}/g)) : [];
}

function _getKeyOfBlock(block: any) {
  return block.replace('${', '').match(/^(.+?)(#|§|}| options)+/i)[1];
}

function _extractTypeOfQroc(datasourceObject: any) {
  if (datasourceObject.type === 'QCU' || datasourceObject.type === 'QCM') {
    return {};
  }
  const qrocBlocksTypes = {};
  const qrocBlocks = _getAllBlocks(datasourceObject.proposals);

  qrocBlocks.forEach((qrocBlock: any) => {
    const blockText = qrocBlock[0];
    const qrocBlockKey = _getKeyOfBlock(blockText);
    const qrocBlockType = blockText.includes('options=') ? 'select' : 'input';
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    qrocBlocksTypes[qrocBlockKey] = qrocBlockType;
  });

  return qrocBlocksTypes;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  fromDatasourceObject(datasourceObject: any) {
    const scoring = _.ensureString(datasourceObject.scoring).replace(/@/g, ''); // XXX YAML ne supporte pas @
    const qrocBlocksTypes = _extractTypeOfQroc(datasourceObject);
    return new Solution({
      id: datasourceObject.id,
      isT1Enabled: statusToBoolean(datasourceObject.t1Status),
      isT2Enabled: statusToBoolean(datasourceObject.t2Status),
      isT3Enabled: statusToBoolean(datasourceObject.t3Status),
      type: datasourceObject.type,
      value: datasourceObject.solution,
      scoring,
      qrocBlocksTypes,
    });
  },
};
