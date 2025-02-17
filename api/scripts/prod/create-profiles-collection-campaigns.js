// Usage: node create-profile-collection-campaigns.js path/file.csv <creatorId>
// To use on file with columns |name, organizationId, customLandingPageText, creatorId|, those headers included
const bluebird = require('bluebird');
const { knex } = require('../../db/knex-database-connection');
const Campaign = require('../../lib/domain/models/Campaign');
const campaignCodeGenerator = require('../../lib/domain/services/campaigns/campaign-code-generator');
const campaignValidator = require('../../lib/domain/validators/campaign-validator');
const campaignRepository = require('../../lib/infrastructure/repositories/campaign-repository');
const { parseCsvWithHeader } = require('../helpers/csvHelpers');

function checkData(campaignData) {
  return campaignData.map(({ name, organizationId, customLandingPageText, creatorId }, index) => {
    if (!organizationId) {
      throw new Error(`Ligne ${index + 1}: L'organizationId est obligatoire pour la campagne de collecte de profils.`);
    }
    if (!name) {
      throw new Error(
        `Ligne ${index + 1}: Le nom de campagne est obligatoire pour la campagne de collecte de profils.`
      );
    }
    if (!creatorId) {
      throw new Error(`Ligne ${index + 1}: Le creatorId est obligatoire pour la campagne de collecte de profils.`);
    }

    return { name, organizationId, customLandingPageText, creatorId };
  });
}

async function prepareCampaigns(campaignsData) {
  const generatedList = [];
  const campaigns = await bluebird.map(
    campaignsData,
    async (campaignData) => {
      const campaign = {
        creatorId: campaignData.creatorId,
        organizationId: campaignData.organizationId,
        type: Campaign.types.PROFILES_COLLECTION,
        name: campaignData.name,
        customLandingPageText: campaignData.customLandingPageText,
        multipleSendings: campaignData.multipleSendings,
      };

      campaignValidator.validate(campaign);
      campaign.code = await campaignCodeGenerator.generate(campaignRepository, generatedList);
      generatedList.push(campaign.code);

      if (require.main === module)
        process.stdout.write(
          `Campagne de collecte de profils ${campaign.name} pour l'organisation ${campaign.organizationId} ===> ✔\n`
        );
      return campaign;
    },
    { concurrency: 10 }
  );

  return campaigns.flat();
}

function createProfilesCollectionCampaigns(campaigns) {
  return knex.batchInsert('campaigns', campaigns);
}

async function main() {
  try {
    const filePath = process.argv[2];

    console.log('Lecture et parsing du fichier csv... ');
    const csvData = await parseCsvWithHeader(filePath);

    console.log('Vérification des données du fichier csv...');
    const checkedData = checkData(csvData);

    console.log('Création des modèles campagne...');
    const campaigns = await prepareCampaigns(checkedData);

    console.log('Création des campagnes...');
    await createProfilesCollectionCampaigns(campaigns);

    console.log('FIN');
  } catch (error) {
    console.error('\x1b[31mErreur : %s\x1b[0m', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main().then(
    () => process.exit(0),
    (err) => {
      console.error(err);
      process.exit(1);
    }
  );
}

module.exports = {
  prepareCampaigns,
  checkData,
};
