const Product = require("../../models/product.model");

// [GET] /products
module.exports.index = async (req,res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({position: "desc"});

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

// [GET] /products/:slug
module.exports.detail = async (req,res) => {
    
    try {
        const find = {
            deleted: false,
            slug: req.params.slug,
            status: "active"
        };

        const product = await Product.findOne(find);
        console.log(product);

        res.render("client/page/products/detail", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        res.redirect(`/products`);
    }

};