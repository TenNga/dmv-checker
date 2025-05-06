const axios = require('axios');
const nodemailer = require('nodemailer');

const URL = 'https://publicwebsiteapi.nydmvreservation.com/api/AvailableLocationDates?locationId=36&typeId=206&startDate=2025-05-06T18:51:01.432Z';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function checkAvailability() {
  try {
    const response = await axios.get(URL);
    const availableDates = response.data;

    const mayDates = availableDates?.LocationAvailabilityDates?.filter(date => date?.AvailabilityDate.startsWith('2025-05'));

    if (mayDates.length > 0) {
      console.log('✅ Found May Dates:', mayDates);

      await transporter.sendMail({
        from: `"DMV Checker" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: '🎉 DMV May Slot Available!',
        text: `DMV Appointment Available on: ${mayDates.join(', ')}`
      });
    } else {
      console.log('No May dates yet...');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

setInterval(checkAvailability, 5 * 60 * 1000);
checkAvailability();
