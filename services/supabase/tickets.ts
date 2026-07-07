import { getSupabase } from "@/lib/supabase";
import { Ticket } from "@/types";
import { TicketWithEvent } from "@/types/database";
import { mapTicket } from "./mappers";

const TICKET_SELECT = `
  *,
  events (
    *,
    categories (*),
    organizers (*)
  )
`;

export async function fetchUserTicketsFromSupabase(userId: string): Promise<Ticket[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("tickets")
    .select(TICKET_SELECT)
    .eq("user_id", userId)
    .order("purchase_date", { ascending: false });

  if (error) throw error;

  return (data as TicketWithEvent[])
    .map(mapTicket)
    .filter((ticket): ticket is Ticket => Boolean(ticket));
}

export interface CreateBookingInput {
  eventId: string;
  userId?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  quantity: number;
  unitPrice: number;
  serviceFee: number;
  totalAmount: number;
}

export interface CompletePaymentInput {
  bookingId: string;
  userId?: string;
  amount: number;
  method: string;
  provider?: string;
  eventId: string;
  quantity: number;
  unitPrice: number;
}

export async function createBookingInSupabase(input: CreateBookingInput): Promise<string> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      event_id: input.eventId,
      user_id: input.userId ?? null,
      guest_name: input.guestName,
      guest_email: input.guestEmail,
      guest_phone: input.guestPhone,
      quantity: input.quantity,
      unit_price: input.unitPrice,
      service_fee: input.serviceFee,
      total_amount: input.totalAmount,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function completePaymentInSupabase(input: CompletePaymentInput): Promise<Ticket> {
  const supabase = getSupabase();
  const qrCode = `invyra-${input.bookingId}-${Date.now()}`;
  const barcode = `bc-${input.bookingId.slice(0, 8)}`;

  const { error: paymentError } = await supabase.from("payments").insert({
    booking_id: input.bookingId,
    user_id: input.userId ?? null,
    amount: input.amount,
    method: input.method,
    provider: input.provider ?? null,
    status: "completed",
  });

  if (paymentError) throw paymentError;

  const { error: bookingError } = await supabase
    .from("bookings")
    .update({ status: "paid" })
    .eq("id", input.bookingId);

  if (bookingError) throw bookingError;

  const { data: ticketRow, error: ticketError } = await supabase
    .from("tickets")
    .insert({
      booking_id: input.bookingId,
      user_id: input.userId ?? null,
      event_id: input.eventId,
      ticket_type: "standard",
      quantity: input.quantity,
      unit_price: input.unitPrice,
      total_amount: input.amount,
      status: "active",
      qr_code: qrCode,
      barcode,
    })
    .select(TICKET_SELECT)
    .single();

  if (ticketError) throw ticketError;

  const ticket = mapTicket(ticketRow as TicketWithEvent);
  if (!ticket) throw new Error("Ticket creation failed");
  return ticket;
}
