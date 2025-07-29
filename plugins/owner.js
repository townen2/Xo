const { cmd } = require('../command');
const config = require('../config');

cmd({
  pattern: "owner",
  alias: ["creator"],
  category: "main",
  react: "👑",
  desc: "Send contact list of owner(s) + mention message",
  filename: __filename
},
async (conn, m, { sender }) => {
  try {
    const list = [
      {
        displayName: `${config.OWNER_NAME}`,
        vcard: `BEGIN:VCARD
VERSION:3.0
FN:${config.OWNER_NAME}
ORG:${config.BOT_NAME}
TEL;type=CELL;type=VOICE;waid=${config.OWNER_NUMBER}:${config.OWNER_NUMBER}
END:VCARD`
      }
    ];

    // 1️⃣ Envoi des contacts
    const repf = await conn.sendMessage(m.chat, {
      contacts: {
        displayName: `${list.length} Contact${list.length > 1 ? 's' : ''}`,
        contacts: list
      },
      mentions: [sender]
    }, { quoted: m });

    // 2️⃣ Message qui mentionne l'utilisateur
    await conn.sendMessage(m.chat, {
      text: `ᴡᴀɢ ᴡᴀɴ @${sender.split("@")[0]}, ᴍʏ ʜᴀɴᴅsᴏᴍᴇ owner but ɪ ᴡᴀs ᴄʀᴇᴀᴛᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ.`,
      mentions: [sender]
    }, { quoted: repf });

  } catch (err) {
    console.error('[OWNER ERROR]', err);
    m.reply("❌ Failed to send contact.");
  }
});
