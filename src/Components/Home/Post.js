import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { AiOutlineDelete } from "react-icons/ai";
import Comments from '../Comments/Comments';
import moment from 'moment';
import { Link } from 'react-router-dom';
import api from '../../util/api';

// STANDARD POST BOX STYLED COMPONENTS
const PostBox = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  margin-bottom: 16px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 640px) {
    border-radius: 4px;
    margin-bottom: 12px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  background: white;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 640px) {
    padding: 10px 12px;
  }
`;

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  border: none;
  background: none;
  padding: 0;
  min-width: 0;
`;

const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  background: #f3f4f6;
  flex-shrink: 0;
  border: none;
  padding: 0;
  display: block;
  image-rendering: crisp-edges;
`;

const UserMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;

  a {
    text-decoration: none;
    color: inherit;
    display: flex;
    align-items: center;
    gap: 0;
    flex: 1;
    min-width: 0;
  }

  .username {
    margin: 0;
    padding: 0;
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
    border: none;
    background: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 640px) {
      font-size: 13px;
    }
  }

  .timestamp {
    margin: 0;
    padding: 0;
    font-size: 13px;
    color: #9ca3af;
    white-space: nowrap;
    flex-shrink: 0;

    @media (max-width: 640px) {
      font-size: 12px;
    }
  }

  .username {
    margin: 0;
    padding: 0;
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
    border: none;
    background: none;
  }

  .timestamp {
    margin: 0;
    padding: 0;
    font-size: 13px;
    color: #9ca3af;
    white-space: nowrap;
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  color: #6b7280;
  display: flex;
  align-items: center;
  border-radius: 50%;
  transition: background 0.2s;
  position: relative;

  &:hover {
    background: #f3f4f6;
  }
`;

const MenuDropdown = styled.div`
  position: absolute;
  top: 36px;
  right: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  min-width: 160px;

  button {
    width: 100%;
    padding: 10px 14px;
    border: none;
    background: transparent;
    text-align: left;
    cursor: pointer;
    font-size: 13px;
    color: #374151;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: background 0.2s;

    &:hover {
      background: #f3f4f6;
    }

    svg {
      font-size: 14px;
    }
  }
`;

const Content = styled.div`
  padding: 16px;
  background: white;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: none !important;
`;

const PostTextBox = styled.p`
  margin: 0 !important;
  padding: 0 !important;
  font-size: 15px !important;
  color: #1f2937 !important;
  line-height: 1.6 !important;
  word-break: break-word;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  text-align: left !important;
  font-family: inherit !important;
  font-weight: 400 !important;
  min-height: auto !important;
  background: transparent !important;
  border: none !important;
  display: block !important;

  @media (max-width: 640px) {
    font-size: 14px !important;
    line-height: 1.5 !important;
  }
`;

const PostImg = styled.img`
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: cover;
  display: block;
  background: #f3f4f6;
  border-radius: 8px;
  margin: 8px 0 0 0;
`;

const Stats = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 16px;
  border-top: 1px solid #f3f4f6;
  border-bottom: 1px solid #f3f4f6;
  font-size: 13px;
  color: #6b7280;
  background: #f9fafb;
`;

const Actions = styled.div`
  display: flex;
  gap: 0;
  padding: 0;
  background: white;
`;

const ActionBtn = styled.button`
  flex: 1;
  padding: 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    color: #1f2937;
  }

  &.liked {
    color: #ef4444;
  }

  svg {
    font-size: 16px;
  }
`;

const CommentsArea = styled.div`
  padding: 12px 0;
  border-top: 1px solid #f3f4f6;
  background: white;
  width: 100%;
`;

const CommentInputBox = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
  padding: 0;
`;

const CommentFieldForm = styled.form`
  flex: 1;
  display: flex;
  gap: 8px;
  align-items: center;
  background: #f3f4f6;
  border-radius: 20px;
  padding: 10px 16px;
  width: 100%;
  box-sizing: border-box;

  input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-size: 14px;
    color: #1f2937;
    font-family: inherit;
    min-height: 24px;
    padding: 0;
    margin: 0;

    &::placeholder {
      color: #d1d5db;
      font-size: 14px;
    }

    &:focus {
      outline: none;
    }
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    color: #2563eb;
    display: flex;
    align-items: center;
    padding: 0;
    margin: 0;
    flex-shrink: 0;
    transition: all 0.2s;

    &:hover {
      color: #1d4ed8;
      transform: scale(1.1);
    }

    svg {
      font-size: 18px;
    }
  }

  @media (max-width: 640px) {
    padding: 8px 12px;

    input {
      font-size: 13px;

      &::placeholder {
        font-size: 13px;
      }
    }

    button svg {
      font-size: 16px;
    }
  }
`;

const CommentBox = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 0px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.16);
  z-index: 1000;
  width: 90%;
  max-width: 500px;
  padding: 24px;

  h3 {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
  }

  textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 13px;
    font-family: inherit;
    resize: vertical;
    min-height: 120px;
    color: #1f2937;

    &:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
  }

  .modal-btns {
    display: flex;
    gap: 12px;
    margin-top: 16px;

    button {
      flex: 1;
      padding: 10px 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      font-size: 13px;
      transition: all 0.2s;

      &.save {
        background: #2563eb;
        color: white;

        &:hover {
          background: #1d4ed8;
        }
      }

      &.cancel {
        background: #f3f4f6;
        color: #374151;

        &:hover {
          background: #e5e7eb;
        }
      }
    }
  }
