import { createAdminClient } from "@/lib/supabase/admin";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { User, ShieldCheck, Mail, Phone } from "lucide-react";

export const metadata = {
  title: "Customers Directory | Admin Portal",
};

export default async function AdminCustomersPage() {
  const adminDb = createAdminClient();

  const { data: profiles } = await adminDb
    .from("profiles")
    .select(`
      *,
      orders:orders(id, total_amount, status)
    `)
    .order("created_at", { ascending: false });

  const profileList = profiles || [];

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
          Contractor &amp; Client CRM
        </span>
        <h1 className="text-3xl font-black text-white mt-1">Customer Directory</h1>
        <p className="text-slate-400 text-sm mt-1">
          Registered commercial contractors, home builders, and individual material purchasers.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-6">Customer Name</th>
                <th className="py-3 px-6">Contact Details</th>
                <th className="py-3 px-6">Role</th>
                <th className="py-3 px-6">Orders Placed</th>
                <th className="py-3 px-6">Lifetime Value</th>
                <th className="py-3 px-6">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {profileList.map((p: any) => {
                const orderCount = p.orders?.length || 0;
                const totalSpent = (p.orders || []).reduce(
                  (sum: number, o: any) => sum + Number(o.total_amount || 0),
                  0
                );

                return (
                  <tr key={p.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {p.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.avatar_url}
                            alt={p.full_name || "Customer"}
                            className="w-8 h-8 rounded-full object-cover border border-slate-700"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 font-bold border border-slate-700">
                            {p.full_name ? p.full_name[0].toUpperCase() : "U"}
                          </div>
                        )}
                        <span className="font-bold text-white text-sm">
                          {p.full_name || "Anonymous User"}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-slate-300">
                      <div className="space-y-0.5">
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span>{p.email}</span>
                        </span>
                        {p.phone && (
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <Phone className="w-3.5 h-3.5 text-slate-500" />
                            <span>{p.phone}</span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                          p.role === "admin"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {p.role}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-semibold text-white">
                      {orderCount} order(s)
                    </td>

                    <td className="py-4 px-6 font-extrabold text-amber-500 text-sm">
                      {formatCurrency(totalSpent)}
                    </td>

                    <td className="py-4 px-6 text-slate-400">
                      {formatDateTime(p.created_at)}
                    </td>
                  </tr>
                );
              })}

              {profileList.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No customers registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
