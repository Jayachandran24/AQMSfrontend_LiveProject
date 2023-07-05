import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { Container } from '@mui/material';
import { useParams, useLocation } from 'react-router-dom';
import { BranchListResults } from './siteDetails/branch/branchList';
import MapsMultiplePoints from './maps/mapsMultiplePoints';

function Branch() {
  const routeStateObject = useLocation();
  const { centerCoordination } = routeStateObject.state;
  const [locationCoordinationList, setLocationCoordinationList] = useState([]);
  const [centerLat, setCenterLat] = useState(21.785);
  const [centerLng, setCenterLng] = useState(72.91655655);
  const { locationId } = useParams();
  useEffect(() => {
    const coordinates = centerCoordination ? centerCoordination.replaceAll('"', '').split(',') : [];
    setCenterLat(parseFloat(coordinates[0]) || '');
    setCenterLng(parseFloat(coordinates[1]) || '');
  }, [locationCoordinationList]);
  return (
    <Container maxWidth={false} style={{ 
      marginTop: 0, height: '94vh', width: '100%',
      paddingLeft: '2px', 
      paddingRight: '2px',
    }}>
      <Grid container style={{ overflow: 'auto', height: '94vh', width: '100%', }}>
        <Grid item sx={{ mt: 1 }} xs={12} sm={12} md={12} lg={12} xl={12}
        style={{
          height: '46vh',
          marginTop: '0px',
          minHeight: '300px'
        }}>
          <BranchListResults
            locationId={locationId}
            locationCoordinationList={locationCoordinationList}
            setLocationCoordinationList={setLocationCoordinationList}
            centerLat={centerLat}
            centerLng={centerLng}
          />
        </Grid>
        <Grid item sx={{ mt: 1 }} xs={12} sm={12} md={12} lg={12} xl={12}
          style={{
            height: '47vh'
          }}
        >
          {locationCoordinationList.length !== 0
            ? (
              <MapsMultiplePoints
                width="100%"
                height="47vh"
                markers={locationCoordinationList}
                zoom={6}
                center={{
                  lat: locationCoordinationList[0].position.lat
                  || centerLat,
                  lng: locationCoordinationList[0].position.lng
                  || centerLng,
                }}
              />
            )
            : ''}
        </Grid>
      </Grid>
    </Container>
  );
}

export default Branch;
