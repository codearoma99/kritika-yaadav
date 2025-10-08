import React, { useEffect, useState } from 'react';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import FooterAdmin from '../../components/admin/FooterAdmin';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

const ScreenerContentForm = () => {
  const [activeTab, setActiveTab] = useState('main');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const tabs = [
    { id: 'main', label: 'Main Content' },
    { id: 'disclaimer', label: 'Disclaimer Section' },
    { id: 'stockAnalysis', label: 'Stock Analysis' },
    { id: 'screenerDifferent', label: 'Screener Different' },
    { id: 'smartInvesting', label: 'Smart Investing' },
    { id: 'learnToRead', label: 'Learn to Read' },
    { id: 'kritikaInsights', label: 'Kritika Insights' },
    { id: 'importantDisclaimers', label: 'Important Disclaimers' },
    { id: 'joinUs', label: 'Join Us' },
    { id: 'fromKritika', label: 'From Kritika Yadav' },
    { id: 'screenerCapabilities', label: 'Screener Capabilities' }
  ];

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/screener-content/1');
      const data = await response.json();
      if (data.success) {
        setFormData(data.data);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      setMessage('Error fetching content');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/screener-content/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Content updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error updating content');
      }
    } catch (error) {
      console.error('Error updating content:', error);
      setMessage('Error updating content');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (name, label, type = 'text', rows = 1) => (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor={name}>
        {label}
      </label>
      {rows > 1 ? (
        <textarea
          id={name}
          name={name}
          value={formData[name] || ''}
          onChange={handleInputChange}
          rows={rows}
          className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none"
          placeholder={`Enter ${label.toLowerCase()}...`}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={formData[name] || ''}
          onChange={handleInputChange}
          className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          placeholder={`Enter ${label.toLowerCase()}...`}
        />
      )}
    </div>
  );

  const renderCard = (title, children, className = '') => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 ${className}`}>
      {title && (
        <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
          {title}
        </h3>
      )}
      {children}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'main':
        return (
          <div className="space-y-6">
            {renderCard('Main Content', (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {renderInput('title', 'Title', 'text', 2)}
                {renderInput('sub_title', 'Sub Title', 'text', 2)}
                {renderInput('micro_title', 'Micro Title')}
                {renderInput('quote', 'Quote', 'text', 4)}
              </div>
            ))}
          </div>
        );

      case 'disclaimer':
        return (
          <div className="space-y-6">
            {renderCard('Disclaimer Section 1', (
              <div className="space-y-4">
                {renderInput('dis_title1', 'Title')}
                {renderInput('dis_text1', 'Description', 'text', 4)}
              </div>
            ))}
            {renderCard('Disclaimer Section 2', (
              <div className="space-y-4">
                {renderInput('dis_title2', 'Title')}
                {renderInput('dis_text2', 'Description', 'text', 4)}
              </div>
            ))}
          </div>
        );

      case 'stockAnalysis':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              { title: 'Analysis 1', titleField: 'sa_title1', textField: 'sa_text1' },
              { title: 'Analysis 2', titleField: 'sa_title2', textField: 'sa_text2' },
              { title: 'Analysis 3', titleField: 'sa_title3', textField: 'sa_text3' },
              { title: 'Analysis 4', titleField: 'sa_title4', textField: 'sa_text4' },
              { title: 'Analysis 5', titleField: 'sa_title5', textField: 'sa_text5' },
              { title: 'Analysis 6', titleField: 'sa_title6', textField: 'sa_text6' },
            ].map((item, index) => (
              renderCard(item.title, (
                <div className="space-y-4">
                  {renderInput(item.titleField, 'Title')}
                  {renderInput(item.textField, 'Description', 'text', 4)}
                </div>
              ))
            ))}
          </div>
        );

      case 'screenerDifferent':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              { 
                title: 'Box 1', 
                titleField: 'sd_box1_title', 
                textFields: ['sd_box1_text', 'sd_box1_text2', 'sd_box1_text3'] 
              },
              { 
                title: 'Box 2', 
                titleField: 'sd_box2_title', 
                textFields: ['sd_box2_text', 'sd_box2_text2', 'sd_box2_text3'] 
              },
              { 
                title: 'Box 3', 
                titleField: 'sd_box3_title', 
                textFields: ['sd_box3_text', 'sd_box3_text2', 'sd_box3_text3'] 
              },
            ].map((box, index) => (
              renderCard(box.title, (
                <div className="space-y-4">
                  {renderInput(box.titleField, 'Box Title')}
                  {box.textFields.map((field, fieldIndex) => (
                    renderInput(field, `Text ${fieldIndex + 1}`, 'text', 3)
                  ))}
                </div>
              ))
            ))}
          </div>
        );

      case 'smartInvesting':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              { 
                title: 'Smart Investing 1', 
                titleField: 'si_box1_title', 
                textFields: ['si_box1_text1', 'si_box1_text2', 'si_box1_text3'] 
              },
              { 
                title: 'Smart Investing 2', 
                titleField: 'si_box2_title', 
                textFields: ['si_box2_text1', 'si_box2_text2', 'si_box2_text3'] 
              },
              { 
                title: 'Smart Investing 3', 
                titleField: 'si_box3_title', 
                textFields: ['si_box3_text1', 'si_box3_text2', 'si_box3_text3'] 
              },
            ].map((box, index) => (
              renderCard(box.title, (
                <div className="space-y-4">
                  {renderInput(box.titleField, 'Title')}
                  {box.textFields.map((field, fieldIndex) => (
                    renderInput(field, `Point ${fieldIndex + 1}`, 'text', 2)
                  ))}
                </div>
              ))
            ))}
          </div>
        );

      case 'learnToRead':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {[
              { 
                title: 'Learn Box 1', 
                titleField: 'lr_box1_title', 
                items: [
                  { tag: 'lr_box1_tag1', text: 'lr_box1_text1' },
                  { tag: 'lr_box1_tag2', text: 'lr_box1_text2' },
                  { tag: 'lr_box1_tag3', text: 'lr_box1_text3' }
                ]
              },
              { 
                title: 'Learn Box 2', 
                titleField: 'lr_box2_title', 
                items: [
                  { tag: 'lr_box2_tag1', text: 'lr_box2_text1' },
                  { tag: 'lr_box2_tag2', text: 'lr_box2_text2' },
                  { tag: 'lr_box2_tag3', text: 'lr_box2_text3' }
                ]
              },
              { 
                title: 'Learn Box 3', 
                titleField: 'lr_box3_title', 
                items: [
                  { tag: 'lr_box3_tag1', text: 'lr_box3_text1' },
                  { tag: 'lr_box3_tag2', text: 'lr_box3_text2' },
                  { tag: 'lr_box3_tag3', text: 'lr_box3_text3' }
                ]
              },
              { 
                title: 'Learn Box 4', 
                titleField: 'lr_box4_title', 
                items: [
                  { tag: 'lr_box4_tag1', text: 'lr_box4_text1' },
                  { tag: 'lr_box4_tag2', text: 'lr_box4_text2' },
                  { tag: 'lr_box4_tag3', text: 'lr_box4_text3' }
                ]
              },
            ].map((box, index) => (
              renderCard(box.title, (
                <div className="space-y-4">
                  {renderInput(box.titleField, 'Box Title')}
                  {box.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="space-y-3 p-3 bg-gray-50 rounded-lg">
                      {renderInput(item.tag, `Tag ${itemIndex + 1}`)}
                      {renderInput(item.text, `Description ${itemIndex + 1}`, 'text', 2)}
                    </div>
                  ))}
                </div>
              ))
            ))}
          </div>
        );

      case 'kritikaInsights':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              { 
                title: 'Insight 1', 
                titleField: 'ki_box1_title', 
                textFields: ['ki_box1_text1', 'ki_box1_text2', 'ki_box1_text3'] 
              },
              { 
                title: 'Insight 2', 
                titleField: 'ki_box2_title', 
                textFields: ['ki_box2_text1', 'ki_box2_text2', 'ki_box2_text3'] 
              },
            ].map((box, index) => (
              renderCard(box.title, (
                <div className="space-y-4">
                  {renderInput(box.titleField, 'Title')}
                  {box.textFields.map((field, fieldIndex) => (
                    renderInput(field, `Insight ${fieldIndex + 1}`, 'text', 3)
                  ))}
                </div>
              ))
            ))}
          </div>
        );

      case 'importantDisclaimers':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              { 
                title: 'Disclaimer Box 1', 
                titleField: 'id_box1_title', 
                textFields: ['id_box1_text1', 'id_box1_text2', 'id_box1_text3', 'id_box1_text4'] 
              },
              { 
                title: 'Disclaimer Box 2', 
                titleField: 'id_box2_title', 
                textFields: ['id_box2_text1', 'id_box2_text2', 'id_box2_text3', 'id_box2_text4'] 
              },
            ].map((box, index) => (
              renderCard(box.title, (
                <div className="space-y-4">
                  {renderInput(box.titleField, 'Title')}
                  {box.textFields.map((field, fieldIndex) => (
                    renderInput(field, `Point ${fieldIndex + 1}`, 'text', 2)
                  ))}
                </div>
              ))
            ))}
          </div>
        );

      case 'joinUs':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              { 
                title: 'Join Us Box 1', 
                textFields: ['ju_box1_text1', 'ju_box1_text2', 'ju_box1_text3', 'ju_box1_text4'] 
              },
              { 
                title: 'Join Us Box 2', 
                textFields: ['ju_box2_text1', 'ju_box2_text2', 'ju_box2_text3', 'ju_box2_text4'] 
              },
            ].map((box, index) => (
              renderCard(box.title, (
                <div className="space-y-4">
                  {box.textFields.map((field, fieldIndex) => (
                    renderInput(field, `Text ${fieldIndex + 1}`, 'text', 2)
                  ))}
                </div>
              ))
            ))}
          </div>
        );

      case 'fromKritika':
        return (
          <div className="space-y-6">
            {renderCard('From Kritika Yadav', (
              <div className="space-y-6">
                {renderInput('fk_quote1', 'Quote 1', 'text', 4)}
                {renderInput('fk_quote2', 'Quote 2', 'text', 4)}
              </div>
            ))}
          </div>
        );

      case 'screenerCapabilities':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              { 
                title: 'Capabilities Box 1', 
                textFields: ['sc_box1_text1', 'sc_box1_text2', 'sc_box1_text3', 'sc_box1_text4'] 
              },
              { 
                title: 'Capabilities Box 2', 
                textFields: ['sc_box2_text1', 'sc_box2_text2', 'sc_box2_text3', 'sc_box2_text4'] 
              },
            ].map((box, index) => (
              renderCard(box.title, (
                <div className="space-y-4">
                  {box.textFields.map((field, fieldIndex) => (
                    renderInput(field, `Capability ${fieldIndex + 1}`, 'text', 2)
                  ))}
                </div>
              ))
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar />
      <div className="flex flex-col flex-1 md:ml-64">
        <HeaderAdmin />
        <main className="flex-grow p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  Screener Content Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage all content for the screener page across different sections
                </p>
              </div>
            </div>

            {/* Message Alert */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg border ${
                message.includes('Error') 
                  ? 'bg-red-50 border-red-200 text-red-700' 
                  : 'bg-green-50 border-green-200 text-green-700'
              }`}>
                <div className="flex items-center">
                  <span className="flex-1">{message}</span>
                </div>
              </div>
            )}

            {/* Main Content Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Tabs Navigation */}
              <div className="border-b border-gray-200 bg-gray-50/50">
                <nav className="flex space-x-1 px-6 overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 bg-white shadow-sm'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-white/50'
                      } rounded-t-lg`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <form onSubmit={handleSubmit}>
                  <div className="mb-8">
                    {loading ? (
                      <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                      </div>
                    ) : (
                      renderTabContent()
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={fetchContent}
                      className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition duration-200 disabled:opacity-50"
                      disabled={loading}
                    >
                      Reset Changes
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 flex items-center space-x-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
        <FooterAdmin />
      </div>
    </div>
  );
};

export default ScreenerContentForm;