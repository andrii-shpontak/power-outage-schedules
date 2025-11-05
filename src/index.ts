import { getGraphImage } from "./services/scraper";

const run = async (): Promise<void> => {
  try {
    await getGraphImage();
  } catch (error) {
    console.error("🚀 -----------------------🚀");
    console.error("🚀 ~ run ~ error:", error);
    console.error("🚀 -----------------------🚀");
  }
};

run();
