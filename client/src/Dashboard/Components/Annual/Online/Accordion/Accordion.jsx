import React from 'react';
import MultipleAccordions from './MultipleAccordions';
import './accordion.css'
function App() {
    const accordionData = [
        { title: 'Pre-Enlistment Period', content: 'During the pre-enlistment period, users can pick their mode of medical examination. In the Online Mode, users are required to submit necessary medical documents in order to be enlisted ' },
        { title: 'HSU Reviews and Validates Documents After Pre-Enlistment Period', content: 'Content for Accordion 2' },
        { title: 'Receive Updates from the HSU and View Attached MedCert if approved', content: 'Content for Accordion 3' }
    ];

    return (
        <div className='accordion-div'>
            <p>Below is the process for the Online Physical Exam, Click the Get Started button to get started</p>
            <div className="acc">
                <MultipleAccordions data={accordionData} />
            </div>
        </div>
    );
}

export default App;
