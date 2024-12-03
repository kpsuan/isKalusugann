import { motion } from 'framer-motion';

const HealthcareSection = () => {
  const textVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const imageVariant = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (custom) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: custom * 0.2, duration: 0.8 },
    }),
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
        {/* Text Content */}
        <motion.div
          className="font-light text-gray-500 sm:text-lg dark:text-gray-400"
          initial="hidden"
          animate="visible"
          variants={textVariant}
        >
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Making university healthcare accessible
          </h2>
          <p className="mb-4">
            We are strategists, designers, and developers. Innovators and problem solvers. Small enough to be simple and quick, but big enough to deliver the scope you want at the pace you need.
          </p>
          <p>
            We are strategists, designers, and developers. Innovators and problem solvers. Small enough to be simple and quick.
          </p>
        </motion.div>

        {/* Image Content */}
        <motion.div
          className="grid grid-cols-2 gap-4 mt-8"
          initial="hidden"
          animate="visible"
        >
          {[
            "https://www.upv.edu.ph/images/hsu-medical-mission1-2019.jpg",
            "https://www.upv.edu.ph/images/hsu-medical-mission3-2019.jpg",
            "https://www.upv.edu.ph/images/hsu-staff-vaccinated1.jpg",
            "https://i0.wp.com/www.imtnews.ph/wp-content/uploads/2019/10/1571617105194.jpg?fit=640%2C374&ssl=1",
          ].map((src, index) => (
            <motion.img
              key={index}
              custom={index}
              variants={imageVariant}
              className={`w-full rounded-lg ${
                index > 1 ? "mt-4 lg:mt-10" : ""
              }`}
              src={src}
              alt={`office content ${index + 1}`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HealthcareSection;
