const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
// [GET] /admin/product

module.exports.index = async (req,res) => {
    // lọc trạng thái
    const  filterStatus = filterStatusHelper(req.query);

    let find = {
        deleted: false
    };

    if(req.query.status) {
        find.status = req.query.status
    }

    // Tìm kiếm

    let objectSearch = searchHelper(req.query);
    if(objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    
    //Pagination
    let objectPagination = {
        currentPage: 1,
        limitItem: 4
    };

    if(req.query.page) {
        objectPagination.currentPage = parseInt(req.query.page); 
    }
    
    objectPagination.skipItem = (objectPagination.currentPage - 1) * objectPagination.limitItem;

    const products = await Product.find(find).limit(objectPagination.limitItem).skip(objectPagination.skipItem);

    const countProducts = await Product.countDocuments(find);
    const totalPage = Math.ceil(countProducts/objectPagination.limitItem);
    objectPagination.totalPage = totalPage;

    // Trả về giao diện
    res.render("admin/pages/products/index", {
        pageTitle: "Trang danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
};