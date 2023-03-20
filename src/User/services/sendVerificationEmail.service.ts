import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import databse_uri from '../../Config/default.config';
import * as fs from 'fs';
import { ApiError } from '../../ErrorHandlers/ApiError';


// Define a constant for the email subject
const emailSubject = 'Activate your account';

// Create a nodemailer transport object with SMTP details
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: databse_uri.EMAIL,
    pass: databse_uri.EMAIL_PASSWORD
  }
});

// Define an object to store activation codes
const activationCodes = {};

// Define a function to generate an activation code and store it in the activationCodes object
const generateActivationCode = (email: string): string => {
  const code = uuidv4();
  activationCodes[email] = code;
  const secreatKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const hex = Buffer.from(secreatKey).toString('hex');
  code + hex;
  return code;
};

// Define a function to send an activation email
const sendActivationEmail = async (email: string): Promise<void> => {
  // Generate a new activation code
  const code = generateActivationCode(email);
 
  // Create an activation link with the activation code
  const activationLink = `${databse_uri.LOCAL_HOST}/auth_email/activate?email=${email}&code=${code}`
  const prettifyHtml = fs.readFileSync('./src/HtmlPages/ActivationEmail.html', 'utf8');
  const UpdatedHtml = prettifyHtml.replace(/%%activationLink%%/g, activationLink);
  // Create a mailOptions object with the email details
  try {
    const mailOptions = {
      from: `"My App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: emailSubject,
      html: UpdatedHtml
    };
    if (!mailOptions.html) {
      throw new ApiError("Cannot Read Html", 500, 'Error in reading the html file')
    }
    const mail = await transporter.sendMail(mailOptions);
    if (!mail) {
      throw new ApiError("Cannot Send Email", 500, 'Error in sending the email')
    }

  }
  catch (err) {
    console.log(err);
  }


  // Send the email using the nodemailer transport object

};

// Define a function to verify an email address
const verifyEmail = (email: string, code: string): boolean => {
  if (activationCodes[email] === code) {
    // Remove the activation code from the object
    delete activationCodes[email];
    return true;
  } else {
    return false;
  }
};

export { sendActivationEmail, verifyEmail };
