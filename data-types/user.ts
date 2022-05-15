export interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  token?: string
  refresh_token?: string
  phone?: string
  company_name?: string
  slug?: string
  photo_url?: string | null
  created_at?: string
  updated_at?: string
}
