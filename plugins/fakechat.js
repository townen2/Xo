const moment = require('moment-timezone'); // <-- ADD THIS LINE
const { cmd, commands } = require('../command');

cmd({
  pattern: "iphonequote",
  alias: ["fakechat"],
  category: "tools",
  desc: "Generate a fake iPhone quoted message",
  use: "<text>",
  filename: __filename
},
async (conn, m, { q, prefix, command }) => {
  try {
    if (!q) {
      return m.reply(`❌ ᴇxᴀᴍᴘʟᴇ ᴜsᴀɢᴇ:\n${prefix + command} ɪ'ᴍ ᴛʜᴇ ᴘʀᴇsɪᴅᴇɴᴛ`);
    }

    // Get current time in HH:mm format
    const timeNow = moment().tz("UTC").format("HH:mm");

    // Generate random battery percentage between 40 and 100
    const battery = Math.floor(Math.random() * 61) + 40;

    const url = `https://veloria-ui.vercel.app/imagecreator/fake-chat?time=${timeNow}&messageText=${encodeURIComponent(q)}&batteryPercentage=${battery}`;

    await conn.sendMessage(m.chat, {
      image: { url },
      caption: `📱 *ғᴀᴋᴇ ɪᴘʜᴏɴᴇ ǫᴜᴏᴛᴇᴅ ᴍᴇssᴀɢᴇ*\n🕒 ${timeNow} | 🔋 ${battery}%`
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    m.reply("❌ An error occurred while generating the image.");
  }
});
