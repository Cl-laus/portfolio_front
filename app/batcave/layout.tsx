import AdminTopbar from '@/components/AdminTopbar';
import "@/styles/admin.css";

export default function BatcaveLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminTopbar />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
