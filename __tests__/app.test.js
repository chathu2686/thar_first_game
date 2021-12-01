const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app");
const request = require("supertest");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/categories", () => {
  test("200: returns an array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        expect(res.body.categories).toHaveLength(4);
        res.body.categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("200: returns a review object", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then((res) => {
        expect(res.body.review).toEqual(
          expect.objectContaining({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          })
        );
      });
  });

  test("404: returns error message when called a valid data but non-existent review id", () => {
    return request(app)
      .get("/api/reviews/1234")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Oh Dear, review_id does not exist!");
      });
  });

  test("400: returns error message when called with review id of wrong data type", () => {
    return request(app)
      .get("/api/reviews/bananas")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Oh Dear, bad request!");
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("201: returns returns updated review object", () => {
    const reqBody = { inc_votes: 2 };
    return request(app)
      .patch("/api/reviews/2")
      .send(reqBody)
      .expect(201)
      .then((res) => {
        expect(res.body.updatedReview.votes).toBe(7);
      });
  });

  test("404: returns error message when called with a valid but non-existent review id", () => {
    const reqBody = { inc_votes: 2 };

    return request(app)
      .patch("/api/reviews/1234")
      .send(reqBody)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Oh Dear, review_id does not exist!");
      });
  });

  test("400: returns bad request error message when called with a review id of wrong data type", () => {
    const reqBody = { inc_votes: 2 };

    return request(app)
      .patch("/api/reviews/bananas")
      .send(reqBody)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Oh Dear, bad request!");
      });
  });

  test("422: returns error message when called with a request body that contains incorrect data type", () => {
    const reqBody = { inc_votes: "banana" };

    return request(app)
      .patch("/api/reviews/1")
      .send(reqBody)
      .expect(422)
      .then((res) => {
        expect(res.body.msg).toBe(
          "Oh Dear, inc_votes needs to be a positive whole number!"
        );
      });
  });

  test("422: returns error message when called with a request body that contains a number which is a float number", () => {
    const reqBody = { inc_votes: "2.5" };

    return request(app)
      .patch("/api/reviews/1")
      .send(reqBody)
      .expect(422)
      .then((res) => {
        expect(res.body.msg).toBe(
          "Oh Dear, inc_votes needs to be a positive whole number!"
        );
      });
  });
});

describe("GET /api/reviews", () => {
  test("200: returns an array of review objects ordered by date(created_at) Descending by default", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });

        expect(res.body.reviews).toHaveLength(13);
        res.body.reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });

  test.only("200: returns an array of review objects ordered by date(created_at) Descending by default", () => {
    return request(app)
      .get(
        "/api/reviews?sort_by=review_id&&order=ASC&&category=social deduction"
      )
      .expect(200)
      .then((res) => console.log(res.body.reviews));
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("200: returns an array of comments for the given review_id", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toHaveLength(3);
        res.body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });

  test("200: returns empty array when there are no comments for the given review id", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toEqual([]);
      });
  });

  test("400: returns bad request error message when called with a review id of the wrong data type", () => {
    return request(app)
      .get("/api/reviews/banana/comments")
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe("Oh Dear, bad request!");
      });
  });

  test("404: returns error message when called with a valid but non-existent review_id", () => {
    return request(app)
      .get("/api/reviews/1234/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Oh Dear, review_id does not exist!");
      });
  });
});

// describe.only("POST /api/reviews/:review_id/comments", () => {
//   test("201: response with new comment object", () => {
//     const reqBody = {
//       username: "bainesface",
//       body: "well done! nice comment :D",
//     };

//     return request(app).post("/api/reviews/4/comments").send(request);
//   });
// });
