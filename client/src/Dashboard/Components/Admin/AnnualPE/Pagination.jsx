import React, { useEffect, useState } from 'react';
import { Pagination as MuiPagination } from '@mui/material';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  useEffect(() => {
    console.log('Current Page:', currentPage);
    console.log('Total Pages:', totalPages);
  }, [currentPage, totalPages]);

  return (
    <MuiPagination
      count={totalPages}
      page={currentPage}
      onChange={(event, page) => onPageChange(page)}
      shape="rounded"
      color="primary"
    />
  );
};

export default Pagination;
