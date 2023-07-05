import {
  Button, Dialog, DialogContent, DialogTitle, TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import { ConfigSetupAddService, ConfigSetupEditService } from '../../../../services/LoginPageService';
import { AddVendorValidate } from '../../../../validation/locationValidation';
import NotificationBar from '../../../notification/ServiceNotificationBar';
/* eslint-disable-next-line */

function ConfigSetupModal({
  open, setOpen, isAddButton, configSetupData, setRefreshData, handleClose, openNotification, setNotification
}) {
  const [id, setId] = useState('');

  // AccessPoint inputs
  const [accessPointName, setAccessPointName] = useState('');
  const [ssId, setSsId] = useState('');
  const [accessPointPassword, setAccessPointPassword] = useState('');
 
  //Secondary
  // const [accessPointNameSecondary, setAccessPointNameSecondary] = useState('');
  // const [ssIdSecondary, setSsIdSecondary] = useState('');
  // const [accessPointPasswordSecondary, setAccessPointPasswordSecondary] = useState('');

  // FTP inputs
  const [ftpAccountName, setFtpAccountName] = useState('');
  const [userName, setUserName] = useState('');
  const [ftpPassword, setFtpPassword] = useState('');
  const [port, setPort] = useState('');
  const [serverUrl, setServerUrl] = useState('');
  const [folderPath, setFolderPath] = useState('');

  // Serviceprovider inputs
  const [serviceProvider, setServiceProvider] = useState('');
  const [apn, setApn] = useState('');

  // const [openNotification, setNotification] = useState({
  //   status: false,
  //   type: 'error',
  //   message: '',
  // });


  const [errorObject, setErrorObject] = useState({});

  useEffect(() => {
    setOpen(open);
    loadData();
  }, [configSetupData]);

  const loadData = () => {
    setId(configSetupData.id || '');

    setAccessPointName(configSetupData.accessPointName || '');
    setSsId(configSetupData.ssId || '');
    setAccessPointPassword(configSetupData.accessPointPassword || '');

    // setAccessPointNameSecondary(configSetupData.accessPointNameSecondary || ''); 
    // setSsIdSecondary(configSetupData.ssIdSecondary || '');
    // setAccessPointPasswordSecondary(configSetupData.accessPointPasswordSecondary || '');

    setFtpAccountName(configSetupData.ftpAccountName || '');
    setUserName(configSetupData.userName || '');
    setFtpPassword(configSetupData.ftpPassword || '');
    setPort(configSetupData.port || '');
    setServerUrl(configSetupData.serverUrl || '');
    setFolderPath(configSetupData.folderPath || '');

    setServiceProvider(configSetupData.serviceProvider || '');
    setApn(configSetupData.apn || '');
  };

  const clearForm = () => {
    setId('');

    setAccessPointName('');
    setSsId('');
    setAccessPointPassword('');

    // setAccessPointNameSecondary(configSetupData.accessPointNameSecondary || ''); 
    // setSsIdSecondary(configSetupData.ssIdSecondary || '');
    // setAccessPointPasswordSecondary(configSetupData.accessPointPasswordSecondary || '');

    setFtpAccountName('');
    setUserName('');
    setFtpPassword('');
    setPort('');
    setServerUrl('');
    setFolderPath('');
    setServiceProvider('');
    setApn('');
  }

  /* eslint-disable-next-line */
  const validateForNullValue = (value, type) => {
    AddVendorValidate(value, type, setErrorObject);
  };

  const handleAddSuccess = (dataObject) => {
    clearForm();
    handleSuccess(dataObject);
  }

  const handleUpdateSuccess = (dataObject) => {
    handleSuccess(dataObject);
    setTimeout(() => {
      setOpen(false);
    }, 3000);
  }

  const handleSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: 'success',
      message: dataObject.message,
    });
    setRefreshData((oldvalue) => !oldvalue);
  };

  /* eslint-disable-next-line */
  const handleException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: 'error',
      message: errorMessage,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAddButton) {
      await ConfigSetupAddService({
        /* eslint-disable-next-line */
        accessPointName, ssId, accessPointPassword, 
        // accessPointNameSecondary,ssIdSecondary, accessPointPasswordSecondary, 
        ftpAccountName, userName, ftpPassword, port, serverUrl, folderPath, 
        serviceProvider, apn,
      }, handleAddSuccess, handleException);
    } else {
      await ConfigSetupEditService({
        /* eslint-disable-next-line */
        id, accessPointName, ssId, accessPointPassword, 
        // accessPointNameSecondary,ssIdSecondary, accessPointPasswordSecondary, 
        ftpAccountName, userName, ftpPassword, port, serverUrl, folderPath, 
        serviceProvider, apn,
      }, handleUpdateSuccess, handleException);
    }
  };

  // const handleClose = () => {
  //   setNotification({
  //     status: false,
  //     type: '',
  //     message: '',
  //   });
  // };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: '100%' } }}
      open={open}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {isAddButton ? 'Add Comm Setup' : 'Edit Comm Setup'}
        </DialogTitle>

        <DialogContent>
          <Typography variant="subtitle1" component="h6">
            Access Point
          </Typography>
          <div className="flex items-center justify-between gap-3">
            <TextField
              value={accessPointName}
              margin="dense"
              id="outlined-basic"
              label="Access Point Name"
              variant="outlined"
              fullWidth
              // required
              // onBlur={() =>validateForNullValue(accessPointName, 'accessPointName')}
              onChange={(e) => { setAccessPointName(e.target.value); }}
              autoComplete="off"
            />
            <TextField
              value={ssId}
              margin="dense"
              id="outlined-basic"
              label="SSID"
              variant="outlined"
              fullWidth
              // required
              // onBlur={() =>validateForNullValue(ssId, 'ssId')}
              onChange={(e) => { setSsId(e.target.value); }}
              autoComplete="off"
            />
            <TextField
              value={accessPointPassword}
              margin="dense"
              id="outlined-basic"
              label="Password"
              // type="password"
              variant="outlined"
              fullWidth
              // required
              // onBlur={() =>validateForNullValue(accessPointPassword, 'accessPointPassword')}
              onChange={(e) => { setAccessPointPassword(e.target.value); }}
              autoComplete="off"
            />
          </div>
          {/* <div className="flex items-center justify-between gap-3">
            <TextField
              value={accessPointNameSecondary}
              margin="dense"
              id="outlined-basic"
              label="Access Point Name"
              variant="outlined"
              fullWidth
              // required
              // onBlur={() =>validateForNullValue(accessPointName, 'accessPointName')}
              onChange={(e) => { setAccessPointNameSecondary(e.target.value); }}
              autoComplete="off"
            />
            <TextField
              value={ssIdSecondary}
              margin="dense"
              id="outlined-basic"
              label="SSID"
              variant="outlined"
              fullWidth
              // required
              // onBlur={() =>validateForNullValue(ssId, 'ssId')}
              onChange={(e) => { setSsIdSecondary(e.target.value); }}
              autoComplete="off"
            />
            <TextField
              value={accessPointPasswordSecondary}
              margin="dense"
              id="outlined-basic"
              label="password"
              type="password"
              variant="outlined"
              fullWidth
              // required
              // onBlur={() =>validateForNullValue(accessPointPassword, 'accessPointPassword')}
              onChange={(e) => { setAccessPointPasswordSecondary(e.target.value); }}
              autoComplete="new-password"
            />
          </div> */}
          <Typography variant="subtitle1" component="h6">
            FTP
          </Typography>
          <div className="flex items-center justify-between gap-3">
            <TextField
              value={ftpAccountName}
              margin="dense"
              id="outlined-basic"
              label="Account Name"
              variant="outlined"
              fullWidth
              required
              // onBlur={() =>validateForNullValue(ftpAccountName, 'ftpAccountName')}
              onChange={(e) => { setFtpAccountName(e.target.value); }}
              autoComplete="off"
            />
            <TextField
              value={userName}
              margin="dense"
              id="outlined-basic"
              label="User name"
              variant="outlined"
              required
              //  onBlur={() =>validateForNullValue(userName, 'userName')}
              onChange={(e) => { setUserName(e.target.value); }}
              autoComplete="off"
              fullWidth
            />
            <TextField
              value={ftpPassword}
              margin="dense"
              id="outlined-basic"
              // type="password"
              label="Password"
              variant="outlined"
              fullWidth
              required
              //  onBlur={() =>validateForNullValue(ftpPassword, 'ftpPassword')}
              onChange={(e) => { setFtpPassword(e.target.value); }}
              autoComplete="off"
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <TextField
              value={port}
              margin="dense"
              id="outlined-basic"
              label="Port"
              variant="outlined"
              fullWidth
              required
              //  onBlur={() =>validateForNullValue(port, 'port')}
              onChange={(e) => { setPort(e.target.value); }}
              autoComplete="off"
            />
            <TextField
              value={serverUrl}
              margin="dense"
              id="outlined-multiline-flexible"
              label="Server Url"
              multiline
              maxRows={4}
              fullWidth
              required
              // onBlur={() =>validateForNullValue(serverUrl, 'serverUrl')}
              onChange={(e) => { setServerUrl(e.target.value); }}
              autoComplete="off"
            />
            <TextField
              value={folderPath}
              margin="dense"
              id="outlined-basic"
              label="Folder Path"
              variant="outlined"
              fullWidth
              required
              //  onBlur={() =>validateForNullValue(folderPath, 'folderPath')}
              onChange={(e) => { setFolderPath(e.target.value); }}
              autoComplete="off"
            />
          </div>
          <Typography variant="subtitle1" component="h6">
            APN
          </Typography>
          <div className="flex items-center justify-between gap-3">
            <TextField
              value={serviceProvider}
              margin="dense"
              id="outlined-basic"
              label="Service Provider"
              variant="outlined"
              fullWidth
              // onBlur={() =>validateForNullValue(serviceProvider, 'serviceProvider')}
              onChange={(e) => { setServiceProvider(e.target.value); }}
              autoComplete="off"
            />
            <TextField
              value={apn}
              margin="dense"
              id="outlined-basic"
              label="APN"
              variant="outlined"
              fullWidth
              //  onBlur={() =>validateForNullValue(apn, 'apn')}
              onChange={(e) => { setApn(e.target.value); }}
              autoComplete="off"
            />
          </div>
        </DialogContent>
        <DialogActions sx={{ margin: '10px' }}>
          <Button
            size="large"
            autoFocus
            onClick={() => {
              setOpen(false);
              setErrorObject({});
              loadData();
            }}
          >
            Cancel
          </Button>
          <Button
            size="large"
            type="submit"
          >
            {' '}
            {isAddButton ? 'Add' : 'Update'}
          </Button>
        </DialogActions>
      </form>
      {/* <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      /> */}
    </Dialog>
  );
}

export default ConfigSetupModal;
