// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  emailIsValid(email: any) {
    if (!email) {
      return false;
    }
    // Source: http://stackoverflow.com/a/46181/5430854
    const pattern =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'test' does not exist on type '{}'.
    return pattern.test(email.trim());
  },
};
