import { useEffect, useState } from "react";

// Msal imports
import { MsalAuthenticationTemplate, useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionType, InteractionRequiredAuthError, type AccountInfo } from "@azure/msal-browser";
import { loginRequest } from "~/routes/__authorized/dealer/authConfig";

// Sample app imports
import { ProfileData, type GraphData } from "~/components/microsoft/ProfileData";
import { Loading } from "~/components/microsoft/Loading";
import { ErrorComponent } from "~/components/microsoft/ErrorComponent";
import { callMsGraph } from "~/components/microsoft/MsGraphApiCall";

// Material-ui imports
import Paper from "@mui/material/Paper";

const ProfileContent = () => {
    const { instance, inProgress } = useMsal();
    const [graphData, setGraphData] = useState<null | GraphData>(null);

    useEffect(() => {
        if (!graphData && inProgress === InteractionStatus.None) {
            return redirect('/login')
            /* callMsGraph().then(response => setGraphData(response)).catch((e) => {
                 if (e instanceof InteractionRequiredAuthError) {
                     instance.acquireTokenRedirect({
                         ...loginRequest,
                         account: instance.getActiveAccount() as AccountInfo
                     });
                 }
             });*/
        }
    }, [inProgress, graphData, instance]);

    return (
        <Paper>
            {graphData ? <ProfileData graphData={graphData} /> : null}
        </Paper>
    );
};

export function Profile() {
    const authRequest = {
        ...loginRequest
    };

    return (
        <MsalAuthenticationTemplate
            interactionType={InteractionType.Redirect}
            authenticationRequest={authRequest}
            // errorComponent={ErrorComponent}
            loadingComponent={Loading}
        >
            <ProfileContent />
        </MsalAuthenticationTemplate>
    )
};
