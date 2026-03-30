import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import CartDrawer from "@/components/shop/CartDrawer";
import PageTransition from "@/components/layout/PageTransition";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-grow flex flex-col">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <SiteFooter />
      <CartDrawer />
    </>
  );
}
