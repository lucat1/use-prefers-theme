import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as ReactTest from 'react-test-renderer'
import { usePrefersTheme } from '../src'

const TestComponent = () => {
  const pref = usePrefersTheme()
  return <div>{pref}</div>
}

describe('it', () => {
  it('renders in a browser', () => {
    const div = document.createElement('div')
    ReactDOM.render(<TestComponent />, div)
    ReactDOM.unmountComponentAtNode(div)

    expect(ReactTest.create(<TestComponent />)).toMatchSnapshot()
  })

  it('renders in a ssr environment', () => {
    ;(window as any) = undefined
    const div = document.createElement('div')
    ReactDOM.render(<TestComponent />, div)
    ReactDOM.unmountComponentAtNode(div)
  })

  it('renders in an old environment', () => {
    delete window.matchMedia
    const div = document.createElement('div')
    ReactDOM.render(<TestComponent />, div)
    ReactDOM.unmountComponentAtNode(div)
  })
})

describe('it renders in browsers and', () => {
  let rendered: ReactTest.ReactTestRenderer
  const mount = jest.fn(),
    unmount = jest.fn()
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: true, // = dark
      media: query,
      onchange: null,
      addEventListener: mount,
      removeEventListener: unmount,
      dispatchEvent: jest.fn()
    }))
  })

  it('returns dark/light value', () => {
    rendered = ReactTest.create(<TestComponent />)
    const json = rendered.toJSON()
    if (json == null) {
      fail('json render is null')
    }

    expect(window.matchMedia).toBeCalled()

    expect(json.children).not.toBeNull()
    expect(json.children).toHaveLength(1)
    const children = json.children as ReactTest.ReactTestRendererNode[]
    expect(children[0]).toMatch('dark')
  })

  it('calls addEventListener', () => {
    expect(mount).toBeCalled()
  })

  it('calls removeEventListener', () => {
    rendered.unmount()
    expect(window.matchMedia('').removeEventListener).toBeCalled()
  })
})
