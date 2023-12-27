module.exports = (query) => {
    let objectSearch = {
        keyword: ""
    }
    let keyword = "";
    if(query.keyword) {
        objectSearch.keyword = query.keyword;

        const regex = new RegExp(objectSearch.keyword, "i");
        objectSearch.regex = regex;
    }
    return objectSearch;
}