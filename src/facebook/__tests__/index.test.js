import {
  Message, Text, Attachment, QuickReply, MetaData,
  Button, ButtonTemplate, GenericTemplate, Element, SenderAction,
} from '../index'

describe('Facebook Message component', () => {
  it('wraps recipient as { id: value }', () => {
    const result = Message(
      { recipient: '12345', notification: 'REGULAR' },
      [Text(null, ['Hello'])],
    )
    expect(result.recipient).toEqual({ id: '12345' })
  })

  it('sets notification_type', () => {
    const result = Message(
      { recipient: '12345', notification: 'SILENT_PUSH' },
      [Text(null, ['Hi'])],
    )
    expect(result.notification_type).toBe('SILENT_PUSH')
  })

  it('merges multiple children into message object', () => {
    const result = Message(
      { recipient: '1', notification: 'REGULAR' },
      [
        Text(null, ['Hello']),
        QuickReply({ payload: 'CMD' }, ['Menu']),
      ],
    )
    expect(result.message.text).toBe('Hello')
    expect(result.message.quick_replies).toHaveLength(1)
    expect(result.message.quick_replies[0].title).toBe('Menu')
  })

  it('concatenates quick_replies arrays from multiple QuickReply children', () => {
    const result = Message(
      { recipient: '1', notification: 'REGULAR' },
      [
        QuickReply({ payload: 'A' }, ['Option A']),
        QuickReply({ payload: 'B' }, ['Option B']),
        QuickReply({ payload: 'C' }, ['Option C']),
      ],
    )
    expect(result.message.quick_replies).toHaveLength(3)
    expect(result.message.quick_replies[0].title).toBe('Option A')
    expect(result.message.quick_replies[1].title).toBe('Option B')
    expect(result.message.quick_replies[2].title).toBe('Option C')
  })
})

describe('Facebook Text component', () => {
  it('joins children into a text string', () => {
    const result = Text(null, ['Hello', ' ', 'World'])
    expect(result).toEqual({ text: 'Hello World' })
  })

  it('handles single child', () => {
    const result = Text(null, ['Hello'])
    expect(result).toEqual({ text: 'Hello' })
  })
})

describe('Facebook Attachment component', () => {
  it('creates url-based attachment', () => {
    const result = Attachment({ type: 'image', payload: 'http://img.png' })
    expect(result).toEqual({
      attachment: {
        type: 'image',
        payload: { url: 'http://img.png' },
      },
    })
  })

  it('creates attachment_id-based attachment', () => {
    const result = Attachment({ type: 'image', attachmentId: '999' })
    expect(result).toEqual({
      attachment: {
        type: 'image',
        payload: { attachment_id: '999' },
      },
    })
  })

  it('throws when type is missing', () => {
    expect(() => Attachment({ payload: 'http://img.png' })).toThrow('Attachment requires a "type" prop')
  })
})

describe('Facebook QuickReply component', () => {
  it('joins children for title', () => {
    const result = QuickReply({ payload: 'X' }, ['Show ', 'menu'])
    expect(result.quick_replies[0].title).toBe('Show menu')
  })

  it('uses default content_type of text', () => {
    const result = QuickReply({ payload: 'X' }, ['Go'])
    expect(result.quick_replies[0].content_type).toBe('text')
  })

  it('supports custom contentType', () => {
    const result = QuickReply({ payload: 'X', contentType: 'location' }, ['Share location'])
    expect(result.quick_replies[0].content_type).toBe('location')
  })

  it('includes payload', () => {
    const result = QuickReply({ payload: 'CMD_START' }, ['Start'])
    expect(result.quick_replies[0].payload).toBe('CMD_START')
  })
})

describe('Facebook MetaData component', () => {
  it('extracts first child as metadata', () => {
    const result = MetaData(null, ['some-meta'])
    expect(result).toEqual({ metadata: 'some-meta' })
  })
})

describe('Facebook Button component', () => {
  it('creates a web_url button', () => {
    const result = Button({ type: 'web_url', url: 'http://example.com', title: 'Visit' })
    expect(result).toEqual({ type: 'web_url', title: 'Visit', url: 'http://example.com' })
  })

  it('creates a postback button', () => {
    const result = Button({ type: 'postback', payload: 'CMD_HELP', title: 'Help' })
    expect(result).toEqual({ type: 'postback', title: 'Help', payload: 'CMD_HELP' })
  })
})

