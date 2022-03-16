// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'randomStri... Remove this comment to see the full error message
const randomString = require('randomstring');

// @ts-expect-error ts-migrate(7023) FIXME: 'generate' implicitly has return type 'any' becaus... Remove this comment to see the full error message
function generate(campaignRepository: any, pendingList = []) {
  const letters = randomString.generate({
    length: 6,
    charset: 'alphabetic',
    capitalization: 'uppercase',
    readable: true,
  });
  const numbers = randomString.generate({ length: 3, charset: 'numeric', readable: true });

  const generatedCampaignCode = letters.concat(numbers);

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'includes' does not exist on type '{}'.
  if (pendingList.includes(generatedCampaignCode)) {
    return generate(campaignRepository, pendingList);
  }

  return campaignRepository.isCodeAvailable(generatedCampaignCode).then((isCodeAvailable: any) => {
    if (isCodeAvailable) {
      // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
      return Promise.resolve(generatedCampaignCode);
    }
    return generate(campaignRepository, pendingList);
  });
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  generate,
};
