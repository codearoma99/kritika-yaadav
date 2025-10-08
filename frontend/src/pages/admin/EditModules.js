import React, { useEffect, useState } from 'react';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Link, useParams } from 'react-router-dom';
import { faCloudUploadAlt, faTimes, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditModules = () => {
    const { id } = useParams();
    const [courseTitle, setCourseTitle] = useState('');
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchCourseAndModules = async () => {
            try {
                console.log('🔄 Loading course and modules...');
                setLoading(true);

                // === 📘 Fetch course details ===
                const courseUrl = `http://localhost:5000/api/courses/${id}`;
                console.log(`📡 Fetching course from: ${courseUrl}`);

                const courseRes = await fetch(courseUrl);
                if (!courseRes.ok) {
                    const errText = await courseRes.text();
                    throw new Error(`Failed to fetch course: ${courseRes.status} ${errText}`);
                }

                const courseData = await courseRes.json();
                console.log('✅ Course data fetched:', courseData);

                setCourseTitle(courseData.title || '');

                // === 🎬 Fetch modules for the course ===
                const modulesUrl = `http://localhost:5000/api/course-modules/${id}`;
                console.log(`📡 Fetching modules from: ${modulesUrl}`);

                const modulesRes = await fetch(modulesUrl);
                if (!modulesRes.ok) {
                    // If no modules found, that's okay - we'll start with empty
                    if (modulesRes.status === 404) {
                        console.log('No existing modules found. Starting with empty module.');
                        setModules([createEmptyModule()]);
                        setLoading(false);
                        return;
                    }
                    const errText = await modulesRes.text();
                    throw new Error(`Failed to fetch modules: ${modulesRes.status} ${errText}`);
                }

                const modulesData = await modulesRes.json();
                console.log('Modules data fetched:', modulesData);

                // === Check & format modules ===
                if (modulesData.modules && modulesData.modules.length > 0) {
                    const formattedModules = modulesData.modules.map(module => ({
                        id: module.id,
                        title: module.title || '',
                        duration: module.duration || '',
                        description: module.description || '',
                        video: null,
                        videoTitle: module.video_title || '',
                        videoThumbnail: null,
                        existingVideo: module.video || '',
                        existingThumbnail: module.video_thumbnail || '',
                        isNewVideo: false,
                        isNewThumbnail: false
                    }));

                    console.log('Formatted modules:', formattedModules);
                    setModules(formattedModules);
                    setEditing(true);
                } else {
                    console.log('No existing modules found. Initializing with empty module.');
                    setModules([createEmptyModule()]);
                }

            } catch (err) {
                console.error('Error during course/modules load:', err);
                setModules([createEmptyModule()]);
            } finally {
                console.log('Finished loading.');
                setLoading(false);
            }
        };

        fetchCourseAndModules();
    }, [id]);

    const createEmptyModule = () => ({
        title: '',
        duration: '',
        description: '',
        video: null,
        videoTitle: '',
        videoThumbnail: null,
        existingVideo: '',
        existingThumbnail: '',
        isNewVideo: true,
        isNewThumbnail: true
    });

    const handleModuleChange = (index, e) => {
        const { name, value, files } = e.target;
        const updatedModules = [...modules];
        
        if (files) {
            updatedModules[index] = {
                ...updatedModules[index],
                [name]: files[0],
                [`isNew${name.charAt(0).toUpperCase() + name.slice(1)}`]: true
            };
        } else {
            updatedModules[index] = {
                ...updatedModules[index],
                [name]: value
            };
        }
        
        setModules(updatedModules);
    };

    const handleDescriptionChange = (index, value) => {
        const updatedModules = [...modules];
        updatedModules[index].description = value;
        setModules(updatedModules);
    };

    const handleAddModule = () => {
        setModules([...modules, createEmptyModule()]);
    };

    const handleRemoveModule = (index) => {
        if (modules.length > 1) {
            const updatedModules = modules.filter((_, i) => i !== index);
            setModules(updatedModules);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formData = new FormData();

            // Prepare modules payload
            const payload = modules.map((module) => ({
                id: module.id || null,
                course_id: parseInt(id),
                title: module.title,
                description: module.description,
                duration: module.duration,
                video_title: module.videoTitle,
                isNewVideo: module.isNewVideo,
                isNewThumbnail: module.isNewThumbnail
            }));

            formData.append('modules', JSON.stringify(payload));

            // Append files
            modules.forEach((module, index) => {
                if (module.isNewVideo && module.video) {
                    formData.append('videos', module.video);
                }
                if (module.isNewThumbnail && module.videoThumbnail) {
                    formData.append('thumbnails', module.videoThumbnail);
                }
            });

            console.log('Submitting modules:', payload);
            console.log('FormData entries:');
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            const res = await fetch('http://localhost:5000/api/course-modules', {
                method: 'POST',
                body: formData,
            });

            const responseText = await res.text();
            console.log('Response status:', res.status);
            console.log('Response text:', responseText);

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Error parsing response:', parseError);
                throw new Error('Invalid response from server');
            }

            if (!res.ok) {
                throw new Error(data.message || `Server error: ${res.status}`);
            }

            alert('Modules saved successfully!');
            // Refresh the page to show updated data
            window.location.reload();
        } catch (err) {
            console.error('Failed to save modules:', err);
            alert(`Error: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const quillModules = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            ['clean']
        ],
    };

    const quillFormats = [
        'bold', 'italic', 'underline',
        'list', 'bullet',
        'link'
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-600 text-lg">Loading course details…</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-100">
            <AdminSidebar />
            <div className="flex flex-col flex-1 md:ml-64">
                <HeaderAdmin />
                <main className="flex-grow p-6 bg-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                            {editing ? 'Edit' : 'Add'} Course Modules
                        </h1>
                        <Link
                            to="/admin/courses"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
                        >
                            View All Courses
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-6">
                            {editing ? 'Edit' : 'Add'} Course Modules for: {courseTitle}
                        </h2>

                        {modules.map((module, index) => (
                            <div key={index} className="mb-8 p-4 border border-gray-200 rounded-lg relative">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-800">
                                        Module {index + 1} {module.id && `(ID: ${module.id})`}
                                    </h3>
                                    {modules.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveModule(index)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Remove module"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    )}
                                </div>

                                {/* Course Name */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Course Name <span className="text-red-500">*</span>
                                    </label>
                                    <p className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                                        {courseTitle}
                                    </p>
                                </div>

                                {/* Module Title */}
                                <div className="mb-4">
                                    <label htmlFor={`title-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                                        Module Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id={`title-${index}`}
                                        name="title"
                                        value={module.title}
                                        onChange={(e) => handleModuleChange(index, e)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                        placeholder="Enter module title"
                                    />
                                </div>

                                {/* Duration */}
                                <div className="mb-4">
                                    <label htmlFor={`duration-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                                        Duration <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id={`duration-${index}`}
                                        name="duration"
                                        value={module.duration}
                                        onChange={(e) => handleModuleChange(index, e)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                        placeholder="e.g., 2 weeks, 4 hours"
                                    />
                                </div>

                                {/* Description */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <ReactQuill
                                        value={module.description}
                                        onChange={(value) => handleDescriptionChange(index, value)}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Enter module description"
                                        className="h-48 mb-12 bg-white"
                                    />
                                </div>

                                {/* Video Title */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Video Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="videoTitle"
                                        value={module.videoTitle}
                                        onChange={(e) => handleModuleChange(index, e)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                        placeholder="Enter video title"
                                    />
                                </div>

                                {/* Video Upload */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Video <span className="text-red-500">*</span>
                                    </label>

                                    {module.existingVideo && !module.isNewVideo && (
                                        <div className="mt-1 p-3 bg-green-50 rounded-md border border-green-200 mb-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 bg-green-100 p-2 rounded-md">
                                                        <FontAwesomeIcon icon={faEdit} className="h-5 w-5 text-green-600" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            Existing video: {module.existingVideo}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Click to replace this video
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            <div className="flex justify-center text-gray-400">
                                                <FontAwesomeIcon icon={faCloudUploadAlt} className="h-12 w-12" />
                                            </div>
                                            <div className="flex text-sm text-gray-600">
                                                <label
                                                    htmlFor={`video-upload-${index}`}
                                                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                                                >
                                                    <span>Upload a video</span>
                                                    <input
                                                        id={`video-upload-${index}`}
                                                        name="video"
                                                        type="file"
                                                        onChange={(e) => handleModuleChange(index, e)}
                                                        className="sr-only"
                                                        accept="video/*"
                                                        required={!module.existingVideo}
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">MP4, MOV up to 100MB</p>
                                        </div>
                                    </div>

                                    {module.video && (
                                        <div className="mt-2 flex items-center justify-between p-3 bg-indigo-50 rounded-md border border-indigo-200">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-md">
                                                    <FontAwesomeIcon icon={faCloudUploadAlt} className="h-5 w-5 text-indigo-600" />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                                        {module.video.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {(module.video.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updatedModules = [...modules];
                                                    updatedModules[index].video = null;
                                                    updatedModules[index].isNewVideo = false;
                                                    setModules(updatedModules);
                                                }}
                                                className="ml-1 p-1 text-gray-400 hover:text-gray-500"
                                            >
                                                <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Video Thumbnail */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Video Thumbnail
                                    </label>

                                    {module.existingThumbnail && !module.isNewThumbnail && (
                                        <div className="mt-1 p-3 bg-green-50 rounded-md border border-green-200 mb-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 bg-green-100 p-2 rounded-md">
                                                        <FontAwesomeIcon icon={faEdit} className="h-5 w-5 text-green-600" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            Existing thumbnail: {module.existingThumbnail}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Click to replace this thumbnail
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        name="videoThumbnail"
                                        onChange={(e) => handleModuleChange(index, e)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        accept="image/*"
                                    />
                                    
                                    {module.videoThumbnail && (
                                        <div className="mt-2 flex items-center justify-between p-3 bg-indigo-50 rounded-md border border-indigo-200">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-md">
                                                    <FontAwesomeIcon icon={faCloudUploadAlt} className="h-5 w-5 text-indigo-600" />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                                        {module.videoThumbnail.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {(module.videoThumbnail.size / 1024).toFixed(2)} KB
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updatedModules = [...modules];
                                                    updatedModules[index].videoThumbnail = null;
                                                    updatedModules[index].isNewThumbnail = false;
                                                    setModules(updatedModules);
                                                }}
                                                className="ml-1 p-1 text-gray-400 hover:text-gray-500"
                                            >
                                                <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Add Module Button */}
                        <div className="mb-6">
                            <button
                                type="button"
                                onClick={handleAddModule}
                                className="flex items-center text-indigo-600 hover:text-indigo-800"
                            >
                                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                Add Another Module
                            </button>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-4 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium disabled:bg-indigo-400 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Saving...' : (editing ? 'Update' : 'Save')} All Modules
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default EditModules;