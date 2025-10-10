import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const MembershipPackages = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        // Fetch all packages (assuming your backend provides this endpoint)
        const resPackages = await fetch('http://localhost:5000/api/packages');
        const dataPackages = await resPackages.json();

        // For each package fetch includes titles
        const packagesWithIncludes = await Promise.all(
          dataPackages.map(async (pkg) => {
            const resIncludes = await fetch(`http://localhost:5000/api/packages/${pkg.id}/includes`);
            const dataIncludes = await resIncludes.json();
            return {
              ...pkg,
              includesTitles: dataIncludes.map((inc) => inc.title), // assuming dataIncludes is array of includes
            };
          })
        );

        setPackages(packagesWithIncludes);
      } catch (error) {
        console.error('Error loading packages:', error);
      }
    };

    fetchPackages();
  }, []);

  // Background colors for cards as per your requirement:
  const bgColors = ['bg-black text-white', 'bg-blue-600 text-white', 'bg-black text-white'];

  return (
    <div
      className="pricing-inner-section-area py-16"
      style={{
        backgroundImage: `url("assets/img/all-images/bg/hero-bg1.png")`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <div className="text-center mb-12 heading1">
        <h5 data-aos="fade-left" data-aos-duration="800">MEMBERSHIP SYSTEM</h5><br />
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-0 second_mb1">
          Stock Market Learning Packages for Every Skill Level
        </h2>
      </div>

      <div className="container">
        <div className="row">
          {/* Map through packages */}
          {packages.slice(0, 3).map((pkg, index) => (
            <div
              key={pkg.id}
              className="col-lg-4 col-md-6"
              data-aos="flip-right"
              data-aos-duration="800"
            >
              <div className={`single-pricing-area ${index === 1 ? 'active' : ''} ${bgColors[index]}`} style={{ borderRadius: '10px', padding: '20px' }}>
                <div className="pricing-box">
                  <h3>{pkg.title}</h3>
                  <div className="space26"></div>
                  <p>{pkg.description || 'Explore this membership package'}</p>
                  <div className="space38"></div>
                  <h2>
                    ₹{pkg.price} <div>
                      <span>/Per Month</span>
                      <span className='mt-4'>Semi Annual</span>
                    </div>
                    <img
                      src="assets/img/elements/elements42.png"
                      alt=""
                      className="elements19 keyframe5"
                    />
                  </h2>
                  <div className="space32"></div>
                  <ul>
                    {pkg.includesTitles && pkg.includesTitles.length > 0 ? (
                      pkg.includesTitles.map((title, i) => (
                        <li key={i}>
                          <img
                            src={`assets/img/icons/${index === 1 ? 'check4.svg' : 'check3.svg'}`}
                            alt=""
                          />{' '}
                          {title}
                        </li>
                      ))
                    ) : (
                      <li>No includes available</li>
                    )}
                  </ul>
                  <div className="space32"></div>
                  <div className="btn-area1">
                    <Link to={`/package-details/${pkg.id}`} className="vl-btn1">
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MembershipPackages;