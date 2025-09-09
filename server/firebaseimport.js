const admin = require('firebase-admin');
const fs = require('fs');
require('dotenv').config();

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
async function importData() {
    const users = data.users;
    for(const key in users){
        const user = users[key];
        await db.collection("users").doc(key).set(user);
        console.log(`imported ${key}`);
        
    }
}

importData()
.then(()=>{
    console.log("import complete");
    process.exit();
})
.catch(err=>{
    console.error("❌ Error importing data:", err);
    process.exit(1);
})