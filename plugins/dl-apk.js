const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "apk",
    alias: ["app"],
    react: "📲",
    desc: "📥 Download APK directly",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ *ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀɴ ᴀᴘᴘ ɴᴀᴍᴇ!*");

        // ⏳ React - processing
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        // Search the app on bk9
        const search = await axios.get(`https://bk9.fun/search/apk?q=${encodeURIComponent(q)}`);
        if (!search.data.BK9 || search.data.BK9.length === 0) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ *ɴᴏ ᴀᴘᴘ ғᴏᴜɴᴅ ᴡɪᴛʜ ᴛʜᴀᴛ ɴᴀᴍᴇ, ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ.*");
        }

        // Fetch APK details
        const id = search.data.BK9[0].id;
        const details = await axios.get(`https://bk9.fun/download/apk?id=${id}`);
        const app = details.data.BK9;

        if (!app || !app.dllink) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ *Unable to find download link for this app.*");
        }

        // Send APK file
        await conn.sendMessage(from, {
            document: { url: app.dllink },
            mimetype: "application/vnd.android.package-archive",
            fileName: `${app.name}.apk`,
            caption: `*ᴀᴘᴋ sᴜᴄᴄᴇssғᴜʟʟʏ ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ*\n ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ 🤍`
        }, { quoted: mek });

        // ✅ React - success
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply("❌ *An error occurred while fetching the APK.*");
    }
});
