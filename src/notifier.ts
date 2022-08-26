import { config } from "dotenv";
import { CsieNotifier, News } from "ntnu-notifier";
import { mapping } from "file-mapping";
import { send } from "./send";

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

export { notifier };