describe('Facebook ButtonTemplate component', () => {
  it('creates button template with text and buttons', () => {
    const buttons = [
      Button({ type: 'web_url', url: 'http://example.com', title: 'Visit' }),
      Button({ type: 'postback', payload: 'CMD_HELP', title: 'Help' }),
    ]
    const result = ButtonTemplate({ text: 'What do you want to do?' }, buttons)
    expect(result).toEqual({
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: 'What do you want to do?',
          buttons: [
            { type: 'web_url', title: 'Visit', url: 'http://example.com' },
            { type: 'postback', title: 'Help', payload: 'CMD_HELP' },
          ],
        },
      },
    })
  })
})

describe('Facebook GenericTemplate component', () => {
  it('creates generic template with element children', () => {
    const elements = [
      Element({ title: 'Product A', subtitle: '$29.99', imageUrl: 'http://img.png' }, []),
    ]
    const result = GenericTemplate(null, elements)
    expect(result).toEqual({
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [{ title: 'Product A', subtitle: '$29.99', image_url: 'http://img.png' }],
        },
      },
    })
  })
})

describe('Facebook Element component', () => {
  it('creates an element with title, subtitle, and imageUrl', () => {
    const result = Element({ title: 'Item', subtitle: 'Description', imageUrl: 'http://img.png' }, [])
    expect(result).toEqual({ title: 'Item', subtitle: 'Description', image_url: 'http://img.png' })
  })

  it('includes buttons when children are present', () => {
    const buttons = [Button({ type: 'postback', payload: 'BUY', title: 'Buy' })]
    const result = Element({ title: 'Item', subtitle: 'Desc' }, buttons)
    expect(result.buttons).toEqual([{ type: 'postback', title: 'Buy', payload: 'BUY' }])
  })

  it('omits image_url when not provided', () => {
    const result = Element({ title: 'Item', subtitle: 'Desc' }, [])
    expect(result.image_url).toBeUndefined()
  })
})

describe('Facebook SenderAction component', () => {
  it('creates typing_on action', () => {
    const result = SenderAction({ recipient: '12345', action: 'typing_on' })
    expect(result).toEqual({ recipient: { id: '12345' }, sender_action: 'typing_on' })
  })

  it('creates mark_seen action', () => {
    const result = SenderAction({ recipient: '12345', action: 'mark_seen' })
    expect(result).toEqual({ recipient: { id: '12345' }, sender_action: 'mark_seen' })
  })
})

describe('Message static references', () => {
  it('has all sub-components attached', () => {
    expect(Message.Text).toBe(Text)
    expect(Message.Attachment).toBe(Attachment)
    expect(Message.QuickReply).toBe(QuickReply)
    expect(Message.MetaData).toBe(MetaData)
    expect(Message.Button).toBe(Button)
    expect(Message.ButtonTemplate).toBe(ButtonTemplate)
    expect(Message.GenericTemplate).toBe(GenericTemplate)
    expect(Message.Element).toBe(Element)
    expect(Message.SenderAction).toBe(SenderAction)
  })
})

describe('Integration: full message', () => {
  it('produces correct structure with text, attachment, and quick replies', () => {
    const result = Message(
      { recipient: '1905720572', notification: 'SILENT_PUSH' },
      [
        Text(null, ['Hello, Nazar!']),
        Attachment({ type: 'image', payload: 'http://imagehosting.com/welcome.jpg' }),
        QuickReply({ payload: 'CMD_START' }, ['Show menu']),
        QuickReply({ payload: 'CMD_LANG' }, ['Change language']),
        QuickReply({ payload: 'CMD_AUTH' }, ['Authorize']),
      ],
    )

    expect(result).toEqual({
      recipient: { id: '1905720572' },
      notification_type: 'SILENT_PUSH',
      message: {
        text: 'Hello, Nazar!',
        attachment: {
          type: 'image',
          payload: { url: 'http://imagehosting.com/welcome.jpg' },
        },
        quick_replies: [
          { content_type: 'text', title: 'Show menu', payload: 'CMD_START' },
          { content_type: 'text', title: 'Change language', payload: 'CMD_LANG' },
          { content_type: 'text', title: 'Authorize', payload: 'CMD_AUTH' },
        ],
      },
    })
  })
})
