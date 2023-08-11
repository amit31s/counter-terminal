const ErorrConstants = [
  {
    status_code: 200,
    status_message: "Success",
  },
  {
    status_code: 400,
    status_message: "client-side error- Bad Request",
  },
  {
    status_code: 404,
    status_message: "client-side error -Not Found",
  },
  {
    status_code: 403,
    status_message: "client-side error -Forbidden",
  },
  {
    status_code: 413,
    status_message: "client-side error -Payload Too Large",
  },
  {
    status_code: 414,
    status_message: "client-side error -URI Too Long",
  },
  {
    status_code: 431,
    status_message: "client-side error -Request Header Fields Too Large",
  },
  {
    status_code: 500,
    status_message: "server-side error -Internal Server Error",
  },
  {
    status_code: 502,
    status_message: "server-side error -Bad Gateway",
  },
];

export default ErorrConstants;
