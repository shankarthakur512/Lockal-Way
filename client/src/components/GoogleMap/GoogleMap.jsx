import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

const GoogleMap = ({ apiKey, latitude, longitude }) => {
  useEffect(() => {
   
    window.initMap = function() {
      const myLocation = { lat: latitude, lng: longitude };
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: myLocation,
      });
      new google.maps.Marker({
        position: myLocation,
        map: map,
      });
    };
  }, [latitude, longitude]);

  return (
    <div>
      <Helmet>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`}
          async
          defer
        ></script>
      </Helmet>
      <div id="map" style={{ height: '500px', width: '100%' }} className='rounded-lg'></div>
    </div>
  );
};

export default GoogleMap;
