const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccount = require('./config/secret/matchmaker-d42d8-firebase-adminsdk-fbsvc-da9489f3aa.json');
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