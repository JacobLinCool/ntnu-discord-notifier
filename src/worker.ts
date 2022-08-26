import { News } from "ntnu-notifier";
import { one_shot } from "./one-shot";

export default {
    async fetch(
        request: Request,
        environment: { kv: KVNamespace; WEBHOOK_URL?: string },
        context: ExecutionContext,
    ): Promise<Response> {
        try {
            const { WEBHOOK_URL, kv } = environment;
            if (!WEBHOOK_URL) {
                throw new Error("env var WEBHOOK_URL is needed");
            }

            const news: News[] = (await kv.get("news", "json")) || [];
            const updated = await one_shot(news, WEBHOOK_URL);
            if (updated.length > 0) {
                context.waitUntil(kv.put("news", JSON.stringify(news)));
            }

            return new Response(JSON.stringify(updated), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (err) {
            console.error(err);
            return new Response((<Error>err).message, {
                status: 500,
                headers: { "Content-Type": "text/plain" },
            });
        }
    },
    async scheduled(
        controller: ScheduledController,
        environment: { kv: KVNamespace; WEBHOOK_URL?: string },
        context: ExecutionContext,
    ): Promise<void> {
        try {
            const { WEBHOOK_URL, kv } = environment;
            if (!WEBHOOK_URL) {
                throw new Error("env var WEBHOOK_URL is needed");
            }

            const news: News[] = (await kv.get("news", "json")) || [];
            const updated = await one_shot(news, WEBHOOK_URL);
            if (updated.length > 0) {
                await kv.put("news", JSON.stringify(news));
            }
        } catch (err) {
            console.error(err);
        }
    },
};
