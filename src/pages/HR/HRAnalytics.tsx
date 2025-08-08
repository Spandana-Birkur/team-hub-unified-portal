import React from 'react';

const HRAnalytics = () => {
  return (
    <div className="w-full h-screen">
      <iframe 
        title="Project powerbi report" 
        width="100%" 
        height="100%" 
        src="https://app.powerbi.com/view?r=eyJrIjoiYmNmYmYzOTYtYTA5Yi00ODQzLTliMjktZTYwYmY3NWIwNDg1IiwidCI6IjBlYWRiNzdlLTQyZGMtNDdmOC1iYmUzLWVjMjM5NWUwNzEyYyIsImMiOjZ9" 
        frameBorder="0" 
        allowFullScreen={true}
      />
    </div>
  );
};

export default HRAnalytics;
