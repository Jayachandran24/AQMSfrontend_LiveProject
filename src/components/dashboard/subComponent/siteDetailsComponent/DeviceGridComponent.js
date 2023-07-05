import React, { useEffect, useState } from 'react';
import {
  Breadcrumbs, Typography, Grid, Backdrop, CircularProgress,
} from '@mui/material';
import { DeviceFetchService, HooterRelayService, NavigateAlarmService, TestHooterRelay } from '../../../../services/LoginPageService';
import DeviceWidget from '../deviceCard/DeviceWidget';
import NotificationWidget from '../deviceCard/NotificationWidget';
import ApplicationStore from '../../../../utils/localStorageUtil';
import NotificationBar from '../../../notification/ServiceNotificationBar';
import AlertModalComponent from '../landingPageComponents/AlertModalComponent';
import { useLocation } from 'react-router-dom';


/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-shadow */

function DeviceGridComponent(props) {
  const {
    setImg, setLocationDetails, setProgressState, breadCrumbLabels, setBreadCrumbLabels,
    setDeviceCoordsList, setIsDashBoard, setIsGeoMap, siteImages, locationAlerts
  } = props;
  const [labId, setlabId] = useState({
    lab_id: props?.locationDetails?.lab_id  || ''});
  const [alertOpen, setAlertOpen] = useState(false);
  const [deviceList, setDeviceList] = useState([]);
  const [deviceTotal, setDeviceTotal] = useState('0');
  const [deviceAlert, setAlertTotal] = useState('0');
  const [disconnectedDevices, setDisconnectedDevices] = useState('0');
  const [labHooterStatus, setLabHooterStatus] = useState('0');
  const [aqiIndex, setAqiIndex] = useState('NA');
  const [expanded, setExpanded] = useState(false);
  const { intervalDetails, userDetails } = ApplicationStore().getStorage('userDetails');
  const { deviceIdList } = ApplicationStore().getStorage('alertDetails');
  const intervalSec = intervalDetails.deviceLogInterval * 1000;
  const [pollingStatus, setPollingStatus] = useState(false);
  const [backdropOpen, setBackdropOpen] = useState(true);
  const [openNotification, setNotification] = useState({
    status: false,
    type: 'error',
    message: '',
  });

  const location = useLocation();
  const deviceNameData = location?.state?.deviceNameData;

  const [navDeviceCard,setNavDeviceCard]  = useState('');

  useEffect(()=>{
    if(breadCrumbLabels === '' || locationAlerts === '')
    {
      NavigateAlarmService({
        deviceName:deviceNameData,
        sensorName:'',
        type :'device',
      },NavigateAlarmServiceSuceess,NavigateAlarmServiceException);
    }
   
  },[deviceNameData]);
 
  const NavigateAlarmServiceSuceess=(dataObject)=>{
    setLocationDetails(dataObject);
    setBreadCrumbLabels(dataObject?.branchName);
    setlabId(dataObject?.lab_id);
    setBreadCrumbLabels(dataObject?.data);
    console.log('breadCrumbLabels',dataObject)
  }
  
  const NavigateAlarmServiceException =()=>{

  }

  useEffect(() => {
    console.log(deviceIdList);
    intervalCallFunction();
    const devicePolling = setInterval(() => {
      intervalCallFunction();
    }, intervalSec);
    return () => {
      clearInterval(devicePolling);
    };
  }, [props.locationDetails || '']);

  const intervalCallFunction = () => {
    DeviceFetchService({
      location_id: props.locationDetails.location_id,
      branch_id: props.locationDetails.branch_id,
      facility_id: props.locationDetails.facility_id,
      building_id: props.locationDetails.building_id,
      floor_id: props.locationDetails.floor_id,
      lab_id: props.locationDetails.lab_id,
    }, handleSuccess, handleException);
  };


  const handleSuccess = (dataObject) => {
    setDeviceList(dataObject.data);
    const deviceCoordinationsList = dataObject.data.map((data) => {
      const coordination = data.floorCords;
      const arrayList = coordination?.split(',');
      return arrayList && { top: arrayList[0], left: arrayList[1] };
    });
    const filteredArray = deviceCoordinationsList.filter((x) => x != null);
    // setDeviceCoordsList(filteredArray || []);
    setDeviceCoordsList([]);
    setDeviceTotal(dataObject.totalData);
    setAlertTotal(dataObject.alertCount);
    setDisconnectedDevices(dataObject.disconnectedDevices);
    setAqiIndex(dataObject.aqiIndex || 'NA');
    setLabHooterStatus(dataObject.labHooterStatus);
    setBackdropOpen(false);
  };


  const handleException = () => { };

  const setLocationlabel = (value) => {
    const { locationDetails } = ApplicationStore().getStorage('userDetails');
    setDeviceCoordsList([]);
    setProgressState(() => {
      let newValue = value;
      if (locationDetails.lab_id) {
        // newValue = value < 7 ? 5 : value;
        // value >=4 ? setIsGeoMap(false) : setIsGeoMap(true);
        // setIsDashBoard(0);
      } else if (locationDetails.floor_id) {
        newValue = value < 6 ? 5 : value;
        value >=4 ? setIsGeoMap(false) : setIsGeoMap(true);
        setIsDashBoard(0);
      } else if (locationDetails.building_id) {
        newValue = value < 5 ? 4 : value;
        value <=3 ? setIsGeoMap(true) : setIsGeoMap(false);
        setIsDashBoard(0);
      } else if (locationDetails.facility_id) {
        newValue = value < 4 ? 3 : value;
        value <=3 ? setIsGeoMap(true) : setIsGeoMap(false);
        setIsDashBoard(0);
      } else if (locationDetails.branch_id) {
        newValue = value < 3 ? 2 : value;
        value <= 3 ? setIsGeoMap(true) : setIsGeoMap(false);
        setIsDashBoard(0);
      } else if (locationDetails.location_id) {
        newValue = value < 2 ? 1 : value;
        value <= 3 ? setIsGeoMap(true) : setIsGeoMap(false);
        setIsDashBoard(0);
      } else {
        // locationAlerts({});
        value <= 3 ? setIsGeoMap(true) : setIsGeoMap(false);
        setIsDashBoard(0);
      }
      return newValue;
    });
  };

  const handleHooter = () => {
    (userDetails?.userRole === 'systemSpecialist' 
    || userDetails?.userRole === 'Admin' 
    || userDetails?.userRole === 'Manager'
    ) && HooterRelayService({ lab_id: props.locationDetails.lab_id }, handleHooterSuccess, handleHooterException);
  }

  const handleHooterSuccess = (dataObject) => {
    console.log(dataObject.message);
    setLabHooterStatus('0');
    setNotification({
      status: true,
      type: 'success',
      message: 'Disabled Successfully...!',
    });
  }

  const handleHooterException = () => {
    setNotification({
      status: false,
      type: 'error',
      message: 'Unable to disable the hooter...!',
    });
  }
  
  const testHooter = () =>{
    TestHooterRelay({lab_id: props.locationDetails.lab_id}, handleTestHooterSuccess, handleTestHooterException)
  }

  const handleTestHooterSuccess = (dataObject) =>{
    setLabHooterStatus(dataObject.currentHooterStatus);
    setNotification({
      status: true,
      type: 'success',
      message: dataObject.message,
    });
  }

  const handleTestHooterException = (errorObject, errorMessage) =>{
    setNotification({
      status: false,
      type: 'error',
      message: 'Unable to test the Hooter...!',
    });
  }

  const handleAlert = () => {
    setAlertOpen(true);
  }

  const handleClose = () => {
    setNotification({
      status: false,
      type: '',
      message: '',
    });
  };`
  `
 return (
  <div style={{
    height: '98%', width: '100%', marginTop: 10, marginLeft: 10, paddingLeft: 5, paddingTop: 5,
  }}
  >
    <Breadcrumbs aria-label="breadcrumb" separator="›">
      <h3
        onClick={() => {
          setDeviceCoordsList([]);
          const { locationDetails } = ApplicationStore().getStorage('userDetails');
          let value = 0;
          if (locationDetails.lab_id) {
            locationAlerts({lab_id: locationDetails.lab_id || props.locationDetails.lab_id});
            value = 6;
          } else if (locationDetails.floor_id) {
            locationAlerts({floor_id: locationDetails.floor_id || props.locationDetails.floor_id});
            value = 5;
          } else if (locationDetails.building_id) {
            locationAlerts({building_id: locationDetails.building_id || props.locationDetails.building_id});
            value = 4;
          } else if (locationDetails.facility_id) {
            locationAlerts({ facility_id: locationDetails.facility_id || props.locationDetails.facility_id });
            value = 3;
          } else if (locationDetails.branch_id) {
            locationAlerts({ branch_id: locationDetails.branch_id || props.locationDetails.branch_id });
            value = 2;
          } else if (locationDetails.location_id) {
            locationAlerts({ location_id: locationDetails.location_id || props.locationDetails.location_id });
            value = 1;
          } else {
            locationAlerts({});
            value = 0;
          }
          setImg('');
          // setIsGeoMap(true);
          setLocationlabel(value);
          // setIsDashBoard(0);
        }}
        style={{ cursor: 'pointer' }}
      >
        Location
      </h3>
      <h3
        onClick={() => {
          setDeviceCoordsList([]);
          const { locationDetails } = ApplicationStore().getStorage('userDetails');
          let value = 1;
          if (locationDetails.lab_id) {
            locationAlerts({lab_id: locationDetails.lab_id || props.locationDetails.lab_id});
            value = 6;
          } else if (locationDetails.floor_id) {
            locationAlerts({floor_id: locationDetails.floor_id || props.locationDetails.floor_id});
            value = 5;
          } else if (locationDetails.building_id) {
            locationAlerts({building_id: locationDetails.building_id || props.locationDetails.building_id});
            value = 4;
          } else if (locationDetails.facility_id) {
            locationAlerts({ facility_id: locationDetails.facility_id || props.locationDetails.facility_id });
            value = 3;
          } else if (locationDetails.branch_id) {
            locationAlerts({ branch_id: locationDetails.branch_id || props.locationDetails.branch_id });
            value = 2;
          } else {
            locationAlerts({ location_id: locationDetails.location_id || props.locationDetails.location_id });
            value = 1;
          }
          setImg('');
          // setIsGeoMap(true);
          setLocationlabel(value);
          // setIsDashBoard(0);
        }}
        style={{ cursor: 'pointer' }}
      >
        {breadCrumbLabels?.stateLabel || ''}
      </h3>
      <h3
        onClick={() => {
          setDeviceCoordsList([]);
          const { locationDetails } = ApplicationStore().getStorage('userDetails');
          let value = 2;
          if (locationDetails.lab_id) {
            locationAlerts({lab_id: locationDetails.lab_id || props.locationDetails.lab_id});
            value = 6;
          } else if (locationDetails.floor_id) {
            locationAlerts({floor_id: locationDetails.floor_id || props.locationDetails.floor_id});
            value = 5;
          } else if (locationDetails.building_id) {
            locationAlerts({building_id: locationDetails.building_id || props.locationDetails.building_id});
            value = 4;
          } else if (locationDetails.facility_id) {
            locationAlerts({ facility_id: locationDetails.facility_id || props.locationDetails.facility_id });
            value = 3;
          } else {
            locationAlerts({ branch_id: locationDetails.branch_id || props.locationDetails.branch_id });
            value = 2;
          }
          setImg('');
          // setIsGeoMap(true);
          setLocationlabel(value);
          // setIsDashBoard(0);
        }}
        style={{ cursor: 'pointer' }}
      >
        {breadCrumbLabels?.branchLabel || ''}
      </h3>
      <h3
        onClick={() => {
          setDeviceCoordsList([]);
          const { locationDetails } = ApplicationStore().getStorage('userDetails');
          let value = 3;
          // locationAlerts({ facility_id: locationDetails.facility_id || props.locationDetails.facility_id });
          if (locationDetails.lab_id) {
            locationAlerts({lab_id: locationDetails.lab_id || props.locationDetails.lab_id});
            value = 6;
          } else if (locationDetails.floor_id) {
            locationAlerts({floor_id: locationDetails.floor_id || props.locationDetails.floor_id});
            value = 5;
          } else if (locationDetails.building_id) {
            locationAlerts({building_id: locationDetails.building_id || props.locationDetails.building_id});
            value = 4;
          } else {
            locationAlerts({ facility_id: locationDetails.facility_id || props.locationDetails.facility_id });
            value = 3;
          }
          setImg('');
          // setIsGeoMap(true);
          setLocationlabel(value);
          // setIsDashBoard(0);
        }}
        style={{ cursor: 'pointer' }}
      >
        {breadCrumbLabels?.facilityLabel || ''}
      </h3>
      <h3
        onClick={() => {
          setDeviceCoordsList([]);
          const { locationDetails } = ApplicationStore().getStorage('userDetails');
          let value = 4;
          // locationAlerts({ building_id: locationDetails.building_id || props.locationDetails.building_id });
          if (locationDetails.lab_id) {
            locationAlerts({lab_id: locationDetails.lab_id || props.locationDetails.lab_id});
            value = 6;
          } else if (locationDetails.floor_id) {
            locationAlerts({floor_id: locationDetails.floor_id || props.locationDetails.floor_id});
            value = 5;
          } else {
            locationAlerts({building_id: locationDetails.building_id || props.locationDetails.building_id});
            value = 4;
          }
          // setIsGeoMap(false);
          setImg('');
          setLocationlabel(value);
          // setIsDashBoard(0);
        }}
        style={{ cursor: 'pointer' }}
      >
        {breadCrumbLabels?.buildingLabel || ''}
      </h3>
      <h3
        onClick={() => {
          setDeviceCoordsList([]);
          const { locationDetails } = ApplicationStore().getStorage('userDetails');
          let value = 5;
          // locationAlerts({ floor_id: locationDetails.floor_id || props.locationDetails.floor_id });
          if (locationDetails.lab_id) {
            locationAlerts({lab_id: locationDetails.lab_id || props.locationDetails.lab_id});
            value = 6;
          } else {
            locationAlerts({floor_id: locationDetails.floor_id || props.locationDetails.floor_id});
            value = 5;
          }
          setImg('');
          // setIsGeoMap(false);
          setLocationlabel(value);
          // setIsDashBoard(0);
        }}
        style={{ cursor: 'pointer' }}
      >
        {breadCrumbLabels?.floorLabel || ''}
      </h3>
      <Typography
        underline="hover"
        color="inherit"
      >
        {breadCrumbLabels?.labLabel || ''}
      </Typography>
    </Breadcrumbs>
  
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    }}>
      <div style={{
        // overflow: 'scroll',
        width: '100%'
      }}>
        <div className="widgets" style={{ 
          height: 'auto', backgroundColor: '#fafafa', padding: 10,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: '100%'
        }}>
          <NotificationWidget type="hooterStatus" figure={labHooterStatus} handleClick={handleHooter}  userRole={userDetails?.userRole} testHooter={testHooter}/>
          <NotificationWidget type="disconnectedDevice" figure={disconnectedDevices} />
          <NotificationWidget type="devices" figure={deviceTotal} />
          <NotificationWidget type="alerts" figure={deviceAlert} handleClick={handleAlert} />
          <NotificationWidget type="aqi" aqi={aqiIndex} /> 
          {/* <NotificationWidget type="time" /> */}  
        </div>
      </div>
    </div>
    <div
      className=""
      style={{
        marginTop: 5,
        height: '76%',
        maxHeight: '100%',
        overflow: 'auto',
      }}
    >
      <Grid container sx={{ width: '100%' }}>

        {deviceList.map((data, index) => {
          return (
            <Grid
              item
              sm={6}
              xs={12}
              md={4}
              lg={3}
              xl={3}
              /* eslint-disable-next-line */
              key={index}
              sx={{ padding: 1 }}
            >
              <DeviceWidget
                type="aqmi"
                data={data}
                deviceIdList={deviceIdList}
                setLocationDetails={setLocationDetails}
                setIsDashBoard={setIsDashBoard}
                setBreadCrumbLabels={setBreadCrumbLabels}
              />
            </Grid>
          );
        })}
      </Grid>
    </div>
    <NotificationBar
      handleClose={handleClose}
      notificationContent={openNotification.message}
      openNotification={openNotification.status}
      type={openNotification.type}
    />
    <AlertModalComponent alertOpen={alertOpen} setAlertOpen={setAlertOpen} locationDetails={labId} />
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={backdropOpen}
      // onClick={handleClose}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  </div>
  );
}

export default DeviceGridComponent;
