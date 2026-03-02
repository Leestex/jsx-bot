import JSXBot from '../index'

describe('JSXBot (JSX pragma)', () => {
  it('calls the component function with params and children', () => {
    const mockComponent = jest.fn((params, children) => ({ params, children }))
    const result = JSXBot(mockComponent, { foo: 'bar' }, 'child1', 'child2')

    expect(mockComponent).toHaveBeenCalledWith({ foo: 'bar' }, ['child1', 'child2'])
    expect(result).toEqual({ params: { foo: 'bar' }, children: ['child1', 'child2'] })
  })

  it('passes an empty array when there are no children', () => {
    const mockComponent = jest.fn((params, children) => ({ params, children }))
    const result = JSXBot(mockComponent, { x: 1 })

    expect(mockComponent).toHaveBeenCalledWith({ x: 1 }, [])
    expect(result).toEqual({ params: { x: 1 }, children: [] })
  })

  it('passes null params when no props are given', () => {
    const mockComponent = jest.fn((params, children) => ({ params, children }))
    JSXBot(mockComponent, null, 'child')

    expect(mockComponent).toHaveBeenCalledWith(null, ['child'])
  })
})
