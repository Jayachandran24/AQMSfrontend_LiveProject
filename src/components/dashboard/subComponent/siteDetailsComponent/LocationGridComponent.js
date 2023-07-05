import { Box, Breadcrumbs, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { darken, lighten } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { FetchLocationService } from '../../../../services/LoginPageService';
import ApplicationStore from '../../../../utils/localStorageUtil';
import { setAlertPriorityAndType, setAQIColor, setAQILabel } from '../../../../utils/helperFunctions';
import { LatestAlertAccess } from '../../../../context/UserAccessProvider';

/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable radix */
function LocationGridComponent(props) {
  const {
    setLocationDetails, setProgressState, setBreadCrumbLabels, setLocationCoordinationList,
    setZoomLevel, setCenterLatitude, setCenterLongitude, locationAlerts
  } = props;
  const [dataList, setDataList] = useState([]);
  const { locationIdList } = ApplicationStore().getStorage('alertDetails');
  const [notificationStatus, setNotificationStatus] = useState(locationIdList);
  const [isLoading, setGridLoading] = useState(true);
  const {alertStatus, setAlertStatus} = LatestAlertAccess();
  const columns = [
    {
      field: 'stateName',
      headerName: 'Location Name',
      minWidth: 200,
      flex: 1,
      type: 'actions',
      getActions: (params) => [
        <LinkTo selectedRow={params.row} />,
      ],
    },
    {
      field: 'id',
      headerName: 'Status',
      minWidth: 100,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: ((params) => {
        let element = {
          alertLabel: 'Good',
          alertColor: 'green',
          alertPriority: 6,
        };
        const alertObject = notificationStatus?.filter((alert) => {
          return params.row.id === parseInt(alert.id);
        });

        alertObject?.map((data) => {
          element = setAlertPriorityAndType(element, data);
        });

        return (
          <Chip
            variant="outlined"
            label={element.alertLabel}
            style={{
              color: element.alertColor,
              borderColor: element.alertColor,
            }}
          />
        );
      }),
    },
    {
      field: 'aqiIndex',
      headerName: 'AQI Value',
      minWidth: 100,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: ((params) => {
        return(
          <span
            style={{
              color: setAQIColor(params.row.aqiIndex)
            }}
          >
            {params.row.aqiIndex}
          </span>
        )
      }),
    },
    {
      // field: 'aqiIndex',
      headerName: 'AQI Index',
      minWidth: 100,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: ((params) => {
        return(
          <Chip
            variant="outlined"
            label={setAQILabel(params.row.aqiIndex.replaceAll(",", ""))}
            style={{
              color: setAQIColor(params.row.aqiIndex),
              borderColor: setAQIColor(params.row.aqiIndex),
            }}
          />
        )
      }),
    }
  ];

  useEffect(() => {
    setGridLoading(true);
    FetchLocationService(handleSuccess, handleException);
    const { locationDetails } = ApplicationStore().getStorage('userDetails');

    setProgressState((oldValue) => {
      let newValue = 0;
      if(locationDetails.lab_id){
        newValue = 6;
        locationAlerts({ lab_id: locationDetails.lab_id });
      }
      else if(locationDetails.floor_id){
        newValue = 5;
        locationAlerts({ floor_id: locationDetails.floor_id });
      }
      else if(locationDetails.building_id){
        newValue = 4;
        locationAlerts({ building_id: locationDetails.building_id });
      }
      else if (locationDetails.facility_id) {
        newValue = 3;
        locationAlerts({ facility_id: locationDetails.facility_id });
      }
      else if (locationDetails.branch_id) {
        newValue = 2;
        locationAlerts({ branch_id: locationDetails.branch_id });
      }
      else if (locationDetails.location_id) {
        newValue = 1;
        locationAlerts({ location_id: locationDetails.location_id });
      }
      else {
        locationAlerts({});
      }
      return newValue;
    });
  }, []);

  function LinkTo({ selectedRow }) {
    const { locationDetails } = ApplicationStore().getStorage('userDetails');
    return (
      <h3
        style={{ cursor: 'pointer' }}
        onClick={() => {
          locationAlerts({ location_id: selectedRow.id });
          setLocationDetails((oldValue) => {
            return { ...oldValue, location_id: selectedRow.id };
          });

          setBreadCrumbLabels((oldvalue) => {
            return { ...oldvalue, stateLabel: selectedRow.stateName };
          });
          setProgressState(1);
          const coordList = selectedRow.coordinates.replaceAll('"', '').split(',') || [];
          setCenterLatitude(parseFloat(coordList[0]));
          setCenterLongitude(parseFloat(coordList[1]));
        }}
      >
        {selectedRow.stateName}
      </h3>
    );
  }
  const handleSuccess = (dataObject) => {
    setGridLoading(false);
    setDataList(dataObject.data);
    const newArray = dataObject.data ? dataObject.data.map((item) => {
      const coordinates = item.coordinates ? item.coordinates.replaceAll('"', '').split(',') : [];
      return {
        id: item.id,
        name: item.stateName,
        position: {
          lat: parseFloat(coordinates[0]),
          lng: parseFloat(coordinates[1]),
        },
      };
    })
      : [];
    setLocationCoordinationList(newArray);
    setZoomLevel(4);
  };

  const handleException = (errorObject) => {
  };

  const getBackgroundColor = (color, mode) => (mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.1));

  const getHoverBackgroundColor = (color, mode) => (mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.1));

  return (
    <div style={{ height: '100%', width: '100%', paddingRight: 2 }}>
      <Breadcrumbs aria-label="breadcrumb" separator="›">
        <h3>
          Location
        </h3>
      </Breadcrumbs>
      {/* <Box
        sx={{
          height: 400,
          '& .super-app-theme--red': {
            color: 'maroon',
            bgcolor: (theme) => getBackgroundColor('#FAE8FA', theme.palette.mode),
            '&:hover': {
              bgcolor: (theme) => getHoverBackgroundColor('#FAE8FA', theme.palette.mode),
            },
            ':hover': { backgroundColor: '#FAE8FA' },
          },
          '& .super-app-theme--orange': {
            color: 'purple',
            bgcolor: (theme) => getBackgroundColor('#9fa8da', theme.palette.mode),
            '&:hover': {
              bgcolor: (theme) => getHoverBackgroundColor(
                '#9fa8da',
                theme.palette.mode,
              ),
            },
          },
          '& .super-app-theme--disabled': {
            bgcolor: (theme) => getBackgroundColor('#ffcdd2', theme.palette.mode),
            '&:hover': {
              bgcolor: (theme) => getHoverBackgroundColor(
                '#ffcdd2',
                theme.palette.mode,
              ),
            },
          },
          '& .super-app-theme--enabled': {
            bgcolor: (theme) => getBackgroundColor('#A5D6A7', theme.palette.mode),
            '&:hover': {
              bgcolor: (theme) => getHoverBackgroundColor(
                '#A5D6A7',
                theme.palette.mode,
              ),
            },
          },
          '& .super-app-theme--outOfRange': {
            color: 'darkgoldenrod',
            bgcolor: (theme) => getBackgroundColor('#FFFCE3', theme.palette.mode),
            '&:hover': {
              bgcolor: (theme) => getHoverBackgroundColor('#FFFCE3', theme.palette.mode),
            },
          },
          '& .super-app-theme--green': {
            color: 'green',
            bgcolor: (theme) => getBackgroundColor('#F2FFF2', theme.palette.mode),
            '&:hover': {
              bgcolor: (theme) => getHoverBackgroundColor('#F2FFF2', theme.palette.mode),
            },
          },
          }}
      > */}
        <DataGrid
          rows={dataList}
          columns={columns}
          loading={isLoading}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          style={{ maxHeight: `${93}%` }}
          // getCellClassName={(params) => {
          //   let element = {
          //     alertLabel: 'Good',
          //     alertColor: 'green',
          //     alertPriority: 4,
          //   };
          //   const alertObject = notificationStatus?.filter((alert) => {
          //     return params.row.id === parseInt(alert.id);
          //   });
    
          //   alertObject?.map((data) => {
          //     element = setAlertPriorityAndType(element, data);
          //   });
          //   if (params.field === 'id') {
          //     return `super-app-theme--${element.alertColor}`;
          //   }
          // }}
        />
      {/* </Box> */}
    </div>
  );
}

export default LocationGridComponent;
