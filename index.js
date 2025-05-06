// index.js
require('dotenv').config();
const axios = require('axios');
const nodemailer = require('nodemailer');

const DMV_API_URL = "https://publicwebsiteapi.nydmvreservation.com/api/AvailableLocationDates?locationId=36&typeId=206&startDate=2025-05-06T18:51:01.432Z";

async function checkDMV() {
  try {
    const response = await axios.get(DMV_API_URL);
    const dates = response.data;

    const mayDates = dates?.LocationAvailabilityDates?.filter(date => date?.AvailabilityDate?.includes("2025-05"));
    if (mayDates.length > 0) {
      console.log("✅ May dates available!", mayDates);
      await sendEmail(mayDates.join(", "));
    } else {
      console.log("❌ No May dates available at this time.");
    }
  } catch (err) {
    console.error("❗ Error checking DMV:", err.message);
  }
}

async function sendEmail(availableDates) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use Gmail App Password
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: "✅ DMV May Slots Found!",
    text: `The following May dates are available:\n\n${availableDates}`,
  });

  console.log("📩 Email sent!");
}

checkDMV();
