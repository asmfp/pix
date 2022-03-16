// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Tutorial'.
class Tutorial {
  duration: any;
  format: any;
  id: any;
  link: any;
  source: any;
  title: any;
  constructor({
    id,
    duration,
    format,
    link,
    source,
    title
  }: any = {}) {
    this.id = id;
    this.duration = duration;
    this.format = format;
    this.link = link;
    this.source = source;
    this.title = title;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Tutorial;
