const admin = require('firebase-admin');
const fs = require('fs');

import dotenv from "dotenv";
dotenv.config();

const serviceAccount = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const data = JSON.parse(fs.readFileSync("../docs/matrimonial_user_dataset.json","utf-8"));

const stageTemplate = {
  "profileViewed": false,
  "matchRequestSent": false,
  "matchCommitted": false,
};

async function importStages() {
  const users = Object.values(data.users);
  
  

  for (const currentUser of users) {
    const currentUserId = String(currentUser.id);
    const stages = {};

    for (const profile of users) {
        const profileId = String(profile.id);
      if (profileId !== currentUserId) {
        stages[profileId] = { ...stageTemplate };
      }
    }

    await db.collection("stages").doc(currentUserId).set(stages);
    console.log(`Stages created for user ${currentUserId}`);
  }
}

importStages()
  .then(() => {
    console.log("✅ All stages imported successfully");
    process.exit();
  })
  .catch(err => {
    console.error("❌ Error importing stages:", err);
    process.exit(1);
  });
