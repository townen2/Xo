const { cmd } = require('../command');

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
      return m.reply(`❌ Example:\n.iphone I'm the president`);
    }

    const url = `https://veloria-ui.vercel.app/imagecreator/fake-chat?messageText=${encodeURIComponent(q)}`;
    console.log("Generated image URL:", url);

    await conn.sendMessage(m.chat, {
      image: { url, mimetype: 'image/jpeg' },
      caption: `📱 *Fake iPhone quoted message*`
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    m.reply("❌ Failed to generate image. Error: " + err.message);
  }
});
