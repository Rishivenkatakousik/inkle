import { fetchCountries, fetchTableData } from "@/lib/api";
import TableClient from "./TableClient";

export default async function TableServer() {
  const [data, countries] = await Promise.all([
    fetchTableData(),
    fetchCountries(),
  ]);

  const countryNames = countries
    .filter((c: any) => c.name)
    .map((c: any) => c.name);

  return <TableClient initialData={data} countries={countryNames} />;
}