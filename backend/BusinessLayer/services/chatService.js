const admin = require('../config/firebase.config');

const chatService = {
    // Guardar mensaje privado
    saveMessage: async (messageData) => {
        try {
            const { from, to, message, timestamp } = messageData;
            
            // Crear una referencia única para la conversación
            const chatId = [from, to].sort().join('-');
            
            await admin.firestore().collection('chats')
                .doc(chatId)
                .collection('messages')
                .add({
                    from,
                    to,
                    message,
                    timestamp
                });

            return true;
        } catch (error) {
            console.error('Error al guardar mensaje:', error);
            return false;
        }
    },

    // Guardar mensaje global
    saveGlobalMessage: async (messageData) => {
        try {
            const { from, message, timestamp } = messageData;
            
            await admin.firestore().collection('globalChat')
                .add({
                    from,
                    message,
                    timestamp
                });

            return true;
        } catch (error) {
            console.error('Error al guardar mensaje global:', error);
            return false;
        }
    },

    // Obtener historial de mensajes privados
    getPrivateMessages: async (user1Id, user2Id) => {
        try {
            const chatId = [user1Id, user2Id].sort().join('-');
            
            const messages = await admin.firestore()
                .collection('chats')
                .doc(chatId)
                .collection('messages')
                .orderBy('timestamp')
                .get();

            return messages.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error al obtener mensajes:', error);
            return [];
        }
    }
};

module.exports = chatService;