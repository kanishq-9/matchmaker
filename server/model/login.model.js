const { parse } = require('json2csv');
const { pythonCall } = require('../ML/runpython');
const admin = require('firebase-admin');
const serviceAccount = require('../config/secret/matchmaker-d42d8-firebase-adminsdk-fbsvc-da9489f3aa.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const {generateUserMatches} = require('../ML/gemini/gemini');

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
        return { success: true, userName: userData.email, id: userData.id };

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
            })).sort((a, b) => b.match_percentage - a.match_percentage);

        return filteredUsers;


    } catch (err) {
        throw new Error(err);

    }
}


async function sendToGemini(userId) {
    try {
        const userSnap = await db.collection('users').where("id", "==", Number(userId)).limit(1).get();
        if (userSnap.empty) throw new Error('Current user not found');
        const currentUser = userSnap.docs[0].data();


        const notesRef = db.collection('notes').doc(userId);
        const notesSnap = await notesRef.get();
        const notes = notesSnap.exists ? notesSnap.data().notes || {} : {};
        
        const allUsersSnap = await db.collection('users').get();
        const otherUsers = [];
        allUsersSnap.forEach(doc => {
            if (doc.id !== userId) {
                const data = doc.data();
                otherUsers.push({
                    userId: data.id,
                    full_name: data.full_name,
                    age: data.age,
                    gender: data.gender,
                    caste: data.caste,
                    college: data.college,
                    company: data.company,
                    dob: data.dob,
                    education: data.education,
                    expectations: data.expectations,
                    height_cm: data.height_cm,
                    hobbies: data.hobbies,
                    location: data.location,
                    marital_status: data.marital_status,
                    mother_tongue: data.mother_tongue,
                    occupation: data.occupation,
                    religion: data.religion,
                    salary_inr: data.siblings,
                    weight_kg: data.weight_kg,
                    notes:notes[String(data.id)]
                });
            }
        });

        const payload = {
            userId,
            currentUserProfile: currentUser,
            potentialMatches: otherUsers
        };

         
        const output = await generateUserMatches(payload);
        const matchMap = new Map(output.map(item => [item.userId, item.matchPercentage]));
        const allUser = allUsersSnap.docs.map(doc => doc.data());        
        const filteredUsers = allUser
            .filter(user => matchMap.has(user.id))
            .map(user => ({
                ...user,
                match_percentage: matchMap.get(user.id),
            })).sort((a, b) => b.match_percentage - a.match_percentage);
            
        return filteredUsers;


    } catch (err) {
        console.error('Error sending data to Gemini:', err);
        return { success: false, error: err.message };
    }
}



async function setUserNotes(senderId, profileId, notes) {
    try {
        const ref = db.collection("notes").doc(senderId);

        await ref.set(
            {
                notes: {
                    [profileId]: notes,
                },
            },
            { merge: true }
        );
        return true;
    } catch (err) {
        throw new Error("Could not save notes");
    }
}

async function getNoteForProfile(senderId, profileId) {
    try {
        const ref = db.collection("notes").doc(senderId);
        const docSnap = await ref.get();

        if (!docSnap.exists) return { success: false, error: "No notes for sender" };

        const notes = docSnap.data().notes || {};
        return {
            success: true,
            note: notes[profileId] || "",
        };
    } catch (err) {
        console.error("Error fetching profile note:", err);
        return { success: false, error: err.message };
    }
}



module.exports = { doesUserExist, getUserData, getUserInfo, sendToPython, setUserNotes, getNoteForProfile, sendToGemini };