

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>If you did not initiate this password reset, please contact our support team immediately.</p>
    <p>For security reasons, we recommend that you:</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Enable two-factor authentication if available</li>
      <li>Avoid using the same password across multiple sites</li>
    </ul>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>IsKalusugan</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
    <p>To reset your password, click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
    </div>
    <p>This link will expire in 1 hour for security reasons.</p>
    <p>Best regards,<br>IsKalusugan</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const DOCUMENT_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document Request Notification</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Document Request Notification</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Dear {firstName},</p>
    <p>Your document request has been successfully processed.</p>
    
    <div style="margin: 20px 0; padding: 15px; background-color: #e9f7ef; border-left: 4px solid #4CAF50; border-radius: 4px;">
      <p style="margin: 0;"><strong>Signed Request Form:</strong></p>
      <a href="{signedRequestFormUrl}" style="color: #4CAF50; text-decoration: none; word-break: break-all;">
        Access your form here
      </a>
    </div>

    <p>You can also view the attached request slip by logging into your account in our system.</p>
    
    <div style="margin: 30px 0; padding: 15px; background-color: #f5f5f5; border-radius: 4px;">
      <p style="margin: 0;"><strong>Next Steps:</strong></p>
      <ul style="margin-top: 10px;">
        <li>Download and save your signed request form</li>
        <li>Keep this email for your records</li>
        <li>Contact us if you need any modifications</li>
      </ul>
    </div>

    <p>If you have any questions or concerns, please don't hesitate to reach out to our support team.</p>
    
    <p>Best regards,<br>IsKalusugan</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const DOCTOR_DOCUMENT_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Laboratory Request from Doctor</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Laboratory Request from Doctor</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Dear {firstName},</p>
    <p>Doctor {doctor}, has requested the following laboratory documents.</p>
    <div style="margin: 20px 0; padding: 15px; background-color: #e9f7ef; border-left: 4px solid #4CAF50; border-radius: 4px;">
      <p style="margin: 0;"><strong>Requested Tests:</strong></p>
      <p>{test}</p>
    </div>

    <div style="margin: 20px 0; padding: 15px; background-color: #e9f7ef; border-left: 4px solid #4CAF50; border-radius: 4px;">
      <p style="margin: 0;"><strong>Laboratory Request Form:</strong></p>
       <a href="{signedRequestFormUrl}" style="color: #4CAF50; text-decoration: none; word-break: break-all;">
        Access your form here
      </a>
    </div>
    
    <div style="margin: 30px 0; padding: 15px; background-color: #f5f5f5; border-radius: 4px;">
      <p style="margin: 0;"><strong>Next Steps:</strong></p>
      <ul style="margin-top: 10px;">
        <li>Download and save your signed request form</li>
        <li>Keep this email for your records</li>
        <li>Contact us if you need any modifications</li>
      </ul>
    </div>

    <p>If you have any questions or concerns, please don't hesitate to reach out to our support team.</p>
    
    <p>Best regards,<br>IsKalusugan</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const ANNUALPE_SCHEDULE_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Annual PE Schedule Now Available</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Annual PE Schedule</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Dear {firstName},</p>
    <p>Your schedule is now up for viewing in the system..</p>
    
    <div style="margin: 20px 0; padding: 15px; background-color: #e9f7ef; border-left: 4px solid #4CAF50; border-radius: 4px;">
      <p style="margin: 0;"><strong>Here is your assigned date: </strong></p>
      <p style="color: #4CAF50; text-decoration: none; word-break: break-all;">
        {schedule}
      </p>
    </div>

    <p>You can also view your schedule by logging into your account in our system.</p>
    
    <div style="margin: 30px 0; padding: 15px; background-color: #f5f5f5; border-radius: 4px;">
      <p style="margin: 0;"><strong>Next Steps:</strong></p>
      <ul style="margin-top: 10px;">
        <li>Download and bring your fully filled up Annual PE Forms</li>
        <li>Be there on the assigned schedule (9AM - 4PM) </li>
        <li>You may reschedule your annual pe by logging in to the system</li>
      </ul>
    </div>

    <p>If you have any questions or concerns, please don't hesitate to reach out to us.</p>
    
    <p>Best regards,<br>IsKalusugan</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const APPROVED_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Annual PE Status Approved</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Annual PE Status: APPROVED</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Dear {firstName},</p>
    <p>Your Annual Physical Examination documents have been verified and approved.</p>
    
    <div style="margin: 20px 0; padding: 15px; background-color: #e9f7ef; border-left: 4px solid #4CAF50; border-radius: 4px;">
      <p style="margin: 0;"><strong>Your Medical Certificate: </strong></p>
      <p style="color: #4CAF50; text-decoration: none; word-break: break-all;">
        {medcert}
      </p>
    </div>

    <p>You can view your medical certificate by:</p>
    <ul style="margin-top: 10px;">
      <li>Clicking the link above</li>
      <li>Logging into your account in our system</li>
      <li>Visiting the HSU to claim a physical copy</li>
    </ul>
    
    <div style="margin: 30px 0; padding: 15px; background-color: #f5f5f5; border-radius: 4px;">
      <p style="margin: 0;"><strong>Important Reminders: </strong></p>
      <ul style="margin-top: 10px;">
        <li>Keep your medical certificate for enrollment processes</li>
        <li>The HSU will not be liable for lost physical medical certificates</li>
        <li>Requesting a new physical medical certificate may take time</li>
      </ul>
    </div>

    <p>If you have any questions or concerns, please don't hesitate to contact HSU.</p>
    
    <p>Best regards,<br>IsKalusugan</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const DENIED_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Annual PE Status: Action Required</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #dc3545, #c82333); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Annual PE Status: NOT APPROVED</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Dear {firstName},</p>
    <p>Your Annual Physical Examination documents require attention.</p>
    
    <div style="margin: 20px 0; padding: 15px; background-color: #f8d7da; border-left: 4px solid #dc3545; border-radius: 4px;">
      <p style="margin: 0;"><strong>Reason for Non-Approval: </strong></p>
      <p style="color: #721c24;">
        {comment}
      </p>
    </div>

    <p>Next Steps:</p>
    <ul style="margin-top: 10px;">
      <li>Review the feedback provided above</li>
      <li>Make the necessary corrections or updates</li>
      <li>Resubmit your documents through the system</li>
      <li>Contact HSU if you need clarification</li>
    </ul>

    <p>If you have any questions or need assistance, please contact HSU immediately.</p>
    
    <p>Best regards,<br>IsKalusugan</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const MISSING_DOCUMENT_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Annual PE Status: Missing Document Notif</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #dc3545, #c82333); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Annual PE Status: MISSING DOCUMENT </h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Dear {firstName},</p>
    <p>Your Annual Physical Examination documents require attention.</p>
    
    <div style="margin: 20px 0; padding: 15px; background-color: #f8d7da; border-left: 4px solid #dc3545; border-radius: 4px;">
      <p style="margin: 0;">We noticed that your <strong>{docType} </strong> is missing from your submission. </p>
      <p>Please upload it as soon as possible to complete your Annual Physical Examination requirements.</p>

    </div>

  
    <p>If you have any questions or need assistance, please contact HSU immediately.</p>
    
    <p>Best regards,<br>IsKalusugan</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const RESCHEDULE_SCHEDULE_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reschedule Dates Now Available</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Reschedule Approved</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Dear {firstName},</p>
    <p>Your reschedule request is now approved</p>
    
    <div style="margin: 20px 0; padding: 15px; background-color: #e9f7ef; border-left: 4px solid #4CAF50; border-radius: 4px;">
      <p style="margin: 0;"><strong>Here are available dates for you to reschedule: </strong></p>
      <p style="color: #4CAF50; text-decoration: none; word-break: break-all;">
        {schedule}
      </p>
    </div>

    <p>Log in to the system to select your preferred date of new annual pe schedule</p>
    
    <div style="margin: 30px 0; padding: 15px; background-color: #f5f5f5; border-radius: 4px;">
      <p style="margin: 0;"><strong>Next Steps:</strong></p>
      <ul style="margin-top: 10px;">
        <li>Download and bring your fully filled up Annual PE Forms</li>
        <li>Be there on the assigned schedule (9AM - 4PM) </li>
        <li>You may reschedule your annual pe by logging in to the system</li>
      </ul>
    </div>

    <p>If you have any questions or concerns, please don't hesitate to reach out to us.</p>
    
    <p>Best regards,<br>IsKalusugan</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const RESCHEDULE_DENIED_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reschedule Request is Denied</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right,rgb(230, 41, 41),rgb(212, 44, 44)); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Reschedule Denied</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Dear {firstName},</p>
    <p>Your reschedule request is denied</p>
    
    <div style="margin: 20px 0; padding: 15px; background-color: #e9f7ef; border-left: 4px solid #4CAF50; border-radius: 4px;">
      <p style="margin: 0;"><strong>{rescheduleRemarks} </strong></p>
    </div>

    <p>You may request to be rescheduled again or go on with your initial date.</p>
    
    <div style="margin: 30px 0; padding: 15px; background-color: #f5f5f5; border-radius: 4px;">
      <p style="margin: 0;"><strong>Next Steps:</strong></p>
      <ul style="margin-top: 10px;">
        <li>Download and bring your fully filled up Annual PE Forms</li>
        <li>Be there on the assigned schedule (9AM - 4PM) </li>
        <li>You may reschedule your annual pe by logging in to the system</li>
      </ul>
    </div>

    <p>If you have any questions or concerns, please don't hesitate to reach out to us.</p>
    
    <p>Best regards,<br>IsKalusugan</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const ACCOUNT_CREATED_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>isKalusugan Account Created</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Account Details</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Dear {firstName},</p>
    <p>Here are your isKalusugan credentials: </p>
    
    <div style="margin: 20px 0; padding: 15px; background-color: #e9f7ef; border-left: 4px solid #4CAF50; border-radius: 4px;">
      <p style="color: #4CAF50; text-decoration: none; word-break: break-all;">
        Email: {email}
      </p>
      <p style="color: #4CAF50; text-decoration: none; word-break: break-all;">
        Password: {password}
      </p>
    </div>

    <p>Log in to the system using the account details above or sign-in directly from your UP mail using gmail. </p>
    
    <div style="margin: 30px 0; padding: 15px; background-color: #f5f5f5; border-radius: 4px;">
      <p style="margin: 0;"><strong>Next Steps:</strong></p>
      <ul style="margin-top: 10px;">
        <li>Log in to isKalusugan </li>
        <li>Navigate to Account</li>
        <li>Change Password</li>
      </ul>
    </div>

    <p>If you have any questions or concerns, please don't hesitate to reach out to us.</p>
    
    <p>Best regards,<br>IsKalusugan</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;
