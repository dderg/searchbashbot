const cheerio = require("cheerio");
const request = require("request-promise");

function htmlDecodeWithLineBreaks($, html) {
  var breakToken = "_______break_______",
    lineBreakedHtml = html
      .replace(/<br\s?\/?>/gi, breakToken)
      .replace(/<p\.*?>(.*?)<\/p>/gi, breakToken + "$1" + breakToken);
  return $("<div>")
    .html(lineBreakedHtml)
    .text()
    .replace(new RegExp(breakToken, "g"), "\n");
}

module.exports.performSearch = async query => {
  console.log(query);
  const result = await request(
    `https://bash.im/search?text=${encodeURI(query)}`
  );
  const $ = cheerio.load(result);

  return $(".quotes .quote")
    .map((i, item) => {
      const html = $(item)
        .find(".quote__body")
        .html();

      return htmlDecodeWithLineBreaks($, html);
    })
    .get();
};
