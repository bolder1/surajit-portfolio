import type { Metadata } from "next";
import { Playground } from "@/components/playground/Playground";

/*
  /playground — the drivable 3D world.
  Everything heavy is lazy-loaded client-side inside <Playground />.
*/

export const metadata: Metadata = {
  title: "3D Playground",
  description:
    "Drive a little cream pickup through Surajit Dutta's portfolio — crates to smash, pins to bowl, ramps to jump.",
};

export default function PlaygroundPage() {
  return <Playground />;
}
