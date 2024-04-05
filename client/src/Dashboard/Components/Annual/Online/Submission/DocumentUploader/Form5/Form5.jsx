import React from "react";
import Sidebar from '../../../../../SideBar Section/Sidebar'
import Top from '../../../../../Profile/Components/Header'
import '../../../../../../../App.css'
import './form5.css'
import EditableTable from "./EditableTable";
//import '../../onlinePE.scss'

const Form5 = () => {
    const headerTitle = "Annual Physical Examination";

    return (
        <div className="dashboard flex">
           <div className="dashboardContainer flex">
            <Sidebar/>
                <div className='mainContent'>
                    <Top title={headerTitle}/>
                            <div className="titleUpload flex">
                            <h4><span class="lighter-font">UNIVERSITY OF THE PHILIPINES VISAYAS
HEALTH SERVICE UNIT Miagao, Iloilo </span></h4>
                            </div>

                            <div className="editable-form">
                                <EditableTable/>
                            </div>
                        </div>
                    </div>
                </div>
    )
}

export default Form5
