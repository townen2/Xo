const config = require('../config');
const { cmd } = require('../command');
const { ytsearch, ytmp3, ytmp4 } = require('@dark-yasiya/yt-dl.js'); 
const converter = require('../data/play-converter');
const fetch = require('node-fetch');

cmd({ 
    pattern: "play4", 
    alias: ["yta4"], 
    react: "☘️", 
    desc: "Download YouTube song via JawadTech API", 
    category: "main", 
    use: '.play2 <query or youtube url>', 
    filename: __filename 
}, async (conn, mek, m, { from, sender, reply, q }) => { 
    try {
        if (!q) return reply("*ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ sᴏɴɢ ɴᴀᴍᴇ ᴏʀ ʏᴏᴜᴛᴜʙᴇ ʟɪɴᴋ.*");

        let ytUrl = '';
        if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(q)) {
            ytUrl = q.trim();
        } else {
            const yt = await ytsearch(q);
            if (!yt.results.length) return reply("ɴᴏ ʀᴇsᴜʟᴛs ғᴏᴜɴᴅ!");
            ytUrl = yt.results[0].url;
        }

        const apiUrl = `https://jawad-tech.vercel.app/download/ytmp3?url=${encodeURIComponent(ytUrl)}`;
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data?.result) return reply("❌ ᴅᴏᴡɴʟᴏᴀᴅ ғᴀɪʟᴇᴅ. ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.");

        // Step 4: Download audio buffer
        const audioRes = await fetch(data.result);
        const audioBuffer = await audioRes.buffer();

        // Step 5: Convert to MP3 using toAudio
        let convertedAudio;
        try {
            convertedAudio = await converter.toAudio(audioBuffer, 'mp4');
        } catch (err) {
            console.error('Audio conversion failed:', err);
            return reply("❌ Audio conversion failed. Please try another song.");
        }

        // Step 6: Send converted audio
        await conn.sendMessage(from, {
            audio: convertedAudio,
            mimetype: "audio/mpeg",
            fileName: `${data.metadata?.title || 'song'}.mp3`
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply("ᴀɴ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ. ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ.");
    }
});

cmd({ 
    pattern: "yta", 
    alias: ["play", "audio"], 
    react: "🎧", 
    desc: "Download YouTube song", 
    category: "main", 
    use: '.song <query>', 
    filename: __filename 
}, async (conn, mek, m, { from, sender, reply, q }) => { 
    try {
        if (!q) return reply("*ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ sᴏɴɢ ɴᴀᴍᴇ..*");

        const yt = await ytsearch(q);
        if (!yt.results.length) return reply("No results found!");

        const song = yt.results[0];
        const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(song.url)}`;
        
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data?.result?.downloadUrl) return reply("ᴅᴏᴡɴʟᴏᴀᴅ ғᴀɪʟᴇᴅ. ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.");

        await conn.sendMessage(from, {
            audio: { url: data.result.downloadUrl },
            mimetype: "audio/mpeg",
            fileName: `${song.title}.mp3`
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply("An error occurred. Please try again.");
    }
});

cmd({
    pattern: "play2",
    alias: ["yta2", "song"],
    react: "🎵",
    desc: "Download high quality YouTube audio",
    category: "media",
    use: "<song name>",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ a sᴏɴɢ ɴᴀᴍᴇ\nExample: .ᴘʟᴀʏ2 ᴄᴇɴᴛʀᴀʟ ᴄᴇᴇ sᴘʀɪɴᴛᴇʀ");

        // Step 1: Search YouTube
        await conn.sendMessage(from, { text: "🔍 sᴇᴀʀᴄʜɪɴɢ ғᴏʀ ʏᴏᴜʀ sᴏɴɢ..." }, { quoted: mek });
        const yt = await ytsearch(q);
        if (!yt?.results?.length) return reply("❌ ɴᴏ ʀᴇsᴜʟᴛs ғᴏᴜɴᴅ. ᴛʀʏ a ᴅɪғғᴇʀᴇɴᴛ sᴇᴀʀᴄʜ ᴛᴇʀᴍ.");

        const vid = yt.results[0];

        const caption =
`*𝐘𝐓 𝐀𝐔𝐃𝐈𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*
╭━━❐━⪼
┇๏ *ᴛɪᴛʟᴇ*    –  ${vid.title}
┇๏ *ᴅᴜʀᴀᴛɪᴏɴ* –  ${vid.timestamp}
┇๏ *ᴠɪᴇᴡs*    –  ${vid.views}
┇๏ *ᴀᴜᴛʜᴏʀ*   –  ${vid.author.name}
╰━━❑━⪼
> *ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ ᴀᴜᴅɪᴏ ғɪʟᴇ*`;

        // Step 2: Send video info with thumbnail
        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption
        }, { quoted: mek });

        // Step 3: Fetch audio URL
        const apiUrl = `https://api-aswin-sparky.koyeb.app/api/downloader/song?search=${encodeURIComponent(vid.url)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data?.status || !data?.data?.downloadURL) {
            return reply("❌ ғᴀɪʟᴇᴅ ᴛᴏ ғᴇᴛᴄʜ ᴀᴜᴅɪᴏ. ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.");
        }

        // Step 4: Download audio buffer
        const audioRes = await fetch(data.data.downloadURL);
        const audioBuffer = await audioRes.buffer();

        // Step 5: Convert to MP3 using toAudio
        let convertedAudio;
        try {
            convertedAudio = await converter.toAudio(audioBuffer, 'mp4');
        } catch (err) {
            console.error('Audio conversion failed:', err);
            return reply("❌ Audio conversion failed. Please try another song.");
        }

        // Step 6: Send converted audio
        await conn.sendMessage(from, {
            audio: convertedAudio,
            mimetype: 'audio/mpeg',
            ptt: false,
            fileName: `${vid.title}.mp3`.replace(/[^\w\s.-]/gi, '')
        }, { quoted: mek });

        // Step 7: React success
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error('Play2 command error:', error);
        reply("⚠️ An unexpected error occurred. Please try again.");
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});
 
