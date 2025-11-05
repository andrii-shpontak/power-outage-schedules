import { getGraphImage } from "./services/scraper";

const run = async (): Promise<void> => {
  await getGraphImage();
};

run();
