import { useState, useRef } from 'react';
import { uploadData } from 'aws-amplify/storage';
import reactLogo from '../assets/react.svg'
import '../App.css'
import '../components/ContainerStyles.css'
import './BusinessManagementPage.css'
import './BusinessManagementPicturePage.css'
import '../components/TextStyles.css'
import BusinessNavBar from '../components/BusinessNavBar'
import BusinessManagementSidebar from '../components/BusinessManagementSideBar';
import { useParams } from 'react-router-dom';

function BusinessManagementPicturesPage() {

    const outsideImgUpload = useRef(null);
    const id = useParams().id;

    const [images, setImages] = useState([
        'https://media.cnn.com/api/v1/images/stellar/prod/gettyimages-1273516682.jpg?c=original',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRSnyNJ8vSZR-n2Ou81gUeoGvwgj-8XhyYBA&s',
        'https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/healthy-eating-ingredients-1296x728-header.jpg?w=1155&h=1528',
        'https://media.cnn.com/api/v1/images/stellar/prod/gettyimages-1273516682.jpg?c=original',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRSnyNJ8vSZR-n2Ou81gUeoGvwgj-8XhyYBA&s',
        'https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/healthy-eating-ingredients-1296x728-header.jpg?w=1155&h=1528',
        'https://media.cnn.com/api/v1/images/stellar/prod/gettyimages-1273516682.jpg?c=original',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRSnyNJ8vSZR-n2Ou81gUeoGvwgj-8XhyYBA&s',
        'https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/healthy-eating-ingredients-1296x728-header.jpg?w=1155&h=1528',
        'https://media.cnn.com/api/v1/images/stellar/prod/gettyimages-1273516682.jpg?c=original',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRSnyNJ8vSZR-n2Ou81gUeoGvwgj-8XhyYBA&s',
        'https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/healthy-eating-ingredients-1296x728-header.jpg?w=1155&h=1528',
    ]);

    const [newImg, setNewImg] = useState();

    const handleDelete = (index) => {
        //const confirm = window.confirm("Are you sure you want to delete this picture?");
        if(confirm) {
            // Delete the photo
        }
    }

    const handleOutsideImgUpload = () => {
        outsideImgUpload.current.click();
    }

    const handleFileUpload = (event) => {
        const file = event.target.files?.[0];
        if(file) {
            setNewImg(file);

            uploadData({
                path: `business-photos/guest/${file.name}`,
                data: newImg,
                options: {             
                    // Specify a target bucket using name assigned in Amplify Backend
                    bucket: 'AWSMBG4-private'
                }
            });
        }
    }


    return (
        <>
            <BusinessNavBar/>
            <div className='sidebar-page-container'>
                <BusinessManagementSidebar id={id}/>
                {/*Main*/}
                <div className='main'>
                    <h1>Pictures</h1>
                    <hr/>
                    {/*<div>
                        <div className='spread'>
                            <h2>Outside</h2>
                            <input type='file' ref={outsideImgUpload} accept='image/*' className='hidden'/>
                            <button className="btn" onClick={handleOutsideImgUpload}>Upload Image</button>
                        </div>
                        <div className='spread scroll'>
                            {images.map((source, index) => (
                                <div key={index} className="img-with-button"> 
                                    <img src={source}/>
                                    <button className="btn" onClick={handleDelete(index)}>Delete</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <hr/>
                    <div>
                        <div className='spread'>
                            <h2>Inside</h2>
                            <input type='file' ref={outsideImgUpload} accept='image/*' className='hidden'/>
                            <button className="btn" onClick={handleOutsideImgUpload}>Upload Image</button>
                        </div>
                    </div>
                    <hr/>
                    <div>
                        <div className='spread'>
                            <h2>Menu Items</h2>
                            <input type='file' ref={outsideImgUpload} accept='image/*' className='hidden'/>
                            <button className="btn" onClick={handleOutsideImgUpload}>Upload Image</button>
                        </div>
                    </div>
                    <hr/>*/}
                    <div>
                        <div className='spread'>
                            <h2>All Pictures</h2>
                            <input type='file' ref={outsideImgUpload} accept='image/*' className='hidden' onChange={handleFileUpload}/>
                            <button className="btn" onClick={handleOutsideImgUpload}>Upload Image</button>
                        </div>
                        <div className='spread scroll'>
                            {images.map((source, index) => (
                                <div key={index} className="img-with-button"> 
                                    <img src={source}/>
                                    <button className="btn" onClick={handleDelete(index)}>Delete</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            
        </>
    );
}

export default BusinessManagementPicturesPage