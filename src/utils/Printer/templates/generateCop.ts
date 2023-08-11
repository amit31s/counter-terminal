import Handlebars from "handlebars";
import { ICOP } from "../../../interfaces/cop.interface";
import { branchHeader } from "./branchHeader";
import { footer } from "./footer";
import { serviceItems } from "./serviceItems";
import { session } from "./session";

const generateCop = (params: ICOP): string => {
  Handlebars.registerHelper("addPadding", function (this: Record<string, unknown>) {
    return Object.keys(this).length !== 2;
  });

  Handlebars.registerHelper("isDefined", function (value) {
    return value !== undefined;
  });

  Handlebars.registerHelper("compareStrings", function (this: unknown, args1, args2, options) {
    return args1 === args2 ? options.fn(this) : options.inverse(this);
  });

  const template = Handlebars.compile(
    `<html>
    <body style="font-family: arial;">
` +
      branchHeader +
      session +
      serviceItems +
      footer +
      `
    </body>
</html>`,
  );
  return template(params);
};

export { generateCop, branchHeader, session, serviceItems, footer };