cmd({ 
    pattern: "play3", 
    alias: ["jadu", "music", "dlyt", "playx"], 
    react: "❄️", 
    desc: "Download YouTube content with options",
    category: "download", 
    use: '.play2 <Youtube URL or Name>', 
    filename: __filename }, 
    async (conn, mek, m, { from, prefix, quoted, q, reply }) => { 
        try {
            if (!q) return await reply("ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ʏᴏᴜᴛᴜʙᴇ ᴜʀʟ ᴏʀ ᴠɪᴅᴇᴏ ɴᴀᴍᴇ.");

            const yt = await ytsearch(q);
            if (yt.results.length < 1) return reply("No results found!");
            
            let yts = yt.results[0];  
            
            let ytmsg = `*🎬 𝐘𝐎𝐔𝐓𝐔𝐁𝐄 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑*
╭━━❐━⪼
┇๏ *ᴛɪᴛʟᴇ* - ${yts.title}
┇๏ *ᴅᴜʀᴀᴛɪᴏɴ* - ${yts.timestamp}
┇๏ *ᴠɪᴇᴡs* - ${yts.views}
┇๏ *ᴀᴜᴛʜᴏʀ* - ${yts.author.name}
╰━━❑━⪼
📌 *ʀᴇᴘʟʏ ᴡɪᴛʜ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴛᴏ ᴅᴏᴡɴʟᴏᴀᴅ*
1. ᴠɪᴅᴇᴏ (MP4)
2. ᴀᴜᴅɪᴏ (MP3) 
3. ᴠᴏɪᴄᴇ ɴᴏᴛᴇ (ᴘᴛᴛ) 
4. ᴅᴏᴄᴜᴍᴇɴᴛ (ᴍᴘ4)
5. ᴅᴏᴄᴜᴍᴇɴᴛ (ᴍᴘ3) 

> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*`;

            // Send video details with thumbnail
            const sentMsg = await conn.sendMessage(from, { 
                image: { url: yts.thumbnail }, 
                caption: ytmsg 
            }, { quoted: mek });

            const messageID = sentMsg.key.id;
            let responded = false;

            // Create a listener for the reply
            const replyHandler = async (msgData) => {
                const receivedMsg = msgData.messages[0];
                if (!receivedMsg.message || responded) return;

                const receivedText = receivedMsg.message.conversation || 
                                    receivedMsg.message.extendedTextMessage?.text;
                const senderID = receivedMsg.key.remoteJid;
                const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

                if (isReplyToBot && senderID === from) {
                    if (!['1','2','3','4','5'].includes(receivedText)) {
                        await conn.sendMessage(from, { 
                            text: "❌ ɪɴᴠᴀʟɪᴅ ᴏᴘᴛɪᴏɴ! ᴘʟᴇᴀsᴇ ʀᴇᴘʟʏ ᴡɪᴛʜ 1, 2, 3, 4, ᴏʀ 5." 
                        }, { quoted: receivedMsg });
                        return;
                    }

                    responded = true;
                    conn.ev.off("messages.upsert", replyHandler);

                    await conn.sendMessage(from, {
                        react: { text: '⬇️', key: receivedMsg.key }
                    });

                    try {
                        // Get fresh download URL for each request
                        const apiResponse = await fetch(`https://jawad-tech.vercel.app/download/ytmp4?url=${encodeURIComponent(yts.url)}`);
                        const apiData = await apiResponse.json();
                        
                        if (!apiData.status || !apiData.result.download) {
                            throw new Error("ғᴀɪʟᴇᴅ ᴛᴏ ɢᴇᴛ ᴅᴏᴡɴʟᴏᴀᴅ ᴜʀʟ");
                        }

                        const downloadUrl = apiData.result.download;
                        const sanitizedTitle = yts.title.replace(/[^\w\s]/gi, '').substring(0, 50);

                        // Download the media file first
                        const mediaRes = await fetch(downloadUrl);
                        const mediaBuffer = await mediaRes.buffer();

                        switch (receivedText) {
                            case "1":
                                // Video download (no conversion needed)
                                await conn.sendMessage(from, { 
                                    video: mediaBuffer,
                                    caption: "> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ 💫*"
                                }, { quoted: receivedMsg });
                                break;
                                
                            case "2":
                                // Audio download (convert to compressed MP3)
                                try {
                                    const convertedAudio = await converter.toAudio(mediaBuffer, 'mp4', {
                                        bitrate: '96k', // Lower bitrate for smaller size
                                        sampleRate: 22050, // Lower sample rate
                                        channels: 1 // Mono instead of stereo
                                    });
                                    await conn.sendMessage(from, { 
                                        audio: convertedAudio,
                                        mimetype: "audio/mpeg",
                                        fileName: `${sanitizedTitle}.mp3`
                                    }, { quoted: receivedMsg });
                                } catch (convError) {
                                    console.error('Audio ᴄᴏɴᴠᴇʀsɪᴏɴ ғᴀɪʟᴇᴅ:', convError);
                                    // Fallback to original with lower quality
                                    const fallbackAudio = await converter.toAudio(mediaBuffer, 'mp4');
                                    await conn.sendMessage(from, { 
                                        audio: fallbackAudio,
                                        mimetype: "audio/mpeg",
                                        fileName: `${sanitizedTitle}.mp3`
                                    }, { quoted: receivedMsg });
                                }
                                break;
                                
                            case "3":
                                // Voice note (PTT - convert to compressed OPUS)
                                try {
                                    const convertedPTT = await converter.toPTT(mediaBuffer, 'mp4', {
                                        bitrate: '64k', // Very low bitrate for voice
                                        frameSize: 20, // Smaller frame size
                                        complexity: 5 // Lower complexity
                                    });
                                    await conn.sendMessage(from, { 
                                        audio: convertedPTT,
                                        mimetype: "audio/ogg; codecs=opus",
                                        ptt: true,
                                        fileName: `${sanitizedTitle}.opus`
                                    }, { quoted: receivedMsg });
                                } catch (pttError) {
                                    console.error('PTT conversion failed:', pttError);
                                    // Fallback to regular compressed audio
                                    const fallbackPTT = await converter.toPTT(mediaBuffer, 'mp4');
                                    await conn.sendMessage(from, { 
                                        audio: fallbackPTT,
                                        ptt: true
                                    }, { quoted: receivedMsg });
                                }
                                break;
                                
                            case "4":
                                // Document (Video - no conversion needed)
                                await conn.sendMessage(from, { 
                                    document: mediaBuffer,
                                    mimetype: "video/mp4",
                                    fileName: `${sanitizedTitle}.mp4`
                                }, { quoted: receivedMsg });
                                break;
                                
                            case "5":
                                // Document (Audio - convert to compressed MP3)
                                try {
                                    const convertedAudio = await converter.toAudio(mediaBuffer, 'mp4', {
                                        bitrate: '96k',
                                        sampleRate: 22050,
                                        channels: 1
                                    });
                                    await conn.sendMessage(from, { 
                                        document: convertedAudio,
                                        mimetype: "audio/mpeg",
                                        fileName: `${sanitizedTitle}.mp3`
                                    }, { quoted: receivedMsg });
                                } catch (convError) {
                                    console.error('Audio conversion failed:', convError);
                                    // Fallback to original with lower quality
                                    const fallbackAudio = await converter.toAudio(mediaBuffer, 'mp4');
                                    await conn.sendMessage(from, { 
                                        document: fallbackAudio,
                                        mimetype: "audio/mpeg",
                                        fileName: `${sanitizedTitle}.mp3`
                                    }, { quoted: receivedMsg });
                                }
                                break;
                        }
                    } catch (error) {
                        console.error("ᴅᴏᴡɴʟᴏᴀᴅ ᴇʀʀᴏʀ:", error);
                        await conn.sendMessage(from, { 
                            text: "❌ ғᴀɪʟᴇᴅ ᴛᴏ ᴅᴏᴡɴʟᴏᴀᴅ. ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ." 
                        }, { quoted: receivedMsg });
                    }
                }
            };

            conn.ev.on("messages.upsert", replyHandler);

            // Set timeout to remove listener after 1 minute (silently)
            setTimeout(() => {
                if (!responded) {
                    conn.ev.off("messages.upsert", replyHandler);
                }
            }, 60000);

        } catch (e) {
            console.log(e);
            reply("An error occurred. Please try again later.");
        }
    }
);

