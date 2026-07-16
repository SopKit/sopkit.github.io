import { HexclaveHandler } from "@hexclave/next";
import { stackServerApp } from "@/stack/server";
import { notFound } from "next/navigation";

export default function Handler(props: unknown) {
  if (!stackServerApp) return notFound();
  return <HexclaveHandler fullPage app={stackServerApp} routeProps={props} />;
}
