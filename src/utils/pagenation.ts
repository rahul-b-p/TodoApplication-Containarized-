import { FunctionStatus } from "../enums";
import { PageInfo, PageNationFeilds } from "../types";
import { logFunctionInfo } from "./logger";


/**
 * Retrieves pagination fields, including URLs for the next page, previous page, and first page, 
 * based on the provided page information and current page URL.
*/
export const pagenate = (pageInfo: PageInfo, url: string): PageNationFeilds => {
    const functionName = 'pagenate';
    logFunctionInfo(functionName, FunctionStatus.START);

    const { page, totalPages } = pageInfo;

    const Pageurl = (pageNo: number) => {
        return url.replace('?pageNo=1', `?pageNo=${pageNo}`)
    }

    const pageNationFeilds: PageNationFeilds = {
        nextPage: null,
        prevPage: null,
        firstPage: null,
        lastPage: null
    };

    if (page > 1) {
        pageNationFeilds.prevPage = Pageurl(page - 1);
        pageNationFeilds.firstPage = Pageurl(1);
    }
    if (page < totalPages) {
        pageNationFeilds.lastPage = Pageurl(totalPages);
        pageNationFeilds.nextPage = Pageurl(page + 1);
    }

    logFunctionInfo(functionName, FunctionStatus.SUCCESS);
    return pageNationFeilds;
}

/**
 * Calculate the number of documents to skip for pagination.
 */
export const calculatePageSkip = (page: number, limit: number): number => {
    return (page - 1) * limit;
};