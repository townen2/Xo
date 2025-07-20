const { cmd } = require('../command');

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
