import React, { useState, useContext } from 'react';
import NavBar from '../components/NavBar.jsx'
import './ReviewPage.css'
import { AuthContext } from "../AuthContext"
import { Login } from "../LoginFunctions";
import { generateClient } from 'aws-amplify/api';
import { useParams } from 'react-router-dom';


function ReviewPage() {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [file, setFile] = useState(null);
  
  const { isAuthenticated, loading, userId } = useContext(AuthContext);

  const client = generateClient();
  const businessId = useParams();
  
  
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

  const handlePostReview = async () => {
    // Logic to post the review
    const timestamp =  Math.floor(Date.now() / 1000);
    console.log('Posting review:', { rating, reviewText, timestamp });
    const response = await client.models.Review.create({
      businessId: businessId,
      userId: userId,
      rating: rating,
      content: reviewText,
      reviewDate: timestamp
    });
    console.log("Review upload response: ", response);
    handleUpload();
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


  // Handle file upload
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      console.log("Uploading:", file.name);
      // Add your upload logic here (e.g., sending to a server)
      uploadData({
        path: `users/{user_id}/pictures/${file.name}`,
        data: file,
        options: {
          bucket: 'AWSMBG4-private'
        }
      });
    } else {
      console.log("No file selected");
    }
  };

  if(loading)
      return (<p>Loading...</p>)

  if(isAuthenticated === false) {
    return(
      <>
        <h1>Please log in to write a review!</h1>
        <button className='post-review-button' onClick={Login}>Login</button>
      </>
    )
  }

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
            <input type="file" onChange={handleFileChange}/>
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
