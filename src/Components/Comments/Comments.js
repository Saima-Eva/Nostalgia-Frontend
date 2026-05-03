import React, { useState } from 'react';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import styled from 'styled-components';
import api from '../../util/api';

const CommentContainer = styled.div`
  display: flex;
  gap: 10px;
  margin: 0;
  padding: 0;
  align-items: flex-start;
`;

const CommentAvatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid #e5e7eb;
  cursor: pointer;
`;

const AvatarPlaceholder = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f97316 0%, #fb7185 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
`;

const CommentContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CommentAuthor = styled.span`
  font-weight: 600;
  font-size: 14px;
  color: #111827;
`;

const AuthorBadge = styled.span`
  font-size: 11px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
`;

const CommentText = styled.div`
  margin: 0;
  padding: 0;
  font-size: 14px;
  color: #334155;
  line-height: 1.3;
  white-space: pre-wrap;
  word-break: break-word;
`;

const CommentMeta = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 12px;
  color: #94a3b8;
  margin-top: 2px;
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  gap: 5px;
  color: #6b7280;
  font-size: 12px;

  &:hover {
    color: #ef4444;
  }
`;

const LikeCount = styled.span`
  font-size: 12px;
  color: #9ca3af;
`;

const formatTime = (dateValue) => {
  try {
    if (!dateValue) return 'just now';

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
      return 'just now';
    }

    const now = new Date();
    const diffMs = now - date;
    if (diffMs < 0) return 'just now';

    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  } catch {
    return 'just now';
  }
};

const Comments = ({ cmt, post, isOwnComment = false }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(cmt.likes ? cmt.likes : 0);
    const [showOptions, setShowOptions] = useState(false);

    const authorName = cmt.author || cmt.username || cmt.user_name || 'User';
    const commentText = cmt.content || cmt.comment || cmt.text || '';
    const commentTime = cmt.time || cmt.created_at || cmt.createdAt || cmt.post_date;

    const handleLike = () => {
        setIsLiked(!isLiked);
        if (!isLiked) {
            setLikeCount(likeCount + 1);
        } else {
            setLikeCount(Math.max(0, likeCount - 1));
        }
    };

    const authorImgPath = cmt.author_img || cmt.profilePic || cmt.profile_pic;
    const authorImg = authorImgPath
      ? (authorImgPath.startsWith('http') ? authorImgPath : `${api.url}:8000${authorImgPath}`)
      : null;
    const authorInitial = authorName?.charAt(0)?.toUpperCase() || 'U';

    return (
        <CommentContainer>
            {authorImg ? (
              <CommentAvatar 
                src={authorImg}
                alt={authorName}
              />
            ) : (
              <AvatarPlaceholder>{authorInitial}</AvatarPlaceholder>
            )}
            
            <CommentContent>
                <CommentHeader>
                  <CommentAuthor>{authorName}</CommentAuthor>
                  {cmt.isAdmin && <AuthorBadge>Admin</AuthorBadge>}
                  {cmt.isAuthor && <AuthorBadge>Author</AuthorBadge>}
                </CommentHeader>

                <CommentText>{commentText}</CommentText>

                <CommentMeta>
                  <span>{formatTime(commentTime)}</span>
                  <ActionButton onClick={handleLike}>
                      {isLiked ? <FavoriteRoundedIcon style={{ color: '#ef4444', fontSize: '16px' }} /> : <FavoriteBorderOutlinedIcon style={{ fontSize: '16px' }} />}
                      {likeCount > 0 && <LikeCount>{likeCount}</LikeCount>}
                  </ActionButton>
                </CommentMeta>
            </CommentContent>
        </CommentContainer>
    );
};

export default Comments;
