import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: 'Name is required'
    },
    author: {type: mongoose.Schema.ObjectId, ref: 'User'},
    created: {
        type: Date,
        default: Date.now
    },
    conversationId:{type: mongoose.Schema.ObjectId, ref: 'Conversation'}
})

export default mongoose.model('Message', MessageSchema);
