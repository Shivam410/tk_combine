import { catchAsyncError } from "../middlewares/catchAsyncError.js";

import { Contact } from "../models/contactModel.js";
import ErrorHandler from "../utils/errorHandler.js";

import nodemailer from "nodemailer";

// CREATE NEW CONTACT

export const newContact = catchAsyncError(async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  // Save the contact message in the database
  const newMessage = new Contact({
    name,
    email,
    subject,
    message,
  });

  await newMessage.save();

  // Set up Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail", // Or another email service like SMTP if needed
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  // Email options
  const mailOptions = {
    from: email,
    to: process.env.GMAIL_USER,
    subject: `New Contact Message: ${subject}`,
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333;
              line-height: 1.6;
              background-color: #f4f4f4;
              padding: 20px;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .email-header {
              background-color: #4CAF50;
              color: white;
              padding: 10px;
              border-radius: 6px;
            }
            .email-content {
              margin-top: 20px;
            }
            .email-content p {
              font-size: 16px;
              margin-bottom: 10px;
            }
            .email-footer {
              margin-top: 20px;
              font-size: 12px;
              text-align: center;
              color: #888;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h2>New Contact Message</h2>
            </div>
            <div class="email-content">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <p>${message}</p>
            </div>
            <div class="email-footer">
              <p>Thank you for your time!</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  // Send the email to the client
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return next(new ErrorHandler("Error sending email", 500));
    }
    console.log("Email sent: " + info.response);
  });

  res.status(201).json({
    success: true,
    message: "Contact message sent successfully, and email sent to the client!",
    contact: newMessage,
  });
});

// GET ALL CONTACTS

export const getAllContacts = catchAsyncError(async (req, res, next) => {
  const contacts = await Contact.find();

  res.status(200).json({
    success: true,
    contacts,
  });
});

// GET SINGLE CONTACT

export const getSingleContact = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const contact = await Contact.findById(id);

  if (!contact) {
    return next(new ErrorHandler("Contact message not found !", 404));
  }

  res.status(200).json({
    success: true,
    contact,
  });
});

// DELETE SINGLE CONTACT

export const deleteSingleContact = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const contact = await Contact.findByIdAndDelete(id);

  if (!contact) {
    return next(new ErrorHandler("Contact message not found !", 404));
  }

  res.status(200).json({
    success: true,
    message: "Contact message deleted successfully!",
  });
});
