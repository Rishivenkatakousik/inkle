import Table from "@/components/table/Table";
import TableServer from "@/components/table/TableServer";

export default function Home() {
  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      {/* <Table /> */}
      <TableServer/>
    </main>
  );
}
