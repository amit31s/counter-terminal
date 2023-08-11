import { useCallback, useEffect, useState } from "react";
import { Keyboard, KeyboardEventListener } from "react-native";

export default function useKeyboardAvoider() {
  const [keyboardPadding, setKeyboardPadding] = useState(0);

  const handleKeyboardDidShow: KeyboardEventListener = useCallback((e) => {
    // 180 here represents roughly the space taken up by the bottom buttons
    setKeyboardPadding(e.endCoordinates.height - 180);
  }, []);

  const handleKeyboardDidHide: KeyboardEventListener = useCallback(() => {
    setKeyboardPadding(0);
  }, []);

  useEffect(() => {
    const showListener = Keyboard.addListener("keyboardWillShow", handleKeyboardDidShow);
    const hideListener = Keyboard.addListener("keyboardWillHide", handleKeyboardDidHide);

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [handleKeyboardDidHide, handleKeyboardDidShow]);

  return {
    keyboardPadding,
  };
}
