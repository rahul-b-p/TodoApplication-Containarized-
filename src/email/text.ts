/**
 * to get otp send mail in text format
 */
export const getOtpMessage = (otp: string) => {
    return `
Your OTP (One-Time Password) is: ${otp}.
This OTP will expire in 5 minutes.

    `
}

/**
 * To get user updation notification mail in text format
 */
export const getUserUpdationNotification = (username: string, previousEmail: string, Updatedemail: string) => {
    return `
Hi ${username},

Your email has been changed from ${previousEmail} to ${Updatedemail}!

Please verify your account by following the link below:
[Verification Link]

Once you’ve completed the verification, you’ll have full access to the system. If you need any assistance, don’t hesitate to contact our support team.

We’re excited to have you with us. Welcome aboard!

Best regards,
[Your Company Name]
[Support Contact Information]

    `
}