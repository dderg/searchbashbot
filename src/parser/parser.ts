import cheerio from "cheerio";

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

export const parseSearchPage = (html: string): string[] => {
  const $ = cheerio.load(html);

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
