import * as React from "react";
import { useState } from "react";
import Input from '@mui/material/Input';

export function useInput({ type /*...*/ }) {
  const [value, setValue] = useState("");
  const input = (
    <Input
      placeholder="Enter value"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      type={type}
    />
  );
  return [value, input];
}
