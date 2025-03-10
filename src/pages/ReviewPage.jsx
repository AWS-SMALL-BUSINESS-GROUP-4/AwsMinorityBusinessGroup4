import React, { useState } from 'react';
import NavBar from '../components/NavBar.jsx'
import './ReviewPage.css'

function ReviewPage() {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  
  // Sample recent reviews data
  const recentReviews = [
    {
      id: 1,
      name: 'John Doe',
      rating: 5,
      date: '1/1/1970',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
      id: 2,
      name: 'John Doe',
      rating: 5,
      date: '1/1/1970',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  ];

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleReviewTextChange = (e) => {
    setReviewText(e.target.value);
  };

  const handlePostReview = () => {
    // Logic to post the review
    console.log('Posting review:', { rating, reviewText });
    // Reset form after submission
    setRating(0);
    setReviewText('');
  };

  // Render star rating component
  const StarRating = ({ value, interactive = false }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          onClick={interactive ? () => handleRatingClick(i) : undefined}
          className={`${interactive ? "star-interactive" : "star"} ${i <= value ? "star-selected" : "star-unselected"}`}
        >
          {i <= value ? '★' : '☆'}
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="business-management-container">
      {/* Header/Navigation */}
      <NavBar/>

      {/* Main Content */}
      <main className="main-content">
        <div className="review-form-container">
          <h2 className="business-name">Negril - DC</h2>
          <div className="review-form">
            <div className="rating-section">
              <span>Please leave a rating: </span>
              <StarRating value={rating} interactive={true} />
            </div>
            <textarea 
              className="review-textarea" 
              placeholder="Start your review..." 
              value={reviewText}
              onChange={handleReviewTextChange}
            />
          </div>
          <button 
            className="post-review-button"
            onClick={handlePostReview}
          >
            Post Review
          </button>
        </div>

        <div className="recent-reviews-container">
          <h2 className="recent-reviews-title">Recent Reviews</h2>
          {recentReviews.map(review => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="user-profile">
                  <div className="avatar-circle"></div>
                  <span className="user-name">{review.name}</span>
                </div>
                <div className="review-details">
                  <div className="star-rating">
                    <StarRating value={review.rating} />
                  </div>
                  <span className="review-date">{review.date}</span>
                </div>
              </div>
              <p className="review-content">{review.content}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ReviewPage;
