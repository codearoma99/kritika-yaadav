import React, { useState, useEffect } from 'react';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { faCloudUploadAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditCourse = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        shortDescription: '',
        timing: '',
        level: 'beginner',
        courseOverview: '',
        whatYouLearn: '',
        requirements: '',
        price: '',
        courseIncludes: '',
        thumbnail: null,
        existingThumbnail: ''
    });

    // Fetch course data on component mount
    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/courses/${id}`);
                if (response.ok) {
                    const courseData = await response.json();
                    
                    setFormData({
                        title: courseData.title || '',
                        shortDescription: courseData.short_description || '',
                        timing: courseData.timing || '',
                        level: courseData.level || 'beginner',
                        courseOverview: courseData.course_overview || '',
                        whatYouLearn: courseData.what_you_will_learn || '',
                        requirements: courseData.requirements || '',
                        price: courseData.price || '',
                        courseIncludes: courseData.course_includes || '',
                        thumbnail: null,
                        existingThumbnail: courseData.thumbnail || ''
                    });
                } else {
                    alert('Failed to fetch course data');
                    navigate('/admin/courses');
                }
            } catch (error) {
                console.error('Error fetching course:', error);
                alert('Error fetching course data');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleEditorChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRemoveThumbnail = () => {
        setFormData(prev => ({
            ...prev,
            thumbnail: null
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const form = new FormData();
        form.append('title', formData.title);
        form.append('short_description', formData.shortDescription);
        form.append('timing', formData.timing);
        form.append('level', formData.level);
        form.append('course_overview', formData.courseOverview);
        form.append('what_you_will_learn', formData.whatYouLearn);
        form.append('requirements', formData.requirements);
        form.append('price', formData.price);
        form.append('course_includes', formData.courseIncludes);
        
        // Only append thumbnail if a new one was selected
        if (formData.thumbnail) {
            form.append('thumbnail', formData.thumbnail);
        }

        try {
            const res = await fetch(`http://localhost:5000/api/courses/${id}`, {
                method: 'PUT',
                body: form,
            });

            const data = await res.json();

            if (res.ok) {
                alert('Course updated successfully!');
                navigate('/admin/courses');
            } else {
                alert(data.message || 'Error updating course');
            }
        } catch (err) {
            console.error(err);
            alert('Server error');
        } finally {
            setSaving(false);
        }
    };

    // Quill modules for the rich text editors
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'link'
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex bg-gray-100">
                <AdminSidebar />
                <div className="flex flex-col flex-1 md:ml-64">
                    <HeaderAdmin />
                    <main className="flex-grow p-6 bg-gray-100 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading course data...</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 md:ml-64">
                <HeaderAdmin />
                <main className="flex-grow p-6 bg-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                            Edit Course
                        </h1>
                        <Link 
                            to={`/admin/courses/edit-course-modules/${id}`} 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
                        >
                            Edit Modules 
                        </Link>
                        <Link 
                            to="/admin/courses" 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
                        >
                            View All Courses
                        </Link>
                    </div>
                    
                    {/* Form */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-6">Edit Course: {formData.title}</h2>
                        <form onSubmit={handleSubmit}>
                            {/* Title Field */}
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                    placeholder="Course title"
                                />
                            </div>

                            {/* Short Description */}
                            <div className="mb-4">
                                <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                    Short Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="shortDescription"
                                    name="shortDescription"
                                    value={formData.shortDescription}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                    placeholder="Brief description of the course"
                                ></textarea>
                            </div>

                            {/* Timing and Level - Side by Side */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {/* Timing */}
                                <div>
                                    <label htmlFor="timing" className="block text-sm font-medium text-gray-700 mb-1">
                                        Duration <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="timing"
                                        name="timing"
                                        value={formData.timing}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                        placeholder="e.g., 8 weeks, 30 hours"
                                    />
                                </div>

                                {/* Level */}
                                <div>
                                    <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                                        Level <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="level"
                                        name="level"
                                        value={formData.level}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>
                            </div>

                            {/* Course Overview */}
                            <div className="mb-4">
                                <label htmlFor="courseOverview" className="block text-sm font-medium text-gray-700 mb-1">
                                    Course Overview <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="courseOverview"
                                    name="courseOverview"
                                    value={formData.courseOverview}
                                    onChange={handleChange}
                                    rows="5"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                    placeholder="Detailed description of what the course covers"
                                ></textarea>
                            </div>

                            {/* What You'll Learn - Rich Text Editor */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    What You'll Learn <span className="text-red-500">*</span>
                                </label>
                                <div className="bg-white rounded-md">
                                    <ReactQuill
                                        value={formData.whatYouLearn}
                                        onChange={(value) => handleEditorChange('whatYouLearn', value)}
                                        modules={modules}
                                        formats={formats}
                                        placeholder="List the key learning outcomes (use bullet points)"
                                        className="h-48 mb-12"
                                    />
                                </div>
                            </div>

                            {/* Requirements - Rich Text Editor */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Requirements <span className="text-red-500">*</span>
                                </label>
                                <div className="bg-white rounded-md">
                                    <ReactQuill
                                        value={formData.requirements}
                                        onChange={(value) => handleEditorChange('requirements', value)}
                                        modules={modules}
                                        formats={formats}
                                        placeholder="List any prerequisites (use bullet points)"
                                        className="h-48 mb-12"
                                    />
                                </div>
                            </div>

                            {/* Price */}
                            <div className="mb-4">
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                    Price (₹) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                    placeholder="0.00"
                                />
                            </div>

                            {/* Course Includes - Rich Text Editor */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Course Includes <span className="text-red-500">*</span>
                                </label>
                                <div className="bg-white rounded-md">
                                    <ReactQuill
                                        value={formData.courseIncludes}
                                        onChange={(value) => handleEditorChange('courseIncludes', value)}
                                        modules={modules}
                                        formats={formats}
                                        placeholder="List what's included in the course (use bullet points)"
                                        className="h-48 mb-12"
                                    />
                                </div>
                            </div>

                            {/* Thumbnail Upload */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Thumbnail
                                </label>
                                
                                {formData.existingThumbnail && !formData.thumbnail && (
                                    <div className="mt-1 mb-4">
                                        <p className="text-sm text-gray-500 mb-2">Current thumbnail:</p>
                                        <img 
                                            src={`http://localhost:5000${formData.existingThumbnail}`} 
                                            alt="Course thumbnail" 
                                            className="h-32 w-56 object-cover rounded-md border"
                                        />
                                    </div>
                                )}
                                
                                {!formData.thumbnail ? (
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            <div className="flex justify-center text-gray-400">
                                                <FontAwesomeIcon icon={faCloudUploadAlt} className="h-12 w-12" />
                                            </div>
                                            <div className="flex text-sm text-gray-600">
                                                <label
                                                    htmlFor="thumbnail-upload"
                                                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                                                >
                                                    <span>Upload a new thumbnail</span>
                                                    <input
                                                      id="thumbnail-upload"
                                                      name="thumbnail"
                                                      type="file"
                                                      onChange={handleChange}
                                                      className="sr-only"
                                                      accept="image/*"
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, GIF up to 5MB
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-1 flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-12 w-12 overflow-hidden rounded-md">
                                                <img 
                                                    src={URL.createObjectURL(formData.thumbnail)} 
                                                    alt="Thumbnail preview" 
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                                    {formData.thumbnail.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {(formData.thumbnail.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemoveThumbnail}
                                            className="ml-1 p-1 text-gray-400 hover:text-gray-500"
                                        >
                                            <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => navigate('/admin/courses')}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    {saving ? 'Updating...' : 'Update Course'}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EditCourse;