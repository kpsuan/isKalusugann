import React from 'react'
import LaboratoryServices from './componentsFacilities/LaboratoryServices'
import Header from './componentsHome/Header'
import StudentPackage from './componentsFacilities/StudentPackage'
import Services from './componentsFacilities/Services'

const Facilities = () => {
  return (
    <>
        <Header/>
        <section class="bg-white dark:bg-gray-900">
            <div class="py-11 px-14 mx-auto max-w-screen-xl lg:py-16 ">
                <div class="max-w-screen-lg text-gray-500 sm:text-lg dark:text-gray-400">
                    <h2 class="mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white">UPV HSU Services </h2>
                    <p class="mb-4 font-light">
                        The UPV Health Services Unit (HSU) provides essential healthcare to students, faculty, and staff, offering medical consultations, preventive care, and emergency services. It plays a key role in promoting wellness through health education and monitoring. 
                    </p>
                    <p class="mb-4 font-medium">HSU also offers laboratory services, including Fecalysis, Urinalysis, CBC, Platelet Count, CT-BC, Hematocrit, Hemoglobin, Blood Typing, FBS, Lipid Profile, Creatinine, Uric Acid, SGPT, BUN, HDL, Cholesterol, Triglycerides, and Pregnancy Test.</p>
                    <a href="#" class="inline-flex items-center font-medium text-primary-600 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-700">
                        Learn more
                        <svg class="ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                    </a>
                </div>
            </div>
        </section>
        <section class="bg-teal-500 py-2 antialiased dark:bg-gray-900"> 
            <div class="mx-auto max-w-screen-xl px-11 2xl:px-0"> 
            </div> 
        </section>
        <Services/>
        <section class="bg-black py-2 antialiased dark:bg-gray-900"> 
            <div class="mx-auto max-w-screen-xl px-11 2xl:px-0"> 
            </div> 
        </section>
        <StudentPackage/>
        <LaboratoryServices/>
        
    </>
  )
}

export default Facilities