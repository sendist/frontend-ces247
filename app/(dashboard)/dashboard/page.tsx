import { TopRow } from "@/components/dashboard/top-row";
import { LeftColumn } from "@/components/dashboard/left-column";
import { ChannelColumn } from "@/components/dashboard/channel-column";
import { Mail, MessageCircle, Instagram, MessageSquare, Phone } from "lucide-react";

// Dummy data for tables
const dummyCorporateData = [
  { name: "PT. SUPER SPRING", tickets: 22, fcr: "100%" },
  { name: "PT. SUMBER SINERGI MAKMUR", tickets: 8, fcr: "88.9%" },
  { name: "PRIMANUSA GLOBALINDO", tickets: 6, fcr: "100%" },
  { name: "Consumer", tickets: 4, fcr: "100%" },
];

const dummyKipData = [
  { category: "Informasi sisa kuota", tickets: 16, fcr: "100%" },
  { category: "Kendala penggunaan kartu SIM", tickets: 9, fcr: "100%" },
  { category: "Permintaan Refresh GPRS", tickets: 5, fcr: "100%" },
  { category: "Interaksi terputus", tickets: 4, fcr: "100%" },
];

const channels = [
  { icon: <Mail className="text-red-500" />, title: "Email" },
  { icon: <MessageCircle className="text-green-500" />, title: "Whatsapp" },
  { icon: <Instagram className="text-pink-500" />, title: "Social Media" },
  { icon: <MessageSquare className="text-orange-500" />, title: "Live Chat" },
  { icon: <Phone className="text-blue-500" />, title: "Call Center 188" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-4 text-slate-200">
      <TopRow />
      <div className="grid grid-cols-1 xl:grid-cols-8 gap-4">
        <LeftColumn />
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 col-span-7 gap-4">
          {channels.map((channel, index) => (
            <ChannelColumn
              key={index}
              icon={channel.icon}
              title={channel.title}
              sla="98%"
              open={70}
              closed={20}
              topCorporateData={dummyCorporateData}
              topKipData={dummyKipData}
            />
          ))}
        </div>
      </div>
    </div>
  );
}