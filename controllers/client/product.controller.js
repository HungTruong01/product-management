module.exports.index = (req,res) => {
    res.render("client/page/products/index", {
        pageTitle: "Trang danh sách sản phẩm"
    });
};