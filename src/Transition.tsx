/**
 * https://gist.github.com/adamwathan/e0a791aa0419098a7ece70028b2e641e
 */
import React, { useContext, useEffect, useRef } from 'react'
import { CSSTransition as ReactCSSTransition } from 'react-transition-group'
import type { CSSTransitionProps } from 'react-transition-group/CSSTransition'

interface TransitionContext {
  parent: {
    appear?: string | undefined
    show?: boolean | undefined
    isInitialRender?: boolean
  }
}
const transitionContext = React.createContext<TransitionContext>({
  parent: {},
})

function useIsInitialRender() {
  const isInitialRender = useRef(true)
  useEffect(() => {
    isInitialRender.current = false
  }, [])
  return isInitialRender.current
}

interface TransitionProps {
  children?: React.ReactNode | undefined
  show?: boolean | undefined
  enter?: string | undefined
  enterFrom?: string | undefined
  enterTo?: string | undefined
  leave?: string | undefined
  leaveFrom?: string | undefined
  leaveTo?: string | undefined
  appear?: string | undefined
}

const CSSTransition: React.FC<TransitionProps> = function CSSTransition({
  show,
  enter = '',
  enterFrom = '',
  enterTo = '',
  leave = '',
  leaveFrom = '',
  leaveTo = '',
  appear,
  children,
}) {
  const enterClasses = enter.split(' ').filter((s) => s.length)
  const enterFromClasses = enterFrom.split(' ').filter((s) => s.length)
  const enterToClasses = enterTo.split(' ').filter((s) => s.length)
  const leaveClasses = leave.split(' ').filter((s) => s.length)
  const leaveFromClasses = leaveFrom.split(' ').filter((s) => s.length)
  const leaveToClasses = leaveTo.split(' ').filter((s) => s.length)

  function addClasses(node: HTMLElement, classes: string[]) {
    classes.length && node.classList.add(...classes)
  }

  function removeClasses(node: HTMLElement, classes: string[]) {
    classes.length && node.classList.remove(...classes)
  }

  const transitionProps: CSSTransitionProps = {
    appear,
    addEndListener: (node, done) => {
      node.addEventListener('transitionend', done, false)
    },
    onEnter: (node) => {
      addClasses(node, [...enterClasses, ...enterFromClasses])
    },
    onEntering: (node) => {
      removeClasses(node, enterFromClasses)
      addClasses(node, enterToClasses)
    },
    onEntered: (node) => {
      removeClasses(node, [...enterToClasses, ...enterClasses])
    },
    onExit: (node) => {
      addClasses(node, [...leaveClasses, ...leaveFromClasses])
    },
    onExiting: (node) => {
      removeClasses(node, leaveFromClasses)
      addClasses(node, leaveToClasses)
    },
    onExited: (node) => {
      removeClasses(node, [...leaveToClasses, ...leaveClasses])
    },
  }
  if (show !== undefined) {
    transitionProps.in = show
  }
  return (
    <ReactCSSTransition {...transitionProps} unmountOnExit>
      {children}
    </ReactCSSTransition>
  )
}

const Transition: React.FC<TransitionProps> = function Transition({ show, appear, ...rest }) {
  const { parent } = useContext(transitionContext)
  const isInitialRender = useIsInitialRender()
  const isChild = show === undefined

  if (isChild) {
    return <CSSTransition appear={parent.appear} show={parent.show} {...rest} />
  } else
    return (
      <transitionContext.Provider
        value={{
          parent: {
            show,
            isInitialRender,
            appear,
          },
        }}
      >
        <CSSTransition appear={appear} show={show} {...rest} />
      </transitionContext.Provider>
    )
}

export default Transition
