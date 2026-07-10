export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          icon: string;
          color: string;
          image_url: string | null;
          event_count: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["categories"]["Row"], "created_at" | "event_count"> & {
          event_count?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [];
      };
      organizers: {
        Row: {
          id: string;
          name: string;
          avatar_url: string | null;
          email: string | null;
          phone: string | null;
          bio: string | null;
          rating: number;
          event_count: number;
          followers: number;
          verified: boolean;
          user_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["organizers"]["Row"], "created_at" | "rating" | "event_count" | "followers" | "verified"> & {
          rating?: number;
          event_count?: number;
          followers?: number;
          verified?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["organizers"]["Insert"]>;
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          short_description: string | null;
          images: string[];
          category_id: string;
          organizer_id: string;
          event_date: string;
          time_label: string;
          end_date: string | null;
          end_time_label: string | null;
          location_name: string;
          location_address: string;
          latitude: number;
          longitude: number;
          city_id: string;
          city: string;
          province: string;
          distance_km: number | null;
          price: number;
          original_price: number | null;
          currency: string;
          capacity: number;
          attendees: number;
          rating: number;
          review_count: number;
          tags: string[];
          featured: boolean;
          trending: boolean;
          status: "upcoming" | "ongoing" | "completed" | "cancelled";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["events"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["events"]["Insert"]>;
        Relationships: [
          { foreignKeyName: "events_category_id_fkey"; columns: ["category_id"]; referencedRelation: "categories"; referencedColumns: ["id"] },
          { foreignKeyName: "events_organizer_id_fkey"; columns: ["organizer_id"]; referencedRelation: "organizers"; referencedColumns: ["id"] },
        ];
      };
      profiles: {
        Row: {
          id: string;
          name: string | null;
          phone: string | null;
          avatar_url: string | null;
          city_id: string | null;
          city_label: string | null;
          status: "active" | "suspended";
          expo_push_token: string | null;
          preferences: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at" | "preferences"> & {
          preferences?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      organizer_applications: {
        Row: {
          id: string;
          user_id: string;
          business_name: string;
          email: string | null;
          phone: string | null;
          city: string | null;
          bio: string | null;
          status: "pending" | "approved" | "rejected";
          rejection_reason: string | null;
          organizer_id: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["organizer_applications"]["Row"], "id" | "created_at" | "updated_at" | "status"> & {
          id?: string;
          status?: Database["public"]["Tables"]["organizer_applications"]["Row"]["status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["organizer_applications"]["Insert"]>;
        Relationships: [];
      };
      user_notifications: {
        Row: {
          id: string;
          user_id: string;
          type: "booking" | "reminder" | "promo" | "system";
          title: string;
          message: string;
          read: boolean;
          data: Json;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["user_notifications"]["Row"], "id" | "created_at" | "read" | "data"> & {
          id?: string;
          read?: boolean;
          data?: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_notifications"]["Insert"]>;
        Relationships: [];
      };
      favorites: {
        Row: {
          user_id: string;
          event_id: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["favorites"]["Row"], "created_at"> & { created_at?: string };
        Update: Partial<Database["public"]["Tables"]["favorites"]["Insert"]>;
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          user_id: string | null;
          event_id: string;
          guest_name: string | null;
          guest_email: string | null;
          guest_phone: string | null;
          quantity: number;
          unit_price: number;
          service_fee: number;
          total_amount: number;
          status: "pending" | "paid" | "cancelled" | "failed";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["bookings"]["Row"], "id" | "created_at" | "service_fee" | "status"> & {
          id?: string;
          service_fee?: number;
          status?: Database["public"]["Tables"]["bookings"]["Row"]["status"];
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>;
        Relationships: [];
      };
      tickets: {
        Row: {
          id: string;
          booking_id: string | null;
          user_id: string | null;
          event_id: string;
          ticket_type: "vip" | "standard" | "early-bird";
          quantity: number;
          unit_price: number;
          total_amount: number;
          status: "active" | "used" | "expired" | "cancelled";
          qr_code: string;
          barcode: string;
          purchase_date: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["tickets"]["Row"], "id" | "created_at" | "purchase_date" | "status"> & {
          id?: string;
          status?: Database["public"]["Tables"]["tickets"]["Row"]["status"];
          purchase_date?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["tickets"]["Insert"]>;
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          booking_id: string;
          user_id: string | null;
          amount: number;
          method: string;
          provider: string | null;
          status: "pending" | "completed" | "failed";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["payments"]["Row"], "id" | "created_at" | "status"> & {
          id?: string;
          status?: Database["public"]["Tables"]["payments"]["Row"]["status"];
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type EventRow = Database["public"]["Tables"]["events"]["Row"];
export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type OrganizerRow = Database["public"]["Tables"]["organizers"]["Row"];
export type TicketRow = Database["public"]["Tables"]["tickets"]["Row"];
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export type EventWithRelations = EventRow & {
  categories: CategoryRow | null;
  organizers: OrganizerRow | null;
};

export type TicketWithEvent = TicketRow & {
  events: EventWithRelations | null;
};
