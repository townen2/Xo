const { cmd } = require('../command');
const { getBuffer } = require('../lib/myfunc');
const config = require('../config');

cmd({
  pattern: "owner",
  alias: ["creator", "dev"],
  category: "main",
  react: "👑",
  desc: "Send the owner contact",
  filename: __filename
},
async (conn, m, { sender }) => {
  try {
    const kontakUtama = {
      displayName: `ᴏᴡɴᴇʀ ${config.BOT_NAME}`,
      vcard: `BEGIN:VCARD
VERSION:3.0
N:;;;; 
FN:${config.OWNER_NAME}
item1.TEL;waid=${config.OWNER_NUMBER}:${config.OWNER_NUMBER}
item1.X-ABLabel:ᴍʏ ᴏᴡɴᴇʀ
EMAIL;type=INTERNET:no-reply@example.com
ORG:Owner ${config.BOT_NAME}
END:VCARD`
    };

    await conn.sendMessage(m.chat, {
      contacts: { contacts: [kontakUtama] },
      contextInfo: {
        forwardingScore: 999,
        isForwarded: false,
        mentionedJid: [sender],
        externalAdReply: {
          showAdAttribution: true,
          renderLargerThumbnail: true,
          title: `${config.BOT_NAME} - ᴄᴏʀᴇ`,
          containsAutoReply: true,
          mediaType: 1,
          jpegThumbnail: await getBuffer(config.MENU_IMAGE_URL),
          mediaUrl: '',
          sourceUrl: ''
        }
      }
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply("❌ Failed to send owner contact.");
  }
});
