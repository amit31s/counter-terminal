export const serviceItems = `<div>
    <table>
        <tbody>
        {{#each services}}
            <tr>
                <td style="text-align: center;" colspan="3">
                    <p>{{name}}</p>
                </td>
            </tr>
            {{#each lineItems}}
            {{#if trackingRef}}
            <tr>
                <td style="text-align: center;" colspan="3">{{#compareStrings constants.language "cy"}}{{constants.cy.serviceItem.reference}}{{else}}{{constants.en.serviceItem.reference}}{{/compareStrings}} <strong>{{trackingRef}}</strong></td>
            </tr>
            {{/if}}
            {{#if address}}
            <tr height=14></tr>
            <tr>
                <td colspan="3">{{#compareStrings constants.language "cy"}}{{constants.cy.serviceItem.address}}{{else}}{{constants.en.serviceItem.address}}{{/compareStrings}} {{address}}</td>
            </tr>
            {{/if}}
            {{#if (isDefined addressValidated)}}
            <tr>
            <td width="50%">{{#compareStrings constants.language "cy"}}{{constants.cy.serviceItem.addressValidated}}{{else}}{{constants.en.serviceItem.addressValidated}}{{/compareStrings}}</td><td></td>
            <td width="50%" style="text-align: right;">{{#if addressValidated}}Y{{else}}N{{/if}}</td>
            {{/if}}
            </tr>
            {{#if itemValue}}
            <tr>
                <td>{{#compareStrings constants.language "cy"}}{{constants.cy.serviceItem.itemValue}}{{else}}{{constants.en.serviceItem.itemValue}}{{/compareStrings}}</td>
                <td>£{{itemValue}}</td>
                <td width="33%"></td>
            </tr>
            {{/if}}
            {{#if maxComp}}
            <tr>
                <td>{{#compareStrings constants.language "cy"}}{{constants.cy.serviceItem.maximumComp}}{{else}}{{constants.en.serviceItem.maximumComp}}{{/compareStrings}}</td>
                <td>£{{maxComp}}</td>
                <td width="33%"style="text-align: right;">£{{maxCompPrice}}</td>
            </tr>
            {{/if}}
            {{#if consqLoss}}
            <tr>
                <td>{{#compareStrings constants.language "cy"}}{{{constants.cy.serviceItem.consqLoss}}}{{else}}{{{constants.en.serviceItem.consqLoss}}}{{/compareStrings}}</td>
                <td>£{{consqLoss}}</td>
                <td width="33%" style="text-align: right;">£{{consqLossPrice}}</td>
            </tr>
            {{/if}}
            {{#if weight}}
            <tr>
                <td width="50%">{{#compareStrings constants.language "cy"}}{{{constants.cy.serviceItem.weightTitle}}}{{else}}{{{constants.en.serviceItem.weightTitle}}}{{/compareStrings}} {{weight}}g</td><td></td>
                {{#if price}}
                <td width="50%" style="text-align: right;">{{#compareStrings constants.language "cy"}}{{{constants.cy.serviceItem.pricePaid}}}{{else}}{{{constants.en.serviceItem.pricePaid}}}{{/compareStrings}} £{{price}}</td>
                {{/if}}
            </tr>
            {{/if}}
            {{#if prePaid}}
            <tr>
                <td width="50%">{{#compareStrings constants.language "cy"}}{{{constants.cy.serviceItem.prePaid}}}{{else}}{{{constants.en.serviceItem.prePaid}}}{{/compareStrings}}</td><td></td>
                <td width="50%" style="text-align: right;">-£{{prePaid}}</td>
            </tr>
            {{/if}}
            {{#if customFields}}
                {{#each customFields}}
                <tr>
                    <td colspan="2">{{key}}:</td>
                    <td style="text-align: right;">{{value}}</td>
                </tr>
                {{/each}}
            {{/if}}
            {{#if (addPadding this)}}
            <tr height=24></tr>
            {{/if}}
            {{/each}}
            <tr>
                <td colspan="3" style="text-align: center;">
                    {{{footer}}}
                </td>
            </tr>
            <tr>
                <td colspan="3">
                    <hr style="border: 1px dashed #000; width: 100%; margin: auto; margin-top: 5%; margin-bottom: 5%;">
                </td>
            </tr>
            {{/each}}
        </tbody>
    </table>
</div>
`;
