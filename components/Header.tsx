import React from 'react';

const Header: React.FC = () => {
  return (   
    <header 
      className="w-full p-4 border-b" 
      style={{ backgroundColor: '#53A88B', borderColor: '#4a9a7b' }}
    >
      
      <div className="text-xl font-bold uppercase" style={{ color: '#FFFFFF' }}>
        VIETAPIG
      </div>
    </header>
  );
};

export default Header;