import { News } from "ntnu-notifier";

export async function send(news: News, webhook: string): Promise<boolean> {
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
