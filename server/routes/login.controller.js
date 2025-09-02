const {doesUserExist,getUserData,getUserInfo,sendToPython} = require('../model/login.model');
const {generateEmailAI} = require('../ML/gemini/gemini');

async function getUserLoginHtml(req,res){
    const {userName, password}= req.body;
    if(!userName || !password){
        return await res.status(400).json({success:false, error: "No userName or Password"});
    }
    try{
        return await res.status(200).json(await doesUserExist(userName,password));
    }catch(err){
     return await res.status(400).json({success:false, error: err});   
    }
}

async function getUser(req,res) {
    const {userName} = req.body;
    if(!userName){
        return await res.status(400).json({success:false, error: "No userName"});
    }
    try{
        return await res.status(200).json(await getUserData(userName));
    }catch(err){
        return await res.status(400).json({success:false, error:err});
    }
    
}

async function getSingleUser(req,res) {
    try {
        const id = req.params.id;
        return await res.status(200).json(await getUserInfo(id));
    } catch (err) {
        return await res.status(400).json({success:false, error:err});
    }

}

async function getAiUser(req,res) {
    try {
        const id = req.params.id;
        return await res.status(200).json(await sendToPython(id));
    } catch (err) {
        return await res.status(400).json({success:false, error:err});
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

module.exports = {getUserLoginHtml, getUser, getSingleUser,getAiUser, getEmailPrompt};