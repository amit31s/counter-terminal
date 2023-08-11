# Todo:
- ~~Redirect to Federation Manager in a new external browser window (not electron)~~
- ~~Fix deeplinks not being picked up on Windows (probably missed something from the fix/deeplinks branch)~~
- Modify auth logic to enable entry to AuthRedirect if user is not logged in
- After redirecting from AuthRedirect to Home, re-run the checkFederatedUser (to sign user in with localstorage tokens)