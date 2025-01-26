import React from "react";
import { motion } from "framer-motion"; // Note: You'll need to install framer-motion
import logo from "../../assets/logo1.png";
import { 
  FaFacebook, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaPhoneAlt 
} from "react-icons/fa"; // Note: You'll need to install react-icons

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.footer 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 shadow-lg"
    >
      <div className="mx-auto max-w-screen-xl">
        <motion.div 
          variants={containerVariants}
          className="md:flex md:justify-between"
        >
          {/* Logo Section */}
          <motion.div 
            variants={itemVariants}
            className="mb-6 md:mb-0 flex flex-col pt-20 m-4 items-center"
          >
            <motion.img
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              src={logo}
              className="mb-2 h-10 transition-transform duration-300"
              alt="ISKALUSUGAN Logo"
            />
            <motion.span 
              className="text-2xl font-bold text-blue-800 dark:text-white tracking-wider"
              whileHover={{ scale: 1.05 }}
            >
              a UPV HSU Portal
            </motion.span>
          </motion.div>
          
          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            {/* Quick Links */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col"
            >
              <h2 className="mb-6 text-sm font-bold text-blue-900 uppercase dark:text-white">
                Quick Links
              </h2>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                {[
                  { name: "Computerized Registration System", url: "https://crs.upv.edu.ph/" },
                  { name: "UPV Learning Management System", url: "https://lms.upvisayas.net/login.php" },
                  { name: "UP Visayas Website", url: "https://www.upv.edu.ph/" },
                  { name: "UPV TLRC Website", url: "https://tlrc.upv.edu.ph/" },
                  { name: "UPV Online Library", url: "https://library.upv.edu.ph/" }
                ].map((link, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ 
                      x: 10,
                      color: "#3b82f6"
                    }}
                  >
                    <a 
                      href={link.url} 
                      className="hover:text-blue-500 transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Information */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col"
            >
              <h2 className="mb-6 text-sm font-bold text-blue-900 uppercase dark:text-white">
                Contact Us
              </h2>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                {[
                  { icon: <FaFacebook />, text: "Facebook", url: "https://www.facebook.com/upv.hsu.miagao/" },
                  { icon: <FaMapMarkerAlt />, text: "UP Visayas, Miagao, 5023 Iloilo", url: "https://maps.app.goo.gl/uTuXbhgJdTVMumWD6" },
                  { icon: <FaEnvelope />, text: "hsumiagaomedical@upv.edu.ph", url: "mailto:hsumiagaomedical@upv.edu.ph" },
                  { icon: <FaPhoneAlt />, text: "033-3158301 (Landline)", url: "tel:033-3158301" }
                ].map((contact, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-center space-x-2"
                    whileHover={{ 
                      x: 10,
                      color: "#3b82f6"
                    }}
                  >
                    <span className="text-blue-600">{contact.icon}</span>
                    <a 
                      href={contact.url} 
                      className="hover:text-blue-500 transition-colors duration-300"
                    >
                      {contact.text}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Google Map */}
            <motion.div 
              variants={itemVariants}
              className="w-full"
            >
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="shadow-lg rounded-lg overflow-hidden"
              >
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2772.6602477045894!2d122.22783244735504!3d10.64671784293533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33ae5c783e406039%3A0xc19cd3690ea64d5f!2sUPV%20Infirmary!5e0!3m2!1sen!2sph!4v1732002623520!5m2!1sen!2sph" 
                  width="100%" 
                  height="250"
                  style={{ border: "0" }}
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="UPV HSU Location"
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer Bottom */}
        <motion.div 
          variants={itemVariants}
          className="mt-8 pt-6 border-t border-blue-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center"
        >
          <span className="text-sm text-gray-600 dark:text-gray-400">
            © 2024{" "}
            <motion.span 
              whileHover={{ scale: 1.1 }}
              className="font-bold text-blue-700 dark:text-white"
            >
              isKalusugan™
            </motion.span>
            . All Rights Reserved.
          </span>
          
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="mt-4 sm:mt-0"
          >
            <a
              href="https://www.facebook.com/upv.hsu.miagao/"
              className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
            >
              <FaFacebook size={24} />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;