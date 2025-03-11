require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./001_create_users');
const Category = require('./002_create_categories');
const Product = require('./003_create_products');
const Order = require('./004_create_orders');
const Cart = require('./005_create_carts');

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

const runMigrations = async () => {
    try {
        // Kết nối database
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Đã kết nối database');

        // Tạo admin mặc định
        const adminUser = await User.findOne({ email: 'admin@gmail.com' });
        if (!adminUser) {
            const hashedPassword = await hashPassword('123456789');
            await User.create({
                name: 'Admin',
                email: 'admin@gmail.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Đã tạo tài khoản admin mặc định');
        }

        // Tạo người dùng mẫu
        const sampleUsers = [
            {
                name: 'Nguyễn Văn A',
                email: 'nguyenvana@example.com',
                password: await hashPassword('123456'),
                role: 'user',
                phone: '0123456789',
                address: {
                    street: '123 Đường ABC',
                    city: 'TP.HCM',
                    district: 'Quận 1',
                    ward: 'Phường Bến Nghé'
                }
            },
            {
                name: 'Trần Thị B',
                email: 'tranthib@example.com',
                password: await hashPassword('123456'),
                role: 'user',
                phone: '0987654321',
                address: {
                    street: '456 Đường XYZ',
                    city: 'TP.HCM',
                    district: 'Quận 3',
                    ward: 'Phường Võ Thị Sáu'
                }
            },
            {
                name: 'Lê Văn C',
                email: 'levanc@example.com',
                password: await hashPassword('123456'),
                role: 'user',
                phone: '0369852147',
                address: {
                    street: '789 Đường DEF',
                    city: 'TP.HCM',
                    district: 'Quận 5',
                    ward: 'Phường 5'
                }
            }
        ];

        for (const user of sampleUsers) {
            const existingUser = await User.findOne({ email: user.email });
            if (!existingUser) {
                await User.create(user);
            }
        }
        console.log('Đã tạo người dùng mẫu');

        // Tạo danh mục mặc định
        const categories = await Category.find();
        if (categories.length === 0) {
            const defaultCategories = [
                {
                    name: 'Nam',
                    slug: 'nam',
                    description: 'Thời trang nam'
                },
                {
                    name: 'Nữ',
                    slug: 'nu',
                    description: 'Thời trang nữ'
                },
                {
                    name: 'Trẻ em',
                    slug: 'tre-em',
                    description: 'Thời trang trẻ em'
                }
            ];

            for (const category of defaultCategories) {
                await Category.create(category);
            }
            console.log('Đã tạo danh mục mặc định');

            // Tạo danh mục con
            const parentCategories = await Category.find();
            const subCategories = [
                {
                    name: 'Áo nam',
                    slug: 'ao-nam',
                    description: 'Áo thời trang nam',
                    parent: parentCategories[0]._id
                },
                {
                    name: 'Quần nam',
                    slug: 'quan-nam',
                    description: 'Quần thời trang nam',
                    parent: parentCategories[0]._id
                },
                {
                    name: 'Áo nữ',
                    slug: 'ao-nu',
                    description: 'Áo thời trang nữ',
                    parent: parentCategories[1]._id
                },
                {
                    name: 'Quần nữ',
                    slug: 'quan-nu',
                    description: 'Quần thời trang nữ',
                    parent: parentCategories[1]._id
                }
            ];

            for (const subCategory of subCategories) {
                await Category.create(subCategory);
            }
            console.log('Đã tạo danh mục con');
        }

        // Tạo sản phẩm mẫu
        const products = await Product.find();
        if (products.length === 0) {
            const categories = await Category.find({ parent: { $ne: null } });
            const sampleProducts = [
                {
                    name: 'Áo thun nam basic',
                    slug: 'ao-thun-nam-basic',
                    description: 'Áo thun nam basic chất liệu cotton 100%',
                    price: 199000,
                    category: categories[0]._id,
                    images: ['/uploads/products/ao-thun-nam-1.jpg'],
                    stock: 100,
                    sold: 0,
                    isActive: true
                },
                {
                    name: 'Quần jean nam',
                    slug: 'quan-jean-nam',
                    description: 'Quần jean nam ôm dáng thời trang',
                    price: 499000,
                    category: categories[1]._id,
                    images: ['/uploads/products/quan-jean-nam-1.jpg'],
                    stock: 50,
                    sold: 0,
                    isActive: true
                },
                {
                    name: 'Áo sơ mi nữ',
                    slug: 'ao-so-mi-nu',
                    description: 'Áo sơ mi nữ phong cách công sở',
                    price: 299000,
                    category: categories[2]._id,
                    images: ['/uploads/products/ao-so-mi-nu-1.jpg'],
                    stock: 80,
                    sold: 0,
                    isActive: true
                }
            ];

            for (const product of sampleProducts) {
                await Product.create(product);
            }
            console.log('Đã tạo sản phẩm mẫu');
        }

        // Tạo đơn hàng mẫu
        const existingOrders = await Order.find();
        if (existingOrders.length === 0) {
            const users = await User.find({ role: 'user' });
            const products = await Product.find();
            const orders = [
                {
                    orderNumber: 'DH001',
                    user: users[0]._id,
                    items: [
                        {
                            product: products[0]._id,
                            variant: {
                                size: 'M',
                                color: 'Đen'
                            },
                            quantity: 2,
                            price: products[0].price
                        }
                    ],
                    shippingAddress: {
                        fullName: 'Nguyễn Văn A',
                        phone: '0123456789',
                        address: '123 Đường ABC',
                        city: 'Hà Nội',
                        district: 'Cầu Giấy',
                        ward: 'Dịch Vọng'
                    },
                    paymentMethod: 'COD',
                    paymentStatus: 'Đã thanh toán',
                    orderStatus: 'Đã giao hàng',
                    totalAmount: products[0].price * 2,
                    shippingFee: 30000,
                    discount: 0
                },
                {
                    orderNumber: 'DH002',
                    user: users[1]._id,
                    items: [
                        {
                            product: products[1]._id,
                            variant: {
                                size: '30',
                                color: 'Xanh'
                            },
                            quantity: 1,
                            price: products[1].price
                        }
                    ],
                    shippingAddress: {
                        fullName: 'Trần Thị B',
                        phone: '0987654321',
                        address: '456 Đường XYZ',
                        city: 'Hồ Chí Minh',
                        district: 'Quận 1',
                        ward: 'Phường 1'
                    },
                    paymentMethod: 'VNPAY',
                    paymentStatus: 'Chưa thanh toán',
                    orderStatus: 'Chờ xác nhận',
                    totalAmount: products[1].price,
                    shippingFee: 30000,
                    discount: 0
                }
            ];
            await Order.insertMany(orders);
            console.log('Đã tạo đơn hàng mẫu');
        }

        // Tạo giỏ hàng mẫu
        const carts = await Cart.find();
        if (carts.length === 0) {
            const users = await User.find({ role: 'user' });
            const products = await Product.find();
            const sampleCarts = [
                {
                    user: users[2]._id,
                    items: [
                        {
                            product: products[1]._id,
                            variant: {
                                size: '32',
                                color: 'Xanh'
                            },
                            quantity: 1,
                            price: 499000
                        }
                    ],
                    totalPrice: 499000
                }
            ];

            for (const cart of sampleCarts) {
                await Cart.create(cart);
            }
            console.log('Đã tạo giỏ hàng mẫu');
        }
        console.log('Migration hoàn tất');
        process.exit(0);
    } catch (error) {
        console.error('Lỗi migration:', error);
        process.exit(1);
    }
};

runMigrations(); 