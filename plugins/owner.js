const { cmd } = require('../command');
const config = require('../config');
const axios = require('axios');

cmd({
  pattern: "owner",
  alias: ["creator", "dev"],
  category: "main",
  react: "👑",
  desc: "Send the owner contact card",
  filename: __filename
},
async (conn, m, { sender }) => {
  try {
    // Télécharger la miniature
    const thumb = await axios.get(config.MENU_IMAGE_URL, { responseType: 'arraybuffer' });

    const vcard = `BEGIN:VCARD
VERSION:3.0
N:;;;;
FN:${config.OWNER_NAME}
TEL;waid=${config.OWNER_NUMBER}:${config.OWNER_NUMBER}
EMAIL:no-reply@example.com
ORG:${config.BOT_NAME}
END:VCARD`;

    await conn.sendMessage(m.chat, {
      contacts: {
        displayName: `Owner ${config.BOT_NAME}`,
        contacts: [{ vcard }]
      },
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: false,
        externalAdReply: {
          title: `Contact Owner ${config.BOT_NAME}`,
          body: `Click to save contact`,
          thumbnail: thumb.data,
          mediaType: 1,
          showAdAttribution: true,
          sourceUrl: ''
        }
      }
    }, { quoted: m });

  } catch (err) {
    console.error('[OWNER ERROR]', err);
    await m.reply('❌ Failed to send owner contact.');
  }
});
