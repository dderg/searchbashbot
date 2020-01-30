require("dotenv").config({ path: ".env" });
const TelegramBot = require("node-telegram-bot-api");
const { performSearch } = require("./parser");

const token = process.env["TOKEN"];

const options = {
  webHook: {
    port: process.env.PORT
  }
};
const url = process.env.APP_URL || "https://<app-name>.herokuapp.com:443";
const bot = new TelegramBot(token, options);

bot.setWebHook(`${url}/bot${token}`);

bot.on("inline_query", async msg => {
  if (msg.query === "") {
    return;
  }

  const searchResults = await performSearch(msg.query);

  const messages = searchResults.slice(0, 10).map((quote, index) => {
    return {
      type: "article",
      id: index,
      title: quote.text,
      url: quote.url,
      hide_url: false,
      input_message_content: {
        message_text: quote.text
      }
    };
  });

  bot.answerInlineQuery(msg.id, messages);
});
