import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { PixDetails } from '@/types/pix-details'

// PIX Data Types (from hooks)
interface PixBankData {
  bank_num: string
  bank_image_url: string
  f110_date: string
  active_amount: number
  expired_amount: number
  paid_amount: number
  active_count: number
  expired_count: number
  paid_count: number
  total_amount: number
  total_count: number
  active_percent: number
  expired_percent: number
  paid_percent: number
}

export interface PixTransaction {
  wk_instance_id: string
  customer_name: string
  customer_name2: string
  status: string
  customer_number: string
  f110_date: string
  customer_cpf: string
  customer_cnpj: string
  customer_email: string
  customer_phone: string
  customer_cellphone: string
  customer_city: string
  customer_state_code: string
  customer_street: string
  customer_district: string
  customer_zipcode: string
  value: number
  original_value: string
  due_date: string
  bank_num: string
  bank_image_url: string
  bank_image_name: string
  status_filter: string
  txid: string
  pix_id: string
  pdf_link: string
}

// PIX Store Types
interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

interface PixState {
  // Data
  pixData: PixBankData[]
  transactions: PixTransaction[]
  details: PixDetails | null
  
  // UI State
  dateRange: DateRange
  selectedBank: string | null
  isLoading: boolean
  error: string | null
  
  // Filters
  searchTerm: string
  statusFilter: string | null
}

interface PixActions {
  // Data actions
  setPixData: (data: PixBankData[]) => void
  setTransactions: (transactions: PixTransaction[]) => void
  setDetails: (details: PixDetails | null) => void
  
  // UI actions
  setDateRange: (range: DateRange) => void
  setSelectedBank: (bank: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Filter actions
  setSearchTerm: (term: string) => void
  setStatusFilter: (status: string | null) => void
  
  // Reset actions
  clearFilters: () => void
  reset: () => void
}

export type PixStore = PixState & PixActions

// PIX Store Implementation
export const usePixStore = create<PixStore>()(
  devtools(
    immer((set) => ({
      // Initial State
      pixData: [],
      transactions: [],
      details: null,
      dateRange: {
        from: undefined,
        to: undefined,
      },
      selectedBank: null,
      isLoading: false,
      error: null,
      searchTerm: '',
      statusFilter: null,

      // Data actions
      setPixData: (data) =>
        set((state) => {
          state.pixData = data
          state.error = null
        }),

      setTransactions: (transactions) =>
        set((state) => {
          state.transactions = transactions
          state.error = null
        }),

      setDetails: (details) =>
        set((state) => {
          state.details = details
          state.error = null
        }),

      // UI actions
      setDateRange: (range) =>
        set((state) => {
          state.dateRange = range
        }),

      setSelectedBank: (bank) =>
        set((state) => {
          state.selectedBank = bank
        }),

      setLoading: (loading) =>
        set((state) => {
          state.isLoading = loading
        }),

      setError: (error) =>
        set((state) => {
          state.error = error
          state.isLoading = false
        }),

      // Filter actions
      setSearchTerm: (term) =>
        set((state) => {
          state.searchTerm = term
        }),

      setStatusFilter: (status) =>
        set((state) => {
          state.statusFilter = status
        }),

      // Reset actions
      clearFilters: () =>
        set((state) => {
          state.searchTerm = ''
          state.statusFilter = null
          state.selectedBank = null
        }),

      reset: () =>
        set((state) => {
          state.pixData = []
          state.transactions = []
          state.details = null
          state.dateRange = { from: undefined, to: undefined }
          state.selectedBank = null
          state.isLoading = false
          state.error = null
          state.searchTerm = ''
          state.statusFilter = null
        }),
    })),
    { name: 'pix-store' }
  )
)