"use client";

import { useState } from "react";
import { NumberInput } from "@/registry/new-york/ui/number-input";

export function AgeExample() {
  const [age, setAge] = useState(2);

  const error = age > 0 && age < 6 ? "Must be at least 6" : undefined;

  return (
    <NumberInput
      label="Age"
      value={age}
      min={0}
      max={120}
      onChange={setAge}
      error={error}
    />
  );
}
