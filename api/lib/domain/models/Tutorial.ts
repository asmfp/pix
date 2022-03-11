//@ts-nocheck

type TutorialInput = {
  id?: string;
  duration?: string;
  link?: string;
  format?: string;
  source?: string;
  title?: string;
};

class Tutorial {
  id?: string;
  duration?: string;
  link?: string;
  format?: string;
  source?: string;
  title?: string;

  constructor({ id, duration, format, link, source, title }: TutorialInput = {}) {
    this.id = id;
    this.duration = duration;
    this.format = format;
    this.link = link;
    this.source = source;
    this.title = title;
  }
}

module.exports = Tutorial;
