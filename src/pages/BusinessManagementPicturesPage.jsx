import { useState, useRef, useEffect } from 'react';
import { uploadData, getUrl, remove } from 'aws-amplify/storage';
import '../App.css'
import '../components/ContainerStyles.css'
import './BusinessManagementPage.css'
import './BusinessManagementPicturePage.css'
import '../components/TextStyles.css'
import BusinessNavBar from '../components/BusinessNavBar'
import BusinessManagementSidebar from '../components/BusinessManagementSideBar';
import { useParams } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { StorageImage } from '@aws-amplify/ui-react-storage';

function BusinessManagementPicturesPage() {

    const outsideImgUpload = useRef(null);
    const businessId = useParams().id;
    const client = generateClient();

    const [paths, setPaths] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchPictures() {
            setLoading(true);
            const response = await client.models.Business.get(
                { id: businessId },
                { selectionSet: ['photos'] },
            );
            if(response.errors) {
                console.error("Error in retreiving business photos: ", response.errors);
            }
            else {
                await setPaths(response.data.photos);
                console.log("Photos: ", response.data.photos);
            }
            setLoading(false);
        }

        fetchPictures();
    }, [businessId])

    const handleDelete = async (index) => {
        const confirm = window.confirm("Are you sure you want to delete this picture?");
        if(confirm) {
            try {
                console.log(paths[index]);
                const response = await remove({ 
                    path: paths[index],
                    bucket: 'AWSMBG4-private',
                });

                console.log("Result of removing file: ", response);

                const response2 = await client.models.Business.update({
                    id: businessId,
                    photos: paths.filter(path => path !== paths[index])
                });

                console.log("Result of removing images from database: ", response2);

                setPaths(paths.filter(image => image !== paths[index]));

                console.log("Result of remove images: ", paths);

            } catch (error) {
                console.log('Error ', error);
            }
        }
    }

    const handleOutsideImgUpload = () => {
        outsideImgUpload.current.click();
    }

    const handleFileUpload = async (event) => {
        const file = event.target.files?.[0];

        if(file) {
            try {
                console.log("Uploading");
                const response = await uploadData({
                    path: `business-photos/${businessId}/${file.name}`,
                    data: file,
                    options: {
                        bucket: 'AWSMBG4-private',
                        preventOverwrite: true,
                    }
                }).result;
            

                // const linkToStorageFile = await getUrl({
                //     path: response.path,
                // });

                // const response2 = await client.models.Business.update({
                //     id: businessId,
                //     photos: [linkToStorageFile.url.toString(), ...paths]
                // });

                const response2 = await client.models.Business.update({
                    id: businessId,
                    photos: [response.path, ...paths]
                });
                
                //await setPaths([linkToStorageFile.url.href, ...paths]);
                await setPaths([response.path, ...paths]);
            } catch(error) {
                console.error(error);
                window.alert("Failed to upload image. Try renaming the file to something unique and try again.");
                return;
            }
        }
        else {
            console.log("Did not have a file");
        }
    }

    if(loading)
        return <p>Loading...</p>
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
                            {paths.map((source, index) => (
                                <div key={index} className="img-with-button"> 
                                    {/* <img src={source}/> */}
                                    <StorageImage alt="uploaded photo" path={source} bucket="AWSMBG4-private"/>
                                    <button className="btn" onClick={() => handleDelete(index)}>Delete</button>
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