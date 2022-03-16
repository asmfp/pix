// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Country'.
class Country {
  code: any;
  matcher: any;
  name: any;
  constructor({
    code,
    name,
    matcher
  }: any) {
    this.code = code;
    this.name = name;
    this.matcher = matcher;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  Country,
};
