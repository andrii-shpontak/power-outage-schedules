import { getCachedFile, isCacheValid, saveCache } from "./services/cache";
import { sendToTelegram, startTelegramListener } from "./services/notifier";
import { getGraphImage } from "./services/scraper";

const run = async (): Promise<void> => {
  try {
    startTelegramListener(async (chatId: string, text: string) => {
      try {
        if (!chatId || typeof chatId !== "string") return;
        if (!text || typeof text !== "string") return;

        const cmd = text.trim().split(" ")[0].toLowerCase();
        if (cmd !== "/getgraph") return;

        if (isCacheValid(3600_000)) {
          const cached = getCachedFile();
          if (cached) {
            console.log("Using cached image");
            await sendToTelegram(cached, chatId).catch((err) =>
              console.error("Telegram send error:", err)
            );
            return;
          }
        }

        const filePath = await getGraphImage().catch((err) => {
          console.error("Scraper failed:", err);
          return null;
        });

        if (!filePath) return;

        saveCache({ filePath, timestamp: Date.now() });

        await sendToTelegram(filePath, chatId).catch((err) =>
          console.error("Telegram send error:", err)
        );
      } catch (err) {
        console.error("Listener error:", err);
      }
    });
  } catch (err) {
    console.error("Fatal error in run():", err);
  }
};

run();
