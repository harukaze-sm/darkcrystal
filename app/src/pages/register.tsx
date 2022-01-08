import React, { ChangeEvent, useState } from "react";
import { useRouter } from "next/router";
import { useCreateUserMutation, useLogInMutation } from "src/generated/graphql";
import { CenteredContainer, PrimaryButton, TextInput } from "src/styled";

const Register = () => {
  const [, register] = useCreateUserMutation();
  const [input, setInput] = useState<{
    email: string;
    password: string;
    username: string;
  }>({
    password: "",
    email: "",
    username: "",
  });
  const history = useRouter();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  const handleRegister = async () => {
    if (input.password && input.email) {
      const user = await register(input);
      if (user.data?.createUser.error) {
        console.info(user.data?.createUser.error);
      } else {
        history.reload();
      }
    }
  };

  return (
    <CenteredContainer>
      <h1>Login</h1>
      <TextInput
        type="email"
        name="email"
        placeholder="Email"
        seperateTop
        value={input.email}
        onChange={(e) => handleInputChange(e)}
      />
      <TextInput
        type="text"
        name="username"
        placeholder="Username"
        seperateTop
        value={input.username}
        onChange={(e) => handleInputChange(e)}
      />
      <TextInput
        type="password"
        name="password"
        placeholder="Password"
        seperateTop
        seperateBottom
        value={input.password}
        onChange={(e) => handleInputChange(e)}
      />
      <PrimaryButton onClick={handleRegister}>Register</PrimaryButton>
    </CenteredContainer>
  );
};

export default Register;
