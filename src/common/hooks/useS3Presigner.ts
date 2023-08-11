import { Auth } from "@aws-amplify/auth";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  PresignedResource,
  RELEASES_FILENAME,
  SendPresignedUrlsEvents,
  SEND_PRESIGNED_URLS,
} from "postoffice-electron-autoupdater-js";
import { useCallback, useEffect, useMemo } from "react";
import { envProvider } from "../platformHelper";
import { useAppSelector } from "./useAppSelector";

const userPoolId = envProvider.REACT_APP_AWS_COGNITO_USER_POOL_ID || "";
const region = envProvider.ELECTRON_UPDATE_BUCKET_REGION || "";
const bucket = envProvider.ELECTRON_UPDATE_BUCKET_NAME || "";
const folder = envProvider.ELECTRON_UPDATE_BUCKET_FOLDER || "";
const federatedIdentityPoolId = envProvider.FEDERATED_IDENTITY_POOL_ID || "";
const autoUpdaterActive = envProvider.USE_SQUIRREL_AUTOUPDATER === "true";

export const useS3Presigner = async () => {
  const { device } = useAppSelector((rootState) => rootState.auth);

  const isSignedIn = useMemo(() => !!device, [device]);

  const getCredentials = useCallback(async () => {
    if (!isSignedIn || !autoUpdaterActive) {
      return null;
    }
    const idToken = (await Auth.currentSession()).getIdToken().getJwtToken();
    const credentials = fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region }),
      identityPoolId: federatedIdentityPoolId,
      logins: {
        [`cognito-idp.${region}.amazonaws.com/${userPoolId}`]: idToken,
      },
    });

    return credentials();
  }, [isSignedIn]);

  const presignUrls = useCallback(
    async (resourceNames: string[]) => {
      const credentials = await getCredentials();
      if (!credentials) {
        return;
      }

      const s3Client = new S3Client({
        region,
        credentials,
      });

      return Promise.all(
        resourceNames.map((resourceName) => {
          const command = new GetObjectCommand({
            Bucket: bucket,
            Key: `${folder}/${resourceName}`,
          });

          return getSignedUrl(s3Client, command, { expiresIn: 3600 });
        }),
      );
    },
    [getCredentials],
  );

  useEffect(() => {
    (async () => {
      const signedUrl = (await presignUrls([RELEASES_FILENAME]))?.[0];
      if (!signedUrl) {
        return;
      }

      window.electronAPI?.sendPresignedUrls(
        [{ presignedUrl: signedUrl, resourceName: RELEASES_FILENAME }],
        SendPresignedUrlsEvents.RELEASES_FILE,
      );
    })();
  }, [getCredentials, presignUrls]);

  window.electronAPI?.requestPresignedUrls(async (event, resourceNames, eventName) => {
    const signedUrls = await presignUrls(resourceNames);

    if (!signedUrls) {
      return;
    }

    const signedResources: PresignedResource[] = signedUrls.map((url, i) => ({
      presignedUrl: url,
      resourceName: resourceNames[i],
    }));

    event.sender.send(SEND_PRESIGNED_URLS, signedResources, eventName);
  });
};
