import React, { useState, useEffect, useRef } from 'react';
import image from '../../assets/dashboard.png'

const Features = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [visibleFeatures, setVisibleFeatures] = useState(new Set());
  
  const heroRef = useRef(null);
  const featuresRef = useRef([]);

  // Feature data
  const features = [
    {
      id: 1,
      title: "Schedule & Reschedule Annual PE",
      description: "Plan it, create it, launch it. Collaborate seamlessly with all the organization and hit your marketing goals every month with our marketing plan.",
      icon: (
        <path
          fillRule="evenodd"
          d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      )
    },
    {
      id: 2,
      title: "Annual PE Attendance Monitoring",
      description: "Protect your organization, devices and stay compliant with our structured workflows and custom permissions made for you.",
      icon: (
        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
      )
    },
    {
      id: 3,
      title: "Download and Request Documents",
      description: "Explore our list of audit-safe workflow templates for tracking works with peace of mind.",
      icon: (
        <path
          fillRule="evenodd"
          d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308a24.974 24.974 0 01-16 0z"
          clipRule="evenodd"
        />
      )
    }
  ];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3,
    };

    // Observer for hero section
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsHeroVisible(true);
          heroObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observer for feature cards
    const featureObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleFeatures(prev => new Set([...prev, Number(entry.target.dataset.featureId)]));
          featureObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Start observing
    if (heroRef.current) {
      heroObserver.observe(heroRef.current);
    }

    featuresRef.current.forEach(ref => {
      if (ref) {
        featureObserver.observe(ref);
      }
    });

    return () => {
      heroObserver.disconnect();
      featureObserver.disconnect();
    };
  }, []);

  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div 
          ref={heroRef}
          className={`gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6 transition-all duration-1000 transform ${
            isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="relative w-full transition-transform duration-300 hover:scale-105">
            <img
              className="w-full dark:hidden transition-opacity duration-300"
              src={image}
              alt="dashboard image"
            />
            <img
              className="w-full hidden dark:block transition-opacity duration-300"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup.svg"
              alt="dashboard image"
            />
            <div className="absolute inset-0 bg-primary-600/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
          </div>
          
          <div className="mt-4 md:mt-0 transform transition-all duration-300 hover:translate-x-2">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              isKalusugan: A UPV HSU Portal
            </h2>
            <p className="mb-6 font-light text-gray-500 md:text-lg dark:text-gray-400">
              Flowbite helps you connect with friends and communities of people who share your interests. Connecting with
              your friends and family as well as discovering new ones is easy with features like Groups.
            </p>
            <a
              href="#"
              className="inline-flex items-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              Get started
              <svg
                className="ml-2 -mr-1 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </section>
      
      <section className="bg-white dark:bg-gray-900 pb-10">
        <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
          <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                ref={el => featuresRef.current[index] = el}
                data-feature-id={feature.id}
                className={`relative p-6 rounded-xl transition-all duration-700 transform ${
                  visibleFeatures.has(feature.id) 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                } hover:shadow-xl hover:-translate-y-1`}
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900 transition-transform duration-300 ${
                  hoveredFeature === feature.id ? 'scale-110' : ''
                }`}>
                  <svg
                    className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold dark:text-white transition-colors duration-300 hover:text-primary-600 dark:hover:text-primary-400">
                  {feature.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {feature.description}
                </p>
                <div className={`absolute inset-0 bg-primary-600/5 rounded-xl transition-opacity duration-300 ${
                  hoveredFeature === feature.id ? 'opacity-100' : 'opacity-0'
                }`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;