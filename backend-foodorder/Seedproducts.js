// seedProducts.js
// Đặt file này ở thư mục backend/ (cùng cấp với package.json)
// Chạy: node seedProducts.js
// Yêu cầu: backend đã có file .env với biến MongoDB

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Product = require("./src/models/ProductModel");
const products = require("./products.json");

(async () => {
  try {
    await mongoose.connect(`${process.env.MongoDB}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Đã kết nối DB, bắt đầu thêm món ăn...");

    // Nếu muốn XOÁ hết sản phẩm cũ trước khi thêm, bỏ comment dòng dưới:
    // await Product.deleteMany({});

    let count = 0;
    for (const p of products) {
      // upsert theo name: nếu món đã có thì cập nhật, chưa có thì thêm mới
      await Product.updateOne({ name: p.name }, { $set: p }, { upsert: true });
      count++;
    }

    console.log(`Hoàn tất! Đã thêm/cập nhật ${count} món ăn thuộc 6 loại.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Lỗi khi seed dữ liệu:", err);
    process.exit(1);
  }
})();
