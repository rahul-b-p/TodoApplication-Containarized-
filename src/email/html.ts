export const getOtpMessageHTML = (otp: string) => {
    return `
<p>Your OTP (One-Time Password) is: <strong>${otp}</strong>.</p>
<p>This OTP will expire in <strong>5 minutes</strong>.</p>

    `
}