import { Breadcrumbs, Card, CardHeader, CardContent, Chip, Typography, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { FloorfetchService, HooterStatusService } from '../../../../services/LoginPageService';
import { setAlertPriorityAndType, setAQIColor, setAQILabel, getAQIValue } from '../../../../utils/helperFunctions';
import ApplicationStore from '../../../../utils/localStorageUtil';
import { GlobalHooter } from '../../GlobalHooter';
import CentralHooterModal from '../../../siteDetails/CentralHooter/CentralHooterModal';
import { MdLocationPin } from 'react-icons/md'

/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable radix */
/* eslint-disable array-callback-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-shadow */
function FloorGridComponent(props) {
  const {
    setImg, setLocationDetails, setProgressState, breadCrumbLabels,
    setBreadCrumbLabels, setIsGeoMap, setDeviceCoordsList, siteImages, setSiteImages,
    setCenterLatitude, setCenterLongitude, setAlertList, locationAlerts
  } = props;
  const { floorIdList } = ApplicationStore().getStorage('alertDetails');
  const [isLoading, setGridLoading] = useState(true);
  const [centralButtonText, setCentralButtonText] = useState('ADD CENTRAL HOOTER');
  const [colorValue,setColorValue] = useState("primary");
  const [openCentralHooter,setOpenCentralHooter] = useState(false);
  const [trueValue,setTrueValue] =  useState(true);

  const dataColumns = [
    {
      field: 'floorName',
      headerName: 'Floor Name',
      minWidth: 200,
      flex: 1,
      type: 'actions',
      renderCell: ((params) => {
        return (
          <>
            <div className='flex w-full justify-between '>
              <div>
              <MdLocationPin className='text-[18px] text-left w-full' />
              </div>
              <div className='w-full'>
              <LinkTo selectedRow={params.row} />
              </div>
             
            </div>
          </>
        )
      }),
      getActions: (params) => [
        <LinkTo selectedRow={params.row} />,
      ],
    },
    {
      field: 'id',
      headerName: 'Status',
      minWidth: 120,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      fontFamily: 'customfont',
      renderCell: ((params) => {
        let element = {
          alertLabel: 'Good',
          alertColor: 'green',
          alertPriority: 6,
        };
        const alertObject = floorIdList?.filter((alert) => {
          return params.row.id === parseInt(alert.id);
        });

        alertObject?.map((data) => {
          element = setAlertPriorityAndType(element, data);
        });

        return (
          <Chip
            className='w-[120px] font-[customfont] font-normal text-sm'
            variant="outlined"
            label={element.alertLabel}
            sx={{
              color: 'white',
              fontWeight:'600',
              borderColor: element.alertColor,
              background: element.alertColor,
            }}
          />
        );
      }),
    },
    {
      field: 'aqiIndex',
      headerName: 'AQI Value',
      minWidth: 120,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      fontFamily: 'customfont',
      renderCell: ((params) => {
        return (
          <Chip
            className='w-[120px] font-[customfont] font-normal text-sm'
            variant="outlined"
            // label={setAQILabel(params.row.aqiIndex.replaceAll(",", ""))}
            label={getAQIValue(params.row.aqiIndex)}
            // sx={{
            //   color: setAQIColor(params.row.aqiIndex),
            //   borderColor: setAQIColor(params.row.aqiIndex),
            // }}
            sx={{
              color: 'black',
              fontWeight:'600',
            }}
          />
        )
      }),
    },
    {
      // field: 'aqiIndex',
      headerName: 'AQI Category',
      minWidth: 120,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      fontFamily: 'customfont',
      renderCell: ((params) => {
        return (
          <Chip
            className='w-[120px] font-[customfont] font-normal text-sm'
            variant="outlined"
            label={setAQILabel(params.row.aqiIndex.replaceAll(",", ""))}
            sx={{
              color: 'white',
              borderColor: setAQIColor(params.row.aqiIndex),
              background: setAQIColor(params.row.aqiIndex),
            }}
          />
        )
      }),
    }
  ];

  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    setGridLoading(true);
    // const { locationDetails } = ApplicationStore().getStorage('userDetails');
    // if(locationDetails?.imageBuildingURL !== ''){
    //   setImg(locationDetails?.imageBuildingURL);
    // }

    FloorfetchService({
      location_id: props.locationDetails.location_id,
      branch_id: props.locationDetails.branch_id,
      facility_id: props.locationDetails.facility_id,
      building_id: props.locationDetails.building_id,
    }, handleSuccess, handleException);
  }, [props.locationDetails]);

  const handleSuccess = (dataObject) => {
    setGridLoading(false);
    setDataList(dataObject.data);
    setImg(dataObject.imageBuildingURL);
  };

  const handleException = (errorObject) => {
  };

  function LinkTo({ selectedRow }) {
    return (
      <h3 className='text-sm font-[customfont] font-medium cursor-pointer '
        onClick={() => {
          locationAlerts({ floor_id: selectedRow.id });
          setLocationDetails((oldValue) => {
            return { ...oldValue, floor_id: selectedRow.id };
          });

          setBreadCrumbLabels((oldvalue) => {
            return { ...oldvalue, floorLabel: selectedRow.floorName };
          });

          setProgressState(5);
          setImg(selectedRow.floorMap);
          setSiteImages((oldValue) => {
            return { ...oldValue, floorImage: selectedRow.floorMap };
          });
        }}
      >
        {selectedRow.floorName}
      </h3>
    );
  }

  const setLocationlabel = (value) => {
    const { locationDetails } = ApplicationStore().getStorage('userDetails');
    setProgressState((oldValue) => {
      let newValue = value;
      if (locationDetails.lab_id) {
        newValue = value < 7 ? 6 : value;
        value >= 4 ? setIsGeoMap(false) : setIsGeoMap(true);
      } else if (locationDetails.floor_id) {
        newValue = value < 6 ? 5 : value;
        value >= 4 ? setIsGeoMap(false) : setIsGeoMap(true);
      } else if (locationDetails.building_id) {
        newValue = value < 5 ? 4 : value;
        value <= 3 ? setIsGeoMap(true) : setIsGeoMap(false);
      } else if (locationDetails.facility_id) {
        newValue = value < 4 ? 3 : value;
        value <= 3 ? setIsGeoMap(true) : setIsGeoMap(false);
      } else if (locationDetails.branch_id) {
        newValue = value < 3 ? 2 : value;
        value <= 3 ? setIsGeoMap(true) : setIsGeoMap(false);
      } else if (locationDetails.location_id) {
        newValue = value < 2 ? 1 : value;
        value <= 3 ? setIsGeoMap(true) : setIsGeoMap(false);
      } else {
        // locationAlerts({});
        value <= 3 ? setIsGeoMap(true) : setIsGeoMap(false);
      }
      return newValue;
    });
  };

  return (
    <>
      <Card className={'h-[48vh] sm:h-[40vh] xl:h-[38vh]'} sx={{ boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px', borderRadius: '12px' }}>
        <Paper elevation={3} className={'h-full'} style={{ boxShadow: 'none' }}>
          <CardHeader
            title={
              <Breadcrumbs aria-label="breadcrumb" separator="›" fontSize='20px' fontWeight='600'>
                <h3 className='font-[customfont] font-[600] tracking-[1px] p-1 text-black text-[14.5px] cursor-pointer'
                  onClick={() => {
                    const { locationDetails } = ApplicationStore().getStorage('userDetails');
                    let value = 0;
                    if (locationDetails.lab_id) {
                      locationAlerts({ lab_id: locationDetails.lab_id || props.locationDetails.lab_id });
                      value = 6;
                    } else if (locationDetails.floor_id) {
                      locationAlerts({ floor_id: locationDetails.floor_id || props.locationDetails.floor_id });
                      value = 5;
                    } else if (locationDetails.building_id) {
                      locationAlerts({ building_id: locationDetails.building_id || props.locationDetails.building_id });
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
                    setLocationlabel(value);
                    setDeviceCoordsList([]);
                    // setIsGeoMap(true);
                  }}
                >
                  Location
                </h3>
                <h3 className='font-[customfont] font-[600] tracking-[1px] p-1 text-black text-[14.5px] cursor-pointer'
                  onClick={() => {
                    const { locationDetails } = ApplicationStore().getStorage('userDetails');
                    let value = 1;
                    if (locationDetails.lab_id) {
                      locationAlerts({ lab_id: locationDetails.lab_id || props.locationDetails.lab_id });
                      value = 6;
                    } else if (locationDetails.floor_id) {
                      locationAlerts({ floor_id: locationDetails.floor_id || props.locationDetails.floor_id });
                      value = 5;
                    } else if (locationDetails.building_id) {
                      locationAlerts({ building_id: locationDetails.building_id || props.locationDetails.building_id });
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
                    setLocationlabel(value);
                    setDeviceCoordsList([]);
                    // setIsGeoMap(true);
                  }}
                >
                  {breadCrumbLabels.stateLabel}
                </h3>
                <h3 className='font-[customfont] font-[600] tracking-[1px] p-1 text-black text-[14.5px] cursor-pointer'
                  onClick={() => {
                    const { locationDetails } = ApplicationStore().getStorage('userDetails');
                    let value = 2;
                    if (locationDetails.lab_id) {
                      locationAlerts({ lab_id: locationDetails.lab_id || props.locationDetails.lab_id });
                      value = 6;
                    } else if (locationDetails.floor_id) {
                      locationAlerts({ floor_id: locationDetails.floor_id || props.locationDetails.floor_id });
                      value = 5;
                    } else if (locationDetails.building_id) {
                      locationAlerts({ building_id: locationDetails.building_id || props.locationDetails.building_id });
                      value = 4;
                    } else if (locationDetails.facility_id) {
                      locationAlerts({ facility_id: locationDetails.facility_id || props.locationDetails.facility_id });
                      value = 3;
                    } else {
                      locationAlerts({ branch_id: locationDetails.branch_id || props.locationDetails.branch_id });
                      value = 2;
                    }
                    setLocationlabel(value);
                    setDeviceCoordsList([]);
                    // setIsGeoMap(true);
                  }}
                >
                  {breadCrumbLabels.branchLabel}
                </h3>
                <h3 className='font-[customfont] font-[600] tracking-[1px] p-1 text-black text-[14.5px] cursor-pointer'
                  onClick={() => {
                    const { locationDetails } = ApplicationStore().getStorage('userDetails');
                    let value = 3;
                    // locationAlerts({facility_id: locationDetails.facility_id || props.locationDetails.facility_id});
                    if (locationDetails.lab_id) {
                      locationAlerts({ lab_id: locationDetails.lab_id || props.locationDetails.lab_id });
                      value = 6;
                    } else if (locationDetails.floor_id) {
                      locationAlerts({ floor_id: locationDetails.floor_id || props.locationDetails.floor_id });
                      value = 5;
                    } else if (locationDetails.building_id) {
                      locationAlerts({ building_id: locationDetails.building_id || props.locationDetails.building_id });
                      value = 4;
                    } else {
                      locationAlerts({ facility_id: locationDetails.facility_id || props.locationDetails.facility_id });
                      value = 3;
                    }
                    setLocationlabel(value);
                    setDeviceCoordsList([]);
                    // setIsGeoMap(true);
                  }}
                >
                  {breadCrumbLabels.facilityLabel}
                </h3>
                <Typography
                  underline="hover"
                  color="black"
                  fontFamily={'customfont'}
                  fontWeight={'600'}
                  fontSize={'14px'}
                  letterSpacing={'1px'}
                >
                  {breadCrumbLabels.buildingLabel}
                </Typography>
              </Breadcrumbs>
            }
            sx={{ paddingBottom: 0 }}
          />
          <CardContent className='h-[81%] sm:h-[100%]' style={{padding:'15px'}}>
            <DataGrid

              rows={dataList}
              columns={dataColumns}
              loading={isLoading}
              pageSize={3}
              rowsPerPageOptions={[3]}
              disableSelectionOnClick
              sx={{
                // maxHeight: `${80}%`,
                border: 'none',
                fontFamily: 'customfont',
                paddingBottom: '30px',
              }}
            />
          </CardContent>
        </Paper>
      </Card>
    </>
  );
}

export default FloorGridComponent;
