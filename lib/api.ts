import { TableRow } from "@/types/table";

export async function fetchTableData(): Promise<TableRow[]> {
  const res = await fetch("https://685013d7e7c42cfd17974a33.mockapi.io/taxes");

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function fetchCountries(): Promise<{ name: string; id: string }[]> {
  const res = await fetch("https://685013d7e7c42cfd17974a33.mockapi.io/countries");
  if (!res.ok) {
    throw new Error("Failed to fetch countries");
  }
  return res.json();
}
