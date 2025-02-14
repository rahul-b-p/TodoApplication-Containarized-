import { FunctionStatus } from "../enums";
import { Otp } from "../models";
import { logFunctionInfo } from "../utils"



/**
 * Generates an OTP for the given user and saves it in the database with a 5-minute expiration time.
 */
export const saveOtp = async (otp: string, userId: string): Promise<string> => {
    const functionName = saveOtp.name;
    logFunctionInfo(functionName, FunctionStatus.START);
    try {
        const newOtp = new Otp({
            otp,
            userId
        });

        await newOtp.save();

        logFunctionInfo(functionName, FunctionStatus.SUCCESS);
        return otp;
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        throw new Error(error.message);
    }
}


/**
 * Generates an OTP for the given user and saves it in the database with a 5-minute expiration time.
 */
export const verifyOtp = async (userId: string, otp: string): Promise<boolean> => {
    const functionName = verifyOtp.name;
    logFunctionInfo(functionName, FunctionStatus.START);
    try {
        const otpExisted = await Otp.exists({ userId, otp });
        if (otpExisted) {
            await Otp.findByIdAndDelete(otpExisted._id);
        }

        logFunctionInfo(functionName, FunctionStatus.SUCCESS);
        return otpExisted !== null;
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        throw new Error(error.message);
    }
}