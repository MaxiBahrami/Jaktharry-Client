import React from 'react';

const IntresentNews = ({user}) => {
  return (
    <div className='mt-5'>
      <h5>Intressanta nyheter: </h5>
      <p className='m-4 border-1 border p-2 w-75'>
        <span className='mt-1 px-5'>Cat1</span>
        <span className='mt-1 px-5'>Cat2</span>
        <span className='mt-1 px-5 text-end'>
          <button className='btn btn-outline-success'>Ändring av intresse</button>
        </span>
      </p>
    </div>
  );
}

export default IntresentNews;
