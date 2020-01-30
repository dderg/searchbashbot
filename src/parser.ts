import cheerio from "cheerio";
import request from "request-promise";

const htmlDecodeWithLineBreaks = (
  $: ReturnType<typeof cheerio.load>,
  html: string
) => {
  var breakToken = "_______break_______",
    lineBreakedHtml = html
      .replace(/<br\s?\/?>/gi, breakToken)
      .replace(/<p\.*?>(.*?)<\/p>/gi, breakToken + "$1" + breakToken);
  return $("<div>")
    .html(lineBreakedHtml)
    .text()
    .replace(new RegExp(breakToken, "g"), "\n");
};

export const performSearch = async (query: string): Promise<string[]> => {
  const result = await request(
    `https://bash.im/search?text=${encodeURI(query)}`
  );
  const $ = cheerio.load(result);

  return $(".quotes .quote")
    .slice(0, 10)
    .map((i, item) => {
      const html = $(item)
        .find(".quote__body")
        .html();

      return htmlDecodeWithLineBreaks($, html);
    })
    .get();
};
