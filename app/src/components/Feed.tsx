import { Avatar, Button, TextField } from "@mui/material";
import React, { useContext, useState } from "react";
import { useCreatePostMutation, usePostsQuery } from "src/generated/graphql";
import AuthContext from "src/stores/AuthContext";
import styled from "styled-components";
import Post from "./Post";

const FeedContainer = styled.div`
  width: 50vw;
  height: 100vh;
`;

const NewContainer = styled.div`
  width: 100%;
  height: 20%;
`;

const PostsContainer = styled.div`
  width: 100%;
  height: 80%;
  overflow: scroll;
`;

const TextInput = styled(TextField)``;

const Feed = () => {
  const [{ data }] = usePostsQuery();
  const [, createPost] = useCreatePostMutation();
  const [input, setInput] = useState("");

  const handlePost = async () => {
    if (!input) return;
    const { data: newPost } = await createPost({
      body: input,
      title: "doesnt matter",
    });
    setInput("");
    if (newPost?.createPost) {
      data?.posts.push(newPost.createPost);
    }
  };

  const user = useContext(AuthContext);
  return (
    <FeedContainer>
      <NewContainer>
        <h4>Home</h4>
        <TextInput
          label="Create a new post..."
          multiline
          fullWidth
          rows={3}
          variant="outlined"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          InputProps={{
            startAdornment: (
              <Avatar
                style={{ marginBottom: 20, marginRight: 15 }}
                src={`https://avatars.dicebear.com/api/initials/:${user?.username}.svg`}
              />
            ),
            endAdornment: (
              <Button style={{ marginTop: "auto" }} onClick={handlePost}>
                Post
              </Button>
            ),
          }}
        />
      </NewContainer>
      <PostsContainer>
        {data?.posts ? (
          data.posts.map((p) => <Post key={p.id} posts={p} />)
        ) : (
          <h1>No posts yet...</h1>
        )}
      </PostsContainer>
    </FeedContainer>
  );
};

export default Feed;
