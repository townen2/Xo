const { cmd } = require('../command');
const config = require('../config');
const axios = require('axios');

cmd({
  pattern: "owner",
  alias: ["creator", "dev"],
  category: "main",
  react: "👑",
  desc: "Send owner contact",
  filename: __filename
},
async (conn, m) => {
  try {
    // Télécharger l’image en buffer
    const res = await axios.get(config.MENU_IMAGE_URL, { responseType: 'arraybuffer' });
    const thumb = res.data;

    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${config.OWNER_NAME}
ORG:${config.BOT_NAME}
TEL;type=CELL;type=VOICE;waid=${config.OWNER_NUMBER}:${config.OWNER_NUMBER}
END:VCARD`;

    await conn.sendMessage(m.chat, {
      contacts: {
        displayName: config.OWNER_NAME,
        contacts: [{ vcard }]
      },
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: false,
        externalAdReply: {
          title: `Contact Owner ${config.BOT_NAME}`,
          body: `Click to save contact`,
          thumbnail: thumb,
          mediaType: 1,
          showAdAttribution: true,
          sourceUrl: ''
        }
      }
    }, { quoted: m });

  } catch (err) {
    console.error('[OWNER ERROR]', err);
    m.reply("❌ Failed to send contact.");
  }
});
