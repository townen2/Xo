const config = require('../config');
const moment = require('moment-timezone');
const { cmd, commands } = require('../command');

// Fonction pour styliser les majuscules comme ʜɪ
function toUpperStylized(str) {
  const stylized = {
    A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ', E: 'ᴇ', F: 'ғ', G: 'ɢ', H: 'ʜ',
    I: 'ɪ', J: 'ᴊ', K: 'ᴋ', L: 'ʟ', M: 'ᴍ', N: 'ɴ', O: 'ᴏ', P: 'ᴘ',
    Q: 'ǫ', R: 'ʀ', S: 's', T: 'ᴛ', U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x',
    Y: 'ʏ', Z: 'ᴢ'
  };
  return str.split('').map(c => stylized[c.toUpperCase()] || c).join('');
}

// Normalisation des catégories
const normalize = (str) => str.toLowerCase().replace(/\s+menu$/, '').trim();

cmd({
  pattern: "menu",
  alias: ["💫", "mega", "allmenu"],
  use: '.menu',
  desc: "Show all bot commands",
  category: "menu",
  react: "🎴",
  filename: __filename
},
async (dyby, mek, m, { from, reply }) => {
  try {
    const sender = m?.sender || mek?.key?.participant || mek?.key?.remoteJid || 'unknown@s.whatsapp.net';
    const username = m.pushName || 'User';
    const plugins = commands.length;
    const version = config.VERSION || '1.0.0';
    const uptime = () => {
      let sec = process.uptime();
      let h = Math.floor(sec / 3600);
      let m = Math.floor((sec % 3600) / 60);
      let s = Math.floor(sec % 60);
      return `${h}h ${m}m ${s}s`;
    };
    const uptimeStr = uptime();
    const time = moment().tz(config.TIME_ZONE || 'UTC').format('HH:mm:ss');
    const date = moment().tz(config.TIME_ZONE || 'UTC').format('DD/MM/YYYY');

    let dybymenu = `
*╭══〘〘 *𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃* 〙〙═⊷
┃❍ ᴍᴏᴅᴇ: ${config.MODE}
┃❍ ᴘʀᴇғɪx: [ ${config.PREFIX} ]
┃❍ ᴜsᴇʀ: ${username}
┃❍ ᴘʟᴜɢɪɴs: ${plugins}
┃❍ ᴠᴇʀsɪᴏɴ: ${version}
┃❍ ᴜᴘᴛɪᴍᴇ: ${uptimeStr}
┃❍ ᴅᴀᴛᴇ ᴛᴏᴅᴀʏ: ${date}
┃❍ ᴅᴇᴠ : ᴅʏʙʏ ᴛᴇᴄʜ 💫
╰═════════════════⊷`;

    // Regrouper les commandes par catégorie
    let categories = {};
    for (let cmd of commands) {
      if (!cmd.category) continue;
      const cat = normalize(cmd.category);
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(cmd);
    }

    // Construction du menu par catégorie
    const sortedKeys = Object.keys(categories).sort();
    for (let key of sortedKeys) {
      dybymenu += `\n\n╭━━━━ 『 *${toUpperStylized(key)} ᴍᴇɴᴜ*』`;

      const cmds = categories[key].filter(c => c.pattern).sort((a, b) => a.pattern.localeCompare(b.pattern));
      for (let c of cmds) {
        const usage = c.pattern.split('|')[0];
        dybymenu += `\n╏⁠➳ ${config.PREFIX}${toUpperStylized(usage)}`;
      }
      dybymenu += `\n╰━━━━━━━━━━━━━━━━━⊷`;
    }

    // Envoi du menu avec image
    await dyby.sendMessage(from, {
      image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/roubzi.jpg' },
      caption: dybymenu,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363401051937059@newsletter',
          newsletterName: '𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

  } catch (e) {
    console.error("❌ Error in menu:", e);
    reply(`❌ Menu error: ${e.message}`);
  }
});
