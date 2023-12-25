// [GET] /

module.exports.index = (req,res) => {
    res.render("client/page/home/index", {
        pageTitle: "Trang chủ"
    });
};