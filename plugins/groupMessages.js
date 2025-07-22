const { cmd } = require('../command');
const { loadSettings, saveSettings } = require('../lib/groupMessagesStorage');

let settings = loadSettings();
let welcomeSettings = settings.welcome || {};
let goodbyeSettings = settings.goodbye || {};

const defaultWelcomeMessage = 
`┏━━━━━━━━━━━━━━━━━━━━━━┓
┃  👋 𝐍𝐄𝐖 𝐌𝐄𝐌𝐁𝐄𝐑 𝐉𝐎𝐈𝐍𝐄𝐃  🎉
┣━━━━━━━━━━━━━━━━━━━━━━┫
┃ 🧑‍💼 ᴜsᴇʀ: {user}
┃ 📅 ᴊᴏɪɴᴇᴅ: {date} ⏰ {time}
┃ 🧮 ᴍᴇᴍʙᴇʀs: {count}
┃ 🏷️ ɢʀᴏᴜᴘ: {group}
┣━━━━━━━━━━━━━━━━━━━━━━━
┃ 📌 ᴅᴇsᴄʀɪᴘᴛɪᴏɴ:
┃ {desc}
┗━━━━━━━━━━━━━━━━━━━━━━┛`;

const defaultGoodbyeMessage = 
`┏━━━━━━━━━━━━━━━━━━━━━━┓
┃  👋 𝐌𝐄𝐌𝐁𝐄𝐑 𝐋𝐄𝐅𝐓  😢
┣━━━━━━━━━━━━━━━━━━━━━━
┃ 🧑‍💼 ᴜsᴇʀ: {user}
┃ 📅 ʟᴇғᴛ ᴀᴛ: {date} ⏰ {time}
┃ 🧮 ʀᴇᴍᴀɪɴɪɴɢ: {count}
┗━━━━━━━━━━━━━━━━━━━━━━━┛`;

function formatMessage(template, userMention, groupName, extras = {}) {
  return template
    .replace(/{user}/g, userMention)
    .replace(/{group}/g, groupName)
    .replace(/{date}/g, extras.date || "")
    .replace(/{time}/g, extras.time || "")
    .replace(/{count}/g, extras.count || "")
    .replace(/{desc}/g, extras.desc || "");
}

// === .welcome ===
cmd({
  pattern: "welcome",
  desc: "Enable/disable or customize welcome message\nUsage: welcome on | off | <message>",
  category: "group",
  filename: __filename,
}, async (conn, mek, m, { from, args, reply, isGroup, isOwner, isAdmins }) => {
  if (!isGroup) return reply("❌ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ɪs ғᴏʀ ɢʀᴏᴜᴘs ᴏɴʟʏ.");
  if (!isOwner && !isAdmins) return reply("❌ ᴏɴʟʏ ɢʀᴏᴜᴘ ᴀᴅᴍɪɴs ᴏʀ ᴛʜᴇ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ.");

  if (args.length === 0) {
    const setting = welcomeSettings[from];
    return reply(setting && setting.enabled
      ? `✅ ᴡᴇʟᴄᴏᴍᴇ ɪs *ᴏɴ*\n📝 ᴍᴇssᴀɢᴇ:\n${setting.message}`
      : "❌ ᴡᴇʟᴄᴏᴍᴇ ɪs *ᴏғғ*.");
  }

  const option = args[0].toLowerCase();

  if (option === "on") {
    welcomeSettings[from] = { enabled: true, message: defaultWelcomeMessage };
  } else if (option === "off") {
    welcomeSettings[from] = { enabled: false, message: "" };
  } else {
    const customMsg = args.join(" ");
    welcomeSettings[from] = { enabled: true, message: customMsg };
  }

  settings.welcome = welcomeSettings;
  saveSettings(settings);

  reply(option === "off"
    ? "❌ ᴡᴇʟᴄᴏᴍᴇ ᴍᴇssᴀɢᴇ ᴅɪsᴀʙʟᴇᴅ."
    : `✅ ᴡᴇʟᴄᴏᴍᴇ ᴍᴇssᴀɢᴇ ${option === "on" ? "enabled" : "sᴇᴛ ᴡɪᴛʜ ᴄᴜsᴛᴏᴍ ᴛᴇxᴛ"}:\n${welcomeSettings[from].message}`);
});

