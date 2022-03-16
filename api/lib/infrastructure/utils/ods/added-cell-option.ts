// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class AddedCellOption {
  colspan: any;
  labels: any;
  positionOffset: any;
  rowspan: any;
  constructor({ labels = [], rowspan = 0, colspan = 0, positionOffset = 0 }) {
    this.labels = labels;
    this.rowspan = rowspan;
    this.colspan = colspan;
    this.positionOffset = positionOffset;
  }
};
