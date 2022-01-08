import { createContext } from "react";
import { useUserQuery } from "src/generated/graphql";

const AuthContext = createContext<
  | {
      __typename?: "User" | undefined;
      id: number;
      username: string;
      role: string;
    }
  | null
  | undefined
>(null);

export const AuthContextProvider: React.FC = ({ children }) => {
  const [{ data, fetching }] = useUserQuery();

  if (fetching) {
    return <></>;
  }

  return (
    <AuthContext.Provider value={data?.user}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
