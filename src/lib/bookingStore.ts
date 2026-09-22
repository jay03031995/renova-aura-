/**
 * Private, on-device booking memory.
 *
 * Stores the patient(s) and their booking history in the browser's
 * localStorage so a returning visitor (on the same device/browser) gets their
 * details pre-filled and can see their appointments — with NO server lookup,
 * NO login, and no PII leaving the device. A single phone may have multiple
 * patients (e.g. family members), distinguished by name.
 */

export type SavedPatient = {
  name: string;
  phone: string;
  email?: string;
  age?: string;
};

export type SavedBooking = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  age?: string;
  concern?: string;
  clinic: string;
  date?: string;
  time?: string;
  createdAt: string;
};

type Store = { patients: SavedPatient[]; bookings: SavedBooking[] };

const KEY = "renovaaura.bookings.v1";
const EMPTY: Store = { patients: [], bookings: [] };

const norm = (p: { name: string; phone: string }) =>
  `${p.name.trim().toLowerCase()}|${p.phone.replace(/\D/g, "")}`;

function read(): Store {
  if (typeof window === "undefined") return { ...EMPTY };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw) as Partial<Store>;
    return {
      patients: parsed.patients ?? [],
      bookings: parsed.bookings ?? [],
    };
  } catch {
    return { ...EMPTY };
  }
}

function write(s: Store) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* quota / private mode — ignore, the form still works */
  }
}

/** Patients saved on this device, most-recently-used last. */
export function getPatients(): SavedPatient[] {
  return read().patients;
}

/** Bookings saved on this device, soonest upcoming first. */
export function getBookings(): SavedBooking[] {
  return read().bookings.slice().sort((a, b) => {
    const da = `${a.date ?? ""} ${a.time ?? ""}`;
    const db = `${b.date ?? ""} ${b.time ?? ""}`;
    return da.localeCompare(db);
  });
}

/** Record a successful booking + upsert its patient. */
export function saveBooking(
  b: Omit<SavedBooking, "id" | "createdAt">,
): void {
  const s = read();
  s.bookings.unshift({
    ...b,
    id: Math.random().toString(36).slice(2, 10),
    createdAt: new Date().toISOString(),
  });
  const existing = s.patients.find((p) => norm(p) === norm(b));
  if (existing) {
    existing.email = b.email || existing.email;
    existing.age = b.age || existing.age;
    // bump to most-recently-used (end of list)
    s.patients = s.patients.filter((p) => p !== existing).concat(existing);
  } else {
    s.patients.push({ name: b.name, phone: b.phone, email: b.email, age: b.age });
  }
  write(s);
}
