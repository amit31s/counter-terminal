import {
  AWS_COGNITO_REGION,
  AWS_COGNITO_USER_POOL_ID,
  AWS_COGNITO_WEB_CLIENT_ID,
  FORGEROCK_COGNITO_OAUTH_DOMAIN,
  FORGEROCK_COGNITO_REDIRECT,
  FORGEROCK_COGNITO_REGION,
  FORGEROCK_COGNITO_S3_BUCKET,
  FORGEROCK_COGNITO_USER_POOL_ID,
  FORGEROCK_COGNITO_WEB_CLIENT_ID,
} from "../common";

export const deviceConfig = {
  Auth: {
    mandatorySignIn: true,
    //  Amazon Cognito Region
    region: AWS_COGNITO_REGION,
    //  Amazon Cognito User Pool ID
    userPoolId: AWS_COGNITO_USER_POOL_ID,
    // Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: AWS_COGNITO_WEB_CLIENT_ID,
  },
};

export const userConfig = {
  Auth: {
    mandatorySignIn: true,
    //  Amazon Cognito Region
    region: FORGEROCK_COGNITO_REGION,
    //  Amazon Cognito User Pool ID
    userPoolId: FORGEROCK_COGNITO_USER_POOL_ID,
    // Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: FORGEROCK_COGNITO_WEB_CLIENT_ID,
    oauth: {
      domain: FORGEROCK_COGNITO_OAUTH_DOMAIN,
      scope: ["openid", "profile"],
      redirectSignIn: FORGEROCK_COGNITO_REDIRECT,
      redirectSignOut: FORGEROCK_COGNITO_REDIRECT,
      responseType: "code",
    },
  },

  Storage: {
    AWSS3: {
      bucket: FORGEROCK_COGNITO_S3_BUCKET, //REQUIRED -  Amazon S3 bucket name
    },
  },
};
