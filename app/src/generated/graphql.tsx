import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type MessagePayload = {
  __typename?: 'MessagePayload';
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost?: Maybe<Post>;
  createUser: UserResponse;
  logIn: UserResponse;
  logOut: Scalars['Boolean'];
  sendMessage: Scalars['String'];
};


export type MutationCreatePostArgs = {
  body: Scalars['String'];
  title: Scalars['String'];
};


export type MutationCreateUserArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationLogInArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationSendMessageArgs = {
  message: Scalars['String'];
};

export type Post = {
  __typename?: 'Post';
  body: Scalars['String'];
  createdAt: Scalars['DateTime'];
  creator: User;
  id: Scalars['Int'];
  title: Scalars['String'];
  type: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  posts: Array<Post>;
  test: Scalars['String'];
  user?: Maybe<User>;
  users: Array<User>;
};

export type Subscription = {
  __typename?: 'Subscription';
  receiveMessage: MessagePayload;
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  posts: Array<Post>;
  role: Scalars['String'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  error?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type CreateUserMutationVariables = Exact<{
  password: Scalars['String'];
  email: Scalars['String'];
  username: Scalars['String'];
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'UserResponse', error?: string | null | undefined, user?: { __typename?: 'User', id: number, role: string, username: string } | null | undefined } };

export type LogInMutationVariables = Exact<{
  password: Scalars['String'];
  email: Scalars['String'];
}>;


export type LogInMutation = { __typename?: 'Mutation', logIn: { __typename?: 'UserResponse', error?: string | null | undefined, user?: { __typename?: 'User', id: number, role: string, username: string } | null | undefined } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logOut: boolean };

export type UserQueryVariables = Exact<{ [key: string]: never; }>;


export type UserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: number, username: string, role: string } | null | undefined };

export type QueryQueryVariables = Exact<{ [key: string]: never; }>;


export type QueryQuery = { __typename?: 'Query', hello: string };

export type PostsQueryVariables = Exact<{ [key: string]: never; }>;


export type PostsQuery = { __typename?: 'Query', posts: Array<{ __typename?: 'Post', id: number, title: string, body: string, type: string, createdAt: any, updatedAt: any, creator: { __typename?: 'User', id: number, username: string, role: string } }> };

export type ReceiveMessageSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ReceiveMessageSubscription = { __typename?: 'Subscription', receiveMessage: { __typename?: 'MessagePayload', message: string } };


export const CreateUserDocument = gql`
    mutation CreateUser($password: String!, $email: String!, $username: String!) {
  createUser(password: $password, email: $email, username: $username) {
    error
    user {
      id
      role
      username
    }
  }
}
    `;

export function useCreateUserMutation() {
  return Urql.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument);
};
export const LogInDocument = gql`
    mutation LogIn($password: String!, $email: String!) {
  logIn(password: $password, email: $email) {
    error
    user {
      id
      role
      username
    }
  }
}
    `;

export function useLogInMutation() {
  return Urql.useMutation<LogInMutation, LogInMutationVariables>(LogInDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logOut
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const UserDocument = gql`
    query User {
  user {
    id
    username
    role
  }
}
    `;

export function useUserQuery(options: Omit<Urql.UseQueryArgs<UserQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UserQuery>({ query: UserDocument, ...options });
};
export const QueryDocument = gql`
    query Query {
  hello
}
    `;

export function useQueryQuery(options: Omit<Urql.UseQueryArgs<QueryQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<QueryQuery>({ query: QueryDocument, ...options });
};
export const PostsDocument = gql`
    query Posts {
  posts {
    id
    title
    body
    type
    createdAt
    updatedAt
    creator {
      id
      username
      role
    }
  }
}
    `;

export function usePostsQuery(options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
};
export const ReceiveMessageDocument = gql`
    subscription ReceiveMessage {
  receiveMessage {
    message
  }
}
    `;

export function useReceiveMessageSubscription<TData = ReceiveMessageSubscription>(options: Omit<Urql.UseSubscriptionArgs<ReceiveMessageSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<ReceiveMessageSubscription, TData>) {
  return Urql.useSubscription<ReceiveMessageSubscription, TData, ReceiveMessageSubscriptionVariables>({ query: ReceiveMessageDocument, ...options }, handler);
};