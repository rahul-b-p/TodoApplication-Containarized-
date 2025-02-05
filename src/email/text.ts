export const getOtpMessage = (otp: string) => {
    return `
Your OTP (One-Time Password) is: ${otp}.
This OTP will expire in 5 minutes.

    `
}