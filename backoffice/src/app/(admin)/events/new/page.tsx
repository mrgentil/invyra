import Link from "next/link";
import { redirect } from "next/navigation";
import { EventForm } from "@/components/admin/EventForm";
import { EventImageUploader } from "@/components/admin/EventImageUploader";
import { GuardedSubmit } from "@/components/admin/GuardedSubmit";
import { SearchSelect } from "@/components/admin/SearchSelect";
import { PageHeader } from "@/components/admin/PageHeader";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { slugify } from "@/lib/slug";

export default async function NewEventPage() {
  const supabase = getSupabaseAdmin();
  const [{ data: categories }, { data: organizers }] = await Promise.all([
    supabase.from("categories").select("id,name").order("name", { ascending: true }),
    supabase.from("organizers").select("id,name").order("name", { ascending: true }),
  ]);
  const categoryOptions = (categories ?? []).map((c) => ({ value: c.id, label: c.name }));
  const organizerOptions = (organizers ?? []).map((o) => ({ value: o.id, label: o.name }));
  const cityOptions = RDC_LOCATIONS.map((c) => ({ value: c, label: c }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nouvel événement"
        description="Créer un événement dans Supabase."
      />

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
        <EventForm action={createEvent}>
          <Field name="title" label="Titre" placeholder="Concert Afro Night" required />
          <div>
            <label className="text-sm font-medium text-zinc-800">Slug (auto)</label>
            <input
              name="slug"
              placeholder="auto si vide"
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="md:col-span-2">
            <SearchSelect
              name="city"
              label="Ville / Province (RDC)"
              placeholder="Tape pour rechercher…"
              options={cityOptions}
              required
              allowCustomValue
            />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-800">Code ville (auto)</label>
            <input
              name="city_id"
              placeholder="auto si vide"
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <Field name="location_name" label="Lieu" placeholder="Stade des Martyrs" required className="md:col-span-2" />
          <Field name="location_address" label="Adresse" placeholder="Av. de la Nation" required className="md:col-span-2" />
          <div className="md:col-span-2 rounded-2xl border border-zinc-200/70 bg-zinc-50/40 p-4">
            <p className="text-sm font-medium text-zinc-800">Carte</p>
            <p className="mt-1 text-sm text-zinc-500">
              Après création, la page “Modifier” affichera un aperçu de la carte avec l’adresse.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-800">Date & heure</label>
            <input
              name="event_date"
              type="datetime-local"
              required
              className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Field name="time_label" label="Affichage heure" placeholder="20h00" required />

          <Field name="price" label="Prix" placeholder="0" required />
          <div>
            <label className="text-sm font-medium text-zinc-800">Devise</label>
            <select
              name="currency"
              defaultValue="USD"
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="USD">USD</option>
              <option value="CDF">CDF</option>
              <option value="EUR">EUR</option>
            </select>
          </div>

          <div>
            <SearchSelect
              name="organizer_id"
              label="Organisateur"
              placeholder="Tape pour rechercher…"
              options={organizerOptions}
              required
            />
          </div>
          <div>
            <SearchSelect
              name="category_id"
              label="Catégorie"
              placeholder="Tape pour rechercher…"
              options={categoryOptions}
              required
            />
          </div>

          <div className="md:col-span-2">
            <EventImageUploader slugOrId="draft" />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-zinc-800">Description</label>
            <textarea
              name="description"
              required
              rows={5}
              className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Description complète..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 md:col-span-2">
            <Link
              href="/events"
              className="rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
            >
              Annuler
            </Link>
            <GuardedSubmit
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              pendingLabel="Création…"
            >
              Créer
            </GuardedSubmit>
          </div>
        </EventForm>
      </div>
    </div>
  );
}

async function createEvent(formData: FormData) {
  "use server";

  const supabase = getSupabaseAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const cityId = String(formData.get("city_id") ?? "").trim() || slugify(city);
  const slug = String(formData.get("slug") ?? "").trim() || slugify(title);
  const locationName = String(formData.get("location_name") ?? "").trim();
  const locationAddress = String(formData.get("location_address") ?? "").trim();
  const eventDateRaw = String(formData.get("event_date") ?? "").trim();
  const eventDate = eventDateRaw ? new Date(eventDateRaw).toISOString() : "";
  const timeLabel = String(formData.get("time_label") ?? "").trim();
  const price = Number(String(formData.get("price") ?? "0"));
  const currency = String(formData.get("currency") ?? "USD").trim() || "USD";
  const organizerId = String(formData.get("organizer_id") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim();

  const coverUrlInput = String(formData.get("cover_url") ?? "").trim();
  const galleryUrlInputs = String(formData.get("gallery_urls") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const images = [coverUrlInput, ...galleryUrlInputs].filter(Boolean);

  const { data, error } = await supabase
    .from("events")
    .insert({
      title,
      slug,
      description,
      short_description: description.slice(0, 140),
      images,
      category_id: categoryId,
      organizer_id: organizerId,
      event_date: eventDate,
      time_label: timeLabel,
      location_name: locationName,
      location_address: locationAddress,
      latitude: 0,
      longitude: 0,
      city_id: cityId,
      city,
      province: city,
      price: isNaN(price) ? 0 : price,
      currency,
      capacity: 100,
      attendees: 0,
      tags: [],
      featured: false,
      trending: false,
      status: "upcoming",
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/events/${slug || data.id}`);
}

function Field({
  name,
  label,
  placeholder,
  required,
  className,
}: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-zinc-800">{label}</label>
      <input
        name={name}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}

const RDC_LOCATIONS = [
  "Kinshasa",
  "Kongo Central",
  "Kwango",
  "Kwilu",
  "Mai-Ndombe",
  "Kasaï",
  "Kasaï Central",
  "Kasaï Oriental",
  "Lomami",
  "Sankuru",
  "Haut-Katanga",
  "Haut-Lomami",
  "Lualaba",
  "Tanganyika",
  "Bas-Uele",
  "Haut-Uele",
  "Ituri",
  "Tshopo",
  "Nord-Kivu",
  "Sud-Kivu",
  "Maniema",
  "Nord-Ubangi",
  "Sud-Ubangi",
  "Mongala",
  "Équateur",
  "Tshuapa",
] as const;
