import React from "react";
import { Input } from "antd";
import type { InputProps, PasswordProps } from "antd/es/input";

const { Password } = Input;

interface MyInputProps extends InputProps, PasswordProps {
  label?: string;
  error?: string;
  type?: "text" | "password" | "email" | "number"; // chỉ định type rõ ràng
}

const MyInput: React.FC<MyInputProps> = ({
  label,
  error,
  type = "text",
  ...rest
}) => {
  const inputComponent =
    type === "password" ? (
      <Password {...rest} visibilityToggle status={error ? "error" : ""} />
    ) : (
      <Input {...rest} type={type} status={error ? "error" : ""} />
    );

  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {inputComponent}
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
};

export default MyInput;
