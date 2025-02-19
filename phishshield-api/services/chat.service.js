const { messageRepository } = require('../repositories');

module.exports = {
  getMessages: async (from, to) => {
    const messages = await messageRepository.getMessages(from, to);

    return messages.map((msg) => ({
      fromSelf: msg.sender.equals(from),
      message: msg.message.text
    }));
  },

  createMessage: async (from, to, message) => {
    await messageRepository.createMessage(from, to, message);
  },
};
