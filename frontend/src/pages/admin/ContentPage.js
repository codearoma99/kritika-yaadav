import React, { useEffect, useState } from 'react';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import FooterAdmin from '../../components/admin/FooterAdmin';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages, faInfoCircle, faQuestionCircle, faChartBar, faPhone,faMagnifyingGlassChart } from '@fortawesome/free-solid-svg-icons';

const tabs = [
  { id: 'slider', label: 'Slider', icon: faImages },
  { id: 'about', label: 'About', icon: faInfoCircle },
  { id: 'screener', label: 'Screener', icon: faMagnifyingGlassChart },
  { id: 'whychoose', label: 'Why Choose Us', icon: faQuestionCircle },
  { id: 'funfacts', label: 'Fun Facts', icon: faChartBar },
  { id: 'contact', label: 'Contact', icon: faPhone },
];

const ContentPage = () => {
  const [activeTab, setActiveTab] = useState('slider');
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  // For handling image previews per tab
  const [imagePreviews, setImagePreviews] = useState({});

  useEffect(() => {
    // Fetch the content from backend (id=1)
    fetch('http://localhost:5000/content')
      .then(res => res.json())
      .then(data => {
        setContent(data);
        setLoading(false);
        // Initialize image previews
        setImagePreviews({
          slider1_image: data.slider1_image || '',
          slider2_image: data.slider2_image || '',
          about_image_home: data.about_image_home || '',
          about_image1: data.about_image1 || '',
          about_image2: data.about_image2 || '',
          whychoose_image: data.whychoose_image || '',
          home_page_banner : data.home_page_banner || '',
          screener_banner : data.screener_banner  || '', 
        });
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-gray-600 text-lg">Loading content...</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-red-500 text-lg">Failed to load content.</div>
      </div>
    );
  }

  // Handle input changes for content state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent(prev => ({ ...prev, [name]: value }));
  };

  // Handle image file input change and preview
  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      // Show preview from file input
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews(prev => ({ ...prev, [name]: previewUrl }));
      // Save file in content state (you'll send it to backend on update)
      setContent(prev => ({ ...prev, [name]: file }));
    }
  };

  // Update single tab data
  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      // Append all fields from current tab only
      if (activeTab === 'slider') {
        const sliderFields = [
          'slider1_title', 'slider1_subtitle', 'slider1_content',
          'slider1_button1', 'slider1_button1_link',
          'slider1_button2', 'slider1_button2_link', 'slider1_image',
          'slider2_title', 'slider2_subtitle', 'slider2_content',
          'slider2_button1', 'slider2_button1_link',
          'slider2_button2', 'slider2_button2_link', 'slider2_image',
        ];
        sliderFields.forEach(field => {
          if (content[field] instanceof File) {
            formData.append(field, content[field]);
          } else {
            formData.append(field, content[field] || '');
          }
        });
      } else if (activeTab === 'about') {
        const aboutFields = [
          'about_image_home', 'about_image1', 'about_image2',
          'about_title', 'about_content',
          'about_box_icon1', 'about_box_title1', 'about_box_content1',
          'about_box_icon2', 'about_box_title2', 'about_box_content2',
          'home_page_banner', 
        ];
        aboutFields.forEach(field => {
          if (content[field] instanceof File) {
            formData.append(field, content[field]);
          } else {
            formData.append(field, content[field] || '');
          }
        });
      } else if (activeTab === 'screener') {
        const aboutFields = [
          'quote_1','quote_2','quote_3','quote_4','quote_5','screener_banner',  
        ];
        aboutFields.forEach(field => {
          if (content[field] instanceof File) {
            formData.append(field, content[field]);
          } else {
            formData.append(field, content[field] || '');
          }
        });
      } else if (activeTab === 'whychoose') {
        const whychooseFields = [
          'whychoose_title', 'whychoose_para1', 'whychoose_para2',
          'whychoose_para3', 'whychoose_image',
        ];
        whychooseFields.forEach(field => {
          if (content[field] instanceof File) {
            formData.append(field, content[field]);
          } else {
            formData.append(field, content[field] || '');
          }
        });
      } else if (activeTab === 'funfacts') {
        const funfactFields = [
          'funfact_title1', 'funfact_count1',
          'funfact_title2', 'funfact_count2',
          'funfact_title3', 'funfact_count3',
        ];
        funfactFields.forEach(field => {
          formData.append(field, content[field] || '');
        });
      } else if (activeTab === 'contact') {
        const contactFields = [
          'contact_phone1', 'contact_phone2',
          'contact_email1', 'contact_email2',
          'contact_address',
        ];
        contactFields.forEach(field => {
          formData.append(field, content[field] || '');
        });
      }

      // Call backend update API
      const res = await fetch('http://localhost:5000/content', {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to update content');
      }
      alert('Content updated successfully!');
    } catch (error) {
      alert('Error updating content: ' + error.message);
    }
  };

  // Helper to render image preview or fallback image name
  const renderImagePreview = (fieldName) => {
    const val = content[fieldName];
    if (val instanceof File) {
      return (
        <img
          src={imagePreviews[fieldName]}
          alt="preview"
          className="w-auto h-auto object-cover rounded border"
        />
      );
    }
    if (imagePreviews[fieldName]) {
      // Show from backend folder URL, assuming backend serves images from /uploads/content/
      return (
        <img
          src={`http://localhost:5000/uploads/content/${imagePreviews[fieldName]}`}
          alt="preview"
          className="w-auto h-auto object-cover rounded border"
        />
      );
    }
    return <div className="text-gray-500">No image</div>;
  };

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
              Content Management
            </h1>
          </div>

        
          {/* Tab Contents */}
          <div className="bg-white p-6 rounded shadow max-w-5xl">
            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-300">
                <nav className="-mb-px flex space-x-4 overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 font-medium text-sm border-b-2 transition-all ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-300'
                      }`}
                    >
                      <FontAwesomeIcon icon={tab.icon} className="text-base" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Slider Tab */}
            {activeTab === 'slider' && (
              <>
                <h2 className="text-xl font-semibold mb-4">Slider 1</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-1 font-medium">Title</label>
                    <input
                      type="text"
                      name="slider1_title"
                      value={content.slider1_title || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Subtitle</label>
                    <input
                      type="text"
                      name="slider1_subtitle"
                      value={content.slider1_subtitle || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-medium">Content</label>
                    <textarea
                      name="slider1_content"
                      value={content.slider1_content || ''}
                      onChange={handleChange}
                      rows={4}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Button 1 Text</label>
                    <input
                      type="text"
                      name="slider1_button1"
                      value={content.slider1_button1 || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Button 1 Link</label>
                    <input
                      type="text"
                      name="slider1_button1_link"
                      value={content.slider1_button1_link || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Button 2 Text</label>
                    <input
                      type="text"
                      name="slider1_button2"
                      value={content.slider1_button2 || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Button 2 Link</label>
                    <input
                      type="text"
                      name="slider1_button2_link"
                      value={content.slider1_button2_link || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Image</label>
                    <input
                      type="file"
                      name="slider1_image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mb-2"
                    />
                    {renderImagePreview('slider1_image')}
                  </div>
                </div>

                <hr className="my-8" />

                <h2 className="text-xl font-semibold mb-4">Slider 2</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-1 font-medium">Title</label>
                    <input
                      type="text"
                      name="slider2_title"
                      value={content.slider2_title || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Subtitle</label>
                    <input
                      type="text"
                      name="slider2_subtitle"
                      value={content.slider2_subtitle || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-medium">Content</label>
                    <textarea
                      name="slider2_content"
                      value={content.slider2_content || ''}
                      onChange={handleChange}
                      rows={4}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Button 1 Text</label>
                    <input
                      type="text"
                      name="slider2_button1"
                      value={content.slider2_button1 || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Button 1 Link</label>
                    <input
                      type="text"
                      name="slider2_button1_link"
                      value={content.slider2_button1_link || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Button 2 Text</label>
                    <input
                      type="text"
                      name="slider2_button2"
                      value={content.slider2_button2 || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Button 2 Link</label>
                    <input
                      type="text"
                      name="slider2_button2_link"
                      value={content.slider2_button2_link || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Image</label>
                    <input
                      type="file"
                      name="slider2_image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mb-2"
                    />
                    {renderImagePreview('slider2_image')}
                  </div>
                </div>
              </>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
              <>
                <h2 className="text-xl font-semibold mb-4">About Section</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {['about_image_home', 'about_image1', 'about_image2'].map((field) => (
                    <div key={field}>
                      <label className="block mb-1 font-medium">{field.replace(/_/g, ' ')}</label>
                      <input
                        type="file"
                        name={field}
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mb-2"
                      />
                      {renderImagePreview(field)}
                    </div>
                  ))}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Title</label>
                  <input
                    type="text"
                    name="about_title"
                    value={content.about_title || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-1 font-medium">Content</label>
                  <textarea
                    name="about_content"
                    value={content.about_content || ''}
                    onChange={handleChange}
                    rows={5}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-1 font-medium">Box 1 Icon</label>
                    <input
                      type="text"
                      name="about_box_icon1"
                      value={content.about_box_icon1 || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Box 1 Title</label>
                    <input
                      type="text"
                      name="about_box_title1"
                      value={content.about_box_title1 || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-medium">Box 1 Content</label>
                    <textarea
                      name="about_box_content1"
                      value={content.about_box_content1 || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Box 2 Icon</label>
                    <input
                      type="text"
                      name="about_box_icon2"
                      value={content.about_box_icon2 || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Box 2 Title</label>
                    <input
                      type="text"
                      name="about_box_title2"
                      value={content.about_box_title2 || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-medium">Box 2 Content</label>
                    <textarea
                      name="about_box_content2"
                      value={content.about_box_content2 || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  {/* Home Page Banner Upload */}
                  <div className="mb-6">
                    <label className="block mb-1 font-medium">Home Page Banner</label>
                    <input
                      type="file"
                      name="home_page_banner"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mb-2"
                    />
                    {renderImagePreview('home_page_banner')}
                  </div>
                </div>
              </>
            )}

            {/* Screener Tab */}
            {activeTab === 'screener' && (
              <>
                <h2 className="text-xl font-semibold mb-4">Contact</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-medium">Quote 1</label>
                    <textarea
                      name="quote_1"
                      value={content.quote_1 || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-medium">Quote 2</label>
                    <textarea
                      name="quote_2"
                      value={content.quote_2 || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-medium">Quote 3</label>
                    <textarea
                      name="quote_3"
                      value={content.quote_3 || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-medium">Quote 4</label>
                    <textarea
                      name="quote_4"
                      value={content.quote_4 || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-medium">Quote 5</label>
                    <textarea
                      name="quote_5"
                      value={content.quote_5 || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block mb-1 font-medium">screener banner</label>
                    <input
                      type="file"
                      name="screener_banner"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mb-2"
                    />
                    {renderImagePreview('screener_banner')}
                  </div>
                </div>
              </>
            )}

            {/* Why Choose Us Tab */}
            {activeTab === 'whychoose' && (
              <>
                <h2 className="text-xl font-semibold mb-4">Why Choose Us</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-1 font-medium">Title</label>
                    <input
                      type="text"
                      name="whychoose_title"
                      value={content.whychoose_title || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                    <label className="block mt-4 mb-1 font-medium">Paragraph 1</label>
                    <textarea
                      name="whychoose_para1"
                      value={content.whychoose_para1 || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                    <label className="block mt-4 mb-1 font-medium">Paragraph 2</label>
                    <textarea
                      name="whychoose_para2"
                      value={content.whychoose_para2 || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                    <label className="block mt-4 mb-1 font-medium">Paragraph 3</label>
                    <textarea
                      name="whychoose_para3"
                      value={content.whychoose_para3 || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Image</label>
                    <input
                      type="file"
                      name="whychoose_image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mb-2"
                    />
                    {renderImagePreview('whychoose_image')}
                  </div>
                  
                </div>
              </>
            )}

            {/* Fun Facts Tab */}
            {activeTab === 'funfacts' && (
              <>
                <h2 className="text-xl font-semibold mb-4">Fun Facts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="border p-4 rounded">
                      <label className="block mb-1 font-medium">Title {num}</label>
                      <input
                        type="text"
                        name={`funfact_title${num}`}
                        value={content[`funfact_title${num}`] || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
                      />
                      <label className="block mb-1 font-medium">Count {num}</label>
                      <input
                        type="number"
                        name={`funfact_count${num}`}
                        value={content[`funfact_count${num}`] || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <>
                <h2 className="text-xl font-semibold mb-4">Contact</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-1 font-medium">Phone 1</label>
                    <input
                      type="text"
                      name="contact_phone1"
                      value={content.contact_phone1 || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Phone 2</label>
                    <input
                      type="text"
                      name="contact_phone2"
                      value={content.contact_phone2 || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Email 1</label>
                    <input
                      type="email"
                      name="contact_email1"
                      value={content.contact_email1 || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Email 2</label>
                    <input
                      type="email"
                      name="contact_email2"
                      value={content.contact_email2 || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-medium">Address</label>
                    <textarea
                      name="contact_address"
                      value={content.contact_address || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="mt-6">
              <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Update {tabs.find(t => t.id === activeTab)?.label}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ContentPage;