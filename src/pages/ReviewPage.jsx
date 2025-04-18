import React, { useState, useContext, useEffect } from "react";
import NavBar from "../components/NavBar.jsx";
import "./ReviewPage.css";
import { AuthContext } from "../AuthContext";
import { Login } from "../LoginFunctions";
import { generateClient } from "aws-amplify/api";
import { useNavigate, useParams } from "react-router-dom";
import { getCurrentUser } from "@aws-amplify/auth";
import { useAuth } from "../context/AuthContext.jsx";
import Header from "../components/Header.jsx";

function ReviewPage() {
  const [rating, setRating] = useState(0);
  const [validBusiness, setValidBusiness] = useState(false);
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState("Negril - DC");
  const [reviewText, setReviewText] = useState("");
  const [recentReviews, setRecentReivews] = useState([]);
  const [file, setFile] = useState(null);

  //const { isAuthenticated, userId, setUserId, authLoading } = useContext(AuthContext);
  const { isLoggedIn, user } = useAuth();

  const client = generateClient();
  const businessId = useParams().id ?? null;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBusiness() {
      if (businessId == null || businessId === "" || !isLoggedIn) {
        setValidBusiness(false);
        setLoading(false);
        return;
      }
      const response = await client.models.Business.get(
        { id: businessId },
        {
          selectionset: ["name"],
        }
      );

      setValidBusiness(response.data != null);
      if (validBusiness) setBusinessName(response.data.name);
      setLoading(false);
    }

    fetchBusiness();
  }, [businessId, client, isLoggedIn]);

  // useEffect(() => {
  //   async function fetchUserId() {
  //     try {
  //       const response = await getCurrentUser();
  //       setUserId(response.userId);
  //     } catch(error) {
  //       setUserId(null);
  //     }
  //   }

  //   fetchUserId();
  // }, [client]);

  useEffect(() => {
    const sub = client.models.Review.observeQuery({
      filter: {
        businessId: {
          contains: businessId,
        },
      },
      selectionSet: ["rating", "content", "reviewDate", "user.name.*"],
    }).subscribe({
      next: ({ items, isSynced }) => {
        setRecentReivews([...items]);
      },
    });
    return () => sub.unsubscribe();
  }, [recentReviews]);

  // Sample recent reviews data
  // const recentReviews = [
  //   {
  //     id: 1,
  //     name: 'John Doe',
  //     rating: 5,
  //     date: '1/1/1970',
  //     content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  //   },
  //   {
  //     id: 2,
  //     name: 'John Doe',
  //     rating: 5,
  //     date: '1/1/1970',
  //     content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  //   }
  // ];

  //const recentReviews = [];

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleReviewTextChange = (e) => {
    setReviewText(e.target.value);
  };

  const handlePostReview = async () => {
    // Logic to post the review
    const timestamp = Math.floor(Date.now() / 1000);
    console.log("Posting review:", {
      businessId,
      ...user.userId,
      rating,
      reviewText,
      timestamp,
    });
    const response = await client.models.Review.create({
      businessId: businessId,
      userId: user.userId,
      rating: rating,
      content: reviewText,
      reviewDate: timestamp,
    });
    console.log("Review upload response: ", response);

    // Update the average rating in the Business model
    try {
      // Fetch all reviews for the business
      const reviewsResponse = await client.models.Review.list({
        filter: {
          businessId: {
            eq: businessId,
          },
        },
        selectionSet: ["rating"],
      });

      const reviews = reviewsResponse.data;
      if (reviews && reviews.length > 0) {
        // Calculate the average rating
        const totalRating = reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        const averageRating = parseFloat(
          (totalRating / reviews.length).toFixed(1)
        );

        // Update the Business model with the new average rating
        await client.models.Business.update({
          id: businessId,
          averageRating: averageRating,
        });
        console.log("Updated business average rating:", averageRating);
      } else {
        // If no reviews exist (unlikely since we just added one), set averageRating to the current rating
        await client.models.Business.update({
          id: businessId,
          averageRating: parseFloat(rating.toFixed(1)),
        });
        console.log("Set initial business average rating:", rating);
      }
    } catch (error) {
      console.error("Error updating business average rating:", error);
    }

    handleUpload();
    // Reset form after submission
    setRating(0);
    setReviewText("");
  };

  // Render star rating component
  const StarRating = ({ value, interactive = false }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={interactive ? () => handleRatingClick(i) : undefined}
          className={`${interactive ? "star-interactive" : "star"} ${
            i <= value ? "star-selected" : "star-unselected"
          }`}
        >
          {i <= value ? "★" : "☆"}
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
          bucket: "AWSMBG4-private",
        },
      });
    } else {
      console.log("No file selected");
    }
  };

  const handleLogin = () => {
    // setLoading(true);
    // Login();
    navigate("/login");
  };

  if (loading /*|| authLoading*/) return <p>Loading...</p>;

  if (isLoggedIn === false) {
    return (
      <>
        <h1>Please log in to write a review!</h1>
        <button className="post-review-button" onClick={handleLogin}>
          Login
        </button>
      </>
    );
  }

  // if(!validBusiness)
  //   return<p>Error - Invalid Business</p>

  return (
    <div className="business-management-container">
      {/* Header/Navigation */}
      {/* <NavBar/> */}
      <Header />

      {/* Main Content */}
      <main className="main-content">
        <div className="review-form-container">
          <h2 className="business-name">{businessName}</h2>
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
            <input type="file" onChange={handleFileChange} />
          </div>
          <button className="post-review-button" onClick={handlePostReview}>
            Post Review
          </button>
        </div>

        <div className="recent-reviews-container">
          <h2 className="recent-reviews-title">Recent Reviews</h2>
          {recentReviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="user-profile">
                  <div className="avatar-circle"></div>
                  <span className="user-name">
                    {review.user.name.firstName +
                      " " +
                      review.user.name.lastName}
                  </span>
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
}

export default ReviewPage;
