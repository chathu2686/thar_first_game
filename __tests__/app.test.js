const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app");
const request = require("supertest");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api", () => {
  test("serves up a json representation of all the available endpoints of the api", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        expect(typeof res.body).toBe("object");
      });
  });
});

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

describe("POST /api/categories", () => {
  test("201: creates and returns new category object", () => {
    const reqBody = {
      slug: "puzzles",
      description: "jigsaws etc",
    };

    return request(app)
      .post("/api/categories")
      .send(reqBody)
      .expect(201)
      .then((res) => {
        expect(res.body.newCategory).toEqual({
          slug: "puzzles",
          description: "jigsaws etc",
        });
      });
  });

  test("201: creates and returns new category object while ignoring unnecessary properties from request body", () => {
    const reqBody = {
      slug: "puzzles",
      description: "jigsaws etc",
      fruit: `bananas`,
    };

    return request(app)
      .post("/api/categories")
      .send(reqBody)
      .expect(201)
      .then((res) => {
        expect(res.body.newCategory).toEqual({
          slug: "puzzles",
          description: "jigsaws etc",
        });
      });
  });

  test("400: returns error message if slug or description is missing", () => {
    const reqBody = {
      slug: "puzzles",
    };

    return request(app)
      .post("/api/categories")
      .send(reqBody)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Oh Dear, category information incomplete!");
      });
  });
});

