import { CLINIC, telHref, waHref } from "@/data/clinic";
import { Phone, Bag } from "@/components/icons";

export default function FabStack() {
  const wa = waHref("Hi Dermaheal, I'd like to book a consultation.");

  return (
    <div className="fab-stack">
      <a
        className="fab fab-shop"
        href={CLINIC.shopUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Shop"
      >
        <Bag /> <span>Shop</span>
      </a>
      <a
        className="fab fab-call fab-pulse"
        href={telHref()}
        aria-label={`Call ${CLINIC.phone}`}
      >
        <Phone size={20} stroke={2} />
        <span className="fab-tip">Call {CLINIC.phone}</span>
      </a>
      <a
        className="fab fab-wa"
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
      >
        <img src="/whatsapp-icon.png" alt="" />
        <span className="fab-tip">Chat on WhatsApp</span>
      </a>
    </div>
  );
}
