import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Kickoff | Live sports desk" },
    { name: "description", content: "Football, transfers, NFL, and NBA news in one place." },
  ];
}

export default function Home() {
  return <Welcome />;
}
