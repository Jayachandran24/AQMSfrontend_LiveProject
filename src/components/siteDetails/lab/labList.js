import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, DeleteOutlined } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumbs, Stack, Typography } from '@mui/material';
import { LabDeleteService, LabfetchService } from '../../../services/LoginPageService';
import { LabListToolbar } from './lab-list-toolbars';
import LabModal from './LabModalComponent';
import NotificationBar from '../../notification/ServiceNotificationBar';
import { useUserAccess } from '../../../context/UserAccessProvider';
import ApplicationStore from '../../../utils/localStorageUtil';
import DeleteConfirmationDailog from '../../../utils/confirmDeletion';

export function LabListResults({ img }) {
  const dataColumns = [
    {
      field: 'labDepName',
      headerName: 'Zone Name',
      width: 270,
      type: 'actions',
      getActions: (params) => [
        <LinkTo selectedRow={params.row} />,
      ],
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',

      getActions: (params) => [
        <EditData selectedRow={params.row} />,
        <DeleteData selectedRow={params.row} />,
      ],
    },
  ];

  const [open, setOpen] = useState(false);
  const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [isAddButton, setIsAddButton] = useState(true);
  const [editData, setEditData] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [isLoading, setGridLoading] = useState(false);
  const routeStateObject = useLocation();
  const {
    location_id, branch_id, facility_id, building_id, floor_id, buildingImg, floorMap,
  } = routeStateObject.state;
  const [refreshData, setRefreshData] = useState(false);
  const moduleAccess = useUserAccess()('location');
  const {
    locationLabel, branchLabel, facilityLabel, buildingLabel, floorLabel
  } = ApplicationStore().getStorage('siteDetails');

  const [openNotification, setNotification] = useState({
    status: false,
    type: 'error',
    message: '',
  });

  useEffect(() => {
    setGridLoading(true);
    LabfetchService({
      location_id,
      branch_id,
      facility_id,
      building_id,
      floor_id,
    }, handleSuccess, handleException);
  }, [refreshData]);

  const handleSuccess = (dataObject) => {
    setGridLoading(false);
    setDataList(dataObject.data);
  };

  const handleException = (errorObject) => {
  };

  const deletehandleSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: 'success',
      message: dataObject.message,
    });
    setRefreshData((oldvalue) => !oldvalue);
    setTimeout(() => {
      handleClose();
      setDeleteDailogOpen(false);
    }, 3000);
  };

  const deletehandleException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: 'error',
      message: errorMessage,
    });
    setTimeout(() => {
      handleClose();
    }, 3000);
  };

  function EditData(props) {
    return (
      moduleAccess.edit
      && (
        <Edit onClick={() => {
          setIsAddButton(false);
          setEditData(props.selectedRow);
          setOpen(true);
        }}
        />
      ));
  }

  function DeleteData(props) {
    return moduleAccess.delete && (
      <DeleteOutlined
        onClick={() => {
          // LabDeleteService(props.selectedRow, deletehandleSuccess, deletehandleException);
          setDeleteId(props.selectedRow.id);
          setDeleteDailogOpen(true);
        }}
      />
    );
  }
  function LinkTo(props) {
    return (
      <Link
        to={`${props.selectedRow.labDepName}`}
        state={{
          location_id,
          branch_id,
          facility_id,
          building_id,
          floor_id,
          buildingImg,
          floorMap,
          lab_id: props.selectedRow.id,
          lab_map: props.selectedRow.labDepMap,
        }}
      >

        {props.selectedRow.labDepName}
      </Link>
    );
  }

  const handleClose = () => {
    setNotification({
      status: false,
      type: '',
      message: '',
    });
  };

  const pathList = routeStateObject.pathname.split('/').filter((x) => x);
  const pathname = pathList.map((data, index) => {
    const path = data.replace(/%20/g, ' ');
    return (path);
  });

  return (
    <div style={{ height: '70vh', width: '100%' }}>
      <Stack style={{
        overflow: 'auto'
      }}
      width = {{
        xs: '100vw',
        sm: '100vw',
        md: '54vw',
        lg: '54vw',
        xl: '56vw'
      }}
      >
        <Breadcrumbs aria-label="breadcrumb" separator="›" style={{
          // height: '2vh',
          minHeight: '15px',
          minWidth: 'max-content'
        }}>
          {locationLabel ? (
            <Typography
              underline="hover"
              color="inherit"
            >
              Location
            </Typography>
          ) : (
            <Link underline="hover" color="inherit" to="/Location">
              Location
            </Link>
          )}
          {branchLabel
            ? (
              <Typography
                underline="hover"
                color="inherit"
              >
                {pathname[1]}
              </Typography>
            )
            : (
              <Link
                underline="hover"
                color="inherit"
                to={`/Location/${pathname[1]}`}
                state={{
                  location_id,
                }}
              >
                {pathname[1]}
              </Link>
            )}
          {facilityLabel
            ? (
              <Typography
                underline="hover"
                color="inherit"
              >
                {pathname[2]}
              </Typography>
            )
            : (
              <Link
                underline="hover"
                color="inherit"
                to={`/Location/${pathname[1]}/${pathname[2]}`}
                state={{
                  location_id,
                  branch_id,
                }}
              >
                {pathname[2]}
              </Link>
            )}
          {buildingLabel ? (
            <Typography
              underline="hover"
              color="inherit"
            >
              {pathname[3]}
            </Typography>
          ) : (
              <Link
                underline="hover"
                color="inherit"
                to={`/Location/${pathname[1]}/${pathname[2]}/${pathname[3]}`}
                state={{
                  location_id,
                  branch_id,
                  facility_id,
                }}
              >
                {pathname[3]}
              </Link>
          )}
          {floorLabel ? (
            <Typography
              underline="hover"
              color="inherit"
            >
              {pathname[4]}
            </Typography>
          ) : (
              <Link
                underline="hover"
                color="inherit"
                to={`/Location/${pathname[1]}/${pathname[2]}/${pathname[3]}/${pathname[4]}`}
                state={{
                  location_id,
                  branch_id,
                  facility_id,
                  building_id,
                  buildingImg,
                }}
              >
                {pathname[4]}
              </Link>
          )}
          <Typography
            underline="hover"
            color="inherit"
          >
            {pathname[5]}
          </Typography>
        </Breadcrumbs>
      </Stack>

      <LabListToolbar
        setOpen={setOpen}
        setIsAddButton={setIsAddButton}
        setEditData={setEditData}
        userAccess={moduleAccess}
      />

      <DataGrid
        rows={dataList}
        columns={dataColumns}
        pageSize={5}
        loading={isLoading}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        style={{ 
          // maxHeight: `${80}%`,
          // height: '37vh'

          // height: 'auto',
          // minHeight: '57vh',
          
          height: '85%',
          minHeight: '250px',
          maxHeight: '70vh'
        }}
      />

      <LabModal
        isAddButton={isAddButton}
        editData={editData}
        open={open}
        setOpen={setOpen}
        locationId={location_id}
        branchId={branch_id}
        facilityId={facility_id}
        buildingId={building_id}
        floorId={floor_id}
        setRefreshData={setRefreshData}
        img={img}
      />
      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
      <DeleteConfirmationDailog
        open={deleteDailogOpen}
        setOpen={setDeleteDailogOpen}
        deleteId={deleteId}
        deleteService={LabDeleteService}
        handleSuccess={deletehandleSuccess}
        handleException={deletehandleException}
      />
    </div>
  );
}
