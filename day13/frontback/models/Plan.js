const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    price: {
        type: String,
        required: true
    },
    validity: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    },
    calls: {
        type: String,
        required: true
    },
    sms: {
        type: String,
        required: true
    },
    benefits: {
        type: [String],
        default: []
    },
    popular: {
        type: Boolean,
        default: false
    },
    operator: {
        type: String,
        required: true,
        enum: ['Jio', 'Airtel', 'Vi', 'BSNL'],
        default: 'Jio'
    }
});

module.exports = mongoose.model('Plan', planSchema);
