import {
  SlackMessage, Section, Divider, Image, Actions,
  SlackButton, Header, Context, Mrkdwn,
} from '../index'

describe('Slack SlackMessage component', () => {
  it('creates message with channel, text, and blocks', () => {
    const result = SlackMessage(
      { channel: '#general', text: 'Fallback text' },
      [Section(null, ['Hello'])],
    )
    expect(result.channel).toBe('#general')
    expect(result.text).toBe('Fallback text')
    expect(result.blocks).toHaveLength(1)
  })

  it('defaults text to empty string when not provided', () => {
    const result = SlackMessage({ channel: '#general' }, [])
    expect(result.text).toBe('')
  })
})

describe('Slack Section component', () => {
  it('creates section block with markdown text', () => {
    const result = Section(null, ['*Bold* text'])
    expect(result).toEqual({
      type: 'section',
      text: { type: 'mrkdwn', text: '*Bold* text' },
    })
  })

  it('joins multiple children', () => {
    const result = Section(null, ['Hello', ' ', 'World'])
    expect(result.text.text).toBe('Hello World')
  })

  it('includes accessory when provided', () => {
    const accessory = { type: 'image', image_url: 'http://img.png', alt_text: 'img' }
    const result = Section({ accessory }, ['Text'])
    expect(result.accessory).toEqual(accessory)
  })
})

describe('Slack Divider component', () => {
  it('creates divider block', () => {
    const result = Divider()
    expect(result).toEqual({ type: 'divider' })
  })
})

describe('Slack Image component', () => {
  it('creates image block with url and altText', () => {
    const result = Image({ url: 'http://img.png', altText: 'An image' })
    expect(result).toEqual({
      type: 'image',
      image_url: 'http://img.png',
      alt_text: 'An image',
    })
  })

  it('defaults alt_text to empty string', () => {
    const result = Image({ url: 'http://img.png' })
    expect(result.alt_text).toBe('')
  })

  it('includes title when provided', () => {
    const result = Image({ url: 'http://img.png', altText: 'img', title: 'My Image' })
    expect(result.title).toEqual({ type: 'plain_text', text: 'My Image' })
  })
})

describe('Slack Actions component', () => {
  it('creates actions block with element children', () => {
    const buttons = [
      SlackButton({ actionId: 'btn1' }, ['Click']),
    ]
    const result = Actions(null, buttons)
    expect(result).toEqual({
      type: 'actions',
      elements: [
        { type: 'button', text: { type: 'plain_text', text: 'Click' }, action_id: 'btn1' },
      ],
    })
  })
})

describe('Slack SlackButton component', () => {
  it('creates button with action_id and text', () => {
    const result = SlackButton({ actionId: 'approve' }, ['Approve'])
    expect(result).toEqual({
      type: 'button',
      text: { type: 'plain_text', text: 'Approve' },
      action_id: 'approve',
    })
  })

  it('includes value when provided', () => {
    const result = SlackButton({ actionId: 'a', value: 'v1' }, ['Go'])
    expect(result.value).toBe('v1')
  })

  it('includes style when provided', () => {
    const result = SlackButton({ actionId: 'a', style: 'primary' }, ['Go'])
    expect(result.style).toBe('primary')
  })

  it('includes url when provided', () => {
    const result = SlackButton({ actionId: 'a', url: 'http://example.com' }, ['Visit'])
    expect(result.url).toBe('http://example.com')
  })
})

describe('Slack Header component', () => {
  it('creates header block with plain text', () => {
    const result = Header(null, ['Order #1234'])
    expect(result).toEqual({
      type: 'header',
      text: { type: 'plain_text', text: 'Order #1234' },
    })
  })
})

describe('Slack Context component', () => {
  it('creates context block with element children', () => {
    const elements = [Mrkdwn(null, ['Last updated: today'])]
    const result = Context(null, elements)
    expect(result).toEqual({
      type: 'context',
      elements: [{ type: 'mrkdwn', text: 'Last updated: today' }],
    })
  })
})

describe('Slack Mrkdwn component', () => {
  it('creates mrkdwn text element', () => {
    const result = Mrkdwn(null, ['*bold* _italic_'])
    expect(result).toEqual({ type: 'mrkdwn', text: '*bold* _italic_' })
  })
})

describe('SlackMessage static references', () => {
  it('has all sub-components attached', () => {
    expect(SlackMessage.Section).toBe(Section)
    expect(SlackMessage.Divider).toBe(Divider)
    expect(SlackMessage.Image).toBe(Image)
    expect(SlackMessage.Actions).toBe(Actions)
    expect(SlackMessage.Button).toBe(SlackButton)
    expect(SlackMessage.Header).toBe(Header)
    expect(SlackMessage.Context).toBe(Context)
    expect(SlackMessage.Mrkdwn).toBe(Mrkdwn)
  })
})

describe('Integration: full Slack message', () => {
  it('produces correct Block Kit structure', () => {
    const result = SlackMessage(
      { channel: '#general', text: 'New order received' },
      [
        Header(null, ['Order #1234']),
        Section(null, ['*Customer:* John Doe\n*Total:* $49.99']),
        Divider(),
        Actions(null, [
          SlackButton({ actionId: 'approve', style: 'primary' }, ['Approve']),
          SlackButton({ actionId: 'reject', style: 'danger' }, ['Reject']),
        ]),
      ],
    )

    expect(result).toEqual({
      channel: '#general',
      text: 'New order received',
      blocks: [
        { type: 'header', text: { type: 'plain_text', text: 'Order #1234' } },
        { type: 'section', text: { type: 'mrkdwn', text: '*Customer:* John Doe\n*Total:* $49.99' } },
        { type: 'divider' },
        {
          type: 'actions',
          elements: [
            {
              type: 'button', text: { type: 'plain_text', text: 'Approve' }, action_id: 'approve', style: 'primary',
            },
            {
              type: 'button', text: { type: 'plain_text', text: 'Reject' }, action_id: 'reject', style: 'danger',
            },
          ],
        },
      ],
    })
  })
})
