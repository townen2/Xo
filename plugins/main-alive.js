const config = require("../config");
const prefix = config.PREFIX;
const os = require("os");
const moment = require("moment");
const { cmd } = require("../command");
const { runtime } = require("../lib/functions");

cmd({
  pattern: "alive",
  alias: ["test"],
  desc: "Show styled alive menu",
  category: "main",
  use: ".alive",
  react: "👋",
  filename: __filename
}, async (conn, mek, m, { from, pushname, reply }) => {
  try {
    const uptime = runtime(process.uptime());
    const usedRam = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const totalRam = (os.totalmem() / 1024 / 1024).toFixed(2);
    const mode = config.MODE || "Public";

    const caption = `
╭━━━❮ 𝙱𝙾𝚃 𝙸𝙽𝙵𝙾 ❯━━━╮
│➪ 𝙱𝙾𝚃 𝙽𝙰𝙼𝙴 : *ᴍᴇɢᴀʟᴏᴅᴏɴ-ᴍᴅ*
│➪ 𝚅𝙴𝚁𝚂𝙸𝙾𝙽 : 1.0.0
│➪ 𝙾𝚆𝙽𝙴𝚁 : *${config.OWNER_NAME}*      
│➪ 𝚆𝙰 𝙽𝚄𝙼𝙱𝙴𝚁 : *${config.OWNER_NUMBER}*
│➪ 𝙿𝙻𝙰𝚃𝙵𝙾𝚁𝙼 : *${os.platform()}*
│➪ 𝚄𝙿𝚃𝙸𝙼𝙴 : *${uptime}*
│➪ 𝙶𝙴𝙽𝙴𝚁𝙰𝙻 : *${mode}*
│➪ 𝙿𝚁𝙴𝙵𝙸𝚇 ✞︎: *${prefix}*
╰━━━━━━━━━━━━━━━━━╯
    `.trim();

    const buttons = [
      {
        buttonId: "action",
        buttonText: { displayText: "📂 ᴍᴇɴᴜ ᴏᴘᴛɪᴏɴꜱ" },
        type: 4,
        nativeFlowInfo: {
          name: "single_select",
          paramsJson: JSON.stringify({
            title: "📂 ᴄʟɪᴄᴋ ʜᴇʀᴇ",
            sections: [
              {
                title: "📁 ᴍᴇɢᴀʟᴏᴅᴏɴ-ᴍᴅ",
                highlight_label: "",
                rows: [
                  {
                    title: "📂 ᴍᴇɴᴜ",
                    description: "ᴏᴘᴇɴ ᴀʟʟ ᴄᴏᴍᴍᴀɴᴅꜱ",
                    id: `${config.PREFIX}menu`,
                  },
                  {
                    title: "👑 ᴏᴡɴᴇʀ",
                    description: "ᴄᴏɴᴛᴀᴄᴛ ʙᴏᴛ ᴏᴡɴᴇʀ",
                    id: `${config.PREFIX}owner`,
                  },
                  {
                    title: "📶 ᴘɪɴɢ",
                    description: "ᴛᴇꜱᴛ ʙᴏᴛ ꜱᴘᴇᴇᴅ",
                    id: `${config.PREFIX}ping`,
                  },
                  {
                    title: "🖥️ ꜱʏꜱᴛᴇᴍ",
                    description: "ꜱʏꜱᴛᴇᴍ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ",
                    id: `${config.PREFIX}checkupdate`,
                  },
                  {
                    title: "🛠️ ʀᴇᴘᴏ",
                    description: "ɢɪᴛʜᴜʙ ʀᴇᴘᴏꜱɪᴛᴏʀʏ",
                    id: `${config.PREFIX}repo`,
                  },
                ],
              },
            ],
          }),
        },
      },
    ];

    await conn.sendMessage(from, {
      buttons,
      headerType: 1,
      viewOnce: true,
      image: { url: config.MENU_IMAGE_URL },
      caption,
    }, { quoted: mek });

  } catch (err) {
    console.error(err);
    await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
    reply("❌ An error occurred while processing your request.");
  }
});

