import axios from "axios";
import dotenv from "dotenv";
import FormData from "form-data";
import fs from "fs";

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_TOKEN;

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN missing");
}

const API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

export const sendToTelegram = async (
  filePath: string,
  chatId: string
): Promise<void> => {
  const url = `${API_BASE}/sendPhoto`;
  const form = new FormData();
  form.append("chat_id", chatId);
  form.append("photo", fs.createReadStream(filePath));
  await axios.post(url, form, { headers: form.getHeaders() });
};

export const startTelegramListener = (
  handler: (chatId: string, text: string) => Promise<void>
) => {
  let offset = 0;
  let running = true;

  const poll = async () => {
    if (!running) return;
    try {
      const res = await axios.get(`${API_BASE}/getUpdates`, {
        params: { timeout: 30, offset },
      });
      const updates = res.data?.result ?? [];
      for (const u of updates) {
        offset = Math.max(offset, (u.update_id ?? 0) + 1);
        const msg = u.message ?? u.channel_post;
        if (!msg) continue;
        const chatId = String(msg.chat.id);
        const text = msg.text ?? "";
        handler(chatId, text).catch((err) =>
          console.error("handler error:", err)
        );
      }
    } catch (err) {
      console.error("poll error:", (err as Error).message);
    } finally {
      setTimeout(poll, 1000);
    }
  };

  poll();

  return () => {
    running = false;
  };
};
