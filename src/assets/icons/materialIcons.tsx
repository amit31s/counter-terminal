import { COLOR_CONSTANTS } from "@ct/constants";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DialpadIcon from "@mui/icons-material/Dialpad";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import HomeIcon from "@mui/icons-material/Home";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LoopIcon from "@mui/icons-material/Loop";
import NetworkWifiIcon from "@mui/icons-material/NetworkWifi";
import NorthIcon from "@mui/icons-material/North";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import SmsFailedOutlinedIcon from "@mui/icons-material/SmsFailedOutlined";
import SouthIcon from "@mui/icons-material/South";
import WarningIcon from "@mui/icons-material/Warning";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { styled } from "@mui/material/styles";

const {
  defaultBlue,
  white,
  emptyBasketColor,
  alertYellow,
  errorRed,
  deleteIcon,
  link,
  printIconGrey,
  disabledGray,
  green,
} = COLOR_CONSTANTS.iconColors;
const { errorButtonColor, btnPrimaryColor, secondaryTextColour } = COLOR_CONSTANTS;

enum IconSizes {
  XXXLARGE = "xxxLarge",
  XXLARGE = "xxLarge",
  XLARGE = "xLarge",
  LARGE = "large",
  MEDIUM = "medium",
  SMALL = "small",
  XSMALL = "xSmall",
  XXSMALL = "xxSmall",
}

const iconSizes: { [key in IconSizes]: number } = {
  xxxLarge: 120,
  xxLarge: 80,
  xLarge: 72,
  large: 62,
  medium: 50,
  small: 40,
  xSmall: 32,
  xxSmall: 24,
};

const getIconWidthAndHeight = (size: number) => `width:${size}px;height:${size}px`;

export const iconMaker = (
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  },
  size: number,
  color = defaultBlue as string,
) =>
  styled(icon)`
    color: ${color};
    ${getIconWidthAndHeight(size)}
  `;

// Reusable Modal Printer Icons
export const StyledErrorPrintOutlinedIcon = () => {
  return (
    <PrintOutlinedIcon
      sx={{
        width: iconSizes.xxLarge,
        height: iconSizes.xxLarge,
        color: errorButtonColor,
      }}
    />
  );
};

export const StyledDefaultPrintOutlinedIcon = () => {
  return (
    <PrintOutlinedIcon
      sx={{
        width: iconSizes.xxLarge,
        height: iconSizes.xxLarge,
        color: defaultBlue,
      }}
    />
  );
};

export const StyledDefaultWarningAmberIcon = () => {
  return (
    <WarningAmberIcon
      sx={{
        width: iconSizes.xxLarge,
        height: iconSizes.xxLarge,
      }}
    />
  );
};

export const StyledErrorWarningAmberIcon = () => {
  return (
    <WarningAmberIcon
      sx={{
        width: iconSizes.xxLarge,
        height: iconSizes.xxLarge,
        color: errorRed,
      }}
    />
  );
};
export const StyledNetworkWifiIcon = () => {
  return (
    <NetworkWifiIcon
      sx={{
        width: iconSizes.xxLarge,
        height: iconSizes.xxLarge,
        color: green,
      }}
    />
  );
};

export const StyledOtherPrintOutlinedIcon = iconMaker(
  PrintOutlinedIcon,
  iconSizes.xxLarge,
  printIconGrey,
);
export const StyledLinkPrintOutlinedIcon = iconMaker(PrintOutlinedIcon, iconSizes.xxLarge, link);

// Modal Warning Icons
export const StyledErrorInfoOutlinedIcon = iconMaker(InfoOutlinedIcon, iconSizes.xxLarge, errorRed);
export const StyledWarningIcon = iconMaker(WarningIcon, iconSizes.xSmall, alertYellow);

// LoadingSpinner Icon
export const StyledUtilityLoopIcon = iconMaker(LoopIcon, iconSizes.xxLarge, link);

