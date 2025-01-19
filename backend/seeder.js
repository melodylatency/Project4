import mongoose from "mongoose"
import dotenv from "dotenv"
import colors from 'colors'
import users from './data/users.js'
import products from './data/products.js'
import connectDB from './config/db.js'
import User from './models/userModel.js'
import Product from './models/productModel.js'
import Order from './models/orderModel.js'

dotenv.config()

connectDB() // Connect to MongoDB

const importData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    const createdUsers = await User.insertMany(users)

    const adminUser = createdUsers[0]._id // ID of Admin user

    const sampleProducts = products.map((product) => {
        return { ...product, user: adminUser} // Add admin ID to products
    })

    await Product.insertMany(sampleProducts)

    console.log("All data imported!".green.inverse)
    process.exit()
  } catch (error) {
    console.log("Ching Chang noticed Uzbak-ass coding...".purple.inverse) 
    console.log(`${error}`.red.inverse)
    process.exit(1)
  }
}

const destroyData = async () => {
    try {
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()
        console.log("All data destroyed!".green.inverse)
        process.exit()
    } catch (error) {
        console.log("Ching Chang noticed Uzbak inline of attack... Destroy aborted".purple.inverse)
        console.log(`${error}`.red.inverse)
        process.exit(1)
    }
}

if (process.argv[2] === '-d') {
    destroyData()
} else {
    importData()
}