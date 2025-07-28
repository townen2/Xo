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
      return m.reply(`❌ ᴇxᴀᴍᴘʟᴇ:\n${prefix + command} I'm the president`);
    }

    // Construire l'URL sans heure ni batterie
    const url = `https://veloria-ui.vercel.app/imagecreator/fake-chat?messageText=${encodeURIComponent(q)}&batteryLevel=&time=`;

    // Optionnel : tester l'URL avec une requête HEAD si tu veux t'assurer qu'elle est valide

    // Envoi de l'image
    await conn.sendMessage(m.chat, {
      image: { url },
      caption: `📱 *Fake iPhone quoted message*`
    }, { quoted: m });

  } catch (err) {
    console.error("Plugin iphonequote error:", err);
    m.reply("❌ Failed to generate fake chat image. The API might be down or unreachable.");
  }
});
