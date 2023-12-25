const Product = require("../../models/product.model");

// [GET] /products
module.exports.index = async (req,res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    });

    const newProducts = products.map(item => {
        item.newPrice = (item.price * (100 - item.discountPercentage)/100).toFixed(0);
        return item;
    });
    
    console.log(newProducts);

    res.render("client/page/products/index", {
        pageTitle: "Trang danh sách sản phẩm",
        products: newProducts
    });
};