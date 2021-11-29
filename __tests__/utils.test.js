const { dataFormatter } = require("../utils/utils");

describe("dataFormatter", () => {
  test("takes return an empty array when called with empty array and no key arguments", () => {
    expect(dataFormatter([])).toEqual([]);
  });

  test("returns an array with a single element array when called with array with single element and valid key arguments", () => {
    const input1 = [
      {
        body: "I loved this game too!",
        votes: 16,
        author: "happyamy2016",
        review_id: 2,
        created_at: new Date(1511354163389),
      },
    ];

    const input2 = "author";
    const input3 = "votes";

    const actual = dataFormatter(input1, input2, input3);

    const expected = [["happyamy2016", 16]];

    expect(actual).toEqual(expected);
  });

  test("returns an array with multiple array elements when called with multi element array and valid key arguments", () => {
    const input1 = [
      {
        body: "I loved this game too!",
        votes: 16,
        author: "happyamy2016",
        review_id: 2,
        created_at: new Date(1511354163389),
      },
      {
        body: "My dog loved this game too!",
        votes: 3,
        author: "tickle122",
        review_id: 4,
        created_at: new Date(1610964545410),
      },
      {
        body: "I didn't know dogs could play games",
        votes: 10,
        author: "weegembump",
        review_id: 4,
        created_at: new Date(1610964588110),
      },
      {
        body: "EPIC board game!",
        votes: 16,
        author: "tickle122",
        review_id: 2,
        created_at: new Date(1511354163389),
      },
    ];

    const input2 = "author";
    const input3 = "votes";
    const input4 = "body";

    const actual = dataFormatter(input1, input2, input3, input4);

    expect(actual).toHaveLength(4);

    actual.forEach((elem) => {
      expect(elem).toEqual(
        expect.arrayContaining([
          expect.any(String),
          expect.any(Number),
          expect.any(String),
        ])
      );
    });
  });
});
