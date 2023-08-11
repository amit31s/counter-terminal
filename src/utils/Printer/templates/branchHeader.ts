// TODO: replace with content from ref data receipt template API once available
export const branchHeader = `<div>
    <table width=100%>
        <tbody>
            <tr>
                <td colspan="2" style="text-align: center;">
                    <p>{{{branchHeader.companyName}}}</p>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="text-transform: uppercase; text-align: center;">
                    <p>{{{branchHeader.certOfPosting}}}</p>
                </td>
            </tr>
            <tr>
                <td colspan="2" height="24"></td>
            </tr>
            <tr>
                <td style="text-align: left;">
                    <p>{{branchName}} {{{branchHeader.branchNamePostFix}}}</p>
                </td>
            </tr>
            <tr>
                <td style="text-align: left;">{{branchPostcode}}</td>
                <td style="text-align: right;">{{{branchHeader.branch}}} {{branchID}}</td>
            </tr>
            <tr>
                <td colspan="2" height="12"></td>
            </tr>
        </tbody>
    </table>
</div>`;
