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
  test("200: returns an object with a review key with the review object", () => {
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

  test("404: returns id does not exist error when called a valid data type id that does not exist", () => {
    return request(app)
      .get("/api/reviews/1234")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Oh Dear, review_id does not exist!");
      });
  });

  test("400: returns bad request error message when called with wrong data type id", () => {
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

  test("404: returns id does not exist error when called with a valid data type id that does not exist", () => {
    const reqBody = { inc_votes: 2 };

    return request(app)
      .patch("/api/reviews/1234")
      .send(reqBody)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Oh Dear, review_id does not exist!");
      });
  });

  test("400: returns bad request error message when called with wrong data type id", () => {
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
  test("200: returns an object with a reviews key than has an array of review objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
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
});

describe("GET /api/reviews/:review_id/comments", () => {
  test.only("200: returns an array of comments for the given review_id", () => {
    return request(app)
      .get("/api/reviews/:review_id/comments")
      .expect(200)
      .then((res) => {
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
});
