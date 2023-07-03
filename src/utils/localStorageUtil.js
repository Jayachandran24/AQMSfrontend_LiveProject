const ApplicationStore = () => {
  function setStorage(storageKey, storageData) {
    sessionStorage.setItem(storageKey, JSON.stringify(storageData));
  }

  function getStorage(storageKey) {
    const dataObject = sessionStorage.getItem(storageKey) ? JSON.parse(sessionStorage.getItem(storageKey)) : '';
    return dataObject;
  }
  function setDynamicLogo(path){
    localStorage.removeItem('loginLogo');
    localStorage.setItem('loginLogo', path);
  }
  function setCompanyName(name){
    localStorage.removeItem('companyName');
    localStorage.setItem('companyName', name);
  }
  function setCustomerImage(image){
    localStorage.removeItem('customerImage');
    localStorage.setItem('customerImage', image);
  }
  function getDynamicLogo(){
    return (localStorage.getItem('loginLogo') != null && localStorage.getItem('loginLogo') != "") && (localStorage.getItem('loginLogo') != "null") ? `https://wisething.in/aideaLabs/blog/public/` +localStorage.getItem('loginLogo') : null;
    // `${process.env.REACT_APP_API_LOGO}`+localStorage.getItem('loginLogo') : null;
  }

  function getCompanyName(){
    return (localStorage.getItem('companyName') != null && localStorage.getItem('companyName') != "" ) && (localStorage.getItem('companyName') !="null") ? localStorage.getItem('companyName') : 'Ai-DEA Labs Pvt. Ltd';
  }
  function getCustomerImage(){
    return (localStorage.getItem('customerImage') != null && localStorage.getItem('customerImage') != ""  ) && (localStorage.getItem('customerImage') != "null")  ? `https://wisething.in/aideaLabs/blog/public/`+localStorage.getItem('customerImage') : null;
  }
  function clearStorage() {
    sessionStorage.clear();
  }

  return {
    setStorage,
    getStorage,
    setDynamicLogo,
    getDynamicLogo,
    setCompanyName,
    getCompanyName,
    getCustomerImage,
    setCustomerImage,
    clearStorage,
  };
};

export default ApplicationStore;
