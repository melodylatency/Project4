import mongoose from "mongoose";

const orderItemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    },
    title: {
        type: String,
        required: true,
    },
})

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    orderItems: [orderItemsSchema],
    shippingAdress: [
        {
            adress: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            postalCode: {
                type: String,
                required: true
            },
            country: {
                type: String,
                required: true
            },
        }
    ],
    paymentMethod: {
        type: String,
        required: true,
    },
    paymentResult: [
        {
            id: 'string',
            status: 'string',
            update_time: 'string',
            email_adress: 'string'
        }
    ],
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
    paidAt: 'date',
    isDelivered: {
        type: Boolean,
        required: true,
        default: false,
    },
    deliveredAt: 'date'
}, {
    timestamps: true
})

const Order = mongoose.model("Order", orderSchema)

export default Order