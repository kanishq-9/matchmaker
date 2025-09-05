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


async function generateUserMatches({ userId, currentUserProfile, notes, potentialMatches }) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
    You are a powerful AI matchmaker. 
    Current user id who wants a match: ${userId}
        Current user data who wants a match: ${JSON.stringify(currentUserProfile)}.
        Other users data: ${JSON.stringify(potentialMatches)}.
        For male customers: • Match with women who are younger, earn less, shorter, and have matching views on children For female customers: • Use thoughtful logic such as compatibility on profession, values, relocation preferences, etc.

        Find the top 20 best matches for the current user. in descending order. And remember matching opposite gender.
        For each match, provide:
        - userId
        - matchPercentage (0-100)

        Output JSON format:
        [
            { "userId": 123, "matchPercentage": 92 },
            { "userId": 456, "matchPercentage": 87 },
            ...
        ]
    `;
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();
    let matches = [];
    try {
      const jsonMatch = responseText.match(/\[.*\]/s);
      if (!jsonMatch) throw new Error("No JSON found in Gemini response");

      matches = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error("Failed to parse Gemini response:", responseText);
      throw new Error("Invalid response from Gemini");
    }    
    return  matches ;

  } catch (err) {
    console.error('Error sending data to Gemini:', err);
    return { success: false, error: err.message };
  }
}


module.exports = { generateEmailAI, generateUserMatches }