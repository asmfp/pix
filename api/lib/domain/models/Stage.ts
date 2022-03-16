// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Stage'.
class Stage {
  id: any;
  message: any;
  prescriberDescription: any;
  prescriberTitle: any;
  targetProfileId: any;
  threshold: any;
  title: any;
  constructor({
    id,
    title,
    message,
    threshold,
    prescriberTitle,
    prescriberDescription,
    targetProfileId
  }: any = {}) {
    this.id = id;
    this.title = title;
    this.message = message;
    this.threshold = threshold;
    this.prescriberTitle = prescriberTitle;
    this.prescriberDescription = prescriberDescription;
    this.targetProfileId = targetProfileId;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Stage;
