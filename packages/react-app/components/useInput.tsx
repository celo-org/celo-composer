import { useState } from "react";
import Box from '@mui/material/Box';
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
