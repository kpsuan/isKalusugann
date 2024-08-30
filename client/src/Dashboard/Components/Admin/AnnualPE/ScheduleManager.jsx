import React, { useState } from 'react';
import InPerson from './InPerson';
import RescheduleStatus from './RescheduleStatus';

const ScheduleManager = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <>
      <InPerson setStartDate={setStartDate} setEndDate={setEndDate} />
      <RescheduleStatus startDate={startDate} endDate={endDate} />
    </>
  );
};

export default ScheduleManager;
