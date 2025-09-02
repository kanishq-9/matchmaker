const fs = require("fs");
const path = require('path');
const { Parser } = require("json2csv");

// Load your JSON file
const rawData = fs.readFileSync(path.join(__dirname,"..","..","docs","matrimonial_user_dataset.json"));
const data = JSON.parse(rawData).users;  // your users object

// Convert to an array
const usersArray = Object.values(data);

// Define CSV fields
const fields = [
  "id",
  "full_name",
  "gender",
  "age",
  "height_cm",
  "weight_kg",
  "dob",
  "religion",
  "caste",
  "mother_tongue",
  "education",
  "college",
  "occupation",
  "company",
  "salary_inr",
  "marital_status",
  "location",
  "father_name",
  "father_occupation",
  "mother_name",
  "mother_occupation",
  "siblings",
  "hobbies",
  "expectations",
  "profile_photo",
  "email",
  "password"
];

// Convert JSON → CSV
const json2csvParser = new Parser({ fields });
const csv = json2csvParser.parse(usersArray);

// Save CSV
fs.writeFileSync(path.join(__dirname,"..","..","docs","matrimonial_user_dataset.csv"), csv);

console.log("✅ CSV file created: matrimonial_users.csv");