describe("GET /api/users", () => {
  test("200: returns an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        expect(res.body.users).toHaveLength(4);

        res.body.users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              avatar_url: expect.any(String),
              name: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/reviews", () => {
  test("returns an array of review objects and total count key", () => {
    return request(app)
      .get("/api/reviews?category")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toHaveLength(10);
        expect(res.body.total_count).toBe(13);
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

  test("200: returns an array of sorted review objects", () => {
    return request(app)
      .get("/api/reviews?sort_by=review_id")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy("review_id", {
          descending: true,
        });
      });
  });

  test("400: returns error message if sort_by input is invalid", () => {
    return request(app)
      .get("/api/reviews?sort_by=not_a_column")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Oh Dear, Invalid sort_by value!");
      });
  });

  test("200: returns an arr of sorted review objects by queried order value", () => {
    return request(app)
      .get("/api/reviews?sort_by=review_id&order=asc")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy("review_id", {
          descending: false,
        });
      });
  });

  test("400: returns error message when order input is invalid", () => {
    return request(app)
      .get("/api/reviews?sort_by=review_id&order=banana")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Oh Dear, Invalid order value!");
      });
  });

  test("200: returns an array of review objects belonging to the queried category", () => {
    return request(app)
      .get("/api/reviews?category=social deduction")
      .expect(200)
      .then((res) => {
        res.body.reviews.forEach((review) => {
          expect(review.category).toBe("social deduction");
        });
      });
  });

  test("200: returns an empty array when there are no reviews present for the queried category", () => {
    return request(app)
      .get("/api/reviews?category=children's games")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toHaveLength(0);
      });
  });

  test("404: returns error message when called with a non-existent category query", () => {
    return request(app)
      .get("/api/reviews?category=bananas")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Oh Dear, category does not exist!");
      });
  });

  test("200: returns returns an array of review objects limited to queried limit amount ", () => {
    return request(app)
      .get("/api/reviews?limit=5")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toHaveLength(5);
      });
  });

  test("400: returns error message when limit query is invalid", () => {
    return request(app)
      .get("/api/reviews?limit=banana")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Oh Dear, bad request!");
      });
  });

  test("200: returns an array containing the queried page of reviews", () => {
    return request(app)
      .get("/api/reviews?sort_by=review_id&order=asc&p=2")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toHaveLength(3);
        expect(res.body.reviews[0].review_id).toBe(11);
        expect(res.body.reviews[2].review_id).toBe(13);
      });
  });

  test("400: returns error message when page value is incorrect data type", () => {
    return request(app)
      .get("/api/reviews?sort_by=review_id&order=asc&p=banana")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Oh Dear, bad request!");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: returns the valid users object", () => {
    return request(app)
      .get("/api/users/dav3rid")
      .expect(200)
      .then((res) => {
        expect(res.body.user).toEqual(
          expect.objectContaining({
            username: expect.any(String),
            avatar_url: expect.any(String),
            name: expect.any(String),
          })
        );
      });
  });

  test("404: returns error message for invalid username", () => {
    return request(app)
      .get("/api/users/notausername")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toEqual("Oh Dear, user does not exist!");
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
  test("200: returns returns updated review object when new votes is a positive number", () => {
    const reqBody = { inc_votes: 2 };
    return request(app)
      .patch("/api/reviews/2")
      .send(reqBody)
      .expect(200)
      .then((res) => {
        expect(res.body.updatedReview).toEqual({
          review_id: 2,
          title: "Jenga",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Fiddly fun for all the family",
          category: "dexterity",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 7,
        });
      });
  });

  test("200: returns returns updated review object when new votes is a negative number", () => {
    const reqBody = { inc_votes: -2 };
    return request(app)
      .patch("/api/reviews/2")
      .send(reqBody)
      .expect(200)
      .then((res) => {
        expect(res.body.updatedReview).toEqual({
          review_id: 2,
          title: "Jenga",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Fiddly fun for all the family",
          category: "dexterity",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 3,
        });
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

  test("200: returns non-updated review object when inc-votes key is missing from request body", () => {
    const reqBody = {};
    return request(app)
      .patch("/api/reviews/2")
      .send(reqBody)
      .expect(200)
      .then((res) => {
        expect(res.body.updatedReview).toEqual({
          review_id: 2,
          title: "Jenga",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Fiddly fun for all the family",
          category: "dexterity",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 5,
        });
      });
  });

  test("400: returns error message when called with a request body that contains incorrect data type", () => {
    const reqBody = { inc_votes: 2.5 };

    return request(app)
      .patch("/api/reviews/1")
      .send(reqBody)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Oh Dear, bad request!");
      });
  });

  test("400: returns error message when called with a request body that contains a number which is a float number", () => {
    const reqBody = { inc_votes: "2.5" };

    return request(app)
      .patch("/api/reviews/1")
      .send(reqBody)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Oh Dear, bad request!");
      });
  });
});

describe("DELETE /api/review/:review_id", () => {
  test("204 deletes the correct review and returns no content", () => {
    return request(app).delete("/api/reviews/2").expect(204);
  });

  test("404: returns error message when called with valid but non-existent review id", () => {
    return request(app)
      .delete("/api/reviews/1234")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Oh Dear, review_id does not exist!");
      });
  });

  test("400: returns bad request error message when called with review id of invalid data", () => {
    return request(app)
      .delete("/api/reviews/nomnom")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Oh Dear, bad request!");
      });
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

  test("200: returns a limited array of comment object when called with limit query", () => {
    return request(app)
      .get("/api/reviews/3/comments?limit=2")
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toHaveLength(2);
      });
  });

  test("200: returns a limited array of comment objects when called with valid page number", () => {
    return request(app)
      .get("/api/reviews/3/comments?limit=2&p=2")
      .expect(200)
      .then((res) => {
        expect(res.body.comments[0]).toEqual({
          comment_id: 6,
          body: "Not sure about dogs, but my cat likes to get involved with board games, the boxes are their particular favourite",
          votes: 10,
          author: "philippaclaire9",
          created_at: "2021-03-27T19:49:48.110Z",
        });
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

  test("400: returns bad request error message when called with an invalid limit", () => {
    return request(app)
      .get("/api/reviews/3/comments?limit=bananas")
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe("Oh Dear, bad request!");
      });
  });

  test("400: returns bad request error message when called with an invalid page number", () => {
    return request(app)
      .get("/api/reviews/3/comments?limit=2&p=mango")
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe("Oh Dear, bad request!");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("201: response with new comment object", () => {
    const reqBody = {
      username: "bainesface",
      body: "well done! nice comment :D",
    };

    return request(app)
      .post("/api/reviews/4/comments")
      .send(reqBody)
      .expect(201)
      .then((res) => {
        expect(res.body.comment).toEqual(
          expect.objectContaining({
            author: "bainesface",
            body: "well done! nice comment :D",
            review_id: 4,
            votes: 0,
            comment_id: 7,
            created_at: expect.any(String),
          })
        );
      });
  });

  test("404: returns error message if review id is valid but non-existent", () => {
    const reqBody = {
      username: "bainesface",
      body: "well done! nice comment :D",
    };

    return request(app)
      .post("/api/reviews/124/comments")
      .send(reqBody)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe(
          'Oh Dear, id does not exist! Key (review_id)=(124) is not present in table "reviewdata".'
        );
      });
  });

  test("400: returns error message if review id is incorrect data type", () => {
    const reqBody = {
      username: "bainesface",
      body: "well done! nice comment :D",
    };

    return request(app)
      .post("/api/reviews/bananas/comments")
      .send(reqBody)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Oh Dear, bad request!");
      });
  });

  test("201: posts and returns new comment object while ignoring unnecessary properties from request body", () => {
    const reqBody = {
      username: "bainesface",
      body: "well done! nice comment :D",
      fruit: "bananas",
    };

    return request(app)
      .post("/api/reviews/4/comments")
      .send(reqBody)
      .expect(201)
      .then((res) => {
        expect(res.body.comment).toEqual(
          expect.objectContaining({
            author: "bainesface",
            body: "well done! nice comment :D",
            review_id: 4,
            votes: 0,
            comment_id: 7,
            created_at: expect.any(String),
          })
        );
      });
  });

  test("400: returns error message if username or body is missing from comment", () => {
    const reqBody = {
      username: "bainesface",
    };
    return request(app)
      .post("/api/reviews/3/comments")
      .send(reqBody)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Oh Dear, comment is incomeplete!");
      });
  });

  test("400: returns error message if request body has non-existent username", () => {
    const reqBody = {
      username: "helloo",
      body: "well done! nice comment :D",
    };

    return request(app)
      .post("/api/reviews/1/comments")
      .send(reqBody)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Oh Dear, username does not exist!");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: deletes comment and returns 204 status code ", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });

  test("404: returns error message when called with valid but non-existent comment id", () => {
    return request(app)
      .delete("/api/comments/123")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Oh Dear, comment id does not exist!");
      });
  });

  test("400: returns error message when called with comment id of incorrect data type", () => {
    return request(app)
      .delete("/api/comments/bananas")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Oh Dear, bad request!");
      });
  });
});

