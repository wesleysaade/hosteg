import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Página de login não tem sidebar — o middleware já cuida do redirect
  if (!user) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      <AdminSidebar userEmail={user.email ?? ''} />
      <main className="flex-1 min-w-0 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
