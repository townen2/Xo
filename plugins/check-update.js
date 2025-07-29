const axios = require('axios');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');

cmd({
    pattern: "checkupdate",
    alias: ["changelog", "cupdate", "updateinfo"],
    react: "🚀",
    desc: "Check bot version, system stats, and update info.",
    category: "main",
    filename: __filename,
}, async (conn, m, mdata, { from, sender, pushname, reply }) => {
    try {
        // 📁 Lecture de la version locale
        const localPath = path.join(__dirname, '../data/version.json');
        let currentVersion = "ᴜɴᴋɴᴏᴡɴ";
        let currentChangelog = "ɴᴏ ᴄʜᴀɴɢᴇʟᴏɢ ᴀᴠᴀɪʟᴀʙʟᴇ.";

        if (fs.existsSync(localPath)) {
            const localData = JSON.parse(fs.readFileSync(localPath));
            currentVersion = localData.version || currentVersion;
            currentChangelog = localData.changelog || currentChangelog;
        }

        // 🌐 Récupération de la version GitHub
        const githubUrl = 'https://raw.githubusercontent.com/DybyTech/MEGALODON-MD/main/data/version.json';
        let latestVersion = "ᴜɴᴋɴᴏᴡɴ";
        let latestChangelog = "ɴᴏ ᴄʜᴀɴɢᴇʟᴏɢ ᴀᴠᴀɪʟᴀʙʟᴇ.";

        try {
            const { data: remoteData } = await axios.get(githubUrl);
            latestVersion = remoteData.version || latestVersion;
            latestChangelog = remoteData.changelog || latestChangelog;
        } catch (err) {
            console.error("❌ Failed to fetch latest version:", err);
        }

        // 🧠 Statistiques système et bot
        const pluginsPath = path.join(__dirname, '../plugins');
        const pluginCount = fs.readdirSync(pluginsPath).filter(f => f.endsWith('.js')).length;
        const commandCount = commands.length;
        const uptime = runtime(process.uptime());
        const usedRAM = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalRAM = (os.totalmem() / 1024 / 1024).toFixed(2);
        const hostname = os.hostname();
        const lastUpdate = fs.statSync(localPath).mtime.toLocaleString();
        const repoURL = 'https://github.com/DybyTech/MEGALODON-MD';

        // 🔄 Statut de mise à jour
        let updateNote = '✅ уσυя вσт ιѕ υρ-тσ-∂αтє!';
        if (currentVersion !== latestVersion) {
            updateNote =
                `🚀 ʏᴏᴜʀ ʙᴏᴛ ɪs *ᴏᴜᴛᴅᴀᴛᴇᴅ!*\n\n` +
                `🔹 *ᴄᴜʀʀᴇɴᴛ ᴠᴇʀsɪᴏɴ:* ${currentVersion}\n` +
                `🔹 *ʟᴀᴛᴇsᴛ ᴠᴇʀsɪᴏɴ:* ${latestVersion}\n\n` +
                `ᴜsᴇ *.ᴜᴘᴅᴀᴛᴇ* ᴛᴏ ᴜᴘᴅᴀᴛᴇ.`;
        }

        const greeting = new Date().getHours() < 12 ? "🌞 ɢᴏᴏᴅ ᴍᴏʀɴɪɴɢ" : "🌙 ɢᴏᴏᴅ ɴɪɢʜᴛ";

        // ✉️ Construction du message
        const caption =
            `${greeting}, ${pushname}!\n\n` +
            `📌 *ʙᴏᴛ ɴᴀᴍᴇ:* ᴍᴇɢᴀʟᴏᴅᴏɴ-ᴍᴅ\n` +
            `🔖 *ᴄᴜʀʀᴇɴᴛ ᴠᴇʀsɪᴏɴ:* ${currentVersion}\n` +
            `📢 *ʟᴀᴛᴇsᴛ ᴠᴇʀsɪᴏɴ:* ${latestVersion}\n` +
            `📂 *ᴛᴏᴛᴀʟ ᴘʟᴜɢɪɴs:* ${pluginCount}\n` +
            `🧩 *ᴛᴏᴛᴀʟ ᴄᴏᴍᴍᴀɴᴅs:* ${commandCount}\n\n` +
            `💾 *sʏsᴛᴇᴍ ɪɴғᴏ:*\n` +
            `⏳ *ᴜᴘᴛɪᴍᴇ:* ${uptime}\n` +
            `📟 *ʀᴀᴍ ᴜsᴀɢᴇ:* ${usedRAM} ᴍʙ / ${totalRAM} ᴍʙ\n` +
            `🖥️ *ʜᴏsᴛ ɴᴀᴍᴇ:* ${hostname}\n` +
            `📅 *ʟᴀsᴛ ᴜᴘᴅᴀᴛᴇ:* ${lastUpdate}\n\n` +
            `📝 *ᴄʜᴀɴɢᴇʟᴏɢ:*\n${latestChangelog}\n\n` +
            `⭐ *ɢɪᴛʜᴜʙ ʀᴇᴘᴏ:* ${repoURL}\n\n` +
            `${updateNote}`;

        // 📤 Envoi du message avec image
        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/roubzi.jpg' },
            caption,
            contextInfo: {
                mentionedJid: [mdata.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363401051937059@newsletter',
                    newsletterName: '𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃',
                    serverMessageId: 143
                }
            }
        }, { quoted: m });

    } catch (err) {
        console.error("❌ An error occurred in .checkupdate:", err);
        reply("❌ An error occurred while checking the bot version.");
    }
});
