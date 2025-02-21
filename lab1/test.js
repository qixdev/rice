const request = require("supertest");
const jwt = require("jsonwebtoken");
const { app, getUserData, JWT_SECRET } = require("./app");

describe("Profile API tests", () => {
    let validToken;

    beforeAll(() => {
        validToken = jwt.sign(getUserData(), JWT_SECRET, { expiresIn: "1h" });
    });

    test("Call /api/profile with a valid token -> should return the user’s info", async () => {
        const response = await request(app)
            .get("/api/profile")
            .set("Cookie", [`jwt=${validToken}`]);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(getUserData());
    });

    test("Call /api/profile with a missing token -> should return an error", async () => {
        const response = await request(app).get("/api/profile");

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("error", "Invalid token");
    });

    test("Call /api/profile with an invalid token -> should return an error", async () => {
        const response = await request(app)
            .get("/api/profile")
            .set("Cookie", [`jwt=invalid_token`]);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("error", "Invalid token");
    });
});
