export const company_folder = "company"
export const etf_folder = "etf"
export const commodity_folder = "commodity"
export const index_folder = "index"
export const forex_folder = "forex"
export const backend_server = process.env.REACT_APP_BACKEND
export function folder2category(folder){
    if(folder == company_folder){return "Company"}
    if(folder == etf_folder){return "ETF"}
    if(folder == commodity_folder){return "Commodity"}
    if(folder == index_folder){return "Index"}
    if(folder == forex_folder){return "Forex"}

}