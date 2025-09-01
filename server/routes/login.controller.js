const {doesUserExist,getUserData,getUserInfo} = require('../model/login.model');

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

module.exports = {getUserLoginHtml, getUser, getSingleUser};