// === .goodbye ===
cmd({
  pattern: "goodbye",
  desc: "Enable/disable or customize goodbye message\nUsage: goodbye on | off | <message>",
  category: "group",
  filename: __filename,
}, async (conn, mek, m, { from, args, reply, isGroup, isOwner, isAdmins }) => {
  if (!isGroup) return reply("❌ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ɪs ғᴏʀ ɢʀᴏᴜᴘs ᴏɴʟʏ.");
  if (!isOwner && !isAdmins) return reply("❌ ᴏɴʟʏ ɢʀᴏᴜᴘ ᴀᴅᴍɪɴs ᴏʀ ᴛʜᴇ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ.");

  if (args.length === 0) {
    const setting = goodbyeSettings[from];
    return reply(setting && setting.enabled
      ? `✅ ɢᴏᴏᴅʙʏᴇ ɪs *ᴏɴ*\n📝 ᴍᴇssᴀɢᴇ:\n${setting.message}`
      : "❌ ɢᴏᴏᴅʙʏᴇ ɪs *ᴏғғ*.");
  }

  const option = args[0].toLowerCase();

  if (option === "on") {
    goodbyeSettings[from] = { enabled: true, message: defaultGoodbyeMessage };
  } else if (option === "off") {
    goodbyeSettings[from] = { enabled: false, message: "" };
  } else {
    const customMsg = args.join(" ");
    goodbyeSettings[from] = { enabled: true, message: customMsg };
  }

  settings.goodbye = goodbyeSettings;
  saveSettings(settings);

  reply(option === "off"
    ? "❌ ɢᴏᴏᴅʙʏᴇ ᴍᴇssᴀɢᴇ ᴅɪsᴀʙʟᴇᴅ."
    : `✅ ɢᴏᴏᴅʙʏᴇ ᴍᴇssᴀɢᴇ ${option === "on" ? "enabled" : "sᴇᴛ ᴡɪᴛʜ ᴄᴜsᴛᴏᴍ ᴛᴇxᴛ"}:\n${goodbyeSettings[from].message}`);
});

// === Group Event Listener ===
function registerGroupMessages(conn) {
  conn.ev.on("group-participants.update", async (update) => {
    const groupId = update.id;
    let groupMetadata;

    try {
      groupMetadata = await conn.groupMetadata(groupId);
    } catch (e) {
      console.error("Group metadata fetch error:", e);
      return;
    }

    const groupName = groupMetadata.subject || "this group";
    const groupDesc = groupMetadata.desc || "No description";
    const memberCount = groupMetadata.participants?.length || "N/A";

    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString("en-US");

    const actionMap = {
      "add": {
        setting: welcomeSettings[groupId],
        defaultMsg: defaultWelcomeMessage,
      },
      "remove": {
        setting: goodbyeSettings[groupId],
        defaultMsg: defaultGoodbyeMessage,
      },
    };

    if (actionMap[update.action]) {
      for (const participant of update.participants) {
        const { setting, defaultMsg } = actionMap[update.action];
        if (setting && setting.enabled) {
          let pp = "https://files.catbox.moe/49gzva.png";
          try {
            pp = await conn.profilePictureUrl(participant, "image");
          } catch {}

          const mention = `@${participant.split("@")[0]}`;
          const message = formatMessage(setting.message || defaultMsg, mention, groupName, {
            date, time, count: memberCount, desc: groupDesc,
          });

          await conn.sendMessage(groupId, {
            image: { url: pp },
            caption: message,
            mentions: [participant],
          });
        }
      }
    }
  });
}

module.exports = { registerGroupMessages };
