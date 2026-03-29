"use client";

import { RoughPath } from "@/registry/new-york/primitives/rough-path";

export default function RoughPathDemo() {
  return (
    <div className="p-10">
      <RoughPath
        width={200}
        height={200}
        d="M50 50 L150 50 L150 150 L50 150 Z"
        stroke="#000"
        fill="#facc15"
        className="w-[200px] h-[200px]"
        options={{
          roughness: 1.8,
          fillStyle: "hachure",
          fillWeight: 1,
        }}
      />
    </div>
  );
}