// Basket Icon
export const StyledShoppingBasketIcon = iconMaker(
  ShoppingBasketOutlinedIcon,
  iconSizes.xLarge,
  emptyBasketColor,
);

// Header Icons
export const StyledHomeIcon = iconMaker(HomeIcon, iconSizes.medium, white);
export const StyledArrowBackIcon = iconMaker(ArrowBackIcon, iconSizes.medium, white);
export const StyledCloseIcon = iconMaker(CloseIcon, iconSizes.xSmall);

// Pagination, Up Down Icons - Receipt Screen
export const StyledExpandLessOutlinedIcon = iconMaker(
  ExpandLessOutlinedIcon,
  iconSizes.xxSmall,
  defaultBlue,
);
export const StyledExpandMoreOutlinedIcon = iconMaker(
  ExpandMoreOutlinedIcon,
  iconSizes.xxSmall,
  defaultBlue,
);
export const StyledChevronLeftOutlinedIcon = iconMaker(
  ChevronLeftOutlinedIcon,
  iconSizes.xxSmall,
  defaultBlue,
);
export const StyledChevronRightOutlinedIcon = iconMaker(
  ChevronRightOutlinedIcon,
  iconSizes.xxSmall,
  defaultBlue,
);

// TBC - Cant Find Search Icons in CT
export const StyledDefaultSearchOutlinedIcon = iconMaker(
  SearchOutlinedIcon,
  iconSizes.xSmall,
  COLOR_CONSTANTS.inputColors.text,
);
export const StyledDisabledSearchOutlinedIcon = iconMaker(
  SearchOutlinedIcon,
  iconSizes.xSmall,
  COLOR_CONSTANTS.inputColors.disabled.main,
);

// Pouch Acceptance List Items
export const StyledDeleteIcon = iconMaker(DeleteIcon, iconSizes.xSmall, deleteIcon);
export const StyledSmsFailedOutlinedIcon = iconMaker(
  SmsFailedOutlinedIcon,
  iconSizes.xxLarge,
  errorRed,
);

// Pin Pad Directional Icons
export const StyledDefaultNorthIcon = iconMaker(NorthIcon, iconSizes.small);
export const StyledDisabledNorthIcon = iconMaker(
  NorthIcon,
  iconSizes.small,
  COLOR_CONSTANTS.buttonColors.disabled.whiteText,
);
export const StyledDefaultSouthIcon = iconMaker(SouthIcon, iconSizes.small);
export const StyledDisabledSouthIcon = iconMaker(
  SouthIcon,
  iconSizes.small,
  COLOR_CONSTANTS.buttonColors.disabled.whiteText,
);
export const StyledBackspaceOutlinedIcon = iconMaker(BackspaceOutlinedIcon, iconSizes.xxSmall);

// Custom Modal Icons
export const StyledCustomModalCloseIcon = iconMaker(CloseIcon, iconSizes.xxSmall, btnPrimaryColor);

//Transaction Complete Icon
export const StyledTransactionCompletedIcon = iconMaker(
  CheckCircleIcon,
  iconSizes.xxxLarge,
  btnPrimaryColor,
);

//JourneyRenderer Close Icon
export const StyledCancelIcon = iconMaker(CloseIcon, iconSizes.xSmall, secondaryTextColour);

// Quantity Modal Icons
export const StyledMinusDisabledIcon = iconMaker(
  RemoveCircleOutlineIcon,
  iconSizes.large,
  disabledGray,
);
export const StyledMinusIcon = iconMaker(RemoveCircleOutlineIcon, iconSizes.large);

export const StyledPlusDisabledIcon = iconMaker(
  AddCircleOutlineIcon,
  iconSizes.large,
  disabledGray,
);
export const StyledPlusIcon = iconMaker(AddCircleOutlineIcon, iconSizes.large);

// NumPad Icon
export const StyledNumpadIcon = iconMaker(DialpadIcon, iconSizes.xSmall);
