// TODO: replace with content from ref data receipt template API once available
export const session = `<div style="text-align: center;">
    <table width=100%>
        <tbody>
            <tr>
                <td style="text-align: left;">{{date}}</td>
                <td style="text-align: right;">{{{sess.sessionTitle}}} {{session}}</td>
            </tr>
            {{#if repDespatch}}
            <tr>
                <td colspan="2">
                    <p>{{#if afterLastDispatch}}{{{sess.after}}}{{else}}{{{sess.before}}}{{/if}} {{{sess.acceptanceTime}}}</p>
                </td>
            </tr>
            {{/if}}
            <tr height="12">
            </tr>
        </tbody>
    </table>
</div>`;
