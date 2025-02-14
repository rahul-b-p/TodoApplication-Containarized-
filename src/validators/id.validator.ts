import mongoose from "mongoose"

/**
 * Validates that given id is mongoose object id or not
 */
export const validateObjectId = (id: string): boolean => {
    return mongoose.Types.ObjectId.isValid(id)
}