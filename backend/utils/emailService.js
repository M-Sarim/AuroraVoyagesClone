import nodemailer from "nodemailer";
import dotenv from "dotenv";
import pkg from "node-fetch";
const { default: fetch } = pkg;

// Load environment variables
dotenv.config();

// Create a test account at Ethereal Email for development
const createTestAccount = async () => {
  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log("Created Ethereal Email test account:");
    console.log("- Email:", testAccount.user);
    console.log("- Password:", testAccount.pass);
    return testAccount;
  } catch (error) {
    console.error("Failed to create test account:", error);
    return null;
  }
};

// Create reusable transporter object using SMTP transport
const createTransporter = async () => {
  // Check if we're in development mode and should use Ethereal Email
  if (
    process.env.NODE_ENV === "development" &&
    process.env.USE_ETHEREAL === "true"
  ) {
    console.log("Using Ethereal Email for testing");
    const testAccount = await createTestAccount();
    if (testAccount) {
      return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }
  }

  // Check if we should use SendinBlue/Brevo
  if (process.env.USE_SENDINBLUE === "true" && process.env.SENDINBLUE_API_KEY) {
    console.log("Using SendinBlue/Brevo for email delivery");
    return nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SENDINBLUE_SMTP_USER,
        pass: process.env.SENDINBLUE_SMTP_PASSWORD,
      },
    });
  } else {
    // Default to Gmail
    console.log("Using Gmail for email delivery");
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
};

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {String} options.to - Recipient email
 * @param {String} options.subject - Email subject
 * @param {String} options.text - Plain text version of email
 * @param {String} options.html - HTML version of email
 * @returns {Promise} - Resolves with info about the sent email
 */
/**
 * Send email using SendinBlue/Brevo API directly (as a fallback)
 * @param {Object} options - Email options
 * @returns {Promise} - Resolves with info about the sent email
 */
