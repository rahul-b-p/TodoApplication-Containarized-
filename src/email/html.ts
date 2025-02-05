/**
 * To get OTP sending mail body in html format 
 */
export const getOtpMessageHTML = (otp: string) => {
    return `
<p>Your OTP (One-Time Password) is: <strong>${otp}</strong>.</p>
<p>This OTP will expire in <strong>5 minutes</strong>.</p>

    `
}


/**
 * To get User Updation notification mail in html format
 */

export const getUserUpdationNotificationHTML = (username: string, previousEmail: string, Updatedemail: string) => {
    return `
<b>Hi ${username},</b>

<p>Your email has been changed from <strong>${previousEmail}</strong> to <strong>${Updatedemail}</strong>!</p>
<p>Please verify your account by following the link below:</p>
<a href="[Verification Link]">Verify Email</a>

<p>Once you’ve completed the verification, you’ll have full access to the system. If you need any assistance, don’t hesitate to contact our support team.</p>

<p>We’re excited to have you with us. Welcome aboard!</p>

<p>Best regards,</p>
<p><b>Todo App</b></p>
<p><b>[Support Contact Information]</b></p>
    `
}