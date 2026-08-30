export type PricingTier = "79" | "149" | "349";
export type PurchaseStatus = "pending" | "paid" | "refunded" | "failed";
export type FactSubject =
  | "district"
  | "school"
  | "program"
  | "policy"
  | "deadline"
  | "other";
export type VerificationMethod = "official_page" | "phone" | "secondary";
export type SchoolKind = "public" | "private" | "magnet" | "specialty";

export type ProfileRow = {
  id: string;
  email: string;
  created_at: string;
  is_admin: boolean;
};

export type PurchaseRow = {
  id: string;
  user_id: string | null;
  email: string;
  stripe_checkout_session_id: string;
  stripe_payment_intent_id: string | null;
  tier: PricingTier;
  status: PurchaseStatus;
  created_at: string;
};

export type EntitlementRow = {
  id: string;
  user_id: string | null;
  email: string;
  has_guide: boolean;
  has_toolkit: boolean;
  has_call: boolean;
  updated_at: string;
};

export type CallSlotRow = {
  month: string;
  capacity: number;
  bookings: number;
  remaining: number;
};

export type CallBookingRow = {
  id: string;
  month: string;
  user_id: string;
  created_at: string;
};

export type FactRow = {
  id: string;
  subject: FactSubject;
  subject_key: string;
  label: string;
  value: string;
  source_url: string;
  verified_at: string;
  verification_method: VerificationMethod;
  created_at: string;
  updated_at: string;
};

export type CorrectionRow = {
  id: string;
  page_path: string;
  fact_id: string | null;
  reporter_email: string | null;
  message: string;
  created_at: string;
  emailed_at: string | null;
};

export type DistrictRow = {
  id: string;
  slug: string;
  name: string;
  website_url: string | null;
  created_at: string;
};

export type SchoolRow = {
  id: string;
  slug: string;
  name: string;
  district_id: string | null;
  kind: SchoolKind;
  website_url: string | null;
  created_at: string;
};

export type ProgramRow = {
  id: string;
  slug: string;
  name: string;
  school_id: string | null;
  district_id: string | null;
  created_at: string;
};

export type ModuleRow = {
  id: string;
  slug: string;
  title: string;
  sort_order: number;
  created_at: string;
};

export type ProcessedEventRow = {
  event_id: string;
  processed_at: string;
};

type TableDef<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDef<
        ProfileRow,
        {
          id: string;
          email: string;
          created_at?: string;
          is_admin?: boolean;
        },
        {
          email?: string;
          is_admin?: boolean;
        }
      >;
      purchases: TableDef<
        PurchaseRow,
        {
          id?: string;
          user_id?: string | null;
          email: string;
          stripe_checkout_session_id: string;
          stripe_payment_intent_id?: string | null;
          tier: PricingTier;
          status: PurchaseStatus;
          created_at?: string;
        },
        {
          user_id?: string | null;
          email?: string;
          stripe_payment_intent_id?: string | null;
          tier?: PricingTier;
          status?: PurchaseStatus;
        }
      >;
      entitlements: TableDef<
        EntitlementRow,
        {
          id?: string;
          user_id?: string | null;
          email: string;
          has_guide?: boolean;
          has_toolkit?: boolean;
          has_call?: boolean;
          updated_at?: string;
        },
        {
          user_id?: string | null;
          has_guide?: boolean;
          has_toolkit?: boolean;
          has_call?: boolean;
          updated_at?: string;
        }
      >;
      processed_events: TableDef<
        ProcessedEventRow,
        { event_id: string; processed_at?: string },
        { processed_at?: string }
      >;
      call_slots: TableDef<
        CallSlotRow,
        {
          month: string;
          capacity?: number;
          bookings?: number;
        },
        { capacity?: number; bookings?: number }
      >;
      call_bookings: TableDef<
        CallBookingRow,
        {
          id?: string;
          month: string;
          user_id: string;
          created_at?: string;
        },
        { month?: string; user_id?: string }
      >;
      districts: TableDef<
        DistrictRow,
        {
          id?: string;
          slug: string;
          name: string;
          website_url?: string | null;
          created_at?: string;
        },
        { slug?: string; name?: string; website_url?: string | null }
      >;
      schools: TableDef<
        SchoolRow,
        {
          id?: string;
          slug: string;
          name: string;
          district_id?: string | null;
          kind: SchoolKind;
          website_url?: string | null;
          created_at?: string;
        },
        {
          slug?: string;
          name?: string;
          district_id?: string | null;
          kind?: SchoolKind;
          website_url?: string | null;
        }
      >;
      programs: TableDef<
        ProgramRow,
        {
          id?: string;
          slug: string;
          name: string;
          school_id?: string | null;
          district_id?: string | null;
          created_at?: string;
        },
        {
          slug?: string;
          name?: string;
          school_id?: string | null;
          district_id?: string | null;
        }
      >;
      modules: TableDef<
        ModuleRow,
        {
          id?: string;
          slug: string;
          title: string;
          sort_order: number;
          created_at?: string;
        },
        { slug?: string; title?: string; sort_order?: number }
      >;
      facts: TableDef<
        FactRow,
        {
          id?: string;
          subject: FactSubject;
          subject_key: string;
          label: string;
          value: string;
          source_url: string;
          verified_at: string;
          verification_method: VerificationMethod;
          created_at?: string;
          updated_at?: string;
        },
        {
          subject?: FactSubject;
          subject_key?: string;
          label?: string;
          value?: string;
          source_url?: string;
          verified_at?: string;
          verification_method?: VerificationMethod;
        }
      >;
      corrections: TableDef<
        CorrectionRow,
        {
          id?: string;
          page_path: string;
          fact_id?: string | null;
          reporter_email?: string | null;
          message: string;
          created_at?: string;
          emailed_at?: string | null;
        },
        { emailed_at?: string | null; fact_id?: string | null }
      >;
    };
    Views: {
      stale_facts: {
        Row: FactRow;
        Relationships: [];
      };
    };
    Functions: {
      link_my_purchases: {
        Args: Record<string, never>;
        Returns: undefined;
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      has_paid_guide: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      has_paid_toolkit: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
