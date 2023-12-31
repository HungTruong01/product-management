const Product = require("../../models/product.model");

const systemConfig = require("../../config/system");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

// [GET] /admin/product

module.exports.index = async (req, res) => {
    // lọc trạng thái
    const filterStatus = filterStatusHelper(req.query);

    let find = {
        deleted: false
    };

    if (req.query.status) {
        find.status = req.query.status
    }

    // Tìm kiếm

    let objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    //Pagination
    const countProducts = await Product.countDocuments(find);
    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItem: 4
        },
        req.query,
        countProducts
    );

    const products = await Product.find(find)
        .sort({ position: "desc" })
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skipItem);

    // Trả về giao diện
    res.render("admin/pages/products/index", {
        pageTitle: "Trang danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
};

// [PATCH] /admin/product/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { status: status });
    req.flash("success", "Cập nhật trạng thái thành công!");
    res.redirect("back");
}

// [PATCH] /admin/product/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
            req.flash("success", `Cập nhật trạng thái ${ids.length} sản phẩm thành công!`);

            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
            req.flash("success", `Cập nhật trạng thái ${ids.length} sản phẩm thành công!`);
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } }, {
                deleted: "true",
                deletedAt: new Date()
            });
            req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm!`);
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                console.log(id);
                console.log(position);
                await Product.updateOne({ _id: id }, {
                    position: position
                });
                req.flash("success", `Cập nhật vị trí ${ids.length} sản phẩm thành công!`);
            }
            break;
        default:
            break;
    }
    res.redirect("back");
};

// [DELETE] /admin/product/delete/:id
module.exports.deleteItem = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    //await Product.deleteOne({_id: id});
    await Product.updateOne({ _id: id }, {
        deleted: true,
        deletedAt: new Date()
    });
    req.flash("success", `Đã xóa thành công sản phẩm!`);
    res.redirect("back");
}

// [GET] /admin/product/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm",
    });
}

// [POST] /admin/product/create
module.exports.createPost = async (req, res) => {
    

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if(req.body.position == "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    if(req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    const product = new Product(req.body);
    await product.save();

    res.redirect(`${systemConfig.prefixAdmin}/products`);
}

// [GET] /admin/product/edit
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
    
        const product = await Product.findOne(find);
    
        res.render("admin/pages/products/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product
        });
        
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}

// [PATCH] /admin/product/edit
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    if(req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    try {
        await Product.updateOne({_id: id}, req.body);
        req.flash("success", "Cập nhật thành công!");
    } catch (error) {
        req.flash("error", "Cập nhật thất bại!");
    }

    res.redirect("back");    
}

module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
    
        const product = await Product.findOne(find);
    
        res.render("admin/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
        
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}