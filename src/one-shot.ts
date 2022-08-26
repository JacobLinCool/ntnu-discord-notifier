import { CsieNotifier, News } from "ntnu-notifier";
import { send } from "./send";

export async function one_shot(news: News[], webhook: string): Promise<News[]> {
    const notifier = new CsieNotifier(news);

    const updated = await notifier
        .on("init", () => console.log("Initialized!"))
        .on("notify", async (noti, news) => {
            await send(news, webhook);
            console.log("Sent.", news);
        })
        .start();

    notifier.stop();
    return updated;
}
