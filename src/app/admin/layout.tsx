import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin | Celebration Finds',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Render admin pages WITHOUT the public site header/footer
  return <>{children}</>
}
