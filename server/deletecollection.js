const admin = require('firebase-admin');
const serviceAccount = require('./config/secret/matchmaker-d42d8-firebase-adminsdk-fbsvc-da9489f3aa.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function deleteCollection(collectionPath="stages") {
  const collectionRef = db.collection(collectionPath);
  const snapshot = await collectionRef.get();
  snapshot.forEach(doc => {
    doc.ref.delete();
  });
  console.log("Collection deleted");
}

deleteCollection("stages");