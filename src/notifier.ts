import { config } from "dotenv";
import { CsieNotifier, News } from "ntnu-notifier";
import { mapping } from "file-mapping";

config();

const WEBHOOK_URL = process.env.WEBHOOK_URL;

if (!WEBHOOK_URL) {
    throw new Error("env var WEBHOOK_URL is needed");
}

const notifier = new CsieNotifier(mapping("store.json", []))
    .on("init", () => console.log("Initialized!"))
    .on("notify", async (noti, news) => {
        await send(news, WEBHOOK_URL);
        console.log("Sent.", news);
    });

async function send(news: News, webhook: string) {
    const { ok } = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            content: null,
            embeds: [
                {
                    title: news.title,
                    color: 1146518,
                    description: `[**${news.title}**](${news.url})\n${(news.type || []).join(
                        " | ",
                    )}`,
                },
            ],
        }),
    });
    return ok;
}

export { notifier };
