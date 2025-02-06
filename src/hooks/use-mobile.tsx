// useIsMobile hook provides a way to manage mobile-related state and effects.
import * as React from "react"

/**
 * MOBILE_BREAKPOINT constant represents the maximum width of a mobile screen.
 * Any screen width below this value is considered a mobile device.
 */
const MOBILE_BREAKPOINT = 768

/**
 * useIsMobile hook is responsible for managing the mobile state of the application.
 * It detects whether the application is being viewed on a mobile device and updates the state accordingly.
 */
export function useIsMobile() {
  /**
   * isMobile state variable stores the current mobile state of the application.
   * It is initially set to undefined and updated based on the screen width.
   */
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  /**
   * useEffect hook is used to detect the screen size and update the isMobile state.
   * It adds an event listener to the window resize event to check the width of the window.
   */
  React.useEffect(() => {
    /**
     * mql (Media Query List) object represents the result of the media query.
     * It is used to check if the screen width is below the MOBILE_BREAKPOINT.
     */
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    /**
     * onChange function is called when the media query result changes.
     * It updates the isMobile state based on the current screen width.
     */
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Add event listener to the media query list
    mql.addEventListener("change", onChange)

    // Initial check
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // Cleanup event listener on component unmount
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Return the current mobile state
  return !!isMobile
}
