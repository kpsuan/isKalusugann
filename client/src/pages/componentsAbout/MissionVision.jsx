import React from 'react';
import { motion } from 'framer-motion';

const MissionVission = () => {
  const sectionVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const headingVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  };

  const testimonialVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.2, duration: 0.6 },
    }),
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <motion.div
        className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-6"
        initial="hidden"
        animate="visible"
        variants={sectionVariant}
      >
        <motion.div
          className="mx-auto max-w-screen-sm"
          variants={headingVariant}
        >
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            HSU Core Values
          </h2>
          <p className="mb-8 font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
            Explore the whole collection of open-source web components and elements built with the utility classes from Tailwind
          </p>
        </motion.div>

        <motion.div
          className="grid mb-8 lg:mb-12 lg:grid-cols-2"
          initial="hidden"
          animate="visible"
        >
          {testimonials.map((testimonial, index) => (
            <motion.figure
              key={index}
              custom={index}
              variants={testimonialVariant}
              className="flex flex-col justify-center items-center p-8 text-center bg-gray-50 border-b border-gray-200 md:p-12 lg:border-r dark:bg-gray-800 dark:border-gray-700"
            >
              <blockquote className="mx-auto mb-8 max-w-2xl text-gray-500 dark:text-gray-400">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {testimonial.title}
                </h3>
                <p className="my-4">{testimonial.quote}</p>
                {testimonial.extra && <p className="my-4">{testimonial.extra}</p>}
              </blockquote>
              <figcaption className="flex justify-center items-center space-x-3">
                <img
                  className="w-9 h-9 rounded-full"
                  src={testimonial.avatar}
                  alt="profile picture"
                />
                <div className="space-y-0.5 font-medium dark:text-white text-left">
                  <div>{testimonial.name}</div>
                  <div className="text-sm font-light text-gray-500 dark:text-gray-400">
                    {testimonial.position}
                  </div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

const testimonials = [
  {
    title: "MISSION",
    quote:
      "I recently got my hands on Flowbite Pro, and holy crap, I'm speechless with how easy this was to integrate within my application. Most templates are a pain, code is scattered, and near impossible to theme.",
    extra:
      "Flowbite has code in one place and I'm not joking when I say it took me a matter of minutes to copy the code, customise it and integrate within a Laravel + Vue application. If you care for your time, I hands down would go with this.",
    name: "Bonnie Green",
    position: "Developer at Open AI",
    avatar: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/karen-nelson.png",
  },
  {
    title: "VISION",
    quote:
      "FlowBite provides a robust set of design tokens and components based on the popular Tailwind CSS framework. From the most used UI components like forms and navigation bars to the whole app screens designed both for desktop and mobile, this UI kit provides a solid foundation for any project.",
    extra:
      "Designing with Figma components that can be easily translated to the utility classes of Tailwind CSS is a huge timesaver!",
    name: "Roberta Casas",
    position: "Lead designer at Dropbox",
    avatar: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/roberta-casas.png",
  },
];

export default MissionVission;
