import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AddressMapPreview } from "@/components/admin/AddressMapPreview";
import { EventForm } from "@/components/admin/EventForm";
import { EventImageUploader } from "@/components/admin/EventImageUploader";
import { GuardedSubmit } from "@/components/admin/GuardedSubmit";
import { PageHeader } from "@/components/admin/PageHeader";
import { SearchSelect } from "@/components/admin/SearchSelect";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { slugify } from "@/lib/slug";

export default async function EditEventBySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = getSupabaseAdmin();

  const [{ data: event, error }, { data: categories }, { data: organizers }] = await Promise.all([
    supabase
      .from("events")
      .select(
        "id,title,slug,description,images,city,province,city_id,location_name,location_address,event_date,time_label,price,currency,featured,trending,status,category_id,organizer_id"
      )
      .eq("slug", slug)
      .maybeSingle(),
    supabase.from("categories").select("id,name").order("name", { ascending: true }),
    supabase.from("organizers").select("id,name").order("name", { ascending: true }),
  ]);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-900">
        Erreur Supabase: {error.message}
      </div>
    );
  }

  if (!event) return notFound();

  const toDateTimeLocal = (iso: string) => {
    const d = new Date(iso);
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  };

  const categoryOptions = (categories ?? []).map((c) => ({ value: c.id, label: c.name }));
  const organizerOptions = (organizers ?? []).map((o) => ({ value: o.id, label: o.name }));
  const cityOptions = RDC_LOCATIONS.map((c) => ({ value: c, label: c }));

  return (
    <div className="space-y-6">
      <PageHeader title="Modifier l'événement" description={event.title} />

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
        <EventForm action={updateEventBySlug}>
          <input type="hidden" name="id" value={event.id} />
          <input type="hidden" name="slug_param" value={slug} />

          <Field name="title" label="Titre" defaultValue={event.title} required />
          <Field name="slug" label="Slug" defaultValue={event.slug ?? ""} placeholder="auto si vide" />

          <SearchSelect
            name="city"
            label="Ville / Province (RDC)"
            placeholder="Tape pour rechercher…"
            options={cityOptions}
            defaultValue={event.city}
            required
            allowCustomValue
          />
          <Field name="city_id" label="Code ville (city_id)" defaultValue={event.city_id} placeholder="auto si vide" />

          <Field name="location_name" label="Lieu" defaultValue={event.location_name} required className="md:col-span-2" />
          <Field
            name="location_address"
            label="Adresse"
            defaultValue={event.location_address}
            required
            className="md:col-span-2"
          />
          <div className="md:col-span-2">
            <AddressMapPreview address={event.location_address} city={event.city} />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-800">Date & heure</label>
            <input
              name="event_date"
              type="datetime-local"
              required
              defaultValue={toDateTimeLocal(event.event_date)}
              className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Field name="time_label" label="Affichage heure" defaultValue={event.time_label} required />

          <Field name="price" label="Prix" defaultValue={String(event.price)} required />
          <div>
            <label className="text-sm font-medium text-zinc-800">Devise</label>
            <select
              name="currency"
              defaultValue={event.currency}
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="USD">USD</option>
              <option value="CDF">CDF</option>
              <option value="EUR">EUR</option>
            </select>
          </div>

          <SearchSelect
            name="organizer_id"
            label="Organisateur"
            placeholder="Tape pour rechercher…"
            options={organizerOptions}
            defaultValue={event.organizer_id}
            required
          />
          <SearchSelect
            name="category_id"
            label="Catégorie"
            placeholder="Tape pour rechercher…"
            options={categoryOptions}
            defaultValue={event.category_id}
            required
          />

          <div className="md:col-span-2">
            <EventImageUploader
              slugOrId={event.slug || event.id}
              defaultCoverUrl={(event.images ?? [])[0] ?? ""}
              defaultGalleryUrls={(event.images ?? []).slice(1)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-zinc-800">Description</label>
            <textarea
              name="description"
              required
              rows={6}
              className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              defaultValue={event.description}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:grid-cols-3 md:col-span-2">
            <Toggle name="featured" label="À la une" defaultChecked={event.featured} />
            <Toggle name="trending" label="Trending" defaultChecked={event.trending} />
            <div>
              <label className="text-sm font-medium text-zinc-800">Statut</label>
              <select
                name="status"
                defaultValue={event.status}
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="upcoming">À venir</option>
                <option value="ongoing">En cours</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2 md:col-span-2">
            <Link href="/events" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
              ← Retour à la liste
            </Link>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                formAction={deleteEvent}
                className="rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50"
              >
                Supprimer
              </button>
              <GuardedSubmit
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                pendingLabel="Enregistrement…"
              >
                Enregistrer
              </GuardedSubmit>
            </div>
          </div>
        </EventForm>
      </div>
    </div>
  );
}

async function updateEventBySlug(formData: FormData) {
  "use server";
  const supabase = getSupabaseAdmin();

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim() || slugify(title);
  const description = String(formData.get("description") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const cityId = String(formData.get("city_id") ?? "").trim() || slugify(city);
  const locationName = String(formData.get("location_name") ?? "").trim();
  const locationAddress = String(formData.get("location_address") ?? "").trim();
  const eventDateRaw = String(formData.get("event_date") ?? "").trim();
  const eventDate = eventDateRaw ? new Date(eventDateRaw).toISOString() : "";
  const timeLabel = String(formData.get("time_label") ?? "").trim();
  const organizerId = String(formData.get("organizer_id") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim();
  const currency = String(formData.get("currency") ?? "USD").trim() || "USD";
  const price = Number(String(formData.get("price") ?? "0"));

  const coverUrlInput = String(formData.get("cover_url") ?? "").trim();
  const galleryUrlInputs = String(formData.get("gallery_urls") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const images = [coverUrlInput, ...galleryUrlInputs].filter(Boolean);

  const featured = Boolean(formData.get("featured"));
  const trending = Boolean(formData.get("trending"));
  const status = String(formData.get("status") ?? "upcoming") as
    | "upcoming"
    | "ongoing"
    | "completed"
    | "cancelled";

  const { error } = await supabase
    .from("events")
    .update({
      title,
      slug,
      description,
      short_description: description.slice(0, 140),
      city,
      province: city,
      city_id: cityId,
      location_name: locationName,
      location_address: locationAddress,
      event_date: eventDate,
      time_label: timeLabel,
      organizer_id: organizerId,
      category_id: categoryId,
      images,
      price: isNaN(price) ? 0 : price,
      currency,
      featured,
      trending,
      status,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  redirect(`/events/${slug}`);
}

async function deleteEvent(formData: FormData) {
  "use server";
  const supabase = getSupabaseAdmin();
  const id = String(formData.get("id") ?? "");
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw new Error(error.message);
  redirect("/events");
}

function Field({
  name,
  label,
  defaultValue,
  required,
  className,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
}) {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-zinc-800">{label}</label>
      <input
        name={name}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}

function Toggle({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-3">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
      />
      <span className="text-sm font-medium text-zinc-800">{label}</span>
    </label>
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

