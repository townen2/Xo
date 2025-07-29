const { cmd } = require('../command');
const config = require('../config');

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
      }
    }, { quoted: m });

  } catch (err) {
    console.error('[ERROR OWNER]', err);
    m.reply("❌ Failed to send contact.");
  }
});
