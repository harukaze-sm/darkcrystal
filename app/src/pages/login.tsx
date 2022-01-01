import React, { ChangeEvent, useState } from "react";
import { useRouter } from "next/router";
import { useLogInMutation } from "src/generated/graphql";
import { CenteredContainer, PrimaryButton, TextInput } from "src/styled";

const Login = () => {
  const [, login] = useLogInMutation();
  const history = useRouter();
  const [input, setInput] = useState<{ email: string; password: string }>({
    password: "",
    email: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    if (input.password && input.email) {
      const user = await login(input);
      if (user.data?.logIn.error) {
        console.info(user.data?.logIn.error);
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
        type="password"
        name="password"
        placeholder="Password"
        seperateTop
        seperateBottom
        value={input.password}
        onChange={(e) => handleInputChange(e)}
      />
      <PrimaryButton onClick={handleLogin}>Log In</PrimaryButton>
    </CenteredContainer>
  );
};

export default Login;
