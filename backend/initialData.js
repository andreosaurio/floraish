import dotenv from 'dotenv';
import connectDatabase from './config/database.js'
import users from "./data/users.js";
import products from "./data/products.js";
import UserData from "./schemas/user-data.js";
import ProductData from "./schemas/product-data.js";
import PurchaseData from "./schemas/purchase-data.js"

dotenv.config();

connectDatabase();

const importData = async () => {
    try {
        await PurchaseData.deleteMany();
        await ProductData.deleteMany();
        await UserData.deleteMany();

        const createdUsers = await UserData.insertMany(users);

        const adminUser = createdUsers[0]._id;

        const sampleProducts = products.map((product) => {
            return { ...product, user: adminUser };
        });

        await ProductData.insertMany(sampleProducts);

        console.log('Datos importados');
        process.exit();
    } catch (error) {
        console.log(`${error}`);
        process.exit(1);
    }
}

const destroyData = async () => {
    try {
        await PurchaseData.deleteMany();
        await ProductData.deleteMany();
        await UserData.deleteMany();

        console.log('Datos eliminados')
        process.exit();
    } catch (error) {
        console.log(`${error}`)
        process.exit(1);
    }
}

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData()
};