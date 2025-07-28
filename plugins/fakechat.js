const { cmd, commands } = require('../command');

cmd({
  pattern: "iphonequote",
  alias: ["fakechat", "iphone"],
  category: "tools",
  react: "😉",
  desc: "Generate a fake iPhone quoted message",
  use: "<text>",
  filename: __filename
},
async (conn, m, { q, prefix, command }) => {
  try {
    if (!q) {
      return m.reply(`❌ ᴇxᴀᴍᴘʟᴇ ᴜsᴀɢᴇ:\n .iphone ɪ'ᴍ ᴛʜᴇ ᴘʀᴇsɪᴅᴇɴᴛ`);
    }

    const url = `https://veloria-ui.vercel.app/imagecreator/fake-chat?messageText=${encodeURIComponent(q)}`;

    await conn.sendMessage(m.chat, {
      image: { url },
      caption: `📱 *ғᴀᴋᴇ ɪᴘʜᴏɴᴇ ǫᴜᴏᴛᴇᴅ ᴍᴇssᴀɢᴇ*`
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    m.reply("❌ An error occurred while generating the image.");
  }
});
