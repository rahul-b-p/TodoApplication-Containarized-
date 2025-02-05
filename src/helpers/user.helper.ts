import { responseMessage } from "../constants";
import { UserUpdateArgs, UserUpdateBody, UserUpdateRequirments } from "../types";



export const getUpdateRequirments = (existingEmail: string, updateBody: UserUpdateBody) => {

    let updateReuirments: UserUpdateRequirments = { arguments: {}, message: "" }

    if (updateBody.email) {
        updateBody.verified = false;
        updateReuirments.arguments.$unset = { refreshToken: 1 };

        updateReuirments.mailTo = [existingEmail, updateBody.email];

        updateReuirments.message = `${responseMessage.USER_UPDATED}, ${responseMessage.EMAIL_VERIFICATION_REQUIRED}`;
    }
    else {

        updateReuirments.message = responseMessage.USER_UPDATED;
    }

    updateReuirments.arguments.$set = updateBody;

    return updateReuirments;
}