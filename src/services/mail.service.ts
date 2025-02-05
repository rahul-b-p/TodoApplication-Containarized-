import { SentMessageInfo } from "nodemailer";
import { HOST_EMAIL_ID, transporter } from "../config"
import { EmailOptions, OTPMailResponse } from "../types";
import { generateOtp, logFunctionInfo, logger } from "../utils"
import { FunctionStatus } from "../enums";
import { getOtpMessage, getOtpMessageHTML } from "../email";
import { errorMessage } from "../constants";



/**
 * Sends an email from the application's host address to the specified recipient with the provided message content.
 */
const sendEmail = async (emailOptions: EmailOptions): Promise<SentMessageInfo> => {
    try {
        return await transporter.sendMail({
            from: HOST_EMAIL_ID,
            ...emailOptions
        });
    } catch (error: any) {
        logger.error(error);
        throw new Error(`Node mailer Failed:${error.message}`);
    }
}


/**
 * Generates an OTP for initial login or account verification and sends it to the specified recipient's email address.
 */
export const sendEmailVerificationMail = async (email: string): Promise<OTPMailResponse> => {
    const functionName = sendEmailVerificationMail.name;
    logFunctionInfo(functionName, FunctionStatus.START);

    try {
        const otp = generateOtp();
        const emailOptions: EmailOptions = {
            to: email,
            subject: 'Your Email Verification OTP',
            text: getOtpMessage(otp),
            html: getOtpMessageHTML(otp)
        };

        const mailInfo = await sendEmail(emailOptions);

        logFunctionInfo(functionName, FunctionStatus.SUCCESS);
        return { mailInfo, otp };
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        throw new Error(errorMessage.FAILED_TO_SEND_OTP_EMAIL);
    }
};


/**
 * Generates an OTP for password reset and sends it to the specified recipient's email address.
 */
export const sendOtpForPasswordReset = async (email: string): Promise<OTPMailResponse> => {
    const functionName = sendOtpForPasswordReset.name;
    logFunctionInfo(functionName, FunctionStatus.START);
    try {
        const otp = generateOtp();
        const emailOptions: EmailOptions = {
            to: email,
            subject: 'Password Reset Request',
            text: getOtpMessage(otp),
            html: getOtpMessageHTML(otp)
        };

        const mailInfo = await sendEmail(emailOptions);

        logFunctionInfo(functionName, FunctionStatus.SUCCESS);
        return { mailInfo, otp };
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        throw new Error(errorMessage.FAILED_TO_SEND_OTP_EMAIL);
    }
};