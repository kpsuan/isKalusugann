import React from 'react';
import MultipleAccordions from './MultipleAccordions';
import './accordion.css'
function App() {
    const accordionData = [
        { title: 'Pre-Enlistment Period', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec nisl quis risus eleifend venenatis. Mauris nec justo nec ligula suscipit consequat. Donec rutrum nisi nec faucibus euismod. Sed sit amet vestibulum metus. ' },
        { title: 'Scheduiling Process', content: 'Content for Accordion 2' },
        { title: 'View Assigned Schedule', content: 'Content for Accordion 3' }
    ];

    return (
        <div className='accordion-div'>
            <p>Below is the process for the InPerson Physical Exam, Click the Get Started button to get started</p>
            <div className="acc">
                <MultipleAccordions data={accordionData} />
            </div>
        </div>
    );
}

export default App;
