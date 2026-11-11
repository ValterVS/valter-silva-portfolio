import { notFound } from "next/navigation";

// Qualquer rota desconhecida cai na página 404 do próprio site.
export default function UnknownPage() {
  notFound();
}
