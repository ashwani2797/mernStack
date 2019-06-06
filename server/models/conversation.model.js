import mongoose from 'mongoose'

const ConversationSchema = new mongoose.Schema({
    lastMessage: {
        type: String
    },
    users: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
})

export default mongoose.model('Conversation', ConversationSchema)
