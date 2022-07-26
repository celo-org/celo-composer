import { useEffect, useState } from "react";

import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export function ContractFields({ inputs, name, outputs, stateMutability }) {
  const [params, setParams] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setParams({ ...params, ...{ name: value } });
    console.log(params);
  };

  function buttonColor(funcType) {
    switch (funcType) {
      case "view":
        return "primary";
      case "nonpayable":
        return "secondary";
      case "payable":
        return "error";
    }
  }

  return (
    <>
      {inputs.map((input, key) => {
        const name = input.name;
        setParams({ ...params, ...{ name: "" } });

        return (
          <>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              <FormControl sx={{ m: 1 }}>
                <InputLabel htmlFor={name}>{name}</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  label={name}
                  name={name}
                  onChange={handleChange}
                />
              </FormControl>
            </Box>
            <FormControl sx={{ m: 1 }}>
              <Button variant="contained" color={buttonColor(stateMutability)}>
                {stateMutability === "view" ? "Call" : "Transact"}
              </Button>
            </FormControl>
          </>
        );
      })}
    </>
  );
}
