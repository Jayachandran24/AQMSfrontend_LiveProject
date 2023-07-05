import { Breadcrumbs, Chip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { FetchFacilitiyService } from '../../../../services/LoginPageService';
import { setAlertPriorityAndType, setAQIColor, setAQILabel } from '../../../../utils/helperFunctions';
import ApplicationStore from '../../../../utils/localStorageUtil';
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable radix */
/* eslint-disable no-shadow */
/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */

function FacilityGridComponent(props) {
  const { setLocationDetails, setProgressState, breadCrumbLabels, setBreadCrumbLabels,
    setLocationCoordinationList, setIsGeoMap, setDeviceCoordsList,
    setZoomLevel, setCenterLatitude, setCenterLongitude, setAlertList, locationAlerts
  } = props;
  const { facilityIdList } = ApplicationStore().getStorage('alertDetails');
  const [isLoading, setGridLoading] = useState(true);
  const facilityColumns = [
    {
      field: 'facilityName',
      headerName: 'Facility Name',
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
      headerAlign: 'center',
      align: 'center',
      renderCell: ((params) => {
        let element = {
          alertLabel: 'Good',
          alertColor: 'green',
          alertPriority: 6,
        };
        const alertObject = facilityIdList?.filter((alert) => {
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

  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    setGridLoading(true);
    FetchFacilitiyService({
      location_id: props.locationDetails.location_id,
      branch_id: props.locationDetails.branch_id,
    }, handleSuccess, handleException);
  }, [props.locationDetails]);

  const handleSuccess = (dataObject) => {
    setGridLoading(false);
    setDataList(dataObject.data);
    const newArray = dataObject.data ? dataObject.data.map((item) => {
      const coordinates = item.coordinates ? item.coordinates.replaceAll('"', '').split(',') : [];
      return {
        id: item.id,
        name: item.facilityName,
        position: {
          lat: parseFloat(coordinates[0]),
          lng: parseFloat(coordinates[1]),
        },
      };
    })
      : [];
    setLocationCoordinationList(newArray);
    setZoomLevel(9);
  };

  const handleException = () => { };

  function LinkTo({ selectedRow }) {
    return (
      <h3
        style={{ cursor: 'pointer' }}
        onClick={() => {
          locationAlerts({ facility_id: selectedRow.id });
          setLocationDetails((oldValue) => {
            return { ...oldValue, facility_id: selectedRow.id };
          });

          setBreadCrumbLabels((oldvalue) => {
            return { ...oldvalue, facilityLabel: selectedRow.facilityName };
          });

          setProgressState(3);
          const coordList = selectedRow.coordinates.replaceAll('"', '').split(',') || [];
          // setCenterLatitude(parseFloat(coordList[0]));
          // setCenterLongitude(parseFloat(coordList[1]));
          setCenterLatitude('');
          setCenterLongitude('');
        }}
      >
        {selectedRow.facilityName}
      </h3>
    );
  }

  const setLocationlabel = (value) => {
    const { locationDetails } = ApplicationStore().getStorage('userDetails');
    setProgressState((oldValue) => {
      let newValue = value;
      if (locationDetails.lab_id) {
        newValue = value < 7 ? 6 : value;
      } else if (locationDetails.floor_id) {
        newValue = value < 6 ? 5 : value;
      } else if (locationDetails.building_id) {
        newValue = value < 5 ? 4 : value;
      } else if (locationDetails.facility_id) {
        newValue = value < 4 ? 3 : value;
      } else if (locationDetails.branch_id) {
        newValue = value < 3 ? 2 : value;
      } else if (locationDetails.location_id) {
        newValue = value < 2 ? 1 : value;
      } else {
        // locationAlerts({});
      }
      return newValue;
    });
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Breadcrumbs aria-label="breadcrumb" separator="›">
        <h3
          onClick={() => {
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
              locationAlerts({facility_id: locationDetails.facility_id || props.locationDetails.facility_id});
              value = 3;
            } else if (locationDetails.branch_id) {
              locationAlerts({branch_id: locationDetails.branch_id || props.locationDetails.branch_id});
              value = 2;
            }else if (locationDetails.location_id) {
              locationAlerts({location_id: locationDetails.location_id || props.locationDetails.location_id});
              value = 1;
            } else {
              locationAlerts({});
              value = 0;
            }
            setLocationlabel(value);
            setDeviceCoordsList([]);
            // setCenterLatitude(23.500);
            // setCenterLongitude(80.000);
            setIsGeoMap(true);
          }}
          style={{ cursor: 'pointer' }}
        >
          Location
        </h3>
        <h3
          onClick={() => {
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
              locationAlerts({facility_id: locationDetails.facility_id || props.locationDetails.facility_id});
              value = 3;
            } else if (locationDetails.branch_id) {
              locationAlerts({branch_id: locationDetails.branch_id || props.locationDetails.branch_id});
              value = 2;
            } else {
              locationAlerts({location_id: locationDetails.location_id || props.locationDetails.location_id});
              value = 1;
            }
            setLocationlabel(value);
            setDeviceCoordsList([]);
            setIsGeoMap(true);
          }}
          style={{ cursor: 'pointer' }}
        >
          {breadCrumbLabels.stateLabel}
        </h3>
        <Typography
          underline="hover"
          color="inherit"
        >
          {breadCrumbLabels.branchLabel}
        </Typography>
      </Breadcrumbs>
      <DataGrid
        rows={dataList}
        columns={facilityColumns}
        loading={isLoading}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        style={{ maxHeight: `${93}%` }}
      />
    </div>
  );
}

export default FacilityGridComponent;
