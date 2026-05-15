import React, { createContext, useContext } from 'react';

const ProfileContext = createContext({
  hasProfile: false,
  setHasProfile: (value: boolean) => {},
});

export const useProfile = () => useContext(ProfileContext);

export default ProfileContext;
