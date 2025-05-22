const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); 

const conversationSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        unique: true,
        default: uuidv4,
        index: true
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    created_time: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    last_updated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

conversationSchema.index({ conversationId: 1, 'participants': 1 });

conversationSchema.pre('save', function(next) {
    this.last_updated = new Date();
    next();
});

module.exports = mongoose.model('Conversation', conversationSchema);
