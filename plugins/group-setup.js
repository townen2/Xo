const { cmd } = require("../command");

cmd({
  pattern: "promote",
  alias: ["p", "giveadmin", "makeadmin"],
  desc: "Promote a user to admin",
  category: "group",
  react: "🔺",
  filename: __filename
}, async (conn, mek, m, {
  from,
  isCreator,
  isBotAdmins,
  isAdmins,
  isGroup,
  quoted,
  reply
}) => {
  try {
    if (!isGroup) return reply("⚠️ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴏɴʟʏ ᴡᴏʀᴋs ɪɴ *ɢʀᴏᴜᴘs*.");
    if (!isBotAdmins) return reply("❌ ɪ ᴍᴜsᴛ ʙᴇ *ᴀᴅᴍɪɴ* ᴛᴏ ᴘʀᴏᴍᴏᴛᴇ sᴏᴍᴇᴏɴᴇ.");
    if (!isAdmins && !isCreator) return reply("🔐 ᴏɴʟʏ *ɢʀᴏᴜᴘ ᴀᴅᴍɪɴs* ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ.");

    // Your user extraction logic
    if (!m.quoted && (!m.mentionedJid || m.mentionedJid.length === 0)) {
      return reply("❓ You did not give me a user!?");
    }

    let users = m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.quoted
      ? m.quoted.sender
      : null;

    if (!users) return reply("⚠️ Couldn't determine target user.");

    const parts = users.split('@')[0];
    const ownerJid = conn.user.id.split(":")[0] + '@s.whatsapp.net';

    if (users === ownerJid) return reply("👑 ᴛʜᴀᴛ's ᴛʜᴇ *ᴏᴡɴᴇʀ's ɴᴜᴍʙᴇʀ!* ᴀʟʀᴇᴀᴅʏ ᴘᴏᴡᴇʀғᴜʟ!");

    // Promote without checking if already admin
    await conn.groupParticipantsUpdate(from, [users], "promote");

    reply(`*✅ sᴜᴄᴄᴇssғᴜʟʟʏ ᴘʀᴏᴍᴏᴛᴇᴅ ᴛᴏ ᴀᴅᴍɪɴ.*`, { mentions: [users] });

  } catch (err) {
    console.error(err);
    reply("❌ Failed to promote. Something went wrong.");
  }
});

cmd({
  pattern: "demote",
  alias: ["d", "dismiss", "removeadmin"],
  desc: "Demote a group admin",
  category: "group",
  react: "🔻",
  filename: __filename
}, async (conn, mek, m, {
  from,
  isCreator,
  isBotAdmins,
  isAdmins,
  isGroup,
  participants,
  quoted,
  reply
}) => {
  try {
    if (!isGroup) return reply("⚠️ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴏɴʟʏ ᴡᴏʀᴋs ɪɴ *ɢʀᴏᴜᴘs*.");
    if (!isBotAdmins) return reply("❌ I ᴍᴜsᴛ ʙᴇ *ᴀᴅᴍɪɴ* ᴛᴏ ᴅᴇᴍᴏᴛᴇ sᴏᴍᴇᴏɴᴇ.");
    if (!isAdmins && !isCreator) return reply("🔐 ᴏɴʟʏ *ɢʀᴏᴜᴘ ᴀᴅᴍɪɴs* ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ.");

    // Your user extraction logic
    if (!m.quoted && (!m.mentionedJid || m.mentionedJid.length === 0)) {
      return reply("❓ ʏᴏᴜ ᴅɪᴅ ɴᴏᴛ ɢɪᴠᴇ ᴍᴇ ᴀ ᴜsᴇʀ!?");
    }

    let users = m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.quoted
      ? m.quoted.sender
      : null;

    if (!users) return reply("⚠️ Couldn't determine target user.");

    const parts = users.split('@')[0];
    const ownerJid = conn.user.id.split(":")[0] + '@s.whatsapp.net';

    if (users === ownerJid) return reply("👑 ᴛʜᴀᴛ's ᴛʜᴇ *ᴏᴡɴᴇʀ's ɴᴜᴍʙᴇʀ!* ɪ ᴄᴀɴ'ᴛ ᴅᴇᴍᴏᴛᴇ ᴛʜᴀᴛ.");

    // No admin check — always try to demote
    await conn.groupParticipantsUpdate(from, [users], "demote");

    reply(`*✅ ᴀᴅᴍɪɴ sᴜᴄᴄᴇssғᴜʟʟʏ ᴅᴇᴍᴏᴛᴇᴅ ᴛᴏ ᴀ ɴᴏʀᴍᴀʟ ᴍᴇᴍʙᴇʀ.*`, { mentions: [users] });

  } catch (err) {
    console.error(err);
    reply("❌ Failed to demote. Something went wrong.");
  }
});
