import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentSection = ({ productType, productId }) => {
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [allComments, setAllComments] = useState([]);
  const [userComment, setUserComment] = useState(null); // user's existing comment

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
  }, []);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/comments/${productType}/${productId}`);
        setAllComments(response.data);

        // Find if user already posted a comment
        if (user) {
          const existing = response.data.find(c => c.user_id === user.id);
          if (existing) {
            setUserComment(existing);
            setComment(existing.comment);
            setRating(existing.review);
          } else {
            setUserComment(null);
            setComment('');
            setRating(0);
          }
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error.response?.data || error.message);
      }
    };
    fetchComments();
  }, [productType, productId, user]);

  // Rating click handler
  const handleRating = (value) => setRating(value);

  // Post new comment
  const handlePost = async () => {
    if (!comment || rating === 0) {
      alert('Please enter a comment and rating.');
      return;
    }
    try {
      const payload = {
        user_id: user.id,
        product_type: productType,
        product_id: productId,
        comment,
        review: rating,
      };
      await axios.post('http://localhost:5000/api/comments', payload);

      // Reload comments after posting
      const res = await axios.get(`http://localhost:5000/api/comments/${productType}/${productId}`);
      setAllComments(res.data);
      setUserComment(res.data.find(c => c.user_id === user.id));
      setComment('');
      setRating(0);
    } catch (error) {
      console.error('Failed to post comment:', error);
      alert('Something went wrong while posting the comment.');
    }
  };

  // Update existing comment
  const handleUpdate = async () => {
    if (!comment || rating === 0) {
      alert('Please enter a comment and rating.');
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/comments/${userComment.id}`, {
        comment,
        review: rating,
      });

      // Reload comments after update
      const res = await axios.get(`http://localhost:5000/api/comments/${productType}/${productId}`);
      setAllComments(res.data);
      setUserComment(res.data.find(c => c.user_id === user.id));
    } catch (error) {
      console.error('Failed to update comment:', error);
      alert('Something went wrong while updating the comment.');
    }
  };

  // Delete existing comment
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your comment?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/comments/${userComment.id}`);

      // Reload comments after delete
      const res = await axios.get(`http://localhost:5000/api/comments/${productType}/${productId}`);
      setAllComments(res.data);
      setUserComment(null);
      setComment('');
      setRating(0);
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Something went wrong while deleting the comment.');
    }
  };

  return (
    <div className="mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Leave a Comment</h2>

      {!user ? (
        <p className="text-gray-600">
          <a href="/login" className="text-blue-600 hover:underline">Login</a> to post a comment.
        </p>
      ) : (
        <>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment..."
            rows={4}
          />

          <div className="flex items-center mb-4 space-x-1">
            {[1, 2, 3, 4, 5].map((val) => (
              <span
                key={val}
                className={`text-2xl cursor-pointer ${val <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                onClick={() => handleRating(val)}
              >
                ★
              </span>
            ))}
          </div>

          {userComment ? (
            <div className="flex space-x-3">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                onClick={handleUpdate}
              >
                Update Comment
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                onClick={handleDelete}
              >
                Delete Comment
              </button>
            </div>
          ) : (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={handlePost}
            >
              Post Comment
            </button>
          )}
        </>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">All Comments</h3>
        {allComments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          allComments.map((c) => (
            <div key={c.id} className="border-t pt-4 flex space-x-3 mb-4">
              <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-user" className="svg-inline--fa fa-circle-user text-indigo-600 text-xl" style={{ fontSize: '30px' }} role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M399 384.2C376.9 345.8 335.4 320 288 320l-64 0c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"></path></svg>
              <div>
                <p className="font-semibold">{c.name}</p>
                <div className="flex space-x-1 text-yellow-400">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <span key={val} className={val <= c.review ? '' : 'text-gray-300'}>
                      ★
                    </span>
                  ))}
                </div>
                <p className="mt-1 text-gray-700">{c.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
