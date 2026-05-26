import { getHomepageFaqs } from "@/sanity/lib/fetchers";
import FaqClient from "./FaqClient";

export default async function Faq() {
  const faqs = await getHomepageFaqs();
  return <FaqClient faqs={faqs} />;
}
