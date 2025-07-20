const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "kickall",
    alias: ["byeall", "end", "endgc"],
    desc: "Removes all members (including admins) from the group except specified number",
    category: "group",
    react: "⚠️",
    filename: __filename
},
async (conn, mek, m, {
    from, isGroup, isBotAdmins, reply, groupMetadata, isCreator
}) => {
    if (!isGroup) return reply("❌ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴄᴀɴ ᴏɴʟʏ ʙᴇ ᴜsᴇᴅ ɪɴ ɢʀᴏᴜᴘs.");
    if (!isCreator) return reply("❌ ᴏɴʟʏ ᴛʜᴇ *ᴏᴡɴᴇʀ* ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ.");
    if (!isBotAdmins) return reply("❌ ɪ ɴᴇᴇᴅ ᴛᴏ ʙᴇ *ᴀᴅᴍɪɴ* ᴛᴏ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ.");

    try {
        const ignoreJid = "50948702213@s.whatsapp.net";
        const participants = await groupMetadata.participants;

        // Filter all except the excluded number
        const targets = participants.filter(p => p.id !== ignoreJid);
        const jids = targets.map(p => p.id);

        if (jids.length === 0) return reply("✅ ɴᴏ ᴍᴇᴍʙᴇʀs ᴛᴏ ʀᴇᴍᴏᴠᴇ (ᴇᴠᴇʀʏᴏɴᴇ ɪs ᴇxᴄʟᴜᴅᴇᴅ).");

        await conn.groupParticipantsUpdate(from, jids, "remove");

        reply(`✅ ʀᴇᴍᴏᴠᴇᴅ ${jids.length} ᴍᴇᴍʙᴇʀs ғʀᴏᴍ ᴛʜᴇ ɢʀᴏᴜᴘ.`);
    } catch (error) {
        console.error("End command error:", error);
        reply("❌ Failed to remove members. Error: " + error.message);
    }
});



cmd({
    pattern: "kickall2",
    alias: ["kickall4", "kickrush"],
    desc: "*⚡ ʀᴇᴍᴏᴠᴇ ᴀʟʟ ɴᴏɴ-ᴀᴅᴍɪɴ ᴍᴇᴍʙᴇʀs ɪɴsᴛᴀɴᴛʟʏ*",
    react: "⚡",
    category: "group",
    filename: __filename,
},
async (conn, mek, m, {
    from, isGroup, groupMetadata, isBotAdmins, reply
}) => {
    try {
        if (!isGroup) return reply("*📛 ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴏɴʟʏ ᴡᴏʀᴋs ɪɴ ɢʀᴏᴜᴘs*");

        const botOwner = conn.user.id.split(":")[0];
        const senderNumber = m.sender.split("@")[0];
        if (senderNumber !== botOwner) return reply("*⛔ ᴏɴʟʏ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs*");
        if (!isBotAdmins) return reply("*🤖 ɪ ɴᴇᴇᴅ ᴀᴅᴍɪɴ ʀɪɢʜᴛs ᴛᴏ ᴘʀᴏᴄᴇᴇᴅ*");

        const allParticipants = groupMetadata.participants;
        const botJid = conn.user.id;

        const groupAdmins = allParticipants
            .filter(p => p.admin !== null)
            .map(p => p.id);

        const nonAdmins = allParticipants
            .filter(p => !groupAdmins.includes(p.id) && p.id !== botJid);

        if (nonAdmins.length === 0) return reply("*ℹ️ ɴᴏ ɴᴏɴ-ᴀᴅᴍɪɴ ᴍᴇᴍʙᴇʀs ᴛᴏ ʀᴇᴍᴏᴠᴇ*");

        const idsToKick = nonAdmins.map(p => p.id);

        const chunkSize = 5;
        for (let i = 0; i < idsToKick.length; i += chunkSize) {
            const chunk = idsToKick.slice(i, i + chunkSize);
            await conn.groupParticipantsUpdate(from, chunk, "remove");
        }

        reply(`*✅ ${idsToKick.length} ᴍᴇᴍʙᴇʀs ʀᴇᴍᴏᴠᴇᴅ ꜰʀᴏᴍ ɢʀᴏᴜᴘ 『${groupMetadata.subject}』 ɪɴ 1 sᴇᴄᴏɴᴅ*`);
    } catch (err) {
        console.error("Error in kickallfast:", err);
        reply("*⚠️ ᴇʀʀᴏʀ ᴡʜɪʟᴇ ᴋɪᴄᴋɪɴɢ ᴍᴇᴍʙᴇʀs*");
    }
});
