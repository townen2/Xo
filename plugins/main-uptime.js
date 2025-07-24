const axios = require("axios");
const fs = require("fs");
const os = require("os");
const path = require("path");
const FormData = require("form-data");
const { cmd } = require("../command");

function formatRemainingTime(ms) {
  let totalSeconds = Math.floor(ms / 1000);
  let days = Math.floor(totalSeconds / (3600 * 24));
  let hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;

  return `*┃❍ ${days} ᴅᴀʏ(s)*\n*┃❍ ${hours} ʜᴏᴜʀ(s)*\n*┃❍ ${minutes} ᴍɪɴᴜᴛᴇ(s)*\n*┃❍ ${seconds} sᴇᴄᴏɴᴅ(s)*`;
}

// Newsletter channel info
const newsletterJid = "120363401051937059@newsletter";
const newsletterName = "𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐔𝐏𝐃𝐀𝐓𝐄𝐒";
const newsletterUrl = "https://whatsapp.com/channel/120363401051937059";

cmd({
  pattern: "runtime",
  alias: ["uptime", "run"],
  react: "⏳",
  desc: "Show bot alive status and uptime",
  category: "system",
  filename: __filename
}, async (client, message, args, { reply }) => {
  try {
    const uptimeMs = process.uptime() * 1000;
    const uptimeFormatted = formatRemainingTime(uptimeMs);

    const status = `
*𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃 𝐈𝐒 𝐑𝐔𝐍𝐍𝐈𝐍𝐆!!*
*𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃 𝐔𝐏𝐓𝐈𝐌𝐄 𝐈𝐍𝐅𝐎:*

*╭═════════════════⊷*
${uptimeFormatted}
*╰═════════════════⊷*
    `.trim();

    await client.sendMessage(message.chat, {
      image: { url: "https://files.catbox.moe/roubzi.jpg" },
      caption: status,
      contextInfo: {
        forwardingScore: 100,
        isForwarded: true,
        forwardedNewsletterMessage: {
          newsletterJid,
          newsletterName
        },
        externalAdReply: {
          title: newsletterName,
          body: "Click here to join the official channel!",
          mediaType: 1,
          thumbnailUrl: "https://files.catbox.moe/roubzi.jpg",
          sourceUrl: newsletterUrl,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: message });

  } catch (err) {
    console.error("Alive Command Error:", err);
    await reply(`❌ Error: ${err.message || err}`);
  }
});
