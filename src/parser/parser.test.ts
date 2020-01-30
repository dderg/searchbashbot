import fs from "fs";
import { parseSearchPage } from "./parser";

const searchPageExample = fs.readFileSync(
  __dirname + "/searchPageExample.html",
  "utf-8"
);

describe("parser", () => {
  describe("parseSearchPage", () => {
    it("Should work", () => {
      const result = parseSearchPage(searchPageExample);
      expect(result.length).toBe(5);
      expect(result[0]).toBe(
        "\n" +
          '      ххх: Есть выражение такое "Ничто не истина, все дозволено". Кто его автор?\n' +
          "ууу: Не знаю. Загугли.\n" +
          "ххх: Кто?\n" +
          "ууу: Загугли.\n" +
          "zzz: Это философ такой – Загугли. Автор 99% цитат в Интернетах.\n" +
          "ххх: LOL.\n" +
          "          "
      );
    });
  });
});
