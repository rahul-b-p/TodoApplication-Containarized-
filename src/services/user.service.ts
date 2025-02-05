import { FunctionStatus, Roles, UserSortArgs } from "../enums";
import { calculatePageSkip } from "../helpers";
import { IUser } from "../interfaces";
import { User } from "../models";
import { IUserData, UserFetchResult, UserFilterQuery, UserInsertArgs, UserToShow, UserUpdateArgs } from "../types";
import { getUserSortArgs, hashPassword, logFunctionInfo } from "../utils";



/**
 * To check if there any admin exists on database
 */
export const isAdminExists = async (): Promise<boolean> => {
    const functionName = isAdminExists.name;
    logFunctionInfo(functionName, FunctionStatus.START);

    try {
        const adminExists = await User.exists({ role: Roles.ADMIN });

        adminExists && logFunctionInfo(functionName, FunctionStatus.SUCCESS);

        return adminExists !== null;
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        throw new Error(error.message);
    }
}


/**
 * Inserts a new user with required feilds
*/
export const insertUser = async (user: UserInsertArgs): Promise<IUserData> => {
    const functionName = insertUser.name;
    logFunctionInfo(functionName, FunctionStatus.START);
    try {
        user.password = await hashPassword(user.password);

        if (!user.role) {
            user.role = Roles.USER;
        }

        const newUser: IUser = new User(user);
        await newUser.save();

        delete (newUser as any).__v;
        const { password, refreshToken, verified, ...userWithoutSensitiveData } = newUser.toObject()

        logFunctionInfo(functionName, FunctionStatus.SUCCESS);
        return userWithoutSensitiveData as IUserData;
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        throw new Error(error.message);
    }
}


/**
 * Finds an existing user by its unique email adress.
*/
export const findUserByEmail = async (email: string): Promise<IUser | null> => {
    const functionName = findUserByEmail.name;
    logFunctionInfo(functionName, FunctionStatus.START);
    try {
        const user = await User.findOne({ email });

        logFunctionInfo(functionName, FunctionStatus.SUCCESS);
        return user;
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        throw new Error(error.message);
    }
}


/**
 * Updates an existing user data by its unique id.
*/
export const updateUserById = async (_id: string, userToUpdate: UserUpdateArgs): Promise<IUserData | null> => {
    const functionName = updateUserById.name;
    logFunctionInfo(functionName, FunctionStatus.START);
    try {
        const updatedUser = await User.findByIdAndUpdate(_id, userToUpdate, { new: true }).lean();
        if (!updatedUser) return null;

        delete (updatedUser as any).__v;
        const { password, refreshToken, ...userWithoutSensitiveData } = updatedUser;

        logFunctionInfo(functionName, FunctionStatus.SUCCESS);
        return userWithoutSensitiveData as IUserData;
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        throw new Error(error.message);
    }
};


/**
 * Finds a user by its unique ID
 */
export const findUserById = async (_id: string): Promise<IUser | null> => {
    const functionName = findUserById.name;
    logFunctionInfo(functionName, FunctionStatus.START);
    try {
        const user = await User.findById(_id).lean();

        if (user) logFunctionInfo(functionName, FunctionStatus.SUCCESS);
        return user;
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        throw new Error(error.message);
    }
}


/**
 * To Get Unsensitive UserData By its id
 */
export const findUserDatasById = async (_id: string): Promise<UserToShow | null> => {
    const functionName = findUserDatasById.name;
    try {
        const user = await User.findById(_id).select('-password -refreshToken -__v');
        if (!user) return null;

        logFunctionInfo(functionName, FunctionStatus.SUCCESS);
        return user as UserToShow;
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        throw new Error(error.message);
    }
}


/**
 * To aggregate filter count
*/
export const getUserFilterCount = async (matchFilter: Record<string, string>): Promise<number> => {
    try {
        const totalFilter = await User.aggregate([
            { $match: matchFilter },
            {
                $count: 'totalCount'  // Count all documents matching the filter
            }
        ]);

        return totalFilter.length > 0 ? totalFilter[0].totalCount : 0;
    } catch (error) {
        throw error;
    }
}


/**
 * To aggreagate user by filter,search, sort and pagenating
 */
export const filterUsers = async (matchFilter: Record<string, any>, sort: UserSortArgs, skip: number, limit: number): Promise<UserToShow[]> => {
    try {
        return await User.aggregate([
            { $match: matchFilter },
            { $sort: JSON.parse(sort) },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    _id: 1,
                    username: 1,
                    email: 1,
                    phone: 1,
                    role: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    verified: 1,
                },
            },
        ]);
    } catch (error) {
        throw error;
    }
}


/**
 * Fetches all users using aggregation with support for filtering, sorting, and pagination.
 */
export const fetchUsers = async (query: UserFilterQuery): Promise<UserFetchResult | null> => {
    const functionName = fetchUsers.name;
    logFunctionInfo(functionName, FunctionStatus.START);
    try {
        const { role, pageNo, pageLimit, sortKey, username } = query;

        const matchFilter: Record<string, any> = {};
        if (role) {
            matchFilter.role = role
        }
        if (username) {
            matchFilter.username = { $regex: username, $options: "i" };
        }

        const sort: UserSortArgs = getUserSortArgs(sortKey);

        const page = Number(pageNo);
        const limit = Number(pageLimit)
        const skip = calculatePageSkip(page, limit);

        const totalItems = await getUserFilterCount(matchFilter);

        const users: UserToShow[] = await filterUsers(matchFilter, sort, skip, limit)

        const totalPages = Math.ceil(totalItems / limit);
        const fetchResult: UserFetchResult = {
            page,
            pageSize: limit,
            totalPages,
            totalItems,
            data: users
        }

        logFunctionInfo(functionName, FunctionStatus.SUCCESS);
        return users.length > 0 ? fetchResult : null;
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        throw new Error(error.message);
    }
};


/**
 * Delets an existing user data by its unique id.
*/
export const deleteUserById = async (_id: string): Promise<boolean> => {
    const functionName = deleteUserById.name;
    logFunctionInfo(functionName, FunctionStatus.START);

    try {
        const deletedUser = await User.findByIdAndDelete(_id);

        if (!deletedUser) logFunctionInfo(functionName, FunctionStatus.SUCCESS);
        return deletedUser !== null;
    } catch (error: any) {
        logFunctionInfo(functionName, FunctionStatus.FAIL, error.message);
        throw new Error(error.message);
    }
}