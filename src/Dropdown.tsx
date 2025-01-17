import React, { useEffect, useContext, useRef } from 'react'
import classNames from 'classnames'
import { ThemeContext } from './context/ThemeContext'
import Transition from './Transition'
import FocusLock from 'react-focus-lock'

export interface DropdownProps extends React.HTMLAttributes<HTMLUListElement> {
  /**
   * Function executed when the dropdown is closed
   */
  onClose: () => void
  /**
   * Defines if the dropdown is open
   */
  isOpen: boolean
  /**
   * Defines the alignement of the dropdown related to its parent
   */
  align?: 'left' | 'right'
}

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(function Dropdown(props, ref) {
  const { children, onClose, isOpen, className, align = 'left', ...other } = props
  const {
    theme: { dropdown },
  } = useContext(ThemeContext)

  const baseStyle = dropdown.base
  const alignStyle = dropdown.align[align]

  const dropdownRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Esc' || e.key === 'Escape') {
        onClose()
      }
    }
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const options = { capture: true }
    document.addEventListener('click', handleClickOutside, options)
    document.addEventListener('keydown', handleEsc, options)
    return () => {
      document.removeEventListener('click', handleClickOutside, options)
      document.removeEventListener('keydown', handleEsc, options)
    }
  }, [isOpen, onClose])

  const cls = classNames(baseStyle, alignStyle, className)

  return (
    <Transition
      show={isOpen}
      leave="transition ease-out duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div ref={ref}>
        <FocusLock returnFocus>
          <ul className={cls} ref={dropdownRef} aria-label="submenu" {...other}>
            {children}
          </ul>
        </FocusLock>
      </div>
    </Transition>
  )
})

export default Dropdown
