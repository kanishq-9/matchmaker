const {
    doesUserExist,
    getUserData,
    getUserInfo,
    sendToPython,
    setUserNotes,
    getNoteForProfile,
    sendToGemini,
    getJourneyProfile,
    getJourneyOneProfileUpdated,
    getJourneyManyProfileUpdated,
    getJourneyProfileAll
} = require('../model/login.model');
const { generateEmailAI } = require('../ML/gemini/gemini');

async function getUserLoginHtml(req, res) {
    const { userName, password } = req.body;
    if (!userName || !password) {
        return await res.status(400).json({ success: false, error: "No userName or Password" });
    }
    try {
        return await res.status(200).json(await doesUserExist(userName, password));
    } catch (err) {
        return await res.status(400).json({ success: false, error: err });
    }
}

async function getUser(req, res) {
    const { userName } = req.body;
    if (!userName) {
        return await res.status(400).json({ success: false, error: "No userName" });
    }
    try {
        return await res.status(200).json(await getUserData(userName));
    } catch (err) {
        return await res.status(400).json({ success: false, error: err });
    }

}

async function getSingleUser(req, res) {
    try {
        const id = req.params.id;
        return await res.status(200).json(await getUserInfo(id));
    } catch (err) {
        return await res.status(400).json({ success: false, error: err });
    }

}

async function getAiUser(req, res) {
    try {
        const id = req.params.id;
        return await res.status(200).json(await sendToPython(id));
    } catch (err) {
        return await res.status(400).json({ success: false, error: err });
    }

}

async function getAdvancedAiUser(req, res) {
    try {
        const id = req.params.id;
        return await res.status(200).json(await sendToGemini(id));
    } catch (err) {
        return await res.status(400).json({ success: false, error: err });
    }
}



async function getEmailPrompt(req, res) {
    try {
        const { profileData, userData } = req.body;
        const emailData = await generateEmailAI(profileData, userData);
        return res.status(200).json({ success: true, data: emailData });

    } catch (err) {
        console.error("❌ ERROR in getEmailPrompt:", err.message || err);
        return res.status(500).json({ success: false, error: err.message || "Internal Server Error" });
    }
}


async function setNotes(req, res) {
    try {
        const { functionality, senderId, profileId, notes } = req.body;

        if (functionality === 'save') {
            return res.status(200).json({ success: await setUserNotes(senderId, profileId, notes) });

        } else {
            return res.status(200).json({ data: await getNoteForProfile(senderId, profileId) });
        }
    } catch (err) {
        return await res.status(400).json({ success: false, error: err.message });
    }
}

async function getJourney(req, res) {
    try {
        const { userId, profileId } = req.body;
        return res.status(200).json(await getJourneyProfile(userId, profileId));
    } catch (err) {
        return await res.status(400).json({ success: false, error: err.message });
    }
}


async function getJourneyAll(req,res) {
    try {
        const { userId, profileId } = req.body;
        return res.status(200).json(await getJourneyProfileAll(userId));
    } catch (err) {
        return await res.status(400).json({ success: false, error: err.message });
    }
}

async function getJourneyUpdated(req, res) {
    try {
        const {
            updateType,
            accept,
            userId,
            profileId,
            profileViewed,
            matchRequestSent,
            matchCommitted,
        } = req.body;

        if (updateType === "single") {
            return res.status(200).json(await getJourneyOneProfileUpdated(
                userId,
                profileId,
                profileViewed,
                matchRequestSent,
                matchCommitted,
                accept
            ));
        } else if (updateType === "multiple") {
            return res.status(200).json(await getJourneyManyProfileUpdated(
                userId,
                profileId,
                profileViewed,
                matchRequestSent,
                matchCommitted,
                accept
            ));
        }

    } catch (err) {
        return await res.status(400).json({ success: false, error: err.message });
    }
}

module.exports = {
    getUserLoginHtml,
    getUser,
    getSingleUser,
    getAiUser,
    getEmailPrompt,
    setNotes,
    getAdvancedAiUser,
    getJourney,
    getJourneyUpdated,
    getJourneyAll
};