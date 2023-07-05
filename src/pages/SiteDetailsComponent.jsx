import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import { Container } from '@mui/material'
import { LocationListResults } from '../components/siteDetails/location/locationList';
import MapsMultiplePoints from '../components/maps/mapsMultiplePoints';
import ApplicationStore from '../utils/localStorageUtil';

const SiteDetails = () => {
  const [locationCoordinationList, setLocationCoordinationList] = useState([]);
  const [centerLat, setCenterLat] = useState(23.500);
  const [centerLng, setCenterLng] = useState(80.500);
  const navigate = useNavigate();
  useEffect(() => {
    const { locationDetails } = ApplicationStore().getStorage('userDetails');
    const { locationLabel, branchLabel, facilityLabel, buildingLabel, floorLabel, labLabel } = ApplicationStore().getStorage('siteDetails');
    const { location_id, branch_id, facility_id, building_id, floor_id, lab_id } = locationDetails;
    
    if(lab_id) {
      return navigate(`${locationLabel}/${branchLabel}/${facilityLabel}/${buildingLabel}/${floorLabel}/${labLabel}`, { state: {location_id, branch_id, facility_id, building_id, floor_id, lab_id}}); 
    } else if(floor_id) {
      return navigate(`${locationLabel}/${branchLabel}/${facilityLabel}/${buildingLabel}/${floorLabel}`, { state: {location_id, branch_id, facility_id, building_id, floor_id}}); 
    } else if(building_id) {
      return navigate(`${locationLabel}/${branchLabel}/${facilityLabel}/${buildingLabel}`, { state: {location_id, branch_id, facility_id, building_id}}); 
    } else if(facility_id) {
      return navigate(`${locationLabel}/${branchLabel}/${facilityLabel}`, { state: {location_id, branch_id, facility_id}}); 
    } else if(branch_id) {
      return navigate(`${locationLabel}/${branchLabel}`, { state: { location_id, branch_id }}); 
    } else if(location_id) {
      return navigate(`${locationLabel}`, { state: { location_id }}); 
    }
  }, [locationCoordinationList]);

  return (
    <Container maxWidth={false} style={{
      marginTop:0, height: '94vh', width: '100%',
      paddingRight: '2px',
      paddingLeft: '2px'
    }}>
      <Grid container style={{overflow: 'auto', height: '94vh', width: '100%'}}>
        <Grid item sx={{ mt: 1 }}  xs={12} sm={12} md={12} lg={12} xl={12}
        style={{
          height: '46vh',
          marginTop: '0px',
          minHeight: '300px'
        }}>
          <LocationListResults setLocationCoordinationList={setLocationCoordinationList} centerLat={centerLat} centerLng={centerLng} />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} 
        style={{
          height: '47vh',
        }}>
        {locationCoordinationList.length !== 0
            ? (
          <MapsMultiplePoints 
            width="100%"
            height="47vh"
            markers={locationCoordinationList}
            zoom={4}
            center={{ lat: centerLat, lng: centerLng }}
          />
          )
          : ''}
        </Grid>
      </Grid>
    </Container>
  )
}

export default SiteDetails