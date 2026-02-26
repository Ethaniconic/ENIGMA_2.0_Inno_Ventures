const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true
    },
    sex: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    contact: {
        type: String,
        trim: true
    },
    smokingStatus: {
        type: String,
        enum: ['Never', 'Former', 'Current'],
        default: 'Never'
    },
    alcoholConsumption: {
        type: String,
        enum: ['None', 'Occasional', 'Heavy'],
        default: 'None'
    },
    familyHistory: {
        type: [String],
        default: []
    },
    occupation: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Patient', patientSchema);
