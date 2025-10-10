import { useState, useRef, useEffect } from 'react';

const FAQAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeSection, setActiveSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [faqSections, setFaqSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRefs = useRef([]);

  // Fetch FAQ data from API
  useEffect(() => {
    const fetchFAQData = async () => {
      try {
        setLoading(true);
        // Fetch both categories and items
        const [categoriesResponse, itemsResponse] = await Promise.all([
          fetch('http://localhost:5000/api/faq/categories'),
          fetch('http://localhost:5000/api/faq/items')
        ]);

        if (!categoriesResponse.ok || !itemsResponse.ok) {
          throw new Error('Failed to fetch FAQ data');
        }

        const categoriesData = await categoriesResponse.json();
        const itemsData = await itemsResponse.json();

        if (!categoriesData.success || !itemsData.success) {
          throw new Error('API returned error');
        }

        // Transform API data to match component structure
        const transformedSections = categoriesData.data.map(category => ({
          id: category.id,
          title: category.title,
          items: itemsData.data
            .filter(item => item.category_id === category.id)
            .map(item => ({
              id: item.id,
              question: item.question,
              answer: item.answer
            }))
        })).filter(section => section.items.length > 0); // Only show sections with items

        setFaqSections(transformedSections);
        setError(null);
      } catch (err) {
        console.error('Error fetching FAQ data:', err);
        setError('Failed to load FAQ data. Please try again later.');
        // You could set fallback data here if needed
      } finally {
        setLoading(false);
      }
    };

    fetchFAQData();
  }, []);

  const toggleAccordion = (index, section) => {
    if (activeIndex === index && activeSection === section) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
      setActiveSection(section);
    }
  };

  const scrollToSection = (index) => {
    if (index >= faqSections.length) return;
    
    setIsScrolling(true);
    setActiveSection(index);
    
    sectionRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };

  // Initialize refs when faqSections changes
  useEffect(() => {
    sectionRefs.current = sectionRefs.current.slice(0, faqSections.length);
  }, [faqSections]);

  // Highlight active section in sidebar while scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling || faqSections.length === 0) return;
      
      const scrollPosition = window.scrollY + 150;
      
      faqSections.forEach((section, index) => {
        const element = sectionRefs.current[index];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(index);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolling, faqSections]);

  if (loading) {
    return (
      <div className="faq-container">
        <div className="faq-loading">
          <div className="loading-spinner"></div>
          <p>Loading FAQ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="faq-container">
        <div className="faq-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (faqSections.length === 0) {
    return (
      <div className="faq-container">
        <div className="faq-empty">
          <p>No FAQ content available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="faq-container">
      {/* Sidebar Navigation */}
      <div className="faq-sidebar">
        <div className="sidebar-inner">
          <h2 className="sidebar-titles">FAQ Categories</h2>
          <div className="sidebar-items">
            {faqSections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(index)}
                className={`sidebar-item ${activeSection === index ? 'active' : ''}`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="faq-content">
        <div className="faq-header">
          <h1 className='text-4xl font-bold text-center text-indigo-800 mb-2 calc_01'>Frequently Asked Questions</h1>
          <p>Find answers to common questions about our platform</p>
        </div>
        
        <div className="faq-sections">
          {faqSections.map((section, sectionIndex) => (
            <div 
              key={section.id}
              ref={el => sectionRefs.current[sectionIndex] = el}
              className="faq-section"
              id={`section-${section.id}`}
            >
              <h2 className="section-title">
                {section.title}
              </h2>
              
              <div className="section-items">
                {section.items.map((item, itemIndex) => (
                  <div key={item.id} className="faq-item">
                    <button
                      onClick={() => toggleAccordion(itemIndex, sectionIndex)}
                      className={`faq-question ${activeIndex === itemIndex && activeSection === sectionIndex ? 'active' : ''}`}
                      aria-expanded={activeIndex === itemIndex && activeSection === sectionIndex}
                    >
                      <span>{item.question}</span>
                      <svg className="chevron" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    <div
                      className={`faq-answer ${activeIndex === itemIndex && activeSection === sectionIndex ? 'open' : ''}`}
                      aria-hidden={!(activeIndex === itemIndex && activeSection === sectionIndex)}
                    >
                      <div className="answer-content">
                        {/* Handle different answer formats */}
                        {item.answer.includes(', ') ? (
                          item.answer.split(', ').map((point, i) => (
                            <div key={i} className="answer-point">
                              <span className="bullet">•</span>
                              <p>{point}</p>
                            </div>
                          ))
                        ) : (
                          <p>{item.answer}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="faq-contact">
          <h2>Still have questions?</h2>
          <p>Contact our support team for personalized assistance</p>
          
          <div className="contact-cards">
            <div className="contact-card">
              <h3>General Inquiries</h3>
              <ul>
                <li><span>Email:</span> <a href="mailto:support@kritikatopstocks.com">support@kritikatopstocks.com</a></li>
                <li><span>Response Time:</span> Within 24 hours</li>
                <li><span>Business Hours:</span> Monday to Friday, 9 AM to 6 PM</li>
              </ul>
            </div>
            
            <div className="contact-card">
              <h3>Specialized Support</h3>
              <ul>
                <li><span>Course Questions:</span> <a href="mailto:courses@kritikatopstocks.com">courses@kritikatopstocks.com</a></li>
                <li><span>Technical Issues:</span> <a href="mailto:tech@kritikatopstocks.com">tech@kritikatopstocks.com</a></li>
                <li><span>Premium Support:</span> Available for VIP members</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
            <style jsx>{`
        .faq-container {
          margin: 0 auto;
          padding: 2rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        @media (min-width: 768px) {
          .faq-container {
            flex-direction: row;
            padding: 3rem 2rem;
            gap: 3rem;
          }
        }

        /* Sidebar Styles */
        .faq-sidebar {
          width: 100%;
        }

        @media (min-width: 768px) {
          .faq-sidebar {
            width: 280px;
            flex-shrink: 0;
          }
        }

        .sidebar-inner {
          position: sticky;
          top: 1rem;
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
        }

        .sidebar-titles {
          font-size: 1.25rem;
          font-weight: 600;
          color: #000;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .sidebar-items {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .sidebar-item {
          text-align: left;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-weight: 500;
          color: #4b5563;
          transition: all 0.2s ease;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .sidebar-item:hover {
          background: #f3f4f6;
          color: #111827;
        }

        .sidebar-item.active {
          background: #eff6ff;
          color: #1d4ed8;
          font-weight: 600;
        }

        /* Main Content Styles */
        .faq-content {
          flex-grow: 1;
        }

        .faq-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .faq-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.75rem;
          line-height: 1.2;
        }

        .faq-header p {
          font-size: 1.125rem;
          color: #4b5563;
          max-width: 700px;
          margin: 0 auto;
        }

        /* FAQ Sections */
        .faq-sections {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .faq-section {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
          scroll-margin-top: 1rem;
        }

        .section-title {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          padding: 1.25rem 2rem;
          font-size: 1.125rem;
          font-weight: 600;
          color: white;
          margin: 0;
        }

        .section-items {
          display: flex;
          flex-direction: column;
        }

        /* FAQ Items */
        .faq-item {
          border-bottom: 1px solid #e5e7eb;
          transition: background 0.2s ease;
        }

        .faq-item:last-child {
          border-bottom: none;
        }

        .faq-item:hover {
          background: #f9fafb;
        }

        .faq-question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          text-align: left;
          padding: 1.25rem 2rem;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          color: #111827;
          transition: all 0.2s ease;
        }

        .faq-question:hover {
          color: #3b82f6;
        }

        .faq-question.active {
          color: #1d4ed8;
        }

        .faq-question span {
          flex: 1;
          margin-right: 1rem;
        }

        .chevron {
          width: 1.25rem;
          height: 1.25rem;
          transition: transform 0.2s ease;
        }

        .faq-question.active .chevron {
          transform: rotate(180deg);
          color: #1d4ed8;
        }

        /* FAQ Answers */
        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease, opacity 0.2s ease;
          opacity: 0;
        }

        .faq-answer.open {
          max-height: 500px;
          opacity: 1;
        }

        .answer-content {
          padding: 0 2rem 1.5rem;
        }

        .answer-point {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          color: #4b5563;
          line-height: 1.5;
        }

        .bullet {
          color: #3b82f6;
          font-weight: bold;
          flex-shrink: 0;
        }

        /* Contact Section */
        .faq-contact {
          margin-top: 4rem;
          background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
          border-radius: 12px;
          padding: 2.5rem;
          border: 1px solid #bfdbfe;
        }

        .faq-contact h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.75rem;
          text-align: center;
        }

        .faq-contact p {
          font-size: 1.125rem;
          color: #4b5563;
          text-align: center;
          margin-bottom: 2rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .contact-cards {
          display: grid;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .contact-cards {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .contact-card {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .contact-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }

        .contact-card h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .contact-card ul {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .contact-card li {
          display: flex;
          gap: 0.5rem;
          color: #4b5563;
        }

        .contact-card span {
          font-weight: 500;
          color: #374151;
          flex-shrink: 0;
        }

        .contact-card a {
          color: #3b82f6;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .contact-card a:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default FAQAccordion;