// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ReachedSta... Remove this comment to see the full error message
class ReachedStage {
  id: any;
  message: any;
  starCount: any;
  threshold: any;
  title: any;
  constructor(masteryRate: any, stages: any) {
    const stagesOrdered = stages.sort((a: any, b: any) => a.threshold - b.threshold);
    const stagesReached = stagesOrdered.filter(({
      threshold
    }: any) => threshold <= masteryRate * 100);
    const lastStageReached = stagesReached[stagesReached.length - 1];

    this.id = lastStageReached.id;
    this.title = lastStageReached.title;
    this.message = lastStageReached.message;
    this.threshold = lastStageReached.threshold;

    this.starCount = stagesReached.length;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ReachedStage;
