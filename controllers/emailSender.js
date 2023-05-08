const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config({ path: "../.env" });
const OAuth2 = google.auth.OAuth2;

//Credentials
const clientID = process.env.GOOGLE_CLIENT_ID;
const secretKey = process.env.GOOGLE_SECRET_KEY;
const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
const gcpUser = process.env.GCP_USER;

const OAuth2_client = new OAuth2(clientID, secretKey);
OAuth2_client.setCredentials({ refresh_token: refreshToken });

function sendMail(name, recipient) {
  const accessToken = OAuth2_client.getAccessToken();

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: gcpUser,
      clientId: clientID,
      clientSecret: secretKey,
      refreshToken: refreshToken,
      accessToken: accessToken,
    },
  });

  const mailOptions = {
    from: `Ivan Balinov <${gcpUser}>`,
    to: recipient,
    subject: "A Message From Node Mailer.",
    text: "Кокошките спряха да снасят от тия Error-и....",
  };

  transport.sendMail(mailOptions, (error, result) => {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Success... Message Sended:", result);
    }
    transport.close();
  });
}

sendMail("Ivan", "solidrecoil@gmail.com");