describe("Patch /api/comments/:comment_id", () => {
  test("200: updates comment and returns updated comment when id is valid and new vote is a positive number", () => {
    const reqBody = { inc_votes: 2 };

    return request(app)
      .patch("/api/comments/2")
      .send(reqBody)
      .expect(200)
      .then((res) => {
        expect(res.body.updatedComment.votes).toBe(15);

        expect(res.body.updatedComment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            author: expect.any(String),
            review_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            body: expect.any(String),
          })
        );
      });
  });

  test("200: updates comment and returns updated comment when id is valid and new vote is a negative number", () => {
    const reqBody = { inc_votes: -2 };

    return request(app)
      .patch("/api/comments/1")
      .send(reqBody)
      .expect(200)
      .then((res) => {
        expect(res.body.updatedComment.votes).toBe(14);

        expect(res.body.updatedComment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            author: expect.any(String),
            review_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            body: expect.any(String),
          })
        );
      });
  });

  test("404: returns error message when called with valid but non-existent comment id", () => {
    const reqBody = { inc_votes: 2 };

    return request(app)
      .patch("/api/comments/122")
      .send(reqBody)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toEqual("Oh Dear, comment id does not exist!");
      });
  });

  test("400: returns error message when called comment id of wrong data type", () => {
    const reqBody = { inc_votes: 2 };

    return request(app)
      .patch("/api/comments/banana")
      .send(reqBody)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toEqual("Oh Dear, bad request!");
      });
  });

  test("400: returns error message when called with a request body that contains incorrect data type", () => {
    const reqBody = { inc_votes: "banana" };

    return request(app)
      .patch("/api/comments/banana")
      .send(reqBody)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toEqual("Oh Dear, bad request!");
      });
  });

  test("200: returns comment object with votes remaining unchanged when inc_votes is missing from request body", () => {
    const reqBody = {};

    return request(app)
      .patch("/api/comments/1")
      .send(reqBody)
      .expect(200)
      .then((res) => {
        expect(res.body.updatedComment).toEqual({
          comment_id: 1,
          body: "I loved this game too!",
          votes: 16,
          author: "bainesface",
          review_id: 2,
          created_at: "2017-11-22T12:43:33.389Z",
        });
      });
  });
});
