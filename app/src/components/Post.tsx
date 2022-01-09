import { Avatar } from "@mui/material";
import React from "react";
import styled from "styled-components";

type PostProps = {
  posts: {
    __typename?: "Post" | undefined;
    id: number;
    title: string;
    body: string;
    type: string;
    createdAt: any;
    updatedAt: any;
    creator: {
      __typename?: "User" | undefined;
      id: number;
      username: string;
      role: string;
    };
  };
};

const PostContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  border: 1px solid gray;
`;

const PostCard = styled.div`
  width: 100%;
`;

const Post: React.FC<PostProps> = ({
  posts: {
    body,
    title,
    creator: { username },
  },
}) => {
  return (
    <PostContainer>
      <Avatar
        style={{ marginTop: 20, marginLeft: 20 }}
        src={`https://avatars.dicebear.com/api/initials/:${username}.svg`}
      />
      <div
        style={{
          marginLeft: 20,
        }}
      >
        <div>
          <h3 style={{ marginBottom: "0.5rem" }}>{username}</h3>
        </div>
        <p style={{ marginTop: 0 }}>{body}</p>
      </div>
    </PostContainer>
  );
};

export default Post;
