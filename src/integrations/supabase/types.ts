export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Accounts: {
        Row: {
          account_id: string
          contracts: string | null
          created_at: string | null
          financials: string | null
          id: number
          updated_at: string | null
        }
        Insert: {
          account_id: string
          contracts?: string | null
          created_at?: string | null
          financials?: string | null
          id?: number
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          contracts?: string | null
          created_at?: string | null
          financials?: string | null
          id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      Campaigns: {
        Row: {
          campaign_name: string
          content: string | null
          created_at: string | null
          id: number
          target_audience: string | null
          updated_at: string | null
        }
        Insert: {
          campaign_name: string
          content?: string | null
          created_at?: string | null
          id?: number
          target_audience?: string | null
          updated_at?: string | null
        }
        Update: {
          campaign_name?: string
          content?: string | null
          created_at?: string | null
          id?: number
          target_audience?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      custom_permissions: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          permission_name: string
          permission_value: boolean | null
          resource: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          permission_name: string
          permission_value?: boolean | null
          resource: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          permission_name?: string
          permission_value?: boolean | null
          resource?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_ledger: {
        Row: {
          amount: number | null
          balance: number | null
          customer_id: number | null
          fiscal_year: string | null
          id: number
          transaction_type: string | null
        }
        Insert: {
          amount?: number | null
          balance?: number | null
          customer_id?: number | null
          fiscal_year?: string | null
          id?: number
          transaction_type?: string | null
        }
        Update: {
          amount?: number | null
          balance?: number | null
          customer_id?: number | null
          fiscal_year?: string | null
          id?: number
          transaction_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_ledger_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customerMaster"
            referencedColumns: ["id"]
          },
        ]
      }
      customerMaster: {
        Row: {
          custAddress: string | null
          custBusinessname: string
          custCity: string | null
          custCreditperiod: number | null
          custEmail: string
          custGST: string
          custOwneremail: string | null
          custOwnername: string
          custOwnerphone: number
          custOwnerwhatsapp: number
          custPhone: number
          custPincode: number | null
          custProvince: string | null
          custRemarks: string | null
          custStatus: string
          custType: string
          custWhatsapp: number
          id: number
        }
        Insert: {
          custAddress?: string | null
          custBusinessname?: string
          custCity?: string | null
          custCreditperiod?: number | null
          custEmail?: string
          custGST: string
          custOwneremail?: string | null
          custOwnername?: string
          custOwnerphone: number
          custOwnerwhatsapp: number
          custPhone: number
          custPincode?: number | null
          custProvince?: string | null
          custRemarks?: string | null
          custStatus: string
          custType: string
          custWhatsapp: number
          id?: number
        }
        Update: {
          custAddress?: string | null
          custBusinessname?: string
          custCity?: string | null
          custCreditperiod?: number | null
          custEmail?: string
          custGST?: string
          custOwneremail?: string | null
          custOwnername?: string
          custOwnerphone?: number
          custOwnerwhatsapp?: number
          custPhone?: number
          custPincode?: number | null
          custProvince?: string | null
          custRemarks?: string | null
          custStatus?: string
          custType?: string
          custWhatsapp?: number
          id?: number
        }
        Relationships: []
      }
      CustomerMaster: {
        Row: {
          address: string | null
          created_at: string | null
          email: string
          id: number
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email: string
          id: number
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string
          id?: number
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      dashboard_config: {
        Row: {
          id: number
          layout: Json
          user_id: string
          widgets: Json
        }
        Insert: {
          id?: number
          layout: Json
          user_id: string
          widgets: Json
        }
        Update: {
          id?: number
          layout?: Json
          user_id?: string
          widgets?: Json
        }
        Relationships: []
      }
      dashboard_layouts: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          layout: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          layout: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          layout?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      dashboard_metrics: {
        Row: {
          created_at: string | null
          id: number
          metric_name: string
          metric_status: string
          metric_type: string
          metric_value: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          metric_name: string
          metric_status?: string
          metric_type: string
          metric_value: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          metric_name?: string
          metric_status?: string
          metric_type?: string
          metric_value?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number | null
          date: string | null
          description: string | null
          expenseid: string
        }
        Insert: {
          amount?: number | null
          date?: string | null
          description?: string | null
          expenseid?: string
        }
        Update: {
          amount?: number | null
          date?: string | null
          description?: string | null
          expenseid?: string
        }
        Relationships: []
      }
      feature_permissions: {
        Row: {
          created_at: string | null
          feature_name: string
          feature_path: string
          id: string
          is_enabled: boolean | null
          parent_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          feature_name: string
          feature_path: string
          id?: string
          is_enabled?: boolean | null
          parent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          feature_name?: string
          feature_path?: string
          id?: string
          is_enabled?: boolean | null
          parent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_permissions_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "feature_permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      FeaturePermissions: {
        Row: {
          created_at: string | null
          feature_name: string
          id: string
          parent_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          feature_name: string
          id?: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          feature_name?: string
          id?: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "FeaturePermissions_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "FeaturePermissions"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_table_config: {
        Row: {
          column_order: string[] | null
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string | null
          visible_columns: string[] | null
        }
        Insert: {
          column_order?: string[] | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
          visible_columns?: string[] | null
        }
        Update: {
          column_order?: string[] | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
          visible_columns?: string[] | null
        }
        Relationships: []
      }
      invoiceTable: {
        Row: {
          fy: string
          invAddamount: number | null
          invAlert: string | null
          invBalanceAmount: number | null
          invCustid: number | null
          invDate: string | null
          invDuedate: string | null
          invGst: number
          invId: number
          invMarkcleared: boolean | null
          invMessage1: string
          invMessage2: string | null
          invMessage3: string | null
          invNumber: string
          invPaymentDifference: number | null
          invPaymentStatus: string | null
          invRemainder2: boolean | null
          invRemainder3: boolean | null
          invReminder1: boolean | null
          invSubamount: number | null
          invTotal: number
          invValue: number
        }
        Insert: {
          fy: string
          invAddamount?: number | null
          invAlert?: string | null
          invBalanceAmount?: number | null
          invCustid?: number | null
          invDate?: string | null
          invDuedate?: string | null
          invGst: number
          invId?: number
          invMarkcleared?: boolean | null
          invMessage1?: string
          invMessage2?: string | null
          invMessage3?: string | null
          invNumber: string
          invPaymentDifference?: number | null
          invPaymentStatus?: string | null
          invRemainder2?: boolean | null
          invRemainder3?: boolean | null
          invReminder1?: boolean | null
          invSubamount?: number | null
          invTotal: number
          invValue: number
        }
        Update: {
          fy?: string
          invAddamount?: number | null
          invAlert?: string | null
          invBalanceAmount?: number | null
          invCustid?: number | null
          invDate?: string | null
          invDuedate?: string | null
          invGst?: number
          invId?: number
          invMarkcleared?: boolean | null
          invMessage1?: string
          invMessage2?: string | null
          invMessage3?: string | null
          invNumber?: string
          invPaymentDifference?: number | null
          invPaymentStatus?: string | null
          invRemainder2?: boolean | null
          invRemainder3?: boolean | null
          invReminder1?: boolean | null
          invSubamount?: number | null
          invTotal?: number
          invValue?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_invcustid_customer"
            columns: ["invCustid"]
            isOneToOne: false
            referencedRelation: "customerMaster"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoiceTable_invCustid_fkey"
            columns: ["invCustid"]
            isOneToOne: false
            referencedRelation: "customerMaster"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          expected_value: number | null
          id: string
          lead_name: string
          notes: string | null
          probability: number | null
          source: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          expected_value?: number | null
          id?: string
          lead_name: string
          notes?: string | null
          probability?: number | null
          source?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          expected_value?: number | null
          id?: string
          lead_name?: string
          notes?: string | null
          probability?: number | null
          source?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      paymentLedger: {
        Row: {
          amount: number
          createdAt: string | null
          custId: number | null
          description: string | null
          invId: number | null
          ledgerId: number
          runningBalance: number
          transactionType: string
          updatedAt: string | null
        }
        Insert: {
          amount: number
          createdAt?: string | null
          custId?: number | null
          description?: string | null
          invId?: number | null
          ledgerId?: number
          runningBalance: number
          transactionType: string
          updatedAt?: string | null
        }
        Update: {
          amount?: number
          createdAt?: string | null
          custId?: number | null
          description?: string | null
          invId?: number | null
          ledgerId?: number
          runningBalance?: number
          transactionType?: string
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paymentLedger_custId_fkey"
            columns: ["custId"]
            isOneToOne: false
            referencedRelation: "customerMaster"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paymentLedger_invId_fkey"
            columns: ["invId"]
            isOneToOne: false
            referencedRelation: "invoice_reminder_status"
            referencedColumns: ["invId"]
          },
          {
            foreignKeyName: "paymentLedger_invId_fkey"
            columns: ["invId"]
            isOneToOne: false
            referencedRelation: "invoiceTable"
            referencedColumns: ["invId"]
          },
        ]
      }
      paymentTransactions: {
        Row: {
          amount: number
          bankName: string | null
          chequeNumber: string | null
          createdAt: string | null
          createdBy: string | null
          invId: number
          paymentDate: string
          paymentId: number
          paymentMode: string
          remarks: string | null
          transactionId: string
          updatedAt: string | null
        }
        Insert: {
          amount: number
          bankName?: string | null
          chequeNumber?: string | null
          createdAt?: string | null
          createdBy?: string | null
          invId: number
          paymentDate: string
          paymentId?: number
          paymentMode: string
          remarks?: string | null
          transactionId: string
          updatedAt?: string | null
        }
        Update: {
          amount?: number
          bankName?: string | null
          chequeNumber?: string | null
          createdAt?: string | null
          createdBy?: string | null
          invId?: number
          paymentDate?: string
          paymentId?: number
          paymentMode?: string
          remarks?: string | null
          transactionId?: string
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paymentTransactions_invId_fkey"
            columns: ["invId"]
            isOneToOne: false
            referencedRelation: "invoice_reminder_status"
            referencedColumns: ["invId"]
          },
          {
            foreignKeyName: "paymentTransactions_invId_fkey"
            columns: ["invId"]
            isOneToOne: false
            referencedRelation: "invoiceTable"
            referencedColumns: ["invId"]
          },
        ]
      }
      productManagement: {
        Row: {
          prodBasePrice: number | null
          prodBoxstock: number | null
          prodBrand: string | null
          prodCategory: string | null
          prodCbm: number | null
          prodCollection: string | null
          prodColor1: string | null
          prodColor2: string | null
          prodColor3: string | null
          prodColor4: string | null
          prodColor5: string | null
          prodGrossweight: number | null
          prodId: string
          prodImages: string[] | null
          prodLandingcost: number | null
          prodMaterial: string | null
          prodMoq: number | null
          prodName: string
          prodNettweight: number | null
          prodPackaging: string | null
          prodPackcount: number | null
          prodPiecestock: number | null
          prodPromo1: string | null
          prodPromo2: string | null
          prodRestockDate: string | null
          prodShortName: string | null
          prodSku: string | null
          prodSlaborice1: number | null
          prodSlabprice2: number | null
          prodSlabprice3: number | null
          prodSlabprice4: number | null
          prodSlabprice5: number | null
          prodStatus: string | null
          prodSubcategory: string | null
          prodType: string | null
          prodUnitweight: number | null
          prodVariableprice: number | null
          prodVariant: string | null
        }
        Insert: {
          prodBasePrice?: number | null
          prodBoxstock?: number | null
          prodBrand?: string | null
          prodCategory?: string | null
          prodCbm?: number | null
          prodCollection?: string | null
          prodColor1?: string | null
          prodColor2?: string | null
          prodColor3?: string | null
          prodColor4?: string | null
          prodColor5?: string | null
          prodGrossweight?: number | null
          prodId: string
          prodImages?: string[] | null
          prodLandingcost?: number | null
          prodMaterial?: string | null
          prodMoq?: number | null
          prodName: string
          prodNettweight?: number | null
          prodPackaging?: string | null
          prodPackcount?: number | null
          prodPiecestock?: number | null
          prodPromo1?: string | null
          prodPromo2?: string | null
          prodRestockDate?: string | null
          prodShortName?: string | null
          prodSku?: string | null
          prodSlaborice1?: number | null
          prodSlabprice2?: number | null
          prodSlabprice3?: number | null
          prodSlabprice4?: number | null
          prodSlabprice5?: number | null
          prodStatus?: string | null
          prodSubcategory?: string | null
          prodType?: string | null
          prodUnitweight?: number | null
          prodVariableprice?: number | null
          prodVariant?: string | null
        }
        Update: {
          prodBasePrice?: number | null
          prodBoxstock?: number | null
          prodBrand?: string | null
          prodCategory?: string | null
          prodCbm?: number | null
          prodCollection?: string | null
          prodColor1?: string | null
          prodColor2?: string | null
          prodColor3?: string | null
          prodColor4?: string | null
          prodColor5?: string | null
          prodGrossweight?: number | null
          prodId?: string
          prodImages?: string[] | null
          prodLandingcost?: number | null
          prodMaterial?: string | null
          prodMoq?: number | null
          prodName?: string
          prodNettweight?: number | null
          prodPackaging?: string | null
          prodPackcount?: number | null
          prodPiecestock?: number | null
          prodPromo1?: string | null
          prodPromo2?: string | null
          prodRestockDate?: string | null
          prodShortName?: string | null
          prodSku?: string | null
          prodSlaborice1?: number | null
          prodSlabprice2?: number | null
          prodSlabprice3?: number | null
          prodSlabprice4?: number | null
          prodSlabprice5?: number | null
          prodStatus?: string | null
          prodSubcategory?: string | null
          prodType?: string | null
          prodUnitweight?: number | null
          prodVariableprice?: number | null
          prodVariant?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          id: string
          name: string
          sku: string
          stock: number | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          name: string
          sku: string
          stock?: number | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          name?: string
          sku?: string
          stock?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          can_create: boolean | null
          can_delete: boolean | null
          can_edit: boolean | null
          can_view: boolean | null
          created_at: string
          id: string
          resource: string
          updated_at: string
        }
        Insert: {
          can_create?: boolean | null
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_view?: boolean | null
          created_at?: string
          id?: string
          resource: string
          updated_at?: string
        }
        Update: {
          can_create?: boolean | null
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_view?: boolean | null
          created_at?: string
          id?: string
          resource?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          contact_preferences: Json | null
          created_at: string
          department: string | null
          designation: string | null
          emergency_contact: string | null
          employee_id: string | null
          full_name: string | null
          id: string
          joining_date: string | null
          last_active: string | null
          last_login: string | null
          location: string | null
          phone_number: string | null
          preferences: Json | null
          profile_image_url: string | null
          reports_to: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          skills: string[] | null
          social_links: Json | null
          status: string | null
          team: string | null
          timezone: string | null
          updated_at: string
          work_schedule: Json | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          contact_preferences?: Json | null
          created_at?: string
          department?: string | null
          designation?: string | null
          emergency_contact?: string | null
          employee_id?: string | null
          full_name?: string | null
          id: string
          joining_date?: string | null
          last_active?: string | null
          last_login?: string | null
          location?: string | null
          phone_number?: string | null
          preferences?: Json | null
          profile_image_url?: string | null
          reports_to?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          skills?: string[] | null
          social_links?: Json | null
          status?: string | null
          team?: string | null
          timezone?: string | null
          updated_at?: string
          work_schedule?: Json | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          contact_preferences?: Json | null
          created_at?: string
          department?: string | null
          designation?: string | null
          emergency_contact?: string | null
          employee_id?: string | null
          full_name?: string | null
          id?: string
          joining_date?: string | null
          last_active?: string | null
          last_login?: string | null
          location?: string | null
          phone_number?: string | null
          preferences?: Json | null
          profile_image_url?: string | null
          reports_to?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          skills?: string[] | null
          social_links?: Json | null
          status?: string | null
          team?: string | null
          timezone?: string | null
          updated_at?: string
          work_schedule?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_reports_to_fkey"
            columns: ["reports_to"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          description: string | null
          id: number
          role_name: string
        }
        Insert: {
          description?: string | null
          id?: number
          role_name: string
        }
        Update: {
          description?: string | null
          id?: number
          role_name?: string
        }
        Relationships: []
      }
      userFavoriteCategories: {
        Row: {
          category: string
          created_at: string | null
          id: string
          subcategory: string | null
          userId: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          subcategory?: string | null
          userId?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          subcategory?: string | null
          userId?: string | null
        }
        Relationships: []
      }
      whatsapp_config: {
        Row: {
          api_key: string
          created_at: string | null
          from_phone_number_id: string
          id: number
          is_active: boolean | null
          template_name: string
          template_namespace: string
          updated_at: string | null
        }
        Insert: {
          api_key: string
          created_at?: string | null
          from_phone_number_id: string
          id?: number
          is_active?: boolean | null
          template_name: string
          template_namespace: string
          updated_at?: string | null
        }
        Update: {
          api_key?: string
          created_at?: string | null
          from_phone_number_id?: string
          id?: number
          is_active?: boolean | null
          template_name?: string
          template_namespace?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      customer_ledger_balance: {
        Row: {
          balance: number | null
          custBusinessname: string | null
          custId: number | null
          custWhatsapp: number | null
          last_transaction_date: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paymentLedger_custId_fkey"
            columns: ["custId"]
            isOneToOne: false
            referencedRelation: "customerMaster"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_year_ranges: {
        Row: {
          financial_year: string | null
          year_end: string | null
          year_start: string | null
        }
        Relationships: []
      }
      invoice_reminder_status: {
        Row: {
          custBusinessname: string | null
          invDuedate: string | null
          invId: number | null
          invoice_number: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_duplicate_payments: {
        Args: {
          p_inv_id: number
          p_transaction_id: string
          p_payment_date: string
          p_amount: number
        }
        Returns: {
          is_duplicate: boolean
          existing_payment_id: number
          existing_transaction_id: string
          existing_payment_date: string
          existing_amount: number
        }[]
      }
      generate_unique_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: number[]
      }
      get_customer_ledger:
        | {
            Args: {
              p_customer_id: number
              p_start_date: string
              p_end_date: string
            }
            Returns: {
              transaction_date: string
              description: string
              amount: number
              balance: number
              type: string
            }[]
          }
        | {
            Args: {
              p_customer_id: number
              p_start_date: string
              p_end_date: string
            }
            Returns: {
              transaction_date: string
              description: string
              invoice_number: string
              debit: number
              credit: number
              balance: number
            }[]
          }
      get_customer_ledger_with_details: {
        Args: {
          p_customer_id: number
          p_start_date: string
          p_end_date: string
        }
        Returns: {
          transaction_date: string
          transaction_type: string
          reference_number: string
          debit_amount: number
          credit_amount: number
          balance: number
          description: string
        }[]
      }
      get_financial_year: {
        Args: {
          the_date: string
        }
        Returns: {
          fy_start: string
          fy_end: string
        }[]
      }
      get_user_permissions: {
        Args: {
          user_id: string
        }
        Returns: {
          resource: string
          can_view: boolean
          can_create: boolean
          can_edit: boolean
          can_delete: boolean
          custom_permissions: Json
        }[]
      }
      update_dashboard_layout: {
        Args: {
          new_layout: Json
        }
        Returns: string
      }
      update_user_role: {
        Args: {
          user_id: string
          new_role: Database["public"]["Enums"]["app_role"]
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role:
        | "business_owner"
        | "catalog_builder"
        | "sales_manager"
        | "business_manager"
        | "it_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
