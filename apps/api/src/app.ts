import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { authRoutes } from "./modules/auth/routes";
import { userRoutes } from "./modules/users/routes";
import { groupRoutes } from "./modules/groups/routes";
import { trailRoutes } from "./modules/trails/routes";
import { missionRoutes } from "./modules/missions/routes";
import { eventRoutes } from "./modules/events/routes";
import { postRoutes } from "./modules/posts/routes";
import { leaderboardRoutes } from "./modules/leaderboard/routes";
import { analyticsRoutes } from "./modules/analytics/routes";

export function buildApp() {
    const app = Fastify({ logger: true });

    app.register(cors, { origin: true });
    app.register(jwt, { secret: process.env.JWT_SECRET ?? "dev-secret-change-me" });

    app.decorate("authenticate", async (request: any, reply: any) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.code(401).send({ error: "Não autorizado" });
        }
    });

    app.get("/health", async () => ({ status: "ok" }));

    app.register(authRoutes, { prefix: "/auth" });
    app.register(userRoutes, { prefix: "/users" });
    app.register(groupRoutes, { prefix: "/groups" });
    app.register(trailRoutes, { prefix: "/trails" });
    app.register(missionRoutes, { prefix: "/missions" });
    app.register(eventRoutes, { prefix: "/events" });
    app.register(postRoutes, { prefix: "/posts" });
    app.register(leaderboardRoutes, { prefix: "/leaderboard" });
    app.register(analyticsRoutes, { prefix: "/analytics" });

    return app;
}
