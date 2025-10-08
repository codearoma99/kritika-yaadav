import React, { useState, useEffect } from 'react';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import FooterAdmin from '../../components/admin/FooterAdmin';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faSave,
  faGlobe,
  faEnvelope,
  faLock,
  faPalette,
  faCreditCard,
//   faSocial,
  faUserShield,
  fa0
} from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram, faLinkedin,  } from '@fortawesome/free-brands-svg-icons';


const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    siteTitle: 'EduAdmin',
    siteDescription: 'Learning Management System',
    siteUrl: 'https://eduadmin.example.com',
    timezone: 'UTC',
    dateFormat: 'MMMM d, yyyy',
    timeFormat: 'h:mm a',
    maintenanceMode: false,

    // Email Settings
    emailFrom: 'noreply@eduadmin.example.com',
    emailFromName: 'EduAdmin System',
    smtpHost: 'smtp.example.com',
    smtpPort: '587',
    smtpUsername: 'your_username',
    smtpPassword: '',
    smtpEncryption: 'tls',

    // Security Settings
    loginAttempts: 5,
    loginLockoutTime: 30, // minutes
    passwordComplexity: 'medium',
    twoFactorAuth: false,
    sessionTimeout: 30, // minutes

    // Theme Settings
    primaryColor: '#4f46e5',
    secondaryColor: '#f43f5e',
    darkMode: false,
    logoUrl: '',
    faviconUrl: '',

    // Payment Settings
    currency: 'USD',
    currencySymbol: '$',
    paymentGateway: 'stripe',
    stripePublishableKey: '',
    stripeSecretKey: '',
    paypalClientId: '',
    paypalSecret: '',

    // Social Media
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    socialSharing: true
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });

  // Load settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleColorChange = (name, value) => {
    setSettings({
      ...settings,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage({ type: '', text: '' });

    try {
      // Simulate API save
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSaveMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 5000);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="siteTitle" className="block text-sm font-medium text-gray-700">
                  Site Title
                </label>
                <input
                  type="text"
                  id="siteTitle"
                  name="siteTitle"
                  value={settings.siteTitle}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                  Site Description
                </label>
                <input
                  type="text"
                  id="siteDescription"
                  name="siteDescription"
                  value={settings.siteDescription}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="siteUrl" className="block text-sm font-medium text-gray-700">
                Site URL
              </label>
              <input
                type="url"
                id="siteUrl"
                name="siteUrl"
                value={settings.siteUrl}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                  Timezone
                </label>
                <select
                  id="timezone"
                  name="timezone"
                  value={settings.timezone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
              <div>
                <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700">
                  Date Format
                </label>
                <select
                  id="dateFormat"
                  name="dateFormat"
                  value={settings.dateFormat}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="MMMM d, yyyy">January 1, 2023</option>
                  <option value="MMM d, yyyy">Jan 1, 2023</option>
                  <option value="MM/dd/yyyy">01/01/2023</option>
                  <option value="dd/MM/yyyy">01/01/2023</option>
                  <option value="yyyy-MM-dd">2023-01-01</option>
                </select>
              </div>
              <div>
                <label htmlFor="timeFormat" className="block text-sm font-medium text-gray-700">
                  Time Format
                </label>
                <select
                  id="timeFormat"
                  name="timeFormat"
                  value={settings.timeFormat}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="h:mm a">12:00 PM</option>
                  <option value="HH:mm">12:00</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="maintenanceMode"
                name="maintenanceMode"
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-700">
                Enable Maintenance Mode
              </label>
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="emailFrom" className="block text-sm font-medium text-gray-700">
                  From Email
                </label>
                <input
                  type="email"
                  id="emailFrom"
                  name="emailFrom"
                  value={settings.emailFrom}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="emailFromName" className="block text-sm font-medium text-gray-700">
                  From Name
                </label>
                <input
                  type="text"
                  id="emailFromName"
                  name="emailFromName"
                  value={settings.emailFromName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="smtpHost" className="block text-sm font-medium text-gray-700">
                  SMTP Host
                </label>
                <input
                  type="text"
                  id="smtpHost"
                  name="smtpHost"
                  value={settings.smtpHost}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700">
                  SMTP Port
                </label>
                <input
                  type="text"
                  id="smtpPort"
                  name="smtpPort"
                  value={settings.smtpPort}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="smtpEncryption" className="block text-sm font-medium text-gray-700">
                  Encryption
                </label>
                <select
                  id="smtpEncryption"
                  name="smtpEncryption"
                  value={settings.smtpEncryption}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="tls">TLS</option>
                  <option value="ssl">SSL</option>
                  <option value="">None</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="smtpUsername" className="block text-sm font-medium text-gray-700">
                  SMTP Username
                </label>
                <input
                  type="text"
                  id="smtpUsername"
                  name="smtpUsername"
                  value={settings.smtpUsername}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700">
                  SMTP Password
                </label>
                <input
                  type="password"
                  id="smtpPassword"
                  name="smtpPassword"
                  value={settings.smtpPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="loginAttempts" className="block text-sm font-medium text-gray-700">
                  Max Login Attempts
                </label>
                <input
                  type="number"
                  id="loginAttempts"
                  name="loginAttempts"
                  min="1"
                  max="10"
                  value={settings.loginAttempts}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="loginLockoutTime" className="block text-sm font-medium text-gray-700">
                  Lockout Time (minutes)
                </label>
                <input
                  type="number"
                  id="loginLockoutTime"
                  name="loginLockoutTime"
                  min="1"
                  max="1440"
                  value={settings.loginLockoutTime}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="passwordComplexity" className="block text-sm font-medium text-gray-700">
                Password Complexity
              </label>
              <select
                id="passwordComplexity"
                name="passwordComplexity"
                value={settings.passwordComplexity}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                <option value="low">Low (6+ characters)</option>
                <option value="medium">Medium (8+ characters with mix)</option>
                <option value="high">High (10+ characters with special)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <input
                  id="twoFactorAuth"
                  name="twoFactorAuth"
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="twoFactorAuth" className="ml-2 block text-sm text-gray-700">
                  Enable Two-Factor Authentication
                </label>
              </div>
              <div>
                <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  id="sessionTimeout"
                  name="sessionTimeout"
                  min="1"
                  max="1440"
                  value={settings.sessionTimeout}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        );

      case 'theme':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
                  Primary Color
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="color"
                    id="primaryColor"
                    name="primaryColor"
                    value={settings.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="h-10 w-16 rounded-l-md border-gray-300 p-1"
                  />
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700">
                  Secondary Color
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="color"
                    id="secondaryColor"
                    name="secondaryColor"
                    value={settings.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="h-10 w-16 rounded-l-md border-gray-300 p-1"
                  />
                  <input
                    type="text"
                    value={settings.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="darkMode"
                name="darkMode"
                type="checkbox"
                checked={settings.darkMode}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="darkMode" className="ml-2 block text-sm text-gray-700">
                Enable Dark Mode
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Logo Upload
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, SVG up to 5MB
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Favicon Upload
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      ICO, PNG up to 1MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={settings.currency}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                  <option value="JPY">Japanese Yen (JPY)</option>
                </select>
              </div>
              <div>
                <label htmlFor="currencySymbol" className="block text-sm font-medium text-gray-700">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  id="currencySymbol"
                  name="currencySymbol"
                  value={settings.currencySymbol}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="paymentGateway" className="block text-sm font-medium text-gray-700">
                Payment Gateway
              </label>
              <select
                id="paymentGateway"
                name="paymentGateway"
                value={settings.paymentGateway}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                <option value="stripe">Stripe</option>
                <option value="paypal">PayPal</option>
                <option value="offline">Offline Payment</option>
              </select>
            </div>

            {settings.paymentGateway === 'stripe' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="stripePublishableKey" className="block text-sm font-medium text-gray-700">
                    Stripe Publishable Key
                  </label>
                  <input
                    type="text"
                    id="stripePublishableKey"
                    name="stripePublishableKey"
                    value={settings.stripePublishableKey}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="stripeSecretKey" className="block text-sm font-medium text-gray-700">
                    Stripe Secret Key
                  </label>
                  <input
                    type="password"
                    id="stripeSecretKey"
                    name="stripeSecretKey"
                    value={settings.stripeSecretKey}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            )}

            {settings.paymentGateway === 'paypal' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="paypalClientId" className="block text-sm font-medium text-gray-700">
                    PayPal Client ID
                  </label>
                  <input
                    type="text"
                    id="paypalClientId"
                    name="paypalClientId"
                    value={settings.paypalClientId}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="paypalSecret" className="block text-sm font-medium text-gray-700">
                    PayPal Secret
                  </label>
                  <input
                    type="password"
                    id="paypalSecret"
                    name="paypalSecret"
                    value={settings.paypalSecret}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 'social':
        return (
          <div className="space-y-6">
            <div className="flex items-center">
              <input
                id="socialSharing"
                name="socialSharing"
                type="checkbox"
                checked={settings.socialSharing}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="socialSharing" className="ml-2 block text-sm text-gray-700">
                Enable Social Sharing
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="facebookUrl" className="block text-sm font-medium text-gray-700 flex items-center">
                  <FontAwesomeIcon icon={faFacebook} className="mr-2 text-blue-600" />
                  Facebook URL
                </label>
                <input
                  type="url"
                  id="facebookUrl"
                  name="facebookUrl"
                  value={settings.facebookUrl}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="twitterUrl" className="block text-sm font-medium text-gray-700 flex items-center">
                  <FontAwesomeIcon icon={faTwitter} className="mr-2 text-blue-400" />
                  Twitter URL
                </label>
                <input
                  type="url"
                  id="twitterUrl"
                  name="twitterUrl"
                  value={settings.twitterUrl}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="instagramUrl" className="block text-sm font-medium text-gray-700 flex items-center">
                  <FontAwesomeIcon icon={faInstagram} className="mr-2 text-pink-600" />
                  Instagram URL
                </label>
                <input
                  type="url"
                  id="instagramUrl"
                  name="instagramUrl"
                  value={settings.instagramUrl}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 flex items-center">
                  <FontAwesomeIcon icon={faLinkedin} className="mr-2 text-blue-700" />
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  id="linkedinUrl"
                  name="linkedinUrl"
                  value={settings.linkedinUrl}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
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
              <FontAwesomeIcon icon={faCog} className="mr-2 text-indigo-600" />
              System Settings
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px overflow-x-auto">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center ${activeTab === 'general' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <FontAwesomeIcon icon={faGlobe} className="mr-2" />
                  General
                </button>
                <button
                  onClick={() => setActiveTab('email')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center ${activeTab === 'email' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                  Email
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center ${activeTab === 'security' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <FontAwesomeIcon icon={faLock} className="mr-2" />
                  Security
                </button>
                <button
                  onClick={() => setActiveTab('theme')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center ${activeTab === 'theme' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <FontAwesomeIcon icon={faPalette} className="mr-2" />
                  Theme
                </button>
                <button
                  onClick={() => setActiveTab('payment')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center ${activeTab === 'payment' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                  Payment
                </button>
                <button
                  onClick={() => setActiveTab('social')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center ${activeTab === 'social' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <FontAwesomeIcon icon={faUserShield} className="mr-2" />
                  Social Media
                </button>
              </nav>
            </div>

            {/* Form Content */}
            <div className="p-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {renderTabContent()}

                  {saveMessage.text && (
                    <div className={`mt-6 p-4 rounded-md ${saveMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                      {saveMessage.text}
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50"
                    >
                      <FontAwesomeIcon icon={faSave} className="mr-2" />
                      {isSaving ? 'Saving...' : 'Save Settings'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </main>

        <FooterAdmin />
      </div>
    </div>
  );
};

export default Settings;