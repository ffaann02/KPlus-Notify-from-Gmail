interface ConfigType {
    method: string;
    url: string;
    headers: {
      Authorization: string;
      'Content-Type': string;
    };
  }
  
  const createConfig = (url: string, accessToken: string): ConfigType => {
    return {
      method: 'get',
      url: url,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    };
  };
  
  export { createConfig ,ConfigType};
  