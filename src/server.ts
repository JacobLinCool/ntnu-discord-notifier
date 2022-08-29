import express from "express";
import { notifier } from "./notifier";

const PORT = Number(process.env.PORT) || 3000;
const START_AT = new Date();

const logs: [Date, string][] = [];

notifier
    .on("init", () => {
        logs.push([new Date(), "Initialized!"]);
    })
    .on("first", () => {
        logs.push([new Date(), "First shot!"]);
    })
    .on("notify", (noti, news) => {
        logs.push([new Date(), `Sent. ${news.id}`]);
    });

express()
    .use(express.json())
    .get("/logs", (req, res) => {
        res.json(logs);
    })
    .get("/", (req, res) => {
        res.send({
            msg: `Server started at ${START_AT}`,
            logs: `${req.protocol}://${req.get("host")}/logs`,
        });
    })
    .listen(PORT, () => {
        console.log("Server started at", START_AT);
        notifier.start();
    });
