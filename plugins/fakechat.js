const { cmd } = require('../command');

cmd({
  pattern: "iphonequote",
  alias: ["fakechat", "iphone"],
  category: "tools",
  react: "📱",
  desc: "Generate a fake iPhone quoted message",
  use: "<text>",
  filename: __filename
},
async (conn, m, { q, prefix, command }) => {
  if (!q) {
    return m.reply(`❌ Example:\n${prefix + command} Life is beautiful`);
  }

  const url = `https://veloria-ui.vercel.app/imagecreator/fake-chat?time=12:00&messageText=${encodeURIComponent(q)}&batteryPercentage=100`;

  await conn.sendMessage(m.chat, {
    image: { url },
    caption: "📱 *Fake iPhone Quoted Message*"
  }, { quoted: m });
});