const sendEmailViaSendinBlueAPI = async (options) => {
  try {
    console.log("Attempting to send email via SendinBlue/Brevo API");

    // Validate API key is available
    if (!process.env.SENDINBLUE_API_KEY) {
      throw new Error("SendinBlue/Brevo API key is not configured");
    }

    // Prepare request payload
    const payload = {
      sender: {
        name: "Aurora Voyages",
        email: process.env.SENDINBLUE_SMTP_USER || process.env.EMAIL_USER,
      },
      to: [{ email: options.to }],
      subject: options.subject,
      htmlContent: options.html,
      textContent: options.text,
    };

    // Log request details (without sensitive info)
    console.log("SendinBlue/Brevo API request:", {
      to: options.to,
      subject: options.subject,
      sender: payload.sender,
    });

    // Use fetch API to send email via Brevo API
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.SENDINBLUE_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Handle API response
    if (!response.ok) {
      let errorMessage = `Brevo API error: HTTP ${response.status}`;

      try {
        const errorData = await response.json();
        errorMessage = `Brevo API error: ${JSON.stringify(errorData)}`;
        console.error("Brevo API error details:", errorData);
      } catch (jsonError) {
        // If response is not JSON, use text instead
        const errorText = await response.text();
        errorMessage = `Brevo API error: ${errorText || response.statusText}`;
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("Email sent successfully via Brevo API:", data);
    return data;
  } catch (error) {
    console.error("Error sending email via Brevo API:", error);

    // Add more context to the error
    const enhancedError = new Error(
      `Failed to send email via Brevo API: ${error.message}`
    );
    enhancedError.originalError = error;
    enhancedError.code = error.code || "BREVO_API_ERROR";

    throw enhancedError;
  }
};

/**
 * Sleep function for retry mechanism
 * @param {Number} ms - Milliseconds to sleep
 * @returns {Promise} - Resolves after the specified time
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Send an email with retry mechanism
 * @param {Object} options - Email options
 * @param {String} options.to - Recipient email
 * @param {String} options.subject - Email subject
 * @param {String} options.text - Plain text version of email
 * @param {String} options.html - HTML version of email
 * @returns {Promise} - Resolves with info about the sent email
 */
export const sendEmail = async (options) => {
  // Retry configuration
  const maxRetries = 3;
  const initialBackoff = 1000; // 1 second
  let retryCount = 0;
  let lastError = null;

  while (retryCount < maxRetries) {
    try {
      // First try with nodemailer transport
      const transporter = await createTransporter();

      const mailOptions = {
        from: `"Aurora Voyages" <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log(
          `Email sent via nodemailer (attempt ${retryCount + 1}):`,
          info.messageId
        );

        // If using Ethereal, provide a link to view the email
        if (info.messageId && info.messageId.includes("ethereal")) {
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
          return {
            ...info,
            previewUrl: nodemailer.getTestMessageUrl(info),
          };
        }

        return info;
      } catch (transportError) {
        console.error(
          `Error sending email via nodemailer (attempt ${retryCount + 1}):`,
          transportError
        );
        lastError = transportError;

        // If SendinBlue API key is available, try sending via API as fallback
        if (process.env.SENDINBLUE_API_KEY) {
          console.log("Falling back to SendinBlue API");
          try {
            return await sendEmailViaSendinBlueAPI(options);
          } catch (apiError) {
            console.error(
              `Error sending email via SendinBlue API (attempt ${
                retryCount + 1
              }):`,
              apiError
            );
            lastError = apiError;
            // Continue to retry logic
          }
        } else {
          // Continue to retry logic
        }
      }

      // If we get here, both methods failed, so we'll retry
      retryCount++;

      if (retryCount < maxRetries) {
        // Calculate backoff with exponential increase (1s, 2s, 4s, etc.)
        const backoff = initialBackoff * Math.pow(2, retryCount - 1);
        console.log(
          `Retrying email send in ${backoff}ms (attempt ${
            retryCount + 1
          } of ${maxRetries})...`
        );
        await sleep(backoff);
      }
    } catch (error) {
      console.error(
        `Unexpected error in email sending process (attempt ${
          retryCount + 1
        }):`,
        error
      );
      lastError = error;
      retryCount++;

      if (retryCount < maxRetries) {
        const backoff = initialBackoff * Math.pow(2, retryCount - 1);
        console.log(
          `Retrying after error in ${backoff}ms (attempt ${
            retryCount + 1
          } of ${maxRetries})...`
        );
        await sleep(backoff);
      }
    }
  }

  // If we've exhausted all retries, log a critical error and throw the last error
  console.error(
    `CRITICAL: Failed to send email after ${maxRetries} attempts.`,
    {
      recipient: options.to,
      subject: options.subject,
      lastError: lastError?.message || "Unknown error",
    }
  );

  // TODO: Add notification to admin about persistent email failures
  // This could be implemented by storing failed emails in the database
  // and creating a dashboard for admins to view and retry them

  throw lastError || new Error("Failed to send email after multiple attempts");
};

/**
 * Send a password reset email with a reset link
 * @param {String} email - Recipient email
 * @param {String} resetToken - Password reset token
 * @param {String} userName - User's name
 * @returns {Promise} - Resolves with info about the sent email
 */
export const sendPasswordResetEmail = async (email, resetToken, userName) => {
  const resetUrl = `${
    process.env.FRONTEND_URL || "http://localhost:3000"
  }/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

  const subject = "Aurora Voyages - Password Reset";

  const text = `Hello ${userName},\n\n
    You are receiving this email because you (or someone else) has requested a password reset for your account.\n\n
    Please click on the following link, or paste it into your browser to complete the process:\n\n
    ${resetUrl}\n\n
    This link will be valid for 1 hour.\n\n
    If you did not request this, please ignore this email and your password will remain unchanged.\n\n
    Best regards,\n
    Aurora Voyages Team`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #4F46E5;">Aurora Voyages</h1>
      </div>
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px;">
        <h2 style="color: #111827;">Password Reset Request</h2>
        <p>Hello ${userName},</p>
        <p>You are receiving this email because you (or someone else) has requested a password reset for your account.</p>
        <p>Please click on the button below to complete the process:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>This link will be valid for 1 hour.</p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <p>Best regards,<br>Aurora Voyages Team</p>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #6B7280; font-size: 12px;">
        <p>© ${new Date().getFullYear()} Aurora Voyages. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    text,
    html,
  });
};
