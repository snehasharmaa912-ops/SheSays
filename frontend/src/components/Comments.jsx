import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getComments, createComment, deleteComment } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  const units = [
    ['year', 31536000], ['month', 2592000], ['day', 86400],
    ['hour', 3600], ['minute', 60],
  ]
  for (const [label, secs] of units) {
    const value = Math.floor(seconds / secs)
    if (value >= 1) return `${value} ${label}${value > 1 ? 's' : ''} ago`
  }
  return 'just now'
}

function CommentForm({ onSubmit, placeholder, submitLabel, onCancel }) {
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setSubmitting(true)
    try {
      await onSubmit(text.trim())
      setText('')
      if (onCancel) onCancel()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        rows="3"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        required
      />
      <div className="comment-form-actions">
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        )}
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Posting...' : submitLabel}
        </button>
      </div>
    </form>
  )
}

function CommentItem({ comment, replies, postAuthorId, currentUser, onReply, onDelete }) {
  const [replying, setReplying] = useState(false)
  const isPostAuthor = comment.author === postAuthorId

  return (
    <li className="comment-item">
      <div className="comment-header">
        <span className="comment-author">
          {comment.authorName}
          {isPostAuthor && <span className="comment-author-badge">Author</span>}
        </span>
        <span className="comment-time">{timeAgo(comment.createdAt)}</span>
      </div>
      <p className="comment-content">{comment.content}</p>
      <div className="comment-actions">
        {currentUser && (
          <button className="comment-reply-btn" onClick={() => setReplying((r) => !r)}>
            {replying ? 'Cancel' : 'Reply'}
          </button>
        )}
        {currentUser && currentUser._id === comment.author && (
          <button className="comment-delete-btn" onClick={() => onDelete(comment._id)}>
            Delete
          </button>
        )}
      </div>

      {replying && (
        <CommentForm
          placeholder={`Replying to ${comment.authorName}...`}
          submitLabel="Post Reply"
          onCancel={() => setReplying(false)}
          onSubmit={(text) => onReply(text, comment._id)}
        />
      )}

      {replies.length > 0 && (
        <ul className="comment-replies">
          {replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              replies={[]}
              postAuthorId={postAuthorId}
              currentUser={currentUser}
              onReply={onReply}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export default function Comments({ slug, postAuthorId }) {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getComments(slug)
      .then(setComments)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  const handleAdd = async (text, parentComment = null) => {
    setError('')
    try {
      const comment = await createComment(slug, { content: text, parentComment })
      setComments((prev) => [...prev, comment])
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return
    try {
      await deleteComment(slug, commentId)
      setComments((prev) => prev.filter((c) => c._id !== commentId && c.parentComment !== commentId))
    } catch (err) {
      setError(err.message)
    }
  }

  const topLevel = comments.filter((c) => !c.parentComment)
  const repliesFor = (id) => comments.filter((c) => c.parentComment === id)

  return (
    <section className="comments-section">
      <h2>Comments {comments.length > 0 && `(${comments.length})`}</h2>

      {user ? (
        <CommentForm
          placeholder="Share your thoughts..."
          submitLabel="Post Comment"
          onSubmit={(text) => handleAdd(text)}
        />
      ) : (
        <p className="comment-login-prompt">
          <Link to="/login">Log in</Link> to join the conversation.
        </p>
      )}

      {error && <p className="form-status error">{error}</p>}

      {loading && <p>Loading comments...</p>}
      {!loading && topLevel.length === 0 && <p className="no-comments">No comments yet. Be the first to say something.</p>}

      <ul className="comment-list">
        {topLevel.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            replies={repliesFor(comment._id)}
            postAuthorId={postAuthorId}
            currentUser={user}
            onReply={handleAdd}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </section>
  )
        }
