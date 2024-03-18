import React from "react";
import { Button } from "react-bootstrap";

const PostCard = ({ post = {} }) => {
  return (
    <div className="post-card">
      {post.img && <div
        className="post-image"
        style={{ backgroundImage: `url(${post.img})` }}
      ></div>}
      <div className="post-content">{post.text}</div>
      <Button size="sm" href={`/post/${post.id}`}>Läs mer</Button>
    </div>
  );
};

export default PostCard;
