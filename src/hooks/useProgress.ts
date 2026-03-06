const saveSession = async (data: SessionData) => {
  await window.api.saveSession(data);
};
