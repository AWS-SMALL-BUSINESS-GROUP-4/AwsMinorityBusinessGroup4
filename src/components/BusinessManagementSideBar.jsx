import { useNavigate } from 'react-router-dom';
import '../pages/BusinessManagementPage.css'

function BusinessManagementSidebar({id}) {
    const navigate = useNavigate();
    console.log("Photos page href: ", "/business-profile/"+id+"/photos");
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
        <div className="sidebar">
            <a onClick={handleNavigateToMain}>Business Information</a>
            <a onClick={handleNavigateToReviews}>Reviews</a>
            <a onClick={handleNavigateToPhotos}>Photos</a>
        </div>
    );
}

export default BusinessManagementSidebar