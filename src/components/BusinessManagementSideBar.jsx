import { useNavigate } from 'react-router-dom';
import '../pages/BusinessManagementPage.css';

function BusinessManagementSidebar({id}) {
    const navigate = useNavigate();
    const handleNavigateToMain = () => {
        navigate("/business-profile/"+id);
    }
    const handleNavigateToPhotos = () => {
        navigate("/business-profile/"+id+"/photos");
    }
    const handleNavigateToReviews = () => {
        console.log("Navigating...");
    }

    return (
      <div className="revamped-sidebar">
        <a onClick={handleNavigateToMain} className="sidebar-link active">Business Information</a>
        <a onClick={handleNavigateToReviews} className="sidebar-link">Reviews</a>
        <a onClick={handleNavigateToPhotos} className="sidebar-link">Photos</a>
      </div>
    );
}

export default BusinessManagementSidebar;