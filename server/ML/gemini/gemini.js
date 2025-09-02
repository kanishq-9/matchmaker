const { GoogleGenerativeAI } = require("@google/generative-ai");

require('dotenv').config();

// Setup Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);


async function generateEmailAI(profileData, userData) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    

    const prompt = `
    Generate a professional email where the sender ${userData.full_name} introduces himself to the matched profile user ${profileData.full_name} .
    sender background: ${JSON.stringify(userData)}.
    This email is for a matchmaking app, writing to ${profileData.full_name}.
    matched candidate background ${JSON.stringify(profileData)}.
    They are matched in matchmaking app name is "MatchMaking".
    
    Output format:
    Subject: ...
    Body: ...
    `;    

    const result = await model.generateContent(prompt);

    // Inspect Gemini response
    // console.log("Gemini raw result:", JSON.stringify(result, null, 2));

    const response = await result.response.text();

    const subjectMatch = response.match(/Subject:\s*(.*)/i);
    const bodyMatch = response.match(/Body:\s*([\s\S]*)/i);

    return {
      subject: subjectMatch ? subjectMatch[1].trim() : "Hello!",
      body: bodyMatch ? bodyMatch[1].trim() : response,
    };
  } catch (err) {
    console.error("Gemini Error:", err);
    throw new Error("failed to generate Email.");
  }
}


module.exports = {generateEmailAI}