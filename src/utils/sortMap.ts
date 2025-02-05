import { UserSortArgs, UserSortKeys } from "../enums";


/**
 * Maps user sort arguments from sort keys
*/
export const getUserSortArgs = (sortKey?: UserSortKeys): UserSortArgs => {
    const sortMapping: Record<UserSortKeys, UserSortArgs> = {
        [UserSortKeys.username]: UserSortArgs.username,
        [UserSortKeys.createAt]: UserSortArgs.createAt,
    };

    return sortMapping[sortKey as UserSortKeys] || UserSortArgs.createAt;
};