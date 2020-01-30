import dotenv from "dotenv";
import request from "request-promise";
import TelegramBot, { InlineQueryResultArticle } from "node-telegram-bot-api";
import { parseSearchPage } from "./parser/parser";

dotenv.config({ path: ".env" });

const token = process.env["TOKEN"];
const port = process.env["PORT"];
const url = process.env["APP_URL"];

const options = { webHook: { port: parseInt(port, 10) } };
const bot = new TelegramBot(token, options);

bot.setWebHook(`${url}/bot${token}`);

bot.on("inline_query", async msg => {
  if (msg.query === "") {
    return;
  }

  const html = await request(
    `https://bash.im/search?text=${encodeURI(msg.query)}`
  );
  const searchResults = parseSearchPage(html);

  const messages = searchResults.map((quote, index) => {
    const article: InlineQueryResultArticle = {
      type: "article",
      id: index.toString(),
      title: quote,
      input_message_content: {
        message_text: quote
      }
    };

    return article;
  });

  bot.answerInlineQuery(msg.id, messages);
});
