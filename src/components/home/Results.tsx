import { getResults } from "@/sanity/lib/fetchers";
import HomeResultsClient from "./HomeResultsClient";

export default async function Results() {
  const results = await getResults();
  return <HomeResultsClient results={results} />;
}
