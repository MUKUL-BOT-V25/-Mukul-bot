 senderID = event.senderID;
    const credit = module.exports.config.credits;
  const waiting = await api.sendMessage("⏳𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁....", event.threadID);
 const apiConfigList = await getApiList(module.exports.config.name);
    const { imageBuffer, captionTemplate } = await generateFrameWithFallback({
      senderID,
      mention,
      credit,
      apiList: apiConfigList
    });
    const finalCaption = captionTemplate.replace(/{{name}}/g, mentionName);
    const outPath = path.join(__dirname, `friend3_${Date.now()}.png`);
    fs.writeFileSync(outPath, imageBuffer);
    await api.unsendMessage(waiting.messageID);
    const messageInfo = await api.sendMessage(
      {
        body: finalCaption,
        mentions: [{ tag: mentionName, id: mention }],
        attachment: fs.createReadStream(outPath)
      },
      event.threadID,
      event.messageID
    );
  setTimeout(async () => {
      try {
        await api.unsendMessage(messageInfo.messageID);
        fs.unlinkSync(outPath);
      } catch (e) {}
    }, 120000);

  } catch (error) {
    return api.sendMessage(`⚠️ ${error.message}`, event.threadID);
  }
};
