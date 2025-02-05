const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        maxLength: 2000 // Límite razonable para mensajes
    },
    sender: {
        id: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        }
    },
    roomId: {
        type: String,
        required: true,
        index: true // Índice para búsquedas eficientes por sala
    },
    type: {
        type: String,
        enum: ['text', 'image', 'file'],
        default: 'text'
    },
    metadata: {
        fileUrl: String,
        fileName: String,
        fileSize: Number,
        mimeType: String
    },
    readBy: [{
        userId: String,
        readAt: Date
    }],
    timestamp: {
        type: Date,
        default: Date.now,
        index: true // Índice para ordenar y buscar por fecha
    }
}, {
    timestamps: true, // Agrega createdAt y updatedAt
    collection: 'messages' // Nombre explícito de la colección
});

// Índices compuestos para consultas comunes
messageSchema.index({ roomId: 1, timestamp: -1 });
messageSchema.index({ 'sender.id': 1, timestamp: -1 });

// Método para formatear el mensaje
messageSchema.methods.toJSON = function() {
    const obj = this.toObject();
    return {
        id: obj._id,
        content: obj.content,
        sender: obj.sender,
        roomId: obj.roomId,
        type: obj.type,
        metadata: obj.type !== 'text' ? obj.metadata : undefined,
        timestamp: obj.timestamp,
        createdAt: obj.createdAt
    };
};

// Validación personalizada
messageSchema.pre('save', function(next) {
    if (this.type !== 'text' && !this.metadata) {
        next(new Error('Metadata is required for non-text messages'));
    }
    next();
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;