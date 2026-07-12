import { permanentRedirect } from "next/navigation";

export default function RedirectPage() {
	permanentRedirect("/api-key-tester/");
}
