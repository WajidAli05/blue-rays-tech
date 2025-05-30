import mongoose from 'mongoose';
import dbConnection from '../config/dbConnection.js';
import AffiliateProgramSchema from '../models/affiliateProgramModel.js'; 
import { config } from 'dotenv';

config();

const affiliatePrograms = [
  { label: 'Amazon Associates', key: 'amazon' },
  { label: 'ShareASale', key: 'shareasale' },
  { label: 'Rakuten Marketing', key: 'rakuten' },
  { label: 'CJ Affiliate', key: 'cj_affiliate' },
  { label: 'ClickBank', key: 'clickbank' },
  { label: 'eBay Partner Network', key: 'ebay' },
  { label: 'PartnerStack', key: 'partnerstack' },
  { label: 'Bluehost Affiliate Program', key: 'bluehost' },
  { label: 'Shopify Affiliate Program', key: 'shopify' },
  { label: 'Fiverr Affiliate Program', key: 'fiverr' },
  { label: 'Wix Affiliate Program', key: 'wix' },
  { label: 'Awin', key: 'awin' },
  { label: 'FlexOffers', key: 'flexoffers' },
  { label: 'Target Affiliate Program', key: 'target' },
  { label: 'Udemy Affiliate Program', key: 'udemy' },
  { label: 'Envato Affiliate Program', key: 'envato' },
  { label: 'HostGator Affiliate Program', key: 'hostgator' },
  { label: 'SiteGround Affiliate Program', key: 'siteground' },
  { label: 'Adobe Affiliate Program', key: 'adobe' }
];

const seedAffiliatePrograms = () => {
  dbConnection()
    .then(() => AffiliateProgramSchema.deleteMany({}))
    .then(() => AffiliateProgramSchema.insertMany(affiliatePrograms))
    .then(() => {
      console.log('Affiliate programs seeded successfully');
    })
    .catch((err) => {
      console.error('Error seeding affiliate programs:', err);
    })
    .finally(() => {
      mongoose.connection.close();
    });
};

seedAffiliatePrograms();