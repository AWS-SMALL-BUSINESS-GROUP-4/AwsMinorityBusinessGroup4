import { useState, useRef, useEffect } from 'react';
import { uploadData, getUrl, list } from 'aws-amplify/storage';
import reactLogo from '../assets/react.svg'
import '../App.css'
import '../components/ContainerStyles.css'
import './BusinessManagementPage.css'
import './BusinessManagementPicturePage.css'
import '../components/TextStyles.css'
import BusinessNavBar from '../components/BusinessNavBar'
import BusinessManagementSidebar from '../components/BusinessManagementSideBar';
import { StorageImage } from '@aws-amplify/ui-react-storage';
import { useParams } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';

function BusinessManagementPicturesPage() {

    const outsideImgUpload = useRef(null);
    const businessId = useParams().id;
    const client = generateClient();

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
    const [loading, setLoading] = useState(false);
    const [paths, setPaths] = useState([]);

    useEffect(() => {
        async function fetchPictures() {
            // setLoading(true);
            // const response = await client.models.Business.get(
            //     { id: businessId },
            //     { selectionSet: ['photos'] },
            // );
            // if(response.errors) {
            //     console.error("Error in retreiving business photos: ", response.errors);
            // }
            // else {
            //     await setImages(response.data.photos);
            // }
            // setLoading(false);

            const response = await list({
                path: `business-photos/${businessId}/`,
                options: {             
                    // Specify a target bucket using name assigned in Amplify Backend
                    bucket: 'AWSMBG4-private'
                }
            });

            setPaths(response.items.map(item => item.path));
        }

        fetchPictures();
    }, [businessId])

    const handleDelete = (index) => {
        //const confirm = window.confirm("Are you sure you want to delete this picture?");
        if(confirm) {
            // Delete the photo
        }
    }

    const handleOutsideImgUpload = () => {
        outsideImgUpload.current.click();
    }

    const handleFileUpload = async (event) => {
        const file = event.target.files?.[0];
        if(file) {
            await setNewImg(file);

            const response = await uploadData({
                path: `business-photos/${businessId}/${file.name}`,
                data: newImg,
                options: {             
                    // Specify a target bucket using name assigned in Amplify Backend
                    bucket: 'AWSMBG4-private'
                }
            }).result;

            console.log("Result of uploading image: ", response.path);

            setPaths([...paths, response.path]);

            // const linkToStorageFile = await getUrl({
            //     path: response.path,
            // });

            // console.log("New image url: ", linkToStorageFile.url.href);
            // console.log("New images:", [linkToStorageFile.url.toString(), ...images]);

            // const response2 = await client.models.Business.update({
            //     id: businessId,
            //     photos: [linkToStorageFile.url.toString(), ...images]
            // });
            
            // await setImages([linkToStorageFile.url.href, ...images]);

            // console.log("Result of database update: ", response2);
        }
    }

    //console.log("Images:", images);
    console.log("Paths before render:", paths);
    return (
        <>
            <BusinessNavBar/>
            <div className='sidebar-page-container'>
                <BusinessManagementSidebar id={businessId}/>
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
                            {/* {images.map((source, index) => (
                                <div key={index} className="img-with-button"> 
                                    <img src={source}/>
                                    <button className="btn" onClick={handleDelete(index)}>Delete</button>
                                </div>
                            ))} */}
                            {paths.map((source, index) => (
                                <StorageImage key={index} alt="business photo" path={source}/>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            
        </>
    );
}

export default BusinessManagementPicturesPage