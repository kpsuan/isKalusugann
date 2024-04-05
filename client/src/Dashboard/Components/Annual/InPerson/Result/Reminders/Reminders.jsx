import React from 'react';
import MultipleAccordions from './MultipleAccordions';
import './reminders.css'
function App() {
    const accordionData = [
        { 
            title: 'Requirements', 
            content: (
                <div>
                    Please bring with you the following:<br/> <br/>
                        1. Completely Filled-Out <b><u>Periodic Health Examination Form</u></b><br/>
                        2. University ID/ Form 5<br/>
                        3. White Folder<br/>
                        4. <b><u>Request for P.E.</u></b>
                </div>
            )
        },
        { title: 'Procedures', content: 'Content for Accordion 2' },
        { title: 'Important Reminders', content: 'Content for Accordion 3' }
    ];
    
    

    return (
        <div className='accordion-div2'>
            <div className="acc2">
                <MultipleAccordions data={accordionData} />
            </div>
        </div>
    );
}

export default App;
