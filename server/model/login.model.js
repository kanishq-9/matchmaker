const { parse } = require('json2csv');
const {pythonCall} = require('../ML/runpython');
const admin = require('firebase-admin');
const serviceAccount = require('../config/secret/matchmaker-d42d8-firebase-adminsdk-fbsvc-da9489f3aa.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function doesUserExist(userName, password) {
    try {
        const snapshot = await db.collection("users").where("email", "==", userName).limit(1).get();

        if (snapshot.empty) {
            console.log("no user");

            throw new Error("no user exist");
        }
        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();
        if (userData.password !== password) {
            throw new Error("Invalid password");
        }
        return { success: true, userName: userData.email, id:userData.id };

    } catch (err) {
        throw new Error(err);
    }
}




async function getUserData(userName) {
    try {
        const snapshot = await db.collection("users").where("email", "!=", userName).orderBy("email").get();
        if (snapshot.empty) {
            console.log("no user");

            throw new Error("no user exist");
        }

        const userData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { success: true, data: userData };

    } catch (err) {
        throw new Error(err);
    }
}

async function getUserInfo(id) {
    try {
        const snapshot = await db
            .collection("users")
            .where("id", "==", Number(id)) // make sure it's a number
            .limit(1)
            .get();

        if (snapshot.empty) {
            console.log("No user with id:", id);
            return { success: false, error: "User not found" };
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();


        return { success: true, data: userData };
    } catch (err) {
        throw new Error(err);
    }
}

async function sendToPython(userId) {
    try {
        const snapshot = await db.collection("users").get();
        if (snapshot.empty) {
            console.log("no user");

            throw new Error("no user exist");
        }
        const users = snapshot.docs.map(doc => doc.data());

        //convert users JSON to CSV
        const csvData = parse(users);
        const result = await pythonCall(userId, csvData);
        const matchMap = new Map(result.map(item => [item.id, item.match_percentage]));
        const filteredUsers = users
  .filter(user => matchMap.has(user.id))
  .map(user => ({
    ...user,
    match_percentage: matchMap.get(user.id),
  })).sort((a, b) => b.match_percentage - a.match_percentage);;

        return filteredUsers;


    } catch (err) {
        throw new Error(err);

    }
}

module.exports = { doesUserExist, getUserData, getUserInfo, sendToPython };