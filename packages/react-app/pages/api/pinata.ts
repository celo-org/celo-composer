const axios = require('axios');

const key = process.env.NEXT_PUBLIC_PINATA_KEY
const secret = process.env.NEXT_PUBLIC_PINATA_SECRET

const FormData = require('form-data');

export const uploadFileToIPFS = async(file: any) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  //making axios POST request to Pinata ⬇️
  
  let data = new FormData();
  data.append('file', file);

  const metadata = JSON.stringify({
      name: 'testname',
      keyvalues: {
          exampleKey: 'exampleValue'
      }
  });
  data.append('pinataMetadata', metadata);

  const pinataOptions = JSON.stringify({
      cidVersion: 0,
      customPinPolicy: {
          regions: [
              {
                  id: 'FRA1',
                  desiredReplicationCount: 1
              },
              {
                  id: 'NYC1',
                  desiredReplicationCount: 2
              }
          ]
      }
  });
  data.append('pinataOptions', pinataOptions);

  return axios 
      .post(url, data, {
          maxBodyLength: 'Infinity',
          headers: {
              'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
              pinata_api_key: key,
              pinata_secret_api_key: secret,
          }
      })
      .then(function (response: { data: { IpfsHash: string; }; }) {
          console.log("image uploaded", response.data.IpfsHash)
          return {
             success: true,
             pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
         };
      })
      .catch(function (error: { message: any; }) {
          console.log(error)
          return {
              success: false,
              message: error.message,
          }

  });
};