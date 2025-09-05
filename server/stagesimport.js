const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccount = require('./config/secret/matchmaker-d42d8-firebase-adminsdk-fbsvc-da9489f3aa.json');

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
