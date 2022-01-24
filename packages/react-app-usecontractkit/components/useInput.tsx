import { useState } from "react";
import { Input } from "antd";

export function useInput({ type /*...*/ }) {
  const [value, setValue] = useState("");
  const input = (
    <Input
      placeholder="Input value here"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      type={type}
    />
  );
  return [value, input];
}