`;

const Post = ({ post, posts }) => {
  const [postbox, setPostbox] = useState(post);
  const [userdata, setUserdata] = useState(null);
  const [like, setLike] = useState(post.is_upvoted);
  const [filledLike, setFilledLike] = useState(post.is_upvoted ? <FavoriteRoundedIcon /> : <FavoriteBorderOutlinedIcon />);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState({ content: '' });
  const [showComment, setShowComment] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editContent, setEditContent] = useState(postbox.content);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        setUserdata(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing userData:', error);
      }
    }
  }, []);



  useEffect(() => {
    if (postbox && postbox.id) {
      console.log('Post loaded with data:', {
        id: postbox.id,
        author: postbox.author,
        author_img: postbox.author_img,
        blog_img: postbox.blog_img,
        content: postbox.content?.substring(0, 50) + '...'
      });
      console.log('Full post data:', postbox);
      fetchComments();
    }
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get('/comments', {
        params: { blog: postbox.id },
      });
      console.log('Comments fetched successfully:', response.data);
      setComments(response.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error.response?.data || error.message);
      setComments([]);
    }
  };

  const handleLike = async () => {
    try {
      const response = await axios.post('/upvote', {
        username: userdata.username,
        id: postbox.id,
        time: moment().fromNow(),
      });
      setLike(response.data.is_upvoted);
      setFilledLike(response.data.is_upvoted ? <FavoriteRoundedIcon /> : <FavoriteBorderOutlinedIcon />);
      setPostbox(response.data);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setCommentInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.content.trim()) return;

    try {
      console.log('Submitting comment:', {
        author: userdata.username,
        blog: postbox.id,
        content: commentInput.content,
      });
      
      const response = await axios.post('/comment', {
        author: userdata.username,
        blog: postbox.id,
        content: commentInput.content,
        time: moment().fromNow(),
      });
      
      console.log('Comment submitted successfully:', response.data);
      setCommentInput({ content: '' });
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error.response?.data || error.message);
    }
  };

  const handleEdit = () => {
    setEditContent(postbox.content);
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`/posts/${post.id}`, {
        ...postbox,
        content: editContent,
      });
      setPostbox(response.data);
      setEditOpen(false);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/posts/${post.id}`);
      // Handle deletion in parent component
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (!userdata) return null;

  return (
    <>
      {editOpen && (
        <ModalOverlay onClick={() => setEditOpen(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <h3>Edit Post</h3>
            <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
            <div className="modal-btns">
              <button className="save" onClick={handleSaveEdit}>Save</button>
              <button className="cancel" onClick={() => setEditOpen(false)}>Cancel</button>
            </div>
          </Modal>
        </ModalOverlay>
      )}

      <PostBox>
        {/* Header */}
        <Header>
          <UserHeader>
            {postbox.author_img && (
            <Avatar
              src={`${api.url}:8000${postbox.author_img}`}
              alt={postbox.author}
            />
            )}
            <UserMeta>
              <Link to={`/profile/${post.author}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                <span className="username">{postbox.author}</span>
              </Link>
              <span style={{ fontSize: '13px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                · {postbox.post_date}
              </span>
            </UserMeta>
          </UserHeader>
          <MenuButton onClick={() => setShowMenu(!showMenu)}>
            <MoreVertRoundedIcon />
            {showMenu && (
              <MenuDropdown>
                {postbox.author === userdata.username && (
                  <>
                    <button onClick={handleEdit}>
                      <AiOutlineDelete /> Edit
                    </button>
                    <button onClick={handleDelete}>
                      <AiOutlineDelete /> Delete
                    </button>
                  </>
                )}
              </MenuDropdown>
            )}
          </MenuButton>
        </Header>

        {/* Content */}
        <Content>
          <PostTextBox>
            {postbox.content}
          </PostTextBox>
          {postbox.blog_img && (
            <PostImg
              src={`${api.url}:8000${postbox.blog_img}`}
              alt="Post"
              onError={(e) => {
                console.log('Post image failed to load from:', e.target.src);
                e.target.style.display = 'none';
              }}
              onLoad={(e) => {
                console.log('Post image loaded successfully from:', e.target.src);
              }}
            />
          )}
        </Content>

        {/* Stats */}
        <Stats>
          <span>{postbox.upvote} likes</span>
          <span>{comments.length} comments</span>
        </Stats>

        {/* Actions */}
        <Actions>
          <ActionBtn onClick={handleLike} className={like ? 'liked' : ''}>
            {filledLike}
            Like
          </ActionBtn>
          <ActionBtn onClick={() => setShowComment(!showComment)}>
            <MessageRoundedIcon />
            Comment
          </ActionBtn>
          <ActionBtn>
            <ShareOutlinedIcon />
            Share
          </ActionBtn>
        </Actions>

        {/* Comments */}
        {showComment && (
          <CommentsArea>
            <CommentInputBox>
              {userdata?.profile_img && (
              <Avatar
                src={`${api.url}:8000${userdata.profile_img}`}
                alt="Your profile"
              />
              )}
              <CommentFieldForm onSubmit={handleCommentSubmit}>
                <input
                  type="text"
                  placeholder="Write a comment..."
                  name="content"
                  value={commentInput.content}
                  onChange={handleCommentChange}
                  required
                />
                <button type="submit">
                  <SendRoundedIcon />
                </button>
              </CommentFieldForm>
            </CommentInputBox>

            <CommentBox>
              {comments.map((cmt) => (
                <Comments key={cmt.id} cmt={cmt} cmnt={comments} post={post} />
              ))}
            </CommentBox>
          </CommentsArea>
        )}
      </PostBox>
    </>
  );
};

export default Post;